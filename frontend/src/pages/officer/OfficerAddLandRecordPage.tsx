import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Building, MapPin, User } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const OfficerAddLandRecordPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);

    // Call createLandRecord API placeholder
    setTimeout(() => {
      setLoading(false);
      setNotice('Backend Connection Required. Land title records will be inserted directly into the database once the API service is connected.');
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Link
          to="/officer/land-records"
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Administrative Registry</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Add New Land Record (16 Core Fields)</h1>
        </div>
      </div>

      <ErrorAlert
        title="Form Processing Status"
        message="Submitting this form will execute server-side validation and write a new row to the database when backend is online."
      />

      {notice && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
          {notice}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
        {/* Section 1: Registration Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center space-x-2">
            <Building className="w-4 h-4 text-blue-700" />
            <span>1. Registration & Deed Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Type <span className="text-rose-500">*</span>
              </label>
              <select
                name="document_type"
                required
                value={formData.document_type}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Sale Deed">Sale Deed</option>
                <option value="Gift Deed">Gift Deed</option>
                <option value="Partition Deed">Partition Deed</option>
                <option value="Settlement Deed">Settlement Deed</option>
                <option value="Patta Transfer">Patta Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="document_number"
                required
                placeholder="e.g. DOC-2024-8841"
                value={formData.document_number}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registration Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="registration_date"
                required
                value={formData.registration_date}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registration Office <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="registration_office"
                required
                placeholder="e.g. SRO Velachery"
                value={formData.registration_office}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Location & Survey Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-700" />
            <span>2. Location & Survey Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="district"
                required
                placeholder="e.g. Chennai"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Taluk <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="taluk"
                required
                placeholder="e.g. Velachery"
                value={formData.taluk}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Village <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="village"
                required
                placeholder="e.g. Adyar"
                value={formData.village}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Survey Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="survey_number"
                required
                placeholder="e.g. 102/3B"
                value={formData.survey_number}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Patta Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="patta_number"
                required
                placeholder="e.g. PAT-4491"
                value={formData.patta_number}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Property Extent <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="property_extent"
                required
                placeholder="e.g. 2400 Sq Ft / 5.5 Cents"
                value={formData.property_extent}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Land Classification / Type <span className="text-rose-500">*</span>
              </label>
              <select
                name="land_type"
                required
                value={formData.land_type}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Wet Land (Nanjai)">Wet Land (Nanjai)</option>
                <option value="Dry Land (Punjai)">Dry Land (Punjai)</option>
                <option value="House Site / Residential">House Site / Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Government Reserve">Government Reserve</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sale Consideration (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="sale_consideration"
                required
                placeholder="e.g. 4500000"
                value={formData.sale_consideration}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Ownership & Parent History */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-700" />
            <span>3. Ownership & Parent Deed Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="owner_name"
                required
                placeholder="Full Owner Name"
                value={formData.owner_name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Previous Owner Name</label>
              <input
                type="text"
                name="previous_owner"
                placeholder="Previous Owner Name (if transfer)"
                value={formData.previous_owner}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Document Number</label>
              <input
                type="text"
                name="parent_document"
                placeholder="e.g. DOC-2018-1102"
                value={formData.parent_document}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Property Description</label>
              <textarea
                name="property_description"
                rows={3}
                placeholder="Boundaries, linear measurements, and four sides boundary details..."
                value={formData.property_description}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/officer/land-records')}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center space-x-2 disabled:opacity-50 transition-colors"
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
