# pi-sync
Auto sync codes to Raspberry Pi by SFTP, inspirated by docker-sync.

# Install
## Global
```
npm i -g pi-sync
```
## Local
```
npm i -D pi-sync
```

# Usage
## Use Config File
Set `pi-sync.conf.yml` under repository root before use it.
```yaml
# NOTE: This sample configs could not used directly

connection: # connection setting of ssh/sftp 
  host: 192.168.x.xx # needed
  port: 22 # optional, default 22
  username: pi # needed
  password: raspberry # optional, but one of password or privateKey is needed
  # privateKey: PATH/TO/KEY # optional, but one of password or privateKey is needed

transport: # directory setting of sftp
  remotePath: ~/pi-sync # optional, default is ~/SAME-DIR-NAME
  localPath: ~/my-git/pi-sync # optional, default is current path
  execBefore: 'npm install' # optional, command run before transport
  execAfter: 'npm run build' # optional, command run after transport
  polling: 1500 # optional, defalt 1500ms, on --watch mode, stock changes and transport every few moment

ignore: # optional, additional ignore files which not in .gitignore
  - readme.md

include: # optional, additional include files which ignored by .gitignore
  - IM-IN-GITIGNORE.yml

```