const objFilter = require("nested-object-filter");


const payload = {
    "personal": {
        "is_business": true,
        "business_name": "Business Name",
        "business_description": "Business description here",
        "gender": "Male",
    },
    "description": "more information as description",
    "meta": {
        "last-login": 1574187006717,
        "login-count": 100
    }
}

const filter_options = [
    ["personal", ["gender"]],
    ["description"] ,
    ["meta",["last-login"]]
]
const result = objFilter(payload, filter_options)

const data = {
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
      {
        company_id: 4,
        name: "Amazon",
        description: "creator of audible",
        employees: [
          {
            user_id: 14,
            name: "Kellen",
            company_id: 4,
          },
        ],
      },
      {
        company_id: 6,
        name: "Disney",
        description: "movies",
        employees: [],
      },
      {
        company_id: 8,
        name: "Tesla",
        description: "EV",
        employees: [],
      },
      {
        company_id: 10,
        name: "Starbucks",
        description: "coffee",
        employees: null,
      },
      {
        company_id: 11,
        name: "Twitter",
        description: "social network",
        employees: [],
      },
      {
        company_id: 12,
        name: null,
        description: null,
        employees: null,
      },
      {
        company_id: 13,
        name: "GME",
        description: "games",
        employees: null,
      },
      {
        company_id: 14,
        name: "GMX",
        description: "games",
        employees: null,
      },
      {
        company_id: 15,
        name: "GMX",
        description: "games",
        employees: null,
      },
      {
        company_id: 2,
        name: "Amazon?",
        description: "Brazil",
        employees: [
          {
            user_id: 3,
            name: "Sett",
            company_id: 2,
          },
          {
            user_id: 4,
            name: "ErikR",
            company_id: 2,
          },
          {
            user_id: 2,
            name: "Coral Updated",
            company_id: 2,
          },
          {
            user_id: 18,
            name: "Sett's Brother",
            company_id: 2,
          },
          {
            user_id: 23,
            name: "Eazy",
            company_id: 2,
          },
          {
            user_id: 24,
            name: "Testing",
            company_id: 2,
          },
          {
            user_id: 25,
            name: "Testing1",
            company_id: 2,
          },
          {
            user_id: 26,
            name: "Testing1",
            company_id: 2,
          },
          {
            user_id: 27,
            name: "AJ",
            company_id: 2,
          },
          {
            user_id: 28,
            name: "EasyE",
            company_id: 2,
          },
          {
            user_id: 30,
            name: "Easy1",
            company_id: 2,
          },
          {
            user_id: 31,
            name: "Coral2",
            company_id: 2,
          },
          {
            user_id: 32,
            name: "Easyf",
            company_id: 2,
          },
          {
            user_id: 1,
            name: "Erik M.",
            company_id: 2,
          },
        ],
      },
      {
        company_id: 1,
        name: "Tesla",
        description: "eV",
        employees: [],
      },
      {
        company_id: 16,
        name: "Instabloomer",
        description: "Grow Instagram followings",
        employees: [],
      },
      {
        company_id: 17,
        name: "Cool Comfort1",
        description: "cooling",
        employees: [],
      },
      {
        company_id: 18,
        name: "Cool Comfort2",
        description: "cooling",
        employees: null,
      },
      {
        company_id: 19,
        name: "CoolComfort 7",
        description: "things",
        employees: null,
      },
      {
        company_id: 20,
        name: "CoolComfort 8",
        description: "things",
        employees: null,
      },
      {
        company_id: 21,
        name: "Cool Comfort9",
        description: "cooling",
        employees: null,
      },
      {
        company_id: 22,
        name: "Cool Comfort11",
        description: "cooling",
        employees: null,
      },
      {
        company_id: 23,
        name: "Dell",
        description: "computers",
        employees: [],
      },
    ],
  };

const filter_data = [
      ["companies", ["company_id"] ]

  ]

const result_data = objFilter(data, filter_data)

console.log(result_data)
