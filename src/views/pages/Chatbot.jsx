import { Bot, User } from "lucide-react";
import { Navbar } from '../components/Navbar';
import { useChatbotViewModel } from "../../viewModels/ChatbotViewModel";

export const Chatbot = ({ authViewModel }) => {
  const vm = useChatbotViewModel(authViewModel);

  return (
    <div className="min-h-screen bg-white pt-[50px]">
      <Navbar authViewModel={authViewModel} />
      <div className="flex h-[calc(100vh-50px)]">

      {/* ================= SIDEBAR ================= */}
      <div className="w-72 border-r-2 border-black flex flex-col bg-gray-50">

        <div className="p-4 font-bold text-lg border-b">
          LOGO
        </div>

        <button
          onClick={vm.handleNewChat}
          className="m-4 p-2 border rounded bg-gray-200 hover:bg-gray-300 text-sm"
        >
          Add New Chat
        </button>

        {/* ================= CHAT HISTORY ================= */}
        <div className="px-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => vm.setShowChatHistory(!vm.showChatHistory)}
          >
            <p className="text-sm font-semibold">Latest Chat History</p>
            <span>{vm.showChatHistory ? "▾" : "▸"}</span>
          </div>

          {vm.showChatHistory && (
            <div className="space-y-1 text-sm mt-2">
              {vm.chats
                .filter(chat =>
                  chat.title.toLowerCase().includes(vm.chatSearch.toLowerCase())
                )
                .map(chat => (
                  <div
                    key={chat.id}
                    className="relative flex items-center justify-between p-2 rounded hover:bg-gray-200"
                  >
                    <div
                      onClick={() => vm.setCurrentChatId(chat.id)}
                      className="cursor-pointer flex-1"
                    >
                      {chat.title}
                    </div>

                    <button
                      onClick={() =>
                        vm.setOpenChatMenuId(
                          vm.openChatMenuId === chat.id ? null : chat.id
                        )
                      }
                      className="px-2"
                    >
                      ⋯
                    </button>

                    {vm.openChatMenuId === chat.id && (
                      <div className="absolute right-0 top-8 w-36 bg-white border shadow-md text-xs z-10">
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-100">
                          Share
                        </button>

                        <button
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                          onClick={() => {
                            vm.setChats(vm.chats.filter(c => c.id !== chat.id));
                            vm.setOpenChatMenuId(null);
                          }}
                        >
                          Delete
                        </button>

                        <button
                          className="w-full text-left px-3 py-2 hover:bg-gray-100"
                          onClick={() => vm.addChatToFolder(chat.id)}
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
            onClick={() => vm.setShowFolders(!vm.showFolders)}
          >
            <p className="text-sm font-semibold">Chat Folders</p>
            <span>{vm.showFolders ? "▾" : "▸"}</span>
          </div>

          {vm.showFolders && (
            <div className="mt-2 space-y-2 text-sm">
              {vm.folders.map(folder => (
                <div key={folder.id}>
                  <div
                    className="p-2 bg-gray-200 rounded cursor-pointer flex justify-between"
                    onClick={() =>
                      vm.setOpenFolderId(
                        vm.openFolderId === folder.id ? null : folder.id
                      )
                    }
                  >
                    {folder.name}
                  </div>

                  {vm.openFolderId === folder.id && (
                    <div className="ml-2 mt-1 space-y-1">
                      {vm.chats
                        .filter(chat => chat.folderId === folder.id)
                        .map(chat => (
                          <div
                            key={chat.id}
                            className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                            onClick={() => vm.setCurrentChatId(chat.id)}
                          >
                            {chat.title}
                          </div>
                        ))}

                      {vm.chats.filter(chat => chat.folderId === folder.id).length === 0 && (
                        <p className="text-xs text-gray-400 p-2">No chats</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= LAW SOURCES ================= */}
        <div className="px-4 mt-6 bg-gray-100 rounded flex flex-col">

          <div
            className="flex justify-between items-center cursor-pointer pt-2"
            onClick={() => vm.setShowLawSource(!vm.showLawSource)}
          >
            <p className="text-sm font-semibold">Law source selection</p>
            <span>{vm.showLawSource ? "▾" : "▸"}</span>
          </div>

          {vm.showLawSource && (
            <>
              <div className="space-y-2 text-sm mt-2">
               {vm.laws.map((law) => (
                <label key={law.link} className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vm.selectedLaws.includes(law.link)}
                    onChange={() => vm.toggleLaw(law.link)}
                    className="mt-1"
                  />
                  <div>
                    <p>{law.name}</p>
                    <a
                      href={law.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 underline"
                    >
                      {law.link}
                    </a>
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
              value={vm.chatSearch}
              onChange={(e) => vm.setChatSearch(e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded"
            />
          </div>
        </div>
      </div>

      {/* ================= MAIN CHAT ================= */}
      <div className="flex flex-col flex-1">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b-2 border-black">
          <h1 className="font-bold">Legal Chatbot</h1>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-semibold">{vm.authUser?.username}</p>
              <p className="text-sm text-gray-600">{vm.authUser?.email}</p>
            </div>

            <button
              onClick={vm.handleLogout}
              className="bg-black text-white px-4 py-2 text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {vm.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 flex items-center justify-center border rounded-full">
                  <Bot size={18} />
                </div>
              )}

              <div
                className={`max-w-2xl px-4 py-3 border-2 border-black ${
                  msg.role === "user"
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 flex items-center justify-center border rounded-full">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="border-t-2 border-black p-4 flex gap-4">
          <input
            type="text"
            placeholder="Ask a legal question..."
            value={vm.input}
            onChange={(e) => vm.setInput(e.target.value)}
            className="flex-1 border-2 border-black px-4 py-2 outline-none"
            onKeyDown={(e) => e.key === "Enter" && vm.handleSend()}
          />

          <button
            onClick={vm.handleSend}
            className="bg-black text-white px-6 py-2 font-semibold"
          >
            Send
          </button>
        </div>

      </div>
      </div>
    </div>
  );
};