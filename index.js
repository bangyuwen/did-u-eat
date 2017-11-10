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

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  let reply = '';
  let text = event.message.text;
  if (text[0] === '#') {
    let parsedText = text.split(' ');
    let command = parsedText[0].slice(1);
    switch (command) {
      case '菜單':
        reply = { type: 'text', text: submitMenu(parsedText[1]) };
        break;
      case '乖孫':
        console.log(reply + 'a');
        reply = {
            "type": "image",
            "originalContentUrl": "https://scontent.ftpe8-3.fna.fbcdn.net/v/t1.0-9/15078611_1329670413719453_4863472404315728116_n.jpg?oh=a20ccc005d7aa505f922a33906e5e6b2&oe=5AAC9A9F",
            "previewImageUrl": "https://scontent.ftpe8-3.fna.fbcdn.net/v/t1.0-9/15078611_1329670413719453_4863472404315728116_n.jpg?oh=a20ccc005d7aa505f922a33906e5e6b2&oe=5AAC9A9F"
        }
        console.log(reply + 'b');
        break;
      default:
        return;
    }
    console.log(reply + 'c');
    // use reply API
    return lineClient.replyMessage(event.replyToken, reply);
  }

  return Promise.resolve(null);

}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
