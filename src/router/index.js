import Router from 'koa-router';
import * as userDB from 'db/user';
import redisClient from 'lib/redis';

const router = new Router();

router.get('/count', async (ctx) => {
  const result = await userDB.getUserCount();
  
  if (result.length > 0) {
    ctx.body = 'Count: ' + result[0].count;
  } else {
    ctx.body = 'No records';
  }
});

router.get('/cache', async (ctx) => {
  await redisClient.set('key1', {'msg': 'Hello, World!'});
  const obj = await redisClient.get('key1');
  ctx.body = 'Redis Cache: ' + JSON.stringify(obj);
});

export default router;