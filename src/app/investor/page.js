import { InvestorDashboard } from '@/components/investor/InvestorDashboard'

export default function InvestorPage() {
    return (
        <main className="flex min-h-screen flex-col items-center pt-24 px-4 bg-background">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">Investor Portal</h1>
                <p className="text-muted-foreground">Manage Holdings & Claim Yield</p>
            </div>
            <InvestorDashboard />
        </main>
    )
}
