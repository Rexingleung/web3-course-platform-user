import { useState, useEffect } from 'react';
import { ChevronDown, Wallet, LogOut, RefreshCw, Copy, ExternalLink, Settings } from 'lucide-react';
import useWalletStore from '../stores/walletStore';
import { SupportedNetworks } from '../types';
import { getNetworkName, getNetworkSymbol } from '../utils/networks';
import toast from 'react-hot-toast';

export function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  
  const {
    address,
    balance,
    isConnected,
    isConnecting,
    networkId,
    ensName,
    ensAvatar,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    updateWalletInfo,
  } = useWalletStore();

  // 格式化地址显示
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // 格式化余额显示
  const formatBalance = (bal: string) => {
    const num = parseFloat(bal);
    if (num === 0) return '0';
    return num.toFixed(4);
  };

  // 复制地址到剪贴板
  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        toast.success('地址已复制');
      } catch (error) {
        toast.error('复制失败');
      }
    }
  };

  // 打开区块浏览器
  const openBlockExplorer = () => {
    if (address && networkId) {
      const baseUrl = networkId === SupportedNetworks.ETHEREUM_MAINNET 
        ? 'https://etherscan.io'
        : 'https://sepolia.etherscan.io';
      window.open(`${baseUrl}/address/${address}`, '_blank');
    }
  };

  // 刷新钱包信息
  const refreshWallet = async () => {
    await updateWalletInfo();
    toast.success('钱包信息已更新');
  };

  // 关闭下拉菜单当点击外部时
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
      setShowNetworkMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="bg-black bg-opacity-20 backdrop-blur-md border-b border-white border-opacity-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">W3</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Web3 课程平台</h1>
            <p className="text-sm text-gray-300">区块链技术学习平台</p>
          </div>
        </div>

        {/* Wallet Section */}
        <div className="flex items-center gap-4">
          {/* Network Selector */}
          {isConnected && (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowNetworkMenu(!showNetworkMenu)}
                className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg text-white transition-all duration-200"
              >
                <div className={`w-2 h-2 rounded-full ${
                  networkId === SupportedNetworks.ETHEREUM_MAINNET ? 'bg-green-400' : 'bg-orange-400'
                }`} />
                <span className="text-sm">
                  {networkId ? getNetworkName(networkId) : 'Unknown Network'}
                </span>
                <ChevronDown size={16} className={`transform transition-transform ${
                  showNetworkMenu ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Network Dropdown */}
              {showNetworkMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-xl border border-white border-opacity-20 overflow-hidden z-50">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        switchNetwork(SupportedNetworks.ETHEREUM_MAINNET);
                        setShowNetworkMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 ${
                        networkId === SupportedNetworks.ETHEREUM_MAINNET ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <div>
                        <div className="font-medium">Ethereum 主网</div>
                        <div className="text-xs text-gray-500">生产环境</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        switchNetwork(SupportedNetworks.ETHEREUM_SEPOLIA);
                        setShowNetworkMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 ${
                        networkId === SupportedNetworks.ETHEREUM_SEPOLIA ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-orange-400" />
                      <div>
                        <div className="font-medium">Sepolia 测试网</div>
                        <div className="text-xs text-gray-500">测试环境</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Wallet Button/Info */}
          {!isConnected ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Wallet size={18} />
              )}
              {isConnecting ? '连接中...' : '连接钱包'}
            </button>
          ) : (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-4 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl text-white transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  {/* ENS头像或默认头像 */}
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center">
                    {ensAvatar ? (
                      <img src={ensAvatar} alt="ENS Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold">
                        {address ? address.slice(2, 4).toUpperCase() : 'W'}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-left">
                    <div className="text-sm font-medium">
                      {ensName || (address ? formatAddress(address) : '')}
                    </div>
                    <div className="text-xs text-gray-300">
                      {formatBalance(balance)} {networkId ? getNetworkSymbol(networkId) : 'ETH'}
                    </div>
                  </div>
                </div>
                <ChevronDown size={16} className={`transform transition-transform ${
                  showDropdown ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Wallet Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-xl border border-white border-opacity-20 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center">
                        {ensAvatar ? (
                          <img src={ensAvatar} alt="ENS Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-bold text-white">
                            {address ? address.slice(2, 4).toUpperCase() : 'W'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-900 font-medium">
                          {ensName || '钱包地址'}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {address ? formatAddress(address) : ''}
                        </div>
                      </div>
                    </div>
                    
                    {/* 余额信息 */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600 mb-1">余额</div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatBalance(balance)} {networkId ? getNetworkSymbol(networkId) : 'ETH'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        网络: {networkId ? getNetworkName(networkId) : '未知网络'}
                      </div>
                    </div>

                    {/* ENS信息 */}
                    {ensName && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-600 mb-1">ENS 域名</div>
                        <div className="text-blue-900 font-medium">{ensName}</div>
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="p-2">
                    <button
                      onClick={copyAddress}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-lg flex items-center gap-3 text-gray-700 transition-colors"
                    >
                      <Copy size={18} />
                      <span>复制地址</span>
                    </button>
                    
                    <button
                      onClick={openBlockExplorer}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-lg flex items-center gap-3 text-gray-700 transition-colors"
                    >
                      <ExternalLink size={18} />
                      <span>在区块浏览器中查看</span>
                    </button>
                    
                    <button
                      onClick={refreshWallet}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-lg flex items-center gap-3 text-gray-700 transition-colors"
                    >
                      <RefreshCw size={18} />
                      <span>刷新钱包信息</span>
                    </button>
                    
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={() => {
                          disconnectWallet();
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 rounded-lg flex items-center gap-3 text-red-600 transition-colors"
                      >
                        <LogOut size={18} />
                        <span>断开连接</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
