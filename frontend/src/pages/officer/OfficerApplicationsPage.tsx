import React, { useState, useEffect } from 'react';
import { Filter, ClipboardCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Badge } from '../../components/common/Badge';
import { applicationService } from '../../services/applicationService';
import type { ApplicationRecord } from '../../types';

export const OfficerApplicationsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await applicationService.getOfficerApplications({
        status: statusFilter || undefined,
        type: typeFilter || undefined
      });
      if ((res.status === 'success' || res.success) && res.data) {
        setApplications(res.data);
      } else {
        setErrorMsg(res.message || 'Failed to fetch application queue.');
      }
    } catch (err: any) {
      console.error('Error fetching application queue:', err);
      setErrorMsg(err.message || 'Error connecting to application service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [statusFilter, typeFilter]);

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
    const typeLabels: Record<string, string> = {
      'sale_transfer': 'Land Sale / Transfer',
      'construction_approval': 'Construction Approval',
      'land_use_change': 'Land Use Change',
      'other_approval': 'Other Approval'
    };
    return typeLabels[cat] || cat;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">
          Application Verification Queue
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Review, inspect site parameters, and verify citizen land applications.
        </p>
      </div>

      {errorMsg && (
        <ErrorAlert
          title="Queue Fetch Error"
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
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#DDE5E3] rounded-md focus:border-[#034E4E] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="info_required">Information Requested</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="sm:w-56 relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#DDE5E3] rounded-md focus:border-[#034E4E] focus:outline-none"
          >
            <option value="">All Application Types</option>
            <option value="sale_transfer">Land Sale / Transfer</option>
            <option value="construction_approval">Construction Approval</option>
            <option value="land_use_change">Land Use Change</option>
            <option value="other_approval">Other Approval</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-16 bg-white border border-slate-200 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-[#034E4E]" />
          <span className="ml-2 text-xs text-slate-500 font-medium">Loading application queue...</span>
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications pending verification."
          description="Citizen applications submitted for revenue officer verification will populate into this queue."
          icon={<ClipboardCheck className="w-6 h-6 text-[#034E4E]" />}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="p-4">Application ID</th>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Survey / Village</th>
                  <th className="p-4">Date Submitted</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 font-mono">{app.id}</td>
                    <td className="p-4 font-medium">
                      <div>{app.applicant_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{app.phone || app.email}</div>
                    </td>
                    <td className="p-4">{getCategoryLabel(app.type)}</td>
                    <td className="p-4">
                      <div className="font-bold font-mono">{app.survey_number}</div>
                      <div className="text-[10px] text-slate-400">{app.village}, {app.district}</div>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusBadgeVariant(app.status)}>
                        {app.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        to={`/officer/applications/${app.id}`}
                        className="px-3 py-1.5 bg-[#EAF4F3] hover:bg-[#034E4E] hover:text-white text-[#034E4E] font-bold text-[10px] rounded-lg transition-colors inline-block"
                      >
                        Inspect & Verify
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
