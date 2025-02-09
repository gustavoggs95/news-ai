// /app/layout.tsx
import AppWalletProvider from "components/AppWalletProvider";
import "../styles/globals.css";

// Use the metadata export to set head metadata globally
export const metadata = {
  title: "Flux",
  icons: {
    icon: "/images/flux-small.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* If AppWalletProvider is a client component, it should have "use client" at its top */}
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}
