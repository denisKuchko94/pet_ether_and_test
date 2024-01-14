import { axlt, usdt } from '@/src/ethers/abis';

export enum SupportedChainId {
  SmartChain = 97,
}

interface BaseChainInfo {
  readonly chainName: string;
  readonly rpcUrls: string[];
  readonly blockExplorerUrls: string[];
  readonly chainId: number;
  readonly nativeCurrency: {
    name: string; // e.g. 'Goerli ETH',
    symbol: ContractKeys | 'eth'; // e.g. 'gorETH',
    decimals: number; // e.g. 18,
  };
}

export enum ContractKeys {
  AXLT = 'axlt',
  USDT = 'usdt',
}

export enum ContractSymbolsKeys {
  axlt = 'AXLT',
  usdt = 'TTK',
  tBNB = 'tBNB',
}

export const TOKENS = {
  [ContractKeys.AXLT]: {
    abi: axlt,
    dev: '0x93e6b675929e100BFB749368ACFcA40e618c7b50',
  },
  [ContractKeys.USDT]: {
    abi: usdt,
    dev: '0x5eBBDFa0936CA66814F195B8c504C420292E0B0e',
  },
} as const;

export const CHAIN_INFO: { [key: number]: BaseChainInfo } = {
  [SupportedChainId.SmartChain]: {
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
};

export const RPC_URLS = {
  [SupportedChainId.SmartChain]: ['https://sepolia.infura.io/v3/'],
};
