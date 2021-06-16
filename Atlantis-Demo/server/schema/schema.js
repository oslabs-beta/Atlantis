const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInputObjectType,
} = require('graphql')

const db = require('./../models.js');



const UserType = new GraphQLObjectType({
  name: 'Users',
  fields: () => ({
    user_id: { type: GraphQLInt },
    name: { type: GraphQLString },
    company_id: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve: async (user) => {
        const result = await db.query(
          `SELECT * FROM company WHERE company_id = $1`,
          [user.company_id]
        );
        return result.rows[0];
      },
    },
  }),
});

const CompanyType = new GraphQLObjectType({
  name: 'Companies',
  fields: () => ({
    company_id: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    employees: {
      type: GraphQLList(UserType),
      resolve: async (company) => {
        const result = await db.query(
          'SELECT * FROM public.user WHERE company_id = $1',
          [company.company_id]
        );
        return result.rows;
      },
    },
  }),
});

const ProjectType = new GraphQLObjectType({
  name: 'Projects',
  fields: () => ({
    project_id: { type: GraphQLInt },
    project_name: { type: GraphQLString },
    company_id: { type: GraphQLInt },
    project_description: { type: GraphQLString },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    company: {
      type: CompanyType,
      description: 'a single company',
      args: {
        company_id: { type: GraphQLInt },
      },
      resolve: async (parent, args) => {
        const result = await db.query(
          `SELECT * FROM company WHERE company_id = $1`,
          [args.company_id]
        );
        return result.rows[0];
      },
    },
    //companies return call companies
    companies: {
      type: new GraphQLList(CompanyType),
      description: 'list of companies',
      resolve: async (parent, args, context, info) => {
        // console.log(info);
        const result = await db.query(`SELECT * FROM company`);
       
        return result.rows;
      },
    },

    //users ruturn all usuers at a company
    users: {
      type: new GraphQLList(UserType),
      description: 'list of users',
      args: {
        company_id: { type: GraphQLInt },
      },
      resolve: async (parent, { company_id }) => {
        const result = await db.query(
          'SELECT * FROM public.user WHERE company_id = $1',
          [company_id]
        );
        return result.rows;
      },
    },
    project: {
      type: ProjectType,
      description: 'project',
      args: {
        project_id: { type: GraphQLInt },
      },
      resolve: async (parent, { project_id }) => {
        const result = await db.query(
          'SELECT * FROM project WHERE  project_id = $1',
          [project_id]
        );
        return result.rows[0];
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      description: 'list of projects',
      args: {
        company_id: { type: GraphQLInt },
      },
      resolve: async (parent, { company_id }) => {
        const result = await db.query(
          'SELECT * FROM public.project where company_id = $1',
          [company_id]
        );
        return result.rows;
      },
    },
  }),
});

const mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        company_id: { type: GraphQLInt },
      },
      resolve: async (parent, { name, company_id }) => {
        const result = await db.query(
          'INSERT INTO public.user (name, company_id) VALUES ( $1, $2) RETURNING *',
          [name, company_id]
        );
        console.log(result.rows[0]);
        return result.rows[0];
      },
    },

    addCompany: {
      type: CompanyType,
      args: {
        name: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve: async (parent, { name, description }) => {
        const result = await db.query(
          'INSERT INTO public.company (name, description) VALUES ( $1, $2) RETURNING *',
          [name, description]
        );
        console.log(result.rows[0]);
        return result.rows[0];
      },
    },
    addProject: {
      type: ProjectType,
      args: {
        project_name: { type: GraphQLString },
        company_id: { type: GraphQLInt },
        project_description: { type: GraphQLString },
      },
      resolve: async (
        parent,
        { project_name, company_id, project_description }
      ) => {
        const result = await db.query(
          'INSERT INTO public.project (project_name, company_id,  project_description) VALUES ( $1, $2, $3) RETURNING *',
          [project_name, company_id, project_description]
        );
        console.log(result.rows[0]);
        return result.rows[0];
      },
    },
    updateUser: {
      type: UserType,
      args: {
        user_id: { type: GraphQLInt },
        name: { type: GraphQLString },
        company_id: { type: GraphQLInt },
      },
      resolve: async (parent, { user_id, name, company_id }) => {
        const result = await db.query(
          'UPDATE public.user SET name=$1, company_id=$2 WHERE user_id=$3 RETURNING *;',
          [name, company_id, user_id]
        );
        console.log(result.rows[0]);
        return result.rows[0];
      },
    },

    updateCompany: {
      type: CompanyType,
      args: {
        company_id: { type: GraphQLInt },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve: async (parent, { company_id, name, description }) => {
        const result = await db.query(
          'UPDATE public.company SET name=$1, description=$2 WHERE company_id=$3 RETURNING *;',
          [name, description, company_id]
        );
        console.log(result.rows[0]);
        return result.rows[0];
      },
    },
    updateProject: {
      type: ProjectType,
      args: {
        project_name: { type: GraphQLString },
        company_id: { type: GraphQLInt },
        project_description: { type: GraphQLString },
        project_id: { type: GraphQLInt },
      },
      resolve: async (
        parent,
        { project_name, company_id, project_description, project_id }
      ) => {
        const result = await db.query(
          'UPDATE public.project SET project_name=$1, company_id=$2, project_description=$3 WHERE project_id=$4 RETURNING *;',
          [project_name, company_id, project_description, project_id]
        );
        console.log(result.rows[0]);
        return result.rows[0];
      },
    },

    deleteUser: {
      type: UserType,
      args: {
        user_id: { type: GraphQLInt },
      },
      resolve: async (parent, { user_id }) => {
        const result = await db.query(
          'DELETE FROM public.user WHERE user_id=$1 RETURNING *',
          [user_id]
        );
        console.log(result.rows[0]);
        return result.rows[0];
      },
    },

    deleteCompany: {
      type: CompanyType,
      args: {
        company_id: { type: GraphQLInt },
      },
      resolve: async (parent, { company_id }) => {
        const result = await db.query(
          'DELETE FROM public.company WHERE company_id=$1 RETURNING *',
          [company_id]
        );
        console.log(result.rows[0]);
        return result.rows[0];
      },
    },
    deleteProject: {
      type: ProjectType,
      args: {
        project_id: { type: GraphQLInt },
      },
      resolve: async (parent, { project_id }) => {
        const result = await db.query(
          'DELETE FROM public.project WHERE project_id=$1 RETURNING *',
          [project_id]
        );
        console.log(result.rows[0]);
        return result.rows[0];
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation,
});

module.exports = schema;
