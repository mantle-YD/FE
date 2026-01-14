import { useAccount, useReadContract } from 'wagmi';
import abi from '@/abi/RealEstateToken.json';
import { CONTRACTS } from '@/config/contracts';

export function useRetBalance() {
  const { address } = useAccount();

  return useReadContract({
    address: CONTRACTS.realEstateToken.address,
    abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}
