const { resourceUsage } = require("process");

// Type JavaScript here and click "Run Code" or press Ctrl + s
console.log('Hello, world!');

// queryArr = [ "project_id", "project_name"]
// jsonOjb= {
//   "project_id": 1,
//   "project_name": "iPhone",
//   "company_id": 2,
//   "project_description": null
// }
//you are inside an object
const ObjectFilter = (jsonObj, queryArr)=>{
  let resultObj = {};
  let nested;
//iterate thorugh queryArr
queryArr.forEach(field => {
   //if ele is a string, get teh data
  if(typeof field === "string"){
    resultObj[field] = jsonObj[field];
  }else{
    nested = field;
}})
if(nested){
    const key = Object.keys(nested)[0];
    resultObj[key] = DuplicatedArr(jsonObj[key],nested[key]);
}
 return resultObj;
}

//iterate through arr and push the new object  to result arr
function DuplicatedArr(jsonArr,queryObj){
  resultArr = [];
  jsonArr.forEach(obj => {
    resultArr.push(ObjectFilter(obj, queryObj));;


  })
  return resultArr;
  
}

   //parent function that checks if nesting is array or object and triggers aplicable helper                        
                      //   v redis v    
   function DuplicateFilter(jsonObj, queryObj){
  const result = {};
  //if it's an ojbect, turn it into keys 
  	//get the value and iterate throught eh array
  
    Object.keys(jsonObj).forEach(key => {
    //for every key in redis create a key of its key
      const valueJsonObj = jsonObj[key];
      const valueOfQueryObj = queryObj[key];
      //check if value is a an array
      if(Array.isArray(valueJsonObj)){
        result[key] = DuplicatedArr(valueJsonObj,valueOfQueryObj);
      }else{
        result[key] = ObjectFilter(valueJsonObj, valueOfQueryObj);
      }
    })
    
  	return result;
}

const data = {
  "project": {
    "project_id": 1,
    "project_name": "iPhone",
    "company_id": 2,
    "project_description": null
  }
}
const data2 = {"project": [
    {
      "project_id": 1,
      "project_name": "iPhone",
      "company_id": 2,
      "project_description": null
    },
    {
      "project_id": 3,
      "project_name": "google map",
      "company_id": 1,
      "project_description": null
    },
    {
      "project_id": 4,
      "project_name": "POS System",
      "company_id": 3,
      "project_description": "Accept Credit cards"
    }
]
}

const data3 = {
companies: [
  {
    company_id: 3,
    name: "square",
    description: "digital payment",
    employees: [
      {
        user_id: 19,
        name: "Sett's Sister",
        company_id: 3,
      },
      {
        user_id: 20,
        name: "Eazy",
        company_id: 3,
      },
      {
        user_id: 21,
        name: "Eazy",
        company_id: 3,
      },
      {
        user_id: 22,
        name: "Eazy",
        company_id: 3,
      },
    ],
  },
],
};
const queryData = {project: ["project_id","project_name"]}

const key_data = {
  companies: ["company_id", "name", {"employees": ["user_id", "name"]}],
};




console.log(DuplicateFilter(data3,key_data));

