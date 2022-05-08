async function readEvent(id) {
    const response = await fetch(`/getEventbyID/`+id, {
      method: 'GET'
    //   query: {event_id: id}
    });
    const data = await response.json();
    return data;
}

let curr_event = JSON.parse(localStorage.getItem("details"));

let data = await readEvent(curr_event);
data = data[0];

mapboxgl.accessToken = 'pk.eyJ1IjoicndtZWh0YSIsImEiOiJjbDEycmM0MDAwNGJiM2tvMGV5cDF4cXZmIn0.6eUqwB8FMxRQOVqH5ymQ4Q';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: [-72.52628581400859,42.38891007248816], // starting position [lng, lat]
zoom: 14 // starting zoom
});
let coordinates = [-72.52628581400859,42.38891007248816];

map.on('style.load', function() {   
    map.on('click', function(e) {
        coordinates = e.lngLat;


    });
});

const mark = document.createElement('div');
mark.className = 'marker';
new mapboxgl.Marker(mark).setLngLat(data.event_location)
.setPopup(
new mapboxgl.Popup({ offset: 25 }) // add popups
  .setHTML(
    `<h3>${data.event_name}</h3><p>${data.event_desc}</p>`
  )
)
.addTo(map);


map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
);

// async function createEvent(name, time, desc){
//     try{
//         const response = await fetch('createEvent', {
//             method: 'POST',
//             body: JSON.stringify({event_name: name, event_time: time, event_desc: desc, event_location: coordinates, attendees: [], is_event: true}),
//         });
//     }
//     catch(err){
//         console.log(err);
//     }
// }

// async function updateEvent(name, time, desc){
//     try{
//         const response = await fetch('editEvent', {
//             method: 'PUT',
//             body: JSON.stringify({event_name: name, event_time: time, event_desc: desc, event_location: coordinates, attendees: attendees, is_event: true}),
//         });
//         const data = await response.json();
//         return data;
//     } catch(err) {
//         console.log(err);
//     }
// }

const cancel = document.getElementById("cancel"),
    ename = document.getElementById("event-name"),
    etime = document.getElementById("event-time"),
    edetails = document.getElementById("event-details"),
    attend = document.getElementById("attend"),
    rsvp = document.getElementById("rsvp");

//disable buttons accordingly 
// // if (ename.innerHTML === "" && etime.innerHTML === "" && edetails.innerHTML === ""){
// //     //disable edit button
// //     save.disabled = true;
// //     create.disabled = false;
// //     // disable links
// //     // save_link.href = '';
// //     // create_link.href = 'map.html';

// // } else {
// //     //disable create button
// //     create.disabled = true;
// //     save.disabled = false;
// //     // disable link
// //     // create_link = '';
// //     // save_link = 'map.html';
// // }

// save.addEventListener("click", async (e)=>{
//     await createEvent(ename.value, etime.value, edetails.value);
//     localStorage.removeItem("event");
// });


// create.addEventListener("click", async (e)=>{
//     await updateEvent(ename.value, etime.value, edetails.value);
//     localStorage.removeItem("event");
// });


rsvp.addEventListener("click", async (e)=>{
    const response = await fetch(`/attendEvent`, {
        method: 'PUT',
        body: {
            event_id: curr_event
        }
      });
      const data = await response.json();
      return data;
});

edetails.value = data.event_desc;
ename.value = data.event_name;
etime.value = data.event_time;
attend.value = data.attendees.length()
edetails.readOnly = "true";
ename.readOnly = "true";
etime.readOnly = "true";
attend.readOnly = "true";



// document.addEventListener('DOMContentLoaded', async function() {
    // TODO: needs a user session
// });