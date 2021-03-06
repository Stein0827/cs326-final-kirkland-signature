# Part 0: Data Interactions
2 types of Users: Signed-In users and Signed-Out users.
- Map is shown on main page irrespective of user type.
- Map has pins, which can be clicked on by any user to open a pop-up with information about the event they clicked on.
- Each event has multiple types of data: the event title, description, location (address), time of event, and image(s), visible to all types of users.
- Signed-In Users can go to event creator page to be able to edit all of the above data types for events they have made. 
- Each event will have number of people already RSVPed for the event, shown only to Signed-In users. Signed-In users will be able to click to RSVP themselves. This data can not be edited by the Signed-In users.


# Part 1: Wireframes
* Landing Page:
Wireframe:
![landing page wireframe](images/wireframe_landing_page.png)

This is a mockup for the landing page for our website, which will allow you to reach the sign in page or continue to the main map page as a guest ("Viewer" user)

Screenshot:
![landing page](images/landing_page.png)

The image above is the finalized landing page we have come up with.

* Sign-in Page:
Wireframe:
![sign-in page](images/wireframe_sign_up.png)

This is a mockup for the sign-up page, it will redirect people to the main map page after they sign-up.

Screenshot:
![sign-in page](images/signup.png)

The image above is the finalized sign-up page we have come up with.

* Login Page:
Screenshot:
![sign-in page](images/login.png)

This is the finalized login page.

* Map Page:
Wireframe:
![map page](images/wireframe_map.png)

The main page will have a map, which has pins relating to events on it. The white rectangle on the right side of the page is where the user will be able to see the information about the event they clicked on. The button on the top left is for creating events, and will only be available to users who are Event Planners. This button will take the user to a event creator page which will have a form for the user to input information.

Screenshot:
![map page](images/map.png)

This is the final map page we made.

* Event Creator Page:
Screenshot:
![event page](images/make-event.png)

This page will allow you to make new events or edit already existing events. After clicking on the save button, it will return the user to the main map page.

* My Events Page:
Screenshot:
![event page](images/my-events.png)

This page will allow you to see all your events and allows you to open the edit page for each event. Currently, you cannot access this page as the button to take you there is not present. This button will replace the current "sign-in/login" button after we implement signing in, as you should only see this button if you are a signed in user. 


# Breakdown of Division of Labor
- Rishab:
Researched on map APIs, made the maps on the main page and the event creator page. Made wireframes. Worked on the my-events page.

- Paul:
Made the landing page. Worked on wireframes. Worked on the main map page.

- Alex:
Made the sign-up and login pages. Worked on wireframes.

- Suyash:
Made the milestone1.md file. Worked on wireframes. Made Event Creator Page. Worked on the my-events page.