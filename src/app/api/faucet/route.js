
import { NextResponse } from 'next/server'
import { addUser } from '@/lib/userData'

export async function POST(request) {
    try {
        const { address } = await request.json()
        if (!address) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 })
        }

        // 1. Tambahkan ke database (mock)
        const newUser = {
            address,
            retTokenBalance: 80000,
            percentageOwnership: 5 // Default 5% for new users (this is just mock logic)
        }

        addUser(newUser)

        // 2. Generate Credential (Mock)
        // Disini kita generate signature seolah-olah dari issuer
        // Note: Di production, ini pakai private key issuer beneran
        const credential = {
            issuer: 'MA-YP Demo Issuer',
            subject: address,
            claims: {
                accredited: true,
                jurisdiction: 'Non-Sanctioned',
                kycLevel: 2,
            },
            issuedAt: new Date().toISOString(),
            expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            version: 1,
        }

        // Mock signature (nanti diganti real signature dari CredentialVerifier logic)
        // Untuk demo, frontend cuma butuh object ini

        return NextResponse.json({
            success: true,
            message: 'Tokens minted and credential issued',
            credential,
            user: newUser
        })

    } catch (error) {
        console.error('Faucet API Error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
