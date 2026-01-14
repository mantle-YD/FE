'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Coins, CheckCircle2, Circle, Loader2, ArrowRight } from 'lucide-react'
import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { CONTRACTS } from '@/config/contracts'
import RealEstateTokenABI from '@/abi/RealEstateToken.json'

export function InvestorDashboard() {
    const { address, isConnected } = useAccount()
    const [claimStatus, setClaimStatus] = useState('idle') // idle, verifying, claiming, claimed
    const [yieldData, setYieldData] = useState({ totalPool: 0, distributionDate: 'Pending' })
    const [userUsd, setUserUsd] = useState(0)
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])

    const [verificationSteps, setVerificationSteps] = useState({
        accredited: false,
        jurisdiction: false,
        kyc: false
    })

    useEffect(() => {
        // Load stored yield data
        const storedYield = localStorage.getItem('MA_YP_YIELD_DATA')
        if (storedYield) {
            setYieldData(JSON.parse(storedYield))
        }

        // Load stored USD balance
        const storedUsd = localStorage.getItem('MA_YP_USER_USD')
        if (storedUsd) {
            setUserUsd(Number(storedUsd))
        }
    }, [])

    // Get RET Balance
    const { data: balance, error: balanceError, isLoading: isBalanceLoading } = useReadContract({
        address: CONTRACTS.realEstateToken.address,
        abi: RealEstateTokenABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        chainId: CONTRACTS.realEstateToken.chainId,
        query: {
            enabled: !!address,
            refetchInterval: 5000,
        },
    });

    useEffect(() => {
        if (balanceError) {
            console.error("❌ InvestorDashboard Balance Error:", balanceError);
        }
        if (balance !== undefined) {
            console.log("💰 InvestorDashboard Balance:", formatEther(balance));
        }
    }, [balance, balanceError]);

    // Calculate user's share
    // Logic: (RET Balance / 1,000,000) * Total Pool
    const totalSupply = 1000000
    const retBalance = balance ? Number(formatEther(balance)) : 0
    const yourShare = (retBalance / totalSupply) * yieldData.totalPool
    const formattedShare = yourShare.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const handleClaim = () => {
        setClaimStatus('verifying')

        // Simulate checks
        setTimeout(() => setVerificationSteps(s => ({ ...s, accredited: true })), 1000)
        setTimeout(() => setVerificationSteps(s => ({ ...s, jurisdiction: true })), 2000)
        setTimeout(() => setVerificationSteps(s => ({ ...s, kyc: true })), 3000)

        setTimeout(() => {
            setClaimStatus('claiming')
            setTimeout(() => {
                setClaimStatus('claimed')
                setUserUsd(yourShare)
                localStorage.setItem('MA_YP_USER_USD', yourShare.toString())
            }, 2500)
        }, 4000)
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-lg">
                <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="p-4 bg-primary/10 rounded-full border border-primary/20">
                        <Wallet className="text-primary" size={28} />
                    </div>
                    <div>
                        <h2 className="text-sm text-muted-foreground uppercase tracking-wider">Connected Wallet</h2>
                        <p className="font-mono text-xl">{isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Not Connected'}</p>
                    </div>
                </div>
                {isConnected && (
                    <div className="flex items-center gap-20 mt-6 md:mt-0 w-full md:w-auto justify-end border-t md:border-t-0 border-white/10 pt-6 md:pt-0">
                        <div className="text-right">
                            <h2 className="text-sm text-muted-foreground uppercase tracking-wider">Your USD</h2>
                            <p className="text-2xl font-bold text-white flex items-center justify-end gap-2">
                                {userUsd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} <span className="text-sm font-normal text-muted-foreground">USD</span>
                            </p>
                        </div>

                        <div className="text-right">
                            <h2 className="text-sm text-muted-foreground uppercase tracking-wider">Your Holdings</h2>
                            <p className="text-2xl font-bold text-white flex items-center justify-end gap-2">
                                {isBalanceLoading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    balance ? Number(formatEther(balance)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'
                                )}
                                <span className="text-sm font-normal text-muted-foreground">RET</span>
                            </p>
                            {balanceError && (
                                <p className="text-xs text-red-400 text-right mt-1">Failed to load balance</p>
                            )}
                        </div>

                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Yield Card */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl flex flex-col justify-between shadow-lg hover:border-white/20 transition-colors">
                    <div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Coins className="text-secondary" />
                            Available Yield Distribution
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl">
                                <span className="text-muted-foreground">Total Pool</span>
                                <span className="font-mono font-bold text-lg">${yieldData.totalPool.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl">
                                <span className="text-muted-foreground">Distribution Date</span>
                                <span className="font-mono text-sm text-primary">{yieldData.distributionDate}</span>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <div className="flex justify-between items-end">
                                    <span className="text-lg text-muted-foreground mb-1">Your Share</span>
                                    <span className="text-4xl font-bold text-secondary text-shadow-glow">${formattedShare}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleClaim}
                        disabled={claimStatus !== 'idle' || !isConnected}
                        className="w-full mt-8 bg-secondary text-black font-bold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                        {claimStatus === 'idle' ? 'Claim Yield' :
                            claimStatus === 'claimed' ? 'Yield Claimed Successfully' : 'Verifying & Processing...'}
                    </button>
                </div>

                {/* Credential Status */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <CheckCircle2 className="text-primary" />
                        Credential Status
                    </h3>
                    <div className="space-y-4">
                        <CredentialRow label="Accredited Investor" checked={verificationSteps.accredited} loading={claimStatus === 'verifying' && !verificationSteps.accredited} />
                        <CredentialRow label="Non-Sanctioned Jurisdiction" checked={verificationSteps.jurisdiction} loading={claimStatus === 'verifying' && verificationSteps.accredited && !verificationSteps.jurisdiction} />
                        <CredentialRow label="KYC Level 2 Verified" checked={verificationSteps.kyc} loading={claimStatus === 'verifying' && verificationSteps.jurisdiction && !verificationSteps.kyc} />
                    </div>

                    {claimStatus === 'claiming' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 p-6 bg-primary/10 rounded-xl border border-primary/20 flex flex-col items-center gap-3 text-center"
                        >
                            <Loader2 className="animate-spin text-primary w-8 h-8" />
                            <span className="font-medium">Transferring ${userUsd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} to your wallet...</span>
                        </motion.div>
                    )}

                    {claimStatus === 'claimed' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-8 p-6 bg-secondary/10 rounded-xl border border-secondary/20 flex flex-col items-center gap-3 text-secondary text-center"
                        >
                            <CheckCircle2 className="w-10 h-10" />
                            <span className="font-bold text-xl">${userUsd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Transferred!</span>
                            <span className="text-sm opacity-80">Transaction Hash: 0x7f...3a9</span>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}

function CredentialRow({ label, checked, loading }) {
    return (
        <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${checked ? 'bg-primary/5 border-primary/20' : 'bg-black/20 border-white/5'}`}>
            <span className={`font-medium ${checked ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
            {checked ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 className="text-primary" size={24} />
                </motion.div>
            ) : loading ? (
                <Loader2 className="animate-spin text-primary" size={24} />
            ) : (
                <Circle className="text-muted-foreground/30" size={24} />
            )}
        </div>
    )
}
