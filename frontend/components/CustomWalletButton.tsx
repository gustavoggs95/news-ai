"use client";

import React from "react";
import { CgProfile } from "react-icons/cg";
import { GoArrowSwitch } from "react-icons/go";
import { IoCopyOutline } from "react-icons/io5";
import { SiSolana } from "react-icons/si";
import { VscDebugDisconnect } from "react-icons/vsc";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useModalStore } from "store/modalStore";
import { useUserStore } from "store/userStores";
import Loader from "./Loader";

export default function CustomWalletButton({ authLoading }: { authLoading: boolean }) {
  const { setVisible } = useWalletModal();
  const { publicKey, disconnect } = useWallet();
  const { openProfileModal } = useModalStore();
  const { user } = useUserStore();
  const handleDisconnect = () => {
    disconnect();
  };

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
    }
  };

  const fullKey = user?.public_address || publicKey?.toBase58();
  const minifiedKey = fullKey ? `${fullKey.slice(0, 4)}...${fullKey.slice(-4)}` : null;
  const walletUserLabel = user?.username || minifiedKey;

  return (
    <div className="relative text-white">
      {publicKey ? (
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="inline-flex w-full justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 font-semibold">
              {authLoading && <Loader className="fill-white mt-0.5 mr-3 h-5 w-5" />}
              {walletUserLabel}
            </MenuButton>
          </div>

          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-slate-900 shadow-lg ring-1 ring-slate-700 focus:outline-none">
              <div className="p-1">
                <MenuItem>
                  <a
                    href="#"
                    onClick={openProfileModal}
                    className="flex items-center px-3 py-2 text-gray-300 hover:bg-white/10 rounded-md transition-colors duration-75 font-semibold"
                  >
                    <CgProfile size={23} className="mr-3" />
                    Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    onClick={handleCopyAddress}
                    href="#"
                    className="flex items-center px-3 py-2 text-gray-300 hover:bg-white/10 rounded-md transition-colors duration-75 font-semibold"
                  >
                    <IoCopyOutline size={23} className="mr-3" />
                    Copy Address
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    onClick={() => setVisible(true)}
                    href="#"
                    className="flex items-center px-3 py-2 text-gray-300 hover:bg-white/10 rounded-md transition-colors duration-75 font-semibold"
                  >
                    <GoArrowSwitch size={23} className="mr-3" />
                    Switch Wallet
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    onClick={handleDisconnect}
                    href="#"
                    className="flex items-center px-3 py-2 text-gray-300 hover:bg-white/10 rounded-md transition-colors duration-75 font-semibold"
                  >
                    <VscDebugDisconnect size={23} className="mr-3" />
                    Disconnect
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      ) : (
        <div
          onClick={() => setVisible(true)}
          className="flex w-full justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 font-semibold items-center cursor-pointer"
        >
          <SiSolana className="mr-3 h-5 w-5" />
          Connect Wallet
        </div>
      )}
    </div>
  );
}
