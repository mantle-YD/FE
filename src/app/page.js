import Link from 'next/link'
import { ProcessDiagram } from '@/components/ProcessDiagram'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center pt-20 pb-12 px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/50 via-background to-background">

            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">


                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 dark:from-white dark:to-slate-500">
                    Privacy-Preserving <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Yield Distribution</span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Prove yield integrity without revealing operational data.
                    Maintain compliance and trust with Zero-Knowledge Proofs.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <Link href="/investor">
                        <button className="h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-black font-bold text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2">
                            Launch as INVESTOR
                            <ArrowRight size={18} />
                        </button>
                    </Link>
                    <Link href="/issuer">
                        <button className="h-12 px-8 rounded-full border border-white/20 hover:bg-white/5 text-foreground font-medium text-lg transition-all hover:scale-105 flex items-center gap-2">
                            Launch as ISSUER
                            <ShieldCheck size={18} />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Diagram Section */}
            <div className="w-full mt-0 px-4">
                <ProcessDiagram />
            </div>
        </main>
    );
}
