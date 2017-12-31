#!/usr/bin/env node

'use strict';
const path = require('path');
const YAML = require('yamljs');
const colors = require('colors/safe');
const _ = require('lodash');

const { connect_opt } = require('./lib/argv_helper');
const walkSync = require('./lib/ignore_walk');
const watch = require('./lib/watch_dir');
const Sync = require('./lib/sync_files');
const Log = require('./lib/log');
const delay = require('./lib/delay');

const confFileName = 'pi-sync.conf.yml';
const confPath = path.resolve(process.cwd(), confFileName);

let syncConf = {};
const defaultConnection = {
  port: 22,
  username: 'pi',
  password: 'raspberry',
  readyTimeout: 5000
};

if (connect_opt.initApp) {
  const init = require('./lib/init_app');
  init(connect_opt);
  process.exit(0);
}

try {
  syncConf = YAML.load(confPath) || syncConf;
} catch (e) {
  let warn = `Could not find ${colors.green(`'${confFileName}'`)} under ${colors.yellow(process.cwd())}`;
  Log.warn(warn);
  // console.error(e);
} finally {
  if (syncConf.connection) {
    syncConf.connection = {
      ...defaultConnection,
      ...syncConf.connection,
      ...connect_opt
    };
    // Object.assign(syncConf.connection, connect_opt);
  } else {
    syncConf.connection = {
      ...defaultConnection,
      ...connect_opt
    };
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

// Log.log('syncConf', syncConf);
// Log.log('fileList', fileList);

const sync = new Sync(syncConf);
(async () => {
  try {
    await sync.connect();
    // await delay(100);
    if (syncConf.connection.watch) {
      const opt = {
        ignoreRuleList,
        sync,
        syncConf
      }
      watch(opt);
    } else {
      await sync.sync(fileList);
      sync.close();
    }
  } catch (e) {
    Log.error( e.message);
    console.error(e);
    process.exit(1);
  }
})();