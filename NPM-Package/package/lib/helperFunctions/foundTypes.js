"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foundTypes = void 0;
//extract __typenames after GraphQL Response
const foundTypes = (graphQLResponse) => {
    const stringy = JSON.stringify(graphQLResponse);
    let regex = /(__typename)\":\"(.+?)\"/g;
    let found = new Set(stringy.match(regex));
    const subArr = [];
    for (let item of found) {
        let newItem = item.slice(13, -1);
        subArr.push(newItem);
    }
    return subArr;
};
exports.foundTypes = foundTypes;
//# sourceMappingURL=foundTypes.js.map