import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";

const TypewriterText = ({
  text = "Your Guide to Intelligent Exploration.",
  typingSpeed = 60,
  deletingSpeed = 30,
  pauseDuration = 2500,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;

    if (!isDeleting && displayText.length < text.length) {
      timer = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && displayText.length === text.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && displayText.length > 0) {
      timer = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length - 1));
      }, deletingSpeed);
    } else if (isDeleting && displayText.length === 0) {
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, text, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <p className="mt-4 text-xl sm:text-6xl text-center text-[#64748B] dark:text-[#8B949E] font-medium tracking-tight min-h-[1.5em]">
      {displayText}
      <span className="inline-block w-[3px] sm:w-[5px] h-[0.75em] bg-[#06B6D4] ml-1.5 align-middle rounded-full animate-cursor-blink shadow-[0_0_8px_#06B6D4]"></span>
    </p>
  );
};

const ChatBox = () => {
  const containerRef = useRef(null);

  const { selectedChat, theme, user, axios, setUser } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!user) {
        return toast("Login to send message");
      }
      if (!selectedChat || !selectedChat._id) {
        return toast.error(
          "No active chat selected. Please create a new chat.",
        );
      }
      setLoading(true);

      const promptCopy = prompt;
      setPrompt("");
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
          timestamp: Date.now(),
          isImage: false,
        },
      ]);

      const { data } = await axios.post(`/api/message/${mode}`, {
        chatId: selectedChat._id,
        prompt,
        isPublished,
      });

      if (data.success) {
        setMessages((prev) => [...prev, data.reply]);

        //Decrease credits
        if (mode === "image") {
          setUser((prev) => ({ ...prev, credits: prev.credits - 2 }));
        } else {
          setUser((prev) => ({ ...prev, credits: prev.credits - 1 }));
        }
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPrompt("");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  //TO SCROLL THE PAGE TO THE LATEST CHAT MESSAGE
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behaviour: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="flex flex-1 flex-col justify-between m-5 md:m-10 xl:mx-30
    max-md:mt-14 2xl:pr-40"
    >
      {/* {CHAT MESSAGES} */}
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll chat-scroll-mask py-2">
        {messages.length === 0 && (
          <div
            className="h-full flex flex-col items-center justify-center gap-2
          text-[#0F172A] dark:text-[#E6EDF3]"
          >
            <img
              src={theme === 'dark' ? assets.logo_full_dark : assets.logo_full}
              className="w-44 sm:w-52 h-auto"
              alt="Astro Logo"
            />
            <TypewriterText text="Your Guide to Intelligent Exploration." />
          </div>
        )}

        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {/* {THREE DOTS LOADING ANIMATIONS} */}
        {loading && (
          <div className="loader flex items-center gap-1.5 p-2">
            <div className="w-2 h-2 rounded-full bg-[#06B6D4] animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-[#06B6D4] animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-[#06B6D4] animate-bounce"></div>
          </div>
        )}
      </div>

      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto text-[#64748B] dark:text-[#8B949E]">
          <p className="text-xs">Publish Generated Image to Community</p>
          <input
            type="checkbox"
            className="cursor-pointer accent-[#06B6D4]"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </label>
      )}

      {/* {PROMPT INPUT BOX} */}
      <form
        onSubmit={onSubmit}
        className="bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#30363D] focus-within:border-[#06B6D4]/60 rounded-full w-full max-w-2xl p-3 pl-5 mx-auto flex gap-4 items-center shadow-md dark:shadow-black/40 transition-colors"
      >
        {/* CUSTOM ANIMATED DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold text-[#06B6D4] bg-[#06B6D4]/10 hover:bg-[#06B6D4]/20 border border-[#06B6D4]/20 transition-all duration-200 cursor-pointer select-none"
          >
            <span>{mode === "text" ? "Text" : "Image"}</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 stroke-[2.5] ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* DROPDOWN MENU PANEL */}
          <div
            className={`absolute bottom-full mb-3 left-0 w-44 bg-white/95 dark:bg-[#161B22]/95 backdrop-blur-md border border-[#E2E8F0] dark:border-[#30363D] rounded-xl shadow-xl shadow-black/10 dark:shadow-black/60 z-50 overflow-hidden transition-all duration-200 ease-out transform origin-bottom-left ${
              isDropdownOpen
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 translate-y-2 pointer-events-none"
            }`}
          >
            <div className="p-1.5 space-y-1">
              <button
                type="button"
                onClick={() => {
                  setMode("text");
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  mode === "text"
                    ? "bg-[#06B6D4]/15 text-[#06B6D4] font-semibold"
                    : "text-[#0F172A] dark:text-[#E6EDF3] hover:bg-[#F1F5F9] dark:hover:bg-[#0D1117]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h4m-6 6h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Text Mode</span>
                </div>
                {mode === "text" && (
                  <svg className="w-3.5 h-3.5 text-[#06B6D4] stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("image");
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  mode === "image"
                    ? "bg-[#06B6D4]/15 text-[#06B6D4] font-semibold"
                    : "text-[#0F172A] dark:text-[#E6EDF3] hover:bg-[#F1F5F9] dark:hover:bg-[#0D1117]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Image Mode</span>
                </div>
                {mode === "image" && (
                  <svg className="w-3.5 h-3.5 text-[#06B6D4] stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Search Space"
          className="flex-1 
        w-full text-sm outline-none bg-transparent text-[#0F172A] dark:text-[#E6EDF3] placeholder:text-[#64748B] dark:placeholder:text-[#8B949E]"
          required
        />
        <button
          disabled={loading}
          className="hover:opacity-80 transition-opacity"
        >
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            className="w-8 
          cursor-pointer dark:invert-0"
            alt=""
          />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
