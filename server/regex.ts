//----------------------------------------------------------------INVALIDATION----------------------------------------------------------------//

// const cache2Project= {
//     "project": {
//         "project_id": 2,
//     "project_name": "Mac",
//     "project_description": "pro new feature"
//   }
// }

// //redis
// const {project{something}} = {
//   "project": {
//     "project_id": 1,
//     "project_name": "iPhone",
//     "project_description": "Iphone XI"
//   }
// }

//mutation
// const updateUser{project{something}} = {
//   "project": {
//     "project_id": 1,
//     "project_name": "iPhone",
//     "project_description": "Iphone XIXXX"
//   }
// }

//const fields = [project, project_id, project_name]

//after mutation comes in grab fields from AST. 

//compare old query from redis to incoming mutation from db and isolate keys that have changed if values are different replace with regex



//if value of key is an object call nested regex
//else if not parent call reg/regex


// const recursiveTraverse = (redis, query) => {
//     let result = ''
//     for(key in query){
//         if(!key){

            
//             //result[key] = recursiveTraverse(key, query)

    
//         }
//     }
// }


//   "first part " + recursion("remainng string", ) + "]"
//   let queryObj = launchestPast:{"mission_name": true, "launch_date_local":true, "launch_site":{"site_name_long":true}, "links"{"video_link":true}};


const SpaceX1: any = {
    launchesPast: [
      {
        mission_name: "Starlink-15 (v1.0)",
        launch_date_local: "2020-10-24T11:31:00-04:00",
        launch_site: {
          site_name_long:
            "Cape Canaveral Air Force Station Space Launch Complex 40",
        },
        links: {
          //article_link: null,
          video_link: "https://youtu.be/J442-ti-Dhg",
        },
      },
    ],
  };


let stringSpaceX: string = JSON.stringify(SpaceX1);
let queryFields: string[] = ["mission_name", "launch_date_local", "launch_site", "site_name_long", "links", "video_link"];

for(let field of queryFields){

//strField
 //let $1 = field
 //console.log(field);
 //console.log(typeof field);
  const string1: string = "launch_site";
  let str1: string = '\"' + field + '\":\{\"(.+?)\.*?}'
  let str2: string = '\"'+ field + '\":\"(.+?)\"'
   // console.log(str1);
    //console.log(str2);
//let reg = /\\\"mission_name\\\":\{\\\"(.+?)\\/


      let regexResult1 = stringSpaceX.match(new RegExp(str1, 'g'))
      let regexResult2 = stringSpaceX.match(new RegExp(str2, 'g'))
    //const working = regexResult.test(stringSpaceX)
      console.log(regexResult1)
      //console.log(regexResult2)
    //console.log(regexResult)
//match the field to a regex
//then locate and match the subsequent value 


}


const reg1 = /field/
const reg2 = /\"field\":\"(.+?)\"/
//one regex for key, one for value and 1 for nested value
//if field matches key, and key is not nested run one regex 
//else run nested regex