const lineClient = require('../lineClient.js');
const firebaseClient = require('../firebaseClient');
const { pushNewOrder, deleteOrder, getOrderList } = require('./orderList');
const { storeMenu } = require('./menu');

let shopName = '';
let menuUpload = false;
module.exports = (event) => {
  console.log(event);
  if (event.type === 'message' && event.message.type === 'image' && menuUpload) {
    const messageId = event.message.id;
    storeMenu(shopName, messageId);
    menuUpload = false;
    return lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: '阿嬤知道你喜歡吃這家了！',
    });
  }

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // command part
  let reply = '';
  const { text } = event.message;
  if (text[0] === '#' || text[0] === '＃') {
    const parsedText = text.slice(1).split(' ');
    const [command, secondArg] = parsedText;
    switch (command) {
      case '開': {
        shopName = secondArg;
        if (!secondArg) break;
        const ref = firebaseClient.database().ref('menus');
        ref.orderByChild('Name').equalTo(secondArg).limitToFirst(1).once('value')
          .then((snapshot) => {
            const imgId = snapshot.child('id').val();
            if (imgId) {
              reply = {
                type: 'image',
                originalContentUrl: `https://did-u-eat.herokuapp.com/${snapshot.child('id').val()}.jpg`,
                previewImageUrl: `https://did-u-eat.herokuapp.com/${snapshot.child('id').val()}.jpg`,
              };
            } else {
              reply = {
                type: 'template',
                altText: 'GG',
                template: {
                  type: 'confirm',
                  text: '沒有菜單誒！要新增嗎？',
                  actions: [
                    {
                      type: 'message',
                      label: '當然',
                      text: '#當然',
                    },
                    {
                      type: 'message',
                      label: '不要',
                      text: '#不要',
                    },
                  ],
                },
              };
            }
            return lineClient.replyMessage(event.replyToken, reply);
          });
        break;
      }
      case '當然':
        menuUpload = true;
        reply = { type: 'text', text: '上傳給我吧！' };
        return lineClient.replyMessage(event.replyToken, reply);
      case '刪除':
        deleteOrder(secondArg);
        reply = { type: 'text', text: '已刪除' };
        return lineClient.replyMessage(event.replyToken, reply);
      case '截':
        reply = { type: 'text', text: getOrderList() };
        return lineClient.replyMessage(event.replyToken, reply);
      case 'help':
        reply = {
          type: 'text',
          text: '#開  山泉水\n 叫出菜單照片\n' +
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

  // order part
  if ((text.indexOf(':') > 0 || text.indexOf('：') > 0) && text.indexOf('//') < 0) {
    pushNewOrder(text);
    reply = { type: 'text', text: getOrderList() };
    console.log(reply);
    return lineClient.replyMessage(event.replyToken, reply);
  }
  return Promise.resolve(null);
};
