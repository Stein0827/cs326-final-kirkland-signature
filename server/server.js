import express from 'express';
import expressSession from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { MapDatabase } from './mongodb.js';
import cookieParser from 'cookie-parser';

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
      cookie: {maxAge: 60000}
    };

    //setup session 
    this.app.use(expressSession(sessionConfig));
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    this.app.use('/', express.static('./client'));
    this.app.use(cookieParser());
    // this.app.use(passport.initialize());
    // this.app.use(passport.session());
  }

  //check if we are logged in
  checkLoggedIn(req, res, next) {
    if (req.session.user()) {
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

    // // Handle post data from the login.html form.
    this.app.post('/login', async function(req, res){
      const {email, password} = req.body;
      if (!(await self.db.findUserCount(email))){
        console.log('wrong email');
        res.redirect('/login');
      } else if (!(await self.db.validateLogin(email, password))){
        console.log('check your password');
        res.redirect('/login');
      } else {
        let user = await self.db.findUserbyEmail(email);
        req.session.user_name = (await self.db.readUser(user._id)).user_name;
        req.session.user_id = user._id;
        res.redirect('/map');
      }
    });

    // Handle logging out (takes us back to the login page).
    this.app.get('/logout', function(req, res){
      req.session.destroy(function(){
         console.log("user logged out.")
      });
      res.redirect('/login');
   });
    
    //go to register landing page
    this.app.get('/register', (req, res) =>
      res.sendFile('client/sign_up.html', { root: __dirname })
    );

    this.app.get('/event-editor', (req, res) =>{
      if(req.session.user_id){
        res.sendFile('client/event_creator.html', { root: __dirname })
      } else{
        res.sendFile('client/map.html', { root: __dirname });
      }
    });

    //register a new user
    this.app.post('/register', async (req, res) => {
        const { name, email, password } = req.body;
        //if user with same email already exists
        if (!(await self.db.createUser(name, email, password))){
          console.log("User with same email already exists");
          res.redirect('/sign_up');
        } else {
          const user = await self.db.createUser(name, email, password);
          console.log(user);
          req.session.user = await self.db.readUser(user.insertedId).user_name;
          console.log(req.session.user); 
          res.redirect('/map'); 
        }
    
    });

    this.app.get('/map', (req, res) => {
      // await self.db.testEvent();
      res.sendFile('client/map.html', { root: __dirname });
    });


    this.app.get('/my-events', (req, res) => {
      if(req.session.user_id){
        res.sendFile('client/my_events.html', { root: __dirname })
      } else{
        res.sendFile('client/map.html', { root: __dirname });
      }
    });
    
    this.app.get('/event-viewer', (req, res) =>
      res.sendFile('client/event_viewer.html', { root: __dirname })
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
        const evt = await self.db.createEvent(event, req.session.user_id,);
        res.send(JSON.stringify(evt));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //change an event
    this.app.put('/editEvent', async (req, res) => {
      try {
        const { event } = req.body;
        const evt = await self.db.updateEvent(event, req.session.user_id);
        res.send(JSON.stringify(evt));
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
    this.app.get('/getEventbyId/:eventID', async (req, res) => {
      try {
        const id = req.params.eventID;
        const event = await self.db.readEvent(id);
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
        res.status(200).send(JSON.stringify(attendees));
      } catch (err) {
        res.status(500).send(err);
      }
    });
    
    //RSVP to an event
    this.app.put('/attendEvent', async (request, response) => {
      try {
        // const { event } = req.body;
        const event_id = req.body.event_id;
        const uid = req.session.user_id;
        const evt = await self.db.updateRSVP(event_id, uid);
        res.send(JSON.stringify(evt));
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


    this.app.get('/getEventByUser', async (req, res) => {
      try {
        const evt = await self.db.readEventByUser(req.session.user_id);
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