# pi-sync
[![npm version](https://badge.fury.io/js/pi-sync.svg)](https://badge.fury.io/js/pi-sync)
[![Build Status](https://travis-ci.org/jerrywdlee/pi-sync.svg?branch=master)](https://travis-ci.org/jerrywdlee/pi-sync)
[![Coverage Status](https://coveralls.io/repos/github/jerrywdlee/pi-sync/badge.svg?branch=master)](https://coveralls.io/github/jerrywdlee/pi-sync?branch=master)  
Auto sync codes to Raspberry Pi by SFTP, inspirated by docker-sync.  

+ [中文](https://zhuanlan.zhihu.com/p/32486988)  
+ [日本語](https://qiita.com/jerrywdlee/items/41efb0a5ad4b03542247)  
# Install
```
npm i -g pi-sync
# OR
npm i -D pi-sync
```

# Node versions
node.js version 6+ needed.

# Usage
## Use Options
__*NOTE*__: Priority Level: `options` > `pi-sync.conf.yml` > Default Setting  
__*IMPORTANT*__: An already-known bug occurs when try to sync a large project for first time, Plz use `-s` options when sync failed.
```
  Usage: pi-sync [options]


  Options:

    -V, --version            output the version number
    -w, --watch              Watch files change and sync
    -H, --host <host>        SSH host name of remote device
    -p, --port <port>        SSH port number of remote device
    -a, --account <account>  SSH account name of remote device
    -P, --pass <pass>        SSH password of remote device
    -k, --key <key>          Path to SSH private key
    -r, --remote <remote>    Remote path, must be absolute path
    -s, --safe               Use safe mode, if failed first time, try safe mode
    -h, --help               output usage information

  Examples:

    $ pi-sync --help
    $ pi-sync -H pi@192.168.1.1:22 -k PATH/TO/KEY
    $ pi-sync -H pi@192.168.1.1:22 -P raspberry
    $ pi-sync -H 192.168.1.1 -p 22 -a pi -P raspberry
    $ pi-sync -w -H pi@192.168.1.1:22 -P raspberry
    $ pi-sync -w -H 192.168.1.1 # use pi@HOSTNAME:22, pw: raspberry by default
    $ pi-sync -s -H 192.168.1.1 -r /home/pi/Documents/PROJECT
```

## Use Config File
Set `pi-sync.conf.yml` under repository root before use it. and run commands below.
### Demo pi-sync.conf.yml
```yaml
# NOTE: This sample configs could not used directly

connection: # connection setting of ssh/sftp 
  host: 192.168.x.xx # optional, default pi
  port: 22 # optional, default 22
  username: pi # needed
  password: raspberry # optional, but one of password or privateKey is needed
  # privateKey: PATH/TO/KEY # optional, but one of password or privateKey is needed
  readyTimeout: 10000 # optional, How long (in milliseconds) to wait for the SSH handshake to complete 

transport: # directory setting of sftp
  remotePath: ~/pi-sync # optional, default is ~/SAME-DIR-NAME
  localPath: ~/my-git/pi-sync # optional, default is current path
  execBefore: 'npm install' # optional, command run before transport
  execAfter: 'npm run build' # optional, command run after transport
  polling: 1500 # optional, defalt 1500ms, on --watch mode, stock changes and transport every few moment
  safeMode: false # optional, defalt false, if true, transport file one by one, slow but safe

ignore: # optional, additional ignore files which not in .gitignore
  - readme.md

include: # optional, additional include files which ignored by .gitignore
  - IM-IN-GITIGNORE.yml

```

### Commands
```
# Batch sync
$(npm bin)/pi-sync

# Watch file changes and sync
$(npm bin)/pi-sync -w
```

# Demo Images
## Use options 
Sync local `pi-sync` to `/home/pi/Documents/pi-sync` at `pi@192.168.3.86:22` once in __safeMode__.
![Sample Usage](https://cdn.rawgit.com/jerrywdlee/pi-sync/c128932c/assets/pi-sync_demo_1.gif "Sample Usage")

## Use config file and watch change
Sync local `pi-sync` by `pi-sync.conf.yml` and watch local file changes.
![Sample Usage](https://cdn.rawgit.com/jerrywdlee/pi-sync/c128932c/assets/pi-sync_demo_2.gif "Sample Usage")

## License (MIT)
Copyright 2017~2018 Jerry Lee