const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type:     String,
    required: true,
    trim:     true,
  },
  email: {
    type:      String,
    required:  true,
    unique:    true,
    lowercase: true,
    trim:      true,
  },
  route: {
    type:     String,
    required: true,
  },
}, { timestamps: true });

// Hash the route before it saves everyhting to the DB
UserSchema.pre('save', async function () {
  if (!this.isModified('route')) return;
  const salt = await bcrypt.genSalt(10);
  this.route = await bcrypt.hash(this.route, salt);
});

// Compare the  plain route against stored hash :)
UserSchema.methods.matchRoute = async function (plainRoute) {
  return bcrypt.compare(plainRoute, this.route);
};

module.exports = mongoose.model('User', UserSchema);