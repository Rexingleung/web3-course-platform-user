import { ethers } from 'ethers';

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatEther(wei: string): string {
  try {
    return parseFloat(ethers.formatEther(wei)).toFixed(4);
  } catch (error) {
    return '0.0000';
  }
}

export function parseEther(ether: string): string {
  try {
    return ethers.parseEther(ether).toString();
  } catch (error) {
    return '0';
  }
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
