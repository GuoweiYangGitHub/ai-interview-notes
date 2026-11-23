# SSH 配置
> 生成 SSH Key、配置 GitHub/GitLab 多账号与测试连通性。

## 配置 SSH

### 创建 SSH Key

```bash
# ssh-keygen -t rsa -C 邮箱名 -f ~/.ssh/秘钥名称

# 一般秘钥名称用下划线拼接，例如 id_rsa_gitlab_chiefclouds
```

### 找到 `.ssh` 文件夹

- Windows 电脑在 `C:\User\当前用户名\`。
- Mac 电脑打开 Finder，找到系统盘 `用户\用户名\.ssh`。
  - 也可以直接通过命令找到：`cd ~/.ssh`。

### 配置 GitHub 或 GitLab 的 SSH

找到 GitLab 的设置 → SSH，将公钥（`.pub` 后缀）内容粘贴上，然后点击 `Add SSH Key`。

## 配置多个 SSH

需要在 `.ssh` 目录下面新建 `config` 文件，写入自己所需的配置。

```text
# github  GuoweiYang
HOST github.com # 主机
HostName github.com # 主机名
User 515798783@qq.com # 用户
IdentityFile ~/.ssh/id_rsa_github_guoweiyang # 使用的秘钥

# github  blake
HOST github.com
HostName github.com
User blakeyang0707@gmail.com
IdentityFile ~/.ssh/id_rsa_github_blakeyang

# gitee
HOST gitee.com
HostName gitee.com
User 515798783@qq.com
IdentityFile ~/.ssh/id_rsa_gitee_bloke

# gitLab chiefclouds
HOST gitlab.chiefclouds.cn
HostName gitlab.chiefclouds.cn
User guowei.yang@chiefclouds.com
IdentityFile ~/.ssh/id_rsa_gitlab_chiefclouds

# gitLab carlsberg
HOST cn-gitlab.carlsberg.asia
HostName cn-gitlab.carlsberg.asia
User guowei.yang@chiefclouds.com
IdentityFile ~/.ssh/id_rsa_gitlab_carlsberg
```

## 测试服务是否通

```bash
# ssh -T git@github.com
# ssh -T git@gitee.com

# ssh -T git@gitlab域名
# ssh -T git@gitlab.chiefclouds.cn
```

输出：

```text
Welcome to GitLab, your name!
```

则说明成功了。

> 其他 Git 操作见 [Git 本地操作](/90-附录/环境与工具/Git/本地操作)、[Git 远程操作](/90-附录/环境与工具/Git/远程操作)、[Git 常用命令](/90-附录/环境与工具/Git/常用命令)。
