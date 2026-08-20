import React, { useState, useEffect } from 'react';
import { Upload, FileCheck, AlertTriangle, FileText, CheckCircle2, XCircle, HelpCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Badge } from '../../components/common/Badge';
import { landService } from '../../services/landService';
import { ocrService } from '../../services/ocrService';
import type { LandRecord, VerificationResult } from '../../types';

export const CitizenOcrPage: React.FC = () => {
  const navigate = useNavigate();
  const [lands, setLands] = useState<LandRecord[]>([]);
  const [selectedLandId, setSelectedLandId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<'select' | 'upload' | 'processing' | 'result'>('select');
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const res = await landService.getMyLandRecords();
        if (res.status === 'success' && res.data) {
          setLands(res.data);
        }
      } catch (err: any) {
        console.error('Failed to load land records:', err);
      }
    };
    fetchLands();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleStartOcr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedLandId) return;

    setStep('processing');
    setNotice(null);
    setErrorMsg(null);

    try {
      // 1. Upload file to Supabase Storage and database
      const uploadRes = await ocrService.uploadLandDocument(selectedLandId, file);
      if (uploadRes.status === 'error' || !uploadRes.data) {
        throw new Error(uploadRes.message || 'File upload failed');
      }

      const documentId = uploadRes.data.id;

      // 2. Trigger OCR text extraction via Express backend
      const extractRes = await ocrService.startOcrExtraction(documentId);
      if (!extractRes.success || !extractRes.data) {
        throw new Error(extractRes.error || 'OCR extraction failed');
      }

      // 3. Retrieve computed matching metrics
      const verifyRes = await ocrService.getVerificationResults(documentId);
      if (!verifyRes.success || !verifyRes.data) {
        throw new Error(verifyRes.error || 'Verification comparison failed');
      }

      setVerificationResult(verifyRes.data);
      setStep('result');

      if (verifyRes.data.overallStatus === 'MISMATCH') {
        setNotice(`Verification completed with mismatches: ${verifyRes.data.mismatchCount} field values differ from official registry records.`);
      } else if (verifyRes.data.overallStatus === 'MATCH') {
        setNotice('Verification completed successfully! All deed document fields match official registry values.');
      } else {
        setNotice('OCR processing completed, but verification could not be fully run.');
      }
    } catch (err: any) {
      console.error('OCR verification error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred during OCR verification.');
      setStep('upload');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Document OCR Verification</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload physical deed copies (PDF, JPG, PNG) to verify extracted text against official digital registry records.
        </p>
      </div>

      <ErrorAlert
        title="OCR Service Status"
        message="Optical Character Recognition (Tesseract engine) and comparison matching will run dynamically when you process documents."
      />

      {errorMsg && (
        <ErrorAlert
          title="OCR Execution Failed"
          message={errorMsg}
        />
      )}

      {/* Workflow Step Progress */}
      <div className="grid grid-cols-4 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-center text-xs font-semibold text-slate-600">
        <div className={`p-2 rounded-lg ${step === 'select' ? 'bg-blue-700 text-white' : 'bg-slate-100'}`}>
          1. Select Title
        </div>
        <div className={`p-2 rounded-lg ${step === 'upload' ? 'bg-blue-700 text-white' : 'bg-slate-100'}`}>
          2. Upload File
        </div>
        <div className={`p-2 rounded-lg ${step === 'processing' ? 'bg-blue-700 text-white' : 'bg-slate-100'}`}>
          3. Process OCR
        </div>
        <div className={`p-2 rounded-lg ${step === 'result' ? 'bg-blue-700 text-white' : 'bg-slate-100'}`}>
          4. Review Field Match
        </div>
      </div>

      {/* Main Upload Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <form onSubmit={handleStartOcr} className="space-y-6">
          {/* Step 1: Select Own Land Record */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">
              Select Your Registered Land Title <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">Choose the land property you wish to verify against your uploaded document.</p>
            <select
              value={selectedLandId}
              onChange={(e) => {
                setSelectedLandId(e.target.value);
                if (e.target.value) setStep('upload');
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">-- Select Registered Property --</option>
              {lands.map((land) => (
                <option key={land.id} value={land.id}>
                  Survey No: {land.survey_number} - {land.village}, {land.taluk} (Patta: {land.patta_number || 'N/A'})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Upload Document */}
          {step !== 'select' && (
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">
                Upload Title Deed Document <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-3">Accepted formats: PDF, JPG, JPEG, PNG (Max 10MB).</p>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-600 transition-colors bg-slate-50">
                <Upload className="w-8 h-8 text-blue-700 mx-auto mb-2" />
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="document-file-input"
                />
                <label
                  htmlFor="document-file-input"
                  className="cursor-pointer text-xs font-bold text-blue-700 hover:underline"
                >
                  Click to browse file
                </label>
                <span className="text-xs text-slate-500"> or drag and drop</span>
                {file && (
                  <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 text-xs font-mono">
                    <FileText className="w-4 h-4" />
                    <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Action */}
          {step !== 'select' && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!file || step === 'processing'}
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center space-x-2 disabled:opacity-50 transition-colors"
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
          )}
        </form>
      </div>

      {/* Field-by-Field Verification UI Template Structure */}
      {step === 'result' && verificationResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">OCR Field Matching Matrix</h2>
              <p className="text-xs text-slate-500 mt-0.5">Field-by-field verification compared to official database records.</p>
            </div>
            <Badge variant={verificationResult.overallStatus === 'MATCH' ? 'success' : 'warning'}>
              {verificationResult.overallStatus === 'MATCH' ? 'Exact Match' : 'Potential Mismatch'}
            </Badge>
          </div>

          {notice && (
            <div className={`p-3 rounded-xl text-xs border ${
              verificationResult.overallStatus === 'MATCH' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              {notice}
            </div>
          )}

          {/* Field Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="p-3 rounded-l-lg">Field Name</th>
                  <th className="p-3">Official Record</th>
                  <th className="p-3">Extracted Document Value</th>
                  <th className="p-3 rounded-r-lg">Match Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {verificationResult.fields.map((f) => (
                  <tr key={f.field}>
                    <td className="p-3 font-semibold text-slate-900 capitalize">{f.field.replace(/_/g, ' ')}</td>
                    <td className="p-3 font-mono">{f.officialValue || 'N/A'}</td>
                    <td className="p-3 font-mono">{f.ocrValue || 'N/A'}</td>
                    <td className="p-3">
                      {f.status === 'MATCH' ? (
                        <span className="inline-flex items-center text-emerald-700 font-semibold space-x-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Match</span>
                        </span>
                      ) : f.status === 'MISMATCH' ? (
                        <span className="inline-flex items-center text-rose-700 font-semibold space-x-1">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Potential Mismatch</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-slate-500 font-semibold space-x-1">
                          <HelpCircle className="w-4 h-4 text-slate-400" />
                          <span>Unavailable</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Trigger for Grievance */}
          {verificationResult.overallStatus === 'MISMATCH' && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-rose-900">Potential Mismatch Detected</h4>
                  <p className="text-xs text-rose-700">If extracted field values differ from official titles, you may lodge a formal grievance.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  const mismatches = verificationResult.fields
                    .filter((x) => x.status === 'MISMATCH')
                    .map((x) => x.field.replace(/_/g, ' '))
                    .join(', ');
                  const desc = `OCR discrepancy detected on: ${mismatches}. Extracted document values do not align with registry.`;
                  navigate(`/citizen/grievances?land_id=${selectedLandId}&category=ocr_mismatch&description=${encodeURIComponent(desc)}`);
                }}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl shrink-0 transition-colors"
              >
                Raise Grievance
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
