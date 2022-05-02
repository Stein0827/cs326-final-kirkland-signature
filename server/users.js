//mongoose schema model
const mongoose = require('mongoose');

const userSchema = new mongoose.schema({
  name: String,
  email: String,
  password: String,
});

module.exports = mongoose.model('users', userSchema);