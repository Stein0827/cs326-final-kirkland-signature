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
  let data = deleteData(ID, false);
  if (data === -1) {
    // 404 - Not Found
    response.status(404).json({ error: 'User ID not found' });
  } else {
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


async function updateEvent(response, ID, event) {
  if (event.host_id === undefined || event.host_name === undefined || event.event_name === undefined || event.event_desc === undefined 
    || event.event_location === undefined || event.event_time === undefined) {
    // 400 - Bad Request
    response.status(400).json({ error: 'Missing fields' });
  } else {
    let updatedEvent = await readData(ID, true);
    if(updatedEvent === -1) {
      // 404 - Not Found
      response.status(404).json({ error: 'Event ID not found' });
    } else {
      updatedEvent.host_id = event.host_id;
      updatedEvent.host_name = event.host_name;
      updatedEvent.event_name = event.event_name;
      updatedEvent.event_desc = event.desc;
      updatedEvent.event_location = event.event_location;
      updatedEvent.event_time = event.event_time;
      if (updatedEvent.attendees.length > 0) {
        updatedEvent.attendees.push(event.attendees);
      }
      else {
        updatedEvent.attendees = event.attendees;
      }
      await updateData(ID, updatedEvent, true);
      response.status(200).json(updatedEvent);
    }
  }
}

async function deleteEvent(response, ID) {
  let data = deleteData(ID, true);
  if (data === -1) {
    // 404 - Not Found
    response.status(404).json({ error: 'Event ID not found' });
  } else {
    response.status(200).json(data);
  }
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
  createEvent(response, options.user_id, 
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

app.use('/', express.static('client'));

// NEW
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});