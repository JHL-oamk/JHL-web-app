import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  initialFolders,
  lawsList
} from "../models/ChatbotModel";

import { logoutApi } from "../models/authApi";
import { askClaude } from "../models/ClaudeApi";
import {
  createChatApi,
  getChatsApi,
  getChatApi,
  updateChatMessagesApi,
  updateChatTitleApi,
  deleteChatApi,
} from "../models/chatApi";

export const useChatbotViewModel = (authViewModel) => {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [chats, setChats] = useState([]);
  const [folders, setFolders] = useState(initialFolders);
  const [messages, setMessages] = useState([{ role: "assistant", content: "WELCOME_VIEW" }]);
  const [currentChatId, setCurrentChatId] = useState(null);
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

  // ---------------- LOAD CHATS ON MOUNT ----------------
  useEffect(() => {
    if (!authUser?.uid) return;

    const loadChats = async () => {
      try {
        const fetchedChats = await getChatsApi();
        if (fetchedChats.length > 0) {
          setChats(fetchedChats);
          const latest = fetchedChats[0];
          setCurrentChatId(latest.id);
          setMessages(latest.messages || [{ role: "assistant", content: "WELCOME_VIEW" }]);
        }
      } catch (err) {
        console.error("Failed to load chats:", err);
      }
    };

    loadChats();
  }, [authUser?.uid]);

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
  const handleNewChat = async () => {
    const chatId = `chat_${Date.now()}`;
    const title = "New Chat";
    const welcomeMessages = [{ role: "assistant", content: "WELCOME_VIEW" }];

    const newChat = { id: chatId, title, folderId: null, messages: welcomeMessages };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(chatId);
    setMessages(welcomeMessages);

    try {
      await createChatApi(chatId, title);
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  const handleSelectChat = async (chatId) => {
    setCurrentChatId(chatId);
    try {
      const chat = await getChatApi(chatId);
      setMessages(chat.messages || [{ role: "assistant", content: "WELCOME_VIEW" }]);
    } catch (err) {
      console.error("Failed to load chat:", err);
    }
  };

  const handleSend = async (overrideInput) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;

    // Create a new chat automatically if none exists
    let activeChatId = currentChatId;
    if (!activeChatId) {
      const chatId = `chat_${Date.now()}`;
      const welcomeMessages = [{ role: "assistant", content: "WELCOME_VIEW" }];
      const newChat = { id: chatId, title: "New Chat", folderId: null, messages: welcomeMessages };
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(chatId);
      activeChatId = chatId;
      try {
        await createChatApi(chatId, "New Chat");
      } catch (err) {
        console.error("Failed to create chat:", err);
      }
    }

    const userMessage = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");

    const loadingMessages = [...updatedMessages, { role: "assistant", content: "Thinking..." }];
    setMessages(loadingMessages);

    try {
      const aiReply = await askClaude(textToSend, selectedLaws);
      const finalMessages = [...updatedMessages, { role: "assistant", content: aiReply }];
      setMessages(finalMessages);

      await updateChatMessagesApi(activeChatId, finalMessages);

      // Auto-title from first user message
      const chat = chats.find(c => c.id === activeChatId);
      if (chat?.title === "New Chat") {
        const autoTitle = textToSend.slice(0, 40);
        await updateChatTitleApi(activeChatId, autoTitle);
        setChats(prev =>
          prev.map(c => (c.id === activeChatId ? { ...c, title: autoTitle } : c))
        );
      }
    } catch (error) {
      console.error("AI Request Error:", error);
      const errorMessages = [...updatedMessages, { role: "assistant", content: "Error processing request." }];
      setMessages(errorMessages);
      await updateChatMessagesApi(activeChatId, errorMessages).catch(() => {});
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

  // ---------------- DELETE CHAT ----------------
  const handleDeleteChat = async (chatId) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    setOpenChatMenuId(null);

    if (currentChatId === chatId) {
      const remaining = chats.filter(c => c.id !== chatId);
      if (remaining.length > 0) {
        handleSelectChat(remaining[0].id);
      } else {
        setCurrentChatId(null);
        setMessages([{ role: "assistant", content: "WELCOME_VIEW" }]);
      }
    }

    try {
      await deleteChatApi(chatId);
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
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
    setCurrentChatId: handleSelectChat,
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
    handleShareChat,
    handleDeleteChat,
  };
};