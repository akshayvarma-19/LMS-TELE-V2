import React, { useState, useEffect } from 'react';
import { AlertOctagon, Filter, Plus, Loader2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { grievanceService } from '../../services/grievanceService';
import { landService } from '../../services/landService';
import type { Grievance, LandRecord } from '../../types';

export const CitizenGrievancesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  
  const [lands, setLands] = useState<LandRecord[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Form fields
  const [selectedLandId, setSelectedLandId] = useState('');
  const [category, setCategory] = useState<Grievance['category']>('ocr_mismatch');
  const [description, setDescription] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // Check URL query parameters (for redirect from OCR Matrix)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const landId = params.get('land_id');
    const cat = params.get('category') as Grievance['category'];
    const desc = params.get('description');
    
    if (landId) setSelectedLandId(landId);
    if (cat) setCategory(cat);
    if (desc) setDescription(desc);
    if (landId || cat || desc) {
      setShowNewModal(true);
    }
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [grievancesRes, landsRes] = await Promise.all([
        grievanceService.getMyGrievances(),
        landService.getMyLandRecords()
      ]);
      
      if ((grievancesRes.status === 'success' || grievancesRes.success) && grievancesRes.data) {
        setGrievances(grievancesRes.data);
      }
      if ((landsRes.status === 'success' || landsRes.success) && landsRes.data) {
        setLands(landsRes.data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch grievances data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSubmitGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLandId) {
      setNotice('Please select a registered property.');
      return;
    }
    setSubmitting(true);
    setNotice(null);

    try {
      const res = await grievanceService.createGrievance({
        land_id: selectedLandId,
        category,
        description: description.trim()
      });

      if (res.status === 'success' || res.success) {
        setShowNewModal(false);
        setDescription('');
        setSelectedLandId('');
        fetchDashboardData();
      } else {
        setNotice(res.message || 'Failed to submit grievance.');
      }
    } catch (err: any) {
      setNotice(err.message || 'Error submitting grievance.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredGrievances = grievances.filter((g) => {
    const matchStatus = !statusFilter || g.status === statusFilter;
    const matchCategory = !categoryFilter || g.category === categoryFilter;
    return matchStatus && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">My Grievances</h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Track reported title mismatches, survey disputes, and officer resolution status updates.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowNewModal(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-[#034E4E] hover:bg-[#023838] text-white font-semibold text-xs rounded-lg transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Raise New Grievance</span>
        </button>
      </div>

      {errorMsg && (
        <ErrorAlert
          title="Backend Error"
          message={errorMsg}
        />
      )}

      {/* Filters */}
      <div className="tracia-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="sm:w-48 relative">
          <Filter className="w-4 h-4 absolute left-3 top-2.5 text-[#667085]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="info_required">Additional Info Required</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="sm:w-56 relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="ocr_mismatch">OCR Field Mismatch</option>
            <option value="ownership_dispute">Ownership Dispute</option>
            <option value="survey_error">Survey Boundary Error</option>
            <option value="illegal_mutation">Unexplained Title Modification</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Grievances List / Empty State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#034E4E]" />
          <span className="ml-2 text-sm text-slate-500">Loading grievances...</span>
        </div>
      ) : filteredGrievances.length === 0 ? (
        <EmptyState
          title="No grievances submitted yet."
          description="When you lodge a grievance for title verification or boundary resolution, it will appear here."
          icon={<AlertOctagon className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="space-y-4">
          {filteredGrievances.map((g) => (
            <Link
              key={g.id}
              to={`/citizen/grievances/${g.id}`}
              className="block bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-500 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm capitalize">
                      {g.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">
                      ID: {g.id.slice(0, 8)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">{g.description}</p>
                </div>
                
                <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase ${
                    g.status === 'resolved' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : g.status === 'under_review' 
                      ? 'bg-blue-100 text-blue-800' 
                      : g.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {g.status.replace(/_/g, ' ')}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Raise Grievance Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#D9E2E1] max-w-lg w-full p-6 space-y-4 shadow-lg">
            <div className="flex justify-between items-center border-b border-[#D9E2E1] pb-3">
              <h3 className="text-sm font-extrabold text-[#101828]">Lodge Title Grievance</h3>
              <button onClick={() => setShowNewModal(false)} className="text-[#667085] hover:text-[#101828] text-sm">
                ✕
              </button>
            </div>

            {notice && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
                {notice}
              </div>
            )}

            <form onSubmit={handleSubmitGrievance} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Property</label>
                <select
                  value={selectedLandId}
                  onChange={(e) => setSelectedLandId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="">-- Choose Registered Property --</option>
                  {lands.map((land) => (
                    <option key={land.id} value={land.id}>
                      Survey No: {land.survey_number} - {land.village}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Grievance Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Grievance['category'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="ocr_mismatch">OCR Field Mismatch</option>
                  <option value="ownership_dispute">Ownership Dispute</option>
                  <option value="survey_error">Survey Boundary Error</option>
                  <option value="illegal_mutation">Unexplained Title Modification</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1">Description & Supporting Facts</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed explanation of the discrepancy..."
                  className="w-full px-3 py-2 bg-white border border-[#D9E2E1] rounded-md text-xs sm:text-sm focus:border-[#034E4E] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="tracia-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#034E4E] hover:bg-[#023838] text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Grievance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function resetForm() {
    setSelectedLandId('');
    setCategory('ocr_mismatch');
    setDescription('');
    setNotice(null);
  }
};
