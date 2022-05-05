import passport from 'passport';
import passportLocal from 'passport-local';
import User from './users';
import bcrypt from 'bcrypt-nodejs';


const LocalStrategy = passportLocal.Strategy;

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
  done(null, user);
});

// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
  done(null, uid);
});

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    // Match User
    User.findOne({ email: email })
        .then(user => {
          // Create new User
          if (!user) {
            const newUser = new User({ email, password });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                  .then(user => {
                      return done(null, user);
                  })
                  .catch(err => {
                      return done(null, false, { message: err });
                  });
              });
            });
            // Return other user
          } else {
            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;

              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Wrong password" });
              }
            });
          }
      })
      .catch(err => {
        return done(null, false, { message: err });
      });
  })
);

module.exports = passport;
