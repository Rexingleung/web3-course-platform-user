// 网络配置类型
export interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
}

// 钱包状态接口
export interface WalletState {
  address: string | null;
  balance: string;
  isConnected: boolean;
  isConnecting: boolean;
  networkId: string | null;
  ensName: string | null;
  ensAvatar: string | null;
}

// 钱包操作接口
export interface WalletActions {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: string) => Promise<void>;
  updateWalletInfo: () => Promise<void>;
  getENSInfo: (address: string) => Promise<{ name: string | null; avatar: string | null }>;
}

// 完整的钱包 Store 接口
export interface WalletStore extends WalletState, WalletActions {}

// 支持的网络枚举
export enum SupportedNetworks {
  ETHEREUM_MAINNET = '0x1',
  ETHEREUM_SEPOLIA = '0xaa36a7'
}

// 课程相关类型（保持现有的）
export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  price: string;
  originalPrice?: string;
  discount?: number;
  rating: number;
  studentsCount: number;
  image: string;
  category: string;
  isPurchased?: boolean;
  completionPercentage?: number;
}

export interface PurchasedCourse extends Course {
  purchaseDate: Date;
  progress: number;
  lastAccessed: Date;
  certificateEarned: boolean;
}

// 合约相关类型（保持现有的）
export interface ContractState {
  contract: any;
  isLoading: boolean;
  error: string | null;
}

export interface ContractActions {
  initializeContract: () => Promise<void>;
  purchaseCourse: (courseId: number) => Promise<void>;
  getPurchasedCourses: () => Promise<Course[]>;
}

export interface ContractStore extends ContractState, ContractActions {}
