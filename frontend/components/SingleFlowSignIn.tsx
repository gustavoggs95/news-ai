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
  const suppressErrorRef = useRef(false);
  const hasSignedRef = useRef(false);
  const previousPublicKey = useRef<string | null>(null);

  const checkStoredToken = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      // Decode the token to check expiration
      const { exp } = jwtDecode<{ exp: number }>(token);
      const currentTime = Math.floor(Date.now() / 1000);

      // If token is expired, remove it
      if (!exp || exp < currentTime) {
        console.log("Token expired, removing.");
        localStorage.removeItem("authToken");
        disconnect();
        logout();
        return;
      }

      // If token is valid, set authentication without calling the backend

      login(user as UsersType);

      // 2 days in seconds
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
      //hasSignedRef.current = true
    }
  }, [disconnecting, logout]);

  useEffect(() => {
    const originalConsoleError = console.error;
    const errorListener = (event: ErrorEvent) => {
      if (event.message.includes("User rejected")) {
        event.preventDefault();
        disconnect();
      }
    };

    const rejectionListener = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes("User rejected")) {
        event.preventDefault();
        disconnect();
      }
    };

    console.error = (...args) => {
      if (
        suppressErrorRef.current &&
        args.some((a) => a.toString().includes(["User rejected", "Missing or invalid parameters"]))
      ) {
        return;
      }
      originalConsoleError.apply(console, args);
    };

    window.addEventListener("error", errorListener);
    window.addEventListener("unhandledrejection", rejectionListener);

    return () => {
      console.error = originalConsoleError;
      window.removeEventListener("error", errorListener);
      window.removeEventListener("unhandledrejection", rejectionListener);
      hasSignedRef.current = false;
    };
  }, [disconnect]);

  const signInWithWallet = useCallback(async () => {
    suppressErrorRef.current = true;
    try {
      if (!publicKey || !signMessage) {
        console.warn("Wallet not ready for signing");
        return;
      }

      const message = `Sign in to Flux ${Date.now()}`;
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
      suppressErrorRef.current = false;
      hasSignedRef.current = false;
    }
  }, [publicKey, signMessage, login, disconnect]);

  useEffect(() => {
    if (connected && !hasSignedRef.current && !isAuthenticated) {
      hasSignedRef.current = true;
      const timer = setTimeout(() => {
        signInWithWallet().catch(() => {});
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [connected, signInWithWallet, isAuthenticated]);

  const handleAccountChange = useCallback(() => {
    // Clear existing authentication
    localStorage.removeItem("authToken");
    logout();

    // Reset signing flags
    hasSignedRef.current = false;
  }, [logout]);

  // Add this useEffect to detect account changes
  useEffect(() => {
    if (publicKey && isAuthenticated) {
      const currentKey = publicKey.toString();

      // Check if public key has changed
      if (previousPublicKey.current && previousPublicKey.current !== currentKey) {
        console.log("Wallet account changed - requiring reauthentication");
        handleAccountChange();
      }

      // Update previous public key reference
      previousPublicKey.current = currentKey;
    }
  }, [publicKey, isAuthenticated, handleAccountChange]);

  return (
    <div>
      <CustomWalletButton authLoading={authLoading} />
    </div>
  );
}
