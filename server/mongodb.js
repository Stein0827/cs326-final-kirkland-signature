import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

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
    this.db = this.client.db('people');

    // Init the database.
    await this.init();
  }

  async init() {
    this.users = this.db.collection('users');
    this.events = this.db.collection('events');

    //const count = await this.collection.countDocuments();

  }

  // Close the pool.
  async close() {
    this.client.close();
  }

  // CREATE a user in the database.
  async createUser(id, name, age) {
    const res = await this.users.insertOne({ _id: id, name, age });
    // Note: the result received back from MongoDB does not contain the
    // entire document that was inserted into the database. Instead, it
    // only contains the _id of the document (and an acknowledged field).
    return res;
  }

    // CREATE a user in the database.
  async createEvent(id, name, age) {
    const res = await this.events.insertOne({ _id: id, name, age });
    // Note: the result received back from MongoDB does not contain the
    // entire document that was inserted into the database. Instead, it
    // only contains the _id of the document (and an acknowledged field).
    return res;
  }

  // READ a user from the database.
  async readUser(id) {
    const res = await this.users.findOne({ _id: id });
    return res;
  }

  // READ an event from the database
  async readEvent(id) {
    const res = await this.users.findOne({ _id: id });
    return res;
  }

  // UPDATE a user in the database
  async updateUser(id, name, age) {
    const res = await this.users.updateOne(
      { _id: id },
      { $set: { name, age } }
    );
    return res;
  }


  // UPDATE an event in the database.
  async updateEvent(id, name, age) {
    const res = await this.events.updateOne(
      { _id: id },
      { $set: { name, age } }
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
    

//   // READ all people from the database.
//   async readAllPeople() {
//     const res = await this.collection.find({}).toArray();
//     return res;
//   }
}