import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const CitizenAnomaliesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Anomaly Alerts</h1>
        <p className="text-sm text-slate-500 mt-1">
          Automated integrity check alerts regarding your registered land title properties.
        </p>
      </div>

      <ErrorAlert
        title="Anomaly Engine Status"
        message="System cross-validation algorithms will alert you of any title discrepancies when backend analytical workers run."
      />

      {/* Safety Notice */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-blue-900">Information Privacy Notice</h4>
          <p className="mt-0.5 leading-relaxed text-blue-800">
            Alerts display high-level potential discrepancy indicators. Official revenue investigation is conducted privately by authorized officers before any record status change.
          </p>
        </div>
      </div>

      {/* Empty State */}
      <EmptyState
        title="No potential anomaly alerts detected."
        description="Your land title holdings have no registered discrepancy warnings."
        icon={<ShieldAlert className="w-6 h-6 text-slate-400" />}
      />
    </div>
  );
};
