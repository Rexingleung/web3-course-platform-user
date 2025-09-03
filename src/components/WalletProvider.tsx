import { ReactNode, useEffect } from 'react';
import useWalletStore from '../stores/walletStore';
import useContractStore from '../stores/contractStore';

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const { address, updateWalletInfo } = useWalletStore();
  const { initializeContract } = useContractStore();

  useEffect(() => {
    // 检查是否已经连接钱包
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(async (accounts: string[]) => {
          if (accounts.length > 0) {
            // 如果已经连接，更新钱包信息
            await updateWalletInfo();
            await initializeContract();
          }
        })
        .catch(console.error);
    }
  }, [updateWalletInfo, initializeContract]);

  // 当钱包地址变化时，重新初始化合约
  useEffect(() => {
    if (address) {
      initializeContract();
    }
  }, [address, initializeContract]);

  return <>{children}</>;
}
