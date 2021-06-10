const data1 = {
  users: [
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
      user_id: 14,
      name: "Kellen",
      company_id: 4,
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
    {
      user_id: 23,
      name: "Eazy",
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
    {
      user_id: 33,
      name: "Easyk",
      company_id: 2,
    },
    {
      user_id: 34,
      name: "Easyl",
      company_id: 2,
    },
    {
      user_id: 35,
      name: "Easym",
      company_id: 2,
    },
    {
      user_id: 36,
      name: "Easyn",
      company_id: 2,
    },
    {
      user_id: 37,
      name: "Easyo",
      company_id: 2,
    },
    {
      user_id: 38,
      name: "Easyp",
      company_id: 2,
    },
    {
      user_id: 39,
      name: "Easyq",
      company_id: 2,
    },
    {
      user_id: 40,
      name: "Easyr",
      company_id: 2,
    },
    {
      user_id: 41,
      name: "Easys",
      company_id: 2,
    },
    {
      user_id: 42,
      name: "Easyt",
      company_id: 2,
    },
    {
      user_id: 43,
      name: "john",
      company_id: 4,
    },
    {
      user_id: 44,
      name: "johe",
      company_id: 4,
    },
    {
      user_id: 45,
      name: "johe",
      company_id: 4,
    },
    {
      user_id: 46,
      name: "Test2",
      company_id: 4,
    },
    {
      user_id: 24,
      name: "Scarlet",
      company_id: 2,
    },
  ],
};

const nested_data = {
  companies: [
    "company_id",
    "description",
    "name",
    { employee: ["user_id", "name", "company"] },
  ],
};

function cloneDeep(value) {
  if (Array.isArray(value)) {
    return value.map((ele) => {
      return cloneDeep(ele);
    });
  } else if (typeof value === "object") {
    console.log(value);
    return Object.keys(value).reduce((objClone, key) => {
      if (!objClone[key]) {
        objClone[key] = value;
      } else {
        objClone[key] = cloneDeep(value[key]);
      }
      return objClone;
    }, {});
  } else {
    return value;
  }
}

console.log(cloneDeep(data1));
