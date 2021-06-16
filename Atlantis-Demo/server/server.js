const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const { clearCache } = require('./middleware');
const { atlantis } = require('../atlantis-for-demo/index');

const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema.js');

const redis = require('redis');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redisClient = redis.createClient({ host: 'localhost', port: 6379 });

app.use('/cachetest/', atlantis(redisClient, schema), (req, res) => {
  res.json({ data: res.locals.graphQLResponse, time: res.locals.dif });
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.get('/clearcache/', clearCache, (req, res, next) => {
  res.locals.completed = 'cache cleared';
  res.send(res.locals.completed);
});

// catch-all route handler for any requests to an unknown route
app.get('*', (req, res) => {
  console.log('catch all route hit');
  res.status(200).sendFile(path.join(__dirname, '../client/public/index.html'));
});
//app.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));

// global error debugger
app.use((err, req, res, next) => {
  console.log('IN ERROR, req is,', req.params);
  console.log('error is', err);
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
