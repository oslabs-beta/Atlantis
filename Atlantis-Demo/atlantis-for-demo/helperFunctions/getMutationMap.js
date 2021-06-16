"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMutationMap = void 0;
const getMutationMap = (schema) => {
    const mutationMap = {};
    // get object containing all root mutations defined in the schema
    const mutationTypeFields = schema._mutationType._fields;
    // if queryTypeFields is a function, invoke it to get object with queries
    const mutationsObj = typeof mutationTypeFields === 'function'
        ? mutationTypeFields()
        : mutationTypeFields;
    for (const mutation in mutationsObj) {
        // get name of GraphQL type returned by query
        // if ofType --> this is collection, else not collection
        let returnedType;
        if (mutationsObj[mutation].type.ofType) {
            returnedType = [];
            returnedType.push(mutationsObj[mutation].type.ofType.name);
        }
        if (mutationsObj[mutation].type.name) {
            returnedType = mutationsObj[mutation].type.name;
        }
        mutationMap[mutation] = returnedType;
    }
    return mutationMap;
};
exports.getMutationMap = getMutationMap;
//# sourceMappingURL=getMutationMap.js.map