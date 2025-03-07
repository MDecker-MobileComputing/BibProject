import { JSONFilePreset } from 'lowdb/node';

const defaultData = {
  books: []
};

export const db = await JSONFilePreset( 'db.json', defaultData );

