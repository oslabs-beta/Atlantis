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

const RedisStore = connectRedis(session)
//const redisClient = redis.createClient();
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
})

app.use(session({
  store: new RedisStore({
    client: redisClient,
    disableTouch: true}),
  secret: 'foundAtlantis',
  saveUninitialized: false,
  cookie: {
    maxAge: 100 * 60 * 60 * 24 * 365 * 10,
    httpOnly: true,
    secure: false,
    sameSite: 'lax' 
},
resave: false

}))





app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));


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


interface Session {
  username?: string
}

const initializeSession = (req: Request, res: Response , next: NextFunction) => {
  (req.session as any ).username =  "username";
  return next();
}
 //next()



app.get('/', initializeSession, (req: Request, res: Response) => {
  return res.status(200).sendFile(path.join(__dirname, './views/index.html'));
});

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
