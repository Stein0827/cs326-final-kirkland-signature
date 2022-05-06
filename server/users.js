//mongoose schema model for users
import mongoose from 'mongoose';
import bcrypt from 'bcrpyt';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String, 
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

//methods for schema
userSchema.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          return next(err);
        }
        bcrypt.hash(user.password, salt, null, function (err, hash) {
          if (err) {
            return next(err);
          }
          user.password = hash;
          next();
        });
      });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};


User.plugin(passportLocalMongoose);

module.exports = User = mongoose.model('users', userSchema);