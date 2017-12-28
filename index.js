#!/usr/bin/env node

'use strict';
const fs = require('fs');
const path = require('path');
const node_ssh = require('node-ssh');
const YAML = require('yamljs');
const colors = require('colors/safe');
const _ = require('lodash');
// const ignore_walk = require('ignore-walk')
const walkSync = require('./lib/ignore_walk');
const watch = require('./lib/watch_dir');

const confFileName = 'pi-sync.conf.yml';
const confPath = path.resolve(process.cwd(), confFileName);

let syncConf = {};

try {
  syncConf = YAML.load(confPath) || {};
} catch (e) {
  let warn = `Could not find ${colors.green(`'${confFileName}'`)} under ${colors.yellow(process.cwd())}`;
  console.warn(colors.red(`[Warning]`), warn);
  throw Error(e.message)
}

let ignoreRules = ['.git', '.git/**/*'].concat(syncConf.ignore).filter(r => r);
let includeRules = [].concat(syncConf.include).filter(r => r).map(r => r.trim());
// console.log(ignoreRules);

const { fileList, ignoreRuleList } = walkSync({ ignoreFiles: [] }, includeRules, ignoreRules);

console.log(syncConf);
console.log(fileList);
/*
ignoreRuleList.forEach(rule => {
  console.log(rule.set.length);
});
*/

watch(ignoreRuleList);
