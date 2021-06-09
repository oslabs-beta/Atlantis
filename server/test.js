const ProtoQueryString = (obj, protoArgs) => {
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
    } else {
      mainString += ' ' + key + ' ';
      if (typeof protoArgs[key] == 'object') {
        console.log('hitting this!');
        const inner = argsToQuery(protoArgs);
        mainString += inner;
      }
      mainString += ProtoQueryString(obj[key], {});
    }
  }
  return '{' + mainString + '}';
};

const arg = {
  users: { user_id: true, name: true, company_id: true, __typename: true },
};

console.log(ProtoQueryString(arg, null));
