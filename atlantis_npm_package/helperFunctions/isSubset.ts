const isSubset = (superObj: any, subObj: any):boolean => {
    return Object.keys(subObj).every(ele => {
        if (typeof subObj[ele] == 'object') {
            return isSubset(superObj[ele], subObj[ele]);
        }
        if(!subObj || !superObj) return false;
        return subObj[ele] === superObj[ele]
    });
  };

  export {isSubset};