import express, { Application, Request, Response, NextFunction } from 'express';
//the extra variables available from express define express types
import path from 'path';
import dotenv from 'dotenv';
import redis from 'redis';
//if curious see package.json, had to install types for some of these dependencies to work with TS
import { graphqlHTTP } from 'express-graphql';
import { graphql, visit, parse, BREAK } from 'graphql';
const morgan = require('morgan');
const schema = require('./schema/schema');
// const { atlantis } = require('atlantis-cache');
const { atlantis } = require('../src/index');
const { performance } = require('perf_hooks');

dotenv.config();
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

const app: Application = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './views')));


app.use('/atlantis', atlantis(redisClient, schema), async (req, res) => {
  console.log('dif is', res.locals.dif);
  return res.status(202).json({ data: res.locals.graphQLResponse, responseTime: res.locals.dif });
});

app.use('/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
)


const PORT = process.env.PORT || 3000


app.get('/', (req: Request, res: Response) => {
  return res.status(200).sendFile(path.join(__dirname, './views/index.html'));
});

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
