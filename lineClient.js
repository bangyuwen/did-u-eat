const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNELACCESSTOKEN,
  channelSecret: process.env.LINE_CHANNELSECRET,
};

const client = new line.Client(config);

module.exports = client;
exports.config = config;
