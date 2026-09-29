import React from 'react';
import {
  Brain, Home, Gamepad2, Image, BarChart3, Users, Settings, Mic,
  Stethoscope, FileText, Sparkles, LogOut, User
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const PATIENT_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'reallife', label: 'Activities', icon: Gamepad2 },
  { id: 'games', label: 'Games', icon: Sparkles },
  { id: 'memories', label: 'My Memories', icon: Image },
  { id: 'voice', label: 'Voice Companion', icon: Mic },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const CAREGIVER_NAV: NavItem[] = [
  { id: 'caregiver', label: 'Dashboard', icon: Home },
  { id: 'profile', label: 'Patient Profile', icon: User },
  { id: 'games', label: 'Activities', icon: Gamepad2 },
  { id: 'memories', label: 'Memory Manager', icon: Image },
  { id: 'universe', label: 'Family Memories', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const DOCTOR_NAV: NavItem[] = [
  { id: 'doctor-dashboard', label: 'Dashboard', icon: Home },
  { id: 'doctor-profile', label: 'Doctor Profile', icon: Stethoscope },
  { id: 'profile', label: 'Patient Directory', icon: Users },
  { id: 'assessment', label: 'Assessments', icon: FileText },
  { id: 'progress', label: 'Cognitive Progress', icon: BarChart3 },
  { id: 'doctor-reports', label: 'Clinical Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const {
    currentPage,
    navigate,
    patient,
    allPatients,
    activePatientId,
    switchPatient,
    logout,
    userRole,
    doctor,
  } = useApp();

  const getNavItems = (): NavItem[] => {
    if (userRole === 'caregiver') return CAREGIVER_NAV;
    if (userRole === 'doctor') return DOCTOR_NAV;
    return PATIENT_NAV; // default to patient nav
  };

  const navItems = getNavItems();

  const getRoleBadge = () => {
    if (userRole === 'doctor') {
      return (
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs px-3 py-1.5 rounded-2xl font-700">
          <span>👨‍⚕️ Doctor Portal</span>
        </div>
      );
    }
    if (userRole === 'caregiver') {
      return (
        <div className="flex items-center gap-2 bg-sage-50 border border-sage-200 text-sage-800 text-xs px-3 py-1.5 rounded-2xl font-700">
          <span>👨‍👩‍👧 Caregiver Support</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-800 text-xs px-3 py-1.5 rounded-2xl font-700">
        <span>👴 Patient Mode</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Brand */}
          <button
            onClick={() => {
              if (userRole === 'doctor') navigate('doctor-dashboard');
              else if (userRole === 'caregiver') navigate('caregiver');
              else navigate('dashboard');
            }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            aria-label="MindBridge Home"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sage-400 rounded-2xl flex items-center justify-center shadow-soft">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-display font-800 text-gray-900">Mind</span>
                <span className="text-xl font-display font-800 text-sky-600">Bridge</span>
              </div>
              <p className="text-[10px] text-gray-400 font-600">Cognitive Companion</p>
            </div>
          </button>

          {/* Role & Patient Selector Header Items */}
          <div className="flex items-center gap-3">
            {getRoleBadge()}

            {/* Patient Selector for Doctor and Caregiver */}
            {(userRole === 'doctor' || userRole === 'caregiver') && (
              <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-1.5 text-xs">
                <span className="text-gray-500 font-600">Patient:</span>
                <select
                  value={activePatientId}
                  onChange={(e) => switchPatient(e.target.value)}
                  className="bg-transparent font-700 text-gray-800 focus:outline-none cursor-pointer"
                >
                  {allPatients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.diagnosisStage})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* User Profile Info */}
            <button
              onClick={() => {
                if (userRole === 'doctor') navigate('doctor-profile');
                else navigate('profile');
              }}
              className="flex items-center gap-2 bg-cream-100 hover:bg-cream-200 rounded-2xl px-3 py-1.5 transition-colors cursor-pointer"
              aria-label="View profile"
            >
              <img
                src={userRole === 'doctor' ? (doctor.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400') : patient.profilePhoto}
                alt={userRole === 'doctor' ? doctor.name : patient.name}
                className="w-7 h-7 rounded-full bg-sky-100 object-cover border border-indigo-200"
              />
              <span className="hidden sm:block text-xs font-700 text-gray-700">
                {userRole === 'doctor' ? doctor.name : userRole === 'caregiver' ? 'Priya Sharma' : patient.name}
              </span>
            </button>

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className="btn-ghost text-xs px-3 py-1.5 text-gray-500 hover:text-red-600 flex items-center gap-1"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 py-6 gap-6">
        {/* Sidebar Navigation */}
        <nav
          className="hidden md:flex flex-col gap-1 w-56 flex-shrink-0"
          aria-label="Main navigation"
        >
          <div className="px-3 py-2 text-xs font-700 text-gray-400 uppercase tracking-wider">
            {userRole === 'doctor' ? 'Clinical Navigation' : userRole === 'caregiver' ? 'Caregiver Navigation' : 'Patient Navigation'}
          </div>

          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => navigate(id)}
              className={`nav-item flex-row justify-start gap-3 px-4 py-3 text-sm font-600 w-full rounded-2xl transition-all ${
                currentPage === id
                  ? userRole === 'doctor'
                    ? 'bg-indigo-600 text-white shadow-soft'
                    : userRole === 'caregiver'
                    ? 'bg-sage-600 text-white shadow-soft'
                    : 'bg-sky-600 text-white shadow-soft'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-current={currentPage === id ? 'page' : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </button>
          ))}

          {/* Prototype Disclaimer */}
          <div className="mt-8 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 leading-relaxed">
            <strong>MindBridge:</strong> Supportive cognitive platform. Indicators are non-diagnostic.
          </div>
        </nav>

        {/* Main Page Content */}
        <main className="flex-1 min-w-0 animate-fade-in" id="main-content">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 shadow-soft"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => navigate(id)}
              className={`nav-item text-[11px] font-600 ${currentPage === id ? 'active' : ''}`}
              aria-current={currentPage === id ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
