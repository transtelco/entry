import { makeExecutableSchema } from 'graphql-tools';

import resolvers from './resolvers';

const schema = `
type Lang {
  name: String! # the ! means that every author object _must_ have an id
  description: String # the description of the language
  likes: Int! # the number of likes this language has
}

# the schema allows the following query:
type Query {
  lang(name: String!): Lang 
}

# this schema allows the following mutation:
type Mutation {
  likeLang(name: String!): Lang 
}

`;

export default makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});
