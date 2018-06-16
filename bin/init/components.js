const fs = require('fs');

const loadFromFolderToVariable = (folder, variable, app, component) => {
  if (fs.existsSync(folder)) {
    const filesList = fs.readdirSync(folder);
    for (let file of filesList) {
      const componentName = file.indexOf('.js') === file.length - 3 ?
       file.substr(0, file.length - 3) : file;
      if (fs.lstatSync(folder + '/' + file).isDirectory()) {
        variable[file] = {};
        loadFromFolderToVariable(folder + '/' + file, variable[file], app, component);
      } else if (typeof variable[componentName] === 'undefined') {
        variable[componentName] = require(folder + '/' + file);
        if (component === 'helpers' || component === 'intervals')
          variable[componentName](app);
      }
    }
  }
};

module.exports = (app, components) => {
  let folders = app.configs.folders;
  if (typeof folders === 'undefined')
    folders = {};
  for (let component of components) {
    if (typeof app[component] === 'undefined') {
      app[component] = {};
    }
    loadFromFolderToVariable(folders[component], app[component], app, component);
  }
};