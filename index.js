#!/usr/bin/env node

'use strict';
// const fs = require('fs');
const path = require('path');
const YAML = require('yamljs');
const colors = require('colors/safe');
const _ = require('lodash');

const { connect_opt } = require('./lib/argv_helper');
const walkSync = require('./lib/ignore_walk');
const watch = require('./lib/watch_dir');
const Sync = require('./lib/sync_files');
const Log = require('./lib/log');

const confFileName = 'pi-sync.conf.yml';
const confPath = path.resolve(process.cwd(), confFileName);

let syncConf = {};

try {
  syncConf = YAML.load(confPath) || {};
} catch (e) {
  let warn = `Could not find ${colors.green(`'${confFileName}'`)} under ${colors.yellow(process.cwd())}`;
  Log.warn(warn);
  console.error(e);
  // throw Error(e.message)
} finally {
  if (syncConf.connection) {
    Object.assign(syncConf.connection, connect_opt);
  } else {
    syncConf.connection = connect_opt;
  }
}

if (!_.get(syncConf, 'connection.host')) {
  let msg = `No host found, Plz check ${colors.yellow('`pi-sync -h`')} for more info.`
  Log.error(msg);
  process.exit(1);
}


let ignoreRules = ['.git'].concat(syncConf.ignore).filter(r => r);
let includeRules = [].concat(syncConf.include).filter(r => r).map(r => r.trim());

const { fileList, ignoreRuleList } = walkSync({ ignoreFiles: [] }, includeRules, ignoreRules);

Log.log('syncConf', syncConf);
// console.log(fileList);

const sync = new Sync(syncConf);
(async () => {
  try {
    await sync.connect();
    await sync.sync(fileList);
    if (syncConf.connection.watch) {
      const opt = {
        ignoreRuleList,
        sync,
        syncConf
      }
      watch(opt);
    } else {
      sync.close();
    }
  } catch (e) {
    Log.error( e.message);
    console.error(e);
    process.exit(1);
  }
})();