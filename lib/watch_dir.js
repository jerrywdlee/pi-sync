const fs = require('fs');
const path = require('path');
const _ = require('lodash');

console.log(process.cwd());

const chokidar = require('chokidar');

const watch = ignoreRuleList => {
  const watcher = chokidar.watch(process.cwd(), {
    ignored: ignoreRuleList.map(r => path.join(process.cwd(), r)),
    persistent: true
  });
  watcher
    .on('ready', () => {

      console.log('Initial scan complete. Ready for changes')
      watcher.on('add', path => console.log(`File ${path} has been added`))
    })
    .on('change', path => console.log(`File ${path} has been changed`))
    .on('unlink', path => console.log(`File ${path} has been removed`));
}

module.exports = watch;