const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const defaultData = {
  books: []
};

const adapter = new JSONFile('db.json');

const initializeDb = async () => {
  const db = new Low(adapter);
  await db.read();
  db.data = db.data || defaultData; 
  await db.write();
  return db;
};

module.exports = initializeDb();