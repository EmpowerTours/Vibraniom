"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { parseEther } from "viem";
import abi from "../../abi/SimpleVibraniom.json";

export default function ListenerDashboard() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [moods, setMoods] = useState<string>("");
  const [recommendations, setRecommendations] = useState<number[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [tokenId, setTokenId] = useState(0);
  const [loading, setLoading] = useState(false);

  const { data: profile } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "profiles",
    args: [address],
  });

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_ENVIO_API!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "{ musicUploaded { tokenId title artistName coverImage uri price streamCount } }" }),
        });
        
        if (!res.ok) {
          console.warn("Envio API not available, using mock data");
          // Use mock data since indexer is not deployed
          setSongs([]);
          return;
        }
        
        const data = await res.json();
        setSongs(data.data?.musicUploaded || []);
      } catch (err) {
        console.warn("Envio API not available:", err);
        setSongs([]); // Set empty array for now
      }
    };

    fetchSongs();
  }, []);

  const handleUpdateMoods = async () => {
    if (!moods) return toast.error("Enter moods");
    setLoading(true);
    const moodArray = moods.split(",").map(Number).filter(n => n >= 0 && n <= 10);
    if (moodArray.length === 0) {
      toast.error("Invalid moods");
      setLoading(false);
      return;
    }
    try {
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: "updateMoods",
        args: [moodArray],
      });
      toast.success("Moods updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update moods");
    }
    setLoading(false);
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const { data: recs } = await useReadContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: "recommendMusic",
        args: [address],
      });
      setRecommendations((recs as number[]) || []);
      toast.success("Recommendations fetched");
    } catch (err) {
      toast.error("Failed to fetch recommendations");
    }
    setLoading(false);
  };

  const handleStream = async (id: number) => {
    setLoading(true);
    try {
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: "streamMusic",
        args: [id],
      });
      toast.success("Streamed");
    } catch (err: any) {
      toast.error(err.message || "Failed to stream");
    }
    setLoading(false);
  };

  const handleRate = async (id: number, emoji: number) => {
    setLoading(true);
    try {
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: "rateMusic",
        args: [id, emoji],
      });
      toast.success("Rated");
    } catch (err: any) {
      toast.error(err.message || "Failed to rate");
    }
    setLoading(false);
  };

  const handlePurchase = async (id: number) => {
    setLoading(true);
    try {
      await writeContract({
        address: "0xFF38c9A0e766Ef4b85A00DD1400e942B49647113" as `0x${string}`,
        abi,
        functionName: "purchaseMusic",
        args: [id],
      });
      toast.success("Purchased");
    } catch (err: any) {
      toast.error(err.message || "Failed to purchase");
    }
    setLoading(false);
  };

  const handleRenew = async () => {
    setLoading(true);
    try {
      await writeContract({
        address: "0xFF38c9A0e766Ef4b85A00DD1400e942B49647113" as `0x${string}`,
        abi,
        functionName: "renewSubscription",
        value: parseEther("0.033"),
      });
      toast.success("Subscription renewed");
    } catch (err: any) {
      toast.error(err.message || "Failed to renew");
    }
    setLoading(false);
  };

  if (!profile || profile[0] !== 1) return <p className="text-center mt-8">Not a listener. Register on the home page.</p>;

  return (
    <div className="p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Listener Dashboard</h1>
      <div className="mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Moods (comma-separated, 0-10)"
          value={moods}
          onChange={(e) => setMoods(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded mt-2"
          onClick={handleUpdateMoods}
          disabled={loading}
        >
          {loading ? "Loading..." : "Update Moods"}
        </button>
      </div>
      <button
        className="bg-green-500 text-white p-2 rounded mb-4"
        onClick={fetchRecommendations}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Recommendations"}
      </button>
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Recommended Songs</h2>
          <ul className="list-disc pl-5">
            {recommendations.map((id) => (
              <li key={id}>Song ID: {id}</li>
            ))}
          </ul>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-2">Available Songs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {songs.map((song) => (
          <div key={song.tokenId} className="border p-4 rounded">
            <img src={song.coverImage} alt={song.title} className="w-full h-32 object-cover mb-2" />
            <h3 className="font-bold">{song.title}</h3>
            <p>By {song.artistName}</p>
            <p>Price: {song.price / 1e18} $TOURS</p>
            <p>Streams: {song.streamCount}</p>
            <div className="flex space-x-2 mt-2">
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={() => handleStream(song.tokenId)}
                disabled={loading}
              >
                Stream
              </button>
              <button
                className="bg-yellow-500 text-white p-2 rounded"
                onClick={() => handleRate(song.tokenId, 0)}
                disabled={loading}
              >
                Rate (👍)
              </button>
              {song.price > 0 && (
                <button
                  className="bg-green-500 text-white p-2 rounded"
                  onClick={() => handlePurchase(song.tokenId)}
                  disabled={loading}
                >
                  Purchase
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        className="bg-purple-500 text-white p-2 rounded mt-4"
        onClick={handleRenew}
        disabled={loading}
      >
        {loading ? "Loading..." : "Renew Subscription (0.033 MON)"}
      </button>
    </div>
  );
}
