async function readMyEvents(user_id) {
    const response = await fetch(`/client/getUserByID?user_id=${user_id}`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
}

// TODO: will do after we actually learn how to authenticate
// const user = await readMyEvents()
// TODO: uncomment parameter once server is done
async function displayDiv(/*event_list*/) {
    let events = [{
          host_id: "123",
          host_name: "",
          event_id: "",
          event_name: "what!!!",
          event_desc: "haha im sad",
          event_location: "",
          event_time: "",
          images: "",
          attendees: [],
          is_event: true
        }];

    // TODO uncomment once server is done
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
            <td><input type="text" class="form-control input" id="event-name" value=${event.event_name} disabled></td>
            <td><textarea name="event-details" class="form-control long-input" id="event-details" cols="1" rows="1" disabled>${event.event_desc}</textarea></td>
            <td><button class="btn btn-lg btn-primary btn-block" type="submit">Edit</button></td>
        </tr>`;
    }

    table_content += `
    </table>`;
    table.innerHTML = table_content;
}

// will eventually have a parameter
displayDiv();