import { Navbar } from '../components/Navbar';

export const LawSources = ({ authViewModel }) => {
  return (
    <div className="min-h-screen bg-white pt-[50px]">
      <Navbar authViewModel={authViewModel} />

      <div className="max-w-[960px] mx-auto px-8 py-10">
        <h1 className="text-[22px] font-bold text-black mb-6">Law Sources</h1>
        <p className="text-[12px] text-[#6B6B6B]">Content coming soon.</p>
      </div>
    </div>
  );
};

export default LawSources;
