import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { uploadLawSourceFileApi, deleteLawSourceFileApi } from '../../models/lawSourceApi';
import colors from '../../config/colors';

const LAW_SOURCES_STORAGE_KEY = 'jhl-law-sources';

const loadSavedCategories = () => {
  try {
    const saved = window.localStorage.getItem(LAW_SOURCES_STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    console.warn('Failed to load saved law sources:', error);
  }
  return null;
};

const buildInitialCategories = () => ([
  {
    id: 1,
    title: 'Employment',
    title_en: 'Employment',
    title_fi: 'Työsuhde',
    sources: [
      { id: 101, type: 'link', title: 'Finnish Employment Contracts Act', title_en: 'Finnish Employment Contracts Act', title_fi: 'Työsopimuslaki', url: 'https://www.finlex.fi/en/legislation/2001/55' },
      { id: 102, type: 'link', title: 'Act on Equality between Women and Men', title_en: 'Act on Equality between Women and Men', title_fi: 'Laki naisten ja miesten välisestä tasa-arvosta', url: 'https://www.finlex.fi/en/legislation/1986/609' },
      { id: 103, type: 'link', title: 'Act on Privacy in Working Life', title_en: 'Act on Privacy in Working Life', title_fi: 'Laki yksityisyyden suojasta työelämässä', url: 'https://www.finlex.fi/en/legislation/2004/759' },
      { id: 104, type: 'link', title: 'Act on Health Care Professionals', title_en: 'Act on Health Care Professionals', title_fi: 'Laki terveydenhuollon ammattihenkilöistä', url: 'https://www.finlex.fi/en/legislation/1994/559' },
      { id: 105, type: 'link', title: 'Act on Social Welfare Professionals', title_en: 'Act on Social Welfare Professionals', title_fi: 'Laki sosiaalihuollon ammattihenkilöistä', url: 'https://www.finlex.fi/en/legislation/2015/817' },
    ]
  },
  {
    id: 2,
    title: 'Working Hours & Leave',
    title_en: 'Working Hours & Leave',
    title_fi: 'Työaika ja vapaat',
    sources: [
      { id: 201, type: 'link', title: 'Working Hours Act', title_en: 'Working Hours Act', title_fi: 'Työaikalaki', url: 'https://www.finlex.fi/en/legislation/2019/872' },
      { id: 202, type: 'link', title: 'Annual Holidays Act', title_en: 'Annual Holidays Act', title_fi: 'Vuosilomalaki', url: 'https://www.finlex.fi/en/legislation/2005/162' },
      { id: 203, type: 'link', title: 'Study Leave Act', title_en: 'Study Leave Act', title_fi: 'Opintovapaalaki', url: 'https://www.finlex.fi/en/legislation/1979/864' },
    ]
  },
  {
    id: 3,
    title: 'Safety & Equality',
    title_en: 'Safety & Equality',
    title_fi: 'Turvallisuus ja tasa-arvo',
    sources: [
      { id: 301, type: 'link', title: 'Occupational Safety and Health Act', title_en: 'Occupational Safety and Health Act', title_fi: 'Työturvallisuuslaki', url: 'https://www.finlex.fi/en/legislation/2002/738' },
      { id: 302, type: 'link', title: 'Non-Discrimination Act', title_en: 'Non-Discrimination Act', title_fi: 'Yhdenvertaisuuslaki', url: 'https://www.finlex.fi/en/legislation/2014/1325' },
      { id: 303, type: 'link', title: 'Act on Occupational Safety and Health Enforcement', title_en: 'Act on Occupational Safety and Health Enforcement', title_fi: 'Laki työsuojelun valvonnasta ja työpaikan työsuojeluyhteistoiminnasta', url: 'https://www.finlex.fi/en/legislation/2006/44' },
      { id: 304, type: 'link', title: 'Act on the Publicity of Government Activities', title_en: 'Act on the Publicity of Government Activities', title_fi: 'Laki viranomaisten toiminnan julkisuudesta', url: 'https://www.finlex.fi/en/legislation/1999/621' },
    ]
  },
  {
    id: 4,
    title: 'Cooperation',
    title_en: 'Cooperation',
    title_fi: 'Yhteistoiminta',
    sources: [
      { id: 401, type: 'link', title: 'Cooperation within Undertakings Act', title_en: 'Cooperation within Undertakings Act', title_fi: 'Laki yhteistoiminnasta yrityksissä', url: 'https://www.finlex.fi/en/legislation/2021/1333' },
      { id: 402, type: 'link', title: 'Act on Cooperation between Employer and Employees in Municipalities', title_en: 'Act on Cooperation between Employer and Employees in Municipalities', title_fi: 'Laki työnantajan ja henkilöstön välisestä yhteistoiminnasta kunnissa', url: 'https://www.finlex.fi/en/legislation/2007/449' },
    ]
  },
  {
    id: 5,
    title: 'Collective Agreements',
    title_en: 'Collective Agreements',
    title_fi: 'Työehtosopimukset',
    sources: [
      { id: 501, type: 'link', title: 'Municipal Health and Social Services Agreement (HYVTES)', title_en: 'Municipal Health and Social Services Agreement (HYVTES)', title_fi: 'Hyvinvointialan yleinen virka- ja työehtosopimus 2025–2028 (HYVTES)', url: 'https://www.kt.fi/sopimukset/hyvtes/2025-2028/kokoteksti' },
      { id: 502, type: 'link', title: 'Social and Health Care Collective Agreement (Sote-sopimus)', title_en: 'Social and Health Care Collective Agreement (Sote-sopimus)', title_fi: 'Sosiaali- ja terveydenhuollon työehtosopimus (Sote-sopimus)', url: 'https://www.kt.fi/sopimukset/sote/2025-2028/kokoteksti' },
      { id: 503, type: 'link', title: 'General Municipal Collective Agreement (YTES)', title_en: 'General Municipal Collective Agreement (YTES)', title_fi: 'Kunnallinen yleinen virka- ja työehtosopimus (YTES)', url: 'https://www.kt.fi/sopimukset/ytes/2025-2028/kokoteksti' },
    ]
  }
]);

export const LawSources = ({ authViewModel }) => {
  const [categories, setCategories] = useState(() => loadSavedCategories() || buildInitialCategories());
  const [isEditMode, setIsEditMode] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [sourceDrafts, setSourceDrafts] = useState({});
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});
  const addCategoryRef = useRef(null);
  const sourceDraftRefs = useRef({});
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('fi') ? 'fi' : 'en';

  const getTitle = (item) => {
    if (lang === 'fi' && item.title_fi) return item.title_fi;
    if (item.title_en) return item.title_en;
    return item.title;
  };

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;
    return categories
      .map((category) => {
        const categoryMatch = category.title.toLowerCase().includes(query)
          || category.title_fi?.toLowerCase().includes(query)
          || category.title_en?.toLowerCase().includes(query);
        const matchingSources = category.sources.filter((source) => {
          const haystack = `${source.title} ${source.title_fi || ''} ${source.title_en || ''} ${source.url || ''}`.toLowerCase();
          return haystack.includes(query);
        });
        return { ...category, sources: categoryMatch ? category.sources : matchingSources };
      })
      .filter((category) => category.sources.length > 0);
  }, [categories, search]);

  const handleToggleEdit = () => {
    setIsEditMode((prev) => !prev);
    setShowAddCategory(false);
    setSourceDrafts({});
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(LAW_SOURCES_STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.warn('Failed to save law sources:', error);
    }
  }, [categories]);

  const handleAddCategoryToggle = () => {
    setShowAddCategory((prev) => !prev);
    setNewCategoryTitle('');
  };

  const handleAddCategory = () => {
    const title = newCategoryTitle.trim();
    if (!title) return;
    setCategories((prev) => [{ id: Date.now(), title, title_en: title, title_fi: title, sources: [] }, ...prev]);
    setShowAddCategory(false);
    setNewCategoryTitle('');
  };

  const handleToggleCategory = (categoryId) => {
    setCollapsedCategories((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories((prev) => prev.filter((category) => category.id !== categoryId));
  };

  const handleDeleteSource = async (categoryId, sourceId) => {
    const targetSource = categories
      .find((category) => category.id === categoryId)
      ?.sources.find((source) => source.id === sourceId);

    if (targetSource?.type === 'file' && targetSource.url) {
      try {
        await deleteLawSourceFileApi(targetSource.url);
      } catch (error) {
        toast.error(error.message || 'Failed to delete uploaded file');
        return;
      }
    }

    setCategories((prev) => prev.map((category) => {
      if (category.id !== categoryId) return category;
      return { ...category, sources: category.sources.filter((source) => source.id !== sourceId) };
    }));
  };

  const handleOpenSourceDraft = (categoryId) => {
    setSourceDrafts((prev) => ({
      ...prev,
      [categoryId]: { open: true, title: '', url: '', fileName: '', fileUrl: '' }
    }));
  };

  const isSourceDraftEmpty = (draft) => {
    if (!draft) return true;
    return !draft.title?.trim() && !draft.url?.trim() && !draft.fileName && !draft.fileUrl;
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
          next[categoryId] = { ...draft, open: false };
          hasChanges = true;
        });
        return hasChanges ? next : prev;
      });
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showAddCategory, newCategoryTitle]);

  const handleSourceDraftChange = (categoryId, field, value) => {
    setSourceDrafts((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [field]: value,
        ...(field === 'url' && value.trim() ? { fileName: '', fileUrl: '', file: null } : {})
      }
    }));
  };

  const handleFileSelect = (categoryId, file) => {
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    setSourceDrafts((prev) => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], url: '', fileName: file.name, fileUrl, file }
    }));
  };

  const handleClearFile = (categoryId) => {
    setSourceDrafts((prev) => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], fileName: '', fileUrl: '', file: null }
    }));
  };

  const handleAddSource = async (categoryId) => {
    const draft = sourceDrafts[categoryId];
    if (!draft) return;
    const title = draft.title.trim();
    const url = draft.url.trim();
    const file = draft.file;
    if (!title && !draft.fileName) return;
    if (!url && !file) return;

    let sourceUrl = url;
    try {
      setUploadErrors((prev) => ({ ...prev, [categoryId]: '' }));
      if (file) {
        setUploadingFiles((prev) => ({ ...prev, [categoryId]: true }));
        const uploadResult = await uploadLawSourceFileApi(file);
        sourceUrl = uploadResult.fileUrl;
      }

      const source = {
        id: Date.now(),
        type: url ? 'link' : 'file',
        title: title || draft.fileName,
        title_en: title || draft.fileName,
        title_fi: title || draft.fileName,
        url: sourceUrl,
        fileName: draft.fileName || ''
      };

      setCategories((prev) => prev.map((category) => {
        if (category.id !== categoryId) return category;
        return { ...category, sources: [...category.sources, source] };
      }));
      setSourceDrafts((prev) => ({
        ...prev,
        [categoryId]: { open: false, title: '', url: '', fileName: '', fileUrl: '', file: null }
      }));
      if (file) {
        toast.success('PDF uploaded successfully');
      }
    } catch (error) {
      setUploadErrors((prev) => ({ ...prev, [categoryId]: error.message || 'Upload failed' }));
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const renderSource = (categoryId, source) => (
    <div key={source.id} className="flex items-start justify-between gap-6 py-2">
      <div>
        <div className="text-sm font-semibold" style={{ color: colors.black }}>{getTitle(source)}</div>
        <a href={source.url} target="_blank" rel="noreferrer" className="text-sm underline" style={{ color: colors.link }}>
          {source.url}
        </a>
      </div>
      {isEditMode && (
        <button type="button" onClick={() => handleDeleteSource(categoryId, source.id)} style={{ color: colors.darkGrey }}>
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
            <h1 className="text-xl font-bold mb-1" style={{ color: colors.black }}>{t('law_sources.title')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full px-4 h-[36px]" style={{ backgroundColor: colors.lightGrey }}>
              <span className="text-3xl" style={{ color: colors.darkGrey }}>⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('law_sources.search_placeholder')}
                className="bg-transparent text-xs w-[160px] outline-none"
              />
            </div>
            {categories.length > 0 && (
              <Button size="small" variant="red" className="px-6" onClick={handleToggleEdit}>
                {isEditMode ? t('law_sources.save') : t('law_sources.edit')}
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
              {t('law_sources.add_category')}
            </button>
          )}

          {showAddCategory && (
            <div
              ref={addCategoryRef}
              className="mt-2 flex items-center gap-4 rounded-full px-6 py-2 max-w-[560px]"
              style={{ backgroundColor: colors.lightGrey }}
            >
              <span className="text-xs w-[64px]" style={{ color: colors.darkGrey }}>{t('law_sources.source_title')}</span>
              <input
                value={newCategoryTitle}
                onChange={(event) => setNewCategoryTitle(event.target.value)}
                placeholder={t('law_sources.category_name_placeholder')}
                className="flex-1 rounded-full px-4 py-2 text-xs outline-none"
                style={{ backgroundColor: colors.white, color: colors.black }}
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="text-xs rounded-full px-4 py-2"
                style={{ backgroundColor: colors.grey, color: colors.darkGrey }}
              >
                {t('law_sources.add')}
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
                    {getTitle(category)}
                  </button>
                  {canDeleteCategory && (
                    <button type="button" onClick={() => handleDeleteCategory(category.id)} style={{ color: colors.darkGrey }}>
                      ✕
                    </button>
                  )}
                </div>

                <div className="mt-2 border-b" style={{ borderColor: colors.grey }} />

                {!isCollapsed && (
                  <>
                    <div className="mt-3">
                      {category.sources.map((source) => renderSource(category.id, source))}
                    </div>

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
                            {t('law_sources.add_source')}
                          </button>
                        )}

                        {draft?.open && (
                          <div
                            ref={(node) => {
                              if (node) sourceDraftRefs.current[category.id] = node;
                              else delete sourceDraftRefs.current[category.id];
                            }}
                            className="mt-2 rounded-2xl px-8 py-4 max-w-[760px]"
                            style={{ backgroundColor: colors.lightGrey }}
                          >
                            {(() => {
                              const hasFile = Boolean(draft.fileName);
                              const hasLink = Boolean(draft.url?.trim());
                              const isUploading = Boolean(uploadingFiles[category.id]);
                              return (
                                <>
                                  <div className="flex items-center gap-5">
                                    <span className="text-xs w-[72px]" style={{ color: colors.darkGrey }}>{t('law_sources.source_title')}</span>
                                    <input
                                      value={draft.title}
                                      onChange={(event) => handleSourceDraftChange(category.id, 'title', event.target.value)}
                                      placeholder={t('law_sources.source_title_placeholder')}
                                      className="flex-1 rounded-full px-4 py-2 text-xs outline-none"
                                      style={{ backgroundColor: colors.white, color: colors.black }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleAddSource(category.id)}
                                      disabled={isUploading}
                                      className="text-xs rounded-full px-4 py-2"
                                      style={{ backgroundColor: colors.darkGrey, color: colors.white, opacity: isUploading ? 0.6 : 1 }}
                                    >
                                      {isUploading ? 'Uploading…' : t('law_sources.add')}
                                    </button>
                                  </div>
                                  {uploadErrors[category.id] && (
                                    <div className="mt-2 text-xs" style={{ color: '#c53030' }}>
                                      {uploadErrors[category.id]}
                                    </div>
                                  )}
                                  <div className="my-3 border-b" style={{ borderColor: colors.grey }} />
                                  <div className="flex items-center gap-5">
                                    <span className="text-xs w-[72px]" style={{ color: colors.darkGrey }}>{t('law_sources.source_url')}</span>
                                    {hasFile ? (
                                      <>
                                        <a href={draft.fileUrl} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: colors.link }}>
                                          {draft.fileName}
                                        </a>
                                        <button type="button" onClick={() => handleClearFile(category.id)} className="text-xs" style={{ color: colors.darkGrey }}>
                                          ✕
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <input
                                          value={draft.url}
                                          onChange={(event) => handleSourceDraftChange(category.id, 'url', event.target.value)}
                                          placeholder={t('law_sources.source_url_placeholder')}
                                          className="flex-1 rounded-full px-4 py-2 text-xs outline-none"
                                          style={{ backgroundColor: colors.white, color: colors.black }}
                                        />
                                        {!hasLink && (
                                          <label
                                            className="text-xs rounded-full px-6 py-2 cursor-pointer"
                                            style={{ backgroundColor: colors.grey, color: colors.darkGrey }}
                                          >
                                            {t('law_sources.upload_file')}
                                            <input
                                              type="file"
                                              accept="application/pdf"
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