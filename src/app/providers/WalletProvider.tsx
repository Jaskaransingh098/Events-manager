"use client";

import { createContext, useContext, useEffect, useState } from "react";

type WalletContextType = {
  wallet: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("wallet");
    if (saved) setWallet(saved);
  }, []);

  const connect = async () => {
    // @ts-ignore
    const provider = window.solana;
    if (!provider?.isPhantom) {
      alert("Please install Phantom Wallet");
      return;
    }

    const res = await provider.connect();
    const address = res.publicKey.toBase58();

    // 🔐 Sign message (login)
    const message = "Sign in to Events Manager";
    const encoded = new TextEncoder().encode(message);
    const signed = await provider.signMessage(encoded, "utf8");

    // verify on backend
    const verify = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet: address,
        message,
        signature: Array.from(signed.signature),
      }),
    });

    if (!verify.ok) {
      alert("Wallet verification failed");
      return;
    }

    localStorage.setItem("wallet", address);
    setWallet(address);
  };

  const disconnect = () => {
    localStorage.removeItem("wallet");
    setWallet(null);
  };

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be inside WalletProvider");
  return ctx;
}
