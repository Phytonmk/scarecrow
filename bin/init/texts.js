const fs = require('fs');
const yaml = require('js-yaml');
module.exports = (app, rewrite=false) =>
  new Promise(async (resolve, reject) => {
    await loadTexts(app, rewrite, app.configs.folders.texts).catch(e => reject(e));
    await loadTexts(app, false, __dirname + '/../../default-components/texts').catch(e => reject(e));
    resolve();
  });

const loadTexts = (app, rewrite, folder) => new Promise((resolve, reject) => {
  fs.readdir(folder, async (err, langsList) => {
    if (err) {
      reject(err);
      return;
    }
    try {
      let texts;
      if (rewrite || typeof app.texts === 'undefined')
        texts = {};
      else
        texts = app.texts;
      const langs = [];
      for (let langFile of langsList) {
        const langPureData = await promisedFileRead(folder + '/' + langFile, 'utf-8');
        const langData = yaml.safeLoad(langPureData);
        const langName = langFile.replace(/\.yaml/gi, '');
        langs.push(langName);
        if (typeof texts[langName] === 'undefined')
          texts[langName] = {};
        for (let string in langData) {
          if (rewrite || typeof texts[langName][string] === 'undefined')
            texts[langName][string] = langData[string];
        }
      }
      app.texts = texts;
      if (!app.langs || langs.length > app.length)
        app.langs = langs;
      if (app.configs.languages && app.configs.languages.many)
        fillSpacesInAdditionalLanguages(app);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
});

const promisedFileRead = (path, encoding) => new Promise((resolve, reject) => {
  fs.readFile(path, encoding, (err, data) => {
    if (err)
      reject(err);
    else
      resolve(data);
  });
});

const fillSpacesInAdditionalLanguages = (app) => {
  for(let lang in app.texts) {
    if (lang !== app.configs.languages.main) {
      for (let string in app.texts[app.configs.languages.main]) {
        if (typeof app.texts[lang][string] === 'undefined') {
          app.texts[lang][string] = 
            app.texts[app.configs.languages.main][string];
        }
      }
    }
  }
};