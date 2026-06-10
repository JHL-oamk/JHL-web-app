import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/Navbar';
import { useEffect, useState } from 'react';
import { getTopLawsApi } from '../../models/adminApi';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Admin = ({ authViewModel }) => {
  const { t } = useTranslation();
  const [topLaws, setTopLaws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getTopLawsApi();
        if (mounted) setTopLaws(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load top laws', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-white pt-[50px]">
      <Navbar authViewModel={authViewModel} />

      <div className="max-w-[960px] mx-auto px-8 py-10">
        <h1 className="text-[22px] font-bold text-black mb-6">Top5 Most used law sources</h1>

        {loading ? (
          <div className="flex items-center justify-center py-8"><LoadingSpinner message={t('loading') || 'Loading...'} /></div>
        ) : (
          <div>
            {topLaws.length === 0 ? (
              <p className="text-[12px] text-[#6B6B6B]">{t('admin.no_data') || 'No data available.'}</p>
            ) : (
              <ol className="space-y-3">
                {topLaws.map((law, idx) => (
                  <li key={idx} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{idx + 1}. {law.name}</div>
                      {law.link ? (
                        <a className="text-xs text-blue-600" href={law.link} target="_blank" rel="noreferrer">Open source</a>
                      ) : null}
                    </div>
                    <div className="ml-4 text-sm text-gray-600">{law.count}</div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
