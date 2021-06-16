"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSubset = void 0;
/* compare incoming queryStructure and existing queryStructure in redis to determine if all the fields in the incoming query exist in the cache*/
const isSubset = (rootObj, subObj) => {
    return Object.keys(subObj).every((el) => {
        if (typeof subObj[el] == 'object') {
            return isSubset(rootObj[el], subObj[el]);
        }
        if (!subObj || !rootObj)
            return false;
        return subObj[el] === rootObj[el];
    });
};
exports.isSubset = isSubset;
//# sourceMappingURL=isSubset.js.map