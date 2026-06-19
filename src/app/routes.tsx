import { createBrowserRouter, Outlet } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { ProtectedRoute } from './components/ProtectedRoute'; // Adjust this import path to where your ProtectedRoute is stored

import { DashboardPage } from './pages/DashboardPage';
import { AllLeadsPage } from './pages/AllLeadsPage';
import { VehicleLoanPage } from './pages/VehicleLoanPage';
import UserDetailsPage from './pages/UserDetailsPage';
import { HomeLoanPage } from './pages/HomeLoanPage';
import { LAPPage } from './pages/LAPPage';
import { LoanAgainstSharesPage } from './pages/LoanAgainstSharesPage';
import { MedicalLoanPage } from './pages/MedicalLoanPage';
import { SupplyChainLoanPage } from './pages/SupplyChain';
import { EducationLoanPage } from './pages/EducationLoanPage';
import { MutualFundsPage } from './pages/MutualFundsPage';
import { LifeInsurancePage } from './pages/LifeInsurancePage';
import { CreditCardPage } from './pages/CreditCardPage';
import { GeneralInsurancePage } from './pages/GeneralInsurancePage';
import { PartnerPage } from './pages/PartnerPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
export const router = createBrowserRouter([
  {
    path: '/',
    // Wrap the entire layout inside the ProtectedRoute
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: DashboardPage },
      { path: 'leads', Component: AllLeadsPage },
      { path: 'vehicle-loan', Component: VehicleLoanPage },
      { path: 'home-loan', Component: HomeLoanPage },
      { path: 'user/:id', Component: UserDetailsPage },
      { path: 'lap', Component: LAPPage },
      { path: 'loan-against-shares', Component: LoanAgainstSharesPage },
      { path: 'medical-loan', Component: MedicalLoanPage },
      { path: 'supply-chain', Component: SupplyChainLoanPage },
      { path: 'education-loan', Component: EducationLoanPage },
      { path: 'mutual-funds', Component: MutualFundsPage },
      { path: 'life-insurance', Component: LifeInsurancePage },
      { path: 'credit-card', Component: CreditCardPage },
      { path: 'general-insurance', Component: GeneralInsurancePage },
      { path: 'partner', Component: PartnerPage },
      { path: 'reports', Component: ReportsPage },
      { path: 'settings', Component: SettingsPage },
    ],
  },
]);