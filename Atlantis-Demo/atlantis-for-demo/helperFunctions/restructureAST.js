"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restructureAST = void 0;
const graphql_1 = require("graphql");
const restructureAST = (AST) => {
    let fields_Object;
    let layer = '';
    graphql_1.visit(AST, {
        SelectionSet(node, key, parent) {
            if (parent.kind === 'Field') {
                const tempObj = {};
                const parentName = parent.name.value;
                if (layer.length === 0) {
                    layer = parentName;
                }
                const tempArray = [];
                node.selections.forEach((e) => tempArray.push(e.name.value));
                tempObj[parentName] = tempArray;
                if (!fields_Object) {
                    fields_Object = tempObj;
                }
                else {
                    fields_Object[layer].forEach((e, i) => {
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
exports.restructureAST = restructureAST;
//# sourceMappingURL=restructureAST.js.map