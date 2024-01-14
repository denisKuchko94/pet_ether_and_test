export const CHAINS = {
  97: {
    chainName: 'Smart Chain - Testnet',
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
    chainId: 97,
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
  },
  56: {
    chainName: 'Binance Smart Chain',
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
    chainId: 56,
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
  },
} as const;
export const MAIN_CHAIN_ID = 97;
