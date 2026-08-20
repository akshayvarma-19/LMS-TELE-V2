import React, { useState } from 'react';
import { Upload, FileCheck, AlertTriangle, FileText, CheckCircle2, XCircle, HelpCircle, Loader2 } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Badge } from '../../components/common/Badge';

export const CitizenOcrPage: React.FC = () => {
  const [selectedLandId, setSelectedLandId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<'select' | 'upload' | 'processing' | 'result'>('select');
  const [notice, setNotice] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleStartOcr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStep('processing');
    setNotice(null);

    setTimeout(() => {
      setStep('result');
      setNotice('Backend OCR Service Required. Real document parsing (Tesseract/Gemini) will execute via the Express backend server.');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">Document OCR Verification</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Upload physical deed copies (PDF, JPG, PNG) to verify extracted text against official digital registry records.
        </p>
      </div>

      <ErrorAlert
        title="OCR Service Status"
        message="Full optical character recognition and field matching will process document uploads via the backend API when connected."
      />

      {/* Workflow Step Progress */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 tracia-card p-2 text-center text-xs font-bold">
        <div className={`p-2 rounded-md ${step === 'select' ? 'bg-[#034E4E] text-white' : 'bg-[#F4F8F7] text-[#667085]'}`}>
          1. Select Title
        </div>
        <div className={`p-2 rounded-md ${step === 'upload' ? 'bg-[#034E4E] text-white' : 'bg-[#F4F8F7] text-[#667085]'}`}>
          2. Upload File
        </div>
        <div className={`p-2 rounded-md ${step === 'processing' ? 'bg-[#034E4E] text-white' : 'bg-[#F4F8F7] text-[#667085]'}`}>
          3. Process OCR
        </div>
        <div className={`p-2 rounded-md ${step === 'result' ? 'bg-[#034E4E] text-white' : 'bg-[#F4F8F7] text-[#667085]'}`}>
          4. Review Field Match
        </div>
      </div>

      {/* Main Upload Card */}
      <div className="tracia-card p-6">
        <form onSubmit={handleStartOcr} className="space-y-6">
          {/* Step 1: Select Own Land Record */}
          <div>
            <label className="block text-xs font-bold text-[#101828] mb-1">
              Select Your Registered Land Title <span className="text-rose-600">*</span>
            </label>
            <p className="text-xs text-[#667085] mb-2">Choose the land property you wish to verify against your uploaded document.</p>
            <select
              value={selectedLandId}
              onChange={(e) => {
                setSelectedLandId(e.target.value);
                if (e.target.value) setStep('upload');
              }}
              className="w-full px-3 py-2 bg-white border border-[#D9E2E1] rounded-md text-xs sm:text-sm text-[#101828] focus:border-[#034E4E] focus:outline-none"
            >
              <option value="">-- Select Registered Property --</option>
              <option value="LAND-CONN-REQ">Property Record #1 (Requires Backend Connection)</option>
            </select>
          </div>

          {/* Step 2: Upload Document */}
          <div>
            <label className="block text-xs font-bold text-[#101828] mb-1">
              Upload Title Deed Document <span className="text-rose-600">*</span>
            </label>
            <p className="text-xs text-[#667085] mb-3">Accepted formats: PDF, JPG, JPEG, PNG (Max 10MB).</p>

            <div className="border-2 border-dashed border-[#D9E2E1] rounded-lg p-6 text-center hover:border-[#034E4E] transition-colors bg-[#F4F8F7]">
              <Upload className="w-8 h-8 text-[#034E4E] mx-auto mb-2" />
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                id="document-file-input"
              />
              <label
                htmlFor="document-file-input"
                className="cursor-pointer text-xs font-bold text-[#034E4E] hover:underline"
              >
                Click to browse file
              </label>
              <span className="text-xs text-[#667085]"> or drag and drop</span>
              {file && (
                <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1.5 rounded bg-[#EAF4F3] text-[#034E4E] text-xs font-mono border border-[#0B6868]/20">
                  <FileText className="w-4 h-4" />
                  <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!file || step === 'processing'}
              className="tracia-btn-primary inline-flex items-center space-x-2 text-xs disabled:opacity-50"
            >
              {step === 'processing' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Parsing OCR & Comparing Fields...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>Run Document OCR Verification</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Field-by-Field Verification UI Structure */}
      {step === 'result' && (
        <div className="tracia-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#D9E2E1] pb-4">
            <div>
              <h2 className="text-sm font-extrabold text-[#101828]">OCR Field Matching Matrix</h2>
              <p className="text-xs text-[#667085] mt-0.5">Field-by-field verification structure preview.</p>
            </div>
            <Badge variant="warning">Potential Mismatch Preview</Badge>
          </div>

          {notice && (
            <div className="p-3 rounded bg-[#F4F8F7] border border-[#D9E2E1] text-xs text-[#034E4E]">
              {notice}
            </div>
          )}

          {/* Field Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#D9E2E1] rounded-lg">
              <thead className="bg-[#F4F8F7] text-[#034E4E] uppercase font-bold text-[11px] border-b border-[#D9E2E1]">
                <tr>
                  <th className="p-3">Field Name</th>
                  <th className="p-3">Official Record</th>
                  <th className="p-3">Extracted Document Value</th>
                  <th className="p-3">Match Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2E1] text-[#101828]">
                <tr>
                  <td className="p-3 font-bold">Survey Number</td>
                  <td className="p-3 font-mono text-[#667085]">Backend Value</td>
                  <td className="p-3 font-mono text-[#667085]">Document Value</td>
                  <td className="p-3">
                    <span className="inline-flex items-center text-[#047857] font-bold space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                      <span>Match</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Property Extent</td>
                  <td className="p-3 font-mono text-[#667085]">Backend Value</td>
                  <td className="p-3 font-mono text-[#667085]">Document Value</td>
                  <td className="p-3">
                    <span className="inline-flex items-center text-[#B45309] font-bold space-x-1">
                      <XCircle className="w-4 h-4 text-[#B45309]" />
                      <span>Potential Mismatch</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Patta Number</td>
                  <td className="p-3 font-mono text-[#667085]">Backend Value</td>
                  <td className="p-3 font-mono text-[#667085]">Document Value</td>
                  <td className="p-3">
                    <span className="inline-flex items-center text-[#667085] font-semibold space-x-1">
                      <HelpCircle className="w-4 h-4 text-[#667085]" />
                      <span>Unavailable</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Trigger for Grievance */}
          <div className="p-4 rounded-lg bg-[#FFFBEB] border border-[#F59E0B]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-[#B45309] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#B45309]">Potential Mismatch Flagged</h4>
                <p className="text-xs text-[#B45309]/80">If extracted field values differ from official titles, you may lodge a formal grievance.</p>
              </div>
            </div>

            <button
              onClick={() => alert('Grievance submission form will link this OCR result when backend is connected.')}
              className="tracia-btn-primary text-xs shrink-0"
            >
              Raise Grievance
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
