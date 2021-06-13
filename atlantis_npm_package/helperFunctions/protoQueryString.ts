// Parse through AST proto and convert it into a GQL query string
const protoQueryString = (obj: any, protoArgs: any) => {
    const argsToQuery = (protoArgs: any) => {
      let string = "";
      for (let key in protoArgs) {
        for (let innerKey in protoArgs[key]) {
          // accounts for edge case where an Int is passed in as an arguement.
          if (!isNaN(protoArgs[key][innerKey])) {
            string += innerKey + ": " + protoArgs[key][innerKey] + " ";
            break;
          }
          string += innerKey + ": " + '"' + protoArgs[key][innerKey] + '"' + " ";
        }
      }
      return "(" + string + ")";
    };
  
    let mainString = "";
    for (let key in obj) {
      if (typeof obj[key] !== "object") {
        mainString += " " + key + " ";
      } else {
        mainString += " " + key + " ";
        if (protoArgs) {
          if (typeof protoArgs[key] == "object") {
            const inner = argsToQuery(protoArgs);
            mainString += inner;
          }
        }
        mainString += protoQueryString(obj[key], {});
      }
    }
    return "{" + mainString + "}";
  };

  export {protoQueryString};