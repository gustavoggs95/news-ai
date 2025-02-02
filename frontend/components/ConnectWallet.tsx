import { useEffect, useState } from "react";
import bs58 from "bs58";
import { jwtDecode } from "jwt-decode";

// import jwtDecode from "jwt-decode";

function checkTokenValidity(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    if (!exp) return false;
    // Compare current time to exp (in seconds)
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return exp > nowInSeconds;
  } catch {
    return false;
  }
}

const ConnectWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const autoConnectWallet = async () => {
    console.log("window.solana", window.solana);
    if (window.solana?.isPhantom) {
      try {
        // Attempt to connect without prompting the user
        const reconnectResponse = await window.solana.connect({ onlyIfTrusted: true });
        console.log("Reconnected to wallet", reconnectResponse);
        // If successful, set your wallet state
        setWalletAddress(window.solana.publicKey?.toString() || null);
      } catch (error) {
        // If the user hasn't trusted your site yet, or they've disconnected
        console.log("Auto-connect failed or user not trusted.", error);
      }
    }
  };

  useEffect(() => {
    autoConnectWallet();
    if (window.solana) {
      window.solana.on("connect", () => {
        setWalletAddress(window.solana?.publicKey?.toString() || null);
      });
      window.solana.on("disconnect", () => {
        setWalletAddress(null);
      });
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.solana) {
        alert("Phantom Wallet not found. Install it from https://phantom.app/");
        return;
      }
      const response = await window.solana.connect({});
      console.log("Connected to wallet", response);
      setWalletAddress(response.publicKey.toString());
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
  };

  // const connectWallet = async () => {
  //   if (!window.solana) {
  //     alert("Phantom (or another Solana wallet) not found.");
  //     return;
  //   }
  //   try {
  //     const response = await window.solana.connect();
  //     setWalletAddress(response.publicKey.toString());
  //   } catch (error) {
  //     console.error("Connect error:", error);
  //   }
  // };

  const signIn = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!window.solana) {
      alert("Phantom (or another Solana wallet) not found.");
      return;
    }
    try {
      // Create a message (nonce or challenge)
      const message = "Solana login challenge: " + Date.now();
      const encodedMessage = new TextEncoder().encode(message);

      // User signs the message
      const { signature } = await window.solana.signMessage(encodedMessage, "utf8");

      // Convert signature to base58
      const signatureBase58 = bs58.encode(signature);

      // Send to backend for verification
      const res = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: walletAddress,
          signature: signatureBase58,
          message,
        }),
      });
      const json = await res.json();

      if (json.success) {
        alert("You are now signed in!");
        // Possibly store a token/cookie or update app state
      } else {
        alert("Signature verification failed.");
      }
    } catch (err) {
      console.error("Sign in error:", err);
    }
  };

  const disconnectWallet = () => {
    window?.solana?.disconnect();
    setWalletAddress(null);
  };

  return (
    <div className="text-white">
      {walletAddress ? (
        <button onClick={disconnectWallet}>Disconnect ({walletAddress})</button>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      {walletAddress && <button onClick={signIn}>Sign In</button>}
    </div>
  );
};

export default ConnectWallet;
