import { PublicKey, Transaction } from "@solana/web3.js";

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      publicKey?: PublicKey;
      connect: ({ onlyIfTrusted }: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signTransaction?: (transaction: Transaction) => Promise<Transaction>;
      signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
      signMessage: (message: Uint8Array, display?: "utf8") => Promise<{ signature: Uint8Array; publicKey: PublicKey }>;
      on: (event: string, handler: (args: unknown) => void) => void;
    };
  }
}

export {};
