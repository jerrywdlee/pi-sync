'use strict';
// const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const chokidar = require('chokidar');

// global variables for watcher
let putFileList = [];
let delFileList = [];
let busyFlag = false;

const watch = opt => {
  const { ignoreRuleList } = opt;
  const watcher = chokidar.watch(process.cwd(), {
    ignored: ignoreRuleList.map(r => path.join(process.cwd(), r)),
    persistent: true
  });
  watcher
    .on('ready', () => {

      console.log(
        'Initial scan complete. Ready for changes'
      );
      watcher.on('add', path => console.log(`File ${path} has been added`))
    })
    .on('change', path => console.log(`File ${path} has been changed`))
    .on('unlink', path => console.log(`File ${path} has been removed`));
}

module.exports = watch;