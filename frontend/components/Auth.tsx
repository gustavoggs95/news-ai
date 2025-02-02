import { useEffect, useState } from "react";
import bs58 from "bs58";
import { jwtDecode } from "jwt-decode";

const Auth = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Auto-connect the wallet if the user has already approved it
  useEffect(() => {
    // autoConnectWallet();
    // checkStoredToken();
  }, []);

  const autoConnectWallet = async () => {
    if (window.solana?.isPhantom) {
      try {
        await window.solana.connect({ onlyIfTrusted: true });
        setWalletAddress(window.solana.publicKey?.toString() || null);
      } catch (error) {
        console.log("Auto-connect failed.", error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.solana) {
      alert("Phantom Wallet not found. Install it from https://phantom.app/");
      return;
    }
    try {
      const response = await window.solana.connect({});
      setWalletAddress(response.publicKey.toString());
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
  };

  const signIn = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }
    const message = "Sign in to MyApp - " + Date.now();
    const encodedMessage = new TextEncoder().encode(message);

    try {
      if (!window.solana) {
        alert("Phantom Wallet not found. Install it from https://phantom.app/");
        return;
      }
      const signedMessage = await window.solana.signMessage(encodedMessage, "utf8");
      const signature = bs58.encode(signedMessage.signature);

      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: walletAddress,
          signature,
          message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        localStorage.setItem("authToken", result.token);
        setIsAuthenticated(true);
        alert("Successfully authenticated!");
      } else {
        alert("Authentication failed.");
      }
    } catch (error) {
      console.error("Signing failed", error);
    }
  };

  const checkStoredToken = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      // Decode the token to check expiration
      const { exp } = jwtDecode<{ exp: number }>(token);
      console.log("JWT EXP", exp);
      const currentTime = Math.floor(Date.now() / 1000);

      // If token is expired, remove it
      if (!exp || exp < currentTime) {
        console.log("Token expired, removing.");
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        return;
      }

      // If token is valid, set authentication without calling the backend
      setIsAuthenticated(true);

      // If token is close to expiration (e.g., less than 5 minutes), refresh it
      if (exp - currentTime < 300) {
        refreshToken(token);
      }
    } catch (error) {
      console.error(`Invalid token format, removing. ${error}`);
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
    }
  };

  const refreshToken = async (token: string) => {
    try {
      const res = await fetch("/api/refresh-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("authToken", data.token);
        console.log("Token refreshed!");
      } else {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error(`Failed to refresh token. ${error}`);
    }
  };

  const signOut = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setWalletAddress(null);
  };

  return (
    <div className="text-white flex">
      {!walletAddress && <button onClick={connectWallet}>Connect Wallet</button>}
      {walletAddress && !isAuthenticated && <button onClick={signIn}>Sign In</button>}
      {isAuthenticated && <button onClick={signOut}>Sign Out</button>}
      <p>{walletAddress ? `Wallet: ${walletAddress}` : "Wallet not connected"}</p>
      <p>{isAuthenticated ? "Logged in!" : "Not logged in..."}</p>
    </div>
  );
};

export default Auth;
