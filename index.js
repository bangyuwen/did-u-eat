require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const lineClient = require('./lineClient.js');
const handleEvent = require('./src/handleEvent');

const app = express();
app.use(express.static('public'));
app.post('/webhook', line.middleware(lineClient.config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(result => res.json(result));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
