'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Lock, CheckCircle, Loader2, ArrowRight, Shield } from 'lucide-react'

export function IssuerForm() {
    const [step, setStep] = useState('input') // input, generating, generated, submittting, submitted
    const [formData, setFormData] = useState({ revenue: '', expenses: '', date: '' })

    const handleGenerate = () => {
        setStep('generating')
        // Simulate heavy ZK computation
        setTimeout(() => {
            setStep('generated')
        }, 3000)
    }

    const handleSubmit = () => {
        setStep('submittting')
        // Simulate blockchain transaction
        setTimeout(() => {
            setStep('submitted')
        }, 2000)
    }

    const yieldAmount = formData.revenue && formData.expenses ? (parseInt(formData.revenue) - parseInt(formData.expenses)) : 0

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <AnimatePresence mode="wait">
                {step === 'input' && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-primary/20 rounded-xl">
                                <Lock className="text-primary" size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Input Yield Data (Private)</h2>
                                <p className="text-sm text-muted-foreground">Data never leaves your device unencrypted.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground">Revenue ($)</label>
                                <input
                                    type="number"
                                    value={formData.revenue}
                                    onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-lg font-mono"
                                    placeholder="e.g. 100000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground">Expenses ($)</label>
                                <input
                                    type="number"
                                    value={formData.expenses}
                                    onChange={(e) => setFormData({ ...formData, expenses: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-lg font-mono"
                                    placeholder="e.g. 20000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition dark:[color-scheme:dark]"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={!formData.revenue || !formData.expenses || !formData.date}
                            className="w-full mt-10 bg-primary text-black font-bold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                        >
                            <Calculator size={24} />
                            Generate ZK Proof
                        </button>
                    </motion.div>
                )}

                {step === 'generating' && (
                    <motion.div
                        key="generating"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-12 backdrop-blur-xl flex flex-col items-center justify-center min-h-[500px] shadow-2xl"
                    >
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                            <Loader2 size={80} className="text-primary animate-spin relative z-10" />
                        </div>
                        <h3 className="text-2xl font-bold mt-4">Generating Zero-Knowledge Proof...</h3>
                        <p className="text-muted-foreground mt-2 text-center max-w-sm">
                            Compressing financial data into a succinct cryptographic proof.
                        </p>
                    </motion.div>
                )}

                {(step === 'generated' || step === 'submittting' || step === 'submitted') && (
                    <motion.div
                        key="generated"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-secondary/20 rounded-xl">
                                <CheckCircle className="text-secondary" size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Proof Generated Successfully</h2>
                                <p className="text-sm text-muted-foreground">Ready to submit to Mantle Network.</p>
                            </div>
                        </div>

                        <div className="bg-black/40 rounded-xl p-6 space-y-4 mb-8 border border-white/5">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Asset</span>
                                <span className="font-mono font-bold">Real Estate Token (RET)</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Supply</span>
                                <span className="font-mono font-bold">1,000,000</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Proof Cost</span>
                                <span className="font-mono text-secondary">$0.002</span>
                            </div>
                            <div className="h-px bg-white/10 my-2" />
                            <div className="flex justify-between items-center text-xl">
                                <span className="text-muted-foreground">Verified Yield</span>
                                <span className="font-mono font-bold text-secondary">${yieldAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        {step === 'submitted' ? (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-full bg-secondary/20 border border-secondary/50 text-secondary font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg"
                            >
                                <Shield size={24} />
                                Yield Distributed On-Chain!
                            </motion.div>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={step === 'submittting'}
                                className="w-full bg-secondary text-black font-bold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                            >
                                {step === 'submittting' ? <Loader2 size={24} className="animate-spin" /> : <ArrowRight size={24} />}
                                {step === 'submittting' ? 'Submitting to Chain...' : 'Submit to Mantle'}
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
