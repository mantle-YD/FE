import { http, createConfig } from 'wagmi'
import { mantle, mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
    chains: [mantle, mainnet, sepolia],
    connectors: [
        injected(),
    ],
    transports: {
        [mantle.id]: http(),
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
})
