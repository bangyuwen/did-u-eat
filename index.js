const express = require('express');
const line = require('@line/bot-sdk');
const lineClient = require('./lineClient.js')
const submitMenu = require('./src/submitMenu.js')

const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', line.middleware(lineClient.config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

// event handler
function handleEvent(event) {

  console.log(event);
  //
  // if (event.type !== 'message' || event.message.type !== 'text') {
  //   // ignore non-text-message event
  //   return Promise.resolve(null);
  // }
  //
  // let reply = '';
  // let text = event.message.text;
  // if (text[0] === '#') {
  //   let parsedText = text.split(' ');
  //   let command = parsedText[0].slice(1);
  //   switch (command) {
  //     case '菜單':
  //       reply = submitMenu(parsedText[1]);
  //       break;
  //     default:
  //       return;
  //   }
  //
  //
  //   // create a echoing text message
  //   const echo = { type: 'text', text: reply };
  //
  //   // use reply API
  //   return client.replyMessage(event.replyToken, echo);
  // }

  return Promise.resolve(null);

}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
