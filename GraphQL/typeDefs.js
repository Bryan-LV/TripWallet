const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    username: String!
    name: String!
    email:String!
    baseCurrency: String!
    createdAt:String!
    trips: [ID]!
    token: String
  }

  type Response {
    message: String!
  }

  type Query {
    user(id: ID!): User
    users: [User]
  }

  type Mutation {
    register(registerUser: RegisterInput): User
    login(loginUser: LoginInput): User
    deleteUser(id:ID!): Response
  }

  input RegisterInput {
    name: String! 
    username:String! 
    email: String!
    baseCurrency: String! 
    password: String! 
    confirmPassword: String!
  }

  input LoginInput {
    username: String
    email: String
    password: String!
  }

`