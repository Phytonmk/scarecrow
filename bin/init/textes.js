const fs = require('fs').promises;
const yaml = require('js-yaml');
module.exports = (app, folder) => {
  new Promise((resolve, reject) => {
    (async function{
      try {
        const langsList = await fs.readdir(folder);
        console.log('complete langs')
      } catch (e) {
        reject(e);
      }
    })()
  });
}