import { useWalletContext } from '../Context/WalletContext';

export const useWallet = () => {
  return useWalletContext();
};