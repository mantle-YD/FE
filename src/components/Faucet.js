'use client'

import { useState, useEffect } from 'react'
import { Droplets, Clock, Loader2, CheckCircle2 } from 'lucide-react'
import { useAccount } from 'wagmi'

export function Faucet() {
    const { isConnected } = useAccount()
    const [status, setStatus] = useState('idle') // idle, minting, minted
    const [cooldown, setCooldown] = useState(0)

    const handleRequest = () => {
        setStatus('minting')
        // Simulate minting transaction
        setTimeout(() => {
            setStatus('minted')
            setCooldown(24 * 60 * 60) // 24 hours
        }, 2000)
    }

    // Timer effect
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => setCooldown(c => c - 1), 1000)
            return () => clearInterval(timer)
        }
    }, [cooldown])

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h}h ${m}m ${s}s`
    }

    return (
        <div className="w-full max-w-lg mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col items-center text-center">
                <div className="p-6 bg-primary/20 rounded-full mb-8 ring-1 ring-primary/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    <Droplets className="text-primary" size={48} />
                </div>
                <h2 className="text-3xl font-bold mb-3">Mantle Testnet Faucet</h2>
                <p className="text-muted-foreground mb-8">Request testnet tokens (RET) to interact with the dApp.</p>

                {status === 'minted' || cooldown > 0 ? (
                    <div className="w-full bg-secondary/10 border border-secondary/20 rounded-xl p-8 mb-4">
                        <CheckCircle2 className="text-secondary mx-auto mb-4" size={40} />
                        <h3 className="font-bold text-secondary text-xl">1,000 RET Sent!</h3>
                        <p className="text-sm text-muted-foreground mt-2">Tokens have been airdropped to your wallet.</p>
                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-yellow-500 font-mono bg-yellow-500/10 py-3 rounded-lg border border-yellow-500/20">
                            <Clock size={16} />
                            Wait: {formatTime(cooldown)}
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleRequest}
                        disabled={!isConnected || status === 'minting'}
                        className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    >
                        {status === 'minting' ? <Loader2 className="animate-spin" size={24} /> : <Droplets size={24} />}
                        {status === 'minting' ? 'Minting Tokens...' : 'Request 1,000 RET'}
                    </button>
                )}

                {!isConnected && (
                    <p className="text-sm text-red-400 mt-6 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">Please connect your wallet to claim tokens.</p>
                )}
            </div>
        </div>
    )
}
