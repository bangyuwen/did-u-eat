const fs = require('fs');
const express = require('express');
const line = require('@line/bot-sdk');
const lineClient = require('./lineClient.js');
const firebase = require('firebase');
const firebaseClient = require('./firebaseClient');
const submitMenu = require('./src/submitMenu.js')

const app = express();

app.use(express.static('public'));
// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', line.middleware(lineClient.config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

// event handler
let shopName = '';
function handleEvent(event) {
  console.log(event);
  console.log(shopName);
  if (event.type === 'message' && event.message.type === 'image' && shopName) {

    let imgId = new Date().getTime();
    const stream = lineClient.getMessageContent(event.message.id);
    stream.pipe(fs.createWriteStream(`./public/${imgId}.jpg`))

    firebaseClient.database().ref('menus/' + shopName).set({
          Name: shopName,
          id: imgId
    }).catch(function(error){
      console.error("Writing User Error:",error);
    })

    shopName = ''

    return lineClient.replyMessage(event.replyToken, {
        "type": "text",
        "text": "阿嬤知道你喜歡吃這家了！"
    });
  }

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  let reply = '';
  let text = event.message.text;
  if (text[0] === '#' || text[0] === '＃') {
    let parsedText = text.split(' ');
    let command = parsedText[0].slice(1);
    switch (command) {
      case '菜單':
        shopName = parsedText[1];
        reply = { type: 'text', text: '讓阿嬷看看菜單長什麼樣子' };
        break;
      case '山':
        reply = {
            "type": "image",
            "originalContentUrl": "https://did-u-eat.herokuapp.com/%E8%8F%9C%E5%96%AE_%E5%B1%B1%E6%B3%89%E6%B0%B4.jpg",
            "previewImageUrl": "https://did-u-eat.herokuapp.com/%E8%8F%9C%E5%96%AE_%E5%B1%B1%E6%B3%89%E6%B0%B4.jpg"
        }
        break;
      default:
        firebaseClient.database().ref('menus/' + command).once('value').then(function(snapshot) {
          console.log(snapshot.key, snapshot.child('id').val());
          reply = {
              "type": "image",
              "originalContentUrl": `https://did-u-eat.herokuapp.com/${snapshot.child('id').val()}.jpg`,
              "previewImageUrl": `https://did-u-eat.herokuapp.com/${snapshot.child('id').val()}.jpg`
          }
          return lineClient.replyMessage(event.replyToken, reply);
        }).catch((error) => {
          console.error("Reading User Error:",error);
        });
    }
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
