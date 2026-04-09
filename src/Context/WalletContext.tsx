import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { ethers } from 'ethers';
import GrantPlatformABI from '../../GrantPlatform.json';
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
  switchChain: (hexChainId: string) => Promise<void>;
}

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
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
        const currentChainId = await ethereum.request({
          method: 'eth_chainId',
        });
        setChainId(currentChainId);
      }
    } catch (err: any) {
      console.error('Wallet check error:', err);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    const { ethereum } = window;
    if (!ethereum) {
      setError('MetaMask is not installed.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);
      const currentChainId = await ethereum.request({ method: 'eth_chainId' });
      setChainId(currentChainId);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet.');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setChainId(null);
  }, []);

  const getContract = useCallback(async () => {
    const { ethereum } = window;
    if (!ethereum || !account) return null;

    const CONTRACT_MAP: Record<string, string> = {
      '0x1': import.meta.env.VITE_CONTRACT_ADDRESS,
      '0x89': '0x1e7f5f6Bd0F2D03A6eA77B467C722Be7c53f5452',
      '0x13881': '0x1e7f5f6Bd0F2D03A6eA77B467C722Be7c53f5452',
      '0x13882': '0x1e7f5f6Bd0F2D03A6eA77B467C722Be7c53f5452',
      '0xaa36a7': import.meta.env.VITE_CONTRACT_ADDRESS,
    };

    const activeAddress =
      CONTRACT_MAP[chainId || ''] || import.meta.env.VITE_CONTRACT_ADDRESS;

    const provider = new ethers.BrowserProvider(ethereum as any);
    const signer = await provider.getSigner();
    return new ethers.Contract(activeAddress, GrantPlatformABI.abi, signer);
  }, [account, chainId]);

  const getTokenContract = useCallback(
    async (tokenAddress: string) => {
      const { ethereum } = window;
      if (!ethereum || !account) return null;

      const provider = new ethers.BrowserProvider(ethereum as any);
      const signer = await provider.getSigner();
      return new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    },
    [account]
  );

  const switchChain = useCallback(async (hexChainId: string) => {
    const { ethereum } = window;
    if (!ethereum) return;
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // Handle network not found
      }
      throw switchError;
    }
  }, []);

  useEffect(() => {
    checkIfWalletIsConnected();

    const { ethereum } = window;
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

  const contextValue = React.useMemo(
    () => ({
      account,
      chainId,
      error,
      isConnecting,
      connectWallet,
      disconnectWallet,
      getContract,
      getTokenContract,
      switchChain,
    }),
    [
      account,
      chainId,
      error,
      isConnecting,
      connectWallet,
      disconnectWallet,
      getContract,
      getTokenContract,
      switchChain,
    ]
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};
