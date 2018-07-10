# super-mini-koa
> 超级简单版本的 Koa 实现，不到36行代码，只使用了一个 Node http 原生模块。

# 跑起来 Run

```bash
npm i        # 安装依赖包
npm run test # 执行 test.js 本地测试服务
```

访问 http://127.0.0.1:8088/ , 页面显示 hello world, 恭喜Koa 服务跑起来了！

控制台输出以下内容：

```bash
server listen on 8088...
middleware1 req
middleware2 req
middleware3 req
set body hello world
middleware2 res
middleware1 res
```

把 test.js 文件的 `new SMKoa()` 改成 `new Koa()`, 重新测试会得到相同的结果。因为`super-mini-koa`中间件实现原理跟 Koa 一致，但是省去了很多额外处理。

```javascript
// 测试代码
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
```

# super-mini-koa 源代码
```javascript
const http = require('http');

module.exports = class Koa {
  constructor() {
    this.middleware = [];
  }
  use(fn) {
    this.middleware.push(fn);
  }
  listen(...args) {
    return http.createServer(this.callback.bind(this)).listen(...args);
  }
  callback(req, res) {
    const fn = this.compose(this.middleware);
    const handleError = e => { throw new Error(e); };
    const handleResponse = () => { res.end(res.body); };
    const ctx = { req, res, app: this, state: {} };
    return fn(ctx).then(handleResponse).catch(handleError);
  }
  compose(middleware) {
    return function(ctx) {
      let index = -1;
      const dispatch = i => {
        index = i;
        let fn = middleware[i];
        if (i === middleware.length) return Promise.resolve();
        try {
          return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
        } catch (err) {
          return Promise.reject(err);
        }
      }
      return dispatch(0);
    }
  }
}
```

# FBI WARNING
本仓库纯属娱乐学习，实战请用原装 Koa：https://github.com/koajs/koa

# LICENSE
[WTFPL](http://www.wtfpl.net/txt/copying/)

![WTFPL](https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/WTFPL_logo.svg/280px-WTFPL_logo.svg.png)