import express, { Application, Request, Response, NextFunction } from 'express';
//the extra variables available from express define express types
import path from 'path';
import dotenv from 'dotenv';
import redis from 'redis';
//if curious see package.json, had to install types for some of these dependencies to work with TS
import { graphqlHTTP } from 'express-graphql';
import { graphql, visit, parse, BREAK } from 'graphql';
const morgan = require('morgan');
const schema = require('./schema/schema');
const { atlantis } = require('atlantis-cache');

const { parseDataFromCache } = require('./parseDataFromCache.ts');

dotenv.config();

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

const app: Application = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './views')));

app.use('/atlantis', atlantis(redisClient, schema), (req, res) => {
  return res.status(200).send(res.locals.queryResponse);
});

// app.use(
//   "/atlantis",
//   atlantis(redisClient,schema),
//   (req, res) => {
//     return res
//       .status(200)
//       .send(res.locals.queryResponse)
//   }
// );
// app.use(atlantis(redisClient));

const getMutationMap = (schema: any) => {
  const mutationMap: any = {};
  // get object containing all root mutations defined in the schema
  const mutationTypeFields = schema._mutationType._fields;
  // if queryTypeFields is a function, invoke it to get object with queries
  const mutationsObj =
    typeof mutationTypeFields === 'function'
      ? mutationTypeFields()
      : mutationTypeFields;

  for (const mutation in mutationsObj) {
    // get name of GraphQL type returned by query
    // if ofType --> this is collection, else not collection
    let returnedType;
    if (mutationsObj[mutation].type.ofType) {
      returnedType = [];
      returnedType.push(mutationsObj[mutation].type.ofType.name);
    }
    if (mutationsObj[mutation].type.name) {
      returnedType = mutationsObj[mutation].type.name;
    }
    mutationMap[mutation] = returnedType;
  }
  return mutationMap;
};

const PORT = process.env.PORT || 3000;

////// FIX \\\\\\\\

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

const makeGQLrequest = (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.graphQLResponse) return next();
  console.log('Query to GQL is : ', res.locals.querymade);
  graphql(schema, res.locals.querymade).then((response) => {
    res.locals.graphQLResponse = response.data;
    // console.log("GQL responded with", response);
    if (!res.locals.ismutation) {
      const subscriptions = foundTypes(res.locals.graphQLResponse);
      // subscribe the query to mutations of type subscription
      for (let key in subscriptions) {
        redisClient.get(`${subscriptions[key]}:Publisher`, (error, values) => {
          if (error) {
            console.log('redis error', error);
            res.send(error);
          }
          // Case where this query is the first to subscribe to this type.
          // Create a key, and subscribe the query to that key.
          if (!values) {
            const subs = [res.locals.redisKey, `${res.locals.redisKey}:fields`];
            redisClient.set(
              `${subscriptions[key]}:Publisher`,
              JSON.stringify(subs)
            );
          } else {
            // Case where other queries are also subscribed to changes of this type.
            const subs = JSON.parse(`${values}`);
            subs.push(res.locals.redisKey);
            subs.push(`${res.locals.redisKey}:fields`);
            redisClient.set(
              `${subscriptions[key]}:Publisher`,
              JSON.stringify(subs)
            );
          }
        });
      }
      //store key-value for graphqlRespose from the database
      redisClient.set(
        res.locals.redisKey,
        JSON.stringify(res.locals.graphQLResponse)
      );
      //store another key-value for store parsedAST
      redisClient.set(
        `${res.locals.redisKey}:fields`,
        JSON.stringify(res.locals.proto)
      );
    } else {
      // Mutation was made, clear all keys subscribed to the mutation
      updateRedisAfterMutation(res.locals.graphQLResponse);
    }
    next();
  });
};

//extract __typenames after GraphQL Response
const foundTypes = (graphQLResponse: any) => {
  const stringy = JSON.stringify(graphQLResponse);
  let regex = /(__typename)\":\"(.+?)\"/g;
  let found = new Set(stringy.match(regex));

  const subArr = [];
  for (let item of found) {
    let newItem = item.slice(13, -1);
    subArr.push(newItem);
  }
  return subArr;
};

const updateRedisAfterMutation = (graphQLResponse: Object) => {
  // get the type of mutation from the first key in GQLresponse
  console.log('Update Graphql', graphQLResponse);
  const mutation = Object.keys(graphQLResponse)[0];
  // get subscribed tables to the mutation from the mutation map
  const subscribedTable = getMutationMap(schema);
  const keyToClear = `${subscribedTable[mutation]}:Publisher`;
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
          // Display result of the Redis subscriber clearing
          if (res === 1) {
            console.log('Deleted successfully');
          } else {
            console.log('Item to be cleared was not found in redis');
          }
        });
      }
    }
    // After subscribers array is cleared, delete the subscribed key.
    redisClient.del(`${keyToClear}`, (err, res) => {
      if (res === 1) {
        console.log('Deleted the Subscriber Key successfully');
      } else {
        console.log('Failed to delete the Subscriber Key');
      }
    });
  });
};

const parseAST = (AST: any) => {
  // initialize prototype as empty object
  const proto = {};
  let isCachable: boolean;
  let parentFieldName: string;

  let operationType: string;

  let parentFieldArgs: string;

  let fieldArgs: string;

  let argsName: string;
  // const duplicatedproto: any = {};

  const fieldArray: any = [];
  // initialiaze arguments as null
  let protoArgs: any = null;

  // initialize stack to keep track of depth first parsing
  const stack: any[] = [];

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
    enter(node: any) {
      if (node.directives as any) {
        if (node.directives.length > 0) {
          isCachable = false;
          return BREAK;
        }
      }
    },
    OperationDefinition(node) {
      operationType = node.operation;
      if (node.operation === 'subscription') {
        operationType = 'unCachable';
        return BREAK;
      }
    },
    Field: {
      enter(node: any) {
        fieldArray.push(node.name.value);
        // fieldArr.push(node.name.value);
        if (node.alias) {
          operationType = 'unCachable';
          return BREAK;
        }
        if (node.arguments && node.arguments.length > 0) {
          fieldArgs = node.arguments[0].value.value;
          argsName = node.arguments[0].name.value;
          // console.log("ARGUMENT?", node);
          protoArgs = protoArgs || {};
          protoArgs[node.name.value] = {};

          // collect arguments if arguments contain id, otherwise make query unCachable
          // hint: can check for graphQl type ID instead of string 'id'
          for (let i = 0; i < node.arguments.length; i++) {
            const key: any = node.arguments[i].name.value;
            const value: any = node.arguments[i].value.value;

            // for queries cache can handle only id as argument
            if (operationType === 'query') {
              if (!key.includes('id')) {
                operationType = 'unCachable';
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
    SelectionSet(node: any, key, parent: any, path, ancestors) {
      if (parent.kind === 'Field') {
        const tempObject: any = {};
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
      } else {
        parentFieldName = node.selections[0].name.value;
      }
    },
  });

  return {
    proto,
    protoArgs,
    operationType,
    parentFieldName,
    fieldArray,
    fieldArgs,
    argsName,
  };
};

//parse AST and store fields as nested json object
const duplicatedAST = (AST: any) => {
  let fields_Object: any;
  let layer: string = '';

  visit(AST, {
    SelectionSet(node: any, key, parent: any) {
      if (parent.kind === 'Field') {
        const tempObj: any = {};
        const parentName = parent.name.value;
        if (layer.length === 0) {
          layer = parentName;
        }
        const tempArray: any = [];
        node.selections.forEach((e: any) => tempArray.push(e.name.value));
        tempObj[parentName] = tempArray;
        if (!fields_Object) {
          fields_Object = tempObj;
        } else {
          fields_Object[layer].forEach((e: any, i: any) => {
            if (e === parentName) {
              fields_Object[layer][i] = tempObj;
            }
          });
          layer = parentName;
        }
      }
    },
  });
  return { fields_Object };
};

// Parse through AST proto and convert it into a GQL query string
const protoQueryString = (obj: any, protoArgs: any) => {
  const argsToQuery = (protoArgs: any) => {
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
      mainString += protoQueryString(obj[key], {});
    }
  }
  return '{' + mainString + '}';
};

//check if all fields from incoming request match with fields stored in redis caches
// return boolean
const isSubset = (superObj: any, subObj: any): boolean => {
  return Object.keys(subObj).every((ele) => {
    if (typeof subObj[ele] == 'object') {
      return isSubset(superObj[ele], subObj[ele]);
    }
    if (!subObj || !superObj) return false;
    return subObj[ele] === superObj[ele];
  });
};

const checkRedis = async (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.ismutation) return next();
  //check if similar queries have been stored in the database
  redisClient.get(`${res.locals.redisKey}:fields`, (error, values) => {
    if (error) {
      console.log('redis error', error);
      res.send(error);
    }
    if (!values) {
      console.log('similar query is not found in redis');
      return next();
    } else {
      const redisValues = JSON.parse(`${values}`);
      //check if cache has data that incoming queries need
      const resultFromIsSubset = isSubset(redisValues, res.locals.proto);
      //not found, fetch data from database
      if (!resultFromIsSubset) {
        console.log('not all fields are found on cache,');
        return next();
      }
      //get data from cache
      redisClient.get(res.locals.redisKey, (err, values) => {
        const redisValues = JSON.parse(`${values}`);
        console.log('fetch data from cache');
        res.locals.graphQLResponse = parseDataFromCache(
          redisValues,
          res.locals.restructuredQuery
        );
        return next();
      });
    }
  });
};

const parsingAlgo = (req: Request, res: Response, next: NextFunction) => {
  const AST: any = parse(req.params.query);
  const {
    proto,
    protoArgs,
    operationType,
    parentFieldName,
    fieldArray,
    fieldArgs,
  }: any = parseAST(AST);
  //
  const parsedASTObj: any = duplicatedAST(AST).fields_Object;
  console.log('Dupliacted AST', parsedASTObj);
  //query made: grapql string with __typename
  let querymade = protoQueryString(proto, protoArgs);
  //attach mutation with graphql string
  if (operationType == 'mutation') {
    querymade = 'mutation' + querymade;
    res.locals.ismutation = true;
  }
  res.locals.proto = proto;
  res.locals.querymade = querymade;
  res.locals.fieldArgs = fieldArgs;
  res.locals.redisKey = fieldArgs
    ? parentFieldName + fieldArgs
    : parentFieldName;
  res.locals.restructuredQuery = parsedASTObj;

  next();
};

app.get(
  '/atlantis/:query',
  parsingAlgo,
  checkRedis,
  makeGQLrequest,
  (req, res, next) => {
    res.send(res.locals.graphQLResponse);
  }
);

app.get('/', (req: Request, res: Response) => {
  return res.status(200).sendFile(path.join(__dirname, './views/index.html'));
});

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});

export { foundTypes, parseAST, protoQueryString, duplicatedAST, isSubset };
