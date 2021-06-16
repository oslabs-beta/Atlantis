const express = require('express');
const redis = require('redis');
const { graphqlHTTP } = require('express-graphql');
const { graphql } = require('graphql');
const schema = require('./schema/schema');
const { atlantis } = require('atlantis-cache');

const app = express();

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

app.use('/atlantis', atlantis(redisClient, schema), async (req, res) => {
  return res.status(202).json({ data: res.locals.graphQLResponse });
});
