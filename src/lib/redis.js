import redis from 'redis';
import bluebird from 'bluebird';

class RedisClient {
  constructor() {
    this.client = null;
    this.connectedTime = null;
  }

  // get connection status
  get connected() {
    if (!this.client) return false;
    return this.client.connected;
  }

  // connect to redis
  connect() {
    const p = new Promise((resolve, reject) => {
      const { REDIS_HOST, REDIS_PASSWORD } = process.env;
      
      const client = redis.createClient({
        host: REDIS_HOST || '',
        password: REDIS_PASSWORD || ''
      });

      client.on('error', (err) => {
        console.log('Redis Error: ', err);
        reject(err);
      });

      client.on('ready', () => {
        this.connectedTime = Date.now();
        console.log('Redis is ready');
        resolve();
      });
      this.client = client;
    });
    return p;
  }

  // set key
  async set(key, value) {
    if (!this.connected || !this.client) {
      await this.connect();
    }

    if (!this.client) return;

    return this.client.setAsync(key, JSON.stringify(value));
  }

  // get key
  async get(key) {
    if (!this.connected || !this.client) {
      await this.connect();
    }

    if (!this.client) return null;

    return this.client.getAsync(key).then(data => {
      if (!data) return null;
      return JSON.parse(data);
    });
  }

  // delete
  async del(key) {
    if (!this.connected || !this.client) {
      await this.connect();
    }

    if (!this.client) return;

    this.client.del(key);
    console.log('removing key %s', key);
  }

  // flushall
  async flushall() {
    if (!this.connected || !this.client) {
      await this.connect();
    }

    if (!this.client) return;

    return this.client.flushall();
  }
}

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisClient = new RedisClient();

export default redisClient;