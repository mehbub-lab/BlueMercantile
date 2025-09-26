import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import {
  isMetaMaskInstalled,
  getCurrentChainId,
  switchToSepolia,
  getProvider,
  getContract,
  formatEther,
  SEPOLIA_CHAIN_ID,
  STORAGE_KEYS,
  Transaction
} from '../utils/web3';

// Dynamic environment loading from localStorage or window.ENV
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
        CONTRACT_ADDRESS: (window as any).ENV.NEXT_PUBLIC_CONTRACT_ADDRESS,
        RPC_URL: (window as any).ENV.NEXT_PUBLIC_RPC_URL
      };
    }
  }
  
  return {
    CONTRACT_ADDRESS: '',
    RPC_URL: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
  };
};

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  ethBalance: string;
  tokenBalance: string;
  isLoading: boolean;
  error: string | null;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isCorrectNetwork: false,
    ethBalance: '0',
    tokenBalance: '0',
    isLoading: false,
    error: null,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage
  useEffect(() => {
    const storedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  // Save transactions to localStorage
  const saveTransactions = useCallback((newTransactions: Transaction[]) => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(newTransactions));
    setTransactions(newTransactions);
  }, []);

  // Add new transaction
  const addTransaction = useCallback((tx: Transaction) => {
    const updatedTransactions = [tx, ...transactions].slice(0, 50); // Keep only last 50
    saveTransactions(updatedTransactions);
  }, [transactions, saveTransactions]);

  // Update transaction status
  const updateTransactionStatus = useCallback((hash: string, status: 'confirmed' | 'failed') => {
    const updatedTransactions = transactions.map(tx => 
      tx.hash === hash ? { ...tx, status } : tx
    );
    saveTransactions(updatedTransactions);
  }, [transactions, saveTransactions]);

  // Check if connected to correct network
  const checkNetwork = useCallback(async () => {
    try {
      const chainId = await getCurrentChainId();
      const isCorrect = chainId === SEPOLIA_CHAIN_ID;
      setWalletState(prev => ({ ...prev, isCorrectNetwork: isCorrect }));
      return isCorrect;
    } catch (error) {
      console.error('Error checking network:', error);
      return false;
    }
  }, []);

  // Get balances with better error handling and debugging
  const getBalances = useCallback(async (address: string) => {
    console.log('Fetching balances for address:', address);
    
    try {
      const provider = getProvider();
      if (!provider) {
        console.error('No provider available for balance fetching');
        return;
      }

      // Get ETH balance with explicit error handling
      console.log('Fetching ETH balance...');
      const ethBalanceWei = await provider.getBalance(address);
      console.log('ETH balance (wei):', ethBalanceWei.toString());
      
      const ethBalanceFormatted = formatEther(ethBalanceWei.toString());
      console.log('ETH balance (formatted):', ethBalanceFormatted);

      // Get token balance (if contract is deployed)
      let tokenBalance = '0';
      try {
        console.log('Fetching token balance...');
        const contract = getContract(provider);
        const tokenBalanceWei = await contract.balanceOf(address);
        console.log('Token balance (wei):', tokenBalanceWei.toString());
        
        tokenBalance = formatEther(tokenBalanceWei.toString());
        console.log('Token balance (formatted):', tokenBalance);
      } catch (contractError) {
        console.log('Contract not deployed or not accessible:', contractError);
        // This is expected if contract is not deployed yet
      }

      console.log('Setting wallet state with balances:', {
        ethBalance: ethBalanceFormatted,
        tokenBalance: tokenBalance
      });

      setWalletState(prev => ({
        ...prev,
        ethBalance: ethBalanceFormatted,
        tokenBalance: tokenBalance,
        error: null, // Clear any previous errors
      }));
    } catch (error) {
      console.error('Error getting balances:', error);
      setWalletState(prev => ({
        ...prev,
        error: `Failed to fetch balances: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }));
    }
  }, []);

  // Connect wallet with improved balance fetching
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setWalletState(prev => ({ 
        ...prev, 
        error: 'MetaMask is not installed. Please install MetaMask to continue.' 
      }));
      return false;
    }

    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const provider = getProvider();
      if (!provider) throw new Error('No provider available');

      console.log('Requesting account access...');
      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      console.log('Connected to address:', address);
      
      // Check network first
      const isCorrectNetwork = await checkNetwork();
      console.log('Network check result:', isCorrectNetwork);
      
      // Update state with address and connection status first
      setWalletState(prev => ({
        ...prev,
        address,
        isConnected: true,
        isCorrectNetwork,
        isLoading: false,
        error: null,
      }));

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, address);

      // Fetch balances after a short delay to ensure state is updated
      setTimeout(async () => {
        await getBalances(address);
      }, 500);

      return true;
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setWalletState(prev => ({
        ...prev,
        error: error.message || 'Failed to connect wallet',
        isLoading: false,
      }));
      return false;
    }
  }, [checkNetwork, getBalances]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletState({
      address: null,
      isConnected: false,
      isCorrectNetwork: false,
      ethBalance: '0',
      tokenBalance: '0',
      isLoading: false,
      error: null,
    });
    localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
  }, []);

  // Switch to Sepolia
  const handleSwitchNetwork = useCallback(async () => {
    setWalletState(prev => ({ ...prev, isLoading: true }));
    
    const success = await switchToSepolia();
    
    if (success) {
      await checkNetwork();
      if (walletState.address) {
        await getBalances(walletState.address);
      }
    }
    
    setWalletState(prev => ({ ...prev, isLoading: false }));
    return success;
  }, [checkNetwork, getBalances, walletState.address]);

  // Transfer tokens
  const transferTokens = useCallback(async (to: string, amount: string) => {
    if (!walletState.address || !walletState.isConnected) {
      throw new Error('Wallet not connected');
    }

    if (!walletState.isCorrectNetwork) {
      throw new Error('Please switch to Sepolia network');
    }

    try {
      const provider = getProvider();
      if (!provider) throw new Error('No provider available');

      const signer = await provider.getSigner();
      const contract = getContract(provider).connect(signer);

      // Parse amount to wei
      const amountWei = ethers.parseEther(amount);

      // Send transaction
      const tx = await contract.transfer(to, amountWei);

      // Add to pending transactions
      const transaction: Transaction = {
        hash: tx.hash,
        status: 'pending',
        timestamp: new Date(),
        type: 'transfer',
        amount,
        to,
        from: walletState.address,
      };
      addTransaction(transaction);

      // Wait for confirmation
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        updateTransactionStatus(tx.hash, 'confirmed');
        // Refresh balances
        await getBalances(walletState.address);
      } else {
        updateTransactionStatus(tx.hash, 'failed');
      }

      return { success: true, hash: tx.hash };
    } catch (error: any) {
      console.error('Transfer failed:', error);
      throw new Error(error.message || 'Transfer failed');
    }
  }, [walletState, addTransaction, updateTransactionStatus, getBalances]);

  // Refresh balances manually
  const refreshBalances = useCallback(async () => {
    if (walletState.address && walletState.isConnected) {
      await getBalances(walletState.address);
    }
  }, [walletState.address, walletState.isConnected, getBalances]);

  // Listen for account and network changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      console.log('Account changed:', accounts);
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== walletState.address) {
        const newAddress = accounts[0];
        setWalletState(prev => ({ 
          ...prev, 
          address: newAddress,
          ethBalance: '0', // Reset balances while fetching
          tokenBalance: '0'
        }));
        
        // Fetch balances for new address after a delay
        setTimeout(async () => {
          await getBalances(newAddress);
        }, 500);
      }
    };

    const handleChainChanged = async () => {
      console.log('Chain changed');
      await checkNetwork();
      // Refresh balances when network changes
      if (walletState.address) {
        setTimeout(async () => {
          await getBalances(walletState.address!);
        }, 1000);
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [walletState.address, disconnectWallet, getBalances, checkNetwork]);

  // Auto-connect on load if previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS);
    if (savedAddress && isMetaMaskInstalled()) {
      connectWallet();
    }
  }, [connectWallet]);

  return {
    ...walletState,
    transactions,
    connectWallet,
    disconnectWallet,
    switchNetwork: handleSwitchNetwork,
    transferTokens,
    refreshBalances,
  };
};