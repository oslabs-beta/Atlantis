import express, { Application, Request, Response, NextFunction } from 'express';
//the extra variables available from express define express types
import path from 'path';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import redis from 'redis';
//if curious see package.json, had to install types for some of these dependencies to work with TS
const db = require('./model');

dotenv.config();

//notice no require in ts, there is just an import ___ from _____
//const PORT = 3000
//const PORT: number = parseInt(process.env.PORT as string, 3000);
const PORT = process.env.PORT || 3000;
const REDIS_PORT: any = process.env.REDIS_PORT;
//const REDIS_PORT: number = parseInt(process.env.REDIS_PORT as string, 6379);
//console.log(REDIS_PORT)
const client = redis.createClient(parseInt(REDIS_PORT));

const app: Application = express();
app.use(express.json());

// app.use(express.static(path.join(__dirname, '../client')));
// test route to check if our connection to the DB is working.
app.get('/testing', (req, res) => {
  const queryParams: string = 'Erik';
  const queryString: string = `SELECT * FROM public.user
                            WHERE name = $1`;

  db.query(queryString, [queryParams], (err: object, result: any) => {
    if (err) return res.send(err);
    res.send(result.rows);
  });
});

app.get('/', (req: Request, res: Response) => {
  return res.status(200).sendFile(path.join(__dirname, './views/index.html'));
});

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
