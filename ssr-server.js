const express = require('express');
const session = require('express-session');
const next = require('next');
const fs = require('fs');
const http = require('http');
const https = require('https');

const redis = require('redis');
const redisClient = redis.createClient();
const redisStore = require('connect-redis')(session);

const dev = process.env.NODE_ENV !== 'production';
const next_app = next({ dev });
const handle = next_app.getRequestHandler();

const routers = {
  api: require('./routes/api'),
};

const conf = require('./conf.json');
const opts = {
  key: fs.readFileSync('/etc/openssl/privateKey.key'),
  cert: fs.readFileSync('/etc/openssl/certificate.crt'),
};

redisClient.on('error', err => {
	console.log('Redis error: ', err);
});

next_app
.prepare()
.then(() => {
  const app = express();

  app.use(express.json());
  app.use(session({
		secret: conf.secret,
		name: '_token',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
		store: new redisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400}),
  }));
  
  app.use('/api', routers.api);
  app.get('*', (req, res) => {
    return handle(req, res);
  });

  const redirect = express();
  redirect.use('/', (req, res) => res.redirect(`https://${conf.hostname}:${conf.https_port}/`));

  http.createServer(redirect).listen(conf.http_port, 
    () => console.log(`[HTTP-SERVER]> Listening on http://${conf.hostname}:${conf.http_port} ... `));
  https.createServer(opts, app).listen(conf.https_port, 
    () => console.log(`[HTTPS-SERVER]> Listening on https://${conf.hostname}:${conf.https_port} ... `));
})
.catch(e => {
  console.log(e.stack);
  process.exit(1);
});