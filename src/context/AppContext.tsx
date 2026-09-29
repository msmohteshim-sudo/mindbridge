import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  Patient,
  Doctor,
  CognitiveProfile,
  ActivitySession,
  MemoryItem,
  UserRole,
  UserPermission,
  DoctorNote,
  DailyUpdate,
  AssessmentReport,
} from '../types';
import {
  demoPatient,
  demoPatientsList,
  demoDoctor,
  demoCognitiveProfile,
  demoSessions,
  demoMemories,
  initialDoctorNotes,
  demoDailyUpdates,
  initialAssessmentReports,
  ROLE_PERMISSIONS,
  patientCognitiveProfiles,
  patientSessionsMap,
} from '../data/demoData';

import { getTranslation, type Translations } from '../data/i18n';
import {
  seedDefaultCredentials,
  registerPatientCredential,
  verifyCredential,
  isEmailTaken,
} from '../utils/authStore';

// ─────────────────────────────────────────────────────────────────────────────
// AddPatient input shape (from the form)
// ─────────────────────────────────────────────────────────────────────────────
export interface AddPatientInput {
  fullName: string;
  email: string;
  pin: string;
  age: number;
  gender?: string;
  phoneNumber?: string;
  preferredLanguage: string;
  caregiverName?: string;
  caregiverEmail?: string;
  notes?: string;
  profilePhoto?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// App State
// ─────────────────────────────────────────────────────────────────────────────
interface AppState {
  patient: Patient;
  allPatients: Patient[];
  activePatientId: string;
  userRole: UserRole | null;
  currentUser: { email: string; name: string; role: UserRole; title?: string; userId?: string } | null;
  doctor: Doctor;
  cognitiveProfile: CognitiveProfile;
  sessions: ActivitySession[];
  memories: MemoryItem[];
  doctorNotes: DoctorNote[];
  dailyUpdates: DailyUpdate[];
  assessmentReports: AssessmentReport[];
  currentPage: string;
  isLoggedIn: boolean;
  fontScale: number;
  highContrast: boolean;
  language: string;
  voiceEnabled: boolean;
  isFirstLogin: boolean;
}

interface AppContextType extends AppState {
  navigate: (page: string) => void;
  login: () => void;
  loginAsRole: (role: UserRole, email?: string) => void;
  loginWithCredentials: (email: string, pin: string) => string | null;
  logout: () => void;
  switchPatient: (patientId: string) => void;
  updatePatientPhoto: (patientId: string, photoUrl: string) => void;
  removePatientPhoto: (patientId: string) => void;
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  updateDoctor: (updates: Partial<Doctor>) => void;
  addMemory: (memory: MemoryItem) => void;
  updateProfile: (updates: Partial<CognitiveProfile>) => void;
  addDoctorNote: (note: { patientId: string; doctorName: string; note: string; category: DoctorNote['category'] }) => void;
  addDailyUpdate: (update: Omit<DailyUpdate, 'id'>) => void;
  setFontScale: (scale: number) => void;
  setHighContrast: (value: boolean) => void;
  setLanguage: (code: string) => void;
  setVoiceEnabled: (value: boolean) => void;
  addSession: (session: ActivitySession) => void;
  hasPermission: (permission: keyof UserPermission) => boolean;
  t: (key: keyof Translations) => string;
  /** Create a new patient account (called by doctor). Returns error string or null. */
  addPatient: (input: AddPatientInput) => string | null;
  /** Check email uniqueness before showing duplicate warning */
  checkEmailAvailable: (email: string) => boolean;
  /** Mark first-login welcome as seen */
  dismissFirstLogin: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Persistence helpers
// ─────────────────────────────────────────────────────────────────────────────
const PATIENTS_KEY = 'mindbridge_patients';

const getStoredPatients = (): Patient[] => {
  try {
    const stored = localStorage.getItem(PATIENTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load mindbridge_patients from localStorage', e);
  }
  return demoPatientsList;
};

const savePatients = (patients: Patient[]) => {
  try {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  } catch (e) {
    console.error('Failed to save patients:', e);
  }
};

/** Generate next sequential patient ID */
const generatePatientId = (patients: Patient[]): string => {
  const nums = patients
    .map((p) => {
      const m = p.id.match(/^patient-(\d+)$/);
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter((n) => n > 0);
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `patient-${String(max + 1).padStart(3, '0')}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
  // Seed default credentials on mount (idempotent)
  useEffect(() => {
    seedDefaultCredentials();
  }, []);

  const initialPatients = getStoredPatients();
  const initialActive =
    initialPatients.find((p) => p.id === 'patient-001') ||
    initialPatients[0] ||
    demoPatient;

  const [state, setState] = useState<AppState>({
    patient: initialActive,
    allPatients: initialPatients,
    activePatientId: initialActive.id,
    userRole: null,
    currentUser: null,
    doctor: demoDoctor,
    cognitiveProfile:
      patientCognitiveProfiles[initialActive.id] || demoCognitiveProfile,
    sessions: patientSessionsMap[initialActive.id] || demoSessions,
    memories: demoMemories,
    doctorNotes: initialDoctorNotes,
    dailyUpdates: demoDailyUpdates,
    assessmentReports: initialAssessmentReports,
    currentPage: 'landing',
    isLoggedIn: false,
    fontScale: 1,
    highContrast: false,
    language: 'hi',
    voiceEnabled: false,
    isFirstLogin: false,
  });

  const navigate = useCallback((page: string) => {
    setState((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Role-based quick login (demo / doctor / caregiver bypass) ──────────────
  const loginAsRole = useCallback(
    (role: UserRole, email?: string) => {
      let targetPage = 'dashboard';
      let userDetails = {
        email: email || 'patient.demo@example.com',
        name: 'Arjun Sharma',
        role: 'patient' as UserRole,
        title: 'Patient',
        userId: 'patient-001',
      };

      if (role === 'patient') {
        // Find the patient by email in allPatients
        const patients = getStoredPatients();
        const found = patients.find(
          (p) =>
            p.email?.toLowerCase() === (email || '').toLowerCase()
        );
        targetPage = 'dashboard';
        userDetails = {
          email: email || 'patient.demo@example.com',
          name: found?.name || 'Arjun Sharma',
          role: 'patient',
          title: 'Patient',
          userId: found?.id || 'patient-001',
        };
        // Switch to the correct patient
        setState((prev) => {
          const activeP = patients.find((p) => p.id === userDetails.userId) || prev.patient;
          return {
            ...prev,
            isLoggedIn: true,
            userRole: role,
            currentUser: userDetails,
            currentPage: targetPage,
            patient: activeP,
            activePatientId: activeP.id,
            cognitiveProfile:
              patientCognitiveProfiles[activeP.id] || demoCognitiveProfile,
            sessions: patientSessionsMap[activeP.id] || demoSessions,
            isFirstLogin: activeP.isFirstLogin === true,
          };
        });
        return;
      } else if (role === 'caregiver') {
        targetPage = 'caregiver';
        userDetails = {
          email: email || 'caregiver.demo@example.com',
          name: 'Priya Sharma',
          role: 'caregiver',
          title: 'Family Caregiver',
          userId: 'caregiver-001',
        };
      } else if (role === 'doctor') {
        targetPage = 'doctor-dashboard';
        userDetails = {
          email: email || 'doctor.demo@example.com',
          name: demoDoctor.name,
          role: 'doctor',
          title: demoDoctor.title,
          userId: demoDoctor.id,
        };
      }

      setState((prev) => ({
        ...prev,
        isLoggedIn: true,
        userRole: role,
        currentUser: userDetails,
        currentPage: targetPage,
        isFirstLogin: false,
      }));
    },
    []
  );

  // ── Real credential-based login ────────────────────────────────────────────
  const loginWithCredentials = useCallback(
    (email: string, pin: string): string | null => {
      const result = verifyCredential(email, pin);
      if (!result) return 'Invalid email or PIN.';

      // Load latest patients from storage
      const patients = getStoredPatients();

      if (result.role === 'patient') {
        const patientRecord = patients.find((p) => p.id === result.userId);
        if (!patientRecord) return 'Patient account not found. Please contact your doctor.';

        const isFirst = patientRecord.isFirstLogin === true;

        setState((prev) => ({
          ...prev,
          isLoggedIn: true,
          userRole: 'patient',
          currentUser: {
            email: result.email,
            name: patientRecord.name,
            role: 'patient',
            title: 'Patient',
            userId: result.userId,
          },
          currentPage: 'dashboard',
          patient: patientRecord,
          activePatientId: patientRecord.id,
          cognitiveProfile:
            patientCognitiveProfiles[patientRecord.id] || demoCognitiveProfile,
          sessions: patientSessionsMap[patientRecord.id] || [],
          isFirstLogin: isFirst,
          allPatients: patients,
        }));

        // Clear the first-login flag after first login
        if (isFirst) {
          const updated = patients.map((p) =>
            p.id === patientRecord.id ? { ...p, isFirstLogin: false } : p
          );
          savePatients(updated);
        }
        return null;
      }

      if (result.role === 'doctor') {
        setState((prev) => ({
          ...prev,
          isLoggedIn: true,
          userRole: 'doctor',
          currentUser: {
            email: result.email,
            name: demoDoctor.name,
            role: 'doctor',
            title: demoDoctor.title,
            userId: result.userId,
          },
          currentPage: 'doctor-dashboard',
          isFirstLogin: false,
        }));
        return null;
      }

      if (result.role === 'caregiver') {
        setState((prev) => ({
          ...prev,
          isLoggedIn: true,
          userRole: 'caregiver',
          currentUser: {
            email: result.email,
            name: 'Priya Sharma',
            role: 'caregiver',
            title: 'Family Caregiver',
            userId: result.userId,
          },
          currentPage: 'caregiver',
          isFirstLogin: false,
        }));
        return null;
      }

      return 'Unknown role.';
    },
    []
  );

  const login = useCallback(() => {
    loginAsRole('patient');
  }, [loginAsRole]);

  const logout = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isLoggedIn: false,
      userRole: null,
      currentUser: null,
      currentPage: 'landing',
      isFirstLogin: false,
    }));
  }, []);

  // ── Add Patient (called by doctor) ─────────────────────────────────────────
  const addPatient = useCallback(
    (input: AddPatientInput): string | null => {
      const patients = getStoredPatients();

      // Email uniqueness check
      if (isEmailTaken(input.email)) {
        return 'This email is already registered.';
      }

      const newId = generatePatientId(patients);
      const defaultPhoto = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(input.fullName.replace(/\s+/g, ''))}&backgroundColor=b6e3f4`;

      const newPatient: Patient = {
        id: newId,
        name: input.fullName.trim(),
        email: input.email.trim().toLowerCase(),
        age: input.age,
        gender: input.gender || undefined,
        language: input.preferredLanguage || 'en',
        profilePhoto: input.profilePhoto || defaultPhoto,
        phoneNumber: input.phoneNumber || undefined,
        status: 'Active',
        caregiverName: input.caregiverName || 'Not assigned',
        caregiverEmail: input.caregiverEmail || undefined,
        doctorName: demoDoctor.name,
        doctorId: demoDoctor.id,
        diagnosisStage: 'monitoring',
        preferredActivities: [],
        hobbies: [],
        favouriteMusic: [],
        importantPlaces: [],
        joinedDate: new Date().toISOString().split('T')[0],
        isFirstLogin: true,
      };

      // Register credential (hashed PIN)
      const credError = registerPatientCredential(newId, input.email, input.pin);
      if (credError) return credError;

      const updatedPatients = [...patients, newPatient];
      savePatients(updatedPatients);

      // Update doctor's assignedPatients list
      setState((prev) => {
        const updatedDoctor: Doctor = {
          ...prev.doctor,
          assignedPatients: [...prev.doctor.assignedPatients, newId],
        };
        return {
          ...prev,
          allPatients: updatedPatients,
          doctor: updatedDoctor,
        };
      });

      return null;
    },
    []
  );

  const checkEmailAvailable = useCallback((email: string): boolean => {
    return !isEmailTaken(email);
  }, []);

  const dismissFirstLogin = useCallback(() => {
    setState((prev) => ({ ...prev, isFirstLogin: false }));
  }, []);

  // ── Patient Management ─────────────────────────────────────────────────────
  const switchPatient = useCallback((patientId: string) => {
    setState((prev) => {
      const found =
        prev.allPatients.find((p) => p.id === patientId) ||
        prev.allPatients[0] ||
        demoPatient;
      const profile =
        patientCognitiveProfiles[patientId] || demoCognitiveProfile;
      const sess = patientSessionsMap[patientId] || demoSessions;
      return {
        ...prev,
        activePatientId: patientId,
        patient: found,
        cognitiveProfile: profile,
        sessions: sess,
      };
    });
  }, []);

  const updatePatientPhoto = useCallback(
    (patientId: string, photoUrl: string) => {
      setState((prev) => {
        const updatedPatients = prev.allPatients.map((p) =>
          p.id === patientId ? { ...p, profilePhoto: photoUrl } : p
        );
        savePatients(updatedPatients);
        const updatedActivePatient =
          prev.activePatientId === patientId
            ? { ...prev.patient, profilePhoto: photoUrl }
            : prev.patient;
        return {
          ...prev,
          allPatients: updatedPatients,
          patient: updatedActivePatient,
        };
      });
    },
    []
  );

  const removePatientPhoto = useCallback(
    (patientId: string) => {
      setState((prev) => {
        const target = prev.allPatients.find((p) => p.id === patientId);
        const nameSeed = target
          ? target.name.replace(/\s+/g, '')
          : 'Patient';
        const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameSeed}&backgroundColor=b6e3f4`;
        const updatedPatients = prev.allPatients.map((p) =>
          p.id === patientId ? { ...p, profilePhoto: defaultAvatar } : p
        );
        savePatients(updatedPatients);
        const updatedActivePatient =
          prev.activePatientId === patientId
            ? { ...prev.patient, profilePhoto: defaultAvatar }
            : prev.patient;
        return {
          ...prev,
          allPatients: updatedPatients,
          patient: updatedActivePatient,
        };
      });
    },
    []
  );

  const updatePatient = useCallback(
    (patientId: string, updates: Partial<Patient>) => {
      setState((prev) => {
        const updatedPatients = prev.allPatients.map((p) =>
          p.id === patientId ? { ...p, ...updates } : p
        );
        savePatients(updatedPatients);
        const updatedActivePatient =
          prev.activePatientId === patientId
            ? { ...prev.patient, ...updates }
            : prev.patient;
        return {
          ...prev,
          allPatients: updatedPatients,
          patient: updatedActivePatient,
        };
      });
    },
    []
  );

  const updateDoctor = useCallback((updates: Partial<Doctor>) => {
    setState((prev) => ({
      ...prev,
      doctor: { ...prev.doctor, ...updates },
    }));
  }, []);

  const addMemory = useCallback((memory: MemoryItem) => {
    setState((prev) => ({
      ...prev,
      memories: [memory, ...prev.memories],
    }));
  }, []);

  const updateProfile = useCallback(
    (updates: Partial<CognitiveProfile>) => {
      setState((prev) => ({
        ...prev,
        cognitiveProfile: { ...prev.cognitiveProfile, ...updates },
      }));
    },
    []
  );

  const addDoctorNote = useCallback(
    (noteData: {
      patientId: string;
      doctorName: string;
      note: string;
      category: DoctorNote['category'];
    }) => {
      const newNote: DoctorNote = {
        id: `docnote-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        ...noteData,
      };
      setState((prev) => ({
        ...prev,
        doctorNotes: [newNote, ...prev.doctorNotes],
      }));
    },
    []
  );

  const addDailyUpdate = useCallback(
    (updateData: Omit<DailyUpdate, 'id'>) => {
      const newUpdate: DailyUpdate = {
        id: `dup-${Date.now()}`,
        ...updateData,
      };
      setState((prev) => ({
        ...prev,
        dailyUpdates: [newUpdate, ...prev.dailyUpdates],
      }));
    },
    []
  );

  const setFontScale = useCallback((scale: number) => {
    setState((prev) => ({ ...prev, fontScale: scale }));
    document.documentElement.style.fontSize = `${scale * 18}px`;
  }, []);

  const setHighContrast = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, highContrast: value }));
    document.documentElement.classList.toggle('high-contrast', value);
  }, []);

  const setLanguage = useCallback((code: string) => {
    setState((prev) => ({ ...prev, language: code }));
  }, []);

  const setVoiceEnabled = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, voiceEnabled: value }));
  }, []);

  const addSession = useCallback((session: ActivitySession) => {
    setState((prev) => ({
      ...prev,
      sessions: [session, ...prev.sessions],
    }));
  }, []);

  const hasPermission = useCallback(
    (permission: keyof UserPermission): boolean => {
      if (!state.userRole) return false;
      const rolePerms = ROLE_PERMISSIONS[state.userRole];
      return !!rolePerms[permission];
    },
    [state.userRole]
  );

  const t = useCallback(
    (key: keyof Translations): string => {
      return getTranslation(state.language, key);
    },
    [state.language]
  );

  return (
    <AppContext.Provider
      value={{
        ...state,
        navigate,
        login,
        loginAsRole,
        loginWithCredentials,
        logout,
        switchPatient,
        updatePatientPhoto,
        removePatientPhoto,
        updatePatient,
        updateDoctor,
        addMemory,
        updateProfile,
        addDoctorNote,
        addDailyUpdate,
        setFontScale,
        setHighContrast,
        setLanguage,
        setVoiceEnabled,
        addSession,
        hasPermission,
        t,
        addPatient,
        checkEmailAvailable,
        dismissFirstLogin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
