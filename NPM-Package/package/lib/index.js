"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atlantis = void 0;
const graphql_1 = require("graphql");
const exportHelper_1 = require("./helperFunctions/exportHelper");
const atlantis = (redisClient, schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // if there is no graphQL request, go to the next middleware
    if (!req.body)
        return next();
    const AST = graphql_1.parse(req.body.query);
    const { queryStructure, queryArgs, operationType, parentFieldName, fieldArgs, } = exportHelper_1.traverseAST(AST);
    // returns field objects of the AST tree
    const restructuredQuery = exportHelper_1.restructureAST(AST);
    // parses the proto from the AST to turn it back into a GQL query string
    let queryMade = exportHelper_1.structureToString(queryStructure, queryArgs);
    // if there are are fieldArgs, append them to the parentField before we check redis
    const redisKey = fieldArgs ? parentFieldName + fieldArgs : parentFieldName;
    /* as long as the request was not a mutation, we check redis first */
    if (operationType == 'unCacheable') {
        // reset the queryMade to the inital request.
        queryMade = req.body.query;
        res.locals.graphQLResponse = yield exportHelper_1.makeGQLrequest(redisClient, schema, redisKey, queryMade, queryStructure, operationType);
        return next();
    }
    if (operationType !== 'mutation') {
        redisClient.get(`${redisKey}`, (error, values) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                // connection to redis failed.
                return res.status(500).send({ "Error": "Failed to connect to Redis" });
            }
            /* redis did not have the query cached, so we need to make the request to GQL */
            if (!values) {
                res.locals.graphQLResponse = yield exportHelper_1.makeGQLrequest(redisClient, schema, redisKey, queryMade, queryStructure, operationType);
                // failed to connect to redis during the GQL request
                if (!res.locals.graphQLResponse)
                    return res.status(500).send({ "Error": "Failed to connect to Redis" });
                next();
                /* Redis had the root key cached */
            }
            else {
                // save the returned result from redis after we change into an object
                const redisValues = JSON.parse(`${values}`);
                // check if cache has data that incoming queries need
                const resultFromIsSubset = yield exportHelper_1.isSubset(redisValues["fields"], queryStructure);
                // if the new request is not a subset of the cached query, make the new request
                if (!resultFromIsSubset) {
                    res.locals.graphQLResponse = yield exportHelper_1.makeGQLrequest(redisClient, schema, redisKey, queryMade, queryStructure, operationType);
                    // failed to connect to redis during the GQL request
                    if (!res.locals.graphQLResponse)
                        return res.status(500).send({ "Error": "Failed to connect to Redis" });
                    next();
                }
                else {
                    // request was a subset of the cached query, so we can parse it to return the appropriate data
                    res.locals.graphQLResponse = exportHelper_1.parseDataFromCache(redisValues["data"], restructuredQuery);
                    next();
                }
            }
        }));
    }
    else {
        /* the request was a mutation to the DB */
        queryMade = 'mutation' + queryMade;
        res.locals.graphQLResponse = yield exportHelper_1.makeGQLrequest(redisClient, schema, redisKey, queryMade, queryStructure, operationType);
        // failed to connect to redis during the GQL request
        if (!res.locals.graphQLResponse)
            return res.status(500).send({ "Error": "Failed to connect to Redis" });
        next();
    }
});
exports.atlantis = atlantis;
//# sourceMappingURL=index.js.map