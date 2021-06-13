'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.atlantis = void 0;
console.log('about to import gql in package');
const graphql_1 = require('graphql');
console.log('imported gql in package');
const helper_1 = require('./helperFunctions/helper');
console.log('atlantis is live');
const atlantis = (redisClient, schema) => (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log('atlantis route was hit');
    if (!req.body) return next();
    const AST = graphql_1.parse(req.body.query);
    const {
      proto,
      protoArgs,
      operationType,
      parentFieldName,
      fieldArray,
      fieldArgs,
    } = helper_1.parseAST(AST);
    const restructuredQuery = helper_1.duplicatedParseAST(AST);
    let querymade = helper_1.protoQueryString(proto, protoArgs);
    const redisKey = fieldArgs ? parentFieldName + fieldArgs : parentFieldName;
    if (operationType !== 'mutation') {
      redisClient.get(`${redisKey}:fields`, (error, values) => {
        if (error) {
          res.send(error);
        }
        if (!values) {
          res.locals.queryResponse = helper_1.makeGQLrequest(
            redisClient,
            schema,
            redisKey,
            querymade,
            proto,
            operationType
          );
        } else {
          const redisValues = JSON.parse(`${values}`);
          //check if cache has data that incoming queries need
          const resultFromIsSubset = helper_1.isSubset(redisValues, proto);
          //not found, fetch data from database
          if (!resultFromIsSubset) {
            res.locals.queryResponse = helper_1.makeGQLrequest(
              redisClient,
              schema,
              redisKey,
              querymade,
              proto,
              operationType
            );
          } else {
            redisClient.get(redisKey, (error, values) => {
              const redisValues = JSON.parse(`${values}`);
              res.locals.queryResponse = helper_1.parseDataFromCache(
                redisValues,
                restructuredQuery
              );
            });
          }
        }
      });
    } else {
      querymade = 'mutation' + querymade;
      res.locals.graphQLResponse = helper_1.makeGQLrequest(
        redisClient,
        schema,
        redisKey,
        querymade,
        proto,
        operationType
      );
    }
    next();
  });
exports.atlantis = atlantis;
//# sourceMappingURL=atlantis.js.map
