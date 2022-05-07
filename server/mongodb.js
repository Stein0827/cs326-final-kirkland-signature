import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

export class MapDatabase {
  constructor(dburl) {
    this.dburl = dburl;
  }

  async connect() {
    this.client = await MongoClient.connect(this.dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });

    // Get the database.
    // this.users = this.client.db('users');
    // this.events = this.client.db('events');

    this.db = this.client.db('UMAP-database');

    // Init the database.
    await this.init();
  }

  async init() {
    try {
      this.users = this.db.collection('users');
      this.events = this.db.collection('events');
    } catch(err){
      console.log(err);
    }
  }

  // Close the pool.
  async close() {
    this.client.close();
  }

  // CREATE a user in the database.
  async createUser(name, email, password) {
    // const new_user = {
    //   user_name : name,
    //   user_email : email,
    //   password : password,
    //   events : []
    // };
    let collision = await this.users.find({'email': email}).toArray();
    if (collision.length > 0) {
      res.status(304).send('user exists!');
      return false;
    }
    const res = await this.users.insertOne({user_name: name, user_email: email, password: password, events: []});
    // Note: the result received back from MongoDB does not contain the
    // entire document that was inserted into the database. Instead, it
    // only contains the _id of the document (and an acknowledged field).
    return res;
  }

  async testEvent(){
    const user = await this.createUser("BOB", "BOB@BOB.com", "BOB");
    const res = await this.events.insertOne({ host_id: user.insertedId,  host_name : "user.user_name", event_name: "THIS WILL BE DELETED", event_desc : 'event.event_ desc',
    event_location : [-72.52628581400859,42.38891007248816], event_time : 'event.event_time', attendees : "event.attendees"});
    return [res, user];
  }

    // CREATE a user in the database.
  async createEvent(event) {

    let user = await this.readUser(event.host_id);
    let collision = await this.events.find({'event_name': event.event_name}).toArray();
    if (collision.length > 0) {
      res.status(304).send('event already created');
      return false;
    }
    const res = await this.events.insertOne({'_id': ObjectId(id), 'host_id': event.host_id,  'host_name' : user.user_name, 'event_name': event.event_name, event_desc : 'event.event_ desc',
    'event_location' : event.event_location, 'event_time' : event.event_time, 'attendees' : event.attendees});
    
    user.events.push(res);
    await this.updateUser(user);
    // Note: the result received back from MongoDB does not contain the
    // entire document that was inserted into the database. Instead, it
    // only contains the _id of the document (and an acknowledged field).
    return res;
  }

  // READ a user from the database.
  async readUser(id) {
    const res = await this.users.find({ '_id': ObjectId(id) }).toArray();
    return res;
  }

  // gets user by email
  async findUserbyEmail(email) {
    try {
      const res = await this.users.findOne({'email': email});
      return res
    } catch(err){
      console.log(err);
      return false;
    }
  }

  // finds user by password and email
  async validateLogin(email, password) {
    try {
      const res = await this.users.findOne({'email': email, 'password': email});
      return res;
    } catch(err){
      console.log(err);
      return false;
    }
    
  }

  // READ an event from the database
  async readEvent(id) {
    const res = await this.events.find({ '_id': ObjectId(id) }).toArray();
    return res;
  }

  // UPDATE a user in the database
  async updateUser(user) {
    const res = await this.users.updateOne(
      { _id: user._id },
      { $set: {'user_name':user.name, 'user_email':user.email, 'password':user.password} }
    );
    return res;
  }

  // UPDATE an event in the database.
  async updateEvent(event) {
    const user = await this.readUser(event.host_id);
    const res = await this.events.updateOne(
      { _id: event._id },
      { $set: {'host_id': event.host_id,  'host_name' : user[0].user_name, 'event_name': event.event_name, event_desc : 'event.event_ desc',
        'event_location' : event.event_location, 'event_time' : event.event_time, 'attendees' : event.attendees} }
    );
    return res;
  }

  async updateRSVP(event, user_id) {
    event.attendees.push(user_id)
    const res = await this.events.updateOne(
      { _id: ObjectId(event.id) },
      { $set: {'_id': ObjectId(event.id), 'host_id': event.host_id,  'host_name' : user.user_name, 'event_name': event.event_name, event_desc : 'event.event_ desc',
        'event_location' : event.event_location, 'event_time' : event.event_time, 'attendees' : event.attendees} }
    );
    return res;
  }

  // DELETE a user from the database.
  async deleteUser(id) {
    // Note: the result received back from MongoDB does not contain the
    // entire document that was deleted from the database. Instead, it
    // only contains the 'deletedCount' (and an acknowledged field).
    const res = await this.users.deleteOne({ _id: id });
    return res;
  }

    // DELETE an event from the database.
  async deleteEvent(id) {
    // Note: the result received back from MongoDB does not contain the
    // entire document that was deleted from the database. Instead, it
    // only contains the 'deletedCount' (and an acknowledged field).
    const res = await this.events.deleteOne({ _id: id });
    return res;
  }

  async dumpEvent() {
    const res = await this.events.find().toArray();
    return res;
  }
    
//   // READ all people from the database.
//   async readAllPeople() {
//     const res = await this.collection.find({}).toArray();
//     return res;
//   }
}