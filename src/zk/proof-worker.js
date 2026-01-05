const snarkjs = require('snarkjs');
const fs = require('fs');
const path = require('path');

// Helper to send error and exit
function sendError(message) {
    console.log(JSON.stringify({ error: message }));
    process.exit(1);
}

// Helper to send success and exit
function sendSuccess(data) {
    console.log(JSON.stringify(data));
    process.exit(0);
}

async function main() {
    try {
        // 1. Parse arguments
        const args = process.argv.slice(2);
        if (args.length < 2) {
            return sendError('Usage: node proof-worker.js <revenue> <expenses>');
        }

        const revenue = args[0];
        const expenses = args[1];

        // 2. Prepare paths
        // Note: process.cwd() will be the project root when spawned from Next.js
        const wasmPath = path.join(process.cwd(), 'src/circuits/YieldProof_js/YieldProof.wasm');
        const zkeyPath = path.join(process.cwd(), 'src/circuits/YieldProof_final.zkey');

        if (!fs.existsSync(wasmPath)) return sendError(`WASM not found: ${wasmPath}`);
        if (!fs.existsSync(zkeyPath)) return sendError(`ZKEY not found: ${zkeyPath}`);

        // 3. Load artifacts synchronously
        const wasmBuffer = fs.readFileSync(wasmPath);
        const zkeyBuffer = fs.readFileSync(zkeyPath);

        // 4. Prepare inputs
        const revenueCents = BigInt(Math.round(Number(revenue) * 100));
        const expensesCents = BigInt(Math.round(Number(expenses) * 100));

        const input = {
            revenue: revenueCents.toString(),
            expenses: expensesCents.toString(),
        };

        // 5. Generate Proof
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            input,
            wasmBuffer,
            zkeyBuffer
        );

        // 6. Format Output
        const yieldCentsFromCircuit = BigInt(publicSignals[0]);
        const yieldUsd = Number(yieldCentsFromCircuit) / 100;

        sendSuccess({
            proof,
            yieldCents: yieldCentsFromCircuit.toString(),
            yieldUsd,
        });

    } catch (err) {
        sendError(err.message || String(err));
    }
}

main();
