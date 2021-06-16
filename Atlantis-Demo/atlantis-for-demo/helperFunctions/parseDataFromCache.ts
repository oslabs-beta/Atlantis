
/*ParseDataFromCache traverses redis's cache and filters object properties by keys from prototype object*/
function parseDataFromCache(cacheObj: any, fieldObj: any) {
  const result: any = {};

  Object.keys(cacheObj).forEach((key) => {
    //get the value of cacheObj and FieldObj based on key
    const subCacheObj = cacheObj[key];
    const subFieldObj = fieldObj[key];
    //if subCacheObj is an array, iterate through ele and trigger ObjectFilter
    if (Array.isArray(subCacheObj)) {
      result[key] = subCacheObj.map((obj) => {
        return ObjectFilter(obj, subFieldObj);
      });
    } else if (typeof subCacheObj === 'object') {
      result[key] = ObjectFilter(subCacheObj, subFieldObj);
    }
  });
  return result;
}

/*helper function filters out object properties on current layer and invoke rescursive call if there are nested fields */
const ObjectFilter = (cacheObj: any, fieldObj: any[]) => {
  let resultObj: any = {};
  //iterate thorugh fieldObj
  fieldObj.forEach((field) => {
    //if cur field is a string, store the the properites to resultObj based on fields
    if (typeof field === 'string') {
      resultObj[field] = cacheObj[field];
    } else {
      //if cur field is an object, invoke rescurive call on ObjectFilter based on value
      const fieldName = Object.keys(field)[0];
      if (cacheObj[fieldName] === null) {
        resultObj[fieldName] = null;
      } else if (Array.isArray(cacheObj[fieldName])) {
        resultObj[fieldName] = cacheObj[fieldName].map((obj: any) => {
          return ObjectFilter(obj, field[fieldName]);
        });
      } else if (typeof cacheObj[fieldName] === 'object') {
        resultObj[fieldName] = ObjectFilter(
          cacheObj[fieldName],
          field[fieldName]
        );
      }
    }
  });

  return resultObj;
};



export { parseDataFromCache };
