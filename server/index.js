import express from 'express';
import {MapDatabase} from './mongodb.js';
import auth from './auth.js';
import passport from 'passport';
//mongoose models
const mongoose = require('mongoose');
const User = require('./users');
const Event = require('./events');
const routes = require('./routes');


const app = express();


mongoose.connect(
  "mongo db uri goes here",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

app.use(routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});

