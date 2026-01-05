import * as snarkjs from 'snarkjs'
import fs from 'fs'
import path from 'path'

export async function generateYieldProof() {
    const revenue = 100
    const expenses = 50
    console.log('generateYieldProof called with:', { revenue, expenses })

    // Convert to cents
    const revenueCents = BigInt(Math.round(revenue * 100))
    const expensesCents = BigInt(Math.round(expenses * 100))

    // Construct paths
    const wasmPath = path.join(process.cwd(), 'src/circuits/YieldProof_js/YieldProof.wasm')
    const zkeyPath = path.join(process.cwd(), 'src/circuits/YieldProof_final.zkey')

    console.log('Loading artifacts from:', { wasmPath, zkeyPath })

    // Check existence
    if (!fs.existsSync(wasmPath)) throw new Error(`WASM not found at ${wasmPath}`)
    if (!fs.existsSync(zkeyPath)) throw new Error(`zkey not found at ${zkeyPath}`)

    // Read files
    // Using sync read to ensure they are fully loaded before passing to snarkjs
    // This matches the working debug-proof.js logic
    const wasmBuffer = fs.readFileSync(wasmPath)
    const zkeyBuffer = fs.readFileSync(zkeyPath)

    console.log('Artifacts loaded into memory. Buffer sizes:', {
        wasm: wasmBuffer.length,
        zkey: zkeyBuffer.length
    })

    console.time('fullProve-lib')
    try {
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            {
                revenue: revenueCents.toString(),
                expenses: expensesCents.toString(),
            },
            wasmBuffer,
            zkeyBuffer,
        )
        console.timeEnd('fullProve-lib')

        const yieldCentsFromCircuit = BigInt(publicSignals[0])
        const yieldUsd = Number(yieldCentsFromCircuit) / 100

        return {
            proof,
            yieldCents: yieldCentsFromCircuit.toString(),
            yieldUsd,
        }
    } catch (error) {
        console.error('Error in snarkjs.groth16.fullProve:', error)
        throw error
    }
}




/*
import * as snarkjs from 'snarkjs'
import path from 'path'

export async function generateYieldProof(revenue, expenses) {
    // ubah ke cents (kalau input kamu dalam dolar)
    const revenueCents = BigInt(Math.round(revenue * 100))
    const expensesCents = BigInt(Math.round(expenses * 100))
    //const yieldCents = revenueCents - expensesCents

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

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        {
            revenue: revenueCents.toString(),
            expenses: expensesCents.toString(),
            //yieldCents: yieldCents.toString(), // karena di circuit yieldCents adalah input public
        },
        wasmPath,
        zkeyPath,
    )
    const yieldCentsFromCircuit = BigInt(publicSignals[0])
    const yieldUsd = Number(yieldCentsFromCircuit) / 100

    return {
        proof,
        publicSignals,
        yieldCents: yieldCentsFromCircuit.toString(),
        yieldUsd,
    }
}



/*
import * as snarkjs from 'snarkjs'
//import fs from 'fs'
import path from 'path'

export async function generateYieldProof(revenue, expenses) {
    const input = {
        revenue: BigInt(revenue),
        expenses: BigInt(expenses),
    }

    const wasmPath = path.join(process.cwd(), 'circuits', 'YieldProof_js', 'YieldProof.wasm')
    const zkeyPath = path.join(process.cwd(), 'circuits', 'YieldProof_final.zkey')

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        input,
        wasmPath,
        zkeyPath,
    )

    // misal publicSignals[0] = net yield dalam cents
    const yieldCents = BigInt(publicSignals[0])
    const yieldUsd = Number(yieldCents) / 100

    return { proof, yieldCents, yieldUsd }
}

*/
