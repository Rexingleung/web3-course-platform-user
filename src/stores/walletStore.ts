import { create } from 'zustand';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { WalletState } from '../types';

const useWalletStore = create<WalletState>((set, get) => ({
  account: null,
  isConnected: false,
  isConnecting: false,
  balance: '0',

  connectWallet: async () => {
    if (!window.ethereum) {
      toast.error('请安装 MetaMask 钱包');
      return;
    }

    set({ isConnecting: true });

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const account = accounts[0];
        set({ 
          account, 
          isConnected: true,
          isConnecting: false 
        });
        
        // Update balance
        get().updateBalance();
        
        toast.success('钱包连接成功');
      }
    } catch (error: any) {
      console.error('连接钱包失败:', error);
      toast.error(error.message || '连接钱包失败');
      set({ isConnecting: false });
    }
  },

  disconnectWallet: () => {
    set({
      account: null,
      isConnected: false,
      balance: '0'
    });
    toast.success('钱包已断开连接');
  },

  updateBalance: async () => {
    const { account } = get();
    if (!account || !window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(account);
      set({ balance: ethers.formatEther(balance) });
    } catch (error) {
      console.error('获取余额失败:', error);
    }
  },
}));

// Listen for account changes
if (typeof window !== 'undefined' && window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts: string[]) => {
    const { connectWallet, disconnectWallet } = useWalletStore.getState();
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      useWalletStore.setState({ 
        account: accounts[0], 
        isConnected: true 
      });
      useWalletStore.getState().updateBalance();
    }
  });

  window.ethereum.on('chainChanged', () => {
    window.location.reload();
  });
}

export default useWalletStore;
