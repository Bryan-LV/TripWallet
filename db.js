const mongoose = require('mongoose');
require('dotenv').config();

module.exports = function () {
  try {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('database connected');
  } catch (error) {
    console.log(error);
  }
}