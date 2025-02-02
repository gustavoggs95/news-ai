"use client";

import React from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const CustomWalletButton: React.FC = () => {
  const { setVisible } = useWalletModal();
  const { publicKey, disconnect } = useWallet();

  const handleDisconnect = () => {
    disconnect();
  };

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
    }
  };

  const handleUserConfig = () => {
    console.log("User Config");
  };

  return (
    <div className="relative text-white">
      {publicKey ? (
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
              Options
              <IoChevronDownOutline aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            <div className="py-1">
              <MenuItem>
                <a
                  onClick={handleCopyAddress}
                  href="#"
                  className="hover:bg-black block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                >
                  Copy Address
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  onClick={() => setVisible(true)}
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                >
                  Switch Wallet
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  onClick={handleDisconnect}
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                >
                  Disconnect
                </a>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={handleUserConfig}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                >
                  User Config
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      ) : (
        <button onClick={() => setVisible(true)} className="rounded-full bg-blue-500 px-4 py-2">
          Select Wallet
        </button>
      )}
    </div>
  );
};

export default CustomWalletButton;
