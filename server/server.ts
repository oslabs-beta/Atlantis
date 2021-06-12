import express, { Application, Request, Response, NextFunction } from "express";
//the extra variables available from express define express types
import path from "path";
import dotenv from "dotenv";
import redis from "redis";
import connectRedis from "connect-redis";
import session from "express-session";
//if curious see package.json, had to install types for some of these dependencies to work with TS
const db = require("./model");
import { graphqlHTTP } from "express-graphql";
import { hasUncaughtExceptionCaptureCallback, nextTick } from "process";
import { graphql, visit, parse, BREAK, assertEnumType, GraphQLSchema, GraphQLArgs } from "graphql";
const morgan = require("morgan");
const schema = require("./schema/schema");
// import {DuplicateFilter} from "./DuplicatedFilter.js";

const {DuplicateFilter} = require("./DuplicatedFilter.js");


// console.log(DuplicateFilter(data, dataQuery));
dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(morgan("dev"));

const getMutationMap = (schema: any) => {
  const mutationMap: any = {};
  // get object containing all root mutations defined in the schema
  const mutationTypeFields = schema._mutationType._fields;
  // if queryTypeFields is a function, invoke it to get object with queries
  const mutationsObj =
    typeof mutationTypeFields === "function"
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

//we might need to configure this line somehow for users running behind a proxy
// app.set('trust proxy', 1)
const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});
const RedisStore = connectRedis(session);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);


//console.log("line71", )
const makeGQLrequest = (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.graphQLResponse) return next();
  console.log("about to make GQL query of ", res.locals.querymade);
  graphql(schema, res.locals.querymade).then((response) => {
    res.locals.graphQLResponse = response.data;
    // console.log("graphQL responded with.............", response);
    if (!res.locals.ismutation) {

      //FullQuery is sub to type_names
      //if companies->               Companies =[Query, ]          Users= [Query]
      
      //REDIS
      //companies : "alll comapnies in here "
      //companies:fields : "{proto} "
      //company1 : "alll comapnies in here "
      //company1:fields :"{proto}"
      //company1:S: [company1,company1:fields , companies]

     //get request------>   company1 ->    company1     companies,     company1fields
      //                                    ^^              ^^            ^^
      //subscribers----->           fieldName + Args    __typename    fieldName + Args + :fields
      // company1 -> Company1:S = [company1, company1:field, company];
      //           -> User1:S = []

      //mutation---> company1

      //subsribe to a publisher when a new request is made
        //subscribe to 
      //       
      //                      talbe -> (Companies)


      //  companies  
      
      const subscriptions = foundTypes(res.locals.graphQLResponse);
      console.log("subscribed to ", subscriptions);
      // subscribe the query to mutations of type Subscription
      ///////////////////// OLD PUB SUB //////////////////////////////
      for (let key in subscriptions) {
        //Companies:
        
        redisClient.get(`${subscriptions[key]}`, (error, values) => {
          if (error) {
            console.log("redis error", error);
            res.send(error);
          }
      //     // Case where this query is the first to subscribe to this type.
          if (!values) {
            
              const subs = [res.locals.redisKey, `${res.locals.redisKey}:fields`];
              // console.log("KEYY?",subscriptions[key]);
              // console
              redisClient.set(`${subscriptions[key]}:Publisher`, JSON.stringify(subs));
          } else {
            // Case where other queries are also subscribed to changes of this type.
            
            console.log("hit append statement in pub/sub")
            const subs = JSON.parse(`${values}`);
            subs.push(res.locals.redisKey);
            subs.push(`${res.locals.redisKey}:fields`);
            redisClient.set(subscriptions[key], JSON.stringify(subs));
          };
        
        });
      }
      ///////////////////// OLD PUB SUB //////////////////////////////


        redisClient.setex(
          res.locals.redisKey,
          600,
          JSON.stringify(res.locals.graphQLResponse)
        );
        redisClient.setex(
          `${res.locals.redisKey}:fields`,
          600,
          JSON.stringify(res.locals.proto)
        );
    } else {

      // mutation was made, need to clear all subscribers.
      updateRedisAfterMutation(res.locals.graphQLResponse);
    }
    next();
  });
};

//const stringy = JSON.stringify(data)
function foundTypes(input:any) {
    const stringy = JSON.stringify(input)
    let regex = /(__typename)\":\"(.+?)\"/g;
    let found = new Set(stringy.match(regex))

    const subArr = []
    for(let item of found){
      let newItem = item.slice(13, -1);
      subArr.push(newItem);
    }
    return subArr;
}


// const findAllTypes = (GQLresponse: any, subs: any = []) => {


//   for (let key in GQLresponse) {
//     if (Array.isArray(GQLresponse[key])) GQLresponse = { ...GQLresponse };
//     if (key == "__typename") {
//       subs.push(GQLresponse[key]);
//     }
//     const type = "__typename";
//     if (Array.isArray(GQLresponse[key])) {
//       GQLresponse = { ...GQLresponse[key][0] };
//       if (GQLresponse.hasOwnProperty(type)) subs.push(GQLresponse[type]);

//       subs.concat(findAllTypes(GQLresponse, subs));
//     }
//   }
//   subs = [...new Set(subs)];
//   return subs;
// };

const updateRedisAfterMutation = (graphQLResponse: Object) => {
  // get the type of mutation from the first key in GQLresponse
  const mutation = Object.keys(graphQLResponse)[0];
  // get subscribed tables to the mutation from the mutation map
  const subscribedTable = getMutationMap(schema);

  // mutationquery = addUser
  const keyToClear = `${subscribedTable[mutation]}:Publisher`;
  console.log(keyToClear);
  // query redis for key to clear
  redisClient.get(`${keyToClear}`, (error, values) => {
    if (error) {
      console.log("redis error", error);
    }
    const queriesToClear = JSON.parse(`${values}`);
    if (queriesToClear) {
      // if queries to clear exists, iterate over queries and delete them from redis.
      for (let i = 0; i < queriesToClear.length; i++) {
        redisClient.del(queriesToClear[i], (err, res) => {
          // delete these later
          if (res === 1) {
            console.log("Deleted successfully");
          } else {
            console.log("Item to be cleared was not found in redis");
          }
        });
      }
    }
    // After array is cleared, delete the subscribed key.
    redisClient.del(`${keyToClear}`, (err, res) => {
      if (res === 1) {
        console.log("Deleted the Subscriber Key successfully");
      } else {
        console.log("Failed to delete the Subscriber Key");
      }
    });
  });
};

//quellCode for duplicatedAST
let isCachable: boolean;
const parseAST = (AST: any) => {
  // initialize prototype as empty object
  const proto = {};
  //let isCachable = true;

  let parentFieldName: string;

  let operationType: string;

  let parentFieldArgs: string;

  let fieldArgs: string

  let argsName: string
  // const duplicatedproto: any = {};

  const fieldArray: any= [];
  // initialiaze arguments as null
  let protoArgs: any = null; //{ country: { id: '2' } }

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
      if (node.operation === "subscription") {
        operationType = "unCachable";
        return BREAK;
      }
    },
    Field: {
      enter(node: any) {
        fieldArray.push(node.name.value);
        // fieldArr.push(node.name.value);
        if (node.alias) {
          operationType = "unCachable";
          return BREAK;
        }
        if (node.arguments && node.arguments.length > 0) {
          fieldArgs = node.arguments[0].value.value
          argsName = node.arguments[0].name.value
          // console.log("ARGUMENT?", node);
          protoArgs = protoArgs || {};
          protoArgs[node.name.value] = {};

          // collect arguments if arguments contain id, otherwise make query unCachable
          // hint: can check for graphQl type ID instead of string 'id'
          for (let i = 0; i < node.arguments.length; i++) {
            const key: any = node.arguments[i].name.value;
            const value: any = node.arguments[i].value.value;

            // for queries cache can handle only id as argument
            if (operationType === "query") {
              if (!key.includes("id")) {
                operationType = "unCachable";
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
      /* Exclude SelectionSet nodes whose parents' are not of the kind
       * 'Field' to exclude nodes that do not contain crmation about
       *  queried fields.
       */
      if (parent.kind === "Field") {
        // console.log(parent, "Parent Field")
        // loop through selections to collect fields
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
        protoObj["__typename"] = true;
      }else{
        
        parentFieldName = node.selections[0].name.value;
        
      }
    },
  });

  return { proto, protoArgs, operationType, parentFieldName, fieldArray, fieldArgs, argsName };
};


const duplicatedASTed = (AST: any) => {
  // initialize prototype as empty object
  const proto = {};
  let protoDup:any;
  let layer:string = "";
  //let isCachable = true;
  
  let operationType: string;

  // initialiaze arguments as null
  let protoArgs: any = null; //{ country: { id: '2' } }

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
      if (node.operation === "subscription") {
        operationType = "unCachable";
        return BREAK;
      }
    },
    Field: {
      enter(node: any) {
        // console.log("FIELD........", node);
        if (node.alias) {
          operationType = "unCachable";
          return BREAK;
        }
        if (node.arguments && node.arguments.length > 0) {
          protoArgs = protoArgs || {};
          protoArgs[node.name.value] = {};
          // console.log("node", node.arguments[0].value.value)
          // console.log("arg id name", node.arguments[0].name.value)
          // collect arguments if arguments contain id, otherwise make query unCachable
          // hint: can check for graphQl type ID instead of string 'id'
          for (let i = 0; i < node.arguments.length; i++) {
            const key: any = node.arguments[i].name.value;
            const value: any = node.arguments[i].value.value;

            // for queries cache can handle only id as argument
            if (operationType === "query") {
              if (!key.includes("id")) {
                operationType = "unCachable";
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
      /* Exclude SelectionSet nodes whose parents' are not of the kind
       * 'Field' to exclude nodes that do not contain information about
       *  queried fields.
       */
      
      if (parent.kind === "Field") {
        // console.log("ANCESTORS...", ancestors);
        const tempObj: any = {};
        const parentName = parent.name.value;
        if(layer.length === 0){layer = parentName};
        
        const tempArray: any = [];
          // console.log("NODE SELECTIONS", node.selections);
          node.selections.forEach((e:any) => tempArray.push(e.name.value));
          // for (let field of node.selections) {             //if this is not a parent
          //  tempArray.push(field.name.value);
          //   };
            // console.log(tempArray, ' line 385');
          tempObj[parentName] = tempArray;
          if(!protoDup){
            protoDup = tempObj;
            //first protoDup = {};
            //secon time: protoDup: {}
          }else{
            /*
            //layer: "company"
            //protoDup =  { 
              // companies: [ 'company_id', 'name', 'description', {employee: [sstr1, str2, {key: [value1, value2] } ] } ] }
               // companies: [ 'company_id', 'name', 'description', employee] } ] }

              */
            //tempObj = {emplyees: [id, ,...]}
            protoDup[layer].forEach((e: any,i:any)=> {
              if(e === parentName){
            //old employee field replace with new employee object    
                protoDup[layer][i] =  tempObj;
              }
            })
            layer = parentName;
          }


      }
    },
  });
  
  return { protoDup, proto, protoArgs, operationType };
};

// parse's the proto to a gql query string
const ProtoQueryString = (obj: any, protoArgs: any) => {
  const argsToQuery = (protoArgs: any) => {
    let string = "";
    for (let key in protoArgs) {
      for (let innerKey in protoArgs[key]) {
        // accounts for edge case where an Int is passed in as an arguement.
        if (!isNaN(protoArgs[key][innerKey])) {
          string += innerKey + ": " + protoArgs[key][innerKey] + " ";
          break;
        }
        string += innerKey + ": " + '"' + protoArgs[key][innerKey] + '"' + " ";
      }
    }
    return "(" + string + ")";
  };

  let mainString = "";
  for (let key in obj) {
    if (typeof obj[key] !== "object") {
      mainString += " " + key + " ";
    } else {
      mainString += " " + key + " ";
      if (protoArgs) {
        if (typeof protoArgs[key] == "object") {
          const inner = argsToQuery(protoArgs);
          mainString += inner;
        }
      }
      mainString += ProtoQueryString(obj[key], {});
    }
  }
  return "{" + mainString + "}";
};



// if query, checks redis for the query.

const isSubset = (superObj: any, subObj: any):boolean => {
  return Object.keys(subObj).every(ele => {
      if (typeof subObj[ele] == 'object') {
          return isSubset(superObj[ele], subObj[ele]);
      }
      if(!subObj || !superObj) return false;
      return subObj[ele] === superObj[ele]
  });
};



const checkRedis = async (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.ismutation) return next();
  //rqplace res.locals.querymade with redisKey
  redisClient.get(`${res.locals.redisKey}:fields`, (error, values) => {
    if (error) {
      console.log("redis error", error);
      res.send(error);
    }
    if (!values) {
      console.log("query was not a key in redis session");
      return next();
    } else {
      const redisValues = JSON.parse(`${values}`);
      //check if fields exist in ^ redisValues 
      const checkIsSubset = isSubset(redisValues, res.locals.proto);
      if(!checkIsSubset){
        console.log("not all fields are found on cache");
      return next();
      }
      //get the specific field from redis Values based on you know
      redisClient.get(res.locals.redisKey, (err, values)=>{
        const redisValues = JSON.parse(`${values}`);
        console.log("fetch data from sub query")
        res.locals.graphQLResponse = DuplicateFilter(redisValues, res.locals.restructuredQuery);
        return next();
      })
    }
  });
};



const parsingAlgo = (req: Request, res: Response, next: NextFunction) => {
  const AST: any = parse(req.params.query);

  // console.log("REQ PARAMS", req.params.query)
  const { proto, protoArgs, operationType,parentFieldName ,fieldArray, fieldArgs, argsName}: any = parseAST(AST);
  // console.log("Quell Proto............", proto);
  // console.log("ProtoArgs", protoArgs);
  // console.log("PARENT NODE Name", parentFieldName);
  // console.log("parentFieldArgs", parentFieldArgs)
  // console.log("Field Array", fieldArray);
  // console.log("FIELD ID", fieldArgs);
  // console.log("argsName", argsName);

  
  const duplicatedASTdata: any = duplicatedASTed(AST).protoDup;
  // console.log("DUPLICATEDASTDATA", duplicatedASTdata);
  //proto to String
  let querymade = ProtoQueryString(proto, protoArgs);
  // console.log("QUERYMADE", querymade);
  // console.log("after PQS");
  if (operationType == "mutation") {
    querymade = "mutation" + querymade;
    res.locals.ismutation = true;
  }
  // console.log("proto to query", querymade);
  res.locals.proto = proto;
  console.log("PROTO",res.locals.proto)
  res.locals.querymade = querymade;
  res.locals.fieldArgs = fieldArgs;
  res.locals.redisKey = (fieldArgs) ? parentFieldName + fieldArgs : parentFieldName;
  res.locals.fieldArray = fieldArray;
  res.locals.restructuredQuery = duplicatedASTdata; 


  next();
};

app.get(
  "/cachetest/:query",
  parsingAlgo,
  checkRedis,
  makeGQLrequest,
  (req, res, next) => {
    res.send(res.locals.graphQLResponse);
  }
);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).sendFile(path.join(__dirname, "./views/index.html"));
});

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});




