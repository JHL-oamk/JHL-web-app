import { useState } from 'react';
import { Folder, History, Scale } from 'lucide-react';
import colors from '../../config/colors';

export const ChatbotSidebar = ({ vm }) => {
  const [openLawLink, setOpenLawLink] = useState(null);

  return (
    <aside className="w-[280px] bg-white border-r flex flex-col" style={{ borderColor: colors.grey }}>
      <div className="px-6 pt-6">
        <button
          onClick={vm.handleNewChat}
          className="w-full h-[34px] rounded-full text-[12px] font-medium text-white"
          style={{ backgroundColor: colors.black }}
        >
          Start New Chat
        </button>
      </div>

      <div className="px-6 mt-6">
        <div
          className="flex items-center justify-between text-[12px] font-medium cursor-pointer"
          style={{ color: colors.darkGrey }}
          onClick={() => vm.setShowChatHistory(!vm.showChatHistory)}
        >
          <div className="flex items-center gap-2">
            <History size={12} />
            <span>Latest Conversations</span>
          </div>
          <span className="text-[12px]" aria-hidden="true">
            {vm.showChatHistory ? '▾' : '▸'}
          </span>
        </div>

        {vm.showChatHistory && (
          <div className="mt-3 space-y-2">
            {vm.chats
              .filter((chat) => chat.title.toLowerCase().includes(vm.chatSearch.toLowerCase()))
              .map((chat) => (
                <div key={chat.id} className="relative flex items-center justify-between">
                  <button
                    onClick={() => vm.setCurrentChatId(chat.id)}
                    className="text-[12px] text-black truncate text-left flex-1"
                  >
                    {chat.title}
                  </button>
                  <button
                    onClick={() =>
                      vm.setOpenChatMenuId(vm.openChatMenuId === chat.id ? null : chat.id)
                    }
                    className="text-[12px] px-2"
                    aria-label="Open chat menu"
                  >
                    …
                  </button>

                  {vm.openChatMenuId === chat.id && (
                    <div className="absolute ml-[140px] mt-6 w-36 bg-white border border-gray-200 shadow-md text-[11px] z-10">
                      <button className="w-full text-left px-3 py-2 hover:bg-gray-100">
                        Share
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                        onClick={() => {
                          vm.setChats(vm.chats.filter((c) => c.id !== chat.id));
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

      <div className="px-6 mt-6">
        <div
          className="flex items-center justify-between text-[12px] font-medium cursor-pointer"
          style={{ color: colors.darkGrey }}
          onClick={() => vm.setShowFolders(!vm.showFolders)}
        >
          <div className="flex items-center gap-2">
            <Folder size={12} />
            <span>Conversation Folders</span>
          </div>
          <span className="text-[12px]" aria-hidden="true">
            {vm.showFolders ? '▾' : '▸'}
          </span>
        </div>

        {vm.showFolders && (
          <div className="mt-3 space-y-2">
            <button
              type="button"
              className="flex items-center gap-2 text-[10px] font-medium"
              style={{ color: colors.darkGrey }}
            >
              <span className="text-[14px] leading-none">+</span>
              <span>Create New Folder</span>
            </button>
            {vm.folders.map((folder) => (
              <div key={folder.id}>
                <button
                  className="w-full text-left text-[12px] text-black"
                  onClick={() =>
                    vm.setOpenFolderId(vm.openFolderId === folder.id ? null : folder.id)
                  }
                >
                  {folder.name}
                </button>
                {vm.openFolderId === folder.id && (
                  <div className="mt-2 ml-3 space-y-1">
                    {vm.chats
                      .filter((chat) => chat.folderId === folder.id)
                      .map((chat) => (
                        <button
                          key={chat.id}
                          className="text-[11px] text-left"
                          style={{ color: colors.darkGrey }}
                          onClick={() => vm.setCurrentChatId(chat.id)}
                        >
                          {chat.title}
                        </button>
                      ))}
                    {vm.chats.filter((chat) => chat.folderId === folder.id).length === 0 && (
                      <p className="text-[11px]" style={{ color: colors.darkGrey }}>
                        No chats
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 mt-6 flex-1">
        <div
          className="flex items-center justify-between text-[12px] font-medium cursor-pointer"
          style={{ color: colors.darkGrey }}
          onClick={() => vm.setShowLawSource(!vm.showLawSource)}
        >
          <div className="flex items-center gap-2">
            <Scale size={12} />
            <span>Select Law Sources</span>
          </div>
          <span className="text-[12px]" aria-hidden="true">
            {vm.showLawSource ? '▾' : '▸'}
          </span>
        </div>

        {vm.showLawSource && (
          <div className="mt-3 space-y-2">
            {vm.laws.map((law) => (
              <div key={law.link} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={vm.selectedLaws.includes(law.link)}
                  onChange={() => vm.toggleLaw(law.link)}
                  className="mt-1"
                  style={{ accentColor: colors.primary }}
                />
                <button
                  type="button"
                  className="text-left"
                  onClick={() =>
                    setOpenLawLink(openLawLink === law.link ? null : law.link)
                  }
                >
                  <p className="text-[12px] text-black">{law.name}</p>
                  {openLawLink === law.link && (
                    <a
                      href={law.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] underline block max-w-[160px] truncate"
                      style={{ color: colors.link }}
                      title={law.link}
                    >
                      {law.link}
                    </a>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t" style={{ borderColor: colors.grey }}>
        <input
          type="text"
          placeholder="Search conversations..."
          value={vm.chatSearch}
          onChange={(e) => vm.setChatSearch(e.target.value)}
          className="w-full h-[30px] px-3 text-[12px] border rounded-full"
          style={{ borderColor: colors.grey }}
        />
      </div>
    </aside>
  );
};

export default ChatbotSidebar;
