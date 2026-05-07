import { useMemo, useState } from 'react';
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
    title: 'Work',
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
    title: 'Work',
    sources: [
      {
        id: 301,
        type: 'link',
        title: 'Cooperation within Undertakings Act',
        url: 'https://www.finlex.fi/en/legislation/2021/1333'
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

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;

    return categories
      .map((category) => {
        const matchingSources = category.sources.filter((source) => {
          const haystack = `${source.title} ${source.url || ''}`.toLowerCase();
          return haystack.includes(query);
        });
        return { ...category, sources: matchingSources };
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

  const handleSourceDraftChange = (categoryId, field, value) => {
    setSourceDrafts((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [field]: value
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
        fileName: file.name,
        fileUrl
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
        <div className="text-[12px] font-semibold text-black">{source.title}</div>
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-[#1192E8] underline"
        >
          {source.url}
        </a>
      </div>
      {isEditMode && (
        <button
          type="button"
          onClick={() => handleDeleteSource(categoryId, source.id)}
          className="text-[#9A9A9A] hover:text-black"
        >
          ✕
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-[50px]">
      <Navbar authViewModel={authViewModel} />

      <div className="max-w-[980px] mx-auto px-8 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-black mb-1">Law Sources List</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F4F4F4] rounded-full px-4 h-[36px]">
              <span className="text-[#9A9A9A]">⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search keywords..."
                className="bg-transparent text-[12px] w-[160px] outline-none"
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
          {(isEditMode || categories.length === 0) && (
            <button
              type="button"
              onClick={handleAddCategoryToggle}
              className="flex items-center gap-2 bg-[#F4F4F4] text-[12px] text-[#7D7D7D] rounded-full px-4 py-2"
            >
              <span className="text-[14px]">＋</span>
              Add New Category
            </button>
          )}

          {showAddCategory && (
            <div className="mt-3 flex items-center gap-3 bg-[#F4F4F4] rounded-full px-4 py-2 max-w-[420px]">
              <span className="text-[12px] text-[#7D7D7D]">Title:</span>
              <input
                value={newCategoryTitle}
                onChange={(event) => setNewCategoryTitle(event.target.value)}
                placeholder="Category name"
                className="flex-1 bg-transparent text-[12px] outline-none"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="text-[11px] bg-[#D9D9D9] text-black rounded-full px-4 py-1"
              >
                + Add
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-8">
          {filteredCategories.map((category) => {
            const draft = sourceDrafts[category.id];
            const canDeleteCategory = isEditMode && category.sources.length === 0;

            return (
              <div key={category.id} className="border-b border-[#E7E7E7] pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-black">
                    <span className="text-[#9A9A9A]">▾</span>
                    {category.title}
                  </div>
                  {canDeleteCategory && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-[#9A9A9A] hover:text-black"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="mt-3">
                  {category.sources.map((source) => renderSource(category.id, source))}
                </div>

                {isEditMode && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => handleOpenSourceDraft(category.id)}
                      className="flex items-center gap-2 bg-[#F4F4F4] text-[12px] text-[#7D7D7D] rounded-full px-4 py-2"
                    >
                      <span className="text-[14px]">＋</span>
                      Add New Source
                    </button>

                    {draft?.open && (
                      <div
                        className="mt-3 bg-[#F4F4F4] rounded-2xl px-4 py-4 max-w-[560px]"
                        style={{ border: `1px solid ${colors.grey}` }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[12px] text-[#7D7D7D]">Title:</span>
                          <input
                            value={draft.title}
                            onChange={(event) => handleSourceDraftChange(category.id, 'title', event.target.value)}
                            placeholder="Source title"
                            className="flex-1 bg-white rounded-full px-3 py-1 text-[12px] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddSource(category.id)}
                            className="text-[11px] bg-[#D9D9D9] text-black rounded-full px-4 py-1"
                          >
                            + Add
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[12px] text-[#7D7D7D]">Source:</span>
                          <input
                            value={draft.url}
                            onChange={(event) => handleSourceDraftChange(category.id, 'url', event.target.value)}
                            placeholder="Paste source link here..."
                            className="flex-1 bg-white rounded-full px-3 py-1 text-[12px] outline-none"
                          />
                          <label className="text-[11px] bg-[#D9D9D9] text-black rounded-full px-4 py-1 cursor-pointer">
                            Upload file
                            <input
                              type="file"
                              className="hidden"
                              onChange={(event) => handleFileSelect(category.id, event.target.files?.[0])}
                            />
                          </label>
                        </div>
                        {draft.fileName && (
                          <div className="mt-2 text-[11px] text-[#6B6B6B]">
                            {draft.fileName}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
