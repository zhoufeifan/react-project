## 项目日常维护手册  
### 常用命令
- 安装依赖
```
npm install
//安装全局依赖,（如已经安装，这忽略此步）这个包大概有200多M建议空闲时安装
npm i -g nw@0.14.7-sdk
```
- 启动项目
```
npm run dev 编译代码 server listen at localhost:3000
//打开另一个终端
npm run nw-dev //打开nw应用(dev模式)
npm run nw-start //打开nw应用（product模式）
```
- 暴露脚手架内部配置
```
npm run eject
这步已经完成，无需在重复构建
```
- 发布项目
```
npm run daily 发布日常
npm run online 发布上线
``` 

### 目录解说
- public 放一些公用的资源，不会参与编译
- assets 放置项目的静态资源，例如图片、字体、svg
- common 放置一些公共的样式以及scss用到的mixin
- components 放置react 公共的组件
- pages 放置页面
- utils 工具类js
- config 脚手架的配置文件，默认是没有的，由 "npm run eject 生成"
- script 自带的编译脚本
- registerServiceWorker.js 脚手架自带

### 注意要点  
- 项目配置了node-sass-chokidar 支持scss
```
//但是要注意的是项目中引入的方式还是css,项目中的css是scss生成的编译文件，
//因此需要ignored掉,不要问为什么就是这样
import './Sign.css';//其实样式的原文件叫做Sign.scss
```

- 自带了postCss 会对样式自动加上前缀

- 项目配置了flow 对代码在编译之前做了错误检查  
```
//配置方式：在Sign.js 的首行加上// @flow  
// @flow
import React, { Component } from 'react';
....
```
- 项目配置了路由 只需在routers中添加路由即可
```
import React from 'react';
import Sign from './pages/Sign.js';
import Sign1 from './pages/Sign1.js';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
const Routes = (props) =>(
    <Router {...props}>
        <Route  path="/" component={Sign}>
            <Route path="/sign1" component={Sign1}/>
        </Route>
    </Router>
);
export default Routes;
```
- 图片的引入
```
//通常情况下用的是import 的方式引入，10kb以内的都会以base64的形式返回(可以在config目录下的webpack配置文件中进行配置)，

```
- 项目框架用了ant.design,详细资料请参照[官方文档](https://ant.design/docs/react/introduce-cn)

- 该脚手架用的是create-react-app搭建的,详细的资料请参考 [官方文档](https://github.com/facebookincubator/create-react-app)

