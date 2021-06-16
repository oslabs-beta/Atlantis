import { getMutationMap } from './getMutationMap';

const updateRedisAfterMutation = (
  redisClient: any,
  schema: any,
  graphQLResponse: Object
) => {
  // get the type of mutation from the first key in GQLresponse
  const mutation = Object.keys(graphQLResponse)[0];
  // get subscribed tables to the mutation from the mutation map
  const subscribedTable = getMutationMap(schema);
  const keyToClear = `${subscribedTable[mutation]}:Publisher`;
  // query redis for key to clear
  redisClient.get(`${keyToClear}`, (error: any, values: any) => {
    if (error) {
      console.log('Redis error', error);
    }
    const queriesToClear = JSON.parse(`${values}`);
    if (queriesToClear) {
      // if queries to clear exists, iterate over queries and delete them from redis.
      for (let i = 0; i < queriesToClear.length; i++) {
        redisClient.del(queriesToClear[i]);
      }
    }
    // after subscribers array is cleared, delete the subscribed key.
    redisClient.del(`${keyToClear}`);
  });
};

export { updateRedisAfterMutation };
