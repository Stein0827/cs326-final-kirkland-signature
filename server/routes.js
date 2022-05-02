const express = require('express');
const User = require('./users');
const Event = require('./events');
const app = express();

//login
app.get('/login', (req, res) =>
  res.sendFile('client/log_in.html', { root: __dirname })
);

app.get('/map', (req, res) =>
  res.sendFile('client/map.html', { root: __dirname })
);

app.get('/register', (req, res) =>
  res.sendFile('client/sign_up.html', { root: __dirname })
);

app.get('/event-editor', (req, res) =>
  res.sendFile('client/event_creator.html', { root: __dirname })
); // :eventID

app.get('/my-events', (req, res) =>
  res.sendFile('client/my_events.html', { root: __dirname })
); // :userID

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
app.post('/newUser', async (req, res) => {
  try {
    const {name, email, password} = req.body;
    const user = await self.db.createUser(name, email, password);
    res.send(JSON.stringify(user));
  } catch (err){
    res.status(404).send(err);
  }
});

//create event
app.post('/createEvent', async (req, res) => {
try {
  const event = req.body;
  const data = await self.db.createEvent(event);
  res.send(JSON.stringify(data));
} catch (err){
  res.status(404).send(err);
}
});

//return user
app.get('/getUserbyId', async (req, res) => {
  try {
    const {id} = req.body;
    const user = await self.db.readUser(id);
    res.send(JSON.stringify(user));
  } catch(err){
    res.status(404).send(err);
  }
});

//return an event
app.get('/getEventbyId', async (req, res) => {
  try {
    const {id} = req.body;
    const event = await self.db.readEvent(id);
    res.send(JSON.stringify(event));
  } catch(err){
    res.status(404).send(err);
  }
});

//change an event
app.put('/editUser', async (req, res) => {
  try{
    const {name, email, password} = req.body;
    const data = await self.db.updateUser(name, email, password);
    res.send(JSON.stringify(data));
  } catch(err){
    res.status(404).send(err);
  }
});

//change an event
app.put('/editEvent', async (req, res) => {
  try{
    const event = req.body;
    const data = await self.db.updateEvent(event);
    res.send(JSON.stringify(data));
  } catch(err){
    res.status(404).send(err);
  }
});

//delete a user
app.delete('/deleteUser', async (req, res) => {
  try{
    const {id} = req.body;
    const user = await self.db.deleteUser(id);
    res.send(JSON.stringify(user));
  } catch(err){
    res.status(404).send(err);
  }
});

//delete an event
app.delete('/deleteEvent', async (req, res) => {
  try{
    const {id} = req.body;
    const event = await self.db.deleteUser(id);
    res.send(JSON.stringify(event));
  } catch(err){
    res.status(404).send(err);
  }
});

//getAttendees
app.get('/getAttendees', async (req, res) => {
  try {
    const {id} = req.body;
    const event = await self.db.readEvent(id);
    res.send(JSON.stringify(event.attendees));
  } catch(err){
    res.status(404).send(err);
  }
});

//attendEvent
app.put('/editEvent', async (req, res) => {
  try{
    let event = req.body;
    //implement function to get host id
    event.attendees.push(host_id)
    const data = await self.db.updateEvent(event);
    res.send(JSON.stringify(data));
  } catch(err){
    res.status(404).send(err);
  }
});

app.get('*', (req, res) => {
  res.send('Error');
});



module.exports = app;