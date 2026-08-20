import React, { useState } from 'react';
import { Search, ShieldCheck, AlertCircle, FileText, MapPin, Compass, Building, Loader2 } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';

export const PublicSearchPage: React.FC = () => {
  const [surveyNumber, setSurveyNumber] = useState('');
  const [village, setVillage] = useState('');
  const [taluk, setTaluk] = useState('');
  const [district, setDistrict] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">
          Public Land Search
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1 leading-relaxed">
          Search publicly available land-record indicators using survey number, village, taluk and district.
        </p>
      </div>

      {/* Privacy Disclosure Notice */}
      <div className="p-4 rounded-xl bg-[#F4F8F7] border border-[#D9E2E1] text-[#101828] text-xs flex items-start space-x-3.5 shadow-[0_1px_3px_rgba(16,24,40,0.03)]">
        <div className="w-8 h-8 rounded-lg bg-[#EAF4F3] border border-[#0B6868]/20 flex items-center justify-center text-[#034E4E] shrink-0 mt-0.5">
          <ShieldCheck className="w-4.5 h-4.5" />
        </div>
        <div>
          <h4 className="font-bold text-[#034E4E] text-xs">Public Privacy Disclosure</h4>
          <p className="mt-1 leading-relaxed text-[#667085]">
            Public search results strictly display non-sensitive title indicators: <strong>Survey Number</strong>, <strong>Property Extent</strong>, <strong>Village</strong>, <strong>Taluk</strong>, and <strong>District</strong>. Personal ownership details, patta numbers, and sale considerations are kept private and accessible only to verified title owners.
          </p>
        </div>
      </div>

      {/* Main Search Panel */}
      <div className="tracia-card p-6 sm:p-7">
        <div className="flex items-center space-x-2.5 pb-4 mb-5 border-b border-[#D9E2E1]">
          <div className="w-8 h-8 rounded-lg bg-[#034E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Search className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#101828]">Search Land Records</h2>
            <p className="text-xs text-[#667085] mt-0.5">Enter the available land details to search the public registry.</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Survey Number (Primary Required Input) */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-[#101828] mb-1.5 flex items-center justify-between">
                <span>Survey Number <span className="text-rose-600">*</span></span>
                <span className="text-[10px] font-semibold text-[#034E4E] bg-[#EAF4F3] px-1.5 py-0.5 rounded">Required</span>
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3 top-2.5 text-[#667085]" />
                <input
                  type="text"
                  placeholder="e.g. 102/3B"
                  value={surveyNumber}
                  onChange={(e) => setSurveyNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-lg focus:border-[#034E4E] focus:outline-none"
                />
              </div>
            </div>

            {/* Village */}
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1.5">
                Village
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-[#667085]" />
                <input
                  type="text"
                  placeholder="e.g. Adyar"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-lg focus:border-[#034E4E] focus:outline-none"
                />
              </div>
            </div>

            {/* Taluk */}
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1.5">
                Taluk
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 absolute left-3 top-2.5 text-[#667085]" />
                <input
                  type="text"
                  placeholder="e.g. Velachery"
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-lg focus:border-[#034E4E] focus:outline-none"
                />
              </div>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1.5">
                District
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-2.5 text-[#667085]" />
                <input
                  type="text"
                  placeholder="e.g. Chennai"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-lg focus:border-[#034E4E] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="tracia-btn-primary inline-flex items-center space-x-2 text-xs disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching Public Registry...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search Public Records</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Search Results Section */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-extrabold text-[#101828]">Search Results</h2>
          <p className="text-xs text-[#667085] mt-0.5">Publicly available land indicators matching your search.</p>
        </div>

        {!hasSearched ? (
          <EmptyState
            title="Enter survey details to search"
            description="Enter a survey number and village name above to query public land title registry records."
            icon={<Search className="w-5 h-5 text-[#034E4E]" />}
          />
        ) : loading ? (
          <div className="tracia-card p-8 text-center flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 text-[#034E4E] animate-spin" />
            <p className="text-xs font-bold text-[#101828]">Querying public database registry...</p>
          </div>
        ) : (
          <EmptyState
            title="No public land records found."
            description="No property matches were returned for the provided survey criteria. Connect the backend service to fetch real database entries."
            icon={<AlertCircle className="w-5 h-5 text-[#034E4E]" />}
          />
        )}
      </div>
    </div>
  );
};
