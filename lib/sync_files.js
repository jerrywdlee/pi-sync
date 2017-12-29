'use strict';

const node_ssh = require('node-ssh');
const colors = require('colors/safe');
const path = require('path');
const _ = require('lodash');
// const ssh = new node_ssh();

class Sync {
  constructor(syncConf) {
    this.ssh = new node_ssh();
    this.syncConf = syncConf;
    this.dirName = path.basename(process.cwd());
    this.remotePath = '';
    this.remoteHomePath = '';
  }

  async connect() {
    await this.ssh.connect(this.syncConf.connection);
    this.remotePath = _.get(this.syncConf, 'transport.remotePath') || `~/${this.dirName}`;
    let res = await this.ssh.execCommand(`echo $HOME`);
    this.remoteHomePath = res.stdout.toString();
    this.remotePath = this.remotePath.replace(/^\$HOME|^~/, this.remoteHomePath);
    if (!this.remoteHomePath || !this.remotePath) throw Error('Can Not Find PATH');
    const connectMsg = `Host: ${colors.bold.yellow(
      this.syncConf.connection.username + '@' +
      this.syncConf.connection.host + ':' + this.syncConf.connection.port
    )}`;
    console.log(
      colors.bold.green(`[pi-sync]`),
      colors.green(`[Connected]`),
      connectMsg
    );
  }

  async sync(putFileList = [], delFileList = []) {
    if (_.isEmpty(putFileList) && _.isEmpty(delFileList)) return;
    const { transport } = this.syncConf;
    if (_.get(transport, 'execBefore')) {
      await this.exec(transport.execBefore, this.remotePath, 'execBefore');
    }
    await this.putFiles(putFileList);
    await this.delFiles(delFileList);
    if (_.get(transport, 'execAfter')) {
      await this.exec(transport.execAfter, this.remotePath, 'execAfter');
    }
  }

  async putFiles(fileList) {
    if (_.isEmpty(fileList)) return;
    try {
      const pathList = fileList.filter(f => f).map(f => {
        return {
          local: path.join(process.cwd(), f),
          remote: path.join(this.remotePath, f)
        };
      });
       // dummy
      console.log(pathList);

      // after success
      console.log(
        colors.bold.green(`[pi-sync]`),
        colors.green(`[putFiles]`),
        `${colors.bold.yellow(fileList.length)} files updated.`
      );
    } catch (e) {
      console.error(
        colors.bold.red(`[pi-sync]`),
        colors.red(`[${'putFiles'}]`), e.message
      );
    }
  }

  async delFiles(fileList) {
    if (_.isEmpty(fileList)) return;
    const pathList = fileList.filter(f => f)
      .map(f => path.join(this.remotePath, f)).join(' ');
    const delCommand = `rm -f ${pathList}`;
    // dummy
    console.log(delCommand);

    // after success
    console.log(
      colors.bold.green(`[pi-sync]`),
      colors.green(`[delFiles]`),
      `${colors.bold.yellow(fileList.length)} files deleted.`
    );
  }

  async exec(command, path, label) {
    try {
      let res = await this.ssh.execCommand(command, { cwd: path });
      if (res.stdout) {
        res.stdout.toString().split(/\r?\n/).forEach(line => {
          console.log(
            colors.bold.green(`[pi-sync]`),
            colors.green(`[${label}]`), line
          );
        });
      }
      if (res.stderr) {
        res.stderr.toString().split(/\r?\n/).forEach(line => {
          console.warn(
            colors.bold.yellow(`[pi-sync]`),
            colors.yellow(`[${label}]`), line
          );
        });
      }
    } catch (e) {
      console.error(
        colors.bold.red(`[pi-sync]`), 
        colors.red(`[${label}]`), e.message
      );
    }
  }

  close() {
    this.ssh.dispose();
  }
}

module.exports = Sync;