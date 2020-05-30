const { ApolloServer } = require('apollo-server');
const db = require('./db');

const typeDefs = require('./GraphQL/typeDefs');
const resolvers = require('./GraphQL/resolvers');

// connect database
db();

const PORT = process.env.PORT || 4000;
const server = new ApolloServer({ typeDefs, resolvers });


server.listen({ port: PORT }).then(({ url }) => console.log(url));

