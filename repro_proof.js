const snarkjs = require('snarkjs')
const path = require('path')

const wasmPath = path.join(process.cwd(), 'circuits', 'CredentialDemo_js', 'CredentialDemo.wasm')
const zkeyPath = path.join(process.cwd(), 'circuits', 'CredentialDemo_final.zkey')

console.log('Waring: Starting proof generation...')
console.log('WASM:', wasmPath)
console.log('ZKEY:', zkeyPath)

const input = {
    accreditedFlag: '1',
    investorAddress: '319699665809710383792683058864700870901', // Converted 0x0... to decimal
}

async function run() {
    const startTime = Date.now()
    try {
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            input,
            wasmPath,
            zkeyPath,
        )
        const endTime = Date.now()
        console.log('Proof generated successfully!')
        console.log('Time taken:', (endTime - startTime) / 1000, 'seconds')
    } catch (e) {
        console.error('Error:', e)
    }
}

run()
