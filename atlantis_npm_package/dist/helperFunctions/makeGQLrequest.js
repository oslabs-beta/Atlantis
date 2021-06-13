"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGQLrequest = void 0;
const graphql_1 = require("graphql");
const foundTypes_1 = require("./foundTypes");
const updateRedisAfterMutation_1 = require("./updateRedisAfterMutation");
const makeGQLrequest = (redisClient, schema, redisKey, querymade, proto, operationType) => {
    graphql_1.graphql(schema, querymade).then((response) => {
        const graphQLResponse = response.data;
        if (operationType !== 'mutation') {
            //// needs to get skipped
            const subscriptions = foundTypes_1.foundTypes(graphQLResponse);
            // subscribe the query to mutations of type subscription
            for (let key in subscriptions) {
                redisClient.get(`${subscriptions[key]}:Publisher`, (error, values) => {
                    if (error) {
                        ///// |||| \\\\\\ IMPORTANT
                        return;
                    }
                    // Case where this query is the first to subscribe to this type.
                    // Create a key, and subscribe the query to that key.
                    if (!values) {
                        const subs = [redisKey, `${redisKey}:fields`];
                        redisClient.set(`${subscriptions[key]}:Publisher`, JSON.stringify(subs));
                    }
                    else {
                        // Case where other queries are also subscribed to changes of this type.
                        const subs = JSON.parse(`${values}`);
                        subs.push(redisKey);
                        subs.push(`${redisKey}:fields`);
                        redisClient.set(`${subscriptions[key]}:Publisher`, JSON.stringify(subs));
                    }
                });
            }
            //store key-value for graphqlRespose from the database
            redisClient.set(redisKey, JSON.stringify(graphQLResponse));
            //store another key-value for store parsedAST
            redisClient.set(`${redisKey}:fields`, JSON.stringify(proto));
        }
        else {
            updateRedisAfterMutation_1.updateRedisAfterMutation(redisClient, schema, graphQLResponse);
        }
        return graphQLResponse;
    });
};
exports.makeGQLrequest = makeGQLrequest;
//# sourceMappingURL=makeGQLrequest.js.map