"use client";

import { useAccount, useWriteContract } from "wagmi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { parseEther } from "viem";
import abi from "../abi/SimpleVibraniom.json";

export default function YinYang() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (type: "listener" | "artist") => {
    if (!address) return toast.error("Connect wallet first");
    setLoading(true);
    try {
      if (type === "listener") {
        await writeContract({
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
          abi,
          functionName: "registerAsListener",
          value: parseEther("1"),
        });
        router.push("/listener");
      } else {
        await writeContract({
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
          abi,
          functionName: "registerAsArtist",
        });
        router.push("/artist");
      }
      toast.success(`Registered as ${type}`);
    } catch (err) {
      toast.error("Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="yin-yang">
        <div className="yin" onClick={() => handleRegister("listener")}></div>
        <div className="yang" onClick={() => handleRegister("artist")}></div>
      </div>
      <p className="mt-4 text-center">Click black (Yin) for Listener<br />Click white (Yang) for Artist</p>
      {loading && <p className="mt-2">Loading...</p>}
    </div>
  );
}
