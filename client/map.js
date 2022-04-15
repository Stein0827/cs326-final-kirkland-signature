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

const geojson = {
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-72.52962402379136, 42.38952475680128]
        },
        properties: {
          title: '326 Class',
          description: 'So Fun'
        }
    }]
}

for (const feature of geojson.features) {
    // create a HTML element for each feature
    const mark = document.createElement('div');
    mark.className = 'marker';
  
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(mark).setLngLat(feature.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(
            `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
          )
      )
      .addTo(map);
}


// integrating counters.
async function readEvents() {
    const response = await fetch(`/event/dump`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
}









