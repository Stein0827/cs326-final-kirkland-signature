import express from 'express';
import logger from 'morgan';
import { readFile, writeFile } from 'fs/promises';

const JSONfile = 'users.json';

async function reload(filename) {
  try {
    const data = await readFile(filename, { encoding: 'utf8' });
    counters = JSON.parse(data);
  } catch (err) {
    counters = {};
  }
}

async function saveCounters() {
  try {
    const data = JSON.stringify(counters);
    await writeFile(JSONfile, data, { encoding: 'utf8' });
  } catch (err) {
    console.log(err);
  }
}