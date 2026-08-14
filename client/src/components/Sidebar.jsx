import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";
import toast from "react-hot-toast";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { chats, setSelectedChat, theme, setTheme, user, navigate,
    createNewChat, axios, setChats, fetchUsersChats, logout } = useAppContext();
  const [search, setSearch] = useState("");

  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation();
      const confirm = window.confirm("Are you sure you want to delete this chat?");
      if (!confirm) return;
      const { data } = await axios.post('/api/chat/delete', { chatId });
      if (data.success) {
        setChats(prev => prev.filter(chat => chat._id !== chatId));
        await fetchUsersChats();
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex flex-col h-full w-72 shrink-0 p-4 pb-3 bg-white dark:bg-[#161B22] border-r border-[#E2E8F0] dark:border-[#30363D] text-[#0F172A] dark:text-[#E6EDF3] 
      transition-all duration-300 ease-in-out
      max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-40 max-md:w-[280px] max-md:shadow-2xl ${
        !isMenuOpen ? "max-md:-translate-x-full" : "max-md:translate-x-0"
      }`}
    >
      {/* LOGO ROW WITH CLOSE BUTTON ON MOBILE */}
      <div className="flex items-center justify-between mb-2">
        <img
          src={theme === "dark" ? assets.logo_full_dark : assets.logo_full}
          alt="Astro Logo"
          className="w-32 h-auto cursor-pointer"
        />
        <img
          onClick={() => setIsMenuOpen(false)}
          src={assets.close_icon}
          className="w-5 h-5 cursor-pointer md:hidden opacity-80 not-dark:invert"
          alt="Close sidebar"
        />
      </div>

      {/* NEW CHAT BUTTON */}
      <button
        onClick={createNewChat}
        className="flex justify-center items-center w-full py-2.5 mt-3
      text-white bg-gradient-to-r from-[#06B6D4] to-[#6366F1] hover:brightness-110 text-sm font-medium rounded-md
      cursor-pointer shadow-md shadow-[#06B6D4]/20 transition-all"
      >
        <span className="mr-2 text-xl">+</span> New Chat
      </button>

      {/* SEARCH CONVERSATION */}
      <div
        className="flex items-center gap-2 p-2.5 mt-3 border border-[#E2E8F0] dark:border-[#30363D] bg-[#F1F5F9] dark:bg-[#0D1117] rounded-md focus-within:border-[#06B6D4]/60 transition-colors"
      >
        <img src={assets.search_icon} className="w-4 opacity-70 not-dark:invert" alt="" />
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search Conversations"
          className="text-xs placeholder:text-[#64748B] dark:placeholder:text-[#8B949E] outline-none bg-transparent text-[#0F172A] dark:text-[#E6EDF3] w-full"
        />
      </div>

      {/* RECENT CHATS */}
      {chats.length > 0 && <p className="mt-3 text-sm font-medium text-[#64748B] dark:text-[#8B949E]">Recent Chats</p>}
      <div className="flex-1 overflow-y-auto mt-2 text-sm space-y-2 min-h-0">
        {chats
          .filter((chat) =>
            chat.messages[0]
              ? chat.messages[0]?.content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase()),
          )
          .map((chat) => (
            <div
              key={chat._id} onClick={() => { navigate('/'); setSelectedChat(chat);
                if (window.innerWidth < 768) setIsMenuOpen(false);
              }}
              className="p-2.5 px-3 bg-[#F8FAFC] dark:bg-[#0D1117]/60 border
            border-[#E2E8F0] dark:border-[#30363D] hover:border-[#06B6D4]/50 rounded-md cursor-pointer
            flex justify-between items-center group transition-all"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[#0F172A] dark:text-[#E6EDF3]">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-xs text-[#64748B] dark:text-[#8B949E]">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>
              <img onClick={e => deleteChat(e, chat._id)}
                src={assets.bin_icon}
                className="hidden group-hover:block shrink-0
              w-4 cursor-pointer opacity-70 hover:opacity-100 not-dark:invert ml-2"
                alt=""
              />
            </div>
          ))}
      </div>

      {/* BOTTOM SECTION */}
      <div className="space-y-2 mt-2 shrink-0">
        {/* COMMUNITY IMAGES */}
        <div
          onClick={() => {
            navigate("/community");
            if (window.innerWidth < 768) setIsMenuOpen(false);
          }}
          className="flex items-center gap-2 p-2.5 border border-[#E2E8F0] dark:border-[#30363D] bg-[#F8FAFC] dark:bg-[#0D1117]/60 hover:border-[#06B6D4]/50 rounded-md cursor-pointer transition-all"
        >
          <img
            src={assets.gallery_icon}
            className="w-4.5 opacity-80 not-dark:invert"
            alt=""
          />
          <p className="text-sm text-[#0F172A] dark:text-[#E6EDF3]">Community Images</p>
        </div>

        {/* CREDIT PURCHASE OPTION */}
        <div
          onClick={() => {
            navigate("/credits");
            if (window.innerWidth < 768) setIsMenuOpen(false);
          }}
          className="flex items-center gap-2 p-2.5 border border-[#E2E8F0] dark:border-[#30363D] bg-[#F8FAFC] dark:bg-[#0D1117]/60 hover:border-[#06B6D4]/50 rounded-md cursor-pointer transition-all"
        >
          <img src={assets.diamond_icon} className="w-4.5 opacity-80 not-dark:invert" alt="" />
          <div className="flex flex-col text-sm min-w-0">
            <p className="text-[#0F172A] dark:text-[#E6EDF3] font-medium">Credits : {user?.credits}</p>
            <p className="text-xs text-[#64748B] dark:text-[#8B949E] truncate">Purchase credits to use Astro</p>
          </div>
        </div>

        {/* DARK MODE TOGGLE */}
        <div
          onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
          className="flex items-center justify-between gap-2 p-2.5 border border-[#E2E8F0] dark:border-[#30363D] bg-[#F8FAFC] dark:bg-[#0D1117]/60 rounded-md cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-sm text-[#0F172A] dark:text-[#E6EDF3]">
            <img src={assets.theme_icon} className="w-4 opacity-80 not-dark:invert" alt="" />
            <p>Dark Mode</p>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <div
              className={`w-9 h-5 rounded-full transition-all ${
                theme === "dark" ? "bg-[#06B6D4]" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full
              transition-transform ${theme === "dark" ? "translate-x-4" : ""}`}
              ></span>
            </div>
          </div>
        </div>

        {/* USER ACCOUNT */}
        <div
          className="flex items-center gap-3 p-2.5 border border-[#E2E8F0] dark:border-[#30363D] bg-[#F8FAFC] dark:bg-[#0D1117]/60 rounded-md cursor-pointer group"
        >
          <img src={assets.user_icon} className="w-7 rounded-full shrink-0" alt="" />
          <p className="flex-1 text-sm text-[#0F172A] dark:text-[#E6EDF3] truncate font-medium min-w-0">
            {user ? user.name : "Login into your account"}
          </p>
          {user && (
            <img onClick={(e) => { e.stopPropagation(); logout(); }}
              src={assets.logout_icon}
              title="Logout"
              className="h-5 w-5 shrink-0 cursor-pointer opacity-70 hover:opacity-100 transition-opacity not-dark:invert"
              alt="Logout"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
