const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  categoryName: String,
  tripID: { type: Schema.Types.ObjectId, ref: 'trip' },
  expenses: [{ type: Schema.Types.ObjectId, ref: 'expense' }]
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;