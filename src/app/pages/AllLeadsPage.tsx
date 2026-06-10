import { LeadManagement } from '../components/LeadManagement';

export function AllLeadsPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl text-gray-900 mb-1">All Leads</h1>
        <p className="text-sm text-gray-600">View and manage all leads in the system</p>
      </div>
      <LeadManagement />
    </div>
  );
}

