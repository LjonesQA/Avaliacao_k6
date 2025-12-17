const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    username: String!
    favorecidos: [String!]!
    saldo: Float
  }

  type Transfer {
    from: String!
    to: String!
    value: Float!
    date: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    user(username: String!): User
    transfers: [Transfer!]!
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
    createTransfer(from: String!, to: String!, value: Float!): Transfer!
  }
`;

module.exports = typeDefs;
