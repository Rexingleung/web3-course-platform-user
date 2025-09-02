import { ReactNode, useEffect } from 'react';
import useWalletStore from '../stores/walletStore';
import useContractStore from '../stores/contractStore';

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const { updateBalance } = useWalletStore();
  const { initializeContract } = useContractStore();

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            useWalletStore.setState({ 
              account: accounts[0], 
              isConnected: true 
            });
            updateBalance();
            initializeContract();
          }
        })
        .catch(console.error);
    }
  }, [updateBalance, initializeContract]);

  return <>{children}</>;
}
