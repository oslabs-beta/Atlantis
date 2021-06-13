import { Request, Response, NextFunction } from "express";
import { graphql, visit, parse, BREAK } from "graphql";
import { parseAST } from './helperFunctions/parseAST'
import { duplicatedParseAST } from './helperFunctions/duplicateParseAST';
import { protoQueryString } from './helperFunctions/protoQueryString'
import { isSubset } from './helperFunctions/isSubset';
import { parseDataFromCache } from './helperFunctions/parseDataFromCache';
import { makeGQLrequest } from './helperFunctions/makeGQLrequest';


// redisClient/ Schema, 
const atlantis = (redisClient: any, schema:any) => (req: Request, res: Response, next: any) =>{
    console.log('Atlantis -- ')

    if (!req.body) return next()
    let graphQLResponse; 
    const AST = parse(req.body.query);
    const { proto, protoArgs, operationType, parentFieldName ,fieldArray, fieldArgs}: any = parseAST(AST);
    const restructuredQuery: Object = duplicatedParseAST(AST);
    let querymade = protoQueryString(proto, protoArgs);
    const redisKey = (fieldArgs) ? parentFieldName + fieldArgs : parentFieldName;
    if (operationType == "mutation") {
      querymade = "mutation" + querymade;
      const ismutation: boolean = true;
      // make gql request
    }
    let schemaCopy = schema
    redisClient.get(`${redisKey}:fields`, (error:any, values:any) => {
        if (error) {
          res.send(error);
        }
        if (!values) {
          console.log('Atlantis -- no values');
        
          graphQLResponse = makeGQLrequest(redisClient, schemaCopy, redisKey, querymade, proto)
          return next();
        } else {
          const redisValues = JSON.parse(`${values}`);
          console.log('Atlantis -- values are', redisValues);
          //check if cache has data that incoming queries need
          const resultFromIsSubset = isSubset(redisValues, proto);
          //not found, fetch data from database
            if(!resultFromIsSubset){
            console.log('Atlantis -- not a subset need to make request');
            graphQLResponse = makeGQLrequest(redisClient, schemaCopy, redisKey, querymade, proto)
            return next();
            }
          console.log('Atlantis -- was subset, about to make request');
          redisClient.get(redisKey, (error: any, values: any) =>{
            const redisValues = JSON.parse(`${values}`);
            graphQLResponse = parseDataFromCache(redisValues, restructuredQuery);
            console.log('Atlantis -- was subset, got ', graphQLResponse);
            return next();
          })
        }
      })


    console.log('Atlantis -- rediskey is', redisKey);
    next();
}

export {atlantis};