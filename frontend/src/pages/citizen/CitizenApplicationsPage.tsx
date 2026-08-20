import React, { useState } from 'react';
import { ClipboardList, Upload, FileText, Send, Building, Compass, RefreshCw, HelpCircle, Loader2 } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export type ApplicationType =
  | 'sale_transfer'
  | 'construction_approval'
  | 'land_use_change'
  | 'other_approval';

export const CitizenApplicationsPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ApplicationType>('sale_transfer');
  const [selectedLandId, setSelectedLandId] = useState('');
  const [details, setDetails] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const applicationTypes = [
    {
      id: 'sale_transfer' as ApplicationType,
      title: 'Land Sale / Transfer',
      description: 'Request official title transfer or sale approval.',
      icon: RefreshCw,
    },
    {
      id: 'construction_approval' as ApplicationType,
      title: 'Construction / Development Approval',
      description: 'Apply for site construction or parcel development approval.',
      icon: Building,
    },
    {
      id: 'land_use_change' as ApplicationType,
      title: 'Land Use Change',
      description: 'Apply for agricultural to non-agricultural classification conversion.',
      icon: Compass,
    },
    {
      id: 'other_approval' as ApplicationType,
      title: 'Other Approval',
      description: 'Submit custom land revenue or title administrative petitions.',
      icon: HelpCircle,
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotice(null);

    setTimeout(() => {
      setSubmitting(false);
      setNotice('Backend Service Required. Government application petitions will lodge into the database when the backend API is live.');
    }, 800);
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

      <ErrorAlert
        title="Application Service Status"
        message="Submitted applications and revenue officer verification queues will process live via the backend service when connected."
      />

      {/* Step 1: Select Application Type */}
      <div>
        <h2 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider mb-3">
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
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-[#EAF4F3] border-[#034E4E] shadow-xs'
                    : 'bg-white border-[#D9E2E1] hover:border-[#034E4E]'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                  isSelected ? 'bg-[#034E4E] text-white' : 'bg-[#F4F8F7] text-[#034E4E]'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-[#101828]">{typeItem.title}</h3>
                <p className="text-[11px] text-[#667085] mt-1 leading-snug">{typeItem.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Application Form */}
      <div className="tracia-card p-6 sm:p-7 space-y-6">
        <div className="flex items-center space-x-2.5 pb-4 border-b border-[#D9E2E1]">
          <div className="w-8 h-8 rounded-lg bg-[#034E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ClipboardList className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#101828]">Application Details & Form</h2>
            <p className="text-xs text-[#667085] mt-0.5">
              Category Selected: <span className="font-bold text-[#034E4E] capitalize">{selectedType.replace('_', ' ')}</span>
            </p>
          </div>
        </div>

        {notice && (
          <div className="p-3.5 rounded bg-[#F4F8F7] border border-[#D9E2E1] text-xs text-[#034E4E]">
            {notice}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Select Registered Land Record */}
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1.5">
                Select Registered Land Record <span className="text-rose-600">*</span>
              </label>
              <select
                value={selectedLandId}
                onChange={(e) => setSelectedLandId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-lg text-[#101828] focus:border-[#034E4E] focus:outline-none"
              >
                <option value="">-- Select Registered Land Title --</option>
                <option value="REAL-BACKEND-REQUIRED" disabled>
                  Your registered land holdings will populate here from the backend
                </option>
              </select>
              <p className="text-[11px] text-[#667085] mt-1">
                Real land records registered to your identity will load when connected to the backend database.
              </p>
            </div>

            {/* Supporting Document Upload */}
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1.5">
                Supporting Deed / Plan Document <span className="text-rose-600">*</span>
              </label>
              <div className="border border-dashed border-[#D9E2E1] rounded-lg p-3 text-center bg-[#F4F8F7]">
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
                {file && (
                  <p className="text-[11px] text-[#034E4E] font-mono mt-1 font-semibold">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div>
            <label className="block text-xs font-bold text-[#101828] mb-1.5">
              Application Details & Justification <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe your application request, survey parameters, and justification for revenue officer review..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-lg text-[#101828] focus:border-[#034E4E] focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting || !details.trim()}
              className="tracia-btn-primary inline-flex items-center space-x-2 text-xs disabled:opacity-50"
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

      {/* Step 3: My Applications Section (Awaiting Real Backend Data) */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-extrabold text-[#101828]">My Applications</h2>
          <p className="text-xs text-[#667085] mt-0.5">Submitted government land applications and officer resolution status.</p>
        </div>

        <EmptyState
          title="No applications submitted yet."
          description="Submitted land applications will be listed here with live verification tracking once the backend service is connected."
          icon={<FileText className="w-5 h-5 text-[#034E4E]" />}
        />
      </div>
    </div>
  );
};
