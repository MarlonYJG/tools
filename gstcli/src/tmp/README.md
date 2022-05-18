# GST
> 公共资源交易大数据分析平台

## Build Setup

``` bash
# install dependencies
npm install 

# serve with hot reload at localhost:8080
npm run dev

# build for production and view the bundle analyzer report
npm run build --report

# run system
npm run build-system

# run system code
npm run build-system --systemCode
```

***
__本地启动 — FAQ__
1. Node 版本
    + v10.16.0
        - https://nodejs.org/download/release/v10.16.0/
        - 较高版本会造成依赖包不兼容问题。
2. 栈溢出
    + 由于本地启动是启动所有系统、所有模块，Node默认分配的内存可能不足，建议进行扩容。
    + 执行以下命令：
        - npm install increase-memory-limit
        - npm run fix-memory-limit
3. node --max-old-space-size
    + 当出现```“node --max-old-space-size=6096” 不是内部或外部命令，也不是可运行的程序或批处理文件。```时，尝试以下操作：
        - 将本项目下node_modules/.bin/下的```webpack-dev-server.cmd```和```webpack.cmd```中的```"%_prog%"```改为```%_prog%```即可(如果还不行，则继续进行下面操作)。
        - 将本项目下node_modules/.bin/下的所有.cmd文件中的```"%_prog%"```改为```%_prog%```即可。
4. 依赖安装报错
    + 当出现依赖安装报错时，建议将镜像改为 cnpm 再次进行尝试(先彻底清除之前安装过的node_modules)。
        - cnpm install
5. **本地启动成功后,如何访问对应的平台(系统) ?**
    + 配置系统参数 (该参数决定可访问的系统)
        + 文件路径
            + ```gst\src\config\system.config.js```
        + 配置规则
        
            | 系统                       | PLATFORM(平台名称) | PROJECTKEY(系统名称) |
            | -------------------------- | ------------------ | -------------------- |
            | 标准产品(探索、洞察、研究) | sp                 | sp                   |
            | 数据中台(矩阵)             | dmp                | dmp                  |
            | 业务中台(魔方)             | gbc                | gbc                  |
            | 管理中心                   | cfg                | control-center       |
            | 控制台                     | cfg                | console              |
           
        + 示例
            ```js
            /** 访问-标准产品 */ 
            let PLATFORM = 'sp';// 平台名称
            let PROJECTKEY = 'sp'; // 系统名

            /** 访问-控制台 */ 
            let PLATFORM = 'cfg';// 平台名称
            let PROJECTKEY = 'console'; // 系统名
            ```

6. 其他问题
    + 百度

***

## 测试环境

``` bash
# 登录：login
npm run test-login

# 数据中台：dmp
npm run test-dmp

# 业务中台：gbc
npm run test-gbc

# 标准产品：sp
npm run test-sp

# 控制台：console
npm run test-console

# 管理中心：control-center
npm run test-control-center

# API网关：gateway
npm run test-gateway
```


## 线上环境

``` bash
# 登录：login
npm run build-login

# 数据中台：dmp
npm run build-dmp

# 业务中台：gbc
npm run build-gbc

# 标准产品：sp
npm run build-sp

# 控制台：console
npm run build-console

# 管理中心：control-center
npm run build-control-center

# API网关：gateway
npm run build-gateway
```

## 自定义环境

``` bash
# 登录
npm run local-login

# 数据中台：dmp
npm run local-dmp

# 业务中台：gbc
npm run local-gbc

# 标准产品：sp
npm run local-sp

# 控制台：console
npm run local-console

# 管理中心：control-center
npm run local-control-center

# API网关：gateway
npm run local-gateway
```
## 深圳：网关(gateway)专属

``` bash
# 网关：gateway
npm run build-gateway -- SZWG
```
## 项目组：标准产品(所有环境)

``` bash
# 标准产品：sp
npm run <command> [-- <args>]
npm run sp -- 对应项目的角色编码
```
