import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Bot, User } from 'lucide-react';

export const Dashboard = ({ authViewModel }) => {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [chats, setChats] = useState([
    { id: 1, title: "Labor Law Question", folderId: null },
    { id: 2, title: "Contract Issue", folderId: null }
  ]);

  const [folders, setFolders] = useState([
    { id: 1, name: "Work", chatIds: [] },
    { id: 2, name: "Study", chatIds: [] }
  ]);

  const [currentChatId, setCurrentChatId] = useState(1);
  const [openChatMenuId, setOpenChatMenuId] = useState(null);
  const [openFolderId, setOpenFolderId] = useState(null);
  const [chatSearch, setChatSearch] = useState('');

  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! Ask me any legal question.' }
  ]);

  const [input, setInput] = useState('');
  const [selectedLaws, setSelectedLaws] = useState([]);

  // ---------------- DROPDOWN STATES ----------------
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [showFolders, setShowFolders] = useState(true);
  const [showLawSource, setShowLawSource] = useState(true);

  const laws = [
    "Finnish work law",
    "Contract law",
    "Employment law",
    "Criminal law",
    "Tax law",
    "Civil law"
  ];

  // ---------------- AUTH ----------------
  const handleLogout = async () => {
    await authViewModel.logout();
    navigate('/login');
  };

  // ---------------- CHAT ----------------
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      folderId: null
    };

    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);

    setMessages([
      { role: 'assistant', content: 'New chat started. Ask your question!' }
    ]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user', content: input }
    ];

    setMessages(newMessages);
    setInput('');

    const reply = selectedLaws.length
      ? `Answer based on: ${selectedLaws.join(", ")}`
      : "Please select a law source.";

    setMessages([
      ...newMessages,
      { role: 'assistant', content: reply }
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

  return (
    <div className="flex h-screen bg-white">

      {/* ================= SIDEBAR ================= */}
      <div className="w-72 border-r-2 border-black flex flex-col bg-gray-50">

        <div className="p-4 font-bold text-lg border-b">
          LOGO
        </div>

        <button
          onClick={handleNewChat}
          className="m-4 p-2 border rounded bg-gray-200 hover:bg-gray-300 text-sm"
        >
          Add New Chat
        </button>

        {/* ================= CHAT HISTORY ================= */}
        <div className="px-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowChatHistory(!showChatHistory)}
          >
            <p className="text-sm font-semibold">Latest Chat History</p>
            <span>{showChatHistory ? "▾" : "▸"}</span>
          </div>

          {showChatHistory && (
            <div className="space-y-1 text-sm mt-2">
              {chats
                .filter(chat =>
                  chat.title.toLowerCase().includes(chatSearch.toLowerCase())
                )
                .map(chat => (
                  <div
                    key={chat.id}
                    className="relative flex items-center justify-between p-2 rounded hover:bg-gray-200"
                  >
                    <div
                      onClick={() => setCurrentChatId(chat.id)}
                      className="cursor-pointer flex-1"
                    >
                      {chat.title}
                    </div>

                    <button
                      onClick={() =>
                        setOpenChatMenuId(openChatMenuId === chat.id ? null : chat.id)
                      }
                      className="px-2"
                    >
                      ⋯
                    </button>

                    {openChatMenuId === chat.id && (
                      <div className="absolute right-0 top-8 w-36 bg-white border shadow-md text-xs z-10">
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-100">
                          Share
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                          onClick={() => {
                            setChats(chats.filter(c => c.id !== chat.id));
                            setOpenChatMenuId(null);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 hover:bg-gray-100"
                          onClick={() => addChatToFolder(chat.id)}
                        >
                          Add to folder
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* ================= FOLDERS ================= */}
        <div className="px-4 mt-6">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowFolders(!showFolders)}
          >
            <p className="text-sm font-semibold">Chat Folders</p>
            <span>{showFolders ? "▾" : "▸"}</span>
          </div>

          {showFolders && (
            <div className="mt-2 space-y-2 text-sm">
              {folders.map(folder => (
                <div key={folder.id}>
                  <div
                    className="p-2 bg-gray-200 rounded cursor-pointer flex justify-between"
                    onClick={() =>
                      setOpenFolderId(openFolderId === folder.id ? null : folder.id)
                    }
                  >
                    {folder.name}
                    <span>▾</span>
                  </div>

                  {openFolderId === folder.id && (
                    <div className="ml-2 mt-1 space-y-1">
                      {chats
                        .filter(chat => chat.folderId === folder.id)
                        .map(chat => (
                          <div
                            key={chat.id}
                            className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                            onClick={() => setCurrentChatId(chat.id)}
                          >
                            {chat.title}
                          </div>
                        ))}

                      {chats.filter(chat => chat.folderId === folder.id).length === 0 && (
                        <p className="text-xs text-gray-400 p-2">No chats</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= LAW SOURCE ================= */}
        <div className="px-4 mt-6 bg-gray-100 rounded flex flex-col">

          <div
            className="flex justify-between items-center cursor-pointer pt-2"
            onClick={() => setShowLawSource(!showLawSource)}
          >
            <p className="text-sm font-semibold">Law source selection</p>
            <span>{showLawSource ? "▾" : "▸"}</span>
          </div>

          {showLawSource && (
            <>
              <input
                type="text"
                placeholder="Search laws..."
                className="w-full mb-3 px-2 py-1 text-sm border rounded mt-2"
              />

              <div className="space-y-2 text-sm overflow-y-auto max-h-48 pr-1">
                {laws.map((law, index) => (
                  <label key={index} className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLaws.includes(law)}
                      onChange={() => toggleLaw(law)}
                      className="mt-1"
                    />
                    <div>
                      <p>{law}</p>
                      <p className="text-xs text-gray-500">www.link-example.com</p>
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}
          <div className="mt-4">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
        </div>

      </div>

      {/* ================= MAIN CHAT ================= */}
      <div className="flex flex-col flex-1">

        <div className="flex justify-between items-center px-6 py-4 border-b-2 border-black">
          <h1 className="font-bold">Legal Chatbot</h1>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-semibold">{authViewModel.user?.username}</p>
              <p className="text-sm text-gray-600">{authViewModel.user?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 flex items-center justify-center border rounded-full">
                  <Bot size={18} />
                </div>
              )}

              <div className={`max-w-2xl px-4 py-3 border-2 border-black ${msg.role === 'user' ? 'bg-black text-white' : 'bg-white'}`}>
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 flex items-center justify-center border rounded-full">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t-2 border-black p-4 flex gap-4">
          <input
            type="text"
            placeholder="Ask a legal question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border-2 border-black px-4 py-2 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />

          <button
            onClick={handleSend}
            className="bg-black text-white px-6 py-2 font-semibold"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
};