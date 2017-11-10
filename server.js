var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: '1545649468',
  channelSecret: '9ab2152f233a8cb7f11f4b901b7796e8',
  channelAccessToken: '9G2nl534pVMJVQGrAyi3Qnuoxuj9LahTFgXX3CWo/D9cQvZgRMKW/06jb3ybK14mibNCJtQg/I+VWdTyrOqJdhtHSL5lH8/415ff6kd21T9yiRKqohCQDfnTOdJ1sr9Tj0J8QUCzD8J5SwutLcb3fAdB04t89/1O/w1cDnyilFU='
});

bot.on('message', function(event) {
  console.log(event); //把收到訊息的 event 印出來看看
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});
