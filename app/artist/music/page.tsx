"use client";

import { useAccount, useReadContract } from "wagmi";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import abi from "../../../abi/SimpleVibraniom.json";

export default function ArtistMusic() {
  const { address } = useAccount();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: profile } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "profiles",
    args: [address],
  });

  useEffect(() => {
    const fetchSongs = async () => {
      if (!address) return;
      
      setLoading(true);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_ENVIO_API!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `{ musicUploaded(where: { artist: "${address}" }) { tokenId title artistName coverImage uri price streamCount } }`,
          }),
        });
        
        if (!res.ok) {
          console.warn("Envio API not available, using mock data");
          setSongs([]);
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        setSongs(data.data?.musicUploaded || []);
      } catch (err) {
        console.warn("Envio API not available:", err);
        setSongs([]);
      }
      setLoading(false);
    };

    fetchSongs();
  }, [address]);

  if (!profile || profile[0] !== 2) return <p className="text-center mt-8">Not an artist. Register on the home page.</p>;

  return (
    <div className="p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">My Music</h1>
      {loading && <p>Loading...</p>}
      {songs.length === 0 && !loading && <p>No music uploaded yet.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {songs.map((song) => (
          <div key={song.tokenId} className="border p-4 rounded">
            <img src={song.coverImage} alt={song.title} className="w-full h-32 object-cover mb-2" />
            <h3 className="font-bold">{song.title}</h3>
            <p>By {song.artistName}</p>
            <p>Price: {song.price / 1e18} $TOURS</p>
            <p>Streams: {song.streamCount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
