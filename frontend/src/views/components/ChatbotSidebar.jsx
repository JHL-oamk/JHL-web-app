import { useEffect, useRef, useState } from 'react';
import { Folder, History, Scale } from 'lucide-react';
import colors from '../../config/colors';

export const ChatbotSidebar = ({ vm }) => {
  const sidebarRef = useRef(null);
  const [openLawLink, setOpenLawLink] = useState(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const folderColors = [
    '#BE2A41',
    '#E78A48',
    '#F3C04F',
    '#7BB88F',
    '#4FA3A5',
    '#3E7CB1',
    '#6B5CA5',
    '#B05AA6',
    '#D96C7B',
    '#6F7C8C'
  ];
  const [newFolderColor, setNewFolderColor] = useState(folderColors[0]);
  const [openFolderColorId, setOpenFolderColorId] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [openAddToFolderChatId, setOpenAddToFolderChatId] = useState(null);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [collapsedCategoryIds, setCollapsedCategoryIds] = useState([]);
  const [lawLimitWarning, setLawLimitWarning] = useState(false);

  const MAX_LAWS = 3; //
  const isAtLawLimit = (currentCount) => currentCount >= MAX_LAWS;

  const lawCategories = Object.values(
    (vm.laws || []).reduce((acc, law) => {
      const cat = law.category || 'Other';
      if (!acc[cat]) acc[cat] = { id: cat, name: cat, sources: [] };
      acc[cat].sources.push({ name: law.name, link: law.link, id: law.id });
      return acc;
    }, {})
  );

  const handleClearDropdowns = () => {
    setOpenMenu(null);
    setOpenAddToFolderChatId(null);
    setOpenFolderColorId(null);
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      const sidebar = sidebarRef.current;
      if (!sidebar) return;

      const target = event.target;
      const isInteractive = target.closest(
        'button, input, a, textarea, select, [data-dropdown-interactive="true"]'
      );

      if (isInteractive) return;
      handleClearDropdowns();
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const handleCategoryToggle = (category) => {
  const categoryIds = category.sources.map((source) => source.id);

  const isAllSelected = categoryIds.every((id) =>
    vm.selectedLaws.includes(id)
  );

  if (isAllSelected) {
    vm.setSelectedLaws((prev) =>
      prev.filter((id) => !categoryIds.includes(id))
    );
    return;
  }

  vm.setSelectedLaws((prev) => {
    let merged = [...prev];

    for (const id of categoryIds) {
      if (merged.includes(id)) continue;

      if (merged.length >= MAX_LAWS) {
        setLawLimitWarning(true);
        setTimeout(() => setLawLimitWarning(false), 2500);
        break;
      }

      merged.push(id);
    }

    return merged;
  });
};

  const toggleCategoryCollapse = (categoryId) => {
    setCollapsedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    const newFolder = {
      id: Date.now(),
      name,
      chatIds: [],
      color: newFolderColor
    };
    vm.setFolders((prev) => [...prev, newFolder]);
    setNewFolderName('');
    setNewFolderColor(folderColors[0]);
    setShowCreateFolder(false);
  };

  const handleFolderColorChange = (folderId, color) => {
    vm.setFolders((prev) =>
      prev.map((folder) => (folder.id === folderId ? { ...folder, color } : folder))
    );
    setOpenFolderColorId(null);
  };

  const handleRemoveFromFolder = (chatId) => {
    vm.setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, folderId: null } : chat))
    );
    setOpenMenu(null);
  };

  const handleShareFolder = (folderId) => {
    navigator.clipboard.writeText(`${window.location.origin}/folder/${folderId}`);
    alert('Link copied!');
    setOpenMenu(null);
  };

  const handleDeleteChat = (chatId) => {
    vm.setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    setOpenMenu(null);
  };

  const handleAddToFolder = (chatId, folderId) => {
    vm.setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, folderId } : chat))
    );
    setOpenAddToFolderChatId(null);
    setOpenMenu(null);
  };

  const handleDeleteFolder = (folderId) => {
    vm.setChats((prev) =>
      prev.map((chat) => (chat.folderId === folderId ? { ...chat, folderId: null } : chat))
    );
    vm.setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
    setOpenMenu(null);
  };

  const handleEditFolder = (folderId) => {
    const folder = vm.folders.find((item) => item.id === folderId);
    setEditingFolderId(folderId);
    setEditingFolderName(folder?.name || '');
    setOpenMenu(null);
  };

  const handleSaveEditFolder = () => {
    const name = editingFolderName.trim();
    if (!name || editingFolderId === null) return;
    vm.setFolders((prev) =>
      prev.map((folder) => (folder.id === editingFolderId ? { ...folder, name } : folder))
    );
    setEditingFolderId(null);
    setEditingFolderName('');
  };

  return (
    <aside
      ref={sidebarRef}
      className="w-[280px] bg-white border-r flex flex-col"
      style={{ borderColor: colors.grey }}
    >
      {/* New chat */}
      <div className="px-6 pt-6">
        <button
          onClick={vm.handleNewChat}
          className="w-full h-[34px] rounded-full text-[12px] font-medium text-white"
          style={{ backgroundColor: colors.black }}
        >
          Start New Chat
        </button>
      </div>

      {/* Latest conversations */}
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
                <div
                  key={chat.id}
                  className="relative"
                  style={{ paddingRight: 170, marginRight: -170 }}
                >
                  <div className="relative group flex items-center justify-between">
                    <button
                      onClick={() => vm.setCurrentChatId(chat.id)}
                      className="text-[12px] text-black truncate text-left flex-1"
                    >
                      {chat.title}
                    </button>
                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu?.type === 'chat' && openMenu?.id === chat.id
                            ? null
                            : { type: 'chat', id: chat.id }
                        )
                      }
                      className="text-[12px] px-2 opacity-0 group-hover:opacity-100"
                      aria-label="Open chat menu"
                    >
                      …
                    </button>

                    {openMenu?.type === 'chat' && openMenu?.id === chat.id && (
                      <div className="absolute right-0 top-5 z-10" data-dropdown-interactive="true">
                        <div className="relative w-36 bg-white border border-gray-200 shadow-md text-[11px]">
                          <button
                            className="w-full text-left px-3 py-2 hover:bg-gray-100"
                            onClick={() => vm.handleShareChat(chat.id)}
                          >
                            Share
                          </button>
                          <button
                            className="w-full text-left px-3 py-2 hover:bg-gray-100"
                            onClick={() =>
                              setOpenAddToFolderChatId(
                                openAddToFolderChatId === chat.id ? null : chat.id
                              )
                            }
                          >
                            Add to folder
                          </button>
                          {openAddToFolderChatId === chat.id && (
                            <div
                              className="absolute left-full top-0 ml-1 w-40 bg-white border border-gray-200 shadow-md"
                              data-dropdown-interactive="true"
                            >
                              {vm.folders.length === 0 && (
                                <p className="px-3 py-2 text-[10px]" style={{ color: colors.darkGrey }}>
                                  No folders
                                </p>
                              )}
                              {vm.folders.map((folder) => (
                                <button
                                  key={folder.id}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                                  onClick={() => handleAddToFolder(chat.id, folder.id)}
                                >
                                  <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: folder.color || colors.grey }}
                                  />
                                  <span className="truncate">{folder.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                          <button
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                            onClick={() => handleDeleteChat(chat.id)}
                          >
                            Delete
                          </button>
                          {chat.folderId !== null && (
                            <button
                              className="w-full text-left px-3 py-2 hover:bg-gray-100"
                              onClick={() => handleRemoveFromFolder(chat.id)}
                            >
                              Remove from folder
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Conversation folders */}
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
                  {lawLimitWarning && (
        <div className="mt-2 mb-2 rounded-md bg-red-100 text-red-700 text-[11px] px-3 py-2">
          You can select maxium of {MAX_LAWS} laws.
        </div>
          )}

        {vm.showFolders && (
          <div className="mt-3 space-y-2">
            <button
              type="button"
              className="flex items-center gap-2 text-[10px] font-medium"
              style={{ color: colors.darkGrey }}
              onClick={() => setShowCreateFolder(!showCreateFolder)}
            >
              <span className="text-[14px] leading-none">+</span>
              <span>Create New Folder</span>
            </button>
            {showCreateFolder && (
              <div className="mt-2 rounded-md border px-3 py-2" style={{ borderColor: colors.grey }}>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="w-full h-[28px] px-2 text-[11px] border rounded"
                  style={{ borderColor: colors.grey }}
                />
                <div className="mt-2 flex items-center gap-2">
                  {folderColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="h-4 w-4 rounded-full"
                      style={{
                        backgroundColor: color,
                        boxShadow:
                          newFolderColor === color
                            ? `0 0 0 2px ${colors.black}`
                            : 'none'
                      }}
                      onClick={() => setNewFolderColor(color)}
                      aria-label="Select folder color"
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    className="h-[24px] px-3 rounded-full text-[10px] text-white"
                    style={{ backgroundColor: colors.black }}
                    onClick={handleCreateFolder}
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
            {vm.folders.map((folder) => (
              <div
                key={folder.id}
                className="relative"
                style={{ paddingRight: 170, marginRight: -170 }}
              >
                <div className="group flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      type="button"
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: folder.color || colors.grey }}
                      onClick={() =>
                        setOpenFolderColorId(openFolderColorId === folder.id ? null : folder.id)
                      }
                      aria-label="Change folder color"
                    />
                    <button
                      className="w-full text-left text-[12px] text-black truncate"
                      onClick={() =>
                        vm.setOpenFolderId(vm.openFolderId === folder.id ? null : folder.id)
                      }
                    >
                      {folder.name}
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu?.type === 'folder' && openMenu?.id === folder.id
                          ? null
                          : { type: 'folder', id: folder.id }
                      )
                    }
                    className="text-[12px] px-2 opacity-0 group-hover:opacity-100"
                    aria-label="Open folder menu"
                  >
                    …
                  </button>
                </div>

                {openFolderColorId === folder.id && (
                  <div
                    className="absolute right-0 mt-1 flex items-center gap-2 rounded-md border bg-white px-2 py-1 shadow-sm z-10"
                    style={{ borderColor: colors.grey }}
                    data-dropdown-interactive="true"
                  >
                    {folderColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="h-4 w-4 rounded-full"
                        style={{
                          backgroundColor: color,
                          boxShadow:
                            folder.color === color
                              ? `0 0 0 2px ${colors.black}`
                              : 'none'
                        }}
                        onClick={() => handleFolderColorChange(folder.id, color)}
                        aria-label="Select folder color"
                      />
                    ))}
                  </div>
                )}

                {openMenu?.type === 'folder' && openMenu?.id === folder.id && (
                  <div className="absolute right-2 top-4 z-10" data-dropdown-interactive="true">
                    <div className="w-36 bg-white border border-gray-200 shadow-md text-[11px]">
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-100"
                        onClick={() => handleShareFolder(folder.id)}
                      >
                        Share
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-100"
                        onClick={() => handleEditFolder(folder.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                        onClick={() => handleDeleteFolder(folder.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {editingFolderId === folder.id && (
                  <div className="mt-2 rounded-md border px-3 py-2" style={{ borderColor: colors.grey }}>
                    <input
                      type="text"
                      value={editingFolderName}
                      onChange={(e) => setEditingFolderName(e.target.value)}
                      placeholder="Folder name"
                      className="w-full h-[28px] px-2 text-[11px] border rounded"
                      style={{ borderColor: colors.grey }}
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        className="h-[24px] px-3 rounded-full text-[10px]"
                        style={{ color: colors.darkGrey }}
                        onClick={() => {
                          setEditingFolderId(null);
                          setEditingFolderName('');
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="h-[24px] px-3 rounded-full text-[10px] text-white"
                        style={{ backgroundColor: colors.black }}
                        onClick={handleSaveEditFolder}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}

                {vm.openFolderId === folder.id && (
                  <div className="mt-2 ml-3 space-y-1">
                    {vm.chats
                      .filter((chat) => chat.folderId === folder.id)
                      .map((chat) => (
                        <div
                          key={chat.id}
                          className="relative"
                          style={{ paddingRight: 170, marginRight: -170 }}
                        >
                          <div className="relative group flex items-center justify-between">
                            <button
                              className="text-[11px] text-left truncate flex-1 text-black"
                              onClick={() => vm.setCurrentChatId(chat.id)}
                            >
                              {chat.title}
                            </button>
                            <button
                              onClick={() =>
                                setOpenMenu(
                                  openMenu?.type === 'folderChat' && openMenu?.id === chat.id
                                    ? null
                                    : { type: 'folderChat', id: chat.id }
                                )
                              }
                              className="text-[12px] px-2 opacity-0 group-hover:opacity-100"
                              aria-label="Open chat menu"
                            >
                              …
                            </button>

                            {openMenu?.type === 'folderChat' && openMenu?.id === chat.id && (
                              <div className="absolute right-0 top-5 z-10" data-dropdown-interactive="true">
                                <div className="w-36 bg-white border border-gray-200 shadow-md text-[11px]">
                                  <button
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                    onClick={() => vm.handleShareChat(chat.id)}
                                  >
                                    Share
                                  </button>
                                  <button
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                    onClick={() => handleRemoveFromFolder(chat.id)}
                                  >
                                    Remove from folder
                                  </button>
                                  <button
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                                    onClick={() => handleDeleteChat(chat.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
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

      {/* Law sources */}
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
          <div className="mt-3 space-y-6">
            {lawCategories.map((category) => {
              const categoryIds = category.sources.map((source) => source.id);
              const isCategorySelected = categoryIds.every((id) =>
                vm.selectedLaws.includes(id)
              );
              const isCollapsed = collapsedCategoryIds.includes(category.id);

              return (
                <div key={category.id}>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isCategorySelected}
                      onChange={() => handleCategoryToggle(category)}
                      className="mt-0.5"
                      style={{ accentColor: colors.primary }}
                    />
                    <p className="text-[12px] text-black">{category.name}</p>
                    <button
                      type="button"
                      className="text-[12px]"
                      style={{ color: colors.darkGrey }}
                      onClick={() => toggleCategoryCollapse(category.id)}
                      aria-label={isCollapsed ? 'Expand category' : 'Collapse category'}
                    >
                      {isCollapsed ? '▸' : '▾'}
                    </button>
                  </div>
                  <div className="mt-2" style={{ borderBottom: `1px solid ${colors.lightGrey}` }} />
                  {!isCollapsed && (
                    <div className="mt-2 space-y-2">
                      {category.sources.map((law) => (
                        <div key={law.id} className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={vm.selectedLaws.includes(law.id)}
                            onChange={() => {
                        vm.setSelectedLaws((prev) => {
                        const isSelected = prev.includes(law.id);

                          if (isSelected) {
                          return prev.filter((id) => id !== law.id);
                          }

                          if (prev.length >= MAX_LAWS) {
                          setLawLimitWarning(true);
                            setTimeout(() => setLawLimitWarning(false), 2500);
                        return prev;
                            }

                        return [...prev, law.id];
                          });
                          }}
                            className="mt-1"
                            style={{ accentColor: colors.primary }}
                          />
                          <button
                            type="button"
                            className="text-left"
                            onClick={() =>
                              setOpenLawLink(openLawLink === law.id ? null : law.id)
                            }
                          >
                            <p className="text-[12px] text-black">{law.name}</p>
                            {openLawLink === law.id && (
                            <a
                              href={law.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] underline block max-w-[200px] truncate"
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
              );
            })}
          </div>
        )}
      </div>

      {/* Search */}
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