import { useEffect, useMemo, useRef, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import colors from '../../config/colors';

const buildInitialCategories = () => ([
  {
    id: 1,
    title: 'Work',
    sources: [
      {
        id: 101,
        type: 'link',
        title: 'Finnish Work Law',
        url: 'https://www.finlex.fi/en/legislation/2001/55'
      },
      {
        id: 102,
        type: 'link',
        title: 'Working Hours Act',
        url: 'https://www.finlex.fi/en/legislation/1996/605'
      },
      {
        id: 103,
        type: 'link',
        title: 'Annual Holidays Act',
        url: 'https://www.finlex.fi/en/legislation/2005/162'
      },
    ]
  },
  {
    id: 2,
    title: 'Study',
    sources: [
      {
        id: 201,
        type: 'link',
        title: 'Occupational Safety and Health Act',
        url: 'https://www.finlex.fi/en/legislation/2002/738'
      },
      {
        id: 202,
        type: 'link',
        title: 'Non-Discrimination Act',
        url: 'https://www.finlex.fi/en/legislation/2014/1325'
      }
    ]
  },
  {
    id: 3,
    title: 'Something else',
    sources: [
      {
        id: 301,
        type: 'link',
        title: 'Cooperation within Undertakings Act',
        url: 'https://www.finlex.fi/en/legislation/2021/1333'
      },
      {
        id: 302,
        type: 'link',
        title: 'Act on the Publicity of Government Activities',
        url: 'https://www.finlex.fi/en/legislation/1999/621'
      }
    ]
  }
]);

export const LawSources = ({ authViewModel }) => {
  const [categories, setCategories] = useState(buildInitialCategories);
  const [isEditMode, setIsEditMode] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [sourceDrafts, setSourceDrafts] = useState({});
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const addCategoryRef = useRef(null);
  const sourceDraftRefs = useRef({});

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;

    return categories
      .map((category) => {
        const categoryMatch = category.title.toLowerCase().includes(query);
        const matchingSources = category.sources.filter((source) => {
          const haystack = `${source.title} ${source.url || ''}`.toLowerCase();
          return haystack.includes(query);
        });
        return {
          ...category,
          sources: categoryMatch ? category.sources : matchingSources
        };
      })
      .filter((category) => category.sources.length > 0);
  }, [categories, search]);

  const handleToggleEdit = () => {
    setIsEditMode((prev) => !prev);
    setShowAddCategory(false);
    setSourceDrafts({});
  };

  const handleAddCategoryToggle = () => {
    setShowAddCategory((prev) => !prev);
    setNewCategoryTitle('');
  };

  const handleAddCategory = () => {
    const title = newCategoryTitle.trim();
    if (!title) return;

    const newCategory = {
      id: Date.now(),
      title,
      sources: []
    };

    setCategories((prev) => [newCategory, ...prev]);
    setShowAddCategory(false);
    setNewCategoryTitle('');
  };

  const handleToggleCategory = (categoryId) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories((prev) => prev.filter((category) => category.id !== categoryId));
  };

  const handleDeleteSource = (categoryId, sourceId) => {
    setCategories((prev) => prev.map((category) => {
      if (category.id !== categoryId) return category;
      return {
        ...category,
        sources: category.sources.filter((source) => source.id !== sourceId)
      };
    }));
  };

  const handleOpenSourceDraft = (categoryId) => {
    setSourceDrafts((prev) => ({
      ...prev,
      [categoryId]: {
        open: true,
        title: '',
        url: '',
        fileName: '',
        fileUrl: ''
      }
    }));
  };

  const isSourceDraftEmpty = (draft) => {
    if (!draft) return true;
    const title = draft.title?.trim();
    const url = draft.url?.trim();
    return !title && !url && !draft.fileName && !draft.fileUrl;
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (showAddCategory && !newCategoryTitle.trim()) {
        if (addCategoryRef.current && !addCategoryRef.current.contains(event.target)) {
          setShowAddCategory(false);
        }
      }

      setSourceDrafts((prev) => {
        let hasChanges = false;
        const next = { ...prev };

        Object.entries(prev).forEach(([categoryId, draft]) => {
          if (!draft?.open || !isSourceDraftEmpty(draft)) return;
          const draftRef = sourceDraftRefs.current[categoryId];
          if (draftRef && draftRef.contains(event.target)) return;
          next[categoryId] = {
            ...draft,
            open: false
          };
          hasChanges = true;
        });

        return hasChanges ? next : prev;
      });
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showAddCategory, newCategoryTitle]);

  const handleSourceDraftChange = (categoryId, field, value) => {
    setSourceDrafts((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [field]: value,
        ...(field === 'url' && value.trim()
          ? { fileName: '', fileUrl: '' }
          : {})
      }
    }));
  };

  const handleFileSelect = (categoryId, file) => {
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    setSourceDrafts((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        url: '',
        fileName: file.name,
        fileUrl
      }
    }));
  };

  const handleClearFile = (categoryId) => {
    setSourceDrafts((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        fileName: '',
        fileUrl: ''
      }
    }));
  };

  const handleAddSource = (categoryId) => {
    const draft = sourceDrafts[categoryId];
    if (!draft) return;

    const title = draft.title.trim();
    const url = draft.url.trim();
    const fileUrl = draft.fileUrl;

    if (!title && !draft.fileName) return;
    if (!url && !fileUrl) return;

    const source = {
      id: Date.now(),
      type: url ? 'link' : 'file',
      title: title || draft.fileName,
      url: url || fileUrl,
      fileName: draft.fileName || ''
    };

    setCategories((prev) => prev.map((category) => {
      if (category.id !== categoryId) return category;
      return {
        ...category,
        sources: [...category.sources, source]
      };
    }));

    setSourceDrafts((prev) => ({
      ...prev,
      [categoryId]: {
        open: false,
        title: '',
        url: '',
        fileName: '',
        fileUrl: ''
      }
    }));
  };

  const renderSource = (categoryId, source) => (
    <div key={source.id} className="flex items-start justify-between gap-6 py-2">
      <div>
        <div className="text-sm font-semibold" style={{ color: colors.black }}>{source.title}</div>
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm underline"
          style={{ color: colors.link }}
        >
          {source.url}
        </a>
      </div>
      {isEditMode && (
        <button
          type="button"
          onClick={() => handleDeleteSource(categoryId, source.id)}
          style={{ color: colors.darkGrey }}
        >
          ✕
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-[50px]" style={{ color: colors.black, backgroundColor: colors.white }}>
      <Navbar authViewModel={authViewModel} />

      <div className="max-w-[980px] mx-auto px-8 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold mb-1" style={{ color: colors.black }}>Law Sources List</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full px-4 h-[36px]" style={{ backgroundColor: colors.lightGrey }}>
              <span className="text-3xl" style={{ color: colors.darkGrey }}>⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search keywords..."
                className="bg-transparent text-xs w-[160px] outline-none"
              />
            </div>
            {categories.length > 0 && (
              <Button
                size="small"
                variant="red"
                className="px-6"
                onClick={handleToggleEdit}
              >
                {isEditMode ? 'Save' : 'Edit'}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6">
          {(isEditMode || categories.length === 0) && !showAddCategory && (
            <button
              type="button"
              onClick={handleAddCategoryToggle}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-xs"
              style={{ backgroundColor: colors.lightGrey, color: colors.darkGrey }}
            >
              <span className="text-sm font-bold">＋</span>
              Add New Category
            </button>
          )}

          {showAddCategory && (
            <div
              ref={addCategoryRef}
              className="mt-2 flex items-center gap-4 rounded-full px-6 py-2 max-w-[560px]"
              style={{ backgroundColor: colors.lightGrey }}
            >
              <span className="text-xs w-[64px]" style={{ color: colors.darkGrey }}>Title:</span>
              <input
                value={newCategoryTitle}
                onChange={(event) => setNewCategoryTitle(event.target.value)}
                placeholder="Category name"
                className="flex-1 rounded-full px-4 py-2 text-xs outline-none"
                style={{ backgroundColor: colors.white, color: colors.black }}
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="text-xs rounded-full px-4 py-2"
                style={{ backgroundColor: colors.grey, color: colors.darkGrey }}
              >
                + Add
              </button>
            </div>
          )}
        </div>

        <div className="mt-12 space-y-8">
          {filteredCategories.map((category) => {
            const draft = sourceDrafts[category.id];
            const canDeleteCategory = isEditMode && category.sources.length === 0;
            const isCollapsed = Boolean(collapsedCategories[category.id]);

            return (
              <div key={category.id} className="pb-6">
                {/* Category header */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleToggleCategory(category.id)}
                    className="flex items-center gap-4 text-sm font-semibold"
                    style={{ color: colors.black }}
                  >
                    <span className="text-base" style={{ color: colors.grey }}>
                      {isCollapsed ? '▸' : '▾'}
                    </span>
                    {category.title}
                  </button>
                  {canDeleteCategory && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category.id)}
                      style={{ color: colors.darkGrey }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="mt-2 border-b" style={{ borderColor: colors.grey }} />

                {!isCollapsed && (
                  <>
                    {/* Source list */}
                    <div className="mt-3">
                      {category.sources.map((source) => renderSource(category.id, source))}
                    </div>

                    {/* Edit-only controls */}
                    {isEditMode && (
                      <div className="mt-4">
                        {!draft?.open && (
                          <button
                            type="button"
                            onClick={() => handleOpenSourceDraft(category.id)}
                            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs"
                            style={{ backgroundColor: colors.lightGrey, color: colors.darkGrey }}
                          >
                            <span className="text-sm font-bold">＋</span>
                            Add New Source
                          </button>
                        )}

                        {draft?.open && (
                          <div
                            ref={(node) => {
                              if (node) {
                                sourceDraftRefs.current[category.id] = node;
                              } else {
                                delete sourceDraftRefs.current[category.id];
                              }
                            }}
                            className="mt-2 rounded-2xl px-8 py-4 max-w-[760px]"
                            style={{ backgroundColor: colors.lightGrey }}
                          >
                            {(() => {
                              const hasFile = Boolean(draft.fileName);
                              const hasLink = Boolean(draft.url?.trim());
                              return (
                                <>
                            <div className="flex items-center gap-5">
                              <span className="text-xs w-[72px]" style={{ color: colors.darkGrey }}>Title:</span>
                              <input
                                value={draft.title}
                                onChange={(event) => handleSourceDraftChange(category.id, 'title', event.target.value)}
                                placeholder="Source title"
                                className="flex-1 rounded-full px-4 py-2 text-xs outline-none"
                                style={{ backgroundColor: colors.white, color: colors.black }}
                              />
                              <button
                                type="button"
                                onClick={() => handleAddSource(category.id)}
                                className="text-xs rounded-full px-4 py-2"
                                style={{ backgroundColor: colors.darkGrey, color: colors.white }}
                              >
                                + Add
                              </button>
                            </div>
                            <div className="my-3 border-b" style={{ borderColor: colors.grey }} />
                            <div className="flex items-center gap-5">
                              <span className="text-xs w-[72px]" style={{ color: colors.darkGrey }}>Source:</span>
                              {hasFile ? (
                                <>
                                  <a
                                    href={draft.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs underline"
                                    style={{ color: colors.link }}
                                  >
                                    {draft.fileName}
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleClearFile(category.id)}
                                    className="text-xs"
                                    style={{ color: colors.darkGrey }}
                                  >
                                    ✕
                                  </button>
                                </>
                              ) : (
                                <>
                                  <input
                                    value={draft.url}
                                    onChange={(event) => handleSourceDraftChange(category.id, 'url', event.target.value)}
                                    placeholder="Paste source link here..."
                                    className="flex-1 rounded-full px-4 py-2 text-xs outline-none"
                                    style={{ backgroundColor: colors.white, color: colors.black }}
                                  />
                                  {!hasLink && (
                                    <label
                                      className="text-xs rounded-full px-6 py-2 cursor-pointer"
                                      style={{ backgroundColor: colors.grey, color: colors.darkGrey }}
                                    >
                                      Upload file
                                      <input
                                        type="file"
                                        className="hidden"
                                        onChange={(event) => handleFileSelect(category.id, event.target.files?.[0])}
                                      />
                                    </label>
                                  )}
                                </>
                              )}
                            </div>
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LawSources;
