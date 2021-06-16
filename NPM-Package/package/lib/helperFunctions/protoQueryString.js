"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protoQueryString = void 0;
// Parse through AST proto and convert it into a GQL query string
const protoQueryString = (obj, protoArgs) => {
    const argsToQuery = (protoArgs) => {
        let string = '';
        for (let key in protoArgs) {
            for (let innerKey in protoArgs[key]) {
                // accounts for edge case where an Int is passed in as an arguement.
                if (!isNaN(protoArgs[key][innerKey])) {
                    string += innerKey + ': ' + protoArgs[key][innerKey] + ' ';
                    break;
                }
                string += innerKey + ': ' + '"' + protoArgs[key][innerKey] + '"' + ' ';
            }
        }
        return '(' + string + ')';
    };
    let mainString = '';
    for (let key in obj) {
        if (typeof obj[key] !== 'object') {
            mainString += ' ' + key + ' ';
        }
        else {
            mainString += ' ' + key + ' ';
            if (protoArgs) {
                if (typeof protoArgs[key] == 'object') {
                    const inner = argsToQuery(protoArgs);
                    mainString += inner;
                }
            }
            mainString += protoQueryString(obj[key], {});
        }
    }
    return '{' + mainString + '}';
};
exports.protoQueryString = protoQueryString;
//# sourceMappingURL=protoQueryString.js.map