import { Filter, UserPlus, Download } from 'lucide-react';
import { LeadsTable } from './LeadsTable';

export function LeadManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-gray-900 mb-1">Lead Management</h2>
          <p className="text-sm text-gray-600">Manage and track all customer leads</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" strokeWidth={1.5} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" strokeWidth={1.5} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
            <UserPlus className="w-4 h-4" strokeWidth={1.5} />
            Assign Lead
          </button>
        </div>
      </div>

      <LeadsTable />
    </div>
  );
}

