import express from "express";
import path from "path";
const app = express();
let PORT = 8080

// dotenv.config();
app.use(express.json())

// app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req,res)=>{
    return res.status(200).sendFile(path.join(__dirname, './views/index.html'));
})




app.listen( PORT, () => {
    console.log( `server started at http://localhost:${ PORT }` );
} );