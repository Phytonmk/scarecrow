const fs = require('fs');
const yaml = require('js-yaml');
module.exports = (app, rewrite=false) =>
  new Promise(async (resolve, reject) => {
    await loadTextes(app, rewrite, app.configs.folders.textes).catch(e => reject(e));
    await loadTextes(app, false, __dirname + '/../../default-components/textes').catch(e => reject(e));
    resolve();
  });

const loadTextes = (app, rewrite, folder) => new Promise((resolve, reject) => {
  fs.readdir(folder, async (err, langsList) => {
    if (err) {
      reject(err);
      return;
    }
    try {
      let textes;
      if (rewrite || typeof app.textes === 'undefined')
        textes = {};
      else
        textes = app.textes;
      const langs = [];
      for (let langFile of langsList) {
        const langPureData = await promisedFileRead(folder + '/' + langFile, 'utf-8');
        const langData = yaml.safeLoad(langPureData);
        const langName = langFile.replace(/\.yaml/gi, '');
        langs.push(langName);
        if (typeof textes[langName] === 'undefined')
          textes[langName] = {};
        for (let string in langData) {
          if (rewrite || typeof textes[langName][string] === 'undefined')
            textes[langName][string] = langData[string];
        }
      }
      app.textes = textes;
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

const promisedFileRead = async (path, encoding) => new Promise((resolve, reject) => {
  fs.readFile(path, encoding, (err, data) => {
    if (err)
      reject(err);
    else
      resolve(data);
  }) 
});

const fillSpacesInAdditionalLanguages = (app) => {
  for(let lang in app.textes) {
    if (lang !== app.configs.languages.main) {
      for (let string in app.textes[app.configs.languages.main]) {
        if (typeof app.textes[lang][string] === 'undefined') {
          app.textes[lang][string] = 
            app.textes[app.configs.languages.main][string];
        }
      }
    }
  }
}