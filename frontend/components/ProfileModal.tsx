import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import fluxApi from "config/axios";
import { useModalStore } from "store/modalStore";
import { useUserStore } from "store/userStores";
import { UpdateUserInput, UpdateUserResponse } from "types/api";
import { UsersType } from "types/supabase";
import Loader from "./Loader";

const customStyles: ReactModal.Styles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    transition: "opacity 0.3s ease-in-out",
    zIndex: 20,
    width: "600px",
    borderRadius: "20px",
    backgroundColor: "#1f2937",
    color: "white",
    borderColor: "rgba(255,255,255,0.2)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    transition: "opacity 0.3s ease-in-out",
  },
};

export function ProfileModal() {
  const { user, updateUser } = useUserStore();
  const [usersData, setUsersData] = useState<Partial<UsersType>>(user || {});
  const [loading, setLoading] = useState(false);
  const { isProfileModalOpen, closeProfileModal } = useModalStore();

  async function updateUserRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      return;
    }
    if (user.username === usersData.username) {
      closeProfileModal();
      return;
    }
    setLoading(true);
    try {
      const updateUserData: UpdateUserInput = { id: user.id, username: usersData.username as string };
      const response = await fluxApi.put("/api/users/update", updateUserData);
      const data: UpdateUserResponse = response.data;
      if (data.success) {
        toast.success("Profile updated successfully!", { position: "top-center" });
        closeProfileModal();
        updateUser({ username: data.username });
      } else {
        toast.error("Error updating profile", { position: "top-center" });
        console.error("Failed to update user:", data.error);
      }
    } catch (error) {
      toast.error("Error updating profile", { position: "top-center" });
      console.log("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ReactModal
        isOpen={isProfileModalOpen}
        onRequestClose={closeProfileModal}
        style={customStyles}
        contentLabel="News Modal"
        closeTimeoutMS={250}
      >
        <div className="flex justify-between items-center p-4">
          <div />
          <h1 className="font-semibold text-white/80">Profile</h1>
          <IoMdClose
            size={26}
            className="cursor-pointer text-white/80 hover:text-white transition-colors"
            onClick={closeProfileModal}
          />
        </div>
        <div className="w-full p-4 mx-auto">
          <form onSubmit={updateUserRequest}>
            <div className="space-y-4 mb-10">
              <div className="space-y-2 flex flex-col">
                <label htmlFor="title" className="font-medium text-gray-300">
                  Name <span className="font-thin text-gray-400">(Optional)</span>
                </label>
                <input
                  id="flux-name"
                  placeholder={user?.username || user?.public_address || undefined}
                  minLength={3}
                  maxLength={50}
                  value={usersData.username || user?.username || ""}
                  onChange={(e) => setUsersData({ ...usersData, username: e.target.value })}
                  className="rounded-md cursor-text placeholder:opacity-25 border-gray-300 shadow-sm focus:outline-none px-2 py-2 text-white bg-flux-input-500 hover:bg-flux-input-400 hover:bg-flux-input/1 placeholder:text-white/50 caret-white transition-colors"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="relative inline-flex items-center cursor-pointer w-full"
                disabled={loading}
              >
                <a className="justify-center w-full inline-flex items-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-800 px-14 py-3 font-semibold tracking-tighter text-white transition-transform duration-1000 ease-in-out transform hover:scale-105 focus:shadow-outline">
                  <div className="flex text-lg">
                    <span className="justify-center">{loading ? "Saving profile..." : "Save"}</span>
                    {loading && <Loader className="w-7 h-7 fill-white absolute right-4" />}
                  </div>
                </a>
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-200 rounded-lg"></div>
              </button>
            </div>
          </form>
        </div>
      </ReactModal>
    </>
  );
}
