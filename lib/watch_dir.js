const fs = require('fs');
const path = require('path');
const _ = require('lodash');

console.log(process.cwd());

const chokidar = require('chokidar');

/*
const watcher = chokidar.watch(process.cwd(), {
  ignored: /(^|[\/\\])\../,
  persistent: true
});


watcher
  .on('ready', () => {

    console.log('Initial scan complete. Ready for changes')
    watcher.on('add', path => console.log(`File ${path} has been added`))
  })
  .on('change', path => console.log(`File ${path} has been changed`))
  .on('unlink', path => console.log(`File ${path} has been removed`));
*/

const watch = ignoreRuleList => {
  // const ignoreRuleReg = new RegExp(ignoreRuleList.join('|'));
  /*
  let regList = [];
  ignoreRuleList.forEach(rule => {
    regList = regList.concat(rule.set);
  });
  regList = _.flattenDeep(regList).map(r => r.source).filter(r => r);
  // console.log(regList);
  const ignoreRuleReg = new RegExp(regList.join('|'))
  */

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