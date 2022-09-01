import http from 'http';
import Koa from 'koa';
import compileTemplate from 'lodash.template';

type Options = {
  template?: string;
  env?: string;
  accepts?: string[];
};

interface HttpError extends Error {
  status: number;
  statusCode: number;
  expose: boolean;
  headers?:
    | {
        [key: string]: string;
      }
    | undefined;
  [key: string]: any;
}

const defaultTemplate = `
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

/**
 * `koa-error` middleware for handling errors in Koa applications.
 *
 * This code was copied and modified from https://github.com/koajs/error/blob/master/index.js
 * to fix errors and reduce dependencies to a minimum. It supports only `lodash-template` as a template engine.
 * The default error template is directly embedded in the code to avoid packageing issues and loading from the file system.
 *
 * @param options
 * @returns
 */
export default function error(options?: Options): Koa.Middleware {
  return async (ctx, next) => {
    try {
      await next();

      if (ctx.response.status === 404 && !ctx.response.body) ctx.throw(404);
    } catch (e) {
      const accepts = options?.accepts || ['html', 'text', 'json'];
      const env = options?.env || process.env.NODE_ENV || 'development';
      const template = options?.template || defaultTemplate;

      const err = e as HttpError;
      ctx.status = typeof err.status === 'number' ? err.status : 500;

      // application
      ctx.app.emit('error', err, ctx);

      // accepted types
      switch (ctx.accepts(accepts)) {
        case 'json':
          ctx.type = 'application/json';
          if (env === 'development') ctx.body = { error: err.message, stack: err.stack, originalError: err };
          else if (err.expose) ctx.body = { error: err.message, originalError: err };
          else ctx.body = { error: http.STATUS_CODES[ctx.status] };
          break;

        case 'html':
          {
            const compiled = compileTemplate(template, {});
            ctx.type = 'text/html';
            ctx.body = compiled({
              originalError: e,
              env,
              ctx,
              request: ctx.request,
              response: ctx.response,
              error: err.message,
              stack: err.stack,
              status: ctx.status,
              code: err.code,
            });
          }
          break;

        case 'text':
        default:
          ctx.type = 'text/plain';
          if (env === 'development') ctx.body = err.message;
          else if (err.expose) ctx.body = err.message;
          else throw err;
          break;
      }
    }
  };
}
