// === Types for the MindBridge platform ===

export type UserRole = 'patient' | 'caregiver' | 'doctor';

export interface UserPermission {
  play_games: boolean;
  complete_activities: boolean;
  view_memories: boolean;
  voice_companion: boolean;

  patient_support: boolean;
  upload_memories: boolean;
  manage_family_content: boolean;
  view_basic_engagement: boolean;

  view_assessments: boolean;
  view_progress: boolean;
  view_cognitive_trends: boolean;
  view_reports: boolean;
  generate_reports: boolean;
  view_patient_history: boolean;
  add_doctor_notes: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender?: string;
  language: string;
  profilePhoto: string;
  email?: string;           // login email (set by doctor during creation)
  phoneNumber?: string;
  status?: 'Active' | 'Monitoring' | 'Inactive';
  caregiverName: string;
  caregiverEmail?: string;  // optional caregiver contact
  doctorName?: string;
  doctorId?: string;        // ID of the doctor who owns/created this patient
  diagnosisStage: 'mild' | 'moderate' | 'early' | 'monitoring';
  preferredActivities: string[];
  hobbies: string[];
  favouriteMusic: string[];
  importantPlaces: string[];
  joinedDate: string;
  isFirstLogin?: boolean;   // flag for showing welcome screen
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  hospital: string;
  email: string;
  assignedPatients: string[];
  medicalLicenseId?: string;
  phone?: string;
  department?: string;
  consultationHours?: string;
  bio?: string;
  experienceYears?: number;
  avatarUrl?: string;
}

export interface DoctorNote {
  id: string;
  patientId: string;
  date: string;
  doctorName: string;
  note: string;
  category: 'clinical' | 'recommendation' | 'assessment_review' | 'medication_note';
}

export interface DailyUpdate {
  id: string;
  patientId: string;
  date: string;
  author: string;
  role: 'doctor' | 'caregiver';
  mood?: 'excellent' | 'good' | 'fair' | 'poor';
  summary: string;
  category: 'clinical_progress' | 'daily_log' | 'medication_routine' | 'behavioral';
  activitiesCount?: number;
}

export interface AssessmentReport {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  type: 'Initial Cognitive Assessment' | 'Periodic Assessment' | '3-Month Review';
  evaluator: string;
  overallScore: number;
  domainScores: CognitiveProfile;
  adaptiveLevel: number;
  engagementSummary: string;
  clinicalObservations: string;
  recommendations: string[];
}

export interface CognitiveProfile {
  memory: number;           // 0-100
  attention: number;
  language: number;
  executiveFunction: number;
  visuospatial: number;
  processingSpeed: number;
  overallScore: number;
  lastUpdated: string;
  trend: 'improving' | 'stable' | 'declining';
}

export interface ActivitySession {
  id: string;
  activityType: GameType;
  activityName: string;
  completedAt: string;
  durationMinutes: number;
  score: number;
  difficulty: DifficultyLevel;
  engagement: 'high' | 'medium' | 'low';
  domainScores: Partial<CognitiveProfile>;
}

export interface MemoryItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: 'photo' | 'place' | 'person' | 'event' | 'music' | 'story';
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  relationship?: string; // e.g., "daughter", "grandson"
  year?: number;
}

export interface GameConfig {
  type: GameType;
  name: string;
  description: string;
  icon: string;
  cognitiveTargets: Array<keyof CognitiveProfile>;
  minDuration: number;
  maxDuration: number;
  color: string;
  bgColor: string;
  category: 'memory' | 'attention' | 'language' | 'executive' | 'relaxation' | 'social' | 'reallife';
}

export type GameType =
  | 'memory-match'
  | 'object-recognition'
  | 'whats-missing'
  | 'sequence-arrangement'
  | 'story-completion'
  | 'family-memory'
  | 'music-recognition'
  | 'daily-routine'
  | 'virtual-shopping'
  | 'coloring-relaxation'
  | 'attention-tasks'
  | 'language-tasks';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface DailyPlan {
  date: string;
  activities: PlannedActivity[];
  completed: boolean;
  streak: number;
}

export interface PlannedActivity {
  id: string;
  gameType: GameType;
  name: string;
  estimatedMinutes: number;
  difficulty: DifficultyLevel;
  reason: string; // AI reasoning for recommendation
  completed: boolean;
  scheduledTime?: string;
}

export interface CaregiverNote {
  id: string;
  date: string;
  note: string;
  mood: 'excellent' | 'good' | 'fair' | 'poor';
  author: string;
}

export interface WeeklyProgress {
  week: string;
  sessionsCompleted: number;
  avgScore: number;
  topDomain: string;
  challengingDomain: string;
  engagementRate: number;
}

export interface VoiceCommand {
  phrase: string;
  action: string;
  language: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

