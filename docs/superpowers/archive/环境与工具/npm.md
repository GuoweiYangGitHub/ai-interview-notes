# npm
> 清除缓存、查看全局命令、切换镜像源与发布 npm 包。

## 清除 npm 缓存

```bash
npm cache clean --force
```

## 全局命令查看

```bash
npm list --depth=0 -global
```

## npm 源

```bash
// 临时使用淘宝源
npm i --registry https://registry.npm.taobao.org
// 配置使用淘宝镜像源
npm config set registry https://registry.npm.taobao.org
// 配置恢复官方镜像源
npm config set registry https://registry.npmjs.org
// node-sass 使用淘宝镜像
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
```

## 发布 npm 包

```bash
// 注册 npm 官网账号
npm adduser
// 登录 npm 账号
npm login
// 测试 npm 包
npm link
// 发布 npm 包（需要提高 package.json 里的版本号，并切换到 npm 官方源）
npm publish
```

> Node 版本切换见 [nvm](/90-附录/环境与工具/nvm)。
