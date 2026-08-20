import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Building, MapPin, User } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { landService } from '../../services/landService';

export const OfficerEditLandRecordPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      setLoadingDetails(true);
      setErrorMsg(null);
      try {
        const res = await landService.getLandRecord(id);
        if ((res.success || res.status === 'success') && res.data) {
          setFormData({
            document_type: res.data.document_type || 'Sale Deed',
            document_number: res.data.document_number || '',
            registration_date: res.data.registration_date || '',
            registration_office: res.data.registration_office || '',
            district: res.data.district || '',
            taluk: res.data.taluk || '',
            village: res.data.village || '',
            survey_number: res.data.survey_number || '',
            patta_number: res.data.patta_number || '',
            property_extent: res.data.property_extent || '',
            land_type: res.data.land_type || 'Wet Land (Nanjai)',
            owner_name: res.data.owner_name || '',
            previous_owner: res.data.previous_owner || '',
            sale_consideration: res.data.sale_consideration || '',
            property_description: res.data.property_description || '',
            parent_document: res.data.parent_document || '',
          });
        } else {
          setErrorMsg(res.message || 'Failed to load land record details.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to connect to the backend server.');
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchRecord();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);
    setErrorMsg(null);

    try {
      const res = await landService.updateLandRecord(id!, formData as any);
      if (res.success || res.status === 'success') {
        setNotice('Land record successfully updated in master registry!');
        setTimeout(() => {
          navigate(`/officer/land-records/${id}`);
        }, 1500);
      } else {
        setErrorMsg(res.message || 'Failed to update land record.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving the record.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#034E4E]" />
        <p className="text-xs text-[#667085] font-semibold">Loading registry record details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center space-x-3">
        <Link
          to={`/officer/land-records/${id || 'demo'}`}
          className="p-2 rounded-lg bg-white border border-[#D9E2E1] text-[#101828] hover:bg-[#F4F8F7] transition-colors"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </Link>
        <div>
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">Mutation & Title Amendment</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] mt-0.5 tracking-tight">Edit Land Title Record #{id}</h1>
        </div>
      </div>

      <ErrorAlert
        title="Mutation Audit Status"
        message="Modifying land title fields triggers audit log entries and updates updated_at timestamps in Supabase."
      />

      {errorMsg && (
        <ErrorAlert
          title="Operation Failed"
          message={errorMsg}
        />
      )}

      {notice && (
        <div className="p-3 rounded bg-[#F4F8F7] border border-[#D9E2E1] text-xs text-[#034E4E]">
          {notice}
        </div>
      )}

      <form onSubmit={handleSubmit} className="tracia-card p-6 sm:p-8 space-y-8">
        {/* Registration Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <Building className="w-4 h-4 text-[#034E4E]" />
            <span>1. Registration & Deed Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Document Type</label>
              <select
                name="document_type"
                value={formData.document_type}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              >
                <option value="Sale Deed">Sale Deed</option>
                <option value="Gift Deed">Gift Deed</option>
                <option value="Partition Deed">Partition Deed</option>
                <option value="Settlement Deed">Settlement Deed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Document Number</label>
              <input
                type="text"
                name="document_number"
                value={formData.document_number}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Registration Date</label>
              <input
                type="date"
                name="registration_date"
                value={formData.registration_date}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Registration Office</label>
              <input
                type="text"
                name="registration_office"
                value={formData.registration_office}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#034E4E]" />
            <span>2. Location & Property Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Taluk</label>
              <input
                type="text"
                name="taluk"
                value={formData.taluk}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Village</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Survey Number</label>
              <input
                type="text"
                name="survey_number"
                value={formData.survey_number}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Patta Number</label>
              <input
                type="text"
                name="patta_number"
                value={formData.patta_number}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Property Extent</label>
              <input
                type="text"
                name="property_extent"
                value={formData.property_extent}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Land Classification</label>
              <input
                type="text"
                name="land_type"
                value={formData.land_type}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Sale Consideration (₹)</label>
              <input
                type="number"
                name="sale_consideration"
                value={formData.sale_consideration}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Ownership Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <User className="w-4 h-4 text-[#034E4E]" />
            <span>3. Ownership Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Owner Name</label>
              <input
                type="text"
                name="owner_name"
                value={formData.owner_name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Previous Owner</label>
              <input
                type="text"
                name="previous_owner"
                value={formData.previous_owner}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Parent Document</label>
              <input
                type="text"
                name="parent_document"
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
                value={formData.property_description}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Update Record</span>
          </button>
        </div>
      </form>
    </div>
  );
};
