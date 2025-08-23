import type { Metadata } from "next";
import "./globals.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "../lib/wagmi";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: "Vibraniom App",
  description: "Music recommendation app on Monad",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <header className="bg-blue-600 text-white p-4">
                <nav className="flex justify-between items-center max-w-4xl mx-auto">
                  <Link href="/" className="text-xl font-bold">Vibraniom</Link>
                  <div className="space-x-4">
                    <Link href="/listener">Listener</Link>
                    <Link href="/artist">Artist Upload</Link>
                    <Link href="/artist/music">My Music</Link>
                  </div>
                </nav>
              </header>
              <main className="max-w-4xl mx-auto p-4">{children}</main>
              <Toaster />
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
