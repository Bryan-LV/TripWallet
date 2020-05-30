const jwt = require('jsonwebtoken');
require('dotenv').config();

async function generateToken(user) {
  try {
    return await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  } catch (error) {
    console.log(error);
    return false
  }
}

module.exports = generateToken;