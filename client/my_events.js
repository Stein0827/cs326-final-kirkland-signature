// async function readMyEvents(user_id) {
//     const response = await fetch(`/client/getUserByID?user_id=${user_id}`, {
//       method: 'GET',
//     });
//     const data = await response.json();
//     return data;
// }

async function readMyEvents() {
    const response = await fetch(`/getEventByUser`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
}

async function displayDiv() {
    const table = document.getElementById('events_table');
    let tBody = document.createElement("tbody");
    for (let event of events){
        let row = document.createElement("tr");
        for (let i = 0; i < 3; i++){
            let cell = document.createElement("td");
            let cText = 0;
            let ta = 0;
            if (i === 0){
                ta = document.createElement("textarea");
                cText = document.createTextNode(event.event_name);
                ta.classList.add("form-control", "long-input");
                ta.appendChild(cText);
                cell.appendChild(ta);
            }
            else if (i === 1) {
                ta = document.createElement("textarea");
                cText = document.createTextNode(event.event_desc);
                ta.classList.add("form-control", "long-input");
                ta.appendChild(cText);
                cell.appendChild(ta);
            }
            else if (i === 2) {
                cText = document.createElement("button");
                cText.innerHTML = "Edit"
                cText.addEventListener("click", function(e) {
                    localStorage.setItem("event", JSON.stringify(event));
                    window.location.href = "/event-editor";   
                });
                cText.classList.add("btn", "btn-lg", "btn-primary", "btn-block");
                cell.appendChild(cText);
            }

            row.appendChild(cell);
        }
        tBody.appendChild(row);
    }
    table.appendChild(tBody);
}

let events = await readMyEvents();
await displayDiv();

//logout function
//const logout_button = document.getElementById('logout');
