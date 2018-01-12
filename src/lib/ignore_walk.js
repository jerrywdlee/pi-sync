'use strict';

const walk = require('ignore-walk');
const path = require('path');
const fs = require('fs');
const Minimatch = require('minimatch').Minimatch;
const ignore = require('ignore');
const ig = ignore();

class ExtWalkerSync extends walk.WalkerSync {
  constructor(opt, addIgnoreRules) {
    super(opt);
    // console.log('ignoreFiles', this.ignoreFiles);
    this.ignoreFiles.push('pi-sync-additional-ignore-rules');
    this.ignoreRules['pi-sync-additional-ignore-rules'] = addIgnoreRules;
  }
}

const addIgnoreRules = patterns => {
  const mmopt = {
    matchBase: true,
    dot: true,
    flipNegate: true,
    nocase: true
  };
  const rules = patterns
    .filter(line => line && !/^#|^$/.test(line.trim()))
    .map(r => new Minimatch(r, mmopt));
  return rules;
}

const walkSync = (options, includeRules, ignoreRules) => {
  let gitignore = '';
  try {
    gitignore = fs.readFileSync(path.join(process.cwd(), '.gitignore'), 'utf8');
  } catch (e) {}
  const gitignoreRules = gitignore.split(/\r?\n/).filter(line => {
    if (line) {
      return !/^#|^$/.test(line.trim()) && !includeRules.includes(line.trim());
    }
  })
  // console.log('gitignoreRules', gitignoreRules);

  ignoreRules = ignoreRules.concat(gitignoreRules);
  let rules = addIgnoreRules(ignoreRules);
  ig.add(ignoreRules);
  let fileList = new ExtWalkerSync(options, rules).start().result.filter(path => !ig.ignores(path));
  // let rules = addIgnoreRules(ignoreRules);
  return {
    // fileList: new ExtWalkerSync(options, rules).start().result,
    // ignoreRuleList: rules
    fileList: fileList,
    ignoreRuleList: ignoreRules
  };
};

module.exports = walkSync;