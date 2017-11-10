'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: '9G2nl534pVMJVQGrAyi3Qnuoxuj9LahTFgXX3CWo/D9cQvZgRMKW/06jb3ybK14mibNCJtQg/I+VWdTyrOqJdhtHSL5lH8/415ff6kd21T9yiRKqohCQDfnTOdJ1sr9Tj0J8QUCzD8J5SwutLcb3fAdB04t89/1O/w1cDnyilFU=',
  channelSecret: '9ab2152f233a8cb7f11f4b901b7796e8',
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
