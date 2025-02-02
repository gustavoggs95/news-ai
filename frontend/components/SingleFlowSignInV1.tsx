import { useCallback, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58";

const walletMultiButtonStyle: React.CSSProperties = {
  borderRadius: 30,
};

export default function SingleFlowSignIn() {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const suppressErrorRef = useRef(false);
  const hasSignedRef = useRef(false);

  // Nuclear error suppression with cleanup
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
      if (suppressErrorRef.current && args.some((a) => a.toString().includes("User rejected"))) {
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
      hasSignedRef.current = false; // Reset on unmount
    };
  }, [disconnect]);

  const signInWithWallet = useCallback(async () => {
    suppressErrorRef.current = true;
    try {
      if (!publicKey || !signMessage) {
        console.warn("Wallet not ready for signing");
        return;
      }

      const message = `Sign in to MyApp ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);

      const signatureBytes = await signMessage(encodedMessage);
      const signature = bs58.encode(signatureBytes);

      const res = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: publicKey.toString(),
          signature,
          message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("authToken", data.token);
        console.log("Authentication successful");
      } else {
        console.error("Authentication failed:", data.error);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("rejected")) {
        disconnect();
        console.log("User rejected signing request");
      } else {
        console.error("Sign-in error:", error);
      }
    } finally {
      suppressErrorRef.current = false;
      hasSignedRef.current = false; // Allow future attempts
    }
  }, [publicKey, signMessage]);

  // Auto-sign handler with debouncing
  useEffect(() => {
    if (connected && !hasSignedRef.current) {
      hasSignedRef.current = true;
      const timer = setTimeout(() => {
        signInWithWallet().catch(() => {});
      }, 1000); // 1-second delay to ensure wallet is ready

      return () => clearTimeout(timer);
    }
  }, [connected, signInWithWallet]);

  return (
    <div>
      <WalletMultiButton style={walletMultiButtonStyle} />
      {/* <BaseWalletConnectButton
        onClick={signInWithWallet}
        labels={{
          connected: "Connected",
          connecting: "Connected",
          "has-wallet": "Connected",
          "no-wallet": "Connected",
        }}
      /> */}
    </div>
  );
}
