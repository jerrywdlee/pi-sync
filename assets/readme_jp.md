# IoT開発の利器，pi-sync

## 前書き
  __あけましておめでとうございます__。２０１８年の初Qittaです。よろしくお願いいたします。  
  今回のテーマは最近NPMにアップしたツール、[pi-sync](https://www.npmjs.com/package/pi-sync)です。
  過去、某T社でIoTの開発を行う際、Raspberry Piなどのデバイスに変更都度ファイルをアップする手間をかかっていました。私の当時の技術力はどうも解決できなかったが、その後色々あって、このツールを開発しました。[docker-sync](https://github.com/EugenMayer/docker-sync)というツールをちなんで、[pi-sync](https://www.npmjs.com/package/pi-sync)にしました。  
  
  ![pi-sync](https://cdn.rawgit.com/jerrywdlee/pi-sync/2953d442/assets/pi-sync.png "pi-sync")
## インストールと実行
```
# project配下へ
npm i -D pi-sync
$(npm bin)/pi-sync [options]
# 直接実行
npx pi-sync [options]

## node.jsバージョン６以上が必要
```

## 設定
パラメータ付きで実行できます。そして`pi-sync -i`で`pi-sync.conf.yml`をproject配下に置くとより多くカスタマイズできます。  
パラメータと`pi-sync.conf.yml`同時存在の時パラメータの設定が優先されます。
### パラメータ一覧
```
  Usage: pi-sync [options]


  Options:

    -V, --version            バージョンを表示
    -w, --watch              プロジェクト内のファイル変更を監視
    -H, --host <host>        デバイスのSSH hostname
    -p, --port <port>        デバイスのSSH port number
    -a, --account <account>  デバイスのSSH ユーザー name
    -P, --pass <pass>        デバイスのSSH password 
    -k, --key <key>          デバイスのSSH秘密鍵のPath
    -r, --remote <remote>    デバイスのに同期したい場所のpath, 絶対パスが必要
    -s, --safe               セーフモードを使う, もし同期失敗した場合、これを試してください
    -i, --init               初期化した `pi-sync.conf.yml` をプロジェクト配下へ置く
    -h, --help               ヘルプ

  Examples:

    $ pi-sync --help
    $ pi-sync -i -H pi@192.168.3.86:22 -r /home/pi/PROJECT
    $ pi-sync -H pi@192.168.1.1:22 -k PATH/TO/KEY
    $ pi-sync -H pi@192.168.1.1:22 -P raspberry
    $ pi-sync -H 192.168.1.1 -p 22 -a pi -P raspberry
    $ pi-sync -w -H pi@192.168.1.1:22 -P raspberry
    $ pi-sync -w -H 192.168.1.1 # use pi@HOSTNAME:22, pw: raspberry by default
    $ pi-sync -s -H 192.168.1.1 -r /home/pi/Documents/PROJECT
```

### pi-sync.conf.ymlの解説
```yaml
# NOTE: This sample configs could not used directly

connection: # connection setting of ssh/sftp 
  host: 192.168.x.xx # needed
  port: 22 # optional, default 22
  username: pi # optional, default pi
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

## 示例
ローカルの `pi-sync` を `pi@192.168.3.86:22` の `/home/pi/Documents/pi-sync` へバッチアップロードします。セーフモードを使用しました。
![Sample Usage](https://cdn.rawgit.com/jerrywdlee/pi-sync/c128932c/assets/pi-sync_demo_1.gif "Sample Usage")

ローカルの `pi-sync` の変更を監視し、 `pi-sync.conf.yml` で記載したルールで同期します。
![Sample Usage](https://cdn.rawgit.com/jerrywdlee/pi-sync/c128932c/assets/pi-sync_demo_2.gif "Sample Usage")

２０１８年もよろしくお願いいたします。


