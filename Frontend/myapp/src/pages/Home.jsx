import React, { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import axios from 'axios';

// --- CONSTANTS ---
const API_BASE_URL = "https://asuragpt-2.onrender.com";

// --- HELPER FUNCTIONS ---
const uuidv4 = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// --- SVG ICONS ---
const SendIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <line x1="22" y1="2" x2="11" y2="13"></line> <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon> </svg> );
const PlusIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <line x1="12" y1="5" x2="12" y2="19"></line> <line x1="5" y1="12" x2="19" y2="12"></line> </svg> );
const BotIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg> );
const UserIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path> <circle cx="12" cy="7" r="4"></circle> </svg> );
const MenuIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <line x1="4" x2="20" y1="12" y2="12" /> <line x1="4" x2="20" y1="6" y2="6" /> <line x1="4" x2="20" y1="18" y2="18" /> </svg> );
const MessageSquareIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path> </svg> );
const BookTextIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path> <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path> </svg> );
const LoaderIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"> <path d="M21 12a9 9 0 1 1-6.219-8.56" /> </svg> );
const ChevronLeftIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> );
const LogOutIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> );
const CopyIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> );
const CheckIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> );


// --- CHILD COMPONENTS ---

const LoginPopup = ({ onLoginClick }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-zinc-800 p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-400 mb-6">Please log in to continue to your chat session.</p>
            <button
                onClick={onLoginClick}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
            >
                Go to Login
            </button>
        </div>
    </div>
);

const Sidebar = ({ isOpen, chatHistory, activeChatId, setActiveChatId, handleNewChat, isCreatingChat, isLoadingHistory, handleLogout }) => (
    <div className={`bg-black backdrop-blur-md border-r border-gray-800 flex flex-col transition-all duration-300 ${isOpen ? "w-64" : "w-0"} overflow-hidden`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
            <h2 className="font-semibold whitespace-nowrap">Chat History</h2>
            <button onClick={handleNewChat} disabled={isCreatingChat} className="p-2 hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-wait">
                {isCreatingChat ? <LoaderIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
            </button>
        </div>
        <div className="flex-1 overflow-y-auto">
            {isLoadingHistory ? (
                <div className="flex justify-center items-center h-full">
                    <LoaderIcon className="w-6 h-6 text-indigo-500" />
                </div>
            ) : (
                chatHistory.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => setActiveChatId(chat.id)}
                        className={`flex items-center gap-3 p-3 m-2 rounded-md cursor-pointer text-sm transition-colors ${
                            String(activeChatId) === String(chat.id) ? "bg-indigo-600" : "hover:bg-gray-700"
                        }`}
                    >
                        <MessageSquareIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 truncate">{chat.title}</span>
                    </div>
                ))
            )}
        </div>
        <div className="p-4 border-t border-gray-800 flex-shrink-0">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                     <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm truncate">User Profile</span>
                </div>
                <button onClick={handleLogout} title="Logout" className="p-2 hover:bg-gray-700 rounded-md flex-shrink-0">
                    <LogOutIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    </div>
);

const ChatHeader = ({ isSidebarOpen, toggleSidebar, handleSummarize, isSummarizing, hasActiveMessages }) => (
    <div className="absolute top-0 left-0 right-0 p-4 z-20 flex items-center justify-between">
         <button
            onClick={toggleSidebar}
            className="p-2 bg-gray-800/50 rounded-md hover:bg-gray-700"
        >
            {isSidebarOpen ? <ChevronLeftIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
        {hasActiveMessages && (
             <button
                onClick={handleSummarize}
                disabled={isSummarizing}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Summarize this conversation"
            >
                {isSummarizing ? <LoaderIcon className="w-5 h-5" /> : <BookTextIcon className="w-5 h-5" />}
                <span className="hidden sm:inline text-sm">Summarize</span>
            </button>
        )}
    </div>
);

const MessageBubble = ({ msg, onCopy, copiedMessageId }) => (
     <div className={`group flex items-start gap-3 w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
        {msg.role === "model" && (
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                <BotIcon className="w-5 h-5" />
            </div>
        )}
        <div className={`max-w-xl px-4 py-3 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed relative ${ msg.role === "user" ? "bg-blue-600 rounded-br-none" : "bg-gray-700 rounded-bl-none"}`}>
            {msg.content}
        </div>
        {msg.role === "user" && (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                <UserIcon className="w-5 h-5" />
            </div>
        )}
         {msg.role === 'model' && (
            <button 
                onClick={() => onCopy(msg.content, msg.id)}
                className="p-2 text-gray-500 hover:text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                title="Copy message"
            >
                {copiedMessageId === msg.id ? (
                    <CheckIcon className="w-4 h-4 text-green-500" />
                ) : (
                    <CopyIcon className="w-4 h-4" />
                )}
            </button>
        )}
    </div>
);

const ChatWindow = ({ chat, messagesEndRef, onCopy, copiedMessageId }) => (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 pt-20">
        {chat.messages && chat.messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} onCopy={onCopy} copiedMessageId={copiedMessageId} />
        ))}
        <div ref={messagesEndRef} />
    </div>
);

const WelcomeScreen = ({ isLoading }) => (
     <div className="flex-1 flex items-center justify-center flex-col text-center p-4">
        <BotIcon className="w-16 h-16 text-indigo-500 mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-clip-text text-transparent">
            Chat with Asuras
        </h1>
        <p className="mt-3 text-base md:text-lg text-gray-500 max-w-xl mx-auto">
            {isLoading ? "Loading history and authenticating..." : "Select a chat from the sidebar or start a new conversation to begin."}
        </p>
    </div>
);


const TextBox = ({ value, onChange, onSend, disabled }) => (
    <div className="p-4 w-full bg-gray-950">
        <div className="relative flex items-center bg-zinc-800 border border-gray-700 rounded-xl shadow-lg backdrop-blur-sm p-2 max-w-3xl mx-auto w-full">
            <input
                type="text"
                className="flex-1 w-full p-3 pl-4 bg-transparent focus:outline-none text-sm placeholder-gray-500"
                placeholder="Ask anything..."
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
                className="m-1 p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
            >
                <SendIcon className="w-5 h-5" />
            </button>
        </div>
    </div>
);


// --- MAIN APP COMPONENT ---

export default function Home() {
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
            const response = await axios.post(`${API_BASE_URL}/api/chat`, 
                { title: "New Conversation" },
                { withCredentials: true } 
            );
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

    // Effect for initial data fetching
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoadingHistory(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/api/chat`, { withCredentials: true });
                const chatsFromServer = response.data.chats;
                
                if (chatsFromServer && chatsFromServer.length > 0) {
                    const sortedChats = chatsFromServer.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
                    const formattedHistory = sortedChats.map(chat => ({
                        id: chat._id,
                        title: chat.title,
                        messages: chat.messages.map(msg => ({...msg, id: msg._id })),
                    }));
                    setChatHistory(formattedHistory);
                    setActiveChatId(formattedHistory[0]?.id || null);
                } else {
                    await handleNewChat(); // Create a new chat if history is empty
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

    // Effect for managing Socket.IO connection
    useEffect(() => {
        if (showLoginPopup) return;

        socketRef.current = io(API_BASE_URL, {
            transports: ["websocket"],
            withCredentials: true,
        });
        const socket = socketRef.current;
        socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
        
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
            const summaryContent = `✨ **Summary:** ${data.summary}`;
            setChatHistory(prev => prev.map(chat =>
                String(chat.id) === String(chatId)
                    ? { ...chat, messages: [...chat.messages, { id: uuidv4(), role: "model", content: summaryContent }] }
                    : chat
            ));
            setIsSummarizing(false);
        };
        socket.on("ai-summary", handleAiSummary);
        socket.on("disconnect", () => console.log("⚠️ Socket disconnected"));

        return () => {
            if (socket) {
                socket.off("ai-message", handleAiMessage);
                socket.off("ai-summary", handleAiSummary);
                socket.disconnect();
            }
        };
    }, [showLoginPopup]);

    // Effect for auto-scrolling
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, activeChatId]);

    const handleLogout = () => {
        window.location.href = '/login'; 
    };

    const handleCopy = (text, messageId) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedMessageId(messageId);
            setTimeout(() => setCopiedMessageId(null), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
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
        <div className="font-sans antialiased text-white bg-black h-screen w-screen flex overflow-hidden">
            
            {showLoginPopup && <LoginPopup onLoginClick={() => window.location.href = '/login'} />}

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

            <main className="flex-1 flex flex-col relative bg-gray-950">
                <ChatHeader 
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                    handleSummarize={handleSummarize}
                    isSummarizing={isSummarizing}
                    hasActiveMessages={activeChat && activeChat.messages.length >= 2}
                />
                
                <div className="flex-1 flex flex-col overflow-hidden">
                    {activeChat ? (
                        <>
                           <ChatWindow 
                                chat={activeChat}
                                messagesEndRef={messagesEndRef}
                                onCopy={handleCopy}
                                copiedMessageId={copiedMessageId}
                            />
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
                                disabled={true} // Disable if no active chat
                            />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
