import { IssuerForm } from '@/components/issuer/IssuerForm'

export default function IssuerPage() {
    return (
        <main className="flex min-h-screen flex-col items-center pt-24 px-4 bg-background">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">Issuer Dashboard</h1>
                <p className="text-muted-foreground">Privacy-Preserving Proof Generation</p>
            </div>
            <IssuerForm />
        </main>
    )
}
