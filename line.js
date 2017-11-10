const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: '9G2nl534pVMJVQGrAyi3Qnuoxuj9LahTFgXX3CWo/D9cQvZgRMKW/06jb3ybK14mibNCJtQg/I+VWdTyrOqJdhtHSL5lH8/415ff6kd21T9yiRKqohCQDfnTOdJ1sr9Tj0J8QUCzD8J5SwutLcb3fAdB04t89/1O/w1cDnyilFU=',
  channelSecret: '9ab2152f233a8cb7f11f4b901b7796e8',
};

const client = new line.Client(config);

module.exports = client
