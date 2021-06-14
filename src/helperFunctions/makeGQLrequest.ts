import { graphql } from 'graphql';
import { resolve } from 'path/posix';
import { foundTypes } from './foundTypes';
import { updateRedisAfterMutation } from './updateRedisAfterMutation';

const makeGQLrequest = async (
  redisClient: any,
  schema: any,
  redisKey: any,
  querymade: any,
  proto: any,
  operationType: any
) => {
  return new Promise((resolve) => {
    graphql(schema, querymade).then((response) => {
      const graphQLResponse: any = response.data;

      if (operationType !== 'mutation') {
        //// needs to get skipped
        const subscriptions = foundTypes(graphQLResponse);
        // subscribe the query to mutations of type subscription
        for (let key in subscriptions) {
          redisClient.get(
            `${subscriptions[key]}:Publisher`,
            (error: any, values: any) => {
              if (error) {
                ///// |||| \\\\\\ IMPORTANT
                return;
              }
              // Case where this query is the first to subscribe to this type.
              // Create a key, and subscribe the query to that key.
              if (!values) {
                const subs = [redisKey, `${redisKey}:fields`];
                redisClient.set(
                  `${subscriptions[key]}:Publisher`,
                  JSON.stringify(subs)
                );
              } else {
                // Case where other queries are also subscribed to changes of this type.
                const subs = JSON.parse(`${values}`);
                subs.push(redisKey);
                subs.push(`${redisKey}:fields`);
                redisClient.set(
                  `${subscriptions[key]}:Publisher`,
                  JSON.stringify(subs)
                );
              }
            }
          );
        }
        //store key-value for graphqlRespose from the database
        redisClient.set(redisKey, JSON.stringify(graphQLResponse));
        //store another key-value for store parsedAST
        redisClient.set(`${redisKey}:fields`, JSON.stringify(proto));
      } else {
        updateRedisAfterMutation(redisClient, schema, graphQLResponse);
      }
      resolve(graphQLResponse);
    });
  })
};

export { makeGQLrequest };
