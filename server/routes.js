import express from 'express';
import User from './users';
import Event from './events';

//refs: https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
// https://www.mongodb.com/languages/javascript/mongodb-and-npm-tutorial
// https://gist.github.com/FBosler/513a0f5f845fbf6e937ab768ed88e183#file-users-js
// https://www.geeksforgeeks.org/how-to-make-mongoose-multiple-collections-using-node-js/
// https://www.digitalocean.com/community/tutorials/nodejs-crud-operations-mongoose-mongodb-atlas

//expressjs routes using mongoose module

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
  const user = new User(req.body);
  try {
    await user.save();
    res.send(user);
  } catch (err){
    res.status(404).send(err);
  }
});

//create event
app.post('/createEvent', async (req, res) => {
  const event = new Event(req.body);
  try {
    await event.save();
    res.send(event);
  } catch (err){
    res.status(500).send(err);
  }
});

//return user
app.get('/getUserbyId', async (req, res) => {
  try {
    const user = await User.find({_id: req.params.id});
    if (!user) res.status(404).send("User not found");
    res.send(user);
  } catch(err){
    res.status(500).send(err);
  }
});

//return an event
app.get('/getEventbyId', async (req, res) => {
  try {
    const event = await Event.find({_id: req.params._id});
    if (!event) res.status(404).send("Event not found");
    res.send(event);
  } catch(err){
    res.status(500).send(err);
  }
});

//change an event
app.put('/editUser', async (req, res) => {

  await User.findByIdAndUpdate(req.params.id, req.body);

  (err, user) => {
    if (err) return res.status(500).send(err);
    return res.send(user);
  }
});

//change an event
app.put('/editEvent', async (req, res) => {

  await Event.findByIdAndUpdate(req.params.id, req.body);

  (err, event) => {
    if (err) return res.status(500).send(err);
    return res.send(event);
  }
});

//delete a user
app.delete('/deleteUser', async (req, res) => {
  await User.findByIdAndDelete(req.params.id, req.body);

  (err, user) => {
    if (err) return res.status(500).send(err);
    return res.send(user);
  }
});

//delete an event
app.delete('/deleteEvent', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id, req.body);

  (err, event) => {
    if (err) return res.status(500).send(err);
    return res.send(event);
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
app.put('/attendEvent', async (req, res) => {
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

//return error if invalid request is given
app.get('*', (req, res) => {
  res.send('Error');
});

export default app;