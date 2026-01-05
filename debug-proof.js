const snarkjs = require('snarkjs')
const fs = require('fs')
const path = require('path')

async function run() {
    console.log('Starting debug script...')
    const wasmPath = path.join(process.cwd(), 'src/circuits/YieldProof_js/YieldProof.wasm')
    const zkeyPath = path.join(process.cwd(), 'src/circuits/YieldProof_final.zkey')

    console.log('Paths:', wasmPath, zkeyPath)

    if (!fs.existsSync(wasmPath)) throw new Error('Wasm missing')
    if (!fs.existsSync(zkeyPath)) throw new Error('Zkey missing')

    console.time('Load Files')
    const wasm = fs.readFileSync(wasmPath)
    const zkey = fs.readFileSync(zkeyPath)
    console.timeEnd('Load Files')

    const input = {
        revenue: "100000",
        expenses: "20000"
    }
    console.log('Input:', input)

    console.time('fullProve')
    try {
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            input,
            wasm, // passing buffer
            zkey  // passing buffer
        )
        console.log('Proof generated!')
        console.log('Public Signals:', publicSignals)
    } catch (e) {
        console.error('Error in fullProve:', e)
    }
    console.timeEnd('fullProve')
}

run().catch(console.error)
