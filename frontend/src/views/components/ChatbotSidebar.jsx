import { useEffect, useRef, useState } from 'react';
import { Folder, History, Scale } from 'lucide-react';
import colors from '../../config/colors';
import { useTranslation } from 'react-i18next';

export const ChatbotSidebar = ({ vm }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('fi') ? 'fi' : 'en';
  const sidebarRef = useRef(null);
  const [openLawLink, setOpenLawLink] = useState(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const folderColors = [
    '#BE2A41', '#E78A48', '#F3C04F', '#7BB88F', '#4FA3A5',
    '#3E7CB1', '#6B5CA5', '#B05AA6', '#D96C7B', '#6F7C8C'
  ];
  const [newFolderColor, setNewFolderColor] = useState(folderColors[0]);
  const [openFolderColorId, setOpenFolderColorId] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [openAddToFolderChatId, setOpenAddToFolderChatId] = useState(null);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [collapsedCategoryIds, setCollapsedCategoryIds] = useState([]);
  const [lawLimitWarning, setLawLimitWarning] = useState(false);

  const MAX_LAWS = 3;
  const CHAT_SECTION_HEIGHT = '25%';
  const FOLDER_SECTION_HEIGHT = '25%';
  const LAW_SECTION_HEIGHT = '50%';

  const lawCategories = Object.values(
    (vm.laws || []).reduce((acc, law) => {
      const cat = law.category || 'Other';
      if (!acc[cat]) acc[cat] = {
        id: cat,
        name: cat,
        name_fi: law.category_fi || cat,
        name_en: law.category_en || cat,
        sources: []
      };
      acc[cat].sources.push({
        name: law.name,
        name_fi: law.name_fi || law.name,
        name_en: law.name_en || law.name,
        link: law.link,
        id: law.id
      });
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
      const isInteractive = event.target.closest(
        'button, input, a, textarea, select, [data-dropdown-interactive="true"]'
      );
      if (isInteractive) return;
      handleClearDropdowns();
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const handleCategoryToggle = (category) => {
    const categoryIds = category.sources.map(s => s.id);
    const isAllSelected = categoryIds.every(id => vm.selectedLaws.includes(id));
    if (isAllSelected) {
      vm.setSelectedLaws(prev => prev.filter(id => !categoryIds.includes(id)));
      return;
    }
    vm.setSelectedLaws(prev => {
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
    setCollapsedCategoryIds(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    vm.handleCreateFolder(name, newFolderColor);
    setNewFolderName('');
    setNewFolderColor(folderColors[0]);
    setShowCreateFolder(false);
  };

  const handleFolderColorChange = (folderId, color) => {
    vm.handleUpdateFolder(folderId, { color });
    setOpenFolderColorId(null);
  };

  const handleRemoveFromFolder = (chatId) => {
    vm.handleRemoveFromFolder(chatId);
    setOpenMenu(null);
  };

  const handleShareFolder = (folderId) => {
    navigator.clipboard.writeText(`${window.location.origin}/folder/${folderId}`);
    alert('Link copied!');
    setOpenMenu(null);
  };

  const handleDeleteChat = (chatId) => {
    vm.handleDeleteChat(chatId);
    setOpenMenu(null);
  };

  const handleAddToFolder = (chatId, folderId) => {
    vm.handleAddChatToFolder(chatId, folderId);
    setOpenAddToFolderChatId(null);
    setOpenMenu(null);
  };

  const handleDeleteFolder = (folderId) => {
    vm.handleDeleteFolder(folderId);
    setOpenMenu(null);
  };

  const handleEditFolder = (folderId) => {
    const folder = vm.folders.find(f => f.id === folderId);
    setEditingFolderId(folderId);
    setEditingFolderName(folder?.name || '');
    setOpenMenu(null);
  };

  const handleSaveEditFolder = () => {
    const name = editingFolderName.trim();
    if (!name || editingFolderId === null) return;
    vm.handleUpdateFolder(editingFolderId, { name });
    setEditingFolderId(null);
    setEditingFolderName('');
  };

  return (
    <aside
      ref={sidebarRef}
      className="w-[280px] bg-white border-r flex flex-col h-full overflow-hidden"
      style={{ borderColor: colors.grey }}
    >
      <div className="flex-none px-6 pt-6 pb-4 border-b" style={{ borderColor: colors.grey }}>
        <button
          onClick={vm.handleNewChat}
          className="w-full h-[34px] rounded-full text-[12px] font-medium text-white"
          style={{ backgroundColor: colors.black }}
        >
          {t('sidebar.new_chat')}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full flex flex-col min-h-0">
          <section className="flex flex-col min-h-0 overflow-hidden" style={{ flex: `0 0 ${CHAT_SECTION_HEIGHT}` }}>
            <div className="flex-none px-6 pt-5 pb-3" style={{ color: colors.darkGrey }}>
              <div
                className="flex items-center justify-between text-[12px] font-medium cursor-pointer"
                onClick={() => vm.setShowChatHistory(!vm.showChatHistory)}
              >
                <div className="flex items-center gap-2">
                  <History size={12} />
                  <span>{t('sidebar.latest_conversations')}</span>
                </div>
                <span className="text-[12px]" aria-hidden="true">
                  {vm.showChatHistory ? '▾' : '▸'}
                </span>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-6 pb-4">
              {vm.showChatHistory && (
                <div className="space-y-2">
                  {vm.chats
                    .filter(chat => chat.title.toLowerCase().includes(vm.chatSearch.toLowerCase()))
                    .map(chat => (
                      <div key={chat.id} className="relative" style={{ paddingRight: 0, marginRight: 0 }}>
                        <div className="relative group flex items-center justify-between">
                          <button
                            onClick={() => vm.setCurrentChatId(chat.id)}
                            className="text-[12px] text-black truncate text-left flex-1"
                          >
                            {chat.title}
                          </button>
                          <button
                            onClick={() =>
                              setOpenMenu(openMenu?.type === 'chat' && openMenu?.id === chat.id
                                ? null : { type: 'chat', id: chat.id })
                            }
                            className="text-[12px] px-2 opacity-0 group-hover:opacity-100"
                          >
                            …
                          </button>

                          {openMenu?.type === 'chat' && openMenu?.id === chat.id && (
                            <div className="absolute right-0 top-5 z-10" data-dropdown-interactive="true">
                              <div className="relative w-36 bg-white border border-gray-200 shadow-md text-[11px]">
                                <button className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                  onClick={() => vm.handleShareChat(chat.id)}>{t('sidebar.share')}</button>
                                <button className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                  onClick={() => setOpenAddToFolderChatId(
                                    openAddToFolderChatId === chat.id ? null : chat.id
                                  )}>{t('sidebar.add_to_folder')}</button>
                                {openAddToFolderChatId === chat.id && (
                                  <div className="absolute left-0 top-full mt-1 w-40 bg-white border border-gray-200 shadow-md z-20"
                                    data-dropdown-interactive="true">
                                    {vm.folders.length === 0 && (
                                      <p className="px-3 py-2 text-[10px]" style={{ color: colors.darkGrey }}>{t('sidebar.no_folders')}</p>
                                    )}
                                    {vm.folders.map(folder => (
                                      <button key={folder.id}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                                        onClick={() => handleAddToFolder(chat.id, folder.id)}>
                                        <span className="h-2.5 w-2.5 rounded-full"
                                          style={{ backgroundColor: folder.color || colors.grey }} />
                                        <span className="truncate">{folder.name}</span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                                  onClick={() => handleDeleteChat(chat.id)}>{t('sidebar.delete')}</button>
                                {chat.folderId !== null && (
                                  <button className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                    onClick={() => handleRemoveFromFolder(chat.id)}>{t('sidebar.remove_from_folder')}</button>
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
          </section>

          <section className="flex flex-col min-h-0 overflow-hidden" style={{ flex: `0 0 ${FOLDER_SECTION_HEIGHT}` }}>
            <div className="flex-none px-6 pt-5 pb-3" style={{ color: colors.darkGrey }}>
              <div
                className="flex items-center justify-between text-[12px] font-medium cursor-pointer"
                onClick={() => vm.setShowFolders(!vm.showFolders)}
              >
                <div className="flex items-center gap-2">
                  <Folder size={12} />
                  <span>{t('sidebar.conversation_folders')}</span>
                </div>
                <span className="text-[12px]" aria-hidden="true">
                  {vm.showFolders ? '▾' : '▸'}
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-6 pb-4">
              {lawLimitWarning && (
                <div className="mb-2 rounded-md bg-red-100 text-red-700 text-[11px] px-3 py-2">
                  {t('sidebar.law_limit_warning', { max: MAX_LAWS })}
                </div>
              )}

              {vm.showFolders && (
                <div className="space-y-2">
                  <button type="button"
                    className="flex items-center gap-2 text-[10px] font-medium"
                    style={{ color: colors.darkGrey }}
                    onClick={() => setShowCreateFolder(!showCreateFolder)}>
                    <span className="text-[14px] leading-none">+</span>
                    <span>{t('sidebar.create_folder')}</span>
                  </button>

                  {showCreateFolder && (
                    <div className="mt-2 rounded-md border px-3 py-2" style={{ borderColor: colors.grey }}>
                      <input type="text" value={newFolderName}
                        onChange={e => setNewFolderName(e.target.value)}
                        placeholder={t('sidebar.folder_name_placeholder')}
                        className="w-full h-[28px] px-2 text-[11px] border rounded"
                        style={{ borderColor: colors.grey }} />
                      <div className="mt-2 flex items-center gap-2">
                        {folderColors.map(color => (
                          <button key={color} type="button" className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: color,
                              boxShadow: newFolderColor === color ? `0 0 0 2px ${colors.black}` : 'none' }}
                            onClick={() => setNewFolderColor(color)} />
                        ))}
                      </div>
                      <div className="mt-2 flex justify-end">
                        <button type="button"
                          className="h-[24px] px-3 rounded-full text-[10px] text-white"
                          style={{ backgroundColor: colors.black }}
                          onClick={handleCreateFolder}>{t('sidebar.create')}</button>
                      </div>
                    </div>
                  )}

                  {vm.folders.map(folder => (
                    <div key={folder.id} className="relative" style={{ paddingRight: 0, marginRight: 0 }}>
                      <div className="group flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <button type="button" className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: folder.color || colors.grey }}
                            onClick={() => setOpenFolderColorId(
                              openFolderColorId === folder.id ? null : folder.id
                            )} />
                          <button className="w-full text-left text-[12px] text-black truncate"
                            onClick={() => vm.setOpenFolderId(
                              vm.openFolderId === folder.id ? null : folder.id
                            )}>
                            {folder.name}
                          </button>
                        </div>
                        <button
                          onClick={() => setOpenMenu(
                            openMenu?.type === 'folder' && openMenu?.id === folder.id
                              ? null : { type: 'folder', id: folder.id }
                          )}
                          className="text-[12px] px-2 opacity-0 group-hover:opacity-100">…</button>
                      </div>

                      {openFolderColorId === folder.id && (
                        <div className="absolute right-0 mt-1 flex items-center gap-2 rounded-md border bg-white px-2 py-1 shadow-sm z-10"
                          style={{ borderColor: colors.grey }}
                          data-dropdown-interactive="true">
                          {folderColors.map(color => (
                            <button key={color} type="button" className="h-4 w-4 rounded-full"
                              style={{ backgroundColor: color,
                                boxShadow: folder.color === color ? `0 0 0 2px ${colors.black}` : 'none' }}
                              onClick={() => handleFolderColorChange(folder.id, color)} />
                          ))}
                        </div>
                      )}

                      {openMenu?.type === 'folder' && openMenu?.id === folder.id && (
                        <div className="absolute right-2 top-4 z-10" data-dropdown-interactive="true">
                          <div className="w-36 bg-white border border-gray-200 shadow-md text-[11px]">
                            <button className="w-full text-left px-3 py-2 hover:bg-gray-100"
                              onClick={() => handleShareFolder(folder.id)}>{t('sidebar.share')}</button>
                            <button className="w-full text-left px-3 py-2 hover:bg-gray-100"
                              onClick={() => handleEditFolder(folder.id)}>{t('sidebar.edit')}</button>
                            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                              onClick={() => handleDeleteFolder(folder.id)}>{t('sidebar.delete')}</button>
                          </div>
                        </div>
                      )}

                      {editingFolderId === folder.id && (
                        <div className="mt-2 rounded-md border px-3 py-2" style={{ borderColor: colors.grey }}>
                          <input type="text" value={editingFolderName}
                            onChange={e => setEditingFolderName(e.target.value)}
                            placeholder={t('sidebar.folder_name_placeholder')}
                            className="w-full h-[28px] px-2 text-[11px] border rounded"
                            style={{ borderColor: colors.grey }} />
                          <div className="mt-2 flex justify-end gap-2">
                            <button type="button" className="h-[24px] px-3 rounded-full text-[10px]"
                              style={{ color: colors.darkGrey }}
                              onClick={() => { setEditingFolderId(null); setEditingFolderName(''); }}>
                              {t('sidebar.cancel')}
                            </button>
                            <button type="button"
                              className="h-[24px] px-3 rounded-full text-[10px] text-white"
                              style={{ backgroundColor: colors.black }}
                              onClick={handleSaveEditFolder}>{t('sidebar.save')}</button>
                          </div>
                        </div>
                      )}

                      {vm.openFolderId === folder.id && (
                        <div className="mt-2 ml-3 space-y-1">
                          {vm.chats.filter(chat => chat.folderId === folder.id).map(chat => (
                            <div key={chat.id} className="relative"
                              style={{ paddingRight: 170, marginRight: -170 }}>
                              <div className="relative group flex items-center justify-between">
                                <button className="text-[11px] text-left truncate flex-1 text-black"
                                  onClick={() => vm.setCurrentChatId(chat.id)}>
                                  {chat.title}
                                </button>
                                <button
                                  onClick={() => setOpenMenu(
                                    openMenu?.type === 'folderChat' && openMenu?.id === chat.id
                                      ? null : { type: 'folderChat', id: chat.id }
                                  )}
                                  className="text-[12px] px-2 opacity-0 group-hover:opacity-100">…</button>

                                {openMenu?.type === 'folderChat' && openMenu?.id === chat.id && (
                                  <div className="absolute right-0 top-5 z-10" data-dropdown-interactive="true">
                                    <div className="w-36 bg-white border border-gray-200 shadow-md text-[11px]">
                                      <button className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                        onClick={() => vm.handleShareChat(chat.id)}>{t('sidebar.share')}</button>
                                      <button className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                        onClick={() => handleRemoveFromFolder(chat.id)}>{t('sidebar.remove_from_folder')}</button>
                                      <button className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                                        onClick={() => handleDeleteChat(chat.id)}>{t('sidebar.delete')}</button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {vm.chats.filter(chat => chat.folderId === folder.id).length === 0 && (
                            <p className="text-[11px]" style={{ color: colors.darkGrey }}>{t('sidebar.no_chats')}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="flex flex-col min-h-0 overflow-hidden" style={{ flex: `0 0 ${LAW_SECTION_HEIGHT}` }}>
            <div className="flex-none px-6 pt-5 pb-3" style={{ color: colors.darkGrey }}>
              <div
                className="flex items-center justify-between text-[12px] font-medium cursor-pointer"
                onClick={() => vm.setShowLawSource(!vm.showLawSource)}
              >
                <div className="flex items-center gap-2">
                  <Scale size={12} />
                  <span>{t('sidebar.select_law_sources')}</span>
                </div>
                <span className="text-[12px]" aria-hidden="true">
                  {vm.showLawSource ? '▾' : '▸'}
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-6 pb-4">
              {vm.showLawSource && (
                <div className="space-y-6">
                  {lawCategories.map(category => {
                    const categoryIds = category.sources.map(s => s.id);
                    const isCategorySelected = categoryIds.every(id => vm.selectedLaws.includes(id));
                    const isCollapsed = collapsedCategoryIds.includes(category.id);
                    const categoryLabel = lang === 'fi' ? category.name_fi : category.name_en;

                    return (
                      <div key={category.id}>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" checked={isCategorySelected}
                            onChange={() => handleCategoryToggle(category)}
                            className="mt-0.5" style={{ accentColor: colors.primary }} />
                          <p className="text-[12px] text-black">{categoryLabel}</p>
                          <button type="button" className="text-[12px]" style={{ color: colors.darkGrey }}
                            onClick={() => toggleCategoryCollapse(category.id)}>
                            {isCollapsed ? '▸' : '▾'}
                          </button>
                        </div>
                        <div className="mt-2" style={{ borderBottom: `1px solid ${colors.lightGrey}` }} />
                        {!isCollapsed && (
                          <div className="mt-2 space-y-2">
                            {category.sources.map(law => {
                              const lawLabel = lang === 'fi' ? law.name_fi : law.name_en;
                              return (
                                <div key={law.id} className="flex items-start gap-2">
                                  <input type="checkbox" checked={vm.selectedLaws.includes(law.id)}
                                    onChange={() => {
                                      vm.setSelectedLaws(prev => {
                                        if (prev.includes(law.id)) return prev.filter(id => id !== law.id);
                                        if (prev.length >= MAX_LAWS) {
                                          setLawLimitWarning(true);
                                          setTimeout(() => setLawLimitWarning(false), 2500);
                                          return prev;
                                        }
                                        return [...prev, law.id];
                                      });
                                    }}
                                    className="mt-1" style={{ accentColor: colors.primary }} />
                                  <button type="button" className="text-left"
                                    onClick={() => setOpenLawLink(openLawLink === law.id ? null : law.id)}>
                                    <p className="text-[12px] text-black">{lawLabel}</p>
                                    {openLawLink === law.id && (
                                      <a href={law.link} target="_blank" rel="noopener noreferrer"
                                        className="text-[11px] underline block max-w-[200px] truncate"
                                        style={{ color: colors.link }} title={law.link}>
                                        {law.link}
                                      </a>
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="flex-none px-6 py-4 border-t" style={{ borderColor: colors.grey }}>
        <input type="text" placeholder={t('sidebar.search_placeholder')}
          value={vm.chatSearch} onChange={e => vm.setChatSearch(e.target.value)}
          className="w-full h-[30px] px-3 text-[12px] border rounded-full"
          style={{ borderColor: colors.grey }} />
      </div>
    </aside>
  );
};

export default ChatbotSidebar;
