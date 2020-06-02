const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  tripName: String,
  foreignCurrency: String,
  baseCurrency: String,
  budget: String,
  endDate: Date,
  photo: String,
  categories: [String]
}, {
  timestamps: true
})

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;