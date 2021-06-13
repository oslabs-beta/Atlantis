import { graphql, visit, parse, BREAK } from "graphql";
import { parseAST } from './helperFunctions/parseAST'
import { duplicatedParseAST } from './helperFunctions/duplicateParseAST';
import { protoQueryString } from './helperFunctions/protoQueryString'
import { isSubset } from './helperFunctions/isSubset';
import { parseDataFromCache } from './helperFunctions/parseDataFromCache';
import { makeGQLrequest } from './helperFunctions/makeGQLrequest';


const atlantis = (redisClient: any, schema:any) => async (req: any, res: any, next: any) =>{


    if (!req.body) return next()

    const AST = parse(req.body.query);
    const { proto, protoArgs, operationType, parentFieldName ,fieldArray, fieldArgs}: any = parseAST(AST);
    const restructuredQuery: Object = duplicatedParseAST(AST);
    let querymade = protoQueryString(proto, protoArgs);
    const redisKey = (fieldArgs) ? parentFieldName + fieldArgs : parentFieldName;
   
    if (operationType !== "mutation") {
    redisClient.get(`${redisKey}:fields`, (error:any, values:any) => {
        if (error) {
          res.send(error);
        }
        if (!values) {
          res.locals.queryResponse = makeGQLrequest(redisClient, schema, redisKey, querymade, proto, operationType)
        } else {
          const redisValues = JSON.parse(`${values}`);

          //check if cache has data that incoming queries need
          const resultFromIsSubset = isSubset(redisValues, proto);
          //not found, fetch data from database
            if(!resultFromIsSubset){
            res.locals.queryResponse = makeGQLrequest(redisClient, schema, redisKey, querymade, proto, operationType)
          } else {
          redisClient.get(redisKey, (error: any, values: any) =>{
            const redisValues = JSON.parse(`${values}`);
            res.locals.queryResponse = parseDataFromCache(redisValues, restructuredQuery);
          })
        }
      }
      });
    } else {
      querymade = "mutation" + querymade;
      res.locals.graphQLResponse = makeGQLrequest(redisClient, schema, redisKey, querymade, proto, operationType)
    }
    next();
}

export {atlantis};