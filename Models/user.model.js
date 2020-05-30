const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  baseCurrency: String,
  trips: [{ type: Schema.Types.ObjectId, ref: 'trip' }]
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema);

module.exports = User;