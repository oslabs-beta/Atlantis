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
exports.makeGQLrequest = void 0;
const graphql_1 = require("graphql");
const typesInQuery_1 = require("./typesInQuery");
const updateRedisAfterMutation_1 = require("./updateRedisAfterMutation");
const makeGQLrequest = (redisClient, schema, redisKey, queryMade, proto, operationType) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        graphql_1.graphql(schema, queryMade).then((response) => {
            const graphQLResponse = response.data;
            if (operationType == 'unCacheable')
                return graphQLResponse;
            if (operationType !== 'mutation') {
                const subscriptions = typesInQuery_1.typesInQuery(graphQLResponse);
                // subscribe the query to mutations of type subscription
                for (let key in subscriptions) {
                    redisClient.get(`${subscriptions[key]}:Publisher`, (error, values) => {
                        if (error) {
                            return;
                        }
                        // Case where this query is the first to subscribe to this type.
                        // Create a key, and subscribe the query to that key.
                        if (!values) {
                            const subsArr = [redisKey];
                            redisClient.set(`${subscriptions[key]}:Publisher`, JSON.stringify(subsArr));
                        }
                        else {
                            // Case where other queries are also subscribed to changes of this type.
                            const subsArr = JSON.parse(`${values}`);
                            subsArr.push(redisKey);
                            redisClient.set(`${subscriptions[key]}:Publisher`, JSON.stringify(subsArr));
                        }
                    });
                }
                // store key-value for graphqlRespose from the database
                redisClient.set(redisKey, JSON.stringify({ data: graphQLResponse, fields: proto }));
            }
            else {
                // since we have a mutation we need to clear all subscribed queries
                updateRedisAfterMutation_1.updateRedisAfterMutation(redisClient, schema, graphQLResponse);
            }
            resolve(graphQLResponse);
        });
    });
});
exports.makeGQLrequest = makeGQLrequest;
//# sourceMappingURL=makeGQLrequest.js.map