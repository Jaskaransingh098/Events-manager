import { Connection, clusterApiUrl } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";

export const connection = new Connection(
    clusterApiUrl("devnet"),
    "confirmed"
);

export const getMetaplex = (wallet: any) => {
    return Metaplex.make(connection).use(wallet);
};
