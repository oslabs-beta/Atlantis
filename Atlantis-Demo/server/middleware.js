const { graphql, visit, parse, BREAK } = require('graphql');
const redis = require('redis')
const middleware = {}

const schema = require('./schema/schema')

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

middleware.parsingAlgo = (req, res, next) => {
  console.log(req.params.query);
  const AST= parse(req.params.query);
  const { proto, protoArgs, operationType } = middleware.parseAST(AST);
  console.log(proto);
  console.log(protoArgs, 'protoargs is');

  let querymade = middleware.ProtoQueryString(proto, protoArgs);
  console.log('after PQS');
  if (operationType == 'mutation') {
    querymade = 'mutation' + querymade;
    res.locals.ismutation = true;
  }
  console.log('proto to query', querymade);
  res.locals.querymade = querymade;
  next();
}

middleware.parseAST = (AST) => {
  let isQuellable;
  // initialize prototype as empty object
  const proto = {};
  //let isQuellable = true;

  let operationType;

  // initialiaze arguments as null
  let protoArgs = null; 

  // initialize stack to keep track of depth first parsing
  const stack = [];

  /**
   * visit is a utility provided in the graphql-JS library. It performs a
   * depth-first traversal of the abstract syntax tree, invoking a callback
   * when each SelectionSet node is entered. That function builds the prototype.
   * Invokes a callback when entering and leaving Field node to keep track of nodes with stack
   *
   * Find documentation at:
   * https://graphql.org/graphql-js/language/#visit
   */
  visit(AST, {
    enter(node) {
      if (node.directives) {
        if (node.directives.length > 0) {
          isQuellable = false;
          return BREAK;
        }
      }
    },
    OperationDefinition(node) {
      operationType = node.operation;
      if (node.operation === 'subscription') {
        operationType = 'unQuellable';
        return BREAK;
      }
    },
    Field: {
      enter(node) {
        if (node.alias) {
          operationType = 'unQuellable';
          return BREAK;
        }
        if (node.arguments && node.arguments.length > 0) {
          protoArgs = protoArgs || {};
          protoArgs[node.name.value] = {};

          // collect arguments if arguments contain id, otherwise make query unquellable
          // hint: can check for graphQl type ID instead of string 'id'
          for (let i = 0; i < node.arguments.length; i++) {
            const key= node.arguments[i].name.value;
            const value= node.arguments[i].value.value;

            // for queries cache can handle only id as argument
            if (operationType === 'query') {
              if (!key.includes('id')) {
                operationType = 'unQuellable';
                return BREAK;
              }
            }
            protoArgs[node.name.value][key] = value;
          }
        }
        // add value to stack
        stack.push(node.name.value);
      },
      leave(node) {
        // remove value from stack
        stack.pop();
      },
    },
    SelectionSet(node, key, parent, path, ancestors) {
      /* Exclude SelectionSet nodes whose parents' are not of the kind
      * 'Field' to exclude nodes that do not contain information about
      *  queried fields.
      */
      if (parent.kind === 'Field') {
        // console.log(parent, "Parent Field")
        // loop through selections to collect fields
        const tempObject = {};
        for (let field of node.selections) {
          tempObject[field.name.value] = true;
        }

        // loop through stack to get correct path in proto for temp object;
        // mutates original prototype object;
        const protoObj = stack.reduce((prev, curr, index) => {
          return index + 1 === stack.length // if last item in path
            ? (prev[curr] = tempObject) // set value
            : (prev[curr] = prev[curr]); // otherwise, if index exists, keep value
        }, proto);
        protoObj['__typename'] = true;
        // console.log("ProtoObj,,,,,," ,protoObj);
      }
    },
  });

  return { proto, protoArgs, operationType };
};


// PARSE THE PROTO FROM AST INTO A QUERY AGAIN
middleware.ProtoQueryString = (obj, protoArgs) => {
  const argsToQuery = (protoArgs) => {
    let string = '';
    for (let key in protoArgs) {
      for (let innerKey in protoArgs[key]) {
        // accounts for edge case where an Int is passed in as an arguement.
        if (!isNaN(protoArgs[key][innerKey])) {
          string += innerKey + ': ' + protoArgs[key][innerKey] + ' ';
          break;
        }
        string += innerKey + ': ' + '"' + protoArgs[key][innerKey] + '"' + ' ';
      }
    }
    return '(' + string + ')';
  };

  let mainString = '';
  for (let key in obj) {
    if (typeof obj[key] !== 'object') {
      mainString += ' ' + key + ' ';
    } else {
      mainString += ' ' + key + ' ';
      if (protoArgs) {
        if (typeof protoArgs[key] == 'object') {
          const inner = argsToQuery(protoArgs);
          mainString += inner;
        }
      }
      mainString += middleware.ProtoQueryString(obj[key], {});
    }
  }
  return '{' + mainString + '}';
};

// CHECK IF CACHE HOLDS THE DATA
middleware.checkRedis = (req, res, next) => {
  console.log('checking redis')
  if (res.locals.ismutation) return next();
  redisClient.get(res.locals.querymade, (error, values) => {
  if (error) {
    console.log('redis error', error);
    res.send(error);
  }
  if (!values) {
    console.log('query was not a key in redis session');

    return next();
  } else {
    console.log('query was found in cache');
    const redisValues = JSON.parse(`${values}`);
    // console.log('redis Values are', redisValues);
    res.locals.graphQLResponse = redisValues;
    return next();
  }
});
}



// MAKE THE ACTUAL REQUEST
middleware.makeGQLrequest = (req, res, next) => {
  if (res.locals.graphQLResponse) return next();
  console.log('about to make GQL query of ', res.locals.querymade);
  graphql(schema, res.locals.querymade).then((response) => {
  res.locals.graphQLResponse = response.data;
  console.log('graphQL responded with', res.locals.graphQLResponse);
  if (!res.locals.ismutation) {
    const subscriptions = middleware.findAllTypes(response.data);
    console.log('subscribed to ', subscriptions);
    // subscribe the query to mutations of type Subscription
    for (let key in subscriptions) {
      redisClient.get(`${subscriptions[key]}`, (error, values) => {
        if (error) {
          console.log('redis error', error);
          res.send(error);
        }
        // Case where this query is the first to subscribe to this type.
        if (!values) {
          const subs = [res.locals.querymade];
          redisClient.set(subscriptions[key], JSON.stringify(subs));
        } else {
          // Case where other queries are also subscribed to changes of this type.
          const subs = JSON.parse(`${values}`);
          subs.push(res.locals.querymade);
          redisClient.set(subscriptions[key], JSON.stringify(subs));
        }
      });
    }
    redisClient.setex(
      res.locals.querymade,
      600,
      JSON.stringify(res.locals.graphQLResponse)
    );
  } else {
    // mutation was made, need to clear all subscribers.
    middleware.updateRedisAfterMutation(res.locals.graphQLResponse);
  }
  next();
});
}


middleware.findAllTypes = (GQLresponse, subs=[]) => {
  for (let key in GQLresponse) {
    if (Array.isArray(GQLresponse[key])) GQLresponse = { ...GQLresponse };
    if (key == '__typename') {
      subs.push(GQLresponse[key]);
    }
    const type = '__typename';
    if (Array.isArray(GQLresponse[key])) {
      GQLresponse = { ...GQLresponse[key][0] };

      if (GQLresponse.hasOwnProperty(type)) subs.push(GQLresponse[type]);
      subs.concat(middleware.findAllTypes(GQLresponse, subs));
    }
  }
  subs = [...new Set(subs)];
  return subs;
};

middleware.updateRedisAfterMutation = (graphQLResponse) => {
  // get the type of mutation from the first key in GQLresponse
  const mutation = Object.keys(graphQLResponse)[0];
  // get subscribed tables to the mutation from the mutation map
  const subscribedTable = getMutationMap(schema);
  // mutationquery = addUser
  const keyToClear = subscribedTable[mutation];
  // query redis for key to clear
  redisClient.get(`${keyToClear}`, (error, values) => {
    if (error) {
      console.log('redis error', error);
    }
    const queriesToClear = JSON.parse(`${values}`);
    if (queriesToClear) {
      // if queries to clear exists, iterate over queries and delete them from redis.
      for (let i = 0; i < queriesToClear.length; i++) {
        redisClient.del(queriesToClear[i], (err, res) => {
          // delete these later
          if (res === 1) {
            console.log('Deleted successfully');
          } else {
            console.log('Item to be cleared was not found in redis');
          }
        });
      }
    }
    // After array is cleared, delete the subscribed key.
    redisClient.del(`${keyToClear}`, (err, res) => {
      if (res === 1) {
        console.log('Deleted the Subscriber Key successfully');
      } else {
        console.log('Failed to delete the Subscriber Key');
      }
    });
  });
};


middleware.clearCache = (req, res, next) => {
  console.log('in middleware')
  const log = () => {
    console.log('Redis Cache Cleared')
  }
  redisClient.flushall('ASYNC', log)
  return next();
}

module.exports = middleware