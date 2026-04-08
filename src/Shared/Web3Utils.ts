/**
 * Maps common Ethereum RPC error codes to user-friendly messages.
 */
export const mapWeb3Error = (error: any): string => {
  const errorCode = error?.code || error?.info?.error?.code;
  const message = error?.message || '';

  if (errorCode === 4001 || message.includes('user rejected')) {
    return 'Transaction rejected by user.';
  }

  if (message.includes('insufficient funds')) {
    return 'Insufficient native tokens (MATIC/ETH) for gas fees.';
  }

  if (message.includes('allowance')) {
    return 'Insufficient USDC allowance. Please approve the contract.';
  }

  if (message.includes('User does not have enough USDC balance')) {
    return 'Insufficient USDC balance for this plan.';
  }

  return error?.reason || error?.message;
};

/**
 * Formats a blockchain address for display (e.g., 0x1234...5678)
 */
export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};
