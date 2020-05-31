const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  expenseName: String,
  foreignPrice: Number,
  baseCurrencyPrice: Number,
  spread: Number,
  endDate: Date,
  notes: String,
  categoryID: { type: Schema.Types.ObjectId, ref: 'category' }
}, {
  timestamps: true
})

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;