// import { generateKeyPair } from "crypto";

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
//for(let i = 0; i < queryFields.length; i ++){
//       let var = `$`+i
  //let strField: string = queryFields[i]
  let strTest: string = field
//strField
 //let $1 = field
 //console.log(field);
 //console.log(typeof field);
  const string1: string = "launch_site";
  let str: string = '\"' + "launch_site"+ '\":\{\"(.+?)\.*?}'
    console.log(str);
  //     let reg = /\\\"mission_name\\\":\{\\\"(.+?)\\/
      let regexResult = new RegExp(str, 'g')
      
    const working = regexResult.test(stringSpaceX)
      console.log(working)
    //console.log(regexResult)
//match the field to a regex
//then locate and match the subsequent value 


}
console.log("hi")
