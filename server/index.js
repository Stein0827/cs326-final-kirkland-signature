import express from 'express';
import {MapDatabase} from './mongodb.js';
import passport from 'passport';
import routes from './routes';
import mongoose from 'mongoose';
import auth from './auth';

import session from 'express-session';
import MongoStore from 'connect-mongo'; 

const User = require('./users');
const routes = require('./routes');

const app = express();

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

//connect to mongodb db
mongoose.connect(
  "mongo db uri goes here",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(User.createStrategy());

// To use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/api', routes)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});


