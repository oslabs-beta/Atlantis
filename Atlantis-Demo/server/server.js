
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config()


const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema.js');

const {  parsingAlgo, checkRedis, makeGQLrequest, clearCache } = require('./middleware.js')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
  
app.get('/clearcache/', clearCache, (req, res, next) => {
  res.locals.placeholder = ''
  res.send(res.locals.placeholder)
})
app.get('/eriktest/:query', (req, res, next) => {
  console.log('got request', req.params)
  res.send(req.params)
})

app.get('/cachetest/:query', parsingAlgo, checkRedis, makeGQLrequest, (req, res, next) => {
  console.log('got request', req.params)
  res.send(res.locals.graphQLResponse)
})


// catch-all route handler for any requests to an unknown route
app.get('*', (req, res) => {
  console.log('catch all route hit')
  res.status(200).sendFile(path.join(__dirname, '../client/public/index.html'))});
//app.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));
  
// global error debugger 
app.use((err, req, res, next) => {
  console.log('IN ERROR, req is,', req.params)
  console.log('error is', err)
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});



app.listen(3000); //listens on port 3000 -> http://localhost:3000/

console.log('nodeENV is ', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  app.use('/build', express.static(path.join(__dirname, '../build')));
  app.get('/', (req, res) => {
    return res
      .status(200)
      .sendFile(path.join(__dirname, '../client/public/index.html'));
  });
}

// module.exports = { schema }