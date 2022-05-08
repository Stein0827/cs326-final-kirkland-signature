# team name - Kirkland Signature

## UMap
## Spring 2022
## overview
## team members
Rishab - rwmehta
Suyash - Suyash-Deshmukh
Alex - qiu-alex
Paul - Stein0827
## user iterface
## APIs
| Event                      | description                                                                                                                                                                                                                              | User                                               | description                                                                                                                                                                       |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| createEvent(event)         | The event parameter takes in an event object that contains host_id, host_name, event_name, event_desc, event_location, event_time, and attendees. The function uses POST method to  create an new event.                                 | createUser(first_name, last_name, email, password) | All parameters are strings and it creates a new user on MongoDB  via POST method.                                                                                                 |
| readEvent(id)              | The parameter is the MongoDB objectID() type and the function finds and returns the event with the unique ID. The function uses GET method.                                                                                              | readUser(id)                                       | The parameter is the MongoDB objectID() type and the function finds and returns the user with the unique ID. The function  uses GET method.                                       |
| updateEvent(event)         | The event parameter takes in an event object that contains host_id, host_name, event_name, event_desc, event_location, event_time, and attendees. The function updates the event with the new event object. The function uses PUT method | updateUser(user)                                   | The user parameter is a User object that contains user_name, user_email, and user_password. The function updates the user with the new user object. The function uses PUT method. |
| updateRSVP(event, user_id) | The RSVP function updates the attendees list in the Events object using the event object parameter and user_id parameter. The function uses PUT method.                                                                                  | deleteUser(id)                                     | The id parameter is the MongoDB objectID() type. The function uses the id to find the user in the database and deletes it. The function uses DELETE method.                       |
| deleteEvent(id)            | The id parameter is the MongoDB objectID() type. The function uses the id to find the event in the database and deletes it. The function uses DELETE method.                                                                             |                                                    |                                                                                                                                                                                   |

## URL Routes/Mappings
| URL routes    | description                                                                                                                                       |
|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| /login        | redirects the client to the login page.                                                                                                           |
| /map          | redirects the client to the map page to view the overall map and all the events.                                                                  |
| /event-editor | redirects the client to the event editor page.  The user is allowed to change the event page.  Requires authentication for editing event details. |
| /my-event     | redirects the client to the my events page. The  page allows the users to view all the events they created. requires authentication.              |
| /event-viewer | redirects the clients to the event viewer page. The  page allows the user/guest to view the details of the event.                                 |
| /logout       | logs out the current user from the session.                                                                                                       |
| /register     | calls the /createUser route. Creates a new user.                                                                                                  |
| /getUserById  | Make a query to find the user using the mongodb ObjectID.                                                                                         |
| /createEvent  | Creates a new event.                                                                                                                              |
| /editEvent    | Update/edit an event.                                                                                                                             |
| /deleteUser   | deletes an existing user.                                                                                                                         |
| /deleteEvent  | deletes an existing event.                                                                                                                        |
| /getEventById | Make a query to find the event using the mongodb ObjectID.                                                                                        |
| /getAttendees | returns a list of attendees of a given event.                                                                                                     |
| /attendEvent  | RSVP to an event.                                                                                                                                 |
## Authentication/Authorization
## Division of Labor
## Conclusion

Our website has been deployed to Heroku and can be accessed through the following link:
https://cs326-final-umap.herokuapp.com/