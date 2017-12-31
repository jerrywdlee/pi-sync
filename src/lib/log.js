'use strict';

// const fs = require('fs');
const path = require('path');
const colors = require('colors/safe');
// const package_json = JSON.parse(fs.readFileSync('./package.json'));
const currentRepoName = path.basename(process.cwd());
const _ = require('lodash');

class Log {
  constructor() {
    
  }

  static log(label, ...args) {
    console.log(
      colors.bold.green(Log.prefix()),
      colors.green(`< ${label} >`),
      ...args
    );
  }

  static warn(label, ...args) {
    if (_.isEmpty(args)) {
      args = [label];
      label = 'Warning';
    }
    console.warn(
      colors.bold.yellow(Log.prefix()),
      colors.yellow(`< ${label} >`),
      ...args
    );
  }

  static error(label, ...args) {
    if (_.isEmpty(args)) {
      args = [label];
      label = 'Error!!';
    }
    console.error(
      colors.bold.red(Log.prefix()),
      colors.red(`< ${label} >`),
      ...args
    );
  }

  static prefix() {
    const date = new Date();
    const format = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      second: '2-digit'
    }
    const timeStr = `[${date.toLocaleTimeString([], format)}.${_.padStart(date.getMilliseconds(), 3, 0)}]`;
    return `[${currentRepoName}] ${colors.dim(timeStr)}`;
  }
}

module.exports = Log;