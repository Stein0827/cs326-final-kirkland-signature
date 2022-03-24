mapboxgl.accessToken = 'pk.eyJ1IjoicndtZWh0YSIsImEiOiJjbDEycmM0MDAwNGJiM2tvMGV5cDF4cXZmIn0.6eUqwB8FMxRQOVqH5ymQ4Q';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: [-72.52628581400859,42.38891007248816], // starting position [lng, lat]
zoom: 14 // starting zoom
});

map.on('style.load', function() {   
    map.on('click', function(e) {
        var coordinates = e.lngLat;

        // new mapboxgl.Popup()
        // .setLngLat(coordinates)
        // .setHTML('you clicked here: <br/>' + coordinates)
        // .addTo(map);
    });
});

map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
);
