const express = require('express'),
      path = require('path');
const app = express(),
      conf = require('./conf.json');

app.use('/', express.static('public/'));

app.get('/api/get-map', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, 'res/data/map.json'));
});

app.use('/', (req, res, next) => {
    res.redirect('/404.html');
});

app.listen(conf.port, () => console.log(` [WEB-SERVER]: Listening on: ${conf.port} ... `));