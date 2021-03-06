import { visit, BREAK } from 'graphql';

const traverseAST = (AST: any) => {
  // initialize variables for tracking AST extraction
  const queryStructure = {};

  let parentFieldName: any;
  let operationType: any;
  let fieldArgs: any;
  let argsName: any;
  let queryArgs: any = null;
  const stack: any[] = [];

  // built in GQL function that recursively vists all nodes in an AST tree
  visit(AST, {
    enter(node: any) {
      if (node.directives as any) {
        if (node.directives.length > 0) {
          // if a node has directives it is uncacheable
          operationType = 'unCacheable';
          return BREAK;
        }
      }
    },
    // 
    OperationDefinition(node) {
      operationType = node.operation;
      if (node.operation === 'subscription') {
        // if a query is a subscription it is uncacheable
        operationType = 'unCacheable';
        return BREAK;
      }
    },
    Field: {
      enter(node: any) {
        if (node.alias) {
          // if a query has an alias it is uncacheable
          operationType = 'unCacheable';
          return BREAK;
        }
        if (node.arguments && node.arguments.length > 0) {
          fieldArgs = node.arguments[0].value.value;
          argsName = node.arguments[0].name.value;
          queryArgs = queryArgs || {};
          queryArgs[node.name.value] = {};

          // collect arguments if arguments contain id, otherwise make query unCachable
          // hint: can check for graphQl type ID instead of string 'id'
          for (let i = 0; i < node.arguments.length; i++) {
            const key: any = node.arguments[i].name.value;
            const value: any = node.arguments[i].value.value;

            // for queries cache can handle only id as argument
            if (operationType === 'query') {
              if (!key.includes('id')) {
                operationType = 'unCacheable';
                return BREAK;
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
    SelectionSet(node: any, key, parent: any, path, ancestors) {
      if (parent.kind === 'Field') {
        const tempObject: any = {};
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
      } else {
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

export { traverseAST };
