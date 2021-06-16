"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverseAST = void 0;
const graphql_1 = require("graphql");
const traverseAST = (AST) => {
    // initialize variables for tracking AST extraction
    const queryStructure = {};
    let parentFieldName;
    let operationType;
    let fieldArgs;
    let argsName;
    let queryArgs = null;
    const stack = [];
    // built in GQL function that recursively vists all nodes in an AST tree
    graphql_1.visit(AST, {
        enter(node) {
            if (node.directives) {
                if (node.directives.length > 0) {
                    // if a node has directives it is uncacheable
                    operationType = 'unCacheable';
                    return graphql_1.BREAK;
                }
            }
        },
        // 
        OperationDefinition(node) {
            operationType = node.operation;
            if (node.operation === 'subscription') {
                // if a query is a subscription it is uncacheable
                operationType = 'unCacheable';
                return graphql_1.BREAK;
            }
        },
        Field: {
            enter(node) {
                if (node.alias) {
                    // if a query has an alias it is uncacheable
                    operationType = 'unCacheable';
                    return graphql_1.BREAK;
                }
                if (node.arguments && node.arguments.length > 0) {
                    fieldArgs = node.arguments[0].value.value;
                    argsName = node.arguments[0].name.value;
                    queryArgs = queryArgs || {};
                    queryArgs[node.name.value] = {};
                    // collect arguments if arguments contain id, otherwise make query unCachable
                    // hint: can check for graphQl type ID instead of string 'id'
                    for (let i = 0; i < node.arguments.length; i++) {
                        const key = node.arguments[i].name.value;
                        const value = node.arguments[i].value.value;
                        // for queries cache can handle only id as argument
                        if (operationType === 'query') {
                            if (!key.includes('id')) {
                                operationType = 'unCacheable';
                                return graphql_1.BREAK;
                            }
                        }
                        queryArgs[node.name.value][key] = value;
                    }
                }
                // add value to stack
                stack.push(node.name.value);
            },
            leave(node) {
                // remove value from stack
                stack.pop();
            },
        },
        SelectionSet(node, key, parent, path, ancestors) {
            if (parent.kind === 'Field') {
                const tempObject = {};
                for (let field of node.selections) {
                    tempObject[field.name.value] = true;
                }
                // loop through stack to get correct path in proto for temp object;
                // mutates original prototype object;
                const protoObj = stack.reduce((prev, curr, index) => {
                    return index + 1 === stack.length // if last item in path
                        ? (prev[curr] = tempObject) // set value
                        : (prev[curr] = prev[curr]); // otherwise, if index exists, keep value
                }, queryStructure);
                protoObj['__typename'] = true;
            }
            else {
                parentFieldName = node.selections[0].name.value;
            }
        },
    });
    return {
        queryStructure,
        queryArgs,
        operationType,
        parentFieldName,
        fieldArgs,
        argsName,
    };
};
exports.traverseAST = traverseAST;
//# sourceMappingURL=traverseAST.js.map