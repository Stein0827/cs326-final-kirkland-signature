import express from 'express';
import logger from 'morgan';
import {insertData, readData, updateData, deleteData} from './database.js';

//user object structure
// let user = {
//   id: "",
//   user_name: "",
//   user_email: "",
//   password: "",
//   events: {},
//   attending: {},
//   is_event: False
// };

//event object structure
// let event = {
//   host_id: "",
//   host_name: "",
//   id: "",
//   event_name: "",
//   event_desc: "",
//   event_location: "",
//   event_time: "",
//   images: "",
//   attendees: [],
//   is_event: True
// }

function generateId(){
  return Math.floor(Math.random() * 10000)
}

//creates a new user
async function createUser(response, name, email, password) {
  if (name === undefined || email === undefined || password === undefined) {
    // 400 - Bad Request
    response.status(400).json({ error: 'Missing fields' });
  } else {
    //initialize new user
    const new_user = {
      user_id : generateId(),
      user_name : name,
      user_email : email,
      password : password,
      events : [],
      is_event : false
    };
    await insertData(new_user);
    response.status(200).json(new_user);
  }
}

//returns the associated user object
async function getUser(response, ID) {
  await reload(JSONfile);
  let data = readData(ID, false);
  if (data === -1) {
    // 404 - Not Found
    response.status(404).json({ error: 'User ID not found' });
  } else {
    response.status(200).json(data);
  }
}

//creates or adds a new event
async function createEvent(response, name) {
  await reload(JSONfile);
  if (counterExists(name)) {
    counters[name] += 1;
    await saveCounters();
    response.json({ name: name, value: counters[name] });
  } else {
    // 404 - Not Found
    response.status(404).json({ error: `Counter '${name}' Not Found` });
  }
}

async function updateCounter(response, name) {
  await reload(JSONfile);
  if (counterExists(name)) {
    counters[name] += 1;
    await saveCounters();
    response.json({ name: name, value: counters[name] });
  } else {
    // 404 - Not Found
    response.status(404).json({ error: `Counter '${name}' Not Found` });
  }
}

async function deleteCounter(response, name) {
  await reload(JSONfile);
  if (counterExists(name)) {
    const count = counters[name];
    delete counters[name];
    await saveCounters();
    response.json({ name: name, value: count });
  } else {
    // 404 - Not Found
    response.status(404).json({ error: `Counter '${name}' Not Found` });
  }
}

async function dumpCounters(response) {
  await reload(JSONfile);
  response.json(counters);
}

// NEW
const app = express();
const port = 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/client', express.static('client'));

//login

//logout

//create user
app.post('/newUser', async (request, response) => {
  const options = request.body;
  //name, email, password
  createUser(response, options.name, options.email, options.password);
});

//return user
app.get('/getUserbyId', async (request, response) => {
  const options = request.query;
  getUser(response, options.user_id);
});

//add event to user's profile
app.put('/createEvent', async (request, response) => {
  const options = request.body;
  createEvent(response, options.user_id);
});

//change an event
app.put('/editEvent', async (request, response) => {
  const options = request.body;
  updateEvent(response, options.user_id, options.event_id);
});

//delete an event
app.delete('/deleteEvent', async (request, response) => {
  const options = request.body;
  deleteEvent(response, options.user_id, options.event_id);
  //let event = delete_data(eventid, true)
  //let user = read_data(event.hostid, false)
  //update user object -> user.events: delete events[eventid]
  //update_date(user.user_id, user, false)

});

//read an event
app.get('/getEventbyId', async (request, response) => {
  const options = request.query;
  getEvent(response, options.event_id);
});

//get all attendees
app.get('/getAttendees', async (request, response) => {
  const options = request.query;
  getEventAttendees(response, options.user_id, options.event_id);
});

//RSVP to an event
app.put('/attendEvent', async (request, response) => {
  const options = request.body;
  attendEvent(response, options.user_id, options.event_id);
});

//return
app.get('/dumpEvents', async (request, response) => {
  const options = request.body;
  updateCounter(response, options.user_id);
});



// NEW
app.listen(port, () => {
  console.log(`Server started on poart ${port}`);
});
