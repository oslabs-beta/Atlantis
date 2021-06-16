const fetch = require('node-fetch');
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config()
const cookieSession = require('cookie-session');
// const mwareController = require('./mwareController');
const apiRouter = require('./routes/api');
const db = require('./models')
const cors = require('cors')
// const expenseRouter = require('./routes/expense');
// const user_categoryRouter = require('./routes/user_category');
const client_id = process.env.GITHUB_CLIENT_ID
const client_secret = process.env.GITHUB_CLIENT_SECRET
const cookie_secret = process.env.COOKIE_SECRET
console.log({client_id, client_secret})


//__creating session object
app.use(
  cookieSession({
    secret: cookie_secret

}))

//__handle parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// statically serve everything in the build folder on the route '/build'
if (process.env.NODE_ENV ==='production') {
  app.use('/build', express.static(path.join(__dirname, '../build')));
  // serve index.html on the route '/'
  app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });
};
//__defining route handler
app.use('/api', apiRouter);
// app.use('/expense', expenseRouter);
// app.use('/user/category', user_categoryRouter);



// catch-all route handler for any requests to an unknown route
app.get('*', (req, res) => res.status(200).sendFile(path.join(__dirname, '../index.html')));
//app.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));

//global error debugger 
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});


app.post('/login', (req, res) => {
  return res.status(200).json();
});





  
app.listen(3000); //listens on port 3000 -> http://localhost:3000/

