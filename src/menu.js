const fs = require('fs');
const lineClient = require('../lineClient.js');
const firebaseClient = require('../firebaseClient');

exports.storeMenu = (shopName, messageId) => {
  console.log('hi');
  const imgId = new Date().getTime();
  const stream = lineClient.getMessageContent(messageId);

  stream.pipe(fs.createWriteStream(`./public/${imgId}.jpg`));
  firebaseClient.database().ref(`menus/ ${imgId}`).set({
    Name: shopName,
    id: imgId,
  }).catch((error) => {
    console.error('Writing Menus Error:', error);
  });
};
