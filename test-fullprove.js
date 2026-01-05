// test-fullprove.js
import * as snarkjs from 'snarkjs'
import fs from 'fs/promises'
import path from 'path'

let wasmBuffer = null
let zkeyBuffer = null

async function loadArtifacts() {
    if (!wasmBuffer || !zkeyBuffer) {
        const wasmPath = path.join(
            process.cwd(),
            'src',
            'circuits',

            'YieldProof_js',
            'YieldProof.wasm',
        )
        const zkeyPath = path.join(
            process.cwd(),
            'src',
            'circuits',

            'YieldProof_final.zkey',
        )

        const [wasm, zkey] = await Promise.all([
            fs.readFile(wasmPath),
            fs.readFile(zkeyPath),
        ])

        wasmBuffer = wasm
        zkeyBuffer = zkey

        console.log('Artifacts loaded')
    }
}

async function main() {
    await loadArtifacts()

    const revenue = 1000  // contoh angka (dolar)
    const expenses = 300

    const revenueCents = BigInt(Math.round(revenue * 100))
    const expensesCents = BigInt(Math.round(expenses * 100))

    console.log('INPUTS READY', revenueCents.toString(), expensesCents.toString())

    console.time('fullProve')
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        {
            revenue: revenueCents.toString(),
            expenses: expensesCents.toString(),
        },
        wasmBuffer,
        zkeyBuffer,
    )
    console.timeEnd('fullProve')

    console.log('publicSignals:', publicSignals)

    const yieldCentsFromCircuit = BigInt(publicSignals[0])
    const yieldUsd = Number(yieldCentsFromCircuit) / 100
    console.log('proof', proof)
    console.log('publicSignals', publicSignals)
    console.log('yieldCents:', yieldCentsFromCircuit.toString())
    console.log('yieldUsd:', yieldUsd)
}

main().catch((e) => {
    console.error('ERROR in test-fullprove:', e)
})
