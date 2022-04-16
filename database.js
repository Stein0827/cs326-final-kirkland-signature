import { readFile, writeFile } from 'fs/promises';

const JSONfile = 'data.json';
let localData = [];

async function reload(filename) {
  try {
    const data = await readFile(filename, { encoding: 'utf8' });
    localData = JSON.parse(data);
  } catch (err) {
    localData = {};
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
    return localData.findIndex(JSONdata);
}

async function readData(ID, isEvent) {
    await reload(JSONfile);
    if(isEvent) {
        for(let entry in localData) {
            if(entry.isEvent && entry.event_id === ID) {
                return entry;
            }
        }
    } else {
        for(let entry in localData) {
            if(!entry.isEvent && entry.user_id === ID) {
                return entry;
            }
        }
    }
    return -1;
}

async function updateData(ID, JSONdata, isEvent) {
    await reload(JSONfile);
    if(isEvent) {
        for(let entry in localData) {
            if(entry.isEvent && entry.event_id === ID) {
                localData[localData.indexOf(entry)] = JSONdata;
                await saveData();
                return JSONdata;
            }
        }
    } else {
        for(let entry in localData) {
            if(!entry.isEvent && entry.user_id === ID) {
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
        for(let entry in localData) {
            if(entry.isEvent && entry.event_id === ID) {
                let data = entry;
                delete localData[localData.indexOf(entry)];
                await saveData();
                return data;
            }
        }
    } else {
        for(let entry in localData) {
            if(!entry.isEvent && entry.user_id === ID) {
                let data = entry;
                delete localData[localData.indexOf(entry)];
                await saveData();
                return data;
            }
        }
    }
    return -1;
}

export {insertData, readData, updateData, deleteData};