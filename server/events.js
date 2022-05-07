//mongoose event schema
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const eventSchema = new mongoose.schema({
    host_id: ObjectId,
    host_name: String,
    event_name: String,
    event_desc: String,
    event_location: String,
    event_time: Date,
    // images: "",
    attendees: Array,
});

module.exports = Event = mongoose.model('events', eventSchema);