"use client";

import { useAccount } from "wagmi";
import YinYang from "../components/YinYang";

export default function Home() {
  const { address } = useAccount();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {!address && (
        <div className="mb-8">
          <w3m-button />
        </div>
      )}
      <h1 className="text-4xl mb-8">Welcome to Vibraniom</h1>
      {address && <YinYang />}
    </main>
  );
}
