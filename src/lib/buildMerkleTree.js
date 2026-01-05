// src/lib/buildMerkleTree.js
import { MerkleTree } from 'merkletreejs'
import { keccak256 } from 'viem'

export function buildMerkleTreeByPercentage(investorsWithBalance, totalYieldCents) {
    // investorsWithBalance: array of { address, retTokenBalance, percentageOwnership }
    // totalYieldCents: total yield yang dibagi sesuai persentase ownership

    if (investorsWithBalance.length === 0) {
        throw new Error('No investors')
    }

    // Validasi total percentage = 100
    const totalPercentage = investorsWithBalance.reduce(
        (sum, inv) => sum + inv.percentageOwnership,
        0,
    )
    if (Math.abs(totalPercentage - 100) > 0.01) {
        console.warn(`Total percentage: ${totalPercentage}%, not 100%`)
    }

    // Hitung yield per investor berdasarkan percentage
    const leaves = []
    const proofs = {}
    let accumulatedYield = 0n

    investorsWithBalance.forEach((investor, index) => {
        // Hitung porsi yield berdasarkan persentase
        const yieldForInvestor = BigInt(
            Math.floor(
                (Number(totalYieldCents) * investor.percentageOwnership) / 100,
            ),
        )

        accumulatedYield += yieldForInvestor

        // Leaf = hash(address + yieldAmount)
        const leaf = keccak256(
            Buffer.concat([
                Buffer.from(investor.address.slice(2), 'hex'),
                Buffer.from(yieldForInvestor.toString(16).padStart(64, '0'), 'hex'),
            ]),
        )

        leaves.push(leaf)

        // Simpan data untuk reference
        proofs[investor.address.toLowerCase()] = {
            yieldAmount: yieldForInvestor.toString(),
            percentageOwnership: investor.percentageOwnership,
            retBalance: investor.retTokenBalance,
        }
    })

    // Handle rounding remainder (karena pembulatan, mungkin ada selisih kecil)
    const remainder = BigInt(totalYieldCents) - accumulatedYield
    if (remainder > 0n) {
        // Tambah ke investor pertama
        const firstInvestor = investorsWithBalance[0]
        const currentAmount = BigInt(
            Math.floor(
                (Number(totalYieldCents) * firstInvestor.percentageOwnership) / 100,
            ),
        )
        const newAmount = currentAmount + remainder

        proofs[firstInvestor.address.toLowerCase()].yieldAmount = newAmount.toString()

        // Update leaf pertama
        leaves[0] = keccak256(
            Buffer.concat([
                Buffer.from(firstInvestor.address.slice(2), 'hex'),
                Buffer.from(newAmount.toString(16).padStart(64, '0'), 'hex'),
            ]),
        )
    }

    // Build Merkle tree
    const tree = new MerkleTree(leaves, keccak256, {
        sortPairs: true,
        hashLeaves: false,
    })

    const root = tree.getRoot().toString('hex')

    // Generate proof untuk setiap investor
    const proofMap = {}
    investorsWithBalance.forEach((investor, index) => {
        const proof = tree.getProof(leaves[index])
        proofMap[investor.address.toLowerCase()] = {
            ...proofs[investor.address.toLowerCase()],
            merkleProof: proof.map((p) => '0x' + p.data.toString('hex')),
        }
    })

    return {
        root: '0x' + root,
        investorCount: investorsWithBalance.length,
        investorsWithBalance,
        proofMap, // { address: { yieldAmount, merkleProof, ... } }
        totalYieldCents,
    }
}
