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

dotenv.config();

const app: Application = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
//const REDIS_PORT: any = process.env.REDIS_PORT;
//const REDIS_PORT: number = parseInt(process.env.REDIS_PORT as string, 6379);
//console.log(REDIS_PORT)
//const client = redis.createClient(parseInt(REDIS_PORT));

//we might need to configure this line somehow for users running behind a proxy
// app.set('trust proxy', 1)

const RedisStore = connectRedis(session);
//const redisClient = redis.createClient();
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

app.use(
  session({
    store: new RedisStore({
      client: redisClient,
      disableTouch: true,
    }),
    secret: 'foundAtlantis',
    saveUninitialized: false,
    cookie: {
      // 10 years
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    },
    resave: false,
  })
);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

const saveQuery = (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.query) next();
  // save the response.data to res.locals.query
  const query: string = '{companies{name}}';
  graphql(schema, query).then((response) => {
    console.log('saveQuery middleware responded with', response.data);
    res.locals.query = response.data;
    next();
  });
};

app.get('/testing', saveQuery, (req, res, next) => {
  // call saveQuery which will create an object and save it under
  // res.locals.query
  const pastQueries: any[] = [];
  pastQueries.push(res.locals.query);
  // push res.locals.query into the pastQueries array
  // update the res.session.pastQueries to our new pastQueries
  (req.session as any).pastQueries = pastQueries;
  // tell client query has been saved
  res.send('query should be in redis');
});

const checkRedis = (req: Request, res: Response, next: NextFunction) => {
  // find session data pass to redis keys
  console.log('session key is', req.session);
  redisClient.keys('sess:*', (error, keys) => {
    console.log('redis keys are', keys);
    res.locals.query = keys;
    next();
  });
  // find session key, and check for value of the key in redis
  // if value contains query:
  // save value to res.locals.query
  // if not call next
};

app.get('/cachetest', checkRedis, saveQuery, (req, res, next) => {
  // if res.locals exists don't make graphql query
  res.send(res.locals.query);
});

const initializeSession = (req: Request, res: Response, next: NextFunction) => {
  const pastQueries: any[] = [];
  (req.session as any).pastQueries = pastQueries;
  next();
};

app.get('/', initializeSession, (req: Request, res: Response) => {
  return res.status(200).sendFile(path.join(__dirname, './views/index.html'));
});

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
