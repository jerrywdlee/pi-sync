'use strict';
// const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chokidar = require('chokidar');
const ignore = require('ignore');
const ig = ignore();

const Log = require('./log');
const delay = require('./delay');
const DelayFlag = require('./delay_flag');

// global variables for watcher
let putFileList = [];
let delFileList = [];
let df = null;

const watch = opt => {
  const { ignoreRuleList, syncConf, sync } = opt;
  ig.add(ignoreRuleList);
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
  df = new DelayFlag(polling);
  (async () => {
    while (true) {
      if (!df.flag) {
        let putList = [...putFileList];
        let delList = [...delFileList];
        const inter = _.intersection(putList, delList);
        putList = _.xor(putList, inter);
        delList = _.xor(delList, inter);
        putFileList = [];
        delFileList = [];
        await sync.sync(putList, delList);
      }
      await delay(500);
    }
  })()
};

const updateFile = path => {
  if (!ig.ignores(path)) {
    putFileList.push(path);
    putFileList = formatFileList(putFileList);
    df.trigger();
  }
  // console.log('ig.ignores(path)', ig.ignores(path));
  // console.log(ig.filter(putFileList));
  // Log.log('put', path);
};

const deleteFile = path => {
  if (!ig.ignores(path)) {
    delFileList.push(path);
    delFileList = formatFileList(delFileList);
    df.trigger();
  }
  // Log.log('del', path);
}

const formatFileList = list => {
  return _.uniq(list.map(p => p.replace(process.cwd(), '')));
};

module.exports = watch;