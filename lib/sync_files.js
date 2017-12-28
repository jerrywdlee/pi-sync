'use strict';

const node_ssh = require('node-ssh');
const ssh = new node_ssh();

ssh.connect({
  host: '192.168.3.86',
  port: 22,
  username: 'pi',
  password: 'raspberry'
}).then(() => {
  ssh.execCommand('ls -la ~/Desktop').then(function (result) {
    console.log('STDOUT: ' + result.stdout)
    console.log('STDERR: ' + result.stderr)
  })
})