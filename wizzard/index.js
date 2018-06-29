const fs = require('fs');
const rl = require('readline-sync').question;

const wizzard = () => {

const scarecrowFolder = __dirname + '/..';

const confirm = (question) => {
  let result = false;
  while (true) {
    const answer = rl(question + ' [y/n] \n> ');
    if (answer === 'y') {
      result = true;
      break;
    } else if (answer === 'n') {
      result = false;
      break;
    }
  }
  return result;
}

if (!confirm('Use Scarecrow Wizzard?'))
  process.exit();

const defaultUserFolder = __dirname.replace(/node_modules[\/\\]scarecrow$/, '');
let userFolder = rl(`Select project folder [${defaultUserFolder}]\n> `, {defaultInput: defaultUserFolder});
while (!fs.existsSync(userFolder))
  userFolder = rl(`Folder doesnt exists, select project folder [${defaultUserFolder}] \n> `, {defaultInput: defaultUserFolder});

const app = {};

app.token = rl('Input your Telegram bot token: \n> ');

app.database = rl('Input your Mongo db access url (e.g. mongodb://user:password@localhost:27017/database): \n> ');

let multiLang = confirm('Use more than 1 language?');
app.languages = {muli: multiLang};
let mainLang = 'en';
if (multiLang) {
  mainLang = rl('Which language is main in your bot? [en]\n> ', {defaultInput: 'en'});
} else {
  mainLang = rl('Which language your bot use? [en]\n> ', {defaultInput: 'en'});
}
app.languages.main = mainLang;


app.folders = {};
const components = ['texts', 'controllers', 'models', 'intervals', 'helpers'];
const obviousComponents = ['texts', 'controllers', 'models'];
for (let component of components) {
  if (obviousComponents[component] !== undefined || confirm(`Use ${component} in your project?`));
  const componentFolder = rl(`Folder name for ${component} [${component}]\n> `, {
    defaultInput: component
  });
  app.folders[component] = '$DIRNAME$/' + componentFolder;
}
const copyFolderSync = (from, to) => {
  if (!fs.existsSync(to))
    fs.mkdirSync(to);
  for (let file of fs.readdirSync(from)) {
    if (fs.statSync(from + '/' + file).isDirectory())
      copyFolderSync(from + '/' + file, to + '/' + file);
    else if (!fs.existsSync(from + '/' + to))
      fs.copyFileSync(from + '/' + file, to + '/' + file);
  }
}

if (confirm('Create folders for your components?')) {
  for (let component in app.folders) {
    const folder = userFolder + app.folders[component].replace('$DIRNAME$', '');
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  }
}
let defaultComponents = false;
if (confirm('Create pre-built components?')) {
  defaultComponents = true;
  for (let component in app.folders) {
    const folder = userFolder + app.folders[component].replace('$DIRNAME$', '');
    copyFolderSync(__dirname + '/../default-components/' + component, folder);
  }
} else {
  fs.copyFileSync(__dirname + '/../default-components/models/User.js', userFolder + app.folders.models.replace('$DIRNAME$', '') + '/User.js');
}

app.logger = {};

const logToFolder = confirm('Log to folder?');

if (logToFolder) {
  const logsFolder = rl(`Input relative path for logs [logs]\n> `, {
    defaultInput: 'logs'
  });
  app.logger.folder = '$DIRNAME$/' + logsFolder;
  if (confirm('Create logs folder?')) {
    folder = userFolder + app.logger.folder.replace('$DIRNAME$', '');
  }
}

const logToTg = confirm('Log to Telegram?');

if (logToTg) {
  const token = rl(`Input bot token for logs [${app.token}]\n> `, {
    defaultInput: app.token
  });
  const recipient = rl(`Input developer tg id for logs (learn it via t.me/userinfobot)\n> `);
  app.logger.telegram = {token, recipient};
}

const routerPath = '$DIRNAME$/' + rl(`Input relative path to router [router.js]\n> `, {
    defaultInput: 'router.js'
  });

app.router = routerPath;


let fileText = JSON.stringify(app, null, 2);
fileText = fileText.replace(/\s"{1}[a-z]+"{1}:{1}/g, (match) => match.replace(/"/g, ''));
fileText = fileText.replace(/"\$DIRNAME\$/g, '__dirname + "');

fileText = `require('scarecrow')(${fileText});`;

fs.writeFileSync(userFolder + '/index.js', fileText);

const routerText = 
`module.exports = (router, controllers, RouterClass) => {
  const C = controllers;


}
`;

if (defaultComponents && confirm('Install default router?'))
  fs.copyFileSync(__dirname + '/../bin/router/routing-default-components.js', userFolder + app.router.replace('$DIRNAME$', ''));
else if (confirm('Create router tempate?'))
  fs.writeFileSync(userFolder + app.router.replace(/"\$DIRNAME\$/g, ''), routerText);

}
wizzard();