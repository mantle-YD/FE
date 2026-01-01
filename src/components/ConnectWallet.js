'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { Wallet, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ConnectWallet() {
    const { address, isConnected } = useAccount()
    const { connect } = useConnect()
    const { disconnect } = useDisconnect()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    if (isConnected && address) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-primary font-mono text-sm shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
                <button
                    onClick={() => disconnect()}
                    className="ml-2 p-1 hover:text-red-400 hover:bg-red-400/10 rounded transition"
                    title="Disconnect"
                >
                    <LogOut size={14} />
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => connect({ connector: injected() })}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-black font-bold rounded-lg transition shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
            <Wallet size={18} />
            <span>Connect Wallet</span>
        </button>
    )
}
