# NodeCrawler

Node.js 项目，管理一些爬虫小程序

# 1、git clone

# 2、npm install

# 3、npm test(启动一个热重载的应用)

# 4、npm start

# 效果

![](https://cdn.jsdelivr.net/gh/lightzhu/public_cdn@0.6.5/image/github/table1.png)

![](https://cdn.jsdelivr.net/gh/lightzhu/public_cdn@0.6.5/image/github/table2.png)

# 免费 VPN L2TP/IPsec 方式

![dingtalk.png](https://cdn.jsdelivr.net/gh/lightzhu/public_cdn@0.6.7/image/vpn/free-vpn.png)

# v2ray 、ssr 、ss 节点分享

![free-ss.png](https://cdn.jsdelivr.net/gh/lightzhu/public_cdn@0.6.7/image/vpn/free-ss.png)

![free-ssr.png](https://cdn.jsdelivr.net/gh/lightzhu/public_cdn@0.6.7/image/vpn/free-ssr.png)

# 交流学习钉钉群号： 31971273

# 本项目仅供交流学习使用，请准守国家相关法律法规！更新的科学上网主机勿用于违法犯罪等活动！！违反者后果自负！！！

# 科学上网配置教程

- [window 和 android 配置方式](https://www.2048888.xyz/2020/07/24/Node/vpn2/#more)
- [mac 和 ios 配置方式](https://www.2048888.xyz/2020/07/24/Node/vpn_L2TP/#more)

# 将项目部署到 openshift 上面

- 简单的部署直接浏览 catalog 选择相应的语言，next 的之后填写应用名称和项目地址就可以了
- 部署私有项目前两步同上，接着选择 advanced options 选项填写应用名称和项目地址，创建一个 New Secret（这个可以选择两种方式：密钥或者账户名加密码

# 设置开发环境

- 在 package.json 里设置对应的运行命令 export NODE_ENV='development'

# 启用服务端 gzip

- 安装并使用 koa-compress 插件

# 关于 heroku 的部署

- 安装 heroku 客户端
- heroku login
- 在已有项目的根目录执行 herku create(发现创建了一个随机 app，不想要)
- git remote -v 查看当前项目有几个远程源地址
- git remote rm heroku 删除 heroku 源
- 载创建自己想要的应用名称，herku create [appname],生成应用的 heroku git 地址
- 手动将这个源地址关联到项目上去 git remote add [源名称][源地址]
- 将项目推送到 heroku 源中，项目会自动部署

# 解决 puppeteer 库无法在 heroku 中正常启动的问题

- https://github.com/jontewks/puppeteer-heroku-buildpack

```Bash
 $ heroku buildpacks:add jontewks/puppeteer
```

- Or use the source code in this repository:

```Bash
  $ heroku buildpacks:add https://github.com/jontewks/puppeteer-heroku-buildpack.git
```

```javascript
const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox']
})
```

# 将项目部署到 gearhost（免费的小程序托管云平台）

- gearhost 里面创建一个项目
- github 上面创建一个项目
- gitclone 到本地
- 将 gearhost 里面的 LocalGit Deployments 的项目地址添加的 git 中
- git remote add websites https://${你的项目名称}.scm.gear.host/${你的项目名称}.git
- 接下来就可以往 gearhost 的地址源里 push 你的代码了
- 在 gearhost 的项目面板里面设置 node 的版本号
- 不要指定 app 的端口，优先使用 process.env.PORT

# 设置开发环境

- 在 package.json 里设置对应的运行命令 export NODE_ENV='development'

# 在 window 平台安装 puppeteer 需要设置一些 C++环境

- 首先 node-gyp 需要 Python, v3.6, v3.7, v3.8, or v3.9 任意版本
- 安装 Visual C++ Build 环境: 我是通过 Visual Studio Community 安装 "Desktop development with C++" 这个选项
- 启动 cmd,设置： npm config set msvs_version 2019(VS 的版本,看你安装情况)
- 参考<a href="https://github.com/nodejs/node-gyp#on-windows"></a>
