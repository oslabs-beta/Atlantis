import { parse } from 'graphql';
import {
  traverseAST,
  restructureAST,
  structureToString,
  isSubset,
  parseDataFromCache,
  makeGQLrequest,
} from './helperFunctions/exportHelper';

const atlantis =
  (redisClient: any, schema: any) => async (req: any, res: any, next: any) => {
    const start = performance.now()
    // if there is no graphQL request, go to the next middleware
    if (!req.body) return next();
    const AST = parse(req.body.query);
    const {
      queryStructure,
      queryArgs,
      operationType,
      parentFieldName,
      fieldArgs,
    }: any = traverseAST(AST);
    // returns field objects of the AST tree
    const restructuredQuery: Object = restructureAST(AST);
    // parses the proto from the AST to turn it back into a GQL query string
    let queryMade = structureToString(queryStructure, queryArgs);
    // if there are are fieldArgs, append them to the parentField before we check redis
    const redisKey = fieldArgs ? parentFieldName + fieldArgs : parentFieldName;
    /* as long as the request was not a mutation, we check redis first */
    if (operationType == 'unCacheable') {
      // reset the queryMade to the inital request.
      queryMade = req.body.query
      res.locals.graphQLResponse = await makeGQLrequest(
        redisClient,
        schema,
        redisKey,
        queryMade,
        queryStructure,
        operationType
      );
      return next()
    }
    if (operationType !== 'mutation') {
      redisClient.get(`${redisKey}`, async (error: any, values: any) => {
        if (error) {
          // connection to redis failed.
          return res.status(500).send({ "Error": "Failed to connect to Redis" });
        }
        /* redis did not have the query cached, so we need to make the request to GQL */
        if (!values) {
          res.locals.graphQLResponse = await makeGQLrequest(
            redisClient,
            schema,
            redisKey,
            queryMade,
            queryStructure,
            operationType
          );
          // failed to connect to redis during the GQL request
          if (!res.locals.graphQLResponse) return res.status(500).send({ "Error": "Failed to connect to Redis" });
          const end = performance.now()
          const dif = end - start
          res.locals.dif = dif
          next();
          /* Redis had the root key cached */
        } else {
          // save the returned result from redis after we change into an object
          const redisValues = JSON.parse(`${values}`);
          // check if cache has data that incoming queries need
          const resultFromIsSubset = await isSubset(redisValues["fields"], queryStructure);
          // if the new request is not a subset of the cached query, make the new request
          if (!resultFromIsSubset) {

            res.locals.graphQLResponse = await makeGQLrequest(
              redisClient,
              schema,
              redisKey,
              queryMade,
              queryStructure,
              operationType
            );
            // failed to connect to redis during the GQL request
            if (!res.locals.graphQLResponse) return res.status(500).send({ "Error": "Failed to connect to Redis" });

            next();
          } else {
            // CASE WHERE IN REDIS AND SUBSET
            // request was a subset of the cached query, so we can parse it to return the appropriate data
            res.locals.graphQLResponse = parseDataFromCache(
              redisValues["data"],
              restructuredQuery
            );
            const end = performance.now()
            const dif = end - start
            res.locals.dif = dif
            next();

          }
        }
      });
    } else {
      /* the request was a mutation to the DB */
      queryMade = 'mutation' + queryMade;
      res.locals.graphQLResponse = await makeGQLrequest(
        redisClient,
        schema,
        redisKey,
        queryMade,
        queryStructure,
        operationType
      );
      // failed to connect to redis during the GQL request
      if (!res.locals.graphQLResponse) return res.status(500).send({ "Error": "Failed to connect to Redis" });
      const end = performance.now()
      const dif = end - start
      res.locals.dif = dif
      next();
    }
  };

export { atlantis };
