<div  align="center">

<img src="https://github.com/oslabs-beta/Atlantis/blob/master/Readme_banner.png" width="800px" align="center"/>

  <h1>Atlantis-Cache</h1>

  <p>Light-weight server-side caching solution for GraphQL.</p>
<a href="https://github.com/oslabs-beta/Atlantis/blob/main/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/oslabs-beta/Atlantis"></a>
 <a href="https://www.npmjs.com/package/atlantis-cache"> <img alt="npm" src="https://img.shields.io/npm/v/atlantis-cache"></a>
<a href="https://github.com/oslabs-beta/Atlantis/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/oslabs-beta/Atlantis"></a>

</div>


## About

Atlantis is a light-weight library that solves the issue of storing and maintaining deeply-nested GraphQL queries This ensures the client always receives the most relevant data as mutations are made to the database.
Atlantis leverages Redis’s ‘in-memory’ quick lookup time to rapidly serve up cached graphQL responses regardless of size or structure.Redis integration along with Pub/Sub architecture also allows for scaling as your needs grow and you require more cache space or backup cache workers. New queries that bare resemblance to previous queries, are intelligently pulled from the existing cached nesting instead of creating a new key/value entry.

This package is meant to work in conjunction with Redis. For more information about Redis: check out: <a href ="https://redis.io/">Redis</a>

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![atlantis_demo](https://user-images.githubusercontent.com/36866275/122622799-79457e00-d05f-11eb-9d00-564df61f9289.gif)


## Getting Started

### 1. Installing and Connecting to a Redis Server

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

## License

This product is licensed under the MIT License - see the LICENSE.md file for details.‌

This product is accelerated by OS Labs.
