
//const oldFields = {companies:["company_id"," description", {employee: [ "name"]} ]}

// const oldFields = {companies:{"company_id": true," description": true, employee:  {"name": true} }}

// {employee: ["user_id", "name"]}

const newFields = {companies:["company_id","name",{"employee": ["user_id", "name"]}]}

// const newFields = {companies:{"company_id":true, "name":true, "employee": {"user_id":true}}}

// {"employee": ["user_id"]}
//  const oldFields = {companies:{"company_id": true, "description": true}}
const oldFields = {companies:["company_id", "description",{"employee": ["user_id"]}]}

// const companiesFields = [company_id]

// const company1Fields = [company_id, description, name, employees, name, ]

// const objectkeysArr = [company_id, description, name]

// const newFields = {companies:{"company_id":true, "name":true}}



// const finalResult = {companies:{"company_id":true, "description": true, employee: {"user_id":true, "name":true}}}




const merge = (obj1, obj2) => {
    return Object.keys(obj1).reduce(function(result, next) {
      if (Array.isArray(obj1[next]) && Array.isArray(obj2[next])) {
        result[next] = obj1[next].concat(obj2[next]);
      } else if (obj1[next] && obj2[next]) {
        result[next] = obj2[next];
      }
      return result;
    }, {});

}


    console.log(merge(newFields, oldFields))












 //we need to grab all fields put them in new place and compare them to both objects
    //add missing fields to bigger array if === size than take old one
    //convert to queryable format and send to db
    // const keys = Object.keys(oldFields) && Object.keys(newFields)
// const completeQuerySet = (oldFields, newFields) => {
//     const key = Object.keys(oldFields);

//     // oldFields[key].forEach()
//    // if(typeof oldFields === "object" ){
       
//    if(Array.isArray(oldFields[key])){
//        for(let el of oldFields[key]){
//         if(typeof el === "string"){
//             if(!newFields[key].includes(el)){
//                 newFields[key].push(el);
//             }
//         }else{
//             console.log("OBJECT", el)
//             console.log("OBJECT KEY", Object.keys(el))
//             const nesting = Object.keys(el)
//             newFields[key].push(completeQuerySet( nesting  ,el));

//         }

//     }
//    }
//    return newFields

// }
// completeQuerySet(oldFields, newFields);