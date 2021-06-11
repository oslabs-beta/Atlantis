
// Type JavaScript here and click "Run Code" or press Ctrl + s
console.log('Hello, world!');

//you are inside an object
const ObjectFilter = (jsonObj, queryArr)=>{
  let resultObj = {};

//iterate thorugh queryArr
queryArr.forEach(field => {
   //if ele is a string, get teh data
  if(typeof field === "string"){
    resultObj[field] = jsonObj[field];
  }else{
    const fieldName = Object.keys(field)[0];
    if(Array.isArray(jsonObj[fieldName])){
    resultObj[fieldName] = jsonObj[fieldName].map(obj =>{
      return ObjectFilter(obj, field[fieldName]);
    });
    }else{
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

const spaceX = {
  launchesPast: [
    {
      mission_name: "Starlink-15 (v1.0)",
      launch_date_local: "2020-10-24T11:31:00-04:00",
      launch_site: {
        site_name_long:
          "Cape Canaveral Air Force Station Space Launch Complex 40",
      },
      links: {
        article_link: null,
        video_link: "https://youtu.be/J442-ti-Dhg",
      },
    },
    {
      mission_name: "Sentinel-6 Michael Freilich",
      launch_date_local: "2020-11-21T09:17:00-08:00",
      launch_site: {
        site_name_long: "Vandenberg Air Force Base Space Launch Complex 4E",
      },
      links: {
        article_link:
          "https://spaceflightnow.com/2020/11/21/international-satellite-launches-to-extend-measurements-of-sea-level-rise/",
        video_link: "https://youtu.be/aVFPzTDCihQ",
      },
    },
    {
      mission_name: "Crew-1",
      launch_date_local: "2020-11-15T19:27:00-05:00",
      launch_site: {
        site_name_long: "Kennedy Space Center Historic Launch Complex 39A",
      },
      links: {
        article_link:
          "https://spaceflightnow.com/2020/11/16/astronauts-ride-spacex-crew-capsule-in-landmark-launch-for-commercial-spaceflight/",
        video_link: "https://youtu.be/bnChQbxLkkI",
      },
    },
    {
      mission_name: "GPS III SV04 (Sacagawea)",
      launch_date_local: "2020-11-05T18:24:00-05:00",
      launch_site: {
        site_name_long:
          "Cape Canaveral Air Force Station Space Launch Complex 40",
      },
      links: {
        article_link:
          "https://spaceflightnow.com/2020/11/06/spacex-launches-gps-navigation-satellite-from-cape-canaveral/",
        video_link: "https://youtu.be/wufXF5YKR1M",
      },
    },
    {
      mission_name: "Starlink-14 (v1.0)",
      launch_date_local: "2020-10-24T11:31:00-04:00",
      launch_site: {
        site_name_long:
          "Cape Canaveral Air Force Station Space Launch Complex 40",
      },
      links: {
        article_link:
          "https://spaceflightnow.com/2020/10/24/spacex-adds-another-60-satellites-to-starlink-network/",
        video_link: "https://youtu.be/2gbVgTxLgN0",
      },
    },
    {
      mission_name: "Starlink-13 (v1.0)",
      launch_date_local: "2020-10-18T08:25:00-04:00",
      launch_site: {
        site_name_long: "Kennedy Space Center Historic Launch Complex 39A",
      },
      links: {
        article_link:
          "https://spaceflightnow.com/2020/10/18/spacex-launches-another-batch-of-starlink-satellites/",
        video_link: "https://youtu.be/UM8CDDAmp98",
      },
    },
    {
      mission_name: "Starlink-12 (v1.0)",
      launch_date_local: "2020-10-06T07:29:00-04:00",
      launch_site: {
        site_name_long: "Kennedy Space Center Historic Launch Complex 39A",
      },
      links: {
        article_link: null,
        video_link: "https://youtu.be/8O8Z2yPyTnc",
      },
    },
    {
      mission_name: "Starlink-11 (v1.0)",
      launch_date_local: "2020-09-03T08:46:00-04:00",
      launch_site: {
        site_name_long: "Kennedy Space Center Historic Launch Complex 39A",
      },
      links: {
        article_link: null,
        video_link: "https://youtu.be/_j4xR7LMCGY",
      },
    },
    {
      mission_name: "SAOCOM 1B, GNOMES-1, Tyvak-0172",
      launch_date_local: "2020-08-30T19:18:00-04:00",
      launch_site: {
        site_name_long:
          "Cape Canaveral Air Force Station Space Launch Complex 40",
      },
      links: {
        article_link:
          "https://spaceflightnow.com/2020/08/31/spacex-launches-first-polar-orbit-mission-from-florida-in-decades/",
        video_link: "https://youtu.be/P-gLOsDjE3E",
      },
    },
    {
      mission_name: "Starlink-10 (v1.0) & SkySat 19-21",
      launch_date_local: "2020-08-18T10:31:00-04:00",
      launch_site: {
        site_name_long:
          "Cape Canaveral Air Force Station Space Launch Complex 40",
      },
      links: {
        article_link:
          "https://spaceflightnow.com/2020/08/18/spacex-adds-more-satellites-to-ever-growing-starlink-network/",
        video_link: "https://youtu.be/jTMJK7wb0rM",
      },
    },
  ],
};

const spaceXQuery = {launchesPast: ["mission_name","launch_date_local",{"launch_site": ["article_link"]},{"links": [ "article_link"]}]};
const queryData = {project: ["project_id","project_name"]}

const key_data = {
  companies: ["company_id", "name", {"employees": ["user_id", "name", ]}],
};
// {companies: {"companies": true, "name": true,}}


const result = DuplicateFilter(spaceX ,spaceXQuery);
// console.log(result["launchesPast"]);
console.log(result);