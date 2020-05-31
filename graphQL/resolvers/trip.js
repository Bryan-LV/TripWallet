const { AuthenticationError, ApolloError } = require('apollo-server');
const bcrypt = require('bcryptjs');

const checkAuth = require('../../utils/checkAuth');
const Trip = require('../../models/trip.model');
const Category = require('../../models/category.model');
const Expense = require('../../models/expense.model');

const tripResolver = {
  ///////////////////// Create Trip /////////////////////
  createTrip: async (_, { createTrip }, context) => {
    // check user is authenticated
    let user = checkAuth(context);
    // create new trip object
    let newTrip = {
      user: user.id,
      tripName: createTrip.tripName,
      foreignCurrency: createTrip.foreignCurrency,
      baseCurrency: createTrip.baseCurrency,
    }
    if (createTrip.budget) newTrip.budget = createTrip.budget;
    if (createTrip.endDate) newTrip.endDate = createTrip.endDate;
    if (createTrip.photo) newTrip.photo = createTrip.photo;
    let trip = new Trip(newTrip);
    let savedTrip = await trip.save();
    // create food & accommodation categories for the new trip
    let foodCategory = new Category({ categoryName: "Food", tripID: savedTrip._id });
    let accommodationCategory = new Category({ categoryName: "Accommodation", tripID: savedTrip._id });
    await foodCategory.save();
    await accommodationCategory.save();
    savedTrip.categories.push(foodCategory._id, accommodationCategory._id);
    await savedTrip.save();

    return {
      ...savedTrip._id,
      ...savedTrip._doc
    }
  },
  ///////////////////// Delete Trip /////////////////////
  deleteTrip: async (_, { tripID }, context) => {
    // check if user is authenticated
    let user = checkAuth(context);
    // get trip
    let trip = await Trip.findById(tripID);
    if (!trip) { throw new ApolloError('Trip does not exists'); }
    // TODO: make sure user.id === trip.user
    // delete expenses > category > trip 
    await Expense.deleteMany({ categoryID: [...trip.categories] })
    await Category.deleteMany({ tripID });
    await Trip.deleteOne({ _id: tripID });
    return { message: 'trip has been deleted' }
  }
}

module.exports = tripResolver