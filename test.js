const SMKoa = require('./super-mini-koa');
const Koa = require('koa');

const app = new SMKoa(); // or new Koa();

app.use(async (ctx, next) => {
  console.log('middleware1 req');
  await next();
  console.log('middleware1 res');
});

app.use(async (ctx, next) => {
  console.log('middleware2 req');
  await next();
  console.log('middleware2 res');
});

app.use(async (ctx, next) => {
  console.log('middleware3 req');
  await next();
});

app.use(async ctx => {
  console.log('set body hello world');
  ctx.res.body = ctx.body = 'hello world';
});

app.listen(8088);
console.log('server listen on 8088...');
