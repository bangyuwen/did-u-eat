const fs = require('fs');
const lineClient = require('../lineClient.js');
const firebaseClient = require('../firebaseClient');

module.exports = (shopName, messageId) => {
  const imgId = new Date().getTime();
  const stream = lineClient.getMessageContent(messageId);

  stream.pipe(fs.createWriteStream(`./public/${imgId}.jpg`));
  firebaseClient.database().ref(`menus/ ${shopName}`).set({
    Name: shopName,
    id: imgId,
  }).catch((error) => {
    console.error('Writing Menus Error:', error);
  });
};
