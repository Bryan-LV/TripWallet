const { AuthenticationError, ApolloError } = require('apollo-server');

const checkAuth = require('../../utils/checkAuth');
const Trip = require('../../models/trip.model');
const Expense = require('../../models/expense.model');

const expenseQueries = {
  ///////////////////// Get Expense /////////////////////
}

const expenseResolvers = {
  ///////////////////// Create Expense /////////////////////
  createExpense: async (_, { NewExpense }, context) => {
    try {
      // check user is authenticated
      let user = checkAuth(context);
      // create expense
      let expense = new Expense(NewExpense);
      await expense.save()
      return expense;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  ///////////////////// Update Expense /////////////////////
  updateExpense: async (_, { updateExpense }, context) => {

    try {
      const { expenseID, tripID, category, expenseName, foreignPrice, baseCurrencyPrice, spread, endDate, notes } = updateExpense;
      // check user auth
      let user = checkAuth(context);
      // find trip
      let expense = await Expense.findById(expenseID);
      if (!expense) throw new ApolloError('Expense does not exists');
      // check user cannot update expense that is not their own
      // check expense's tripID > trip.user === user.id who is deleting expense
      let trip = await Trip.findById(expense.tripID);
      if (toString(user._id) !== toString(trip.user)) {
        console.log('User is not authorized to update expense');
        throw new ApolloError('User is not authorized to update this expense')
      }
      // create update object
      const updateObj = {};
      if (category) updateObj.category = category
      if (expenseName) updateObj.expenseName = expenseName
      if (foreignPrice) updateObj.foreignPrice = foreignPrice
      if (baseCurrencyPrice) updateObj.baseCurrencyPrice = baseCurrencyPrice
      if (spread) updateObj.spread = spread
      if (startDate) updateObj.startDate = startDate
      if (endDate) updateObj.endDate = endDate
      if (notes) updateObj.notes = notes
      // update trip
      const updatedExpense = await Expense.findByIdAndUpdate(expenseID, { $set: updateObj }, { new: true });
      //return new trip
      return updatedExpense;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  ///////////////////// Delete Expense /////////////////////
  deleteExpense: async (_, { expenseID }, context) => {
    try {
      // check if user is authenticated
      let user = checkAuth(context);
      // get expense and trip
      let expense = await Expense.findById(expenseID);
      if (!expense) { throw new ApolloError('Expense does not exists'); }
      // check user cannot delete expense that is not their own
      // check expense's tripID > trip.user === user.id who is deleting expense
      let trip = await Trip.findById(expense.tripID);
      if (toString(user._id) !== toString(trip.user)) {
        console.log('User is not authorized to delete expense');
        throw new ApolloError('User is not authorized to delete this expense')
      }
      await expense.remove();
      return { message: 'Expense has been deleted' }
    } catch (error) {
      throw new ApolloError(error);
    }
  },
}

module.exports = { expenseQueries, expenseResolvers };