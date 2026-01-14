import { http, createConfig } from 'wagmi'
import { mantle, mainnet, sepolia, mantleSepoliaTestnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
    chains: [mantle, mainnet, sepolia, mantleSepoliaTestnet],
    connectors: [
        injected(),
    ],
    transports: {
        [mantle.id]: http(),
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [mantleSepoliaTestnet.id]: http(),
    },
})
