import express from 'express';
import {MapDatabase} from './mongodb.js';
import passport from 'passport';
import routes from './routes';
import mongoose from 'mongoose';
import auth from './auth';

import session from 'express-session';
import MongoStore from 'connect-mongo'; 

//connect to mongodb db
mongoose.connect(
  "mongo db uri goes here",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));



app.use(
  session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

app.use('/login')

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});


