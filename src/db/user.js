import Database from './db';

const db = new Database();

export const getUserCount = async () => {
  try {
    const rows = await db.run('SELECT COUNT(*) FROM datastore_user');
    return rows;
  } catch (e) {
    throw e;
  }
};