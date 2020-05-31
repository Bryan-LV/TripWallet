const { ApolloError, UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../../models/user.model');
const RegisterValidation = require('../../utils/registerValidation');
const LoginValidation = require('../../utils/loginValidation');
const generateToken = require('../../utils/generateToken');

const userResolvers = {
  ///////////////////// Register User /////////////////////
  register: async (_, { registerUser }) => {
    const { username, email, name, baseCurrency, password, confirmPassword } = registerUser;
    try {
      // validate user inputs
      const { error } = RegisterValidation.validate(registerUser);
      if (error) throw new UserInputError(error.message);
      // verify email and username aren't taken
      let user = await User.findOne({ email });
      if (user) throw new UserInputError('This user has existing account');
      user = await User.findOne({ username });
      if (user) throw new UserInputError('This username is taken');
      // hash password
      const hashPassword = await bcrypt.hash(password, 10);
      // save to db
      user = new User({ username, email, name, baseCurrency, password: hashPassword });
      const savedUser = await user.save();
      // generate token
      const token = generateToken(savedUser);
      return {
        id: savedUser._id,
        ...savedUser._doc,
        token,
        trips: []
      }
    } catch (error) {
      console.log(error);
      throw new ApolloError(error);
    }
  },
  ///////////////////// Login User /////////////////////
  login: async (_, { loginUser }) => {
    let user;
    try {
      // validate user inputs
      const { error } = LoginValidation.validate(loginUser);
      // check if user exists
      if (loginUser.username) {
        user = await User.findOne({ username: loginUser.username });
      }
      if (loginUser.email) {
        user = await User.findOne({ email: loginUser.email });
      }
      if (!user) {
        throw new UserInputError('User does not have an account');
      }
      // verify password
      const verifyPassword = await bcrypt.compare(loginUser.password, user.password);
      if (!verifyPassword) {
        throw new UserInputError('Wrong credentials');
      }

      // generate token
      const token = await generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token
      }
    } catch (error) {

    }
  }
  ,
  ///////////////////// Update User /////////////////////
  updateUser: async (_, { updateUser }) => {
    try {
      // TODO: update user logic
      return User.findOne({ email: updateUser.email });
    } catch (error) {
      throw new ApolloError(error)
    }
  },
  ///////////////////// Delete User /////////////////////
  deleteUser: async (_, { id }) => {
    try {
      let user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new ApolloError('User does not exist');
      }
      return { message: 'User has been successfully deleted' }
    } catch (error) {
      throw new ApolloError(error)
    }
  }
}

module.exports = userResolvers