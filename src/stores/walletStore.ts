// 重新导出 wtf-lll-wallet 的状态管理，保持向后兼容
import { useWalletStore as useWtfWalletStore } from 'wtf-lll-wallet';
import { create } from 'zustand';

// 创建兼容层，将新的状态映射到旧的接口
const useWalletStore = create(() => ({}));

// 重新导出，提供兼容接口
export default function useCompatibleWalletStore() {
  const wtfStore = useWtfWalletStore();
  
  return {
    // 映射字段名以保持兼容性
    account: wtfStore.address,
    isConnected: wtfStore.isConnected,
    isConnecting: false, // wtf-lll-wallet 没有这个状态，默认为 false
    balance: wtfStore.balance,
    
    // 映射方法
    connectWallet: wtfStore.connectWallet,
    disconnectWallet: wtfStore.disconnectWallet,
    updateBalance: () => {
      if (wtfStore.address) {
        return wtfStore.updateWalletState(wtfStore.address);
      }
      return Promise.resolve();
    },
    
    // 暴露新的功能
    switchNetwork: wtfStore.switchNetwork,
    formatAddress: wtfStore.formatAddress,
    formatBalance: wtfStore.formatBalance,
    getCurrentNetwork: wtfStore.getCurrentNetwork,
    isMetaMaskInstalled: wtfStore.isMetaMaskInstalled,
  };
}
