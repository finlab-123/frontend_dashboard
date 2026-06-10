# Dashboard API Integration Guide

## Overview
This guide explains how to integrate dashboard statistics and charts across all dashboard pages and components.

## Architecture

### Custom Hooks
Located in `src/app/hooks/`:

1. **useDashboardStats** - Fetches overall dashboard statistics
   - Returns: `{ stats, loading, error, refetch }`
   - Provides: total, pending, approved, inProgress, rejected, distribution

2. **useMonthlyLeads** - Generates monthly lead trend data
   - Returns: `{ data, loading, error, refetch }`
   - Provides: last 7 months of lead data

### Services
Located in `src/app/services/`:

1. **dashboardService** - Centralized API calls
   - Methods: getStats(), getAllLeads(), getLeadsByStatus(), getLeadsByCategory(), getLeadsByDateRange(), assignLead(), unassignLead()

### Components
Located in `src/app/components/`:

1. **StatsCard** - Displays individual metric
   - Props: title, value, change, isPositive, icon
   - Shows: Number with change indicator

2. **LeadGenerationChart** - Monthly lead trend chart
   - Props: data[], loading, error
   - Accepts: MonthlyLeadData[]

3. **LoanDistributionChart** - Pie chart of loan distribution
   - Props: chartData[]
   - Accepts: Array of {name, value}

## Integration Pattern

### Basic Usage in Pages

```typescript
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useMonthlyLeads } from '../hooks/useMonthlyLeads';

export function YourPage() {
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { data: monthlyData, loading: monthlyLoading } = useMonthlyLeads();

  if (statsError) {
    return <div>Error: {statsError}</div>;
  }

  return (
    <div>
      {/* Stats Cards */}
      <StatsCard 
        title="Total Leads"
        value={statsLoading ? '...' : stats?.total ?? 0}
        change="+12.5% from last month"
        isPositive={true}
        icon={Users}
      />

      {/* Charts */}
      <LeadGenerationChart 
        data={monthlyData || []}
        loading={monthlyLoading}
      />
      <LoanDistributionChart chartData={stats?.distribution || []} />
    </div>
  );
}
```

## Integrated Pages

### ✅ Completed
- **DashboardPage** - Main dashboard with all stats and charts
- **ReportsPage** - Analytics and performance metrics

### ⏳ Can Be Enhanced
- **HomeLoanPage** - Use category filter for home loans only
- **VehicleLoanPage** - Use category filter for vehicle loans only
- Other product pages - Use category-specific filtering

## Category-Specific Implementation

For product-specific pages, use the service to filter by category:

```typescript
const [stats, setStats] = useState<any>(null);

useEffect(() => {
  dashboardService.getLeadsByCategory('Home Loan')
    .then(data => setStats(data))
    .catch(err => console.error(err));
}, []);
```

## API Endpoints Used

```
GET /api/dashboard/stats
- Returns overall statistics

GET /api/dashboard/allleads
- Returns all leads

GET /api/dashboard/filter/status/{status}
- Returns leads by status (Pending, Approved, In Progress, Rejected)

GET /api/dashboard/filter/category/{category}
- Returns leads by product category

GET /api/dashboard/filter/date-range?startDate=...&endDate=...
- Returns leads within date range

POST /api/dashboard/assign
- Assigns lead to team member

POST /api/dashboard/unassign
- Unassigns a lead
```

## Error Handling

All hooks include built-in error handling:
- Catches network errors
- Returns error state with message
- Provides refetch capability

Handle in components:
```typescript
if (error) {
  return <div className="text-red-600">Error: {error}</div>;
}

if (loading) {
  return <div>Loading...</div>;
}
```

## Responsive Design

All components use responsive grid layouts:
- mobile : 1 column
- Tablet: 2 columns  
- Desktop: 3-4 columns

## Performance Considerations

1. **Data Caching** - Hooks fetch on mount; use refetch for updates
2. **Lazy Loading** - Charts only render when data is available
3. **Conditional Rendering** - Loading states prevent empty renders
4. **Memoization** - Consider wrapping components with React.memo for optimization

## Future Enhancements

1. Add date range filtering to charts
2. Implement data export to CSV/PDF
3. Add real-time updates with WebSockets
4. Create custom metric dashboards
5. Add role-based stat visibility
