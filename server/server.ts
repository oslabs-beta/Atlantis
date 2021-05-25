import express, { Application, Request, Response, NextFunction } from 'express';
//the extra variables available from express define express types
import path from 'path';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import redis from 'redis';
import { graphqlHTTP } from 'express-graphql';
// import schema from '../schema.graphql';

//if curious see package.json, had to install types for some of these dependencies to work with TS

dotenv.config();
const app: Application = express();

app.use(
  '/graphql',
  graphqlHTTP({
    // schema is required for this to work
    // once imported we can load up graphIql
    schema,
    graphiql: true,
  })
);
//const PORT = 3000
//const PORT: number = parseInt(process.env.PORT as string, 3000);
const PORT = process.env.PORT || 3001;
const REDIS_PORT: any = process.env.REDIS_PORT;
//const REDIS_POR T: number = parseInt(process.env.REDIS_PORT as string, 6379);
//console.log(REDIS_PORT)
const client = redis.createClient(parseInt(REDIS_PORT));
app.use(express.json());
// app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req: Request, res: Response) => {
  return res.status(200).sendFile(path.join(__dirname, './views/index.html'));
});

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
