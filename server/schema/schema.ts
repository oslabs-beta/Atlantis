import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLInputObjectType
} from 'graphql';
const db = require('../model');



const CompanyType = new GraphQLObjectType({
  name: "Companies",
  fields: ()=>({
    company_id: {type: GraphQLInt},
    name: {type: GraphQLString},
    description: {type: GraphQLString}
  })
})

const UserType = new GraphQLObjectType({
  name: "Users",
  fields: ()=>({
    user_id: {type: GraphQLInt},
    name: {type: GraphQLString},
    company_id: {type: GraphQLString}
  })
})

const ProjectType = new GraphQLObjectType({
  name: "Projects",
  fields: ()=>({
    project_id: {type: GraphQLInt},
    project_name: {type: GraphQLString},
    company_id: {type: GraphQLString},
    project_description: {type: GraphQLString}
  })
})


const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description : 'Root Query',
  fields: ()=> ({

    //companies return call companies
    companies: {
      type: new GraphQLList(CompanyType),
      description: "list of companies",
      resolve: async()=> {
        const result =  await db.query("SELECT * FROM company");
        return result.rows;
      }
    },
    //users ruturn all usuers
    users: {
      type: new GraphQLList(UserType),
      description: "list of users",
      resolve: async()=> {
        const result =  await db.query("SELECT * FROM public.user");
        return result.rows;
      }
    },
    //projects return all projects
    project: {
      type: new GraphQLList(ProjectType),
      description: "list of projects",
      resolve: async()=> {
        const result =  await db.query("SELECT * FROM public.project");
        return result.rows;
      }
    }
  })
})


const schema = new GraphQLSchema({
  query: RootQueryType
})



module.exports = schema;