import { graphql, visit, parse, BREAK } from 'graphql';
import { traverseAST, structureToString, restructureAST, isSubset, parseDataFromCache } from '../src/helperFunctions/exportHelper';
import { typesInQuery } from '../src/helperFunctions/typesInQuery';

let AST: any = '';

describe('Parsing tests', () => {
  describe('travereAST: Parse a request into an AST', () => {
    it('Parse a query string and return a queryStructure object. ', () => {
      const query1: string =
        '{companies { company_id name description employees{ name } }}';
      AST = parse(query1);
      const { queryStructure, queryArgs, operationType }: any = traverseAST(AST);
      expect(typeof queryStructure).toBe('object');
    });
    it('Identify if any arguments were passed into the query.', () => {
      const query2: string = '{users(company_id:2){name}}';
      AST = parse(query2);
      const { queryStructure, queryArgs }: any = traverseAST(AST);
      expect(typeof queryArgs).toBe('object');
    });
    it('Identify if a request is a mutation or a query', () => {
      const query3: string =
        'mutation { addCompany (name: "Hydroflask" description: "waterbottles"){name}}';
      AST = parse(query3);
      const { operationType }: any = traverseAST(AST);
      expect(operationType).toBe('mutation');
    });
    it('Inject __typename as a property into a queryStructure ', () => {
      const query4: string =
        '{companies { company_id name description employees{ name } }}';
      AST = parse(query4);
      const { queryStructure }: any = traverseAST(AST);
      expect(queryStructure['companies']['__typename']).toBe(true);
    });
  });

  describe('restructureAST: Parse a request into an AST', () => {
    it('Parse a query string and return an object. ', () => {
      const query1: string =
        '{companies { company_id name description employees{ name } }}';
      AST = parse(query1);
      const restructuredQuery: Object = restructureAST(AST);
      expect(typeof restructuredQuery).toBe('object');
    });
    it('Ignore any arguments in a query', () => {
      const query2: string = '{users(company_id:2){name}}';
      const expected = { users: ["name"] }
      AST = parse(query2);
      const res: any = restructureAST(AST);
      expect(res).toEqual(expected);
    });
    it('Parse a query string that has nested fields and place them into objects', () => {
      const query4: string =
        '{companies { company_id name description employees{ name } }}';
      AST = parse(query4);
      const expected = { companies: ["company_id", "name", "description", { employees: ["name"] }] };
      const res: any = restructureAST(AST);
      expect(res).toEqual(expected);
    });
  });

  describe('structureToString: Turn an AST queryStructure into a GQL request', () => {
    it('Turn a queryStructure with no queryArgs into a query string', () => {
      const query1: string =
        '{companies { company_id name description employees{ name } }}';
      AST = parse(query1);
      const { queryStructure, queryArgs }: any = traverseAST(AST);
      const res = structureToString(queryStructure, queryArgs);
      expect(typeof res).toBe('string');
    });
    it('Turn a queryStructure with queryArgs into a query string with parens', () => {
      const query2: string =
        'mutation { addCompany (name: "Hydroflask" description: "waterbottles"){name}}';
      AST = parse(query2);
      const { queryStructure, queryArgs }: any = traverseAST(AST);
      const res = structureToString(queryStructure, queryArgs);
      expect(typeof res).toBe('string');
      expect(res.includes('(')).toBe(true);
      expect(res.includes(')')).toBe(true);
    });
    it('Account for argument types of int and string', () => {
      const query3: string = '{users(company_id:2){name}}';
      AST = parse(query3);
      const { queryStructure, queryArgs }: any = traverseAST(AST);
      const res = structureToString(queryStructure, queryArgs);
      expect(typeof res).toBe('string');
      expect(res.includes('2')).toBe(true);
    });
  });

  describe('typesInQuery: Extract out the types of data in a GQL response.', () => {
    // need to test for when there is no array returned (companyid:1)
    it('Accounts for responses that only have a single object', () => {
      const gqlResponse: Object = {
        projects: {
          project_id: 1,
          project_name: 'iPhone',
          project_description: null,
          __typename: 'Projects',
        },
      };
      const res = typesInQuery(gqlResponse);
      expect(res).toEqual(['Projects']);
    });
    it('Finds table to subscribe to when there is only 1 table.', () => {
      const gqlResponse1: Object = {
        projects: [
          {
            project_id: 1,
            project_name: 'iPhone',
            project_description: null,
            __typename: 'Projects',
          },
          {
            project_id: 4,
            project_name: 'POS System',
            project_description: 'Accept Credit cards',
            __typename: 'Projects',
          },
          {
            project_id: 6,
            project_name: 'autopilot',
            project_description: 'Self-driving vehicles',
            __typename: 'Projects',
          },
          {
            project_id: 9,
            project_name: 'Gsuite',
            project_description: null,
            __typename: 'Projects',
          },
        ],
      };
      const res = typesInQuery(gqlResponse1);
      expect(res).toEqual(['Projects']);
    });
    it('Finds tables to subscribe to when there is are nested tables.', () => {
      const gqlResponse2: Object = {
        companies: [
          {
            company_id: 3,
            name: 'square',
            description: 'digital payment',
            employees: [
              {
                name: "Sett's Sister",
                __typename: 'Users',
              },
              {
                name: 'Eazy',
                __typename: 'Users',
              },
              {
                name: 'Eazy',
                __typename: 'Users',
              },
              {
                name: 'Eazy',
                __typename: 'Users',
              },
            ],
            __typename: 'Companies',
          },
          {
            company_id: 6,
            name: 'Disney',
            description: 'movies',
            employees: [],
            __typename: 'Companies',
          },
          {
            company_id: 8,
            name: 'Tesla',
            description: 'EV',
            employees: null,
            __typename: 'Companies',
          },
          {
            company_id: 10,
            name: 'Starbucks',
            description: 'coffee',
            employees: null,
            __typename: 'Companies',
          },
        ],
      };
      const res = typesInQuery(gqlResponse2);
      expect(res).toEqual(['Users', 'Companies']);
    });
    it('Successfully subscribes to a table when there is a paramater passed in.', () => {
      const gqlResponse3: Object = {
        users: [
          {
            company_id: 4,
            name: 'Kellen',
            __typename: 'Users',
          },
          {
            company_id: 4,
            name: 'john',
            __typename: 'Users',
          },
          {
            company_id: 4,
            name: 'johe',
            __typename: 'Users',
          },
          {
            company_id: 4,
            name: 'johe',
            __typename: 'Users',
          },
          {
            company_id: 4,
            name: 'Test2',
            __typename: 'Users',
          },
        ],
      };
      const res = typesInQuery(gqlResponse3);
      expect(res).toEqual(['Users']);
    });
  });

  describe('isSubset: Check incoming fields with against cached fields', () => {
    it('Recognizes incoming query is a subquery of a cached query', () => {
      const incomingFields = { "users": { "user_id": true, "name": true } };
      const cachedFields = { "users": { "user_id": true, "name": true, "company_id": true } };
      const res = isSubset(cachedFields, incomingFields);
      expect(res).toBe(true)
    })
    it('Recognizes incoming query contains fields that are not cached', () => {
      const incomingFields = { "users": { "user_id": true, "name": true, "company_id": true } };
      const cachedFields = { "users": { "user_id": true, "name": true } };
      const res = isSubset(cachedFields, incomingFields);
      expect(res).toBe(false)
    })
    it('Recognizes incoming query has same fields in different order', () => {
      const incomingFields = { "users": { "name": true, "user_id": true } };
      const cachedFields = { "users": { "user_id": true, "name": true } };
      const res = isSubset(cachedFields, incomingFields);
      expect(res).toBe(true)
    })
    it('Recognizes incoming query is a subquery of cached query with 2 levels of nesting', () => {
      const incomingFields = { "companies": { "name": true, "company_id": true, " description": true, "employees": { "user_id": true } } };
      const cachedFields = { "companies": { "name": true, "company_id": true, " description": true, "employees": { "user_id": true, "name": true } } };
      const res = isSubset(cachedFields, incomingFields);
      expect(res).toBe(true)
    })

  })

  describe('parseDataFromCache: Parse through cached GQL responses and return requested data', () => {
    it('Extracts subset of cached object that contains objects and arrays', () => {
      const cacheData = {
        "companies": [
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
              },
              {
                "user_id": 59,
                "name": "Steve",
                "company_id": 4
              },
              {
                "user_id": 61,
                "name": "Steve",
                "company_id": 4
              }
            ]
          }
        ]
      }
      const duplicateAST = { "companies": ["name", { employees: ["user_id", "name"] }] };
      const res = parseDataFromCache(cacheData, duplicateAST);

      const expected = {
        "companies": [
          {
            "name": "Amazon",
            "employees": [
              {
                "user_id": 14,
                "name": "Kellen",

              },
              {
                "user_id": 43,
                "name": "john",

              },
              {
                "user_id": 44,
                "name": "johe",

              },
              {
                "user_id": 45,
                "name": "johe",

              },
              {
                "user_id": 46,
                "name": "Test2",

              },
              {
                "user_id": 59,
                "name": "Steve",

              },
              {
                "user_id": 61,
                "name": "Steve",

              }
            ]
          }
        ]
      }
      expect(res).toEqual(expected);
    })

    it('Extracts subset of cached object that only contains objects', () => {
      const cacheData: any = {
        "company": {
          "company_id": 4,
          "name": "Amazon",
          "description": "creator of audible"
        }
      }
      const duplicateAST: any = { company: ["company_id", "name"] };
      const res = parseDataFromCache(cacheData, duplicateAST);
      const expected = {
        "company": {
          "company_id": 4,
          "name": "Amazon",
        }
      }
      expect(res).toEqual(expected)
    })
    it('Extracts subset of cached object when a field is null', () => {
      const cacheData: any = {
        "company": {
          "company_id": 1,
          "name": null,
          "description": null
        }
      }
      const duplicateAST: any = { company: ["description", "name"] };
      const res = parseDataFromCache(cacheData, duplicateAST);
      const expected: any = {
        "company": {
          "name": null,
          "description": null
        }
      }
      expect(res).toEqual(expected)
    })

  })
});
