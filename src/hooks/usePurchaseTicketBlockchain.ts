import { useState } from 'react';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useWalletContext } from '../Context/WalletContext';
import { mapWeb3Error } from '../Shared/Web3Utils';

export const usePurchaseTicketBlockchain = () => {
  const { t } = useTranslation('private');
  const {
    account,
    chainId,
    connectWallet,
    switchChain,
    getContract,
    getTokenContract,
  } = useWalletContext();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');

  // USDC/sUSD Address for Sepolia
  const SEPOLIA_SUSD = '0xba89d4B0513eAdA62671f5db8D6Fef498Ff63331';
  const SEPOLIA_CHAIN_ID = '0xaa36a7';

  const findPreviousPurchaseHash = async (galaId: string, attendee: string) => {
    try {
      console.log('[Web3] Searching for previous TicketPurchased event...');
      const contract = await getContract();
      if (!contract) return null;
      
      const filter = contract.filters.TicketPurchased(galaId, attendee);
      // Search from a reasonable block height to now. 
      // Sepolia block time is ~12s. 10,000 blocks is ~1.4 days.
      const events = await contract.queryFilter(filter, -10000); 
      
      if (events.length > 0) {
        const lastEvent = events[events.length - 1];
        console.log('[Web3] Found previous purchase in tx:', lastEvent.transactionHash);
        return lastEvent.transactionHash;
      }
      
      // If not in last 10k, try from block 0 (expensive but sure)
      console.log('[Web3] Not found in last 10k blocks, searching from genesis...');
      const allEvents = await contract.queryFilter(filter);
      if (allEvents.length > 0) {
        return allEvents[allEvents.length - 1].transactionHash;
      }

      console.warn('[Web3] No purchase event found on-chain for this user/gala.');
      return null;
    } catch (err) {
      console.error('[Web3] Error searching for events:', err);
      return null;
    }
  };

  const purchaseTicketBlockchain = async (galaId: string, organiserWallet: string, price: number) => {
    const normalizedGalaId = (galaId || '').trim();
    try {
      console.log('[Web3] Starting purchase flow for galaId:', normalizedGalaId);
      // 1. Check Network
      if (chainId !== SEPOLIA_CHAIN_ID) {
        console.log('[Web3] Incorrect network. Current:', chainId, 'Expected:', SEPOLIA_CHAIN_ID);
        setProcessStatus(t('subscription.processing.switchingNetwork') || 'Switching to Sepolia...');
        try {
          toast.info('Please switch to Sepolia network.');
          await switchChain(SEPOLIA_CHAIN_ID);
        } catch (err) {
          console.error('[Web3] Network switch failed:', err);
          toast.error('Please switch to Sepolia network to proceed.');
          return null;
        }
      }

      // 2. Check Wallet
      if (!account) {
        await connectWallet();
        return null; // Hook will re-render, user needs to click again
      }

      setIsProcessing(true);
      
      // 3. Get Contracts
      console.log('[Web3] Initializing contracts...');
      setProcessStatus(t('subscription.processing.initializing') || 'Initializing contracts...');
      const contract = await getContract();
      const tokenContract = await getTokenContract(SEPOLIA_SUSD);

      if (!contract || !tokenContract) {
        console.error('[Web3] Contract initialization failed.');
        toast.error('Failed to initialize blockchain contracts.');
        setIsProcessing(false);
        return null;
      }

      const contractAddress = await contract.getAddress();
      const decimals = await tokenContract.decimals();
      console.log('[Web3] Contract context:', { contractAddress, decimals, organiserWallet, price });
      const amountInUnits = ethers.parseUnits(price.toString(), decimals);

      // 4. Check Balance
      setProcessStatus(t('subscription.processing.checkingToken') || 'Checking balance...');
      const balance = await tokenContract.balanceOf(account);
      if (balance < amountInUnits) {
        toast.error(`Insufficient sUSD balance. Required: ${price} sUSD`);
        setIsProcessing(false);
        return null;
      }

      // 5. Check Allowance
      const allowance = await tokenContract.allowance(account, contractAddress);
      console.log('[Web3] Current allowance:', ethers.formatUnits(allowance, decimals), 'sUSD');
      if (allowance < amountInUnits) {
        console.log('[Web3] Allowance insufficient. Approving...');
        setProcessStatus(t('subscription.processing.approving') || 'Approving sUSD...');
        toast.info('Approving sUSD for transaction...');
        const approveTx = await tokenContract.approve(contractAddress, ethers.MaxUint256);
        console.log('[Web3] Approval tx submitted:', approveTx.hash);
        await approveTx.wait();
        console.log('[Web3] Approval confirmed.');
        toast.success('sUSD approved!');
        // Wait a bit for MetaMask readiness
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // 6. Execute applyForGala
      console.log('[Web3] Executing applyForGala...');
      setProcessStatus(t('subscription.processing.confirming') || 'Confirming purchase...');
      toast.info('Please confirm the ticket purchase in your wallet.');
      const tx = await contract.applyForGala(normalizedGalaId, organiserWallet);
      console.log('[Web3] Transaction submitted:', tx.hash);
      
      setProcessStatus(t('subscription.processing.processing') || 'Processing transaction...');
      toast.info('Transaction submitted! Waiting for blockchain confirmation...');
      const receipt = await tx.wait();
      console.log('[Web3] Transaction confirmed in block:', receipt.blockNumber);
      
      setIsProcessing(false);
      const normalizedAddress = account ? ethers.getAddress(account) : '';
      return {
        transactionHash: receipt.hash || tx.hash,
        walletAddress: normalizedAddress,
      };

    } catch (err: any) {
      console.error('[Web3] Error in purchaseTicketBlockchain:', err);
      setIsProcessing(false);
      const errorMsg = mapWeb3Error(err);
      
      if (errorMsg === 'ALREADY_PURCHASED') {
        setProcessStatus('Recovering transaction...');
        const recoveredHash = await findPreviousPurchaseHash(normalizedGalaId, account || '');
        
        if (recoveredHash) {
          toast.success('Previous purchase found! Synchronizing with server...');
          const normalizedAddress = account ? ethers.getAddress(account) : '';
          return {
            transactionHash: recoveredHash,
            walletAddress: normalizedAddress,
            isAlreadyPurchased: true,
          };
        } else {
          toast.error('You are already registered on blockchain, but we could not find your transaction hash. Please contact support.');
          return null;
        }
      }

      toast.error(errorMsg);
      return null;
    }
  };

  return {
    purchaseTicketBlockchain,
    isProcessing,
    processStatus,
    account,
  };
};
