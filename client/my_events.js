// async function readMyEvents(user_id) {
//     const response = await fetch(`/client/getUserByID?user_id=${user_id}`, {
//       method: 'GET',
//     });
//     const data = await response.json();
//     return data;
// }

async function readMyEvents() {
    const response = await fetch(`/dumpEvents`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
}

// TODO: will do after we actually learn how to authenticate
// const user = await readMyEvents()
// TODO: uncomment parameter once server is done
async function displayDiv() {

    // for (let id of event_list) {
    //     const response = await fetch(`/event?event_id=${id}`, {
    //         method: 'GET',
    //     });
    //     const data = await response.json();
    //     events.push(data);
    // }

    let table = document.getElementById("my_event_table");
    let table_content = `
    <table>
        <tr>
            <th class="label">Event Name</th>
            <th class="label">Event Description</th>
            <th class="label">Edit Event</th>
        </tr>`;

    for (let event of events) {
        table_content += `
        <tr>
            <td><textarea name="event-details" class="form-control long-input" id="event-name" cols="1" rows="1" disabled>${event.event_name}</textarea></td>
            <td><textarea name="event-details" class="form-control long-input" id="event-details" cols="1" rows="1" disabled>${event.event_desc}</textarea></td>
            <td><button class="btn btn-lg btn-primary btn-block" id=${event.event_name} type="submit">Edit</button></td>
        </tr>`;
    }

    table_content += `
    </table>`;
    table.innerHTML = table_content;
}

document.querySelectorAll('.btn').forEach(item => {
    item.addEventListener('click', event => {
        console.log("it works?");
        const event_name = item.id;
        for (let event of events) {
            if (event["event_name"] === event_name) {
                console.log("it fucking works???");
                localStorage.setItem("event", JSON.stringify(event));
                console.log(localStorage.getItem("event"));
            }
        }
    })
});

let events = await readMyEvents();

// will eventually have a parameter
// const events = await readMyEvents();
await displayDiv();
