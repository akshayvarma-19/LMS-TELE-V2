import React, { useState } from 'react';
import { Search, ShieldCheck, AlertCircle } from 'lucide-react';
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
    // Simulate backend search request
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Public Land Search</h1>
        <p className="text-sm text-slate-500 mt-1">
          Search land record availability by Survey Number, Village, Taluk, and District.
        </p>
      </div>

      {/* Security Privacy Notice */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-blue-900">Public Privacy Disclosure</h4>
          <p className="mt-0.5 leading-relaxed text-blue-800">
            Public search results strictly display non-sensitive title indicators: <strong>Survey Number, Property Extent, Village, Taluk, and District</strong>. Personal ownership details, patta numbers, and sale considerations are kept private and accessible only to verified title owners.
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Survey Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 102/3B"
                value={surveyNumber}
                onChange={(e) => setSurveyNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Village</label>
              <input
                type="text"
                placeholder="e.g. Adyar"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Taluk</label>
              <input
                type="text"
                placeholder="e.g. Velachery"
                value={taluk}
                onChange={(e) => setTaluk(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
              <input
                type="text"
                placeholder="e.g. Chennai"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Search Public Records</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3">Public Search Results</h2>

        {!hasSearched ? (
          <EmptyState
            title="Enter survey details to search"
            description="Enter a survey number and village name above to query public land title registry records."
            icon={<Search className="w-6 h-6 text-slate-400" />}
          />
        ) : loading ? (
          <div className="bg-white p-8 text-center rounded-xl border border-slate-200">
            <p className="text-sm font-medium text-slate-700">Querying database registry...</p>
          </div>
        ) : (
          <EmptyState
            title="No public land records found."
            description="No property matches were returned for the provided survey criteria. Connect the backend service to fetch real database entries."
            icon={<AlertCircle className="w-6 h-6 text-slate-400" />}
          />
        )}
      </div>
    </div>
  );
};
