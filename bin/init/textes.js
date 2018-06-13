const fs = require('fs');
const yaml = require('js-yaml');
module.exports = (app) => new Promise((resolve, reject) => {
    fs.readdir(app.configs.folders.textes, async (err, langsList) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        if (!app.configs.languages.many && langsList.length > 1) {
          reject('In single languages app only 1 language file acceptable');
        }
        const textes = {};
        for (let langFile of langsList) {
            const langPureData = await promisedFileRead(app.configs.folders.textes + '/' + langFile, 'utf-8');
            const langData = yaml.safeLoad(langPureData);
            const langName = langFile.replace(/\.yaml/gi, '');
            textes[langName] = langData;
        }
        app.textes = textes;
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });

const promisedFileRead = async (path, encoding) => new Promise((resolve, reject) => {
  fs.readFile(path, encoding, (err, data) => {
    if (err)
      reject(err);
    else
      resolve(data);
  }) 
});