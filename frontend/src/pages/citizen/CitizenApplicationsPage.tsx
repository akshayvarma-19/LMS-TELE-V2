import React, { useState, useEffect } from 'react';
import { ClipboardList, Upload, FileText, Send, Building, Compass, RefreshCw, HelpCircle, Loader2 } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Badge } from '../../components/common/Badge';
import { landService } from '../../services/landService';
import { applicationService } from '../../services/applicationService';
import type { LandRecord, ApplicationRecord, ApplicationCategory } from '../../types';

export const CitizenApplicationsPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ApplicationCategory>('sale_transfer');
  const [selectedLandId, setSelectedLandId] = useState('');
  const [details, setDetails] = useState('');
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Lands & Applications states
  const [lands, setLands] = useState<LandRecord[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loadingLands, setLoadingLands] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);

  const applicationTypes = [
    {
      id: 'sale_transfer' as ApplicationCategory,
      title: 'Land Sale / Transfer',
      description: 'Request official title transfer or sale approval.',
      icon: RefreshCw,
    },
    {
      id: 'construction_approval' as ApplicationCategory,
      title: 'Construction / Development Approval',
      description: 'Apply for site construction or parcel development approval.',
      icon: Building,
    },
    {
      id: 'land_use_change' as ApplicationCategory,
      title: 'Land Use Change',
      description: 'Apply for agricultural to non-agricultural classification conversion.',
      icon: Compass,
    },
    {
      id: 'other_approval' as ApplicationCategory,
      title: 'Other Approval',
      description: 'Submit custom land revenue or title administrative petitions.',
      icon: HelpCircle,
    },
  ];

  // Fetch lands and applications
  const fetchInitialData = async () => {
    setLoadingLands(true);
    setLoadingApps(true);
    setErrorMsg(null);

    // Fetch Lands
    try {
      const res = await landService.getMyLandRecords();
      if ((res.status === 'success' || res.success) && res.data) {
        setLands(res.data);
      }
    } catch (err: any) {
      console.error('Error fetching lands:', err);
    } finally {
      setLoadingLands(false);
    }

    // Fetch Applications
    try {
      const res = await applicationService.getMyApplications();
      if ((res.status === 'success' || res.success) && res.data) {
        setApplications(res.data);
      }
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setErrorMsg(err.message || 'Failed to load applications.');
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLandId) {
      setErrorMsg('Please select a registered land record.');
      return;
    }
    if (!details.trim()) {
      setErrorMsg('Please provide justification details.');
      return;
    }

    setSubmitting(true);
    setNotice(null);
    setErrorMsg(null);

    try {
      const res = await applicationService.submitApplication({
        land_id: selectedLandId,
        type: selectedType,
        details: details.trim(),
        document_name: fileName || 'deed_document.pdf'
      });

      if (res.success || res.status === 'success') {
        setNotice('Application submitted successfully!');
        setDetails('');
        setFileName('');
        setSelectedLandId('');
        // Refresh list
        const updated = await applicationService.getMyApplications();
        if (updated.data) {
          setApplications(updated.data);
        }
      } else {
        setErrorMsg(res.message || 'Failed to submit application.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during application submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'info_required':
        return 'warning';
      case 'under_review':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const getCategoryLabel = (cat: string) => {
    const found = applicationTypes.find(t => t.id === cat);
    return found ? found.title : cat;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">
          Government Land Applications
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1 leading-relaxed">
          Submit official land transfer, construction approval, classification change, or administrative petitions.
        </p>
      </div>

      {errorMsg && (
        <ErrorAlert
          title="Application Status Alert"
          message={errorMsg}
        />
      )}

      {/* Step 1: Select Application Type */}
      <div>
        <h2 className="text-xs font-extrabold text-[#172121] uppercase tracking-wider mb-3">
          1. Select Application Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {applicationTypes.map((typeItem) => {
            const Icon = typeItem.icon;
            const isSelected = selectedType === typeItem.id;
            return (
              <button
                key={typeItem.id}
                type="button"
                onClick={() => setSelectedType(typeItem.id)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#EAF4F3] border-[#034E4E] shadow-xs'
                    : 'bg-white border-[#DDE5E3] hover:border-[#034E4E]'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                  isSelected ? 'bg-[#034E4E] text-white' : 'bg-[#F4F8F7] text-[#034E4E]'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-[#172121]">{typeItem.title}</h3>
                <p className="text-[11px] text-[#667085] mt-1 leading-snug">{typeItem.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Application Form */}
      <div className="tracia-card p-6 sm:p-7 space-y-6">
        <div className="flex items-center space-x-2.5 pb-4 border-b border-[#DDE5E3]">
          <div className="w-8 h-8 rounded-lg bg-[#034E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ClipboardList className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#172121]">Application Details & Form</h2>
            <p className="text-xs text-[#667085] mt-0.5">
              Category Selected: <span className="font-bold text-[#034E4E] capitalize">{selectedType.replace('_', ' ')}</span>
            </p>
          </div>
        </div>

        {notice && (
          <div className="p-3.5 rounded bg-[#F4F8F7] border border-[#DDE5E3] text-xs text-[#034E4E] font-semibold">
            {notice}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Select Registered Land Record */}
            <div>
              <label className="block text-xs font-bold text-[#172121] mb-1.5">
                Select Registered Land Record <span className="text-rose-600">*</span>
              </label>
              {loadingLands ? (
                <div className="flex items-center space-x-2 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#034E4E]" />
                  <span className="text-xs text-slate-500">Loading your land titles...</span>
                </div>
              ) : (
                <select
                  value={selectedLandId}
                  onChange={(e) => setSelectedLandId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#DDE5E3] rounded-lg text-[#172121] focus:border-[#034E4E] focus:outline-none"
                >
                  <option value="">-- Select Registered Land Title --</option>
                  {lands.map((land) => (
                    <option key={land.id} value={land.id}>
                      {land.survey_number} - {land.village} (Patta: {land.patta_number || 'N/A'})
                    </option>
                  ))}
                </select>
              )}
              <p className="text-[11px] text-[#667085] mt-1">
                Select from land records registered to your identity.
              </p>
            </div>

            {/* Supporting Document Upload */}
            <div>
              <label className="block text-xs font-bold text-[#172121] mb-1.5">
                Supporting Deed / Plan Document
              </label>
              <div className="border border-dashed border-[#DDE5E3] rounded-lg p-3 text-center bg-[#F4F8F7]">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="app-doc-upload"
                />
                <label
                  htmlFor="app-doc-upload"
                  className="cursor-pointer text-xs font-bold text-[#034E4E] hover:underline flex items-center justify-center space-x-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose file to upload</span>
                </label>
                {fileName && (
                  <p className="text-[11px] text-[#034E4E] font-mono mt-1 font-semibold">
                    {fileName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div>
            <label className="block text-xs font-bold text-[#172121] mb-1.5">
              Application Details & Justification <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe your application request, survey parameters, and justification for revenue officer review..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#DDE5E3] rounded-lg text-[#172121] focus:border-[#034E4E] focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting || !details.trim() || !selectedLandId}
              className="tracia-btn-primary inline-flex items-center space-x-2 text-xs disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Step 3: My Applications Section */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-extrabold text-[#172121]">My Applications</h2>
          <p className="text-xs text-[#667085] mt-0.5">Submitted government land applications and officer resolution status.</p>
        </div>

        {loadingApps ? (
          <div className="flex justify-center items-center py-8 bg-white border border-slate-200 rounded-2xl">
            <Loader2 className="w-6 h-6 animate-spin text-[#034E4E]" />
            <span className="ml-2 text-xs text-slate-500">Loading submitted applications...</span>
          </div>
        ) : applications.length === 0 ? (
          <EmptyState
            title="No applications submitted yet."
            description="Submitted land applications will be listed here with live verification tracking."
            icon={<FileText className="w-5 h-5 text-[#034E4E]" />}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-4">Application ID</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Survey Number</th>
                    <th className="p-4">Submission Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Officer Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900 font-mono">{app.id}</td>
                      <td className="p-4 font-medium">{getCategoryLabel(app.type)}</td>
                      <td className="p-4 font-mono">{app.survey_number}</td>
                      <td className="p-4 text-slate-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusBadgeVariant(app.status)}>
                          {app.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-4 italic text-slate-500 max-w-xs truncate">
                        {app.officer_remarks || '--'}
                      </td>
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
