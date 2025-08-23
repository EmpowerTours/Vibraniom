"use client";

import { useAccount, useWriteContract } from "wagmi";
import { useState } from "react";
import toast from "react-hot-toast";
import { parseEther } from "viem";
import abi from "../../abi/SimpleVibraniom.json";

export default function ArtistUpload() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [uri, setUri] = useState("");
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [moodCategories, setMoodCategories] = useState<string>("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!uri || !title || !artistName || !coverImage || !price) {
      toast.error("Fill all fields");
      return;
    }
    setLoading(true);
    const moods = moodCategories.split(",").map(Number).filter(n => n >= 0 && n <= 10);
    if (moodCategories && moods.length === 0) {
      toast.error("Invalid moods (0-10)");
      setLoading(false);
      return;
    }
    try {
      await writeContract({
        address: "0xFF38c9A0e766Ef4b85A00DD1400e942B49647113" as `0x${string}`,
        abi,
        functionName: "uploadMusic",
        args: [uri, title, artistName, coverImage, moods, BigInt(Number(price) * 1e18)],
        value: parseEther("1"),
      });
      toast.success("Music uploaded");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Artist Upload</h1>
      <div className="space-y-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Music URI (IPFS)"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Artist Name"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Cover Image URI (IPFS)"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Moods (comma-separated, 0-10)"
          value={moodCategories}
          onChange={(e) => setMoodCategories(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          type="number"
          placeholder="Price ($TOURS)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded w-full"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Loading..." : "Upload (1 MON)"}
        </button>
      </div>
    </div>
  );
}
