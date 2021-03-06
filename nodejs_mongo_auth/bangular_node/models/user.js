const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

var userSchema = new Schema({
  username: { type: String, index: { unique: true} },
  first_name: String,
  last_name: String,
  password: String
});

userSchema.pre('save', true, function(next, done) {

  var user = this;
  
  if (!this.isModified('password')) {
    next();
    done();
  } else {
    bcrypt.hash(this.password, SALT_ROUNDS, function(err, hash) {
      if (err) {
        next(err);
      } else {
        user.password = hash;
        next();
        done();
      }
    });
  }
});

userSchema.methods.checkPassword = function(plaintextPassword, callback) {
  bcrypt.compare(plaintextPassword, this.password, function(err, res) {
    if (err) {
      callback(err);
      console.log('Could not check password');
    } else {
      callback(null, res);
    }
  });
};
  
module.exports = mongoose.model('User', userSchema);
