import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { CitizenLayout } from './layouts/CitizenLayout';
import { OfficerLayout } from './layouts/OfficerLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';

// Citizen Pages
import { CitizenDashboardPage } from './pages/citizen/DashboardPage';
import { CitizenLandRecordsPage } from './pages/citizen/LandRecordsPage';
import { CitizenLandRecordDetailPage } from './pages/citizen/LandRecordDetailPage';
import { PublicSearchPage } from './pages/citizen/PublicSearchPage';
import { CitizenOcrPage } from './pages/citizen/OcrPage';
import { CitizenGrievancesPage } from './pages/citizen/GrievancesPage';
import { CitizenGrievanceDetailPage } from './pages/citizen/GrievanceDetailPage';
import { CitizenLandMapPage } from './pages/citizen/LandMapPage';
import { CitizenAssistantPage } from './pages/citizen/AssistantPage';
import { CitizenNotificationsPage } from './pages/citizen/NotificationsPage';
import { ProfilePage } from './pages/citizen/ProfilePage';

// Officer Pages
import { OfficerDashboardPage } from './pages/officer/OfficerDashboardPage';
import { OfficerLandRecordsPage } from './pages/officer/OfficerLandRecordsPage';
import { OfficerLandRecordDetailPage } from './pages/officer/OfficerLandRecordDetailPage';
import { OfficerAddLandRecordPage } from './pages/officer/OfficerAddLandRecordPage';
import { OfficerEditLandRecordPage } from './pages/officer/OfficerEditLandRecordPage';
import { OfficerGrievancesPage } from './pages/officer/OfficerGrievancesPage';
import { OfficerGrievanceDetailPage } from './pages/officer/OfficerGrievanceDetailPage';
import { OfficerDocumentsPage } from './pages/officer/OfficerDocumentsPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Citizen Routes */}
        <Route path="/citizen" element={<CitizenLayout />}>
          <Route index element={<Navigate to="/citizen/dashboard" replace />} />
          <Route path="dashboard" element={<CitizenDashboardPage />} />
          <Route path="land-records" element={<CitizenLandRecordsPage />} />
          <Route path="land-records/:id" element={<CitizenLandRecordDetailPage />} />
          <Route path="search" element={<PublicSearchPage />} />
          <Route path="ocr" element={<CitizenOcrPage />} />
          <Route path="grievances" element={<CitizenGrievancesPage />} />
          <Route path="grievances/:id" element={<CitizenGrievanceDetailPage />} />
          <Route path="map" element={<CitizenLandMapPage />} />
          <Route path="assistant" element={<CitizenAssistantPage />} />
          <Route path="notifications" element={<CitizenNotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Officer Routes */}
        <Route path="/officer" element={<OfficerLayout />}>
          <Route index element={<Navigate to="/officer/dashboard" replace />} />
          <Route path="dashboard" element={<OfficerDashboardPage />} />
          <Route path="land-records" element={<OfficerLandRecordsPage />} />
          <Route path="land-records/new" element={<OfficerAddLandRecordPage />} />
          <Route path="land-records/:id" element={<OfficerLandRecordDetailPage />} />
          <Route path="land-records/:id/edit" element={<OfficerEditLandRecordPage />} />
          <Route path="grievances" element={<OfficerGrievancesPage />} />
          <Route path="grievances/:id" element={<OfficerGrievanceDetailPage />} />
          <Route path="documents" element={<OfficerDocumentsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
