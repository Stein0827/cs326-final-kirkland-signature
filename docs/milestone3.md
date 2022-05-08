# Part 1: Database implementation

We used MongoDB for database.

**Event Document** - 8 fields: Host ID, Host Name, Event ID, Event Title, Description, Location, Time, List of attendees  
```
//event document
{
    _id: <ObjectId>  
    host_id: <ObjectId>,  
    host_name: String,  
    event_name: String,  
    event_desc: String,  
    event_location: Array,  // Array of size 2, holds float data members, points to coordinates on map
    event_time: Date,   
    attendees: Array,
}  
```
Event ID is generated via MongoDB.

**User Object** - 5 fields: User ID, User Name, UMass Email, Password, List of events created  
```
//user object structure
let user = {
    _id: <ObjectId>,
    user_name: String,
    user_email: Email,
    password: String,
    events: Array, //array of event ids they made
};
```
User ID is generated via MongODB.

**Created** - Relationship between an event and a user, belongs to User. Contains event ID and User ID.  
**RSVPed** - Relationship between an event and a user, belongs to Event. Contains event ID and User ID.  


# Breakdown of Division of Labor
- Rishab: Worked on authentication and the CRUD functions of MongoDB integration, worked on front end integration.


- Paul: Worked on documentation and CRUD functions of MongoDB integration.


- Alex: Worked on authentication and CRUD functions of MongoDB integration.


- Suyash: Worked on authentication and CRUD functions of MongoDB integration, worked on documentation.
