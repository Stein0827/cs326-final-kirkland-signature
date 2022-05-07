import express from 'express';
import expressSession from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { MapDatabase } from './mongodb.js';
import auth from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));


class UMapServer {
  constructor() {
    this.dburi = process.env.MONGODB_URI || "mongodb+srv://UMap:YkDlq6WGWezfWagM@cluster0.pbgzv.mongodb.net/UMAP-database?retryWrites=true&w=majority";

    this.app = express();

    const sessionConfig = {
      // set this encryption key in Heroku config (never in GitHub)!
      secret: process.env.SECRET || 'SECRET',
      resave: false,
      saveUninitialized: false,
    };

    //setup session 
    this.app.use(expressSession(sessionConfig));
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: false}));
    this.app.use('/', express.static('./client'));
    auth.configure(this.app);
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

    // Handle post data from the login.html form.
    this.app.post(
      '/login',
      auth.authenticate('local', {
        // use username/password authentication
        successRedirect: '/map', // when we login, go to /private
        failureRedirect: '/login', // otherwise, back to login
      })
    );

    // Handle logging out (takes us back to the login page).
    this.app.get('/logout', (req, res) => {
      req.logout(); // Logs us out!
      res.redirect('/login'); // back to login
    });
    
    //go to register landing page
    this.app.get('/register', (req, res) =>
      res.sendFile('client/sign_up.html', { root: __dirname })
    );

    //register a new user
    this.app.post('/register', async (req, res) => {
      try {
        const { first_name, last_name, email, password } = req.body;
        const user = await self.db.createUser(first_name, last_name, email, password);
        res.redirect('/login'); // go back to login page
      } catch (err) {
        console.log(err);
        //res.redirect('/register'); //stay on register page
      }
    });

    this.app.get('/map', (req, res) => {
      // await self.db.testEvent();
      res.sendFile('client/map.html', { root: __dirname });
    });

    this.app.get('/event-editor/:eventID', (req, res) =>
      res.sendFile('client/event_creator.html', { root: __dirname })
    );

    this.app.get('/my-events/:userID', (req, res) =>
      res.sendFile('client/my_events.html', { root: __dirname })
    );
       
    //return user
    this.app.get('/getUserbyId', async (req, res) => {
      try {
        const { id } = req.body;
        const user = await self.db.readUser(id);
        res.status(200).send(JSON.stringify(user));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //add event to user's profile
    this.app.post('/createEvent', async (req, res) => {
      try {
        const { event } = req.body;
        const evt = await self.db.createUser(event);
        res.status(200).send(JSON.stringify(evt));
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
        res.status(200).send(JSON.stringify(evt));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    this.app.delete('/deleteUser', async (req, res) => {
      try {
        const { id } = req.body;
        const user = await self.db.deleteUser(id);
        res.status(200).send(JSON.stringify(person));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //delete an event
    this.app.delete('/deleteEvent', async (req, res) => {
      try {
        const { id } = req.body;
        const person = await self.db.deletePerson(id);
        res.status(200).send(JSON.stringify(person));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //read an event
    this.app.get('/getEventbyId', async (req, res) => {
      try {
        const { id } = req.body;
        const event = await self.db.updateEvent(id);
        res.status(200).send(JSON.stringify(event));
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
        res.status(200).send(JSON.stringify(attendees));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //RSVP to an event
    this.app.put('/attendEvent', async (request, response) => {
      try {
        const { event } = req.body;
        const evt = await self.db.updateRSVP(event);
        res.status(200).send(JSON.stringify(evt));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    this.app.get('/dumpEvents', async (req, res) => {
      try {
        const evt = await self.db.dumpEvent();
        res.status(200).send(JSON.stringify(evt));
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