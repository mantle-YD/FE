'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { config } from '@/config/wagmi'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function Providers({ children }) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                    {children}
                </NextThemesProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
