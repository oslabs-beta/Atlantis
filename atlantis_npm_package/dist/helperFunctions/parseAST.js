"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAST = void 0;
const graphql_1 = require("graphql");
const parseAST = (AST) => {
    // initialize prototype as empty object
    const proto = {};
    let isCachable;
    let parentFieldName;
    let operationType;
    let parentFieldArgs;
    let fieldArgs;
    let argsName;
    // initialiaze arguments as null
    let protoArgs = null;
    // initialize stack to keep track of depth first parsing
    const stack = [];
    /**
     * visit is a utility provided in the graphql-JS library. It performs a
     * depth-first traversal of the abstract syntax tree, invoking a callback
     * when each SelectionSet node is entered. That function builds the prototype.
     * Invokes a callback when entering and leaving Field node to keep track of nodes with stack
     *
     * Find documentation at:
     * https://graphql.org/graphql-js/language/#visit
     */
    graphql_1.visit(AST, {
        enter(node) {
            if (node.directives) {
                if (node.directives.length > 0) {
                    isCachable = false;
                    return graphql_1.BREAK;
                }
            }
        },
        OperationDefinition(node) {
            operationType = node.operation;
            if (node.operation === 'subscription') {
                operationType = 'unCachable';
                return graphql_1.BREAK;
            }
        },
        Field: {
            enter(node) {
                // fieldArr.push(node.name.value);
                if (node.alias) {
                    operationType = 'unCachable';
                    return graphql_1.BREAK;
                }
                if (node.arguments && node.arguments.length > 0) {
                    fieldArgs = node.arguments[0].value.value;
                    argsName = node.arguments[0].name.value;
                    protoArgs = protoArgs || {};
                    protoArgs[node.name.value] = {};
                    // collect arguments if arguments contain id, otherwise make query unCachable
                    // hint: can check for graphQl type ID instead of string 'id'
                    for (let i = 0; i < node.arguments.length; i++) {
                        const key = node.arguments[i].name.value;
                        const value = node.arguments[i].value.value;
                        // for queries cache can handle only id as argument
                        if (operationType === 'query') {
                            if (!key.includes('id')) {
                                operationType = 'unCachable';
                                return graphql_1.BREAK;
                            }
                        }
                        protoArgs[node.name.value][key] = value;
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
                }, proto);
                protoObj['__typename'] = true;
            }
            else {
                parentFieldName = node.selections[0].name.value;
            }
        },
    });
    return {
        proto,
        protoArgs,
        operationType,
        parentFieldName,
        fieldArgs,
        argsName,
    };
};
exports.parseAST = parseAST;
//# sourceMappingURL=parseAST.js.map