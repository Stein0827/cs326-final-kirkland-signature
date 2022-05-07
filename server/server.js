import 'dotenv/config';
import express from 'express';
import expressSession from 'express-session';
import logger from 'morgan';
import {insertData, readData, updateData, deleteData, dumpData} from './database.js';
import users from './users.js';
import auth from './auth.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));
const port = process.env.PORT || 80;
const sessionConfig = {
  // set this encryption key in Heroku config (never in GitHub)!
  secret: process.env.SECRET || 'SECRET',
  resave: false,
  saveUninitialized: false,
};

//user object structure
// let user = {
//   user_id: "",
//   user_name: "",
//   user_email: "",
//   password: "",
//   events: {},
//   is_event: False
// };

//event object structure
// let event = {
//   host_id: "",
//   host_name: "",
//   event_id: "",
//   event_name: "",
//   event_desc: "",
//   event_location: "",
//   event_time: "",
//   images: "",
//   attendees: [],
//   is_event: True
// }


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
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static('../client'));
auth.configure(app);

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
  const options = request.query;
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
