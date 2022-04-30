import express, { res } from 'express';
import {MapDatabase} from './mongodb.js';

//new file for mongodb routing 

class MapServer {
  constructor(dburl) {
    this.dburl = dburl;
    this.app = express();
  }

  async initRoutes() {
    // Note: when using arrow functions, the "this" binding is lost.
    const self = this;

    //login
    this.app.get('/login', (req, res) =>
      res.sendFile('client/log_in.html', { root: __dirname })
    );

    this.app.get('/map', (req, res) =>
      res.sendFile('client/map.html', { root: __dirname })
    );

    this.app.get('/register', (req, res) =>
      res.sendFile('client/sign_up.html', { root: __dirname })
    );

    this.app.get('/event-editor', (req, res) =>
      res.sendFile('client/event_creator.html', { root: __dirname })
    ); // :eventID

    this.app.get('/my-events', (req, res) =>
      res.sendFile('client/my_events.html', { root: __dirname })
    ); // :userID

    this.app.post('/login', auth.authenticate('local', {
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
    this.app.post('/newUser', async (req, res) => {
      try {
        const {name, email, password} = req.body;
        const user = await self.db.createUser(name, email, password);
        res.send(JSON.stringify(user));
      } catch (err){
        res.status(404).send(err);
      }
    });

    //create event
    this.app.post('/createEvent', async (req, res) => {
      try {
        const event = req.body;
        const data = await self.db.createEvent(event);
        res.send(JSON.stringify(data));
      } catch (err){
        res.status(404).send(err);
      }
    });

    //return user
    this.app.get('/getUserbyId', async (req, res) => {
      try {
        const {id} = req.body;
        const user = await self.db.readUser(id);
        res.send(JSON.stringify(user));
      } catch(err){
        res.status(404).send(err);
      }
    });

    //return an event
    this.app.get('/getEventbyId', async (req, res) => {
      try {
        const {id} = req.body;
        const event = await self.db.readEvent(id);
        res.send(JSON.stringify(event));
      } catch(err){
        res.status(404).send(err);
      }
    });

    //change an event
    this.app.put('/editUser', async (req, res) => {
      try{
        const {name, email, password} = req.body;
        const data = await self.db.updateUser(name, email, password);
        res.send(JSON.stringify(data));
      } catch(err){
        res.status(404).send(err);
      }
    });

    //change an event
    this.app.put('/editEvent', async (req, res) => {
      try{
        const event = req.body;
        const data = await self.db.updateEvent(event);
        res.send(JSON.stringify(data));
      } catch(err){
        res.status(404).send(err);
      }
    });

    //delete a user
    this.app.delete('/deleteUser', async (req, res) => {
      try{
        const {id} = req.body;
        const user = await self.db.deleteUser(id);
        res.send(JSON.stringify(user));
      } catch(err){
        res.status(404).send(err);
      }
    });

    //delete an event
    this.app.delete('/deleteEvent', async (req, res) => {
      try{
        const {id} = req.body;
        const event = await self.db.deleteUser(id);
        res.send(JSON.stringify(event));
      } catch(err){
        res.status(404).send(err);
      }
    });

    //getAttendees
    this.app.get('/getAttendees', async (req, res) => {
      try {
        const {id} = req.body;
        const event = await self.db.readEvent(id);
        res.send(JSON.stringify(event.attendees));
      } catch(err){
        res.status(404).send(err);
      }
    });
    
    //attendEvent
    this.app.put('/editEvent', async (req, res) => {
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

    //dumpEvents
  }

  async initDb() {
    this.db = new MapDatabase(this.dburl);
    await this.db.connect();
  }

  async start() {
    await this.initRoutes();
    await this.initDb();
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`PeopleServer listening on port ${port}!`);
    });
  }
}

const server = new MapServer(process.env.DATABASE_URL);
server.start();