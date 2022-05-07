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

// const geojson = {
//     type: 'FeatureCollection',
//     features: [{
//         type: 'Feature',
//         geometry: {
//           type: 'Point',
//           coordinates: [-72.52962402379136, 42.38952475680128]
//         },
//         properties: {
//           title: '326 Class',
//           description: 'So Fun'
//         }
//     }]
// }



// integrating counters.
async function readEvents() {
    const response = await fetch(`/dumpEvents`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
}

async function setEvents(events) {
    const table = document.getElementById('map_event_table');
    table.classList.add("table", "table-striped", "scrollingTable", "table_color", "font");
    let tHead = document.createElement("thead");
    let tBody = document.createElement("tbody");
    let titleRow = document.createElement("tr");
    let nameTA = document.createElement("th");
    nameTA.innerHTML = "Name";
    // let descTA = document.createElement("th");
    // descTA.innerHTML = "Description";
    let timeTA = document.createElement("th");
    timeTA.innerHTML = "Time";
    titleRow.appendChild(nameTA);
    // titleRow.appendChild(descTA);
    titleRow.appendChild(timeTA);
    tHead.appendChild(titleRow);
    table.appendChild(tHead);
    for (let event of events){
        let row = document.createElement("tr");
        for (let i = 0; i < 3; i++){
            let cell = document.createElement("td");
            cell.classList.add("font-small");
            let cText = 0;
            let ta = 0;
            if (i === 0){
                // ta = document.createElement("textarea");
                // cText = document.createTextNode(event.event_name);
                // ta.classList.add("form-control", "long-input", "font-small");
                // ta.appendChild(cText);
                // cell.appendChild(ta);
                cell.innerHTML = event.event_name;
            }
            else if (i === 1) {
                // ta = document.createElement("textarea");
                // cText = document.createTextNode(event.event_time);
                // ta.classList.add("form-control", "long-input", "font-small");
                // ta.appendChild(cText);
                // cell.appendChild(ta);
                cell.innerHTML = event.event_time;
            }
            else if (i === 2) {
                cText = document.createElement("button");
                cText.innerHTML = "Details"
                cText.addEventListener("click", function(e) {
                    console.log(event);
                    localStorage.removeItem("details");
                    localStorage.setItem("details", JSON.stringify(event._id));
                    window.location.href = "/event-viewer/"+event._id;   
                });
                cText.classList.add("btn", "btn-sm", "btn-secondary", "btn-block", "font-small");
                cell.appendChild(cText);
            }

            row.appendChild(cell);
        }
        tBody.appendChild(row);
    }
    table.appendChild(tBody);
}


const geojson = {features: []};
const data = await readEvents();
console.log(data);
setEvents(data);
setMarkers(data);


async function setMarkers(events){
    for(let event of events){
        let temp = {};
        temp["title"] = event.event_name;
        temp["description"] = event.event_desc;
        temp["location"] = event.event_location;
        geojson.features.push(temp);
    }
}

for (const feature of geojson.features) {
    // create a HTML element for each feature
    const mark = document.createElement('div');
    mark.className = 'marker';
  
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(mark).setLngLat(feature.location)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(
            `<h3>${feature.title}</h3><p>${feature.description}</p>`
          )
      )
      .addTo(map);
}