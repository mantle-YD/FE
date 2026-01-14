import { NextResponse } from 'next/server'
import { buildMerkleTreeByPercentage } from '@/lib/buildMerkleTree'
import { getUsers } from '@/lib/userData'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const address = searchParams.get('address')?.toLowerCase()

        if (!address) {
            return NextResponse.json(
                { error: 'address parameter required' },
                { status: 400 },
            )
        }

        // Dummy: assume latest yield distribution (hardcoded untuk demo)
        const DUMMY_TOTAL_YIELD_CENTS = 190000 // $1,900

        const users = getUsers()

        // Build merkle tree (bisa disimpan di cache, tapi untuk sekarang rebuild tiap kali)
        const { proofMap } = buildMerkleTreeByPercentage(
            users,
            DUMMY_TOTAL_YIELD_CENTS,
        )

        // Cari data investor
        const investorData = proofMap[address]

        if (!investorData) {
            return NextResponse.json(
                { error: 'Investor not found in distribution' },
                { status: 404 },
            )
        }

        // Return info untuk investor
        return NextResponse.json({
            success: true,
            address,
            yieldAmount: investorData.yieldAmount, // dalam cents
            yieldUsd: Number(investorData.yieldAmount) / 100,
            percentageOwnership: investorData.percentageOwnership,
            merkleProof: investorData.merkleProof,
            retBalance: investorData.retBalance,
            // credential dummy (nanti dari database atau faucet)
            credential: {
                issuer: 'MA-YP',
                subject: address,
                claims: {
                    accredited: true,
                    jurisdiction: 'Demo',
                    kycLevel: 2,
                },
                issuedAt: new Date().toISOString(),
            },
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error', details: String(error) },
            { status: 500 },
        )
    }
}
