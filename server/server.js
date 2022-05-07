import express from 'express';
import expressSession from 'express-session';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from 'passport';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import routes from './routes.js';
import User from './users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));
const port = process.env.PORT || 80;
const sessionConfig = {
  // set this encryption key in Heroku config (never in GitHub)!
  secret: process.env.SECRET || 'SECRET',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
};

function generateId(){
  return Math.floor(Math.random() * 10000);
}

function getHostName(id){
  return readData(id, false).user_name;
}

//creates a new user
async function createUser(response, user) {
  if (user.user_name === undefined || user.user_email === undefined || user.password === undefined) {
    // 400 - Bad Request
    response.status(400).json({ error: 'Missing fields' });
  } else {
    //initialize new user
    const new_user = {
      user_id : generateId(),
      user_name : user.user_name,
      user_email : user.user_email,
      password : user.password,
      events : [],
      is_event : false
    };
    await insertData(new_user);
    response.status(200).json(new_user);
  }
}

//returns the associated user object
async function getUser(response, ID) {
  let data = await readData(ID, false);
  if (data === -1) {
    // 404 - Not Found
    response.status(404).json({ error: 'User ID not found' });
  } else {
    response.status(200).json(data);
  }
}

//delete user object
async function deleteUser(response, ID) {
  let data = await deleteData(ID, false);
  if (data === -1) {
    // 404 - Not Found
    response.status(404).json({ error: "User ID not found" });
  } else {
    for(let event in data.events) {
      deleteData(event.event_id, true);
    }
    response.status(200).json(data);
  }
}

//creates or adds a new event
async function createEvent(response, hostId, eventName, desc, location, time) {
  if (arguments.length !== 6) {
    // 400 - Bad Request
    response.status(400).json({ error: 'Missing fields' });
  } else {
    //initialize new user
    const new_event = {
      host_id : hostId,
      host_name : getHostName(hostId), 
      event_id : generateId(),
      event_name: eventName,
      event_desc : desc,
      event_location : location,
      event_time : time, 
      attendees : [],
      is_event : true
    };
    await insertData(new_event);
    response.status(200).json(new_event);
  }
}

//returns the associated user object
async function getEvent(response, ID) {
  let data = await readData(ID, true);
  if (data === -1) {
    // 404 - Not Found
    response.status(404).json({ error: 'Event ID not found' });
  } else {
    response.status(200).json(data);
  }
}


async function updateEvent(response, ID, name, desc, location, time, attendees) {
  if (arguments.length !== 7) {
    // 400 - Bad Request
    response.status(400).json({ error: 'Missing fields' });
  } else {
    let updatedEvent = await readData(ID, true);
    if(updatedEvent === -1) {
      // 404 - Not Found
      response.status(404).json({ error: 'Event ID not found' });
    } else {
      updatedEvent.event_name = name;
      updatedEvent.event_desc = desc;
      updatedEvent.event_location = location;
      updatedEvent.event_time = time;
      if (updatedEvent.attendees.length > 0) {
        updatedEvent.attendees.push(attendees);
      }
      else {
        updatedEvent.attendees = attendees;
      }
      await updateData(ID, updatedEvent, true);
      response.status(200).json(updatedEvent);
    }
  }
}

async function deleteEvent(response, ID) {
  let data = await deleteData(ID, true);
  if (data === -1) {
    // 404 - Not Found
    response.status(404).json({ error: 'Event ID not found' });
  } else {
    response.status(200).json(data);
  }
}

async function attendEvent(response, user_id, event_id) {
  let event = await readData(event_id, true);
  event.attendees.push(user_id);
  await updateData(event_id, event, true);
  response.status(200).json(event);
}

async function getEventAttendees(response, eventID){
  let data = await readData(eventID, true);
  if (data === -1) {
    // 404 - Not Found
    response.status(404).json({ error: 'Event ID not found' });
  } else {
    response.status(200).json(data["attendees"]);
  }
}

async function dumpUsers(response) {
  response.status(200).json(await dumpData(false));
}

async function dumpEvents(response) {
  response.status(200).json(await dumpData(true));
}

// NEW
const app = express();
app.use(expressSession(sessionConfig));
app.use(logger('dev'));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use('/', express.static('../client'));
auth.configure(app);

mongoose.connect(
  "mongo db uri goes here",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

// Passport Local Strategy
passport.use(User.createStrategy());

// To use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use('/api', routes);

function checkLoggedIn(req) {
  return req.isAuthenticated();
}

function enforceLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

//login
app.get('/login', (req, res) =>
  res.sendFile('client/log_in.html', { root: __dirname })
);

app.get('/map', (req, res) =>
  res.sendFile('client/map.html', { root: __dirname })
);

app.get('/event-editor/:eventID', (req, res) =>
  res.sendFile('client/event_creator.html', { root: __dirname })
);

app.get('/my-events/:userID', (req, res) =>
  res.sendFile('client/my_events.html', { root: __dirname })
);

app.post('/login', auth.authenticate('local', {
    successRedirect: '/map',
    failureRedirect: '/login',
  })
);

//logout
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

//create user
app.post('/newUser', async (request, response) => {
  const options = request.body;
  //name, email, password
  createUser(response, options);
});

//return user
app.get('/getUserbyId', async (request, response) => {
  const options = request.query;
  getUser(response, options.user_id);
});

//add event to user's profile
app.post('/createEvent', async (request, response) => {
  const options = request.body;
  request.redirect('/map');
  createEvent(response, options.host_id, 
          options.name, options.desc, options.location, options.time);
});

//change an event
app.put('/editEvent', async (request, response) => {
  const options = request.body;
  updateEvent(response, options.event_id, 
          options.name, options.desc, options.location, options.time, options.attendees);
});

app.delete('/deleteUser', async (request, response) => {
  const options = request.body;
  deleteUser(response, options.user_id);
});

//delete an event
app.delete('/deleteEvent', async (request, response) => {
  const options = request.body;
  deleteEvent(response, options.event_id);
});

//read an event
app.get('/getEventbyId', async (request, response) => {
  const options = request.body;
  getEvent(response, options.event_id);
});

//get all attendees
app.get('/getAttendees', async (request, response) => {
  const options = request.query;
  getEventAttendees(response, options.event_id);
});

//RSVP to an event
app.put('/attendEvent', async (request, response) => {
  const options = request.body;
  attendEvent(response, options.user_id, options.event_id);
});

app.get('/dumpEvents', async (request, response) => {
  const options = request.body;
  dumpEvents(response);
});

// app.get('/dumpUsers', async (request, response) => {
//   const options = request.body;
//   dumpUsers(response);
// });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});




class UMapServer {
  constructor() {
    this.dburi = process.env.MONGODB_URI;
    this.app = express();
    this.app.use('/', express.static('/client'));
  }

  async initRoutes() {
    const self = this;

    this.app.post('/newUser')

    this.app.get('/login', (req, res) =>
      res.sendFile('client/log_in.html', { root: __dirname })
    );

    this.app.get('/map', (req, res) =>
      res.sendFile('client/map.html', { root: __dirname })
    );

    this.app.get('/event-editor/:eventID', (req, res) =>
      res.sendFile('client/event_creator.html', { root: __dirname })
    );

    this.app.get('/my-events/:userID', (req, res) =>
      res.sendFile('client/my_events.html', { root: __dirname })
    );
    
    app.post('/login', auth.authenticate('local', {
        successRedirect: '/map',
        failureRedirect: '/login',
      })
    );
    
    //logout
    this.app.get('/logout', (req, res) => {
      req.logout();
      res.redirect('/login');
    });
    
    //create user
    this.app.post('/newUser', async (request, response) => {
      try {
        const { name, email, password } = req.query;
        const user = await self.db.createUser(name, email, password);
        // res.send(JSON.stringify(user));
        res.status(200);
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //return user
    this.app.get('/getUserbyId', async (request, response) => {
      try {
        const { id } = req.query;
        const user = await self.db.readUser(id);
        res.send(JSON.stringify(user));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //add event to user's profile
    this.app.post('/createEvent', async (request, response) => {
      try {
        const { event } = req.body;
        const evt = await self.db.createUser(event);
        res.send(JSON.stringify(evt));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //change an event
    this.app.put('/editEvent', async (request, response) => {
      try {
        const { event } = req.body;
        const evt = await self.db.updateEvent(event);
        // res.send(JSON.stringify(user));
        res.send(JSON.stringify(evt));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    this.app.delete('/deleteUser', async (request, response) => {
      try {
        const { id } = req.query;
        const user = await self.db.deleteUser(id);
        res.send(JSON.stringify(person));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //delete an event
    this.app.delete('/deleteEvent', async (request, response) => {
      try {
        const { id } = req.query;
        const person = await self.db.deletePerson(id);
        res.send(JSON.stringify(person));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //read an event
    this.app.get('/getEventbyId', async (request, response) => {
      try {
        const { id } = req.query;
        const event = await self.db.updateEvent(id);
        res.send(JSON.stringify(event));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //get all attendees
    this.app.get('/getAttendees', async (request, response) => {
      try {
        const { id } = req.query;
        let temp = await self.db.readEvent(id);
        temp = JSON.stringify(temp);
        const attendees = temp.attendees;
        res.send(JSON.stringify(attendees));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //RSVP to an event
    this.app.put('/attendEvent', async (request, response) => {
      try {
        const { event } = req.body;
        const evt = await self.db.updateRSVP(event);
        res.send(JSON.stringify(evt));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    this.app.get('/dumpEvents', async (request, response) => {
      try {
        const evt = await self.db.dumpEvents(event);
        res.send(JSON.stringify(evt));
      } catch (err) {
        res.status(500).send(err);
      }
    });
  }
}
