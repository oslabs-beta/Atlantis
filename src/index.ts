import { parse } from 'graphql';
import {
  parseAST,
  duplicatedParseAST,
  protoQueryString,
  isSubset,
  parseDataFromCache,
  makeGQLrequest,
} from './helperFunctions/helper';

const atlantis =
  (redisClient: any, schema: any) => async (req: any, res: any, next: any) => {
    console.log("HIT Atantlis!")
    if (!req.body) return next();
    const AST = parse(req.body.query);
    const {
      proto,
      protoArgs,
      operationType,
      parentFieldName,
      fieldArgs,
    }: any = parseAST(AST);
    const restructuredQuery: Object = duplicatedParseAST(AST);
    let querymade = protoQueryString(proto, protoArgs);
    const redisKey = fieldArgs ? parentFieldName + fieldArgs : parentFieldName;

    if (operationType !== 'mutation') {
      redisClient.get(`${redisKey}:fields`, async (error: any, values: any) => {
        if (error) {
          res.send(error);
        }
        if (!values) {
          console.log("NOT FOUND IN Cache")
          res.locals.queryResponse = await makeGQLrequest(
            redisClient,
            schema,
            redisKey,
            querymade,
            proto,
            operationType
          );
          next();

        } else {
          const redisValues = JSON.parse(`${values}`);
          //check if cache has data that incoming queries need
          console.log("check if cache has data that incoming queries need")

          const resultFromIsSubset = await isSubset(redisValues, proto);
          //not found, fetch data from database
          if (!resultFromIsSubset) {
            console.log("not found, fetch data from database")

            res.locals.queryResponse = await makeGQLrequest(
              redisClient,
              schema,
              redisKey,
              querymade,
              proto,
              operationType
            );
            next();
          } else {
            console.log("Found in redis")

            redisClient.get(redisKey, async (error: any, values: any) => {
              const redisValues = JSON.parse(`${values}`);
              res.locals.queryResponse = await parseDataFromCache(
                redisValues,
                restructuredQuery
              );
              next();
            });

          }
        }
      });
    } else {
      console.log("mutation !")
      querymade = 'mutation' + querymade;
      res.locals.queryResponse = await makeGQLrequest(
        redisClient,
        schema,
        redisKey,
        querymade,
        proto,
        operationType
      );
      next();
    }
  };

export { atlantis };
