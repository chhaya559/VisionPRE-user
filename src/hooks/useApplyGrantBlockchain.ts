import { useState } from 'react';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useWalletContext } from '../Context/WalletContext';
import { mapWeb3Error } from '../Shared/Web3Utils';

export const useApplyGrantBlockchain = () => {
  const { t } = useTranslation('private');
  const { account, chainId, connectWallet, switchChain, getContract } =
    useWalletContext();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');

  const SEPOLIA_CHAIN_ID = '0xaa36a7';

  const findPreviousApplicationHash = async (
    grantId: string,
    attendee: string
  ) => {
    try {
      console.log('[Web3] Searching for previous GrantApplied event...');
      const contract = await getContract();
      if (!contract) return null;

      const filter = contract.filters.GrantApplied(grantId, null, attendee);
      const events = await contract.queryFilter(filter, -10000);

      if (events.length > 0) {
        const lastEvent = events[events.length - 1];
        console.log(
          '[Web3] Found previous application in tx:',
          lastEvent.transactionHash
        );
        return lastEvent.transactionHash;
      }

      const allEvents = await contract.queryFilter(filter);
      if (allEvents.length > 0) {
        return allEvents[allEvents.length - 1].transactionHash;
      }

      return null;
    } catch (err) {
      console.error('[Web3] Error searching for events:', err);
      return null;
    }
  };

  const applyForGrantBlockchain = async (galaId: string, grantId: string) => {
    const normalizedGalaId = (galaId || '').trim();
    const normalizedGrantId = (grantId || '').trim();

    try {
      if (chainId !== SEPOLIA_CHAIN_ID) {
        setProcessStatus(
          t('subscription.processing.switchingNetwork') ||
            'Switching to Sepolia...'
        );
        try {
          await switchChain(SEPOLIA_CHAIN_ID);
        } catch (err) {
          toast.error('Please switch to Sepolia network to proceed.');
          return null;
        }
      }

      if (!account) {
        await connectWallet();
        return null;
      }

      setIsProcessing(true);
      setProcessStatus(
        t('subscription.processing.initializing') || 'Initializing contracts...'
      );

      const contract = await getContract();
      if (!contract) {
        toast.error('Failed to initialize blockchain contracts.');
        setIsProcessing(false);
        return null;
      }

      console.log('[Web3] Executing applyForGrant...');
      setProcessStatus(
        t('subscription.processing.confirming') || 'Confirming application...'
      );
      const tx = await contract.applyForGrant(
        normalizedGalaId,
        normalizedGrantId
      );

      setProcessStatus(
        t('subscription.processing.processing') || 'Processing transaction...'
      );
      const receipt = await tx.wait();

      setIsProcessing(false);
      return {
        transactionHash: receipt.hash || tx.hash,
        walletAddress: ethers.getAddress(account),
      };
    } catch (err: any) {
      console.error('[Web3] Error in applyForGrantBlockchain:', err);
      setIsProcessing(false);
      const errorMsg = mapWeb3Error(err);

      if (
        errorMsg === 'ALREADY_APPLIED' ||
        errorMsg.includes('Already applied')
      ) {
        setProcessStatus('Recovering transaction...');
        const recoveredHash = await findPreviousApplicationHash(
          normalizedGrantId,
          account || ''
        );
        if (recoveredHash) {
          return {
            transactionHash: recoveredHash,
            walletAddress: ethers.getAddress(account || ''),
            isAlreadyApplied: true,
          };
        }
      }

      toast.error(errorMsg);
      return null;
    }
  };

  return {
    applyForGrantBlockchain,
    isProcessing,
    processStatus,
    account,
  };
};
