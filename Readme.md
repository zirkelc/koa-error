[![npm version](https://badge.fury.io/js/koa-error-middleware.svg)](https://badge.fury.io/js/koa-error-middleware)

> This package is a fork of the original [koa-error](https://github.com/koajs/error) package rewritten in TypeScript and reduced to a single dependency. 

# koa-error-middleware

Error response middleware for Koa supporting:

- text
- json
- html

## Installation

```js
$ npm install koa-error-middleware
```

## Usage
```js
import Koa from 'koa';
import KoaError from 'koa-error-middleware';

const app = new Koa();

app.use(KoaError());

app.listen(3000);
```

See [example/index.ts](example/index.ts) for a full example.

## Options

 - `template`: content of error template with placeholders, default: [error.html](error.html) 
 - `env` force a NODE_ENV, default: `development`
 - `accepts` mimetypes passed to [ctx.accepts](https://github.com/koajs/koa/blob/master/docs/api/request.md#requestacceptstypes), default: `['html', 'text', 'json']`

### Differences to koa-error
The following changes were made to the original implementation of [koa-error](https://github.com/koajs/error).

 - `template`: koa-error expected a path to a template file which it would then load from the file system. This package expects the contents of the template file. The calling package can decide whether to load the template file from the file system or embed it directly in its code.
 - `engine`: koa-error supported multiple template engines via [consolidate](https://github.com/tj/consolidate.js). This option and dependency has been removed in favor of supporting only one template engine [lodash.template](https://www.npmjs.com/package/lodash.template).

## Custom template

By using the `template` option you can override the bland default template, with the following available local variables:

  - `env`
  - `ctx`
  - `request`
  - `response`
  - `error`
  - `stack`
  - `status`
  - `code`

For more information see the [Lodash.template](https://lodash.com/docs/4.17.15#template) documentation.

### Default template

```js
app.use(KoaError());
```

```html
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
```

## License

MIT