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
      await logoutApi();
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

  // ---------------- SEND MESSAGE ----------------
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");

    // show loading state
    const loadingMessages = [
      ...updatedMessages,
      { role: "assistant", content: "Thinking..." }
    ];

    setMessages(loadingMessages);

    try {
      const aiReply = await askClaude(input, selectedLaws);

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: aiReply }
      ]);
    } catch (error) {
      console.error(error);

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "AI request failed." }
      ]);
    }
  };

  // ---------------- LAW TOGGLE ----------------
  const toggleLaw = (lawLink) => {
    setSelectedLaws((prev) => {
      const updated = prev.includes(lawLink)
        ? prev.filter((l) => l !== lawLink)
        : [...prev, lawLink];

      console.log("Updated selected laws:", updated);
      return updated;
    });
  };

  // ---------------- FOLDER ----------------
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

    const link = `${window.location.origin}/chat/${chatId}`;

    navigator.clipboard.writeText(link);
    alert("Link copied:\n" + link);
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