"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Connection } from "@solana/web3.js";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string | null;
  nftMintAddress?: string | null;
};

const fetchEvent = async (id: string): Promise<Event> => {
  const res = await fetch(`/api/events/${id}`);
  if (!res.ok) throw new Error("Failed to fetch event");
  return res.json();
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [minting, setMinting] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEvent(id),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      router.push("/events");
    },
  });

  if (isLoading) return <p className="p-10 text-center">Loading event…</p>;

  if (isError || !data)
    return <p className="p-10 text-center">Event not found.</p>;

  const mintEventNFT = async () => {
    try {
      setMinting(true);

      // @ts-ignore
      const provider = window.solana;
      if (!provider?.isPhantom) {
        alert("Please install Phantom wallet");
        return;
      }

      await provider.connect();

      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );

      const metaplex = Metaplex.make(connection).use(
        walletAdapterIdentity(provider)
      );

      const { nft } = await metaplex.nfts().create({
        uri: "https://jsonplaceholder.typicode.com/posts/1",
        name: data.title,
        symbol: "EVENT",
        sellerFeeBasisPoints: 0,
      });

      const mintAddress = nft.address.toBase58();

      await fetch(`/api/events/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          nftMintAddress: mintAddress,
        }),
      });

      queryClient.invalidateQueries({ queryKey: ["event", id] });
      alert(`NFT Minted!\n${mintAddress}`);
    } catch (err) {
      console.error(err);
      alert("NFT mint failed");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push("/events")}
        className="text-sm text-gray-400 hover:text-white"
      >
        ← Back to Events
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 card overflow-hidden">
          <img
            src={data.imageUrl || "/event-placeholder.jpg"}
            className="w-full h-64 object-cover"
          />

          <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">{data.title}</h1>
            <p className="text-gray-400">{data.description}</p>

            <div className="text-sm text-gray-400">
              📍 {data.location}
              <br />
              🕒 {new Date(data.startDate).toLocaleString()} –{" "}
              {new Date(data.endDate).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Event Summary</h2>

          <div className="flex justify-between text-sm">
            <span>Total Tickets Sold</span>
            <span>—</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Revenue</span>
            <span>—</span>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <Link href={`/events/${id}/edit`} className="btn-ghost">
              Edit Event
            </Link>

            <button
              onClick={() => deleteMutation.mutate()}
              className="btn-ghost text-red-400 hover:bg-red-500/10"
            >
              Delete Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
