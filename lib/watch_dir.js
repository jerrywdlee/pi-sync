'use strict';
// const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chokidar = require('chokidar');

const Log = require('./log');
const delay = require('./delay');

// global variables for watcher
let putFileList = [];
let delFileList = [];
let busyFlag = false;

const watch = opt => {
  const { ignoreRuleList, syncConf, sync } = opt;
  const watcher = chokidar.watch(process.cwd(), {
    ignored: ignoreRuleList.map(r => path.join(process.cwd(), r)),
    persistent: true
  });
  watcher
    .on('ready', () => {
      Log.log('Watcher', 'File watcher initiated. Ready for changes');
      watcher.on('add', updateFile)
    })
    .on('change', updateFile)
    .on('unlink', deleteFile);

  const polling = _.get(syncConf, 'transport.polling') || 1500;
  (async () => {
    while (true) {
      const putList = [...putFileList];
      const delList = [...delFileList];
      putFileList = [];
      delFileList = [];
      await sync.sync(putList, delList);
      await delay(polling);
    }
  })()
};

const updateFile = path => {
  putFileList.push(path);
  putFileList = formatFileList(putFileList);
  // Log.log('put', path);
};

const deleteFile = path => {
  delFileList.push(path);
  delFileList = formatFileList(delFileList);
  // Log.log('del', path);
}

const formatFileList = list => {
  return _.uniq(list).map(p => p.replace(process.cwd(), ''));
};

module.exports = watch;