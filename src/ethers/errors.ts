import { ProviderRpcError } from '@web3-react/types';

export const isProviderRpcError = (error: any): error is ProviderRpcError => {
  return error?.message && error?.code;
};
