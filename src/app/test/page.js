'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import RealEstateTokenABI from '@/abi/RealEstateToken.json';
import { CONTRACTS } from '@/config/contracts';
import { buildMerkleTreeByPercentage } from '@/lib/buildMerkleTree';
import { FAUCET_INVESTORS } from '@/config/faucetInvestors';

export default function TestPage() {
    const { address, isConnected } = useAccount();
    const [mounted, setMounted] = useState(false);
    const [balanceKey, setBalanceKey] = useState(0);

    // Merkle Tree State
    const [merkleData, setMerkleData] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Get RET Balance
    const { data: balance, refetch: refetchBalance } = useReadContract({
        address: CONTRACTS.realEstateToken.address,
        abi: RealEstateTokenABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchOnWindowFocus: false, // optional: disable auto-refetch on focus
            refetchInterval: 0, // optional: disable auto-refetch on interval
        },
    });

    useEffect(() => {
        console.log('🔍 Balance value:', balance);
        console.log('🧾 Balance type:', typeof balance);
    }, [balance]);

    // Write Contract for requestTokens
    const { data: hash, isPending, error, writeContract } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isConfirmed) {
            setBalanceKey(prev => prev + 1); // trigger re-render
        }
    }, [isConfirmed]);

    useEffect(() => {
        if (isConfirmed && address) {
            alert("Transaction confirmed, refetching balance and generating Merkle Tree...");
            refetchBalance();

            // Generate Merkle Tree
            const currentUser = {
                address: address,
                retTokenBalance: 80000,
                percentageOwnership: 8
            };

            const allInvestors = [...FAUCET_INVESTORS, currentUser];

            try {
                // Using 1,000,000 as total yield/RET count to match logic
                const treeData = buildMerkleTreeByPercentage(allInvestors, "1000000");
                const userProof = treeData.proofMap[address.toLowerCase()];

                console.log("Tree Data:", treeData);
                console.log("User Proof:", userProof);

                setMerkleData({
                    root: treeData.root,
                    proof: userProof,
                    tree: treeData
                });
            } catch (err) {
                console.error("Error generating Merkle Tree:", err);
            }
        }
    }, [isConfirmed, balanceKey, address, refetchBalance]);

    const handleRequestTokens = () => {
        writeContract({
            address: CONTRACTS.realEstateToken.address,
            abi: RealEstateTokenABI,
            functionName: 'requestTokens',
        });
    };

    // Write Contract for burn80k
    const {
        data: burnHash,
        isPending: isBurnPending,
        error: burnError,
        writeContract: writeBurnContract
    } = useWriteContract();

    const { isLoading: isBurnConfirming, isSuccess: isBurnConfirmed } = useWaitForTransactionReceipt({
        hash: burnHash,
    });

    useEffect(() => {
        if (isBurnConfirmed) {
            setBalanceKey(prev => prev + 1); // trigger re-render
            alert("Burn confirmed, refetching balance...");
            refetchBalance();
        }
    }, [isBurnConfirmed]);

    const handleBurnTokens = () => {
        writeBurnContract({
            address: CONTRACTS.realEstateToken.address,
            abi: RealEstateTokenABI,
            functionName: 'burn80k',
        });
    };

    if (!mounted) return null;

    return (
        <main className="flex min-h-screen flex-col items-center justify-center pt-20 pb-12 px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/50 via-background to-background text-white">
            <h1 className="text-3xl font-bold mb-8">Faucet Test Page</h1>

            <div className="w-full max-w-2xl p-6 bg-slate-800 rounded-xl border border-slate-700 space-y-6">

                <div className="space-y-2">
                    <label className="text-sm text-slate-400">Connected Wallet</label>
                    <div className="p-3 bg-slate-900 rounded-lg break-all font-mono text-sm">
                        {isConnected ? address : 'Not connected'}
                    </div>
                </div>

                {isConnected && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">RET Balance</label>
                            <div className="text-2xl font-bold text-accent">
                                {balance ? formatEther(balance) : '0'} RET
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleRequestTokens}
                                disabled={isPending || isConfirming || isBurnPending || isBurnConfirming}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                            >
                                {isPending ? 'Confirming Request...' :
                                    isConfirming ? 'Request Pending...' :
                                        'Request 80,000 RET'}
                            </button>

                            <button
                                onClick={handleBurnTokens}
                                disabled={isPending || isConfirming || isBurnPending || isBurnConfirming}
                                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                            >
                                {isBurnPending ? 'Confirming Burn...' :
                                    isBurnConfirming ? 'Burn Pending...' :
                                        'Burn 80,000 RET'}
                            </button>
                        </div>

                        {/* Request Feedback */}
                        {hash && (
                            <div className="text-xs text-slate-400 break-all">
                                <p>Request TX:</p>
                                <p>{hash}</p>
                            </div>
                        )}
                        {isConfirmed && (
                            <div className="space-y-4">
                                <div className="p-3 bg-green-500/20 text-green-400 rounded-lg text-sm text-center">
                                    Successfully minted 80,000 RET!
                                </div>

                                {merkleData && (
                                    <div className="p-4 bg-slate-900/80 border border-emerald-500/30 rounded-lg space-y-3">
                                        <h3 className="text-emerald-400 font-semibold flex items-center gap-2">
                                            <span>🌿</span> Merkle Tree Generated
                                        </h3>

                                        <div className="space-y-1">
                                            <span className="text-xs text-slate-400 uppercase tracking-wider">Merkle Root</span>
                                            <div className="p-2 bg-black/40 rounded border border-slate-700 text-xs font-mono break-all text-slate-300">
                                                {merkleData.root}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <span className="text-xs text-slate-400 uppercase tracking-wider">Your Proof Data</span>
                                            <div className="p-2 bg-black/40 rounded border border-slate-700 text-xs font-mono text-slate-300 overflow-x-auto">
                                                <pre className="whitespace-pre-wrap">
                                                    {JSON.stringify(merkleData.proof, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {error && (
                            <div className="p-3 bg-red-500/20 text-red-400 rounded-lg text-sm break-words">
                                Request Error: {error.shortMessage || error.message}
                            </div>
                        )}

                        {/* Burn Feedback */}
                        {burnHash && (
                            <div className="text-xs text-slate-400 break-all">
                                <p>Burn TX:</p>
                                <p>{burnHash}</p>
                            </div>
                        )}
                        {isBurnConfirmed && (
                            <div className="p-3 bg-orange-500/20 text-orange-400 rounded-lg text-sm text-center">
                                Successfully burned 80,000 RET!
                            </div>
                        )}
                        {burnError && (
                            <div className="p-3 bg-red-500/20 text-red-400 rounded-lg text-sm break-words">
                                Burn Error: {burnError.shortMessage || burnError.message}
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}