const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const napp = next({ dev });
const handle = napp.getRequestHandler();

const conf = require('./conf.json');

napp
.prepare()
.then(() => {
  const app = express();

  app.get('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(conf.port, conf.hostname, () => console.log(`[ EXPRESS ]: Listening on http://${conf.hostname}:${conf.port} ... `));
})
.catch(e => {
  console.log(e.stack);
  process.exit(1);
});