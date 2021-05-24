import express, {Application, Request, Response, NextFunction} from "express";
//the extra variables available from express define express types
import path from "path";
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import redis from 'redis'
//if curious see package.json, had to install types for some of these dependencies to work with TS

dotenv.config();

//notice no require in ts, there is just an import ___ from _____

const PORT: number = parseInt(process.env.PORT as string, 3000);
//const PORT = process.env.PORT || 3000;
const REDIS_PORT: number = parseInt(process.env.REDIS_PORT as string, 6379);
//console.log(REDIS_PORT)
const client = redis.createClient(REDIS_PORT)



const app: Application = express();
app.use(express.json())



// app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req: Request, res: Response)=>{
    return res.status(200).sendFile(path.join(__dirname, './views/index.html'));
})




app.listen( PORT, () => {
    console.log( `server started at http://localhost:${ PORT }` );
} );