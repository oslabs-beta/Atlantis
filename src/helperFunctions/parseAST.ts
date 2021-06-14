import { visit, BREAK } from 'graphql';

const parseAST = (AST: any) => {
  // initialize prototype as empty object
  const proto = {};
  let isCachable: boolean;
  let parentFieldName: any;

  let operationType: any;

  let parentFieldArgs: string;

  let fieldArgs: any;

  let argsName: any;

  // initialiaze arguments as null
  let protoArgs: any = null;

  // initialize stack to keep track of depth first parsing
  const stack: any[] = [];

  /**
   * visit is a utility provided in the graphql-JS library. It performs a
   * depth-first traversal of the abstract syntax tree, invoking a callback
   * when each SelectionSet node is entered. That function builds the prototype.
   * Invokes a callback when entering and leaving Field node to keep track of nodes with stack
   *
   * Find documentation at:
   * https://graphql.org/graphql-js/language/#visit
   */
  visit(AST, {
    enter(node: any) {
      if (node.directives as any) {
        if (node.directives.length > 0) {
          isCachable = false;
          return BREAK;
        }
      }
    },
    OperationDefinition(node) {
      operationType = node.operation;
      if (node.operation === 'subscription') {
        operationType = 'unCachable';
        return BREAK;
      }
    },
    Field: {
      enter(node: any) {
        // fieldArr.push(node.name.value);
        if (node.alias) {
          operationType = 'unCachable';
          return BREAK;
        }
        if (node.arguments && node.arguments.length > 0) {
          fieldArgs = node.arguments[0].value.value;
          argsName = node.arguments[0].name.value;
          protoArgs = protoArgs || {};
          protoArgs[node.name.value] = {};

          // collect arguments if arguments contain id, otherwise make query unCachable
          // hint: can check for graphQl type ID instead of string 'id'
          for (let i = 0; i < node.arguments.length; i++) {
            const key: any = node.arguments[i].name.value;
            const value: any = node.arguments[i].value.value;

            // for queries cache can handle only id as argument
            if (operationType === 'query') {
              if (!key.includes('id')) {
                operationType = 'unCachable';
                return BREAK;
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
        }, proto);
        protoObj['__typename'] = true;
      } else {
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

export { parseAST };
