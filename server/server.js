import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { MapDatabase } from './mongodb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

const sessionConfig = {
  // set this encryption key in Heroku config (never in GitHub)!
  secret: process.env.SECRET || 'SECRET',
  resave: false,
  saveUninitialized: false,
};

class UMapServer {
  constructor() {
    this.dburi = process.env.MONGODB_URI || "mongodb+srv://UMap:YkDlq6WGWezfWagM@cluster0.pbgzv.mongodb.net/UMAP-database?retryWrites=true&w=majority";
    this.app = express();
    this.app.use('/', express.static('./client'));
  }

  //check if we are logged in
  checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      // If we are authenticated, run the next route.
      next();
    } else {
      // Otherwise, redirect to the login page.
      res.redirect('/login');
    }
  }

  async initRoutes() {
    const self = this;

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
    
    // this.app.post('/login', auth.authenticate('local', {
    //     successRedirect: '/map',
    //     failureRedirect: '/login',
    //   })
    // );
    
    //logout
    this.app.get('/logout', (req, res) => {
      req.logout();
      res.redirect('/login');
    });
    
    //register a new user
    this.app.post('/register', async (req, res) => {
      try {
        const { name, email, password } = req.body;
        const user = await self.db.createUser(name, email, password);
        // res.send(JSON.stringify(user));
        res.status(200);
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //return user
    this.app.get('/getUserbyId', async (req, res) => {
      try {
        const { id } = req.body;
        const user = await self.db.readUser(id);
        res.send(JSON.stringify(user));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //add event to user's profile
    this.app.post('/createEvent', async (req, res) => {
      try {
        const { event } = req.body;
        const evt = await self.db.createUser(event);
        res.send(JSON.stringify(evt));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //change an event
    this.app.put('/editEvent', async (req, res) => {
      try {
        const { event } = req.body;
        const evt = await self.db.updateEvent(event);
        // res.send(JSON.stringify(user));
        res.send(JSON.stringify(evt));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    this.app.delete('/deleteUser', async (req, res) => {
      try {
        const { id } = req.body;
        const user = await self.db.deleteUser(id);
        res.send(JSON.stringify(person));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //delete an event
    this.app.delete('/deleteEvent', async (req, res) => {
      try {
        const { id } = req.body;
        const person = await self.db.deletePerson(id);
        res.send(JSON.stringify(person));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //read an event
    this.app.get('/getEventbyId', async (req, res) => {
      try {
        const { id } = req.body;
        const event = await self.db.updateEvent(id);
        res.send(JSON.stringify(event));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //get all attendees
    this.app.get('/getAttendees', async (req, res) => {
      try {
        const { id } = req.body;
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
    
    this.app.get('/dumpEvents', async (req, res) => {
      try {
        const evt = await self.db.dumpEvents();
        res.send(JSON.stringify(evt));
      } catch (err) {
        res.status(500).send(err);
      }
    });
  }

  async initDB() {
    this.db = new MapDatabase(this.dburi);
    await this.db.connect();
  }

  async start() {
    await this.initRoutes();
    await this.initDB();
    const port = process.env.PORT || 8080;
    this.app.listen(port, () => {
      console.log(`Server listening on port ${port}!`);
    });
  }
}

const server = new UMapServer();
server.start();