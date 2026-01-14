import { NextResponse } from 'next/server'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const snarkjs = require('snarkjs')
const path = require('path')

export async function POST(request) {
    try {
        const { address } = await request.json()

        if (!address) {
            return NextResponse.json(
                { error: 'address required' },
                { status: 400 },
            )
        }

        // 1. Get investor info (panggil internal API atau ambil dari DB)
        const infoRes = await fetch(
            `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/investor/info?address=${address}`,
        )
        const infoData = await infoRes.json()

        if (!infoData.success) {
            return NextResponse.json(
                { error: 'Investor not found' },
                { status: 404 },
            )
        }

        // 2. Generate credential ZK proof
        const wasmPath = path.join(
            process.cwd(),
            'circuits',
            'CredentialDemo_js',
            'CredentialDemo.wasm',
        )
        const zkeyPath = path.join(
            process.cwd(),
            'circuits',
            'CredentialDemo_final.zkey',
        )

        console.log('Generating credential proof for', address)

        console.log('Generating credential proof options:', {
            wasmPath,
            zkeyPath,
            input: {
                accreditedFlag: '1',
                investorAddress: BigInt(address).toString(),
            }
        })

        const timeStart = Date.now()
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            {
                accreditedFlag: '1',
                investorAddress: BigInt(address).toString(),
            },
            wasmPath,
            zkeyPath,
        )
        const timeEnd = Date.now()
        console.log(`Proof generated in ${(timeEnd - timeStart) / 1000}s`)

        console.log('Credential proof generated')
        console.log('publicSignals:', publicSignals)

        // 3. Return claim data
        return NextResponse.json({
            success: true,
            address,
            yieldAmount: infoData.yieldAmount,
            yieldUsd: infoData.yieldUsd,
            merkleProof: infoData.merkleProof,
            credentialProof: {
                piA: proof.pi_a,
                piB: proof.pi_b,
                piC: proof.pi_c,
            },
            publicSignals,
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Proof generation failed', details: String(error) },
            { status: 500 },
        )
    }
}
