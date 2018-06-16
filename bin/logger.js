const fs = require('fs.promised');
const axios = require('axios'); 

const addZero = a => {
  a += '';
  while (a.length < 2)
    a = '0' + a;
  return a;
};

module.exports = (configs) => {
  const loggers = [];

  if (!configs.logger || configs.logger.console) {
    loggers.push(console.log);
  }
  if (configs.logger) {
    if (configs.logger.telegram) {
      loggers.push((text) => {
        axios.post(`https://api.telegram.org/bot${configs.logger.telegram.token}/sendMessage`, {
          chat_id: configs.logger.telegram.recipient, text 
        }, (configs.requestProxy ? {proxy: configs.requestProxy} : {})).catch((e)=>{console.log('Unable to log:', e)});
      });
    }

    if (configs.logger.folder) {
      if (fs.existsSync(configs.logger.folder)) {
        loggers.push((text) => {
          const filename = new Date().getFullYear() + '-' + addZero(new Date().getMonth() + 1) + '-' + addZero(new Date().getDate() + '.log');
          fs.appendFile(configs.logger.folder + '/' + filename, text + '\n').catch((e)=>{console.log('Unable to log:', e)});
        });
      } else {
        console.log(`Unable to log: "${configs.logger.folder}" no such file or directory`);
      }
    }
  }
  const genLog = (type, chunks) => {
    const date = new Date();
    let dateString = '[';
    dateString += addZero(date.getHours());
    dateString += ':';
    dateString += addZero(date.getMinutes());
    dateString += ':';
    dateString += addZero(date.getSeconds());

    dateString += '][';

    dateString += addZero(date.getMonth() + 1);
    dateString += '/';
    dateString += addZero(date.getDate());

    dateString += ']';
    switch (type) {
      case 'error':
        dateString += '[ERR]';
        break;
      case 'info':
        dateString += '[inf]';
        break;
      case 'warning':
        dateString += '[wrn]';
        break;
    }
    for (let logger of loggers) {
      for (let chunk of chunks) {
        logger(dateString + ' ' + chunk);
      }
    }
  };

  return {
    error(...logData) {genLog('error', logData)},
    info(...logData) {genLog('info', logData)},
    warning(...logData) {genLog('warning', logData)},
    log(...logData) {genLog('log', logData)}
  };
};