"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.structureToString = void 0;
// Parse through AST proto and convert it into a GQL query string
const structureToString = (queryStructure, queryArgs) => {
    const argsToQuery = (queryArgs) => {
        let string = '';
        for (let key in queryArgs) {
            for (let innerKey in queryArgs[key]) {
                // accounts for edge case where an Int is passed in as an arguement.
                if (!isNaN(queryArgs[key][innerKey])) {
                    string += innerKey + ': ' + queryArgs[key][innerKey] + ' ';
                    break;
                }
                string += innerKey + ': ' + '"' + queryArgs[key][innerKey] + '"' + ' ';
            }
        }
        return '(' + string + ')';
    };
    let mainString = '';
    for (let key in queryStructure) {
        if (typeof queryStructure[key] !== 'object') {
            mainString += ' ' + key + ' ';
        }
        else {
            mainString += ' ' + key + ' ';
            if (queryArgs) {
                if (typeof queryArgs[key] == 'object') {
                    const inner = argsToQuery(queryArgs);
                    mainString += inner;
                }
            }
            mainString += structureToString(queryStructure[key], {});
        }
    }
    return '{' + mainString + '}';
};
exports.structureToString = structureToString;
//# sourceMappingURL=structureToString.js.map