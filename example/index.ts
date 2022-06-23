import Koa from 'koa';
import KoaError from '../index';

// define inline template or load from file system
const template = `
<!DOCTYPE html>
<html>
<head>
  <title>Error - <%- status %>
  </title>
  <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0">
</head>
<body>
  <div id="error">
    <h1>Error</h1>
    <p>Looks like something broke!</p>
    <% if (env==='development' ) { %>
      <h2>Original error</h2>
      <pre>
        <code>
<%- JSON.stringify(originalError, null, '  ') %>
        </code>
      </pre>

      <h2>Message:</h2>
      <pre>
        <code>
<%- error %>
        </code>
      </pre>
      <h2>Stack:</h2>
      <pre>
        <code>
<%- stack %>
        </code>
      </pre>
      <% } %>
  </div>
</body>
</html>
`;

// create Koa app
const app = new Koa();

// use KoaError middleware
app.use(
  KoaError({
    template,
  }),
);

// this middleware will throw an error
app.use(async function (ctx) {
  console.log(`request received: ${ctx.path}`);

  if (ctx.path === '/404') return;

  // @ts-expect-error - invoke missing function to test error handling
  foo();
});

const port = process.env.PORT || 3000;

// listen for http requests on localhost
app.listen(port, () => {
  console.log(`listening on port: ${port}`);
  console.log(`open http://localhost:${port}/ to send requests`);
});
