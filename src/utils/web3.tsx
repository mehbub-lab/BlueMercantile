import { ethers } from 'ethers';

// Dynamic environment configuration
const getEnvironmentConfig = () => {
  if (typeof window !== 'undefined') {
    // First try localStorage
    const saved = localStorage.getItem('bluemercantile_web3_config');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        if (config.contractAddress && config.rpcUrl) {
          return {
            CONTRACT_ADDRESS: config.contractAddress,
            RPC_URL: config.rpcUrl
          };
        }
      } catch (error) {
        console.error('Failed to parse saved config:', error);
      }
    }
    
    // Then try window.ENV
    if ((window as any).ENV) {
      return {
        CONTRACT_ADDRESS: (window as any).ENV.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
        RPC_URL: (window as any).ENV.NEXT_PUBLIC_RPC_URL || 'https://rpc.sepolia.org'
      };
    }
  }
  
  return {
    CONTRACT_ADDRESS: '',
    RPC_URL: 'https://rpc.sepolia.org' // Default to public Sepolia RPC
  };
};

// Environment variables (dynamically loaded)
export const CONTRACT_ADDRESS = typeof window !== 'undefined' 
  ? getEnvironmentConfig().CONTRACT_ADDRESS
  : '';

export const RPC_URL = typeof window !== 'undefined'
  ? getEnvironmentConfig().RPC_URL
  : 'https://rpc.sepolia.org';

// Sepolia testnet configuration
export const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
export const SEPOLIA_CHAIN_CONFIG = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: 'Sepolia Test Network',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.sepolia.org', 'https://1rpc.io/sepolia'],
  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
};

// BlueCarbonToken ABI (minimal ERC20-like interface)
export const BLUE_CARBON_TOKEN_ABI = [
  // Read functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  
  // Write functions
  'function transfer(address to, uint256 amount) returns (bool)',
  'function mint(address to, uint256 amount) returns (bool)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Mint(address indexed to, uint256 value)'
];

// Utility functions
export const formatEther = (value: string | number | bigint) => {
  try {
    // Handle BigInt values
    if (typeof value === 'bigint') {
      return ethers.formatEther(value);
    }
    // Handle string or number values
    return ethers.formatEther(value.toString());
  } catch (error) {
    console.error('Error formatting ether:', error, 'value:', value);
    return '0';
  }
};

export const parseEther = (value: string) => {
  return ethers.parseEther(value);
};

export const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
};

// Get current network chain ID
export const getCurrentChainId = async () => {
  if (!window.ethereum) return null;
  return await window.ethereum.request({ method: 'eth_chainId' });
};

// Switch to Sepolia network
export const switchToSepolia = async () => {
  if (!window.ethereum) return false;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SEPOLIA_CHAIN_CONFIG],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add Sepolia network:', addError);
        return false;
      }
    }
    console.error('Failed to switch to Sepolia network:', switchError);
    return false;
  }
};

// Get Web3 provider
export const getProvider = () => {
  if (!window.ethereum) return null;
  return new ethers.BrowserProvider(window.ethereum);
};

// Get contract instance
export const getContract = (provider: ethers.BrowserProvider) => {
  // Get contract address dynamically
  const getContractAddress = () => {
    if (typeof window !== 'undefined') {
      // First try localStorage
      const saved = localStorage.getItem('bluemercantile_web3_config');
      if (saved) {
        try {
          const config = JSON.parse(saved);
          if (config.contractAddress) {
            return config.contractAddress;
          }
        } catch (error) {
          console.error('Failed to parse saved config:', error);
        }
      }
      
      // Then try window.ENV
      if ((window as any).ENV?.NEXT_PUBLIC_CONTRACT_ADDRESS) {
        return (window as any).ENV.NEXT_PUBLIC_CONTRACT_ADDRESS;
      }
    }
    
    return CONTRACT_ADDRESS;
  };

  const contractAddress = getContractAddress();
  
  if (!contractAddress || contractAddress === '0x1234567890123456789012345678901234567890') {
    throw new Error('Contract address not configured. Please set up your Web3 configuration.');
  }
  
  return new ethers.Contract(contractAddress, BLUE_CARBON_TOKEN_ABI, provider);
};

// Transaction status types
export interface Transaction {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  type: 'transfer' | 'mint';
  amount?: string;
  to?: string;
  from?: string;
}

// Local storage keys
export const STORAGE_KEYS = {
  WALLET_ADDRESS: 'bluemercantile_wallet_address',
  TRANSACTIONS: 'bluemercantile_transactions',
};