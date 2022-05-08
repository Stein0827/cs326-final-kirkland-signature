# Part 1: Database implementation

We used MongoDB for database.

**Event Object** - 8 fields: Host ID, Host Name, Event ID, Event Title, Description, Location, Time, List of attendees  
```
//event object structure  
let event = {  
    host_id: "",  
    host_name: "",
    event_id: "",  
    event_name: "",  
    event_desc: "",  
    event_location: "",  
    event_time: "",   
    attendees: [],
}  
```
Event ID is generated via MongoDB.

**User Object** - 6 fields: User ID, first name, last name, UMass Email, Password, List of events created  
```
//user object structure
let user = {
    user_id: "",
    first_name: "",
    last_name: "",
    user_email: "",
    password: "",
    events: [], //array of event ids
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
