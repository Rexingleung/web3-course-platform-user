import { ReactNode, useEffect } from 'react';
import { useWalletStore } from 'wtf-lll-wallet';
import useContractStore from '../stores/contractStore';

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const { updateWalletState, setWallet } = useWalletStore();
  const { initializeContract } = useContractStore();

  useEffect(() => {
    // 检查是否已经连接
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(async (accounts: string[]) => {
          if (accounts.length > 0) {
            const address = accounts[0];
            // 使用新的 API 更新钱包状态
            await updateWalletState(address);
            await initializeContract();
          }
        })
        .catch(console.error);
    }
  }, [updateWalletState, initializeContract]);

  return <>{children}</>;
}
