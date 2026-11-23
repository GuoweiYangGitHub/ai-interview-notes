# macOS
> macOS 快捷键、常用命令与前端环境常见问题。

## 快捷键

```text
command + shift + .  显示隐藏文件
Command + ↑          返回上一级目录
command + ↓          进入下一级目录

command + w          关闭窗口
command + n          开启一个新窗口

shift + command + o  快速打开文稿
shift + command + d  快速打开桌面文件夹

command + delete     删除当前文件（移至废纸篓）
Command-Shift-N      新建文件夹
Command-Option-V     剪切文件

command + R          刷新浏览器
command + shift + R  强制刷新浏览器
```

## 查看公网 IP

```bash
curl ifconfig.me   # mac 获取本机公网 IP
curl ipconfig.me   # windows 获取本机公网 IP
```

## 端口占用

```bash
sudo lsof -i tcp:端口号   # 查看端口是否被占用
sudo kill -pid号          # 杀死当前端口的进程
```

## 给全局 shell 命令起别名

```bash
# 1. 编辑 bash_profile 文件
nano ~/.bash_profile

# 2. 写入别名，例如 myalias
alias myalias="sh /path/to/your/script/mycommand.sh"

# 3. ctrl + o 并按 enter 保存更改

# 4. source ~/.bash_profile
```

## 让已损坏的文件正常使用

```bash
sudo xattr -r -d com.apple.quarantine app地址

# 例如：
sudo xattr -r -d com.apple.quarantine /Applications/PicGo.app
```

## 前端常见问题

### node_modules 依赖包下载不下来

清除 npm 缓存：

```bash
npm cache clean --force
```

### 拷贝别人的 node_modules 的时候代码提交不了

报错：

```text
git commit 时一直报 .git/hooks/pre-commit: No such file or directory
```

执行下面命令即可解决：

```bash
npx husky install
```

### node-sass 问题

开始的时候 node-sass 版本为 v4.14，当前版本不支持 Mac AMD 芯片，需要升级 sass 版本。详情见 [node-sass#3033](https://github.com/sass/node-sass/issues/3033)。

解决办法：使用 dart-sass 代替 node-sass。

1. 删除原来的 node-sass：`npm uninstall node-sass`。
2. 下载 dart-sass：`npm install sass`。
3. 启动时 sass 变量可能会报错，将 `$--变量名` 全局修改为 `$变量名`；`/deep/` 会报错，全局修改为 `::v-deep`，重新启动即可。

### 使用的 vue-cli 版本太低，使用 Vue 官方推荐桥接工具

- [vue-cli 官网](https://cli.vuejs.org/guide/creating-a-project.html#using-the-gui)

```bash
npm install -g @vue/cli-init
# vue init now works exactly the same as vue-cli@2.x
```

### 别人已经删除的远程分支，本地还能看到

```bash
git remote prune origin
```

### Mac 全局命令

```bash
sudo npm -g vue/cli
```

### Vue.js 在 Mac 下 `npm run serve` 报错 `Permission denied`

在项目目录中找到 `node_modules/.bin/vue-cli-service`，执行：

```bash
chmod 777 /User/yangguowei/文件名/node_modules/.bin/vue-cli-service
# 文件目录路径根据文件所放位置调整
```

```bash
npm install babel-eslint --save-dev
```

### 证书无效的问题

```text
Apple Worldwide Developer Relations Certification Authority
```

### Mac 下载 `gh` 命令

`gh` 是命令行上的 GitHub，将拉取请求、Issue 和其他 GitHub 概念带到终端里的 `git` 和代码旁边。

```bash
# 如果安装出错，多安装几次即可；有时候会报 404，它会转到另一个地址继续下载 gh
brew install github/gh/gh
```

### 查看所有 Node 版本

```bash
npm view node versions
```

## 使用 nrm 管理镜像源仓库

```bash
nrm -V 查看版本信息
nrm ls 查看所有的镜像源仓库
nrm current 显示当前源名称

// cnpm --------- https://r.cnpmjs.org/
// taobao ------- https://registry.npmmirror.com/

nrm use taobao 使用这个仓库镜像地址
nrm add <registry> <url> [home] 添加一个源
nrm test [registry] 测试源速度
```

## 使用 nvm 管理 Node 版本

见 [nvm](/90-附录/环境与工具/nvm)。

## 常用命令

```text
pwd    当前工作目录
mkdir  新建文件夹
open   当前文件
```
