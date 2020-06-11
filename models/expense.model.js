const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  tripID: { type: Schema.Types.ObjectId, ref: 'trip' },
  category: String,
  expenseName: String,
  foreignPrice: Number,
  baseCurrencyPrice: Number,
  spread: Number,
  startDate: Date,
  endDate: Date,
  notes: String
})

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;