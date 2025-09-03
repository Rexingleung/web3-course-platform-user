import { NetworkConfig, SupportedNetworks } from '../types';

export const NETWORK_CONFIGS: Record<string, NetworkConfig> = {
  [SupportedNetworks.ETHEREUM_MAINNET]: {
    chainId: SupportedNetworks.ETHEREUM_MAINNET,
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/YOUR_PROJECT_ID', 'https://eth-mainnet.public.blastapi.io'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  [SupportedNetworks.ETHEREUM_SEPOLIA]: {
    chainId: SupportedNetworks.ETHEREUM_SEPOLIA,
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
      name: 'Sepolia Ethereum',
      symbol: 'SepoliaETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.infura.io/v3/YOUR_PROJECT_ID', 'https://ethereum-sepolia.publicnode.com'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
};

export const getNetworkName = (chainId: string): string => {
  const network = NETWORK_CONFIGS[chainId];
  return network ? network.chainName : 'Unknown Network';
};

export const getNetworkSymbol = (chainId: string): string => {
  const network = NETWORK_CONFIGS[chainId];
  return network ? network.nativeCurrency.symbol : 'ETH';
};

export const isNetworkSupported = (chainId: string): boolean => {
  return chainId in NETWORK_CONFIGS;
};
