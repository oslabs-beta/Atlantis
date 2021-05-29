import express, { Application, Request, Response, NextFunction } from 'express';
import session from 'express-session';
const schema = require('../schema/schema');
import { graphql } from 'graphql';
import redis from 'redis';
import connectRedis from 'connect-redis';



const RedisStore = connectRedis(session);

const redisClient = redis.createClient({
    host: 'localhost',
    port: Number(process.env.REDIS_PORT),
  });

  const startSession =() => {
      session({
        store: new RedisStore({
          client: redisClient,
          disableTouch: true,
        }),
        secret: 'foundAtlantis',
        saveUninitialized: false,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
        },
        resave: false,
      })
  }

const bigAssFunction = (req: Request, res: Response, next: NextFunction) => {

  const getQuery = () => {
    if (res.locals.graphQLResponse) return next();
    graphql(schema, req.params.query).then((response) => {
      console.log('getQuery middleware responded with', response.data);
      res.locals.graphQLResponse = response.data;
      (req.session as any)[req.params.query] = res.locals.graphQLResponse;
      next();
    });
  };
  
  const checkRedis = () => {
    console.log('req.sessionID is ', req.sessionID);
    redisClient.get(`sess:${req.sessionID}`, (error, values) => {
      if (error) {
        console.log('redis error', error);
        res.send(error);
      }
      console.log('req params are', req.params.query);
      const redisValues = JSON.parse(`${values}`);
      if (!redisValues[req.params.query]) {
        console.log('query was not a key in redis session');
        return getQuery();
      } else {
        console.log('query was found in cache');
        const cachedValue = redisValues[req.params.query];
        console.log('redis cachedValue is ', cachedValue);
        res.locals.graphQLResponse = cachedValue;
        next();
      }
    });
  };

  checkRedis();

}

module.exports = bigAssFunction, startSession;