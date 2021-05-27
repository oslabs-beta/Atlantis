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

const UserType:any = new GraphQLObjectType({
  name: "Users",
  fields: ()=>({
    user_id: {type: GraphQLInt},
    name: {type: GraphQLString},
    company_id: {type: GraphQLInt},
    company: {
      type: CompanyType,
      resolve: async (user) => {
      const result = await db.query(`SELECT * FROM company WHERE company_id = $1`, [user.company_id]);
      return result.rows[0];
      } 
    }
  })
})

const CompanyType: any= new GraphQLObjectType({
  name: "Companies",
  fields: ()=>({
    company_id: {type: GraphQLInt},
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    employees: {
      type: GraphQLList(UserType),
      resolve: async (company) =>{
        const result = await db.query('SELECT * FROM public.user WHERE company_id = $1', [company.company_id]);
        return result.rows;
      }
    }
  })
})

const ProjectType = new GraphQLObjectType({
  name: "Projects",
  fields: ()=>({
    project_id: {type: GraphQLInt},
    project_name: {type: GraphQLString},
    company_id: {type: GraphQLInt},
    project_description: {type: GraphQLString}
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description : 'Root Query',
  fields: ()=> ({
    company: {
      type: CompanyType,
      description: "a single company",
      args: {
        company_id: { type: GraphQLInt}
      },
      resolve: async(parent,args)=> {
        const result =  await db.query(`SELECT * FROM company WHERE company_id = $1`, [args.company_id]);
        return result.rows[0];
      }
    },
    //companies return call companies
    companies: {
      type: new GraphQLList(CompanyType),
      description: "list of companies",
      resolve: async()=> {
        const result =  await db.query(`SELECT * FROM company`);
        return result.rows;
      }
    },
    //users ruturn all usuers
    users: {
      type: new GraphQLList(UserType),
      description: "list of users",
      args: {
        company_id: { type: GraphQLInt}
      },
      resolve: async()=> {
        const result =  await db.query("SELECT * FROM public.user");
        return result.rows;
      }
    },
    project:{
      type: ProjectType,
      description: "project ",
      args: {
        project_id: {type: GraphQLInt}
      },
      resolve: async (parent, args)=> {
        const result = await db.query('SELECT * FROM project WHERE  project_id = $1', [args.project_id]);
        return result.rows[0];
      }
    },
    //projects return all projects
    projects: {
      type: new GraphQLList(ProjectType),
      description: "list of projects",
      args: {
        company_id: { type: GraphQLInt}
      },
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