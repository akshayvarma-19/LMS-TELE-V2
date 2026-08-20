import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { landService } from '../../services/landService';
import type { PublicLandRecord } from '../../types';

interface SuggestionItem {
  display: string;
  value: string;
  record?: PublicLandRecord;
}

export const PublicSearchPage: React.FC = () => {
  const [surveyNumber, setSurveyNumber] = useState('');
  const [village, setVillage] = useState('');
  const [taluk, setTaluk] = useState('');
  const [district, setDistrict] = useState('');
  
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<PublicLandRecord[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Suggestions state
  const [activeField, setActiveField] = useState<'surveyNumber' | 'village' | 'taluk' | 'district' | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimer, setSearchTimer] = useState<any>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimer) clearTimeout(searchTimer);
    };
  }, [searchTimer]);

  const triggerSuggestions = (field: 'surveyNumber' | 'village' | 'taluk' | 'district', queryText: string) => {
    if (searchTimer) clearTimeout(searchTimer);

    if (queryText.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const searchParams: any = {};
        if (field === 'surveyNumber') searchParams.survey_number = queryText;
        if (field === 'village') searchParams.village = queryText;
        if (field === 'taluk') searchParams.taluk = queryText;
        if (field === 'district') searchParams.district = queryText;

        const res = await landService.searchLandRecords(searchParams);
        if ((res.status === 'success' || res.success) && res.data) {
          const items: SuggestionItem[] = [];
          const seen = new Set<string>();

          res.data.forEach(r => {
            if (field === 'surveyNumber' && r.survey_number) {
              const display = `${r.survey_number} (${r.village})`;
              if (!seen.has(display)) {
                seen.add(display);
                items.push({ display, value: r.survey_number, record: r });
              }
            } else if (field === 'village' && r.village) {
              const display = r.village;
              if (!seen.has(display.toLowerCase())) {
                seen.add(display.toLowerCase());
                items.push({ display, value: r.village, record: r });
              }
            } else if (field === 'taluk' && r.taluk) {
              const display = r.taluk;
              if (!seen.has(display.toLowerCase())) {
                seen.add(display.toLowerCase());
                items.push({ display, value: r.taluk, record: r });
              }
            } else if (field === 'district' && r.district) {
              const display = r.district;
              if (!seen.has(display.toLowerCase())) {
                seen.add(display.toLowerCase());
                items.push({ display, value: r.district, record: r });
              }
            }
          });

          setSuggestions(items.slice(0, 5));
          setShowSuggestions(true);
        }
      } catch (err) {}
    }, 200);

    setSearchTimer(timer);
  };

  const handleSelectSuggestion = (s: SuggestionItem) => {
    if (activeField === 'surveyNumber') {
      setSurveyNumber(s.value);
      if (s.record) {
        setVillage(s.record.village || '');
        setTaluk(s.record.taluk || '');
        setDistrict(s.record.district || '');
      }
    } else if (activeField === 'village') {
      setVillage(s.value);
      if (s.record) {
        setTaluk(s.record.taluk || '');
        setDistrict(s.record.district || '');
      }
    } else if (activeField === 'taluk') {
      setTaluk(s.value);
      if (s.record) {
        setDistrict(s.record.district || '');
      }
    } else if (activeField === 'district') {
      setDistrict(s.value);
    }
    setShowSuggestions(false);
    setActiveField(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyNumber.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    setErrorMsg(null);
    setShowSuggestions(false);

    try {
      const res = await landService.searchLandRecords({
        survey_number: surveyNumber.trim(),
        village: village.trim() || undefined,
        taluk: taluk.trim() || undefined,
        district: district.trim() || undefined
      });

      if ((res.status === 'success' || res.success) && res.data) {
        setSearchResults(res.data);
      } else {
        setSearchResults([]);
        setErrorMsg(res.message || 'No search results returned.');
      }
    } catch (err: any) {
      setSearchResults([]);
      setErrorMsg(err.message || 'Error connecting to search services.');
    } finally {
      setLoading(false);
    }
  };

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setShowSuggestions(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

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

      {/* Search Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Survey Number Input */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Survey Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 124/3A"
                value={surveyNumber}
                onChange={(e) => {
                  setSurveyNumber(e.target.value);
                  setActiveField('surveyNumber');
                  triggerSuggestions('surveyNumber', e.target.value);
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
              {showSuggestions && activeField === 'surveyNumber' && suggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto text-xs divide-y divide-slate-100">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 text-slate-700 flex justify-between items-center"
                    >
                      <span className="font-bold text-slate-800">{s.display}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Village Input */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Village</label>
              <input
                type="text"
                placeholder="e.g. Sathuvachari"
                value={village}
                onChange={(e) => {
                  setVillage(e.target.value);
                  setActiveField('village');
                  triggerSuggestions('village', e.target.value);
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
              {showSuggestions && activeField === 'village' && suggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto text-xs divide-y divide-slate-100">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 text-slate-700"
                    >
                      <span className="font-semibold text-slate-800">{s.display}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Taluk Input */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Taluk</label>
              <input
                type="text"
                placeholder="e.g. Vellore"
                value={taluk}
                onChange={(e) => {
                  setTaluk(e.target.value);
                  setActiveField('taluk');
                  triggerSuggestions('taluk', e.target.value);
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
              {showSuggestions && activeField === 'taluk' && suggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto text-xs divide-y divide-slate-100">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 text-slate-700"
                    >
                      <span className="font-semibold text-slate-800">{s.display}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* District Input */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
              <input
                type="text"
                placeholder="e.g. Vellore"
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setActiveField('district');
                  triggerSuggestions('district', e.target.value);
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
              {showSuggestions && activeField === 'district' && suggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto text-xs divide-y divide-slate-100">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 text-slate-700"
                    >
                      <span className="font-semibold text-slate-800">{s.display}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading || !surveyNumber.trim()}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
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

        {errorMsg && (
          <div className="p-4 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!hasSearched ? (
          <EmptyState
            title="Enter survey details to search"
            description="Enter a survey number and village name above to query public land title registry records."
            icon={<Search className="w-5 h-5 text-[#034E4E]" />}
          />
        ) : loading ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 flex flex-col justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
            <p className="text-sm font-medium text-slate-500 mt-2">Querying database registry...</p>
          </div>
        ) : searchResults.length === 0 ? (
          <EmptyState
            title="No public land records found."
            description="No property matches were returned for the provided survey criteria."
            icon={<AlertCircle className="w-6 h-6 text-slate-400" />}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-4">Survey Number</th>
                    <th className="p-4">Property Extent</th>
                    <th className="p-4">Village</th>
                    <th className="p-4">Taluk</th>
                    <th className="p-4">District</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {searchResults.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900 font-mono">{r.survey_number}</td>
                      <td className="p-4 font-medium">{r.property_extent} Acres</td>
                      <td className="p-4">{r.village}</td>
                      <td className="p-4">{r.taluk}</td>
                      <td className="p-4">{r.district}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
