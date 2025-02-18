"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { jwtDecode } from "jwt-decode";
import { useUserStore } from "store/userStores";
import { AuthenticateResponse } from "types/api";
import { UsersType } from "types/supabase";
import CustomWalletButton from "./CustomWalletButton";

export default function SingleFlowSignIn() {
  const { publicKey, signMessage, connected, disconnect, disconnecting } = useWallet();
  const { login, isAuthenticated, logout, user } = useUserStore();
  const [authLoading, setAuthLoading] = useState(false);
  const hasSignedRef = useRef(false);
  const previousPublicKey = useRef<string | null>(null);

  const checkStoredToken = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (!exp || exp < currentTime) {
        console.log("Token expired, removing.");
        localStorage.removeItem("authToken");
        disconnect();
        logout();
        return;
      }

      login(user as UsersType);

      if (exp - currentTime < 172800) {
        refreshToken(token);
      }
    } catch (error) {
      console.log(`Invalid token format, removing. ${error}`);
      localStorage.removeItem("authToken");
      logout();
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
        logout();
      }
    } catch (error) {
      console.log(`Failed to refresh token. ${error}`);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      login(user);
      checkStoredToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (disconnecting) {
      localStorage.removeItem("authToken");
      logout();
    }
  }, [disconnecting, logout]);

  const signInWithWallet = useCallback(async () => {
    try {
      if (!publicKey || !signMessage) {
        console.warn("Wallet not ready for signing");
        return;
      }

      // Set a flag to prevent other tabs from signing
      const timestamp = Date.now();
      localStorage.setItem("signingInProgress", timestamp.toString());

      const message = `Sign in to Flux ${timestamp}`;
      const encodedMessage = new TextEncoder().encode(message);

      const signatureBytes = await signMessage(encodedMessage);
      const signature = bs58.encode(signatureBytes);

      setAuthLoading(true);
      const res = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: publicKey.toString(),
          signature,
          message,
        }),
      });

      const { success, error, token, user: userResponse }: AuthenticateResponse = await res.json();
      console.log({ success, error, token, user: userResponse });
      if (success && token) {
        localStorage.setItem("authToken", token);
        login(userResponse || null);
        console.log("Authentication successful");
      } else {
        console.log("Authentication failed:", error);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("rejected")) {
        disconnect();
        console.log("User rejected signing request");
      } else {
        console.error("Sign-in error:", error);
      }
    } finally {
      setAuthLoading(false);
      hasSignedRef.current = false;
      localStorage.removeItem("signingInProgress");
    }
  }, [publicKey, signMessage, login, disconnect]);

  useEffect(() => {
    if (connected && !hasSignedRef.current && !isAuthenticated) {
      hasSignedRef.current = true;
      const timer = setTimeout(() => {
        // Check if another tab is already signing
        const signingInProgress = localStorage.getItem("signingInProgress");
        if (signingInProgress) {
          const timestamp = parseInt(signingInProgress);
          // If the signing process is more than 30 seconds old, consider it stale
          if (Date.now() - timestamp > 30000) {
            localStorage.removeItem("signingInProgress");
          } else {
            // Another tab is handling the signing
            return;
          }
        }
        signInWithWallet().catch(() => {});
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [connected, signInWithWallet, isAuthenticated]);

  const handleAccountChange = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("signingInProgress");
    logout();
    hasSignedRef.current = false;
  }, [logout]);

  useEffect(() => {
    if (publicKey && isAuthenticated) {
      const currentKey = publicKey.toString();

      if (previousPublicKey.current && previousPublicKey.current !== currentKey) {
        console.log("Wallet account changed - requiring reauthentication");
        handleAccountChange();
      }

      previousPublicKey.current = currentKey;
    }
  }, [publicKey, isAuthenticated, handleAccountChange]);

  // Listen for storage changes from other tabs (this will fix the change wallet with another tab opened issue)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" && e.newValue) {
        checkStoredToken();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <CustomWalletButton authLoading={authLoading} />
    </div>
  );
}
