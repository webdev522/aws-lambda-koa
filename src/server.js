import Koa from 'koa';
import serverless from 'serverless-http';
import router from './router';

export default class Server {
  // app;

  constructor() {
    this.app = new Koa();
    this.middleware();
  }

  middleware() {
    const { app } = this;
    app.use(router.routes())
      .use(router.allowedMethods());
  }

  listen(port) {
    const { app } = this;
    app.listen(port);
    console.log('Listening on port', port);
  }

  serverless() {
    const { app } = this;
    return serverless(app);
  }
}