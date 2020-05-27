# NodeCrawler

Node.js 项目，管理一些爬虫小程序

# 1、git clone

# 2、npm install

# 3、npm test(启动一个热重载的应用)

# 4、npm start

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
