import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

import { logoutApi } from "../models/authApi";
import { askClaude } from "../models/ClaudeApi";
import {
  createChatApi,
  getChatsApi,
  getChatApi,
  updateChatMessagesApi,
  updateChatTitleApi,
  deleteChatApi,
  updateChatFolderApi,
} from "../models/chatApi";
import {
  createFolderApi,
  getFoldersApi,
  updateFolderApi,
  deleteFolderApi,
} from "../models/folderApi";

export const useChatbotViewModel = (authViewModel) => {
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [folders, setFolders] = useState([]);
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
  const [laws, setLaws] = useState([]);

  const authUser = authViewModel?.user;

  // ---------------- LOAD LAWS FROM FIRESTORE ----------------
  useEffect(() => {
    const loadLaws = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, 'lawSources'), where('active', '==', true))
        );

        const lawItems = [];
        const seenParents = new Set();

        snap.docs.forEach(doc => {
          const data = doc.data();

          if (data.type === 'tes_chunk') {
            if (!seenParents.has(data.parent)) {
              seenParents.add(data.parent);
              lawItems.push({
                id: `tes:${data.parent}`,
                name: data.parent,
                name_fi: data.parent,
                name_en: data.parent,
                category: data.category || 'Työehtosopimukset',
                category_fi: data.category || 'Työehtosopimukset',
                category_en: 'Collective Agreements',
                link: data.url || '',
              });
            }
          } else {
            lawItems.push({
              id: doc.id,
              name: data.title || doc.id,
              name_fi: data.title || doc.id,
              name_en: data.title || doc.id,
              category: data.category || 'Muut',
              category_fi: data.category || 'Muut',
              category_en: data.category || 'Other',
              link: data.url || '',
            });
          }
        });

        setLaws(lawItems);
      } catch (err) {
        console.error("Failed to load laws:", err);
      }
    };

    loadLaws();
  }, []);

  // ---------------- LOAD CHATS & FOLDERS ON MOUNT ----------------
  useEffect(() => {
    if (!authUser?.uid) return;
    const loadData = async () => {
      try {
        const [fetchedChats, fetchedFolders] = await Promise.all([
          getChatsApi(),
          getFoldersApi(),
        ]);
        if (fetchedFolders.length > 0) setFolders(fetchedFolders);
        if (fetchedChats.length > 0) {
          setChats(fetchedChats);
          const latest = fetchedChats[0];
          setCurrentChatId(latest.id);
          setMessages(latest.messages || [{ role: "assistant", content: "WELCOME_VIEW" }]);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    loadData();
  }, [authUser?.uid]);

  // ---------------- AUTH ----------------
  const handleLogout = async () => {
    try { await logoutApi(); } catch (err) { console.error("Logout failed:", err); }
    navigate("/login");
  };

  // ---------------- CHAT ----------------
  const handleNewChat = async () => {
    const chatId = `chat_${Date.now()}`;
    const welcomeMessages = [{ role: "assistant", content: "WELCOME_VIEW" }];
    setChats(prev => [{ id: chatId, title: "New Chat", folderId: null, messages: welcomeMessages }, ...prev]);
    setCurrentChatId(chatId);
    setMessages(welcomeMessages);
    setSelectedLaws([]);
    try { await createChatApi(chatId, "New Chat"); }
    catch (err) { console.error("Failed to create chat:", err); }
  };

  const handleSelectChat = async (chatId) => {
    setCurrentChatId(chatId);
    try {
      const chat = await getChatApi(chatId);
      setMessages(chat.messages || [{ role: "assistant", content: "WELCOME_VIEW" }]);
    } catch (err) { console.error("Failed to load chat:", err); }
  };

  const handleSend = async (overrideInput) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;

    let activeChatId = currentChatId;
    if (!activeChatId) {
      const chatId = `chat_${Date.now()}`;
      const welcomeMessages = [{ role: "assistant", content: "WELCOME_VIEW" }];
      setChats(prev => [{ id: chatId, title: "New Chat", folderId: null, messages: welcomeMessages }, ...prev]);
      setCurrentChatId(chatId);
      activeChatId = chatId;
      try { await createChatApi(chatId, "New Chat"); }
      catch (err) { console.error("Failed to create chat:", err); }
    }

    // Onko tämä ensimmäinen käyttäjän viesti?
    const isFirstMessage = messages.filter(m => m.role === "user").length === 0;

    const contextLaws = laws
      .filter(l => selectedLaws.includes(l.id))
      .map(l => ({ name: l.name, link: l.link }));

    const userMessage = {
      role: "user",
      content: textToSend,
      context: contextLaws,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages([...updatedMessages, { role: "assistant", content: "Thinking..." }]);
    setInput("");

    try {
      // Ensimmäinen kysymys → backend valitsee automaattisesti (ei lawIds)
      // 2.+ kysymys → lähetä käyttäjän valitsemat lähteet
      const { reply: aiReply, sources } = await askClaude(
        textToSend,
        isFirstMessage ? [] : selectedLaws
      );

      // Ensimmäinen kysymys → aseta AI:n valitsemat lähteet sidebariin
      if (isFirstMessage && sources && sources.length > 0) {
        const sourceIds = sources.map(s => s.id).filter(Boolean);
        setSelectedLaws(sourceIds);
      }

      const finalMessages = [...updatedMessages, { role: "assistant", content: aiReply }];
      setMessages(finalMessages);
      await updateChatMessagesApi(activeChatId, finalMessages);

      const chat = chats.find(c => c.id === activeChatId);
      if (chat?.title === "New Chat") {
        const autoTitle = textToSend.slice(0, 40);
        await updateChatTitleApi(activeChatId, autoTitle);
        setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, title: autoTitle } : c));
      }
    } catch (error) {
      console.error("AI Request Error:", error);
      const errorMessages = [...updatedMessages, { role: "assistant", content: "Error processing request." }];
      setMessages(errorMessages);
      await updateChatMessagesApi(activeChatId, errorMessages).catch(() => {});
    }
  };

  const handleSuggestionClick = (text) => handleSend(text);

  const handleLawClick = (lawName) => {
    if (!lawName) return;
    const normalized = lawName.trim().toLowerCase();
    const match = laws.find(l => {
      const name = l.name.toLowerCase();
      return name.includes(normalized) || normalized.includes(name);
    });
    if (match) toggleLaw(match.id);
    else console.warn("No matching law found:", lawName);
  };

  const toggleLaw = (lawId) => {
    setSelectedLaws(prev =>
      prev.includes(lawId) ? prev.filter(l => l !== lawId) : [...prev, lawId]
    );
  };

  // ---------------- DELETE CHAT ----------------
  const handleDeleteChat = async (chatId) => {
    const remaining = chats.filter(c => c.id !== chatId);
    setChats(remaining);
    if (currentChatId === chatId) {
      if (remaining.length > 0) handleSelectChat(remaining[0].id);
      else {
        setCurrentChatId(null);
        setMessages([{ role: "assistant", content: "WELCOME_VIEW" }]);
        setSelectedLaws([]);
      }
    }
    try { await deleteChatApi(chatId); }
    catch (err) { console.error("Failed to delete chat:", err); }
  };

  // ---------------- FOLDER ACTIONS ----------------
  const handleCreateFolder = async (name, color) => {
    const folderId = `folder_${Date.now()}`;
    setFolders(prev => [...prev, { id: folderId, name, color, chatIds: [] }]);
    try { await createFolderApi(folderId, name, color); }
    catch (err) { console.error("Failed to create folder:", err); }
  };

  const handleUpdateFolder = async (folderId, data) => {
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, ...data } : f));
    try { await updateFolderApi(folderId, data); }
    catch (err) { console.error("Failed to update folder:", err); }
  };

  const handleDeleteFolder = async (folderId) => {
    const affected = chats.filter(c => c.folderId === folderId);
    setFolders(prev => prev.filter(f => f.id !== folderId));
    setChats(prev => prev.map(c => c.folderId === folderId ? { ...c, folderId: null } : c));
    try {
      await deleteFolderApi(folderId);
      await Promise.all(affected.map(c => updateChatFolderApi(c.id, null)));
    } catch (err) { console.error("Failed to delete folder:", err); }
  };

  const handleAddChatToFolder = async (chatId, folderId) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, folderId } : c));
    try { await updateChatFolderApi(chatId, folderId); }
    catch (err) { console.error("Failed to update chat folder:", err); }
  };

  const handleRemoveFromFolder = async (chatId) => {
    await handleAddChatToFolder(chatId, null);
  };

  const handleShareChat = (chatId) => {
    navigator.clipboard.writeText(`${window.location.origin}/chat/${chatId}`);
    alert("Link copied!");
  };

  return {
    chats, folders, messages, currentChatId, openChatMenuId, openFolderId,
    chatSearch, input, selectedLaws, showChatHistory, showFolders, showLawSource,
    laws, authUser,
    setChats, setFolders, setMessages,
    setCurrentChatId: handleSelectChat,
    setOpenChatMenuId, setOpenFolderId, setChatSearch, setInput, setSelectedLaws,
    setShowChatHistory, setShowFolders, setShowLawSource,
    handleLogout, handleNewChat, handleSend, handleSuggestionClick,
    handleLawClick, toggleLaw, handleDeleteChat, handleShareChat,
    handleCreateFolder, handleUpdateFolder, handleDeleteFolder,
    handleAddChatToFolder, handleRemoveFromFolder,
  };
};