# Web3 Course Platform - User Frontend

基于区块链的课程平台用户端，使用 React + TypeScript + Vite + Tailwind CSS 构建。

## 功能特性

- 🛒 **课程市场** - 浏览和购买课程
- 📚 **已购课程** - 查看已购买的课程
- 💰 **Web3 钱包集成** - MetaMask 钱包连接
- 🔗 **智能合约交互** - 直接与合约交互购买课程
- 🎨 **现代UI设计** - 玻璃质感的响应式界面

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (状态管理)
- Ethers.js (Web3)
- Lucide React (图标)
- React Hot Toast (通知)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3002 启动

### 3. 构建生产版本

```bash
npm run build
npm run preview
```

## 项目结构

```
src/
├── components/          # React 组件
│   ├── Header.tsx       # 头部组件（钱包连接）
│   ├── CourseMarketplace.tsx  # 课程市场
│   ├── PurchasedCourses.tsx   # 已购课程
│   └── WalletProvider.tsx     # 钱包提供者
├── stores/             # Zustand 状态管理
│   ├── walletStore.ts  # 钱包状态
│   └── contractStore.ts # 合约交互
├── services/           # API 服务
│   └── api.ts         # 后端 API 调用
├── utils/             # 工具函数
│   ├── constants.ts   # 常量配置
│   └── format.ts      # 格式化工具
├── types/             # TypeScript 类型
│   └── index.ts
├── App.tsx            # 主应用组件
├── main.tsx           # 应用入口
└── index.css          # 全局样式
```

## 主要组件

### CourseMarketplace
- 展示所有可用课程
- 支持课程购买功能
- 显示购买状态
- 过滤用户自己的课程

### PurchasedCourses  
- 显示用户已购买的课程
- 提供学习入口
- 显示购买详情

### Header
- 钱包连接/断开
- 显示账户信息和余额
- 响应钱包状态变化

## 智能合约集成

应用通过 ethers.js 与部署的智能合约交互：

- 合约地址：`0xdDD30BD07C402eE78079c35A7DE2F9232ed54Aa4`
- 支持功能：
  - 购买课程 (`purchaseCourse`)
  - 查询课程信息 (`getCourse`)
  - 查询用户购买记录 (`getUserPurchasedCourses`)
  - 检查购买状态 (`hasUserPurchasedCourse`)

## 状态管理

### WalletStore
- 管理钱包连接状态
- 处理账户切换
- 更新余额信息

### ContractStore  
- 智能合约初始化
- 合约方法调用
- 交易状态管理

## API 集成

与后端服务通信获取：
- 课程列表
- 用户购买记录
- 购买状态验证
- 交易记录存储

## 样式设计

采用现代玻璃拟态设计：
- 半透明玻璃效果
- 渐变背景
- 流动动画
- 响应式布局
- 深色主题

## 环境要求

- Node.js 16+
- MetaMask 浏览器扩展
- 连接到以太坊网络
- 后端 API 服务运行在 http://localhost:3001

## 开发说明

### 钱包集成
- 自动检测 MetaMask
- 监听账户和网络变化
- 处理连接错误

### 错误处理
- 友好的错误提示
- 网络异常重试
- 交易失败回滚

### 性能优化
- 组件懒加载
- 状态缓存
- 防抖处理

## 脚本命令

- `npm run dev` - 开发模式
- `npm run build` - 构建生产版本
- `npm run preview` - 预览构建结果
- `npm run lint` - 代码检查