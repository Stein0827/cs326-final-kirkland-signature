mapboxgl.accessToken = 'pk.eyJ1IjoicndtZWh0YSIsImEiOiJjbDEycmM0MDAwNGJiM2tvMGV5cDF4cXZmIn0.6eUqwB8FMxRQOVqH5ymQ4Q';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-72.52628581400859, 42.38891007248816], // starting position [lng, lat]
    zoom: 14 // starting zoom
});
let coordinates = [-72.52628581400859, 42.38891007248816];
map.on('style.load', function () {
    map.on('click', function (e) {
        coordinates = e.lngLat;

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML('This is the location you chose.')
            .addTo(map);
    });
});

map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
);

async function createEvent(name, time, desc) {
    try {
        const response = await fetch('/createEvent', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ event_name: name, event_time: time, event_desc: desc, event_location: coordinates, attendees: [] }),
        });
    }
    catch (err) {
        console.log(err);
    }
}

async function deleteEvent(id) {
    try {
        const response = await fetch('/deleteEvent', {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id }),
        });
    }
    catch (err) {
        console.log(err);
    }
}

async function updateEvent(name, time, desc) {
    try {
        const response = await fetch('/editEvent', {
            method: 'PUT',
            body: JSON.stringify({ event_name: name, event_time: time, event_desc: desc, event_location: coordinates, attendees: attendees })
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

const save = document.getElementById("save"),
    ename = document.getElementById("event-name"),
    etime = document.getElementById("event-time"),
    edetails = document.getElementById("event-details"),
    save_link = document.getElementById("save-event-link"),
    create_link = document.getElementById("create-event-link"),
    create = document.getElementById("create"),
    dlt = document.getElementById("dlt"),
    cancel = document.getElementById("cancel");

//disable buttons accordingly 

save.addEventListener("click", async (e) => {
    await updateEvent(ename.value, etime.value, edetails.value);
    localStorage.removeItem("event");
});


create.addEventListener("click", async (e) => {
    await createEvent(ename.value, etime.value, edetails.value);
    localStorage.removeItem("event");
});

dlt.addEventListener("click", async (e) => {
    await deleteEvent(localStorage.getItem("event")._id);
    localStorage.removeItem("event");
});

cancel.addEventListener("click", async (e) => {
    localStorage.removeItem("event");
});

let curr_event = JSON.parse(localStorage.getItem("event"));
edetails.value = curr_event.event_desc;
ename.value = curr_event.event_name;
etime.value = curr_event.event_time;



// document.addEventListener('DOMContentLoaded', async function() {
    // TODO: needs a user session
// });
