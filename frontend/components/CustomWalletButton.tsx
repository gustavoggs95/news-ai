"use client";

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const walletMultiButtonStyle: React.CSSProperties = {
  borderRadius: 30,
};

const CustomWalletButton: React.FC = () => {
  const { publicKey, disconnect } = useWallet();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDisconnect = () => {
    disconnect();
    setDropdownOpen(false);
  };

  const handleCustomAction = () => {
    console.log("Custom action");
    setDropdownOpen(false);
  };

  return (
    <div className="relative">
      <WalletMultiButton onClick={handleDropdownToggle} style={walletMultiButtonStyle} />
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => navigator.clipboard.writeText(publicKey?.toBase58() || "")}
            >
              Copy Address
            </li>
            <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleCustomAction}>
              Custom Action
            </li>
            <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleDisconnect}>
              Disconnect
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomWalletButton;
