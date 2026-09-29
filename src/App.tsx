import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { ActivityPage } from './pages/ActivityPage';
import { GameLibrary } from './pages/GameLibrary';
import { MemoryGallery } from './pages/MemoryGallery';
import { ProgressDashboard } from './pages/ProgressDashboard';
import { VoiceCompanion } from './pages/VoiceCompanion';
import { CaregiverDashboard } from './pages/CaregiverDashboard';
import { CognitiveAssessment } from './pages/CognitiveAssessment';
import { PatientProfile } from './pages/PatientProfile';
import { Settings } from './pages/Settings';
import { MemoryUniverse } from './pages/MemoryUniverse';
import { RealLifeActivities } from './pages/RealLifeActivities';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { DoctorReports } from './pages/DoctorReports';
import { DoctorProfile } from './pages/DoctorProfile';
import { FirstLoginWelcome } from './pages/FirstLoginWelcome';

function Router() {
  const { currentPage, isLoggedIn, userRole, hasPermission, isFirstLogin } = useApp();

  // Public Landing Page
  if (currentPage === 'landing') return <LandingPage />;

  // Unauthenticated user -> Login Page
  if (!isLoggedIn || currentPage === 'login') return <LoginPage />;

  // First login welcome screen for patients
  if (isFirstLogin && userRole === 'patient') return <FirstLoginWelcome />;

  // Route Guard checks per role
  const renderCurrentPage = () => {
    // DOCTOR-ONLY ROUTES
    if (currentPage === 'doctor-dashboard') {
      if (userRole !== 'doctor') return <Dashboard />;
      return <DoctorDashboard />;
    }

    if (currentPage === 'doctor-profile') {
      if (userRole !== 'doctor') return <Dashboard />;
      return <DoctorProfile />;
    }

    if (currentPage === 'doctor-reports') {
      if (!hasPermission('view_reports')) return <Dashboard />;
      return <DoctorReports />;
    }

    if (currentPage === 'progress') {
      if (!hasPermission('view_progress')) return <Dashboard />;
      return <ProgressDashboard />;
    }

    if (currentPage === 'assessment') {
      if (!hasPermission('view_assessments') && userRole !== 'patient') return <Dashboard />;
      return <CognitiveAssessment />;
    }

    // CAREGIVER ROUTE
    if (currentPage === 'caregiver') {
      return <CaregiverDashboard />;
    }

    // PATIENT / SHARED ROUTES
    if (currentPage === 'dashboard') return <Dashboard />;
    if (currentPage === 'activity' || currentPage.startsWith('activity:')) {
      const gameType = currentPage.startsWith('activity:') ? currentPage.slice(9) : undefined;
      return <ActivityPage initialGame={gameType} />;
    }
    if (currentPage === 'games') return <GameLibrary />;
    if (currentPage === 'memories') return <MemoryGallery />;
    if (currentPage === 'voice') return <VoiceCompanion />;
    if (currentPage === 'profile') return <PatientProfile />;
    if (currentPage === 'settings') return <Settings />;
    if (currentPage === 'universe') return <MemoryUniverse />;
    if (currentPage === 'reallife') return <RealLifeActivities />;

    // Fallback based on role
    if (userRole === 'doctor') return <DoctorDashboard />;
    if (userRole === 'caregiver') return <CaregiverDashboard />;
    return <Dashboard />;
  };

  return <Layout>{renderCurrentPage()}</Layout>;
}

function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

export default App;
