import { readFile, writeFile } from 'fs/promises';
//local database
const JSONfile = 'data.json';
let localData = [];

async function reload(filename) {
  try {
    const data = await readFile(filename, { encoding: 'utf8' });
    localData = JSON.parse(data);
  } catch (err) {
    localData = [];
  }
}

async function saveData() {
  try {
    const data = JSON.stringify(localData);
    await writeFile(JSONfile, data, { encoding: 'utf8' });
  } catch (err) {
    console.log(err);
  }
}

async function insertData(JSONdata) {
    await reload(JSONfile);
    localData.push(JSONdata);
    await saveData();
    return localData.indexOf(JSONdata);
}

async function readData(ID, isEvent) {
    await reload(JSONfile);
    if(isEvent) {
        for(let entry of localData) {
            if(entry.is_event && entry.event_id === parseInt(ID)) {
                return entry;
            }
        }
    } else {
        for(let entry of localData) {
            if(!entry.is_event && entry.user_id === parseInt(ID)) {
                return entry;
            }
        }
    }
    return -1;
}

async function updateData(ID, JSONdata, isEvent) {
    await reload(JSONfile);
    if(isEvent) {
        for(let entry of localData) {
            if(entry.is_event && entry.event_id === parseInt(ID)) {
                localData[localData.indexOf(entry)] = JSONdata;
                await saveData();
                return JSONdata;
            }
        }
    } else {
        for(let entry of localData) {
            if(!entry.is_event && entry.user_id === parseInt(ID)) {
                localData[localData.indexOf(entry)] = JSONdata;
                await saveData();
                return JSONdata;
            }
        }
    }
    return -1;
}

async function deleteData(ID, isEvent) {
    await reload(JSONfile);
    if(isEvent) {
        for(let entry of localData) {
            if(entry.is_event && entry.event_id === parseInt(ID)) {
                let data = entry;
                localData.splice(localData.indexOf(entry), 1);
                await saveData();
                return data;
            }
        }
    } else {
        for(let entry of localData) {
            if(!entry.is_event && entry.user_id === parseInt(ID)) {
                let data = entry;
                localData.splice(localData.indexOf(entry), 1);
                await saveData();
                return data;
            }
        }
    }
    return -1;
}

async function dumpData(isEvent) {
    await reload(JSONfile);
    let data = [];
    if(isEvent) {
        for(let entry of localData) {
            if(entry.is_event) {
                data.push(entry);
            }
        }
    } else {
        for(let entry of localData) {
            if(!entry.is_event) {
                data.push(entry);
            }
        }
    }
    return data;
}

export {insertData, readData, updateData, deleteData, dumpData};