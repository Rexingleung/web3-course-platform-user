export interface Course {
  id?: number;
  courseId: number;
  title: string;
  description: string;
  author: string;
  price: string;
  createdAt: number;
  updatedAt?: string;
}

export interface Purchase {
  id?: number;
  courseId: number;
  buyer: string;
  price: string;
  transactionHash?: string;
  purchasedAt?: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  price: string;
}

export interface WalletState {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  updateBalance: () => Promise<void>;
}

export interface ContractState {
  contract: any;
  provider: any;
  signer: any;
  isInitialized: boolean;
  initializeContract: () => Promise<void>;
  createCourse: (title: string, description: string, price: string) => Promise<any>;
  purchaseCourse: (courseId: number, price: string) => Promise<any>;
  getCourse: (courseId: number) => Promise<Course>;
  getUserPurchasedCourses: (userAddress: string) => Promise<number[]>;
  hasUserPurchasedCourse: (courseId: number, userAddress: string) => Promise<boolean>;
}

// Global window type extensions
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}