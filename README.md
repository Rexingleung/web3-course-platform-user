# Web3 课程平台用户端 - 自定义钱包头部组件

## 🚀 最新更新

### 移除 wtf-lll-wallet 包并实现自定义钱包组件

本次更新完全移除了对 `wtf-lll-wallet` 包的依赖，并实现了一个功能更强大的自定义钱包头部组件。

## ✨ 新功能

### 🔗 网络切换支持
- ✅ **Ethereum 主网** (0x1) - 生产环境
- ✅ **Sepolia 测试网** (0xaa36a7) - 测试环境
- 🔄 一键切换网络
- 🟢 网络状态实时显示

### 👤 ENS 集成
- 🏷️ 自动解析 ENS 域名
- 🖼️ 显示 ENS 头像
- 🔍 主网 ENS 查询支持

### 💳 钱包功能
- 🔌 MetaMask 连接/断开
- 💰 实时余额显示
- 📋 一键复制地址
- 🔗 区块浏览器链接
- 🔄 钱包信息刷新

## 📁 项目结构更新

```
src/
├── components/
│   ├── Header.tsx              # 🆕 自定义钱包头部组件
│   ├── WalletProvider.tsx      # 🔄 更新的钱包提供者
│   ├── CourseMarketplace.tsx   # 🔄 更新为使用新钱包存储
│   └── PurchasedCourses.tsx    # 🔄 更新为使用新钱包存储
├── stores/
│   ├── walletStore.ts          # 🆕 自定义钱包状态管理
│   └── contractStore.ts        # 🔄 更新为兼容新钱包接口
├── types/
│   └── index.ts               # 🆕 新增钱包和网络类型定义
├── utils/
│   └── networks.ts            # 🆕 网络配置和工具函数
└── services/
    └── api.ts                 # 📦 保持现有API服务
```

## 🔧 技术实现

### 钱包状态管理
使用 Zustand 实现轻量级状态管理：

```typescript
interface WalletStore {
  // 状态
  address: string | null;
  balance: string;
  isConnected: boolean;
  networkId: string | null;
  ensName: string | null;
  ensAvatar: string | null;
  
  // 操作
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: string) => Promise<void>;
  updateWalletInfo: () => Promise<void>;
  getENSInfo: (address: string) => Promise<ENSInfo>;
}
```

### 网络配置
支持多网络配置：

```typescript
export const NETWORK_CONFIGS = {
  '0x1': {
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://eth-mainnet.public.blastapi.io'],
    blockExplorerUrls: ['https://etherscan.io']
  },
  '0xaa36a7': {
    chainName: 'Sepolia Test Network',
    nativeCurrency: { symbol: 'SepoliaETH', decimals: 18 },
    rpcUrls: ['https://ethereum-sepolia.publicnode.com'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  }
};
```

## 🎨 UI/UX 特色

### 现代化设计
- 🌈 渐变背景和毛玻璃效果
- ✨ 流畅的动画过渡
- 📱 响应式设计
- 🌙 深色主题

### 交互体验
- 🖱️ 悬停效果
- 🎯 直观的网络状态指示器
- 📍 下拉菜单自动定位
- 🔔 操作反馈提示

### 头部组件功能
- 🎨 品牌 Logo 和标题
- 🔗 网络选择器（主网/测试网）
- 👛 钱包连接按钮
- 👤 用户信息面板
- 📋 快捷操作菜单

## 🚀 使用方法

### 安装依赖
```bash
# 移除旧包
pnpm remove wtf-lll-wallet

# 安装现有依赖
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

### 连接钱包
1. 点击右上角"连接钱包"按钮
2. 在 MetaMask 中确认连接
3. 自动检测网络并显示余额
4. 可通过网络选择器切换网络

### 网络切换
1. 点击网络选择器
2. 选择目标网络（主网/测试网）
3. 在 MetaMask 中确认切换
4. 自动更新余额和网络状态

## 🔐 安全特性

- ✅ 只读钱包信息访问
- ✅ 用户主动授权连接
- ✅ 网络切换需用户确认
- ✅ 地址格式化显示
- ✅ 错误处理和用户提示

## 🌐 ENS 支持

- 🔍 自动解析 ENS 域名
- 🖼️ 获取和显示 ENS 头像
- 🌐 仅在主网查询（优化性能）
- 🔄 缓存机制（减少查询次数）

## 🔧 自定义配置

### 添加新网络
在 `src/utils/networks.ts` 中添加新网络配置：

```typescript
export const NETWORK_CONFIGS = {
  // 现有网络...
  '0x89': {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    // ... 其他配置
  }
};
```

### 修改样式
所有样式使用 Tailwind CSS，可在组件中直接修改类名。

## 📝 更新日志

### v2.0.0 (当前)
- ❌ 移除 wtf-lll-wallet 依赖
- ✅ 实现自定义钱包头部组件
- ✅ 添加网络切换功能（主网/测试网）
- ✅ 集成 ENS 域名和头像
- ✅ 优化用户体验和界面设计
- ✅ 改进错误处理和提示信息

### v1.x.x (之前)
- 使用 wtf-lll-wallet 包
- 基础钱包连接功能

## 🐛 已知问题

- ENS 头像加载可能较慢（依赖网络）
- 某些 ENS 域名可能无头像
- 网络切换需要用户在 MetaMask 中确认

## 🔮 未来计划

- [ ] 支持更多网络（Polygon、BSC 等）
- [ ] 添加钱包历史记录
- [ ] 实现多钱包支持
- [ ] 优化 ENS 查询性能
- [ ] 添加更多钱包提供者（WalletConnect 等）

---

🎉 **恭喜！** 你已经成功移除了 wtf-lll-wallet 依赖，现在拥有了一个功能更强大、界面更美观的自定义钱包组件！
