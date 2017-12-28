'use strict';
const fs = require('fs');
const YAML = require('yamljs');
const program = require('commander');
const _ = require('lodash');

const options = YAML.load('./lib/extra/options.yml');
const package_json = JSON.parse(fs.readFileSync('./package.json'));

program.version(package_json.version);

for (const command of options.commands) {
  program.option(command[0], command[1]);
}

program.on('--help', () => {
  console.log();
  console.log(options.example.replace(/\'/g, ''));
  process.exit(0);
});

program.parse(process.argv);


const connect_opt = {
  // account: program.account || program.host.match(/^(.*?)@/g)[0].replace('@', ''),
  // port: program.port || program.host.match(/:(.*?)$/g)[0].replace(':', ''),
  // host: program.host.replace(/:(.*?)$/g, '').replace(/^(.*?)@/g, ''),
  pass: program.pass,
  watch: program.watch
};

if (program.host) {
  connect_opt['account'] = program.account || program.host.match(/^(.*?)@/g)[0].replace('@', '');
  connect_opt['port'] = program.port || program.host.match(/:(.*?)$/g)[0].replace(':', '');
  connect_opt['host'] = program.host.replace(/:(.*?)$/g, '').replace(/^(.*?)@/g, '');
}

program.connect_opt = {};
_.forEach(connect_opt, (v, k) => {
  if (v) {
    program.connect_opt[k] = v;
  }
});
// console.log(program.connect_opt);
module.exports = program;