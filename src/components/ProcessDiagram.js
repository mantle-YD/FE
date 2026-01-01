'use client'

import { motion } from 'framer-motion'
import { Database, FileKey, Blocks, ArrowRight } from 'lucide-react'

export function ProcessDiagram() {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-12 w-full max-w-4xl mx-auto">
            <Step
                icon={Database}
                label="Real-World Data"
                subtext="Revenue & Expenses"
                delay={0.2}
                color="text-blue-400"
                bg="bg-blue-400/5"
                border="border-blue-400/20"
            />

            <Arrow delay={0.6} />

            <Step
                icon={FileKey}
                label="ZK Proof Generation"
                subtext="Privacy-Preserved"
                delay={1.0}
                isActive
                color="text-primary"
                bg="bg-primary/10"
                border="border-primary/50"
                glow
            />

            <Arrow delay={1.4} />

            <Step
                icon={Blocks}
                label="Blockchain Settlement"
                subtext="Verified Yield"
                delay={1.8}
                color="text-secondary"
                bg="bg-secondary/5"
                border="border-secondary/20"
            />
        </div>
    )
}

function Step({ icon: Icon, label, subtext, delay, isActive, color, bg, border, glow }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6, type: "spring" }}
            className={`relative flex flex-col items-center p-8 rounded-2xl border ${bg} ${border} backdrop-blur-sm transition-all duration-300 hover:scale-105 ${glow ? 'shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-primary/30' : ''}`}
        >
            <div className={`p-4 rounded-full ${isActive ? 'bg-black/40' : 'bg-black/20'} mb-4`}>
                <Icon size={32} className={color} />
            </div>
            <span className={`text-lg font-bold ${color}`}>{label}</span>
            <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{subtext}</span>

            {/* Animated line for active step */}
            {isActive && (
                <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}
        </motion.div>
    )
}

function Arrow({ delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, x: -10 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.4 }}
            className="rotate-90 md:rotate-0 text-muted-foreground/50"
        >
            <ArrowRight size={24} />
        </motion.div>
    )
}
