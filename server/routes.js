import express from 'express';
import User from './users';
import Event from './events';

//refs: https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
// https://www.mongodb.com/languages/javascript/mongodb-and-npm-tutorial
// https://gist.github.com/FBosler/513a0f5f845fbf6e937ab768ed88e183#file-users-js
// https://www.geeksforgeeks.org/how-to-make-mongoose-multiple-collections-using-node-js/
// https://www.digitalocean.com/community/tutorials/nodejs-crud-operations-mongoose-mongodb-atlas
// https://www.djamware.com/post/58eba06380aca72673af8500/node-express-mongoose-and-passportjs-rest-api-authentication


//expressjs routes using mongoose module

const router = express.Router();


//login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", function(err, user, info) {
      if (err) {
          return res.status(400).json({ errors: err });
      }
      if (!user) {
          return res.status(400).json({ errors: "No user found" });
      }
      req.logIn(user, function(err) {
          if (err) {
              return res.status(400).json({ errors: err });
          }
          return res.status(200).json({ success: `logged in ${user.id}` });
      });
  })(req, res, next);
});


router.get('/login', (req, res) =>
  res.sendFile('client/log_in.html', { root: __dirname })
);

router.get('/map', (req, res) =>
  res.sendFile('client/map.html', { root: __dirname })
);

router.get('/register', (req, res) =>
  res.sendFile('client/sign_up.html', { root: __dirname })
);

router.get('/event-editor', (req, res) =>
  res.sendFile('client/event_creator.html', { root: __dirname })
); // :eventID

router.get('/my-events', (req, res) =>
  res.sendFile('client/my_events.html', { root: __dirname })
); // :userID

router.post('/login', auth.authenticate('local', {
  successRedirect: '/map',
  failureRedirect: '/login',
  })
);

//logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

//create user
router.post('/newUser', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send(user);
  } catch (err){
    res.status(404).send(err);
  }
});

//create event
router.post('/createEvent', async (req, res) => {
  const event = new Event(req.body);
  try {
    await event.save();
    res.send(event);
  } catch (err){
    res.status(500).send(err);
  }
});

//return user
router.get('/getUserbyId', async (req, res) => {
  try {
    const user = await User.find({_id: req.params.id});
    if (!user) res.status(404).send("User not found");
    res.send(user);
  } catch(err){
    res.status(500).send(err);
  }
});

//return an event
router.get('/getEventbyId', async (req, res) => {
  try {
    const event = await Event.find({_id: req.params._id});
    if (!event) res.status(404).send("Event not found");
    res.send(event);
  } catch(err){
    res.status(500).send(err);
  }
});

//change an event
router.put('/editUser', async (req, res) => {

  await User.findByIdAndUpdate(req.params.id, req.body);

  (err, user) => {
    if (err) return res.status(500).send(err);
    return res.send(user);
  }
});

//change an event
router.put('/editEvent', async (req, res) => {

  await Event.findByIdAndUpdate(req.params.id, req.body);

  (err, event) => {
    if (err) return res.status(500).send(err);
    return res.send(event);
  }
});

//delete a user
router.delete('/deleteUser', async (req, res) => {
  await User.findByIdAndDelete(req.params.id, req.body);

  (err, user) => {
    if (err) return res.status(500).send(err);
    return res.send(user);
  }
});

//delete an event
router.delete('/deleteEvent', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id, req.body);

  (err, event) => {
    if (err) return res.status(500).send(err);
    return res.send(event);
  }
});

//getAttendees
router.get('/getAttendees', async (req, res) => {
  try {
    const {id} = req.body;
    const event = await self.db.readEvent(id);
    res.send(JSON.stringify(event.attendees));
  } catch(err){
    res.status(404).send(err);
  }
});

//attendEvent
router.put('/attendEvent', async (req, res) => {
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
router.get('*', (req, res) => {
  res.send('Error');
});

module.exports = router;