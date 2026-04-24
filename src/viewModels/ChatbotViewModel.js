import { useState } from "react";
import {
  initialChats,
  initialFolders,
  initialMessages,
  lawsList
} from "../models/ChatbotModel";
import { useNavigate } from "react-router-dom";

import { logoutApi } from "../models/authApi";

export const useChatbotViewModel = () => {
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

  // ---------------- AUTH ----------------
  const handleLogout = async () => {
    try {
      await logoutApi(); // Firebase logout
    } catch (err) {
      console.error("Logout failed:", err);
    }

    navigate("/login");
  };

  // ---------------- CHAT ----------------
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      folderId: null
    };

    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages(initialMessages);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    const reply = selectedLaws.length
      ? `Answer based on: ${selectedLaws.join(", ")}`
      : "Please select a law source.";

    setMessages([
      ...updatedMessages,
      { role: "assistant", content: reply }
    ]);
  };

  const toggleLaw = (law) => {
    setSelectedLaws(prev =>
      prev.includes(law)
        ? prev.filter(l => l !== law)
        : [...prev, law]
    );
  };

  const addChatToFolder = (chatId) => {
    const folderName = prompt("Folder name?");
    const folder = folders.find(f => f.name === folderName);

    if (!folder) {
      alert("Folder not found");
      return;
    }

    setChats(prev =>
      prev.map(c =>
        c.id === chatId ? { ...c, folderId: folder.id } : c
      )
    );

    setFolders(prev =>
      prev.map(f =>
        f.id === folder.id
          ? { ...f, chatIds: [...f.chatIds, chatId] }
          : f
      )
    );

    setOpenChatMenuId(null);
  };

  // ---------------- SHARE ----------------
  const handleShareChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const shareLink = `${window.location.origin}/chat/${chatId}`;

    navigator.clipboard.writeText(shareLink);

    alert("链接已复制：\n" + shareLink);
  };

  // ---------------- RETURN ----------------
  return {
    // state
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

    // setters
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

    // actions
    handleLogout,
    handleNewChat,
    handleSend,
    toggleLaw,
    addChatToFolder,
    handleShareChat
  };
};