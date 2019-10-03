const express = require('express');
const app = express(),
      conf = require('./conf.json');

app.use('/', express.static('public/'));



app.use('/', (req, res, next) => {
    res.redirect('/404.html');
});

app.listen(conf.port, () => console.log(` [WEB-SERVER]: Listening on: ${conf.port} ... `));