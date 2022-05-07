//mongoose event schema
import mongoose from 'mongoose';


const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const eventSchema = new Schema({
    host_id: ObjectId,
    host_name: String,
    event_name: String,
    event_desc: String,
    event_location: String,
    event_time: Date,
    // images: "",
    attendees: Array
});

module.exports = mongoose.model('Event', eventSchema);

