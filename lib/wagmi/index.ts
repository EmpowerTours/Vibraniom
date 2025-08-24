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
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
      if (!contractAddress) throw new Error("Missing contract address");
      if (type === "listener") {
        await writeContract({
          address: contractAddress,
          abi,
          functionName: "registerAsListener",
          value: parseEther("1"),
        });
        router.push("/listener");
      } else {
        await writeContract({
          address: contractAddress,
          abi,
          functionName: "registerAsArtist",
        });
        router.push("/artist");
      }
      toast.success(`Registered as ${type}`);
    } catch (err) {
      console.error(err);
      toast.error("Registration failed");
    }
    setLoading(false);
  };

  return (
    <>
      <button onClick={() => handleRegister("listener")} className="yin" disabled={loading}>
        Click black (Yin) for Listener
      </button>
      <button onClick={() => handleRegister("artist")} className="yang" disabled={loading}>
        Click white (Yang) for Artist
      </button>
      {loading && <div>Loading...</div>}
    </>
  );
}
