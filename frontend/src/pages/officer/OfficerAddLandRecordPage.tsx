import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Building, MapPin, User } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { landService } from '../../services/landService';

export const OfficerAddLandRecordPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 16 Core Fields State
  const [formData, setFormData] = useState({
    document_type: 'Sale Deed',
    document_number: '',
    registration_date: '',
    registration_office: '',
    district: '',
    taluk: '',
    village: '',
    survey_number: '',
    patta_number: '',
    property_extent: '',
    land_type: 'Wet Land (Nanjai)',
    owner_name: '',
    previous_owner: '',
    sale_consideration: '',
    property_description: '',
    parent_document: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);
    setErrorMsg(null);

    try {
      const res = await landService.createLandRecord(formData as any);
      if (res.success || res.status === 'success') {
        setNotice('Land record successfully created in master registry!');
        setTimeout(() => {
          navigate(`/officer/land-records/${res.data?.id}`);
        }, 1500);
      } else {
        setErrorMsg(res.message || 'Failed to create land record.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving the record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Link
          to="/officer/land-records"
          className="p-2 rounded-lg bg-white border border-[#D9E2E1] text-[#101828] hover:bg-[#F4F8F7] transition-colors"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </Link>
        <div>
          <span className="text-xs font-bold text-[#034E4E] uppercase tracking-wider">Administrative Registry</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] mt-0.5 tracking-tight">Add New Land Record (16 Core Fields)</h1>
        </div>
      </div>

      <ErrorAlert
        title="Form Processing Notice"
        message="Submitting this form will execute server-side validation and write a new row to the database when backend is online."
      />

      {errorMsg && (
        <ErrorAlert
          title="Submission Failed"
          message={errorMsg}
        />
      )}

      {notice && (
        <div className="p-3 rounded bg-[#F4F8F7] border border-[#D9E2E1] text-xs text-[#034E4E]">
          {notice}
        </div>
      )}

      <form onSubmit={handleSubmit} className="tracia-card p-6 sm:p-8 space-y-8">
        {/* Section 1: Registration Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <Building className="w-4 h-4 text-[#034E4E]" />
            <span>1. Registration & Deed Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                Document Type <span className="text-rose-600">*</span>
              </label>
              <select
                name="document_type"
                required
                value={formData.document_type}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              >
                <option value="Sale Deed">Sale Deed</option>
                <option value="Gift Deed">Gift Deed</option>
                <option value="Partition Deed">Partition Deed</option>
                <option value="Settlement Deed">Settlement Deed</option>
                <option value="Patta Transfer">Patta Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                Document Number <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="document_number"
                required
                placeholder="e.g. DOC-2024-8841"
                value={formData.document_number}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                Registration Date <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                name="registration_date"
                required
                value={formData.registration_date}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                Registration Office <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="registration_office"
                required
                placeholder="e.g. SRO Velachery"
                value={formData.registration_office}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Location & Survey Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#034E4E]" />
            <span>2. Location & Survey Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                District <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="district"
                required
                placeholder="e.g. Chennai"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                Taluk <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="taluk"
                required
                placeholder="e.g. Velachery"
                value={formData.taluk}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                Village <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="village"
                required
                placeholder="e.g. Adyar"
                value={formData.village}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                Survey Number <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="survey_number"
                required
                placeholder="e.g. 102/3B"
                value={formData.survey_number}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                Patta Number <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="patta_number"
                required
                placeholder="e.g. PAT-4491"
                value={formData.patta_number}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                Property Extent <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="property_extent"
                required
                placeholder="e.g. 2400 Sq Ft / 5.5 Cents"
                value={formData.property_extent}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                Land Classification / Type <span className="text-rose-600">*</span>
              </label>
              <select
                name="land_type"
                required
                value={formData.land_type}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              >
                <option value="Wet Land (Nanjai)">Wet Land (Nanjai)</option>
                <option value="Dry Land (Punjai)">Dry Land (Punjai)</option>
                <option value="House Site / Residential">House Site / Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Government Reserve">Government Reserve</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                Sale Consideration (₹) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                name="sale_consideration"
                required
                placeholder="e.g. 4500000"
                value={formData.sale_consideration}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Ownership & Parent History */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <User className="w-4 h-4 text-[#034E4E]" />
            <span>3. Ownership & Parent Deed Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                Owner Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="owner_name"
                required
                placeholder="Full Owner Name"
                value={formData.owner_name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Previous Owner Name</label>
              <input
                type="text"
                name="previous_owner"
                placeholder="Previous Owner Name (if transfer)"
                value={formData.previous_owner}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Parent Document Number</label>
              <input
                type="text"
                name="parent_document"
                placeholder="e.g. DOC-2018-1102"
                value={formData.parent_document}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-[#101828] mb-1">Property Description</label>
              <textarea
                name="property_description"
                rows={3}
                placeholder="Boundaries, linear measurements, and four sides boundary details..."
                value={formData.property_description}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-[#D9E2E1]">
          <button
            type="button"
            onClick={() => navigate('/officer/land-records')}
            className="tracia-btn-secondary text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="tracia-btn-primary inline-flex items-center space-x-2 text-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Record...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Create Land Title Record</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
