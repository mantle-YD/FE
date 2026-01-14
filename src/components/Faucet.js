'use client'

import { useState, useEffect } from 'react'
import { Droplets, Clock, Loader2, CheckCircle2, Hash, FileJson, Users, ArrowRight } from 'lucide-react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from '@/config/contracts'
import RealEstateTokenABI from '@/abi/RealEstateToken.json'
import { buildMerkleTreeByPercentage } from '@/lib/buildMerkleTree'
import { FAUCET_INVESTORS } from '@/config/faucetInvestors'

export function Faucet() {
    const { isConnected, address } = useAccount()
    const [cooldown, setCooldown] = useState(0)
    const [mounted, setMounted] = useState(false)
    const [merkleData, setMerkleData] = useState(null)

    const { data: hash, isPending, error, writeContract } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })

    useEffect(() => {
        setMounted(true)
    }, [])


    const handleRequest = () => {
        writeContract({
            address: CONTRACTS.realEstateToken.address,
            abi: RealEstateTokenABI,
            functionName: 'requestTokens',
        })
    }

    // Timer effect
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => setCooldown(c => c - 1), 1000)
            return () => clearInterval(timer)
        }
    }, [cooldown])

    useEffect(() => {
        if (isConfirmed && address) {
            setCooldown(24 * 60 * 60) // 24 hours (visual only, contract enforces actual cooldown)

            // Generate Merkle Tree
            try {
                const currentUser = {
                    address: address,
                    retTokenBalance: 80000,
                    percentageOwnership: 8
                }

                const allInvestors = [...FAUCET_INVESTORS, currentUser]

                // Using 1,000,000 as total yield/RET count to match logic
                const treeData = buildMerkleTreeByPercentage(allInvestors, "1000000")
                const userProof = treeData.proofMap[address.toLowerCase()]

                setMerkleData({
                    root: treeData.root,
                    proof: userProof,
                    investors: allInvestors
                })
            } catch (err) {
                console.error("Error generating Merkle Tree:", err)
            }
        }
    }, [isConfirmed, address])

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h}h ${m}m ${s}s`
    }

    if (!mounted) return null


    return (
        <div className="w-full max-w-lg mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col items-center text-center">
                <div className="p-6 bg-primary/20 rounded-full mb-8 ring-1 ring-primary/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    <Droplets className="text-primary" size={48} />
                </div>
                <h2 className="text-3xl font-bold mb-3">Mantle Testnet Faucet</h2>
                <p className="text-muted-foreground mb-8">Request testnet tokens (RET) to interact with the dApp.</p>

                {isConfirmed || cooldown > 0 ? (
                    <div className="w-full bg-secondary/10 border border-secondary/20 rounded-xl p-8 mb-4">
                        <CheckCircle2 className="text-secondary mx-auto mb-4" size={40} />
                        <h3 className="font-bold text-secondary text-xl">80,000 RET Sent!</h3>
                        <p className="text-sm text-muted-foreground mt-2">Tokens have been airdropped to your wallet.</p>
                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-yellow-500 font-mono bg-yellow-500/10 py-3 rounded-lg border border-yellow-500/20">
                            <Clock size={16} />
                            Wait: {formatTime(cooldown)}
                        </div>
                        {hash && (
                            <div className="mt-4 text-xs text-muted-foreground break-all">
                                Tx: {hash}
                            </div>
                        )}

                        {merkleData && (
                            <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg text-primary flex items-center justify-center gap-2">
                                        <Hash className="w-5 h-5" />
                                        Merkle Tree Generated
                                    </h3>

                                    {/* Root */}
                                    <div className="bg-slate-950/50 rounded-xl p-4 border border-primary/20 text-left space-y-2">
                                        <div className="text-xs text-primary/70 uppercase tracking-widest font-semibold flex items-center gap-2">
                                            <Hash className="w-3 h-3" /> Merkle Root
                                        </div>
                                        <div className="font-mono text-xs text-cyan-100 break-all bg-black/40 p-2 rounded">
                                            {merkleData.root}
                                        </div>
                                    </div>

                                    {/* Proof */}
                                    <div className="bg-slate-950/50 rounded-xl p-4 border border-primary/20 text-left space-y-2">
                                        <div className="text-xs text-primary/70 uppercase tracking-widest font-semibold flex items-center gap-2">
                                            <FileJson className="w-3 h-3" /> Your Proof Data
                                        </div>
                                        <div className="font-mono text-xs text-cyan-100 overflow-x-auto bg-black/40 p-2 rounded max-h-40 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
                                            <pre>{JSON.stringify(merkleData.proof, null, 2)}</pre>
                                        </div>
                                    </div>

                                    {/* Investors List */}
                                    <div className="bg-slate-950/50 rounded-xl p-4 border border-primary/20 text-left space-y-2">
                                        <div className="text-xs text-primary/70 uppercase tracking-widest font-semibold flex items-center gap-2">
                                            <Users className="w-3 h-3" /> Updated Investor List
                                        </div>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
                                            {merkleData.investors.map((inv, i) => (
                                                <div
                                                    key={inv.address}
                                                    className={`p-2 rounded text-xs flex items-center justify-between group ${inv.address.toLowerCase() === address?.toLowerCase()
                                                            ? 'bg-primary/20 border border-primary/30'
                                                            : 'bg-black/20 border border-white/5'
                                                        }`}
                                                >
                                                    <div className="font-mono truncate w-32 opacity-70 group-hover:opacity-100 transition-opacity">
                                                        {inv.address}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-cyan-200">{inv.retTokenBalance.toLocaleString()} RET</span>
                                                        <span className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-muted-foreground w-12 text-center">
                                                            {inv.percentageOwnership}%
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <button
                            onClick={handleRequest}
                            disabled={!isConnected || isPending || isConfirming}
                            className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        >
                            {isPending || isConfirming ? <Loader2 className="animate-spin" size={24} /> : <Droplets size={24} />}
                            {isPending ? 'Confirm in Wallet...' : isConfirming ? 'Minting Tokens...' : 'Request 80,000 RET'}
                        </button>
                        {error && (
                            <div className="mt-4 text-sm text-red-400 p-2 bg-red-400/10 rounded border border-red-400/20">
                                Error: {error.shortMessage || error.message}
                            </div>
                        )}
                    </>
                )}

                {!isConnected && (
                    <p className="text-sm text-red-400 mt-6 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">Please connect your wallet to claim tokens.</p>
                )}
            </div>
        </div>
    )
}
