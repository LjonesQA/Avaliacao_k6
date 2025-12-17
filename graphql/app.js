const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const context = require('./context');

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer();

module.exports = app;
