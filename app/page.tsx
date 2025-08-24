"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import YinYang from "../components/YinYang";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <ConnectButton />
      <h1 className="text-4xl mb-8">Welcome to Vibraniom</h1>
      <YinYang />
    </main>
  );
}
