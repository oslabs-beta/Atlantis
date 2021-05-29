import express, { Application, Request, Response, NextFunction } from 'express';
//the extra variables available from express define express types
import path from 'path';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import redis from 'redis';
import connectRedis from 'connect-redis';
import session from 'express-session';
//if curious see package.json, had to install types for some of these dependencies to work with TS
const db = require('./model');
import { graphqlHTTP } from 'express-graphql';
import { hasUncaughtExceptionCaptureCallback, nextTick } from 'process';
import { graphql } from 'graphql';
const schema = require('./schema/schema');
const { bigAssFunction, startSession } = require('./cacheCheck/baf');

const morgan = require('morgan');

dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;

//we might need to configure this line somehow for users running behind a proxy
// app.set('trust proxy', 1)

// const RedisStore = connectRedis(session);

// const redisClient = redis.createClient({
//   host: 'localhost',
//   port: Number(process.env.REDIS_PORT),
// });

app.use(startSession);

app.use(
  '/graphql', 
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

// const bigAssFunction = (req: Request, res: Response, next: NextFunction) => {
//   console.log("reqest",req.params.query);
//   if(!req.params.query){
//     console.log('did not enter query');
//     return next();
//   }
//   console.log('entered BAF');
  // const getQuery = () => {
  //   if (res.locals.graphQLResponse) return next();
  //   graphql(schema, req.params.query).then((response) => {
  //     console.log('getQuery middleware responded with', response.data);
  //     res.locals.graphQLResponse = response.data;
  //     (req.session as any)[req.params.query] = res.locals.graphQLResponse;
  //     next();
  //   });
  // };
  
//   const checkRedis = () => {
//     console.log('req.sessionID is ', req.sessionID);
//     redisClient.get(`sess:${req.sessionID}`, (error, values) => {
//       if (error) {
//         console.log('redis error', error);
//         res.send(error);
//       }
//       console.log('req params are', req.params.query);
//       const redisValues = JSON.parse(`${values}`);
//       if (!redisValues[req.params.query]) {
//         console.log('query was not a key in redis session');
//         return getQuery();
//       } else {
//         console.log('query was found in cache');
//         const cachedValue = redisValues[req.params.query];
//         console.log('redis cachedValue is ', cachedValue);
//         res.locals.graphQLResponse = cachedValue;
//         next();
//       }
//     });
//   };

//   checkRedis();
// // next();
// }

// app.get('/testing', getQuery, (req, res, next) => {
  //   console.log('this is going to be saved as redis key', res.locals.query);
  //   console.log(
    //     'this is going to be saved as redis value',
    //     res.locals.graphQLResponse
    //   );
    //   res.send(res.locals.graphQLResponse);
    // });
    
    // cachetest/{projects{project_name}}

// app.use(bigAssFunction);
app.get('/cachetest', bigAssFunction,  (req: Request, res: Response) => {
  
  res.send("hello");
})

app.get('/test/:query', bigAssFunction, (req: Request, res: Response) => {
  
  res.send("test queyr");
})


app.get('/', (req: Request, res: Response) => {
  (req.session as any).initalized = true;
  console.log("session intialized")
  return res.status(200).sendFile(path.join(__dirname, './views/index.html'));
});

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
