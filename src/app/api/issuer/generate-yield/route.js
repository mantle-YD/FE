
// app/api/issuer/generate-yield/route.js
import { NextResponse } from 'next/server'
import { generateYieldProof } from '@/lib/generateYieldProof'
import { buildMerkleTreeByPercentage } from '@/lib/buildMerkleTree'
import { getUsers } from '@/lib/userData'

export async function POST(request) {
  try {
    const { revenue, expenses, date } = await request.json()
    console.log('API HIT', revenue, expenses, date)
    /*
    console.time('api-handler')
    const { proof, yieldCents, yieldUsd } = await generateYieldProof(
      Number(revenue),
      Number(expenses),
    )
    console.timeEnd('api-handler')
    
    */
    const revenueCents = Math.round(Number(revenue) * 100)
    const expensesCents = Math.round(Number(expenses) * 100)
    const yieldCents = revenueCents - expensesCents
    const yieldUsd = yieldCents / 100

    const users = getUsers()

    console.log(
      'Building Merkle tree for',
      users.length,
      'investors with percentage-based allocation',
    )

    const { root, investorCount, proofMap } = buildMerkleTreeByPercentage(
      users,
      yieldCents,
    )

    console.log('Merkle root:', root)
    console.log('Investor count:', investorCount)

    return NextResponse.json({
      success: true,
      date,
      yieldUsd,
      yieldCents,
      merkleRoot: root,
      investorCount
      //proof,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: String(error) },
      { status: 500 },
    )
  }
}

  /*
    // 1) Circom proof
    const { proof, yieldCents, yieldUsd } = await generateYieldProof(revenue, expenses)
  
    // 2) Merkle tree
    //const { merkleRoot, totalWeight } = await buildMerkleTree()
  
    // 3) On-chain
    //const { txHash, batchId } = await submitYieldToContract(
    //proof,
    //yieldCents,
    //merkleRoot,
    //totalWeight
    //)
  
  
    return NextResponse.json({
      success: true,
      //yieldUsd,
      //yieldCents,
      //merkleRoot,
      //totalWeight,
      //txHash,
      //batchId,
    })
      */

//}
