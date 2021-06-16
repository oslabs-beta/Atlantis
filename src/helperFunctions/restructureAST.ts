import { visit } from 'graphql';

const restructureAST = (AST: any) => {
  let fields_Object: any;
  let layer: string = '';

  visit(AST, {
    SelectionSet(node: any, key, parent: any) {
      if (parent.kind === 'Field') {
        const tempObj: any = {};
        const parentName = parent.name.value;
        if (layer.length === 0) {
          layer = parentName;
        }
        const tempArray: any = [];
        node.selections.forEach((e: any) => tempArray.push(e.name.value));
        tempObj[parentName] = tempArray;
        if (!fields_Object) {
          fields_Object = tempObj;
        } else {
          fields_Object[layer].forEach((e: any, i: any) => {
            if (e === parentName) {
              fields_Object[layer][i] = tempObj;
            }
          });
          layer = parentName;
        }
      }
    },
  });
  return fields_Object;
};

export { restructureAST };
