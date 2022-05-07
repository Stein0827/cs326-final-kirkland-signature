# Part 1: Database implementation


**Event Object** - 7 fields: Host ID, Host Name, Event ID, Event Title, Description, Location, Time, Images, List of attendees  
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
    images: "",  
    attendees: [],  
    is_event: true  
}  
```
Event ID is a random number between 0 and 10,000 assigned to each event. This and the is_event=true boolean tag are what is used to uniquely identify an event.

**User Object** - 6 fields: User ID, Name, UMass Email, Password, List of events created  
```
//user object structure
let user = {
    user_id: "",
    user_name: "",
    user_email: "",
    password: "",
    events: [], //array of event ids
    is_event: false
};
```
User ID is a random number between 0 and 10,000 assigned to each User. This and the is_event=false boolean tag are what is used to uniquely identify a user.

**Created** - Relationship between an event and a user, belongs to User. Contains event ID and User ID.  
**RSVPed** - Relationship between an event and a user, belongs to Event. Contains event ID and User ID.  


# Breakdown of Division of Labor
- Rishab:


- Paul:


- Alex:


- Suyash:
