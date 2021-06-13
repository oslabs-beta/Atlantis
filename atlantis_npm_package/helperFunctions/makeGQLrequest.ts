import { graphql } from "graphql";
import { foundTypes } from "./foundTypes"


const makeGQLrequest = (redisClient:any, schema:any, redisKey:any, querymade:any, proto:any) => {
    console.log("Query to GQL is : ", querymade);
    console.log("schema is : ", schema);
    graphql(schema, querymade).then((response) => {
      const graphQLResponse = response.data;
      // console.log("GQL responded with", response);
    //   if (!res.locals.ismutation) {
        
        const subscriptions = foundTypes(graphQLResponse);
        // subscribe the query to mutations of type subscription
        for (let key in subscriptions) {
          
          redisClient.get(`${subscriptions[key]}:Publisher`, (error:any, values:any) => {
            if (error) {
              console.log("Atlantis -- redis error", error);
              return
            }
            // Case where this query is the first to subscribe to this type.
            // Create a key, and subscribe the query to that key.
            if (!values) {
                const subs = [redisKey, `${redisKey}:fields`];
                redisClient.set(`${subscriptions[key]}:Publisher`, JSON.stringify(subs));
            } else {
              // Case where other queries are also subscribed to changes of this type.
              const subs = JSON.parse(`${values}`);
              subs.push(redisKey);
              subs.push(`${redisKey}:fields`);
              redisClient.set(`${subscriptions[key]}:Publisher`, JSON.stringify(subs));
            };
          
          });
        }
        //store key-value for graphqlRespose from the database 
          redisClient.set(
            redisKey,
            JSON.stringify(graphQLResponse)
          );
          //store another key-value for store parsedAST
          redisClient.set(
            `${redisKey}:fields`,
            JSON.stringify(proto)
          );
    //   } else {
    //     // Mutation was made, clear all keys subscribed to the mutation
    //     updateRedisAfterMutation(res.locals.graphQLResponse);
    //   }
            return graphQLResponse;
    });
  };






export {makeGQLrequest}