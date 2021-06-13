"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDataFromCache = void 0;
const ObjectFilter = (jsonObj, queryArr) => {
    let resultObj = {};
    //iterate thorugh queryArr
    queryArr.forEach((field) => {
        //if ele is a string, get teh data
        if (typeof field === 'string') {
            resultObj[field] = jsonObj[field];
        }
        else {
            const fieldName = Object.keys(field)[0];
            if (jsonObj[fieldName] === null) {
                resultObj[fieldName] = null;
            }
            else if (Array.isArray(jsonObj[fieldName])) {
                resultObj[fieldName] = jsonObj[fieldName].map((obj) => {
                    return ObjectFilter(obj, field[fieldName]);
                });
            }
            else if (typeof jsonObj[fieldName] === 'object') {
                resultObj[fieldName] = ObjectFilter(jsonObj[fieldName], field[fieldName]);
            }
        }
    });
    return resultObj;
};
//parent function that checks if nesting is array or object and triggers aplicable helper
//   v redis v
function parseDataFromCache(jsonObj, queryObj) {
    const result = {};
    Object.keys(jsonObj).forEach((key) => {
        //for every key in redis create a key of its key
        const valueJsonObj = jsonObj[key];
        const valueOfQueryObj = queryObj[key];
        //check if value is a an array
        if (Array.isArray(valueJsonObj)) {
            result[key] = valueJsonObj.map((obj) => {
                return ObjectFilter(obj, valueOfQueryObj);
            });
        }
        else if (typeof valueJsonObj === 'object') {
            result[key] = ObjectFilter(valueJsonObj, valueOfQueryObj);
        }
    });
    return result;
}
exports.parseDataFromCache = parseDataFromCache;
//# sourceMappingURL=parseDataFromCache.js.map