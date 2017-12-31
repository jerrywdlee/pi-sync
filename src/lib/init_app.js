'use strict';
const fs = require('fs');
const path = require('path');
const confPath = path.resolve(process.cwd(), 'pi-sync.conf.yml');
const currentRepoName = path.basename(process.cwd());
const colors = require('colors/safe');
const Log = require('./log');

const generateConf = connect_opt => {
  if (!connect_opt.host) {
    Log.warn(`No host specified, set ${colors.green('192.168.1.1')} for defalt`);
    Log.warn(`Plz check ${colors.yellow(confPath)}.`);
  }
  const conf_yaml = `# pi-sync.conf.yml
# Plz add this file to .gitignore if needed

connection: # connection setting of ssh/sftp 
  host: ${connect_opt.host || '192.168.1.1'} # needed
  port: ${connect_opt.port} # optional, default 22
  username: ${connect_opt.username} # needed
  password: ${connect_opt.password} # optional, but one of password or privateKey is needed

transport: # directory setting of sftp
  remotePath: ${connect_opt.remotePath || path.join('/home/pi/', currentRepoName)} # optional, default is $HOME/${currentRepoName}
  # localPath: ~/my-git/pi-sync # optional, default is current path
  # execBefore: 'npm install' # optional, command run before transport
  # execAfter: 'npm run build' # optional, command run after transport
  # polling: 1500 # optional, defalt 1500ms, on --watch mode, stock changes and transport every few moment
  # safeMode: false # optional, defalt false, if true, transport file one by one, slow but safe

# ignore: # optional, additional ignore files which not in .gitignore
#   - readme.md

# include: # optional, additional include files which ignored by .gitignore
#   - IM-IN-GITIGNORE.yml
`;

  return conf_yaml;
};

const createConf = connect_opt => {
  const conf_yaml = generateConf(connect_opt);
  // console.log(conf_yaml);
  fs.writeFileSync(confPath, conf_yaml);
  Log.log(`Init`,`Add config file at ${colors.green(confPath)}.`);
};

module.exports = createConf;