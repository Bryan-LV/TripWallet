const { ApolloError, UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');
const userResolvers = require('./resolvers/user');
const tripResolvers = require('./resolvers/trip');

const resolvers = {
  Query: {
    user: (_, { id }) => User.findById(id),
    users: () => User.find({})
  },

  Mutation: {
    ...userResolvers,
    ...tripResolvers
  }
}

module.exports = resolvers;
