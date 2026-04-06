import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';
import GrantPlatformABI from '../../GrantPlatformProxy.json';
import { ERC20_ABI } from '../Shared/ContractABIs';

interface WalletContextType {
  account: string | null;
  chainId: string | null;
  error: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getContract: () => Promise<ethers.Contract | null>;
  getTokenContract: (tokenAddress: string) => Promise<ethers.Contract | null>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);


  const checkIfWalletIsConnected = useCallback(async () => {
    const { ethereum } = window as any;
    if (!ethereum) return;

    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const currentChainId = await ethereum.request({ method: 'eth_chainId' });
        setChainId(currentChainId);
      }
    } catch (err: any) {
      console.error('Wallet check error:', err);
    }
  }, []);

  const connectWallet = async () => {
    const { ethereum } = window as any;
    if (!ethereum) {
      setError('MetaMask is not installed.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      const currentChainId = await ethereum.request({ method: 'eth_chainId' });
      setChainId(currentChainId);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
  };

  const getContract = async () => {
    const { ethereum } = window as any;
    if (!ethereum || !account) return null;

    // Use a mapping for the contract address if needed across multiple networks
    const CONTRACT_MAP: Record<string, string> = {
      '0x1': import.meta.env.VITE_CONTRACT_ADDRESS, // Use .env default for Mainnet
      '0x89': '0x0C79C1983ea9C14CfbA5d9A2975695a0EEB73582', // User specified for Polygon
      '0x13881': '0x0C79C1983ea9C14CfbA5d9A2975695a0EEB73582', // Mumbai
      '0x13882': '0x0C79C1983ea9C14CfbA5d9A2975695a0EEB73582', // Amoy
    };

    const activeAddress = CONTRACT_MAP[chainId || ''] || import.meta.env.VITE_CONTRACT_ADDRESS;

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(activeAddress, GrantPlatformABI.abi, signer);
  };

  const getTokenContract = async (tokenAddress: string) => {
    const { ethereum } = window as any;
    if (!ethereum || !account) return null;

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(tokenAddress, ERC20_ABI, signer);
  };

  useEffect(() => {
    checkIfWalletIsConnected();

    const { ethereum } = window as any;
    if (ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      };
      const handleChainChanged = () => window.location.reload();

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [checkIfWalletIsConnected]);

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        error,
        isConnecting,
        connectWallet,
        disconnectWallet,
        getContract,
        getTokenContract,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};
