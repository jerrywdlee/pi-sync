# IoT开发的利器，pi-sync

## 前言
  本透明最近一扫2017年的阴霾，心情大好。趁着上次发布[Dev Service Runner](https://zhuanlan.zhihu.com/p/32373407)的余威，继续向npm整理发布几年来工作之余开发的工具。  
  这次的包叫做[pi-sync](https://www.npmjs.com/package/pi-sync)，是为了解决曾经在开发Raspberry Pi程序时，调试需要随时上传文件到单片机上的问题而开发的。开发时借鉴了很多[docker-sync](https://github.com/EugenMayer/docker-sync)的想法。

## 安装运行
```
# 安装到project下
npm i -D pi-sync
$(npm bin)/pi-sync [options]
# 直接运行
npx pi-sync [options]

## 需要6.0以上版本的node.js
```

## 设置
可以直接带参数运行，也可设置`pi-sync.conf.yml`到project的根目录下运行。  
同时具有参数和`pi-sync.conf.yml`时，参数内容优先起作用。
### 参数一览
```
Usage: pi-sync [options]

  Options:

    -V, --version            打印版本号
    -w, --watch              监视文件变化，有变化时同步(开启监视时不会自动同步所有文件)
    -H, --host <host>        单片机的 SSH host name
    -p, --port <port>        SSH 端口号
    -a, --account <account>  SSH 用户名
    -P, --pass <pass>        SSH 密码
    -k, --key <key>          SSH 私钥的路径(密码与私钥只需一个)
    -r, --remote <remote>    单片机上目标文件夹，需要绝对路径
    -s, --safe               安全模式上传，在上传量较大时推荐
    -h, --help               打印帮助

  Examples:

    $ pi-sync --help
    $ pi-sync -H pi@192.168.1.1:22 -k PATH/TO/KEY
    $ pi-sync -H pi@192.168.1.1:22 -P raspberry
    $ pi-sync -H 192.168.1.1 -p 22 -a pi -P raspberry
    $ pi-sync -w -H pi@192.168.1.1:22 -P raspberry
    $ pi-sync -w -H 192.168.1.1 # use pi@HOSTNAME:22, pw: raspberry by default
    $ pi-sync -s -H 192.168.1.1 -r /home/pi/Documents/PROJECT
```

### pi-sync.conf.yml示例
```yaml
# NOTE: This sample configs could not used directly

connection: # 连接设置
  host: 192.168.x.xx # 必须
  port: 22 # 可选, 默认 22
  username: pi # 可选, 默认为pi
  password: raspberry # 可选, 默认为raspberry
  # privateKey: PATH/TO/KEY # 可选, password和privateKey二者需有其一
  readyTimeout: 10000 # 可选, SSH握手等待时间

transport: # 传输设置
  remotePath: ~/pi-sync # 可选, 默认为$HOME下的同名文件夹
  localPath: ~/my-git/pi-sync # 可选, 默认为当前文件夹
  execBefore: 'npm install' # 可选, 在传输前执行的命令
  execAfter: 'npm run build' # 可选, 在传输后执行的命令
  polling: 1500 # 可选, 为了提高传输效率，在 --watch 模式下，程序会在文件改动发生后暂存改动，等待一段时间后一并上传, 默认为1500ms
  safeMode: false # 可选, 使用安全模式上传，速度较慢(大约是普通模式的5倍耗时)，在有大量改动需要一次性上传时推荐使用，默认为 false

ignore: # 可选, 忽略文件, 追加忽略.gitignore未提及的文件
  - readme.md

include: # 可选, 包含文件, 追加包含被.gitignore忽略的文件
  - IM-IN-GITIGNORE.yml
```

## 示例
一次性同步本地的 `pi-sync` 到单片机 `pi@192.168.3.86:22` 上的 `/home/pi/Documents/pi-sync` ，使用安全模式。
![Sample Usage](https://cdn.rawgit.com/jerrywdlee/pi-sync/c128932c/assets/pi-sync_demo_1.gif "Sample Usage")

监视本地 `pi-sync` 的改动并按照 `pi-sync.conf.yml` 的规则同步更改.
![Sample Usage](https://cdn.rawgit.com/jerrywdlee/pi-sync/c128932c/assets/pi-sync_demo_2.gif "Sample Usage")

希望对大家有所帮助。


