"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSubset = void 0;
const isSubset = (superObj, subObj) => {
    return Object.keys(subObj).every((ele) => {
        if (typeof subObj[ele] == 'object') {
            return isSubset(superObj[ele], subObj[ele]);
        }
        if (!subObj || !superObj)
            return false;
        return subObj[ele] === superObj[ele];
    });
};
exports.isSubset = isSubset;
//# sourceMappingURL=isSubset.js.map