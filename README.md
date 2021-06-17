<div  align="center">
<img src="https://github.com/settnaing199/npm-package-test/blob/main/Screen%20Shot%202021-06-15%20at%202.36.35%20PM.png" width="300px" align="center"/>
  <h1>Atlantis-Cache</h1>
  <p>Light-weight server-side caching solution for GraphQL</p>
<img alt="DUB" src="https://img.shields.io/dub/l/atlantis-cache">


</div>

## About

Atlantis is a light-weight library that leverages Redis key-value store to dynamically cache GraphQL queries as responses. Atlantis is able to dynamically store deeply-nested queries and maintain the most recent and relevant data as mutations are made to the database. Queries that are more shallow and within the scope of previous queries are pulled directly from the cache, offering further flexibility and precision, without additional network requests or overriding previous key-values.

## Getting Started

### 1. Installing and Connecting to a Redis Server

This package is meant to work in conjunction with redis. To install redis:

- Mac-HomeBrew:

  - At the terminal, `brew install redis`
  - Start redis server with `redis-server`
  - Test if redis server is running: `redis-cli ping`. If it replies “PONG”, then it’s good to go!
  - Default port is `6379` (Keep note of the port)

- Linux or non-Homebrew:
  - Download appropriate version of Redis from [redis.io/download](redis.io/download)
  - Follow the instructions
  - Once installation is completed, start redis server with `redis-server`
  - Default port is `6379` (Keep note of the port)

### 2. Installing Atlantis-Cache

Install Atlantis-Cache as an npm module and save it to your package.json as a dependency.

`npm i atlantis-cache`

## How to Use Atlantis-Cache

```js
const express = require('express');
const redis = require('redis');
const { graphql } = require('graphql');
const schema = require('./schema/schema');
const { atlantis } = require('atlantis-cache');

const app = express();

// Configure your redis client
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

// Define your endpoint for graphQL queries and pass in your redis, and schema
app.use('/graphql', atlantis(redisClient, schema), async (req, res) => {
  return res.status(202).json({ data: res.locals.graphQLResponse });
});
```

## Contributors:

- Coral Fussman - [Github](https://github.com/coralfussman) | [Linkedin](https://www.linkedin.com/in/coral-fussman-21721538/)
- Sett Hein -[Github](https://github.com/settnaing199) | [Linkedin](https://www.linkedin.com/in/sett-hein/)
- Erik Matevosyan - [Github](https://github.com/erik-matevosyan) | [Linkedin](https://www.linkedin.com/in/erik-matevosyan/)
- Erik Rogel - [Github](https://github.com/erikjrogel) | [Linkedin](https://www.linkedin.com/in/erikjrogel/)

### Notes:

if you want to use graphQL, you can use a different endpoint for atlantis requests in devlopment. ie. app.use('/atlantis', atlants ..)
