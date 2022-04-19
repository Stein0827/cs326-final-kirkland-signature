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

async function createEvent(name, time, desc){
    try{
        const response = await fetch(`createEvent`, {
            method: 'POST',
            body: JSON.stringify({event_name: name, event_time: time, event_desc: desc, event_location: coordinates, is_event: true}),
        });
    }
    catch{
        console.log(err);
    }
}

const save = document.getElementById("save"),
    ename = document.getElementById("event-name"),
    etime = document.getElementById("event-time"),
    edetails = document.getElementById("event-details");
save.addEventListener("click", async (e)=>{
    const json = await createEvent(ename.value, etime.value, edetails.value);
});

// document.addEventListener('DOMContentLoaded', async function() {
    // TODO: needs a user session
// });
