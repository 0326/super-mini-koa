const http = require('http');
module.exports = class SuperMiniKoa {
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
