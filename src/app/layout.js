import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "MA-YP | Privacy-Preserving Yield",
    description: "Real-World Assets Yield Distribution with ZK Proofs",
};

import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Providers>
                    <div className="relative min-h-screen">
                        <Navbar />
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    );
}
