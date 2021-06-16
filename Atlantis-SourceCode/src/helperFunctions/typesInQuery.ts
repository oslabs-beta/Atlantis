
/* extract __typenames after making a database request with Regex */
const typesInQuery = (graphQLResponse: any) => {
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

export { typesInQuery };
