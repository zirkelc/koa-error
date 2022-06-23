const request = require('supertest');
const { join } = require('path');
const KoaError = require('../dist/index').default;
const Koa = require('koa');

describe('koa-error', () => {
  it('default html error template', (done) => {
    const app = new Koa();

    app.use(KoaError());

    app.use(function (ctx) {
      foo() // eslint-disable-line
    });

    request(app.listen())
      .get('/')
      .expect(500)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/<title>Error - 500([\s]*?)<\/title>/)
      .end(done);
  });

  it('custom html error template', (done) => {
    const app = new Koa();

    app.use(
      KoaError({
        template: `
          <!DOCTYPE html>
          <html>
            <head>
            <title>Error - <%- status %></title>
            </head>
            <body><%- error %></body>
          </html>`,
        accepts: ['html'],
      }),
    );

    app.use(function (ctx) {
      foo() // eslint-disable-line
    });

    request(app.listen())
      .get('/')
      .expect(500)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/<title>Error - 500([\s]*?)<\/title>/)
      .end(done);
  });

  it('text error', (done) => {
    const app = new Koa();

    app.use(
      KoaError({
        accepts: ['text'],
      }),
    );

    app.use(function (ctx) {
      foo() // eslint-disable-line
    });

    request(app.listen())
      .get('/')
      .expect(500)
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect('Internal Server Error')
      .end(done);
  });

  it('json error in production', (done) => {
    const app = new Koa();

    app.use(
      KoaError({
        accepts: ['json'],
      }),
    );

    app.use(function (ctx) {
      foo() // eslint-disable-line
    });

    request(app.listen())
      .get('/')
      .expect(500)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect('{"error":"Internal Server Error"}')
      .end(done);
  });

  it('json error in development', (done) => {
    const app = new Koa();

    app.use(
      KoaError({
        accepts: ['json'],
        env: 'development',
      }),
    );

    app.use(function (ctx) {
      foo() // eslint-disable-line
    });

    request(app.listen()).get('/').expect(500).expect('Content-Type', 'application/json; charset=utf-8').end(done);
  });

  it('ignores bad statuses', (done) => {
    const app = new Koa();

    app.use(KoaError());

    app.use(function (ctx) {
      const error = new Error('I have status');
      error.status = 'This is broke';
      throw error;
    });

    request(app.listen())
      .get('/')
      .expect(500)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/<title>Error - 500([\s]*?)<\/title>/)
      .end(done);
  });
});
