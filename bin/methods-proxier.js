const axios = require('axios');
let telegramPing = 0;
module.exports = (app) => {
  const logger = require(__dirname + '/logger')(app.configs);
  pingTelegram(app, logger);
  app.tg = {};
  for (let method of methodsList) {
    app.tg[method] = (...args) => {
      if (app.configs.banchmark)
        return banchmarkFirewall(args, app);
      else
        return new Promise((resolve, reject) => 
          app.tgApi[method](args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7])
            .then((res) => {resolve(res); handleServerResponce(args, app)})
            .catch(reject));
    };
  }
};


const banchmarkFirewall = (args, app) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      handleServerResponce(args, app);
      resolve();
    }, telegramPing);
  });
};

const pingTelegram = (app, logger) => {
  if (app.configs.banchmark) {
    const startRequest = new Date().getTime();
    axios.post('https://api.telegram.org')
      .catch((response) => {
        console.log(response.response.status);
        if (response.response.status === 400) {
          telegramPing = new Date().getTime() - startRequest;
        } else {
          logger.error('Cannot reach api.telelegram.org');
        }
      });
  }
};

const handleServerResponce = (args, app) => {
  let responseTime = null;
  if (typeof args[0] === 'number' && typeof app.requests[args[0]] !== 'undefined')
    responseTime = new Date().getTime() - app.requests[args[0]];
  else if (typeof args[1] === 'object' && typeof args[1].chat_id !== 'undefined')
    responseTime = new Date().getTime() - app.requests[args[1].chat_id];
  else if (typeof args[0] === 'object' && typeof args[0].chat_id !== 'undefined')
    responseTime = new Date().getTime() - app.requests[args[0].chat_id];
  if (responseTime !== null) {
    console.log(`Response time: ${responseTime}ms`);
    delete app.requests[args[0]];
  }
};

const methodsList = 
['startPolling',
'initPolling',
'stopPolling',
'isPolling',
'openWebHook',
'closeWebHook',
'hasOpenWebHook',
'getMe',
'setWebHook',
'deleteWebHook',
'getWebHookInfo',
'getUpdates',
'processUpdate',
'sendMessage',
'answerInlineQuery',
'forwardMessage',
'sendPhoto',
'sendAudio',
'sendDocument',
'sendSticker',
'sendVideo',
'sendVideoNote',
'sendVoice',
'sendChatAction',
'kickChatMember',
'unbanChatMember',
'restrictChatMember',
'promoteChatMember',
'exportChatInviteLink',
'setChatPhoto',
'deleteChatPhoto',
'setChatTitle',
'setChatDescription',
'pinChatMessage',
'unpinChatMessage',
'answerCallbackQuery',
'editMessageText',
'editMessageCaption',
'editMessageReplyMarkup',
'getUserProfilePhotos',
'sendLocation',
'editMessageLiveLocation',
'stopMessageLiveLocation',
'sendVenue',
'sendContact',
'getFile',
'getFileLink',
'getFileStream',
'downloadFile',
'onText',
'removeTextListener',
'onReplyToMessage',
'removeReplyListener',
'getChat',
'getChatAdministrators',
'getChatMembersCount',
'getChatMember',
'leaveChat',
'setChatStickerSet',
'deleteChatStickerSet',
'sendGame',
'setGameScore',
'getGameHighScores',
'deleteMessage',
'sendInvoice',
'answerShippingQuery',
'answerPreCheckoutQuery',
'getStickerSet',
'uploadStickerFile',
'createNewStickerSet',
'addStickerToSet',
'setStickerPositionInSet',
'deleteStickerFromSet',
'sendMediaGroup'];