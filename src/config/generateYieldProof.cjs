// zk/generateYieldProof.cjs
const snarkjs = require('snarkjs')
const fs = require('fs').promises
const path = require('path')

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

        console.log('Artifacts loaded (cjs)')
    }
}

async function generateYieldProof(revenue, expenses) {
    await loadArtifacts()

    const revenueCents = BigInt(Math.round(revenue * 100))
    const expensesCents = BigInt(Math.round(expenses * 100))

    console.log(
        'INPUTS READY (cjs)',
        revenueCents.toString(),
        expensesCents.toString(),
    )

    console.time('fullProve-cjs')
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        {
            revenue: revenueCents.toString(),
            expenses: expensesCents.toString(),
        },
        wasmBuffer,
        zkeyBuffer,
    )
    console.timeEnd('fullProve-cjs')

    const yieldCentsFromCircuit = BigInt(publicSignals[0])
    const yieldUsd = Number(yieldCentsFromCircuit) / 100

    return {
        proof,
        yieldCents: yieldCentsFromCircuit.toString(),
        yieldUsd,
    }
}

module.exports = { generateYieldProof }
