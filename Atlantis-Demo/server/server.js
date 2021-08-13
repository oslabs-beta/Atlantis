const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const { atlantis } = require('../atlantis-for-demo/index');

const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema.js');

const redis = require('redis');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../build/')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const redisClient = redis.createClient({
//   host: 'localhost',
//   port: 6379,
// });

app.use('/cachetest/', atlantis(redisClient, schema), (req, res) => {
  console.log('backend hit!');
  res.json({ data: res.locals.graphQLResponse, time: res.locals.dif });
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

const clearCache = (req, res, next) => {
  const log = () => {
    console.log('Redis Cache Cleared');
  };
  redisClient.flushall('ASYNC', log);
  return next();
};

app.get('/clearcache/', clearCache, (req, res, next) => {
  res.locals.completed = 'cache cleared';
  res.send(res.locals.completed);
});

//app.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(err);
  res.status(err.status || 500).send(res.locals.message);
});

app.listen(PORT, () => {
  console.log('listening to localhost 3000');
}); //listens on port 3000 -> http://localhost:3000/

// console.log('nodeENV is ', process.env.NODE_ENV);

// catch-all route handler for any requests to an unknown route
app.get('*', (req, res) => {
  console.log('catch all route hit');
  res.status(200).sendFile(path.join(__dirname, '../client/public/index.html'));
});
// module.exports = { schema }
