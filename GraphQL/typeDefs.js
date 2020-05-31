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

  type Trip {
    user: ID!
    tripName: String!
    foreignCurrency: String!
    baseCurrency: String!
    createdAt: String!
    budget: String
    endDate: String
    photo: String
    categories: [ID]
  }

  type Category {
    tripID: ID!
    categoryName: String!
    expenses: [ID]
  }

  type Expense {
    categoryID: ID!
    expenseName: String!
    foreignPrice: Float!
    baseCurrencyPrice: Float!
    createdAt: String!
    category: ID!
    spread: Int
    endDate: String
    notes: String
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
    updateUser(updateUser: UpdateInput): User
    createTrip(createTrip: CreateTrip): Trip
    deleteTrip(tripID:ID!): Response
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

  input UpdateInput {
    name: String
    username:String
    email: String
    baseCurrency: String
    currentPassword: String 
    newPassword: String
    confirmNewPassword: String
  }

  input CreateTrip {
    tripName: String!
    foreignCurrency: String!
    baseCurrency: String!
    budget: String
    endDate: String
    photo: String
  }

`