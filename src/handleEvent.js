const lineClient = require('../lineClient.js');
const firebaseClient = require('../firebaseClient');
const { pushNewOrder, deleteOrder, getOrderList } = require('./orderList');
const storeMenuImg = require('./storeMenuImg');

let shopName = '';
module.exports = (event) => {
  console.log(event);
  if (event.type === 'message' && event.message.type === 'image' && shopName) {
    console.log(shopName);
    const messageId = event.message.id;
    storeMenuImg(shopName, messageId);
    shopName = '';
    return lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: '阿嬤知道你喜歡吃這家了！',
    });
  }

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  let reply = '';
  const { text } = event.message;
  if (text[0] === '#' || text[0] === '＃') {
    const parsedText = text.slice(1).split(' ');
    const [command, secondArg] = parsedText;
    switch (command) {
      case '菜單':
        shopName = secondArg;
        if (secondArg) {
          reply = { type: 'text', text: '讓阿嬷看看菜單長什麼樣子' };
        }
        return lineClient.replyMessage(event.replyToken, reply);
      case '開':
        if (!secondArg) break;
        firebaseClient.database().ref(`menus/ ${secondArg}`).once('value').then((snapshot) => {
          console.log(snapshot.key, snapshot.child('id').val());
          const imgId = snapshot.child('id').val();
          if (imgId) {
            reply = {
              type: 'image',
              originalContentUrl: `https://did-u-eat.herokuapp.com/${snapshot.child('id').val()}.jpg`,
              previewImageUrl: `https://did-u-eat.herokuapp.com/${snapshot.child('id').val()}.jpg`,
            };
          }
          return lineClient.replyMessage(event.replyToken, reply);
        })
          .catch((error) => {
            console.error('Reading User Error:', error);
          });
        break;
      case '刪除':
        deleteOrder(secondArg);
        reply = { type: 'text', text: '已刪除' };
        return lineClient.replyMessage(event.replyToken, reply);
      case '截':
        reply = {
          type: 'text',
          text: getOrderList(),
        };
        return lineClient.replyMessage(event.replyToken, reply);
      case 'help':
        reply = {
          type: 'text',
          text: '#菜單  山泉水\n 設定菜單\n' +
                '#開  山泉水\n 叫出菜單照片\n' +
                '#截\n 叫出訂單\n' +
                '#刪除 邦宇\n 刪除訂購\n' +
                '#help\n 小幫手',
        };
        return lineClient.replyMessage(event.replyToken, reply);
      default: {
        return Promise.resolve(null);
      }
    }
  }

  if ((text.indexOf(':') > 0 || text.indexOf('：') > 0) && text.indexOf('//') < 0) {
    pushNewOrder(text);
    reply = {
      type: 'text',
      text: getOrderList(),
    };
    console.log(reply);
    return lineClient.replyMessage(event.replyToken, reply);
  }
  return Promise.resolve(null);
};
