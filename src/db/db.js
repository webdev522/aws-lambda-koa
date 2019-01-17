require('dotenv').config();

const log = require('lib/log');
const { Pool } = require('pg');

// load environment variables for postgresql
const {
  PG_HOST: host,
  PG_USERNAME: user,
  PG_PASSWORD: password,
  PG_DATABASE: database,
  PG_PORT: port,
  PG_MAXPOOLS: max
} = process.env

export default class Database {
  constructor() {
    this.pool = new Pool({
      user,
      host,
      database,
      password,
      port,
      max,
      idleTimeoutMillis: 10000
    });
    this.client = null;
  }

  async initialize() {
    try {
      this.client = await this.pool.connect();
      console.log('db connected!');
    } catch (e) {
      console.log('hi');
      log.error(e);
    }
  }

  async run(query) {
    try {
      if (this.client === null) {
        await this.initialize();
      }

      const res = await this.client.query(query);
      return res.rows;
    } catch (e) {
      console.log(query);
      log.error(e);
      console.log('---------------------');
      this.client.release();
      console.log('---------------------');
      this.client = null;
      // initialize();
      return null;
    }
  }
}