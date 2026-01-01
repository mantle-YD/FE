'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Zap } from 'lucide-react'
import { ConnectWallet } from './ConnectWallet'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Zap className="text-black fill-current" size={20} />
                            </div>
                            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">MA-YP</span>
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link href="/" className="hover:text-primary transition px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                                <Link href="#" className="hover:text-primary transition px-3 py-2 rounded-md text-sm font-medium">Docs</Link>

                                <div className="relative group/dropdown">
                                    <button
                                        className="flex items-center gap-1 hover:text-primary transition px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
                                    >
                                        Launch App <ChevronDown size={14} />
                                    </button>
                                    {/* Dropdown Menu */}
                                    <div className="absolute left-0 mt-0 w-48 pt-2 opacity-0 invisible translate-y-2 group-hover/dropdown:opacity-100 group-hover/dropdown:visible group-hover/dropdown:translate-y-0 transition-all duration-200 ease-out">
                                        <div className="rounded-md shadow-lg bg-background border border-white/10 ring-1 ring-black ring-opacity-5 overflow-hidden">
                                            <Link href="/issuer" className="block px-4 py-3 text-sm hover:bg-primary/10 hover:text-primary transition-colors">
                                                <span className="block font-semibold">Issuer Dashboard</span>
                                                <span className="text-xs opacity-60">Generate ZK Proofs</span>
                                            </Link>
                                            <Link href="/investor" className="block px-4 py-3 text-sm hover:bg-primary/10 hover:text-primary transition-colors border-t border-white/5">
                                                <span className="block font-semibold">Investor Portal</span>
                                                <span className="text-xs opacity-60">Claim Yield</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/faucet" className="hover:text-primary transition px-3 py-2 rounded-md text-sm font-medium">Faucet</Link>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        <ConnectWallet />
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary">Home</Link>
                        <Link href="/issuer" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary">Issuer Dashboard</Link>
                        <Link href="/investor" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary">Investor Portal</Link>
                        <Link href="/faucet" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary">Faucet</Link>
                        <div className="flex items-center justify-between px-3 py-2 border-t border-white/10 mt-2 pt-4">
                            <span className="text-sm font-medium">Theme</span>
                            <ThemeToggle />
                        </div>
                        <div className="px-3 py-2">
                            <ConnectWallet />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
