import { graphql } from 'graphql';
import { resolve } from 'path/posix';
import { typesInQuery } from './typesInQuery';
import { updateRedisAfterMutation } from './updateRedisAfterMutation';

const makeGQLrequest = async (
  redisClient: any,
  schema: any,
  redisKey: any,
  queryMade: any,
  proto: any,
  operationType: any
) => {
  return new Promise((resolve) => {
    graphql(schema, queryMade).then((response) => {
      const graphQLResponse: any = response.data;
      if (operationType == 'unCacheable') return graphQLResponse
      if (operationType !== 'mutation') {
        const subscriptions = typesInQuery(graphQLResponse);
        // subscribe the query to mutations of type subscription
        for (let key in subscriptions) {
          redisClient.get(
            `${subscriptions[key]}:Publisher`,
            (error: any, values: any) => {
              if (error) {
                return;
              }
              // Case where this query is the first to subscribe to this type.
              // Create a key, and subscribe the query to that key.
              if (!values) {
                const subsArr = [redisKey];
                redisClient.set(
                  `${subscriptions[key]}:Publisher`,
                  JSON.stringify(subsArr)
                );
              } else {
                // Case where other queries are also subscribed to changes of this type.
                const subsArr = JSON.parse(`${values}`);
                subsArr.push(redisKey);

                redisClient.set(
                  `${subscriptions[key]}:Publisher`,
                  JSON.stringify(subsArr)
                );
              }
            }
          );
        }
        // store key-value for graphqlRespose from the database
        redisClient.set(redisKey, JSON.stringify({ data: graphQLResponse, fields: proto }));
      } else {
        // since we have a mutation we need to clear all subscribed queries
        updateRedisAfterMutation(redisClient, schema, graphQLResponse);
      }
      resolve(graphQLResponse);
    });
  })
};

export { makeGQLrequest };
