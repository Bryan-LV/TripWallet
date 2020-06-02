const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID!
    username: String!
    name: String!
    email:String!
    baseCurrency: String!
    createdAt:String!
    token: String
    trips: [Trip]
  }

  type Trip {
    _id: ID!
    user: ID!
    tripName: String!
    foreignCurrency: String!
    baseCurrency: String!
    createdAt: String!
    budget: String
    endDate: String
    photo: String
    categories: [String]
    expenses: [Expense]
  }

  type Expense {
    _id: ID!
    tripID: ID!
    category: String!,
    expenseName: String!
    foreignPrice: Float!
    baseCurrencyPrice: Float!
    createdAt: String!
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
    getTrip(id:ID!):Trip
    getTrips: [Trip]
  }

  type Mutation {
    register(registerUser: RegisterInput): User
    login(loginUser: LoginInput): User
    deleteUser(id:ID!): Response
    updateUser(updateUser: UpdateInput): User
    createTrip(createTrip: CreateTrip): Trip
    updateTrip(updateTrip:UpdateTrip): Trip
    deleteTrip(tripID:ID!): Response
    createExpense(NewExpense: NewExpense): Expense
    updateExpense(UpdateExpense: UpdateExpense): Expense
    deleteExpense(expenseID: ID!): Response
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

  input UpdateTrip {
    tripID: ID!
    tripName: String
    foreignCurrency: String
    budget: String
    endDate: String
    photo: String
  }

  input NewExpense {
    tripID: ID!
    category: String
    expenseName: String
    foreignPrice: Int
    baseCurrencyPrice: Int
    spread: Int
    endDate: String
    notes: String
  }

  input UpdateExpense {
    tripID: ID!
    category: String
    expenseName: String
    foreignPrice: Int
    baseCurrencyPrice: Int
    spread: Int
    endDate: String
    notes: String
  }

`