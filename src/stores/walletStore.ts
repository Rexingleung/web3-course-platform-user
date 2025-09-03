import { create } from 'zustand';
import { ethers } from 'ethers';
import { WalletStore, SupportedNetworks } from '../types';
import { NETWORK_CONFIGS, isNetworkSupported } from '../utils/networks';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const useWalletStore = create<WalletStore>((set, get) => ({
  // 初始状态
  address: null,
  balance: '0',
  isConnected: false,
  isConnecting: false,
  networkId: null,
  ensName: null,
  ensAvatar: null,

  // 连接钱包
  connectWallet: async () => {
    if (!window.ethereum) {
      toast.error('请安装 MetaMask 钱包');
      return;
    }

    try {
      set({ isConnecting: true });

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        set({ address, isConnected: true });
        
        // 更新钱包信息
        await get().updateWalletInfo();
        
        toast.success('钱包连接成功');
      }
    } catch (error: any) {
      console.error('连接钱包失败:', error);
      toast.error('连接钱包失败: ' + error.message);
    } finally {
      set({ isConnecting: false });
    }
  },

  // 断开钱包连接
  disconnectWallet: () => {
    set({
      address: null,
      balance: '0',
      isConnected: false,
      networkId: null,
      ensName: null,
      ensAvatar: null,
    });
    toast.success('钱包已断开连接');
  },

  // 切换网络
  switchNetwork: async (chainId: string) => {
    if (!window.ethereum) {
      toast.error('请安装 MetaMask 钱包');
      return;
    }

    if (!isNetworkSupported(chainId)) {
      toast.error('不支持的网络');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
      
      // 更新本地状态
      set({ networkId: chainId });
      
      // 切换网络后更新钱包信息
      await get().updateWalletInfo();
      
      const networkConfig = NETWORK_CONFIGS[chainId];
      toast.success(`已切换到 ${networkConfig.chainName}`);
    } catch (error: any) {
      // 如果网络不存在，尝试添加
      if (error.code === 4902) {
        try {
          const networkConfig = NETWORK_CONFIGS[chainId];
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkConfig],
          });
        } catch (addError: any) {
          console.error('添加网络失败:', addError);
          toast.error('添加网络失败');
        }
      } else {
        console.error('切换网络失败:', error);
        toast.error('切换网络失败');
      }
    }
  },

  // 更新钱包信息
  updateWalletInfo: async () => {
    const { address } = get();
    if (!address || !window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // 获取余额
      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);

      // 获取网络ID
      const network = await provider.getNetwork();
      const networkId = '0x' + network.chainId.toString(16);

      // 获取ENS信息
      const { name: ensName, avatar: ensAvatar } = await get().getENSInfo(address);

      set({
        balance: balanceInEth,
        networkId,
        ensName,
        ensAvatar,
      });
    } catch (error) {
      console.error('更新钱包信息失败:', error);
    }
  },

  // 获取ENS信息
  getENSInfo: async (address: string) => {
    try {
      // 只在主网上查询ENS
      const mainnetProvider = new ethers.JsonRpcProvider('https://eth-mainnet.public.blastapi.io');
      
      const ensName = await mainnetProvider.lookupAddress(address);
      let ensAvatar = null;

      if (ensName) {
        try {
          const resolver = await mainnetProvider.getResolver(ensName);
          ensAvatar = resolver ? await resolver.getAvatar() : null;
        } catch (error) {
          console.log('获取ENS头像失败:', error);
        }
      }

      return { name: ensName, avatar: ensAvatar };
    } catch (error) {
      console.log('获取ENS信息失败:', error);
      return { name: null, avatar: null };
    }
  },
}));

// 监听账户和网络变化
if (typeof window !== 'undefined' && window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts: string[]) => {
    const { connectWallet, disconnectWallet } = useWalletStore.getState();
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      // 如果账户变化，重新连接
      connectWallet();
    }
  });

  window.ethereum.on('chainChanged', (chainId: string) => {
    const { updateWalletInfo } = useWalletStore.getState();
    useWalletStore.setState({ networkId: chainId });
    updateWalletInfo();
  });

  // 页面加载时检查是否已经连接
  window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
    if (accounts.length > 0) {
      const { connectWallet } = useWalletStore.getState();
      connectWallet();
    }
  });
}

export default useWalletStore;
