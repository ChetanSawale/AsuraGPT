import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";
import API, { API_BASE_URL } from "../services/api";

// --- HELPER FUNCTIONS ---
const uuidv4 = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// --- MINIMAL SVG ICONS ---
const ArrowUpIcon = (props) => (
  <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 13V3" /><path d="M3 8l5-5 5 5" />
  </svg>
);

const PlusIcon = (props) => (
  <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3v10M3 8h10" />
  </svg>
);

const SparkleIcon = (props) => (
  <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0L9.8 6.2L16 8L9.8 9.8L8 16L6.2 9.8L0 8L6.2 6.2L8 0Z" />
  </svg>
);

const MessageSquareIcon = (props) => (
  <svg {...props} width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 10.5a2 2 0 0 1-2 2H5.5L2 15V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6.5z" />
  </svg>
);

const BookTextIcon = (props) => (
  <svg {...props} width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 13.5A2.5 2.5 0 0 1 5 11h8.5" />
    <path d="M5 2.5h8.5v11H5A2.5 2.5 0 0 1 2.5 11v-6A2.5 2.5 0 0 1 5 2.5z" />
  </svg>
);

const LoaderIcon = (props) => (
  <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const SidebarToggleIcon = (props) => (
  <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="13.5" height="12" x="1.25" y="2" rx="2" />
    <path d="M5.5 2v12" />
  </svg>
);

const LogOutIcon = (props) => (
  <svg {...props} width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 14H3.5A1.5 1.5 0 0 1 2 12.5v-9A1.5 1.5 0 0 1 3.5 2H6" />
    <path d="M10.5 11.5L14 8l-3.5-3.5" />
    <path d="M14 8H6" />
  </svg>
);

const CopyIcon = (props) => (
  <svg {...props} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="9" height="9" x="5" y="5" rx="1.5" />
    <path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11" />
  </svg>
);

const CheckIcon = (props) => (
  <svg {...props} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="13.5 4.5 6.5 11.5 2.5 7.5" />
  </svg>
);


// --- CHILD COMPONENTS ---

const LoginPopup = ({ onLoginClick }) => (
  <div className="fixed inset-0 bg-[#09090b]/90 backdrop-blur-md flex items-center justify-center z-50 p-6">
    <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl shadow-2xl max-w-sm w-full text-center space-y-4">
      <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-300">
        <SparkleIcon className="text-emerald-400" />
      </div>
      <h2 className="text-xl font-medium tracking-tight text-zinc-100">Session Required</h2>
      <p className="text-xs text-zinc-400 leading-relaxed">Please sign in to access workspace history and real-time streaming.</p>
      <button
        onClick={onLoginClick}
        className="w-full py-2.5 bg-zinc-100 text-[#09090b] hover:bg-white rounded-lg font-medium text-xs transition-all shadow-sm"
      >
        Sign In to Continue
      </button>
    </div>
  </div>
);

const Sidebar = ({ isOpen, chatHistory, activeChatId, setActiveChatId, handleNewChat, isCreatingChat, isLoadingHistory, handleLogout }) => (
  <aside className={`bg-[#09090b] border-r border-zinc-800/60 flex flex-col transition-all duration-300 ${isOpen ? "w-64" : "w-0"} overflow-hidden shrink-0`}>
    <div className="flex items-center justify-between p-4 border-b border-zinc-800/60 shrink-0">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-4 h-4 rounded bg-zinc-100 flex items-center justify-center text-[#09090b] font-mono text-[10px] font-bold">
          A
        </div>
        <span className="font-semibold text-xs tracking-tight text-zinc-200">AsuraGPT</span>
      </Link>
      <button
        onClick={handleNewChat}
        disabled={isCreatingChat}
        title="New Chat"
        className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-md transition-colors disabled:opacity-50"
      >
        {isCreatingChat ? <LoaderIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
      </button>
    </div>

    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
        Conversations
      </div>
      {isLoadingHistory ? (
        <div className="flex justify-center items-center py-8">
          <LoaderIcon className="w-4 h-4 text-zinc-500" />
        </div>
      ) : (
        chatHistory.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-xs transition-all ${
              String(activeChatId) === String(chat.id)
                ? "bg-zinc-800/80 text-zinc-100 font-medium"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            }`}
          >
            <MessageSquareIcon className="shrink-0 opacity-70" />
            <span className="truncate">{chat.title || "New Conversation"}</span>
          </div>
        ))
      )}
    </div>

    <div className="p-3 border-t border-zinc-800/60 shrink-0">
      <div className="flex items-center justify-between gap-2 px-2 py-1">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-[10px] font-mono text-zinc-300">
            U
          </div>
          <span className="text-xs text-zinc-300 truncate">Workspace User</span>
        </div>
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-1.5 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 rounded-md transition-colors"
        >
          <LogOutIcon />
        </button>
      </div>
    </div>
  </aside>
);

const ChatHeader = ({ isSidebarOpen, toggleSidebar, handleSummarize, isSummarizing, hasActiveMessages }) => (
  <header className="h-14 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-20">
    <div className="flex items-center gap-3">
      <button
        onClick={toggleSidebar}
        className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-md transition-colors"
        title="Toggle Sidebar"
      >
        <SidebarToggleIcon />
      </button>
      <span className="text-xs font-mono text-zinc-500">asuragpt / active-session</span>
    </div>

    {hasActiveMessages && (
      <button
        onClick={handleSummarize}
        disabled={isSummarizing}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 text-zinc-300 text-xs font-medium transition-all disabled:opacity-50"
        title="Summarize conversation"
      >
        {isSummarizing ? <LoaderIcon className="w-3.5 h-3.5" /> : <BookTextIcon />}
        <span>Summarize</span>
      </button>
    )}
  </header>
);

const MessageBubble = ({ msg, onCopy, copiedMessageId }) => (
  <div className={`group flex flex-col w-full space-y-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 px-1">
      <span>{msg.role === "user" ? "You" : "AsuraGPT"}</span>
    </div>
    
    <div className="relative max-w-2xl">
      <div
        className={`px-4 py-3 rounded-xl text-xs md:text-sm leading-relaxed ${
          msg.role === "user"
            ? "bg-zinc-100 text-[#09090b] font-medium rounded-tr-none shadow-sm"
            : "bg-zinc-900/90 border border-zinc-800/80 text-zinc-200 rounded-tl-none whitespace-pre-wrap"
        }`}
      >
        {msg.content}
      </div>

      {msg.role === "model" && (
        <button
          onClick={() => onCopy(msg.content, msg.id)}
          className="absolute -right-8 top-2 p-1 text-zinc-500 hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Copy response"
        >
          {copiedMessageId === msg.id ? <CheckIcon className="text-emerald-400" /> : <CopyIcon />}
        </button>
      )}
    </div>
  </div>
);

const ChatWindow = ({ chat, messagesEndRef, onCopy, copiedMessageId }) => (
  <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
    {chat.messages && chat.messages.map((msg) => (
      <MessageBubble key={msg.id} msg={msg} onCopy={onCopy} copiedMessageId={copiedMessageId} />
    ))}
    <div ref={messagesEndRef} />
  </div>
);

const WelcomeScreen = ({ isLoading }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-4">
    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
      <SparkleIcon className="text-emerald-400" />
    </div>
    <h1 className="text-2xl font-medium tracking-tight text-zinc-100">
      Start a Thoughtful Conversation
    </h1>
    <p className="text-xs text-zinc-400 leading-relaxed font-normal">
      {isLoading ? "Retrieving workspace state..." : "Type your query below. All sessions index memory seamlessly."}
    </p>
  </div>
);

const NewChatPlaceholder = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-3">
    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
      <SparkleIcon className="w-4 h-4 text-emerald-400" />
    </div>
    <h2 className="text-lg font-medium text-zinc-200 tracking-tight">New Session Started</h2>
    <p className="text-xs text-zinc-500 font-mono">Send your first message to begin indexing context.</p>
  </div>
);

const TextBox = ({ value, onChange, onSend, disabled }) => (
  <div className="p-4 bg-[#09090b] border-t border-zinc-800/60 shrink-0">
    <div className="max-w-3xl mx-auto relative flex items-center bg-zinc-950 border border-zinc-800 focus-within:border-zinc-600 rounded-xl transition-all shadow-lg p-1.5">
      <input
        type="text"
        className="flex-1 bg-transparent px-3 py-2 text-xs md:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
        placeholder="Type a message or ask a question..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!disabled) onSend();
          }
        }}
      />
      <button
        onClick={onSend}
        disabled={disabled}
        className="p-2.5 rounded-lg bg-zinc-100 text-[#09090b] hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed transition-all"
      >
        <ArrowUpIcon />
      </button>
    </div>
  </div>
);


// --- MAIN WORKSPACE COMPONENT ---

export default function Home() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const initialLoadHandled = useRef(false);

  const handleNewChat = useCallback(async () => {
    if (isCreatingChat) return;
    setIsCreatingChat(true);
    try {
      const response = await API.post("/api/chat", { title: "New Conversation" });
      const newChat = response.data.chat;
      const formattedNewChat = { ...newChat, id: newChat._id, messages: [] };
      setChatHistory((prev) => [formattedNewChat, ...prev]);
      setActiveChatId(formattedNewChat.id);
    } catch (error) {
      console.error("❌ Error creating new chat:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setShowLoginPopup(true);
      }
    } finally {
      setIsCreatingChat(false);
    }
  }, [isCreatingChat]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingHistory(true);
      try {
        const response = await API.get("/api/chat");
        const chatsFromServer = response.data.chats;

        if (chatsFromServer && chatsFromServer.length > 0) {
          const sortedChats = chatsFromServer.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
          const formattedHistory = sortedChats.map(chat => ({
            id: chat._id,
            title: chat.title,
            messages: (chat.messages || []).map(msg => ({ ...msg, id: msg._id || uuidv4() })),
          }));
          setChatHistory(formattedHistory);
          setActiveChatId(formattedHistory[0]?.id || null);
        } else {
          await handleNewChat();
        }
      } catch (error) {
        console.error("❌ Error fetching chat history:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setShowLoginPopup(true);
        }
      } finally {
        setIsLoadingHistory(false);
      }
    };

    if (!initialLoadHandled.current) {
      fetchInitialData();
      initialLoadHandled.current = true;
    }
  }, [handleNewChat]);

  useEffect(() => {
    if (showLoginPopup) return;

    socketRef.current = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    const socket = socketRef.current;

    const handleAiMessage = (data) => {
      const chatId = data.chatId || data.chat;
      if (!chatId) return;
      setChatHistory(prev => prev.map(chat => {
        if (String(chat.id) !== String(chatId)) return chat;
        const existingMessages = chat.messages || [];
        const newMessage = { id: uuidv4(), role: "model", content: data.content };
        return { ...chat, messages: [...existingMessages, newMessage] };
      }));
    };
    socket.on("ai-message", handleAiMessage);

    const handleAiSummary = (data) => {
      const chatId = data.chatId || data.chat;
      if (!chatId) return;
      const summaryContent = `✨ **Summary:**\n${data.summary}`;
      setChatHistory(prev => prev.map(chat =>
        String(chat.id) === String(chatId)
          ? { ...chat, messages: [...chat.messages, { id: uuidv4(), role: "model", content: summaryContent }] }
          : chat
      ));
      setIsSummarizing(false);
    };
    socket.on("ai-summary", handleAiSummary);

    return () => {
      if (socket) {
        socket.off("ai-message", handleAiMessage);
        socket.off("ai-summary", handleAiSummary);
        socket.disconnect();
      }
    };
  }, [showLoginPopup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, activeChatId]);

  const handleLogout = async () => {
    try {
      await API.post("/api/auth/logout");
    } catch (e) {
      console.error("Logout error:", e);
    }
    navigate("/login");
  };

  const handleCopy = (text, messageId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    });
  };

  const sendMessage = async () => {
    if (!message.trim() || !socketRef.current || !activeChatId) return;

    const userMessage = { id: uuidv4(), role: "user", content: message };
    const currentChat = chatHistory.find(c => String(c.id) === String(activeChatId));
    const historyForSocket = currentChat?.messages || [];

    setChatHistory(prev =>
      prev.map(chat =>
        String(chat.id) === String(activeChatId)
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    socketRef.current.emit("ai-message", {
      content: message,
      chat: activeChatId,
      history: [...historyForSocket, userMessage],
    });
    setMessage("");
  };

  const activeChat = chatHistory.find((chat) => String(chat.id) === String(activeChatId));

  const handleSummarize = () => {
    if (!activeChat || activeChat.messages.length < 2 || isSummarizing) return;
    setIsSummarizing(true);
    socketRef.current.emit("summarize-chat", {
      messages: activeChat.messages,
      chat: activeChatId,
    });
  };

  return (
    <div className="font-sans antialiased text-[#ececee] bg-[#09090b] h-screen w-screen flex overflow-hidden selection:bg-zinc-800 selection:text-white">
      {showLoginPopup && <LoginPopup onLoginClick={() => navigate("/login")} />}

      <Sidebar
        isOpen={isSidebarOpen}
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        handleNewChat={handleNewChat}
        isCreatingChat={isCreatingChat}
        isLoadingHistory={isLoadingHistory}
        handleLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col relative bg-[#09090b]">
        <ChatHeader
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          handleSummarize={handleSummarize}
          isSummarizing={isSummarizing}
          hasActiveMessages={activeChat && activeChat.messages.length >= 2}
        />

        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Background Architectural Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b10_1px,transparent_1px),linear-gradient(to_bottom,#18181b10_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          {activeChat ? (
            <>
              {activeChat.messages && activeChat.messages.length > 0 ? (
                <ChatWindow
                  chat={activeChat}
                  messagesEndRef={messagesEndRef}
                  onCopy={handleCopy}
                  copiedMessageId={copiedMessageId}
                />
              ) : (
                <NewChatPlaceholder />
              )}
              <TextBox
                value={message}
                onChange={setMessage}
                onSend={sendMessage}
                disabled={!message.trim()}
              />
            </>
          ) : (
            <>
              <WelcomeScreen isLoading={isLoadingHistory} />
              <TextBox
                value={message}
                onChange={setMessage}
                onSend={sendMessage}
                disabled={true}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
