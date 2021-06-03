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
import { exists } from 'fs';
import { stringify } from 'querystring';
import { SSL_OP_CIPHER_SERVER_PREFERENCE } from 'constants';
const morgan = require('morgan');
const schema = require('./schema/schema');

dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;

//we might need to configure this line somehow for users running behind a proxy
// app.set('trust proxy', 1)
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});
const RedisStore = connectRedis(session);

//_________________________________REDIS SUBSCRIBER_________________________________//
const redisSubscriber = redis.createClient();
const redisPublisher = redis.createClient();

//______________________Subscribe to an event_________________________//
redisSubscriber.on('message', (event, data) => {
  // event = {compnaies{name}}, data = redis response
  try {
    console.log('Received changed data :' + data);
    // find this query in the redis client,
    redisClient.del(event, (err, res) => {
      const result = res === 1 ? 'Deleted Successfully' : 'not deleted';
      console.log(result);
    });
  } catch (err) {
    console.log(err);
  }
});

//___________________Publish an event____________________// listens for mutation and publishes to subscribers, broadcaster only sends string

const publisherQuery = (req: Request, res: Response, next: NextFunction) => {
  console.log('inside publish query');
  // req.params.query == {{companies}name}
  // Publish the change to redis
  //check if the params contains "mutation", skip
  if (req.params.query.slice(0, 8) !== 'mutation') return next();
  // mutation{addCompany(name:"Easyf", company_id: 2) { user_id name company_id }}
  if (req.params.query.slice(9, 19) == 'addCompany') {
    redisPublisher.publish('addCompany', 'event was emitted');
    setTimeout(() => {
      next();
    }, 5);
  } else {
    next();
  }
};

// { query, variables, operationName, raw }

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

const getQuery = (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.graphQLResponse) return next();
  // query={{companies}name}
  graphql(schema, req.params.query).then((response) => {
    console.log('getQuery middleware responded with', response.data);
    // where we would subscribe to updates to this query
    // this key is subscribed to any mutations to companies
    // companies{name} // addCompany, updateCompany, deleteCompany
    // mutation{addCompany(name:"Easyf", company_id: 2) { user_id name company_id }}
    // req.params.query = {companies{name}}
    let tableRoot = `${req.params.query}`;
    tableRoot = tableRoot.slice(1, 9);
    if (tableRoot == 'companies') {
      // subscribe to addCompany, deleteCompany..
      redisSubscriber.subscribe('addCompany');
      redisSubscriber.subscribe('updateCompany');
      redisSubscriber.subscribe('deleteCompany');
    }
    res.locals.graphQLResponse = response.data;
    // store to redis
    // sets the query as the key, with a 10 minutes expiration value from the first query.
    redisClient.setex(
      req.params.query,
      600,
      JSON.stringify(res.locals.graphQLResponse)
    );
    next();
  });
};

app.get('/testing', getQuery, (req, res, next) => {
  console.log('this is going to be saved as redis key', res.locals.query);
  console.log(
    'this is going to be saved as redis value',
    res.locals.graphQLResponse
  );
  res.send(res.locals.graphQLResponse);
});

const checkRedis = (req: Request, res: Response, next: NextFunction) => {
  console.log('req.params.query is ', req.params.query);

  redisClient.get(`${req.params.query}`, (error, values) => {
    if (error) {
      console.log('redis error', error);
      res.send(error);
    }
    if (!values) {
      console.log('query was not a key in redis session');
      return next();
    } else {
      console.log('query was found in cache');
      const redisValues = JSON.parse(`${values}`);
      console.log('redis Values are', redisValues);
      res.locals.graphQLResponse = redisValues;
      next();
    }
  });
};
// cachetest?{users{name}}
app.get(
  '/cachetest/:query',
  publisherQuery,
  checkRedis,
  getQuery,
  (req, res, next) => {
    res.send(res.locals.graphQLResponse);
  }
);

app.get('/', (req: Request, res: Response) => {
  return res.status(200).sendFile(path.join(__dirname, './views/index.html'));
});

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
