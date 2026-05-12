import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  initialChats,
  initialFolders,
  initialMessages,
  lawsList
} from "../models/ChatbotModel";

import { logoutApi } from "../models/authApi";
import { askClaude } from "../models/ClaudeApi";

export const useChatbotViewModel = (authViewModel) => {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [chats, setChats] = useState(initialChats);
  const [folders, setFolders] = useState(initialFolders);
  const [messages, setMessages] = useState(initialMessages);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [openChatMenuId, setOpenChatMenuId] = useState(null);
  const [openFolderId, setOpenFolderId] = useState(null);
  const [chatSearch, setChatSearch] = useState("");
  const [input, setInput] = useState("");
  const [selectedLaws, setSelectedLaws] = useState([]);
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [showFolders, setShowFolders] = useState(true);
  const [showLawSource, setShowLawSource] = useState(true);

  const laws = lawsList;
  const authUser = authViewModel?.user;

  // ---------------- AUTH ----------------
  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout failed:", err);
    }
    navigate("/login");
  };

  // ---------------- CHAT LOGIC ----------------
  const handleNewChat = () => {
    const newChat = { id: Date.now(), title: "New Chat", folderId: null };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    // Setting this to include WELCOME_VIEW ensures the UI shows suggestions immediately
    setMessages([{ role: "assistant", content: "WELCOME_VIEW" }]); 
  };

  const handleSend = async (overrideInput) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;

    const userMessage = { role: "user", content: textToSend };
    // We keep previous messages (like the WELCOME_VIEW if desired) or filtered list
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");

    const loadingMessages = [...updatedMessages, { role: "assistant", content: "Thinking..." }];
    setMessages(loadingMessages);

    try {
      const aiReply = await askClaude(textToSend, selectedLaws);
      setMessages([...updatedMessages, { role: "assistant", content: aiReply }]);
    } catch (error) {
      console.error("AI Request Error:", error);
      setMessages([...updatedMessages, { role: "assistant", content: "Error processing request." }]);
    }
  };

  /**
   * Action for clicking suggestion links/keywords in Welcome View
   */
  const handleSuggestionClick = (text) => {
    handleSend(text);
  };

  /**
   * Action for clicking law names in AI responses
   * Only toggles selection state.
   */
  const handleLawClick = (lawName) => {
    if (!lawName) return;
    
    const normalizedInput = lawName.trim().toLowerCase();
    
    // Improved matching: find law where official name is inside input or vice versa
    const lawMatch = laws.find(l => {
      const officialName = l.name.toLowerCase();
      return officialName.includes(normalizedInput) || normalizedInput.includes(officialName);
    });

    if (lawMatch) {
      toggleLaw(lawMatch.link);
    } else {
      console.warn("No matching law found for selection:", lawName);
    }
  };

  // ---------------- LAW TOGGLE ----------------
  const toggleLaw = (lawLink) => {
    setSelectedLaws((prev) => {
      const updated = prev.includes(lawLink)
        ? prev.filter((l) => l !== lawLink)
        : [...prev, lawLink];
      return updated;
    });
  };

  // ---------------- FOLDER & SHARE ----------------
  const addChatToFolder = (chatId) => {
    const folderName = prompt("Folder name?");
    const folder = folders.find(f => f.name === folderName);
    if (!folder) return alert("Folder not found");

    setChats(prev => prev.map(c => (c.id === chatId ? { ...c, folderId: folder.id } : c)));
    setOpenChatMenuId(null);
  };

  const handleShareChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    navigator.clipboard.writeText(`${window.location.origin}/chat/${chatId}`);
    alert("Link copied!");
  };

  // ---------------- RETURN ----------------
  return {
    chats,
    folders,
    messages,
    currentChatId,
    openChatMenuId,
    openFolderId,
    chatSearch,
    input,
    selectedLaws,
    showChatHistory,
    showFolders,
    showLawSource,
    laws,
    authUser,
    setChats,
    setFolders,
    setMessages,
    setCurrentChatId,
    setOpenChatMenuId,
    setOpenFolderId,
    setChatSearch,
    setInput,
    setSelectedLaws,
    setShowChatHistory,
    setShowFolders,
    setShowLawSource,
    handleLogout,
    handleNewChat,
    handleSend,
    handleSuggestionClick,
    handleLawClick, 
    toggleLaw,
    addChatToFolder,
    handleShareChat
  };
};