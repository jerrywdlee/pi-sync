'use strict';

const node_ssh = require('node-ssh');
const colors = require('colors/safe');
const path = require('path');
const _ = require('lodash');
const Log = require('./log');
const delay = require('./delay');

class Sync {
  constructor(syncConf) {
    this.ssh = new node_ssh();
    this.syncConf = syncConf;
    this.dirName = path.basename(process.cwd());
    this.remotePath = '';
    this.remoteHomePath = '';
    this.safeMode = _.get(this.syncConf, 'connection.safeMode') || _.get(this.syncConf, 'transport.safeMode');
  }

  async connect() {
    await this.ssh.connect(this.syncConf.connection);
    this.remotePath = _.get(this.syncConf, 'connection.remotePath') || _.get(this.syncConf, 'transport.remotePath') ||`~/${this.dirName}`;
    let res = await this.ssh.execCommand(`echo $HOME`);
    this.remoteHomePath = res.stdout.toString();
    this.remotePath = this.remotePath.replace(/^\$HOME|^~/, this.remoteHomePath);
    // console.log('this.remotePath', this.remotePath);
    if (!this.remoteHomePath || !this.remotePath) throw Error('Can Not Find PATH');
    const connectMsg = `Host: ${colors.bold.yellow(
      this.syncConf.connection.username + '@' +
      this.syncConf.connection.host + ':' + this.syncConf.connection.port
    )}`;
    Log.log(colors.bold('Connected!'), connectMsg);
  }

  async sync(putFileList = [], delFileList = []) {
    if (_.isEmpty(putFileList) && _.isEmpty(delFileList)) return;
    const safeMode = this.safeMode;
    const { transport } = this.syncConf;
    if (_.get(transport, 'execBefore')) {
      await this.exec(transport.execBefore, this.remotePath, colors.cyan('execBefore'));
    }
    await this.putFiles(putFileList, safeMode);
    await this.delFiles(delFileList, safeMode);
    if (_.get(transport, 'execAfter')) {
      await this.exec(transport.execAfter, this.remotePath, colors.cyan('execAfter'));
    }
  }

  async putFiles(fileList, safeMode) {
    if (_.isEmpty(fileList)) return;
    const pathList = fileList.filter(f => f).map(f => {
      return {
        local: path.join(process.cwd(), f),
        remote: path.join(this.remotePath, f)
      };
    });
    
    try {
      const startTime = Date.now();
      if (safeMode) {
        for (const paths of pathList) {
          Log.log('Safe mode updating', paths.local.replace(process.cwd() + '/', ''));
          await this.ssh.putFile(paths.local, paths.remote);
        }
      } else {
        const listChunks = _.chunk(pathList, 200);
        for (const chunk of listChunks) {
          await this.ssh.putFiles(chunk);
        }
      }
      // after success
      const usedTime = Date.now() - startTime;
      Log.log(
        'putFiles', 
        `${colors.bold.yellow(fileList.length)} files ${colors.green('updated')} in ${usedTime}ms.`
      );
    } catch (e) {
      Log.error('putFiles', e.message);
      console.error(e);
    }
  }

  async delFiles(fileList, safeMode) {
    if (_.isEmpty(fileList)) return;
    const pathList = fileList.filter(f => f)
      .map(f => path.join(this.remotePath, f));
    let listChunks = _.chunk(pathList, 200);
    if (safeMode) {
      listChunks = _.chunk(pathList, 5);
    }
    try {
      const startTime = Date.now();
      for (const chunk of listChunks) {
        const delCommand = `rm -f ${chunk.join(' ')}`;
        let res = await this.ssh.execCommand(delCommand);
        if (res.stderr) {
          throw Error(res.stderr.toString());
        }
      }
      // after success
      const usedTime = Date.now() - startTime;
      Log.log(
        colors.yellow('delFiles'),
        `${colors.bold.yellow(fileList.length)} files ${colors.yellow('deleted')} in ${usedTime}ms.`
      );
    } catch (e) {
      Log.error('delFiles', e.message);
      console.error(e);
    }
  }

  async exec(command, path, label) {
    try {
      let res = await this.ssh.execCommand(command, { cwd: path });
      if (res.stdout) {
        res.stdout.toString().split(/\r?\n/).forEach(line => {
          Log.log(label, line);
        });
      }
      if (res.stderr) {
        res.stderr.toString().split(/\r?\n/).forEach(line => {
          Log.warn(label, line);
        });
      }
    } catch (e) {
      Log.error(label, e.message);
    }
  }

  close() {
    this.ssh.dispose();
  }
}

module.exports = Sync;