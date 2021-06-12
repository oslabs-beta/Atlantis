
const ObjectFilter = (jsonObj, queryArr)=>{
  let resultObj = {};

//iterate thorugh queryArr
queryArr.forEach(field => {
   //if ele is a string, get teh data
  if(typeof field === "string"){
    resultObj[field] = jsonObj[field];
  }else{
    const fieldName = Object.keys(field)[0];
    if(jsonObj[fieldName] === null){
      resultObj[fieldName] = null;
    }else if(Array.isArray(jsonObj[fieldName])){
      resultObj[fieldName] = jsonObj[fieldName].map(obj =>{
        return ObjectFilter(obj, field[fieldName]);
    });
    }else if (typeof jsonObj[fieldName]  === "object"){
      resultObj[fieldName] = ObjectFilter(jsonObj[fieldName],field[fieldName] );
    }
  }
})

 return resultObj;
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
        result[key] = valueJsonObj.map(obj =>{
          return ObjectFilter(obj, valueOfQueryObj)
        })
        // result[key] = DuplicatedArr(valueJsonObj,valueOfQueryObj);
      }else if(typeof valueJsonObj === "object"){
        result[key] = ObjectFilter(valueJsonObj, valueOfQueryObj);
      }

    })
    
  	return result;
}

const nulldata = {
  "companies": [
    {
      "company_id": 3,
      "name": "square",
      "description": "digital payment",
      "employees": [
        {
          "user_id": 19,
          "name": "Sett's Sister",
          "company_id": 3
        },
        {
          "user_id": 20,
          "name": "Eazy",
          "company_id": 3
        },
        {
          "user_id": 21,
          "name": "Eazy",
          "company_id": 3
        },
        {
          "user_id": 22,
          "name": "Eazy",
          "company_id": 3
        }
      ]
    },
    {
      "company_id": 4,
      "name": "Amazon",
      "description": "creator of audible",
      "employees": [
        {
          "user_id": 14,
          "name": "Kellen",
          "company_id": 4
        },
        {
          "user_id": 43,
          "name": "john",
          "company_id": 4
        },
        {
          "user_id": 44,
          "name": "johe",
          "company_id": 4
        },
        {
          "user_id": 45,
          "name": "johe",
          "company_id": 4
        },
        {
          "user_id": 46,
          "name": "Test2",
          "company_id": 4
        }
      ]
    },
    {
      "company_id": 6,
      "name": "Disney",
      "description": "movies",
      "employees": null
    },
    {
      "company_id": 8,
      "name": "Tesla",
      "description": "EV",
      "employees": []
    },
    {
      "company_id": 10,
      "name": "Starbucks",
      "description": "coffee",
      "employees": []
    },
    {
      "company_id": 11,
      "name": "Twitter",
      "description": "social network",
      "employees": []
    },
    {
      "company_id": 12,
      "name": null,
      "description": null,
      "employees": null
    },
    {
      "company_id": 13,
      "name": "GME",
      "description": "games",
      "employees": null
    },
    {
      "company_id": 14,
      "name": "GMX",
      "description": "games",
      "employees": null
    },
    {
      "company_id": 15,
      "name": "GMX",
      "description": "games",
      "employees": null
    },
    {
      "company_id": 16,
      "name": "Instabloomer",
      "description": "Grow Instagram followings",
      "employees": []
    },
    {
      "company_id": 17,
      "name": "Cool Comfort1",
      "description": "cooling",
      "employees": []
    },
    {
      "company_id": 18,
      "name": "Cool Comfort2",
      "description": "cooling",
      "employees": []
    },
    {
      "company_id": 19,
      "name": "CoolComfort 7",
      "description": "things",
      "employees": []
    },
    {
      "company_id": 20,
      "name": "CoolComfort 8",
      "description": "things",
      "employees": []
    },
    {
      "company_id": 21,
      "name": "Cool Comfort9",
      "description": "cooling",
      "employees": null
    },
    {
      "company_id": 22,
      "name": "Cool Comfort11",
      "description": "cooling",
      "employees": null
    },
    {
      "company_id": 23,
      "name": "Dell",
      "description": "computers",
      "employees": []
    },
    {
      "company_id": 24,
      "name": "Hydroflask",
      "description": "waterbottles",
      "employees": null
    },
    {
      "company_id": 2,
      "name": "Googles",
      "description": "SES",
      "employees": [
        {
          "user_id": 3,
          "name": "Sett",
          "company_id": 2
        },
        {
          "user_id": 4,
          "name": "ErikR",
          "company_id": 2
        },
        {
          "user_id": 2,
          "name": "Coral Updated",
          "company_id": 2
        },
        {
          "user_id": 18,
          "name": "Sett's Brother",
          "company_id": 2
        },
        {
          "user_id": 23,
          "name": "Eazy",
          "company_id": 2
        },
        {
          "user_id": 25,
          "name": "Testing1",
          "company_id": 2
        },
        {
          "user_id": 26,
          "name": "Testing1",
          "company_id": 2
        },
        {
          "user_id": 27,
          "name": "AJ",
          "company_id": 2
        },
        {
          "user_id": 28,
          "name": "EasyE",
          "company_id": 2
        },
        {
          "user_id": 30,
          "name": "Easy1",
          "company_id": 2
        },
        {
          "user_id": 31,
          "name": "Coral2",
          "company_id": 2
        },
        {
          "user_id": 32,
          "name": "Easyf",
          "company_id": 2
        },
        {
          "user_id": 33,
          "name": "Easyk",
          "company_id": 2
        },
        {
          "user_id": 34,
          "name": "Easyl",
          "company_id": 2
        },
        {
          "user_id": 35,
          "name": "Easym",
          "company_id": 2
        },
        {
          "user_id": 36,
          "name": "Easyn",
          "company_id": 2
        },
        {
          "user_id": 37,
          "name": "Easyo",
          "company_id": 2
        },
        {
          "user_id": 38,
          "name": "Easyp",
          "company_id": 2
        },
        {
          "user_id": 39,
          "name": "Easyq",
          "company_id": 2
        },
        {
          "user_id": 40,
          "name": "Easyr",
          "company_id": 2
        },
        {
          "user_id": 41,
          "name": "Easys",
          "company_id": 2
        },
        {
          "user_id": 42,
          "name": "Easyt",
          "company_id": 2
        },
        {
          "user_id": 24,
          "name": "Scarlet",
          "company_id": 2
        },
        {
          "user_id": 1,
          "name": "Coral",
          "company_id": 2
        }
      ]
    },
    {
      "company_id": 1,
      "name": null,
      "description": null,
      "employees": []
    }
  ]
}
// const key = {"company":["description"]}

const key_data = {
  companies: ["company_id", "name" ,"description",{"employees":["company_id"]}],
};

// console.log(DuplicateFilter(nulldata, key_data));


module.exports={DuplicateFilter}