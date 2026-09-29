import React, { useState, useRef } from 'react';
import {
  User, Heart, Music, MapPin, Edit3, Save, Camera, Search,
  Users, PlusCircle, Activity,
  X, CheckCircle2,
  FileText, TrendingUp, BarChart3, Plus,
  Stethoscope,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { useApp } from '../context/AppContext';
import { patientCognitiveHistories, cognitiveHistory } from '../data/demoData';
import type { DoctorNote, DailyUpdate } from '../types';

export function PatientProfile() {
  const {
    patient,
    allPatients,
    activePatientId,
    switchPatient,
    updatePatientPhoto,
    removePatientPhoto,
    updatePatient,
    userRole,
    doctor,
    cognitiveProfile,
    sessions,
    doctorNotes,
    addDoctorNote,
    dailyUpdates,
    addDailyUpdate,
    assessmentReports,
    navigate,
  } = useApp();

  // Navigation Sub-tabs in Patient Directory / Profile Page
  const [activeTab, setActiveTab] = useState<'directory' | 'profile' | 'analytics' | 'clinical'>(
    userRole === 'doctor' || userRole === 'caregiver' ? 'directory' : 'profile'
  );

  // Edit Profile Mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedHobbies, setEditedHobbies] = useState(patient.hobbies.join(', '));
  const [editedMusic, setEditedMusic] = useState(patient.favouriteMusic.join(', '));

  // Time Period Filter for Cognitive Trend History Chart
  const [timePeriod, setTimePeriod] = useState<'30' | '90' | '180' | '365'>('90');

  // New Doctor Note Form State
  const [newNoteText, setNewNoteText] = useState('');
  const [noteCategory, setNoteCategory] = useState<DoctorNote['category']>('clinical');

  // New Daily Update Form Modal State
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: 'excellent' as 'excellent' | 'good' | 'fair' | 'poor',
    category: 'clinical_progress' as DailyUpdate['category'],
    summary: '',
    activitiesCount: 2,
  });

  // Success Notification Toasts
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Directory Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'id' | 'age'>('name');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Photo Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      alert('Please upload a valid image file (JPG, JPEG, PNG, or WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updatePatientPhoto(patient.id, event.target.result as string);
        showNotification('Patient photo updated successfully!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Directory Filtering
  const filteredPatients = allPatients.filter(p => {
    if (filterStatus !== 'all' && (p.status || 'Active').toLowerCase() !== filterStatus.toLowerCase()) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.caregiverName.toLowerCase().includes(q) ||
      (p.phoneNumber && p.phoneNumber.toLowerCase().includes(q))
    );
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'id') return a.id.localeCompare(b.id);
    return a.age - b.age;
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    updatePatient(patient.id, {
      hobbies: editedHobbies.split(',').map(s => s.trim()).filter(Boolean),
      favouriteMusic: editedMusic.split(',').map(s => s.trim()).filter(Boolean),
    });
    showNotification('Patient details updated successfully!');
  };

  // Add Clinical Doctor Note Handler
  const handleAddDoctorNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    addDoctorNote({
      patientId: patient.id,
      doctorName: doctor.name,
      note: newNoteText.trim(),
      category: noteCategory,
    });

    setNewNoteText('');
    showNotification('New clinical note recorded successfully!');
  };

  // Add Daily Update Handler
  const handleAddDailyUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateFormData.summary.trim()) return;

    addDailyUpdate({
      patientId: patient.id,
      date: updateFormData.date,
      author: userRole === 'doctor' ? doctor.name : 'Priya Sharma (Caregiver)',
      role: userRole === 'doctor' ? 'doctor' : 'caregiver',
      mood: updateFormData.mood,
      summary: updateFormData.summary.trim(),
      category: updateFormData.category,
      activitiesCount: updateFormData.activitiesCount,
    });

    setIsAddUpdateOpen(false);
    setUpdateFormData({
      date: new Date().toISOString().split('T')[0],
      mood: 'excellent',
      category: 'clinical_progress',
      summary: '',
      activitiesCount: 2,
    });

    showNotification('Daily progress update recorded!');
  };

  // Filtered Patient Clinical Data
  const radarData = [
    { domain: 'Memory', value: cognitiveProfile.memory },
    { domain: 'Attention', value: cognitiveProfile.attention },
    { domain: 'Language', value: cognitiveProfile.language },
    { domain: 'Executive', value: cognitiveProfile.executiveFunction },
    { domain: 'Visuospatial', value: cognitiveProfile.visuospatial },
    { domain: 'Processing', value: cognitiveProfile.processingSpeed },
  ];

  const rawHistory = patientCognitiveHistories[patient.id] || cognitiveHistory;
  const filteredHistory = rawHistory.slice(-parseInt(timePeriod === '30' ? '2' : timePeriod === '90' ? '4' : '6'));

  const activePatientReports = assessmentReports.filter(r => r.patientId === patient.id);
  const activePatientNotes = doctorNotes.filter(n => n.patientId === patient.id);
  const patientDailyUpdates = dailyUpdates.filter(u => u.patientId === patient.id);
  const latestReport = activePatientReports[0];

  const recentActivities = [
    { id: 'act-1', name: 'Memory Match', status: 'Completed', date: '25 Sep 2026, 09:30 AM', duration: '12 min' },
    { id: 'act-2', name: 'Virtual Market Shopping', status: 'Completed', date: '24 Sep 2026, 02:00 PM', duration: '18 min' },
    { id: 'act-3', name: 'Story Completion', status: 'Completed', date: '23 Sep 2026, 11:00 AM', duration: '15 min' },
  ];

  const getLatestUpdateForPatient = (pId: string) => {
    return dailyUpdates.find(u => u.patientId === pId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Hidden File Input for Patient Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />

      {/* NOTIFICATION TOAST */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center justify-between shadow-soft animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-700">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CLINICAL NAVIGATION SUB-TABS */}
      <div className="flex flex-wrap bg-white p-1.5 rounded-2xl border border-gray-200 shadow-soft max-w-3xl">
        {(userRole === 'doctor' || userRole === 'caregiver') && (
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-700 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'directory'
                ? 'bg-indigo-600 text-white shadow-soft'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Patient Directory ({allPatients.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-700 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-soft'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <User className="w-4 h-4" />
          Patient Profile
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-700 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-soft'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Cognitive Analytics & Radar
        </button>

        <button
          onClick={() => setActiveTab('clinical')}
          className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-700 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'clinical'
              ? 'bg-indigo-600 text-white shadow-soft'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          Assessments & Notes ({activePatientNotes.length})
        </button>
      </div>

      {/* ==================== SUB-TAB 1: PATIENT PROFILE OVERVIEW ==================== */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Profile Hero Header Card */}
          <div className="card p-6 sm:p-8 bg-white border border-gray-200 shadow-soft">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Photo & Upload Controls */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="relative group">
                  <img
                    src={patient.profilePhoto}
                    alt={patient.name}
                    className="w-28 h-28 rounded-3xl object-cover bg-sky-100 border-4 border-white shadow-medium transition-transform group-hover:scale-105"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors shadow-soft"
                    aria-label="Upload photo"
                    title="Upload / Change Photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-ghost text-[11px] px-2.5 py-1 text-indigo-700 hover:bg-indigo-50 font-600 border border-indigo-200 rounded-xl"
                  >
                    Upload Photo
                  </button>
                  <button
                    onClick={() => removePatientPhoto(patient.id)}
                    className="btn-ghost text-[11px] px-2 py-1 text-rose-600 hover:bg-rose-50 font-600 rounded-xl"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Patient Info Fields */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                  <h1 className="text-3xl font-display font-800 text-gray-900">{patient.name}</h1>
                  <span className="badge bg-indigo-100 text-indigo-800 text-xs font-700">
                    ID: {patient.id}
                  </span>
                  <span className="badge bg-green-100 text-green-800 text-xs font-700">
                    Status: {patient.status || 'Active'}
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  Age {patient.age} · Joined {new Date(patient.joinedDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </p>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                  <span className="badge badge-blue capitalize">🌿 {patient.diagnosisStage} Monitoring</span>
                  <span className="badge bg-purple-100 text-purple-800">🗣️ {patient.language === 'hi' ? 'Hindi' : patient.language === 'as' ? 'Assamese' : 'English'}</span>
                  <span className="badge bg-amber-100 text-amber-700">🔥 7-day streak</span>
                </div>
              </div>

              {/* Edit / Quick Action Buttons */}
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    if (isEditing) handleSaveProfile();
                    else setIsEditing(true);
                  }}
                  className={isEditing ? 'btn-primary' : 'btn-secondary'}
                >
                  {isEditing ? <><Save className="w-4 h-4" /> Save Details</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
                </button>
                <button
                  onClick={() => setIsAddUpdateOpen(true)}
                  className="btn bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs py-2 px-3.5 rounded-xl font-700 border border-indigo-200 flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Record Daily Update
                </button>
              </div>
            </div>
          </div>

          {/* KEY CLINICAL PERFORMANCE INDICATOR CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-5 bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200 shadow-soft">
              <span className="text-xs text-indigo-700 font-700 uppercase tracking-wider">Overall Cognitive Score</span>
              <div className="text-3xl font-display font-800 text-indigo-900 mt-2">{cognitiveProfile.overallScore}%</div>
              <div className="text-xs text-indigo-600 font-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Trend: <span className="capitalize">{cognitiveProfile.trend}</span>
              </div>
            </div>

            <div className="card p-5 bg-gradient-to-br from-sky-50 to-sky-100/50 border border-sky-200 shadow-soft">
              <span className="text-xs text-sky-700 font-700 uppercase tracking-wider">Completed Sessions</span>
              <div className="text-3xl font-display font-800 text-sky-900 mt-2">{sessions.length} Sessions</div>
              <div className="text-xs text-sky-600 font-600 mt-1">High engagement rating</div>
            </div>

            <div className="card p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 shadow-soft">
              <span className="text-xs text-purple-700 font-700 uppercase tracking-wider">Adaptive Level</span>
              <div className="text-3xl font-display font-800 text-purple-900 mt-2">Level 2</div>
              <div className="text-xs text-purple-600 font-600 mt-1">Auto-tuned difficulty</div>
            </div>

            <div className="card p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 shadow-soft">
              <span className="text-xs text-emerald-700 font-700 uppercase tracking-wider">Last Clinical Review</span>
              <div className="text-lg font-display font-800 text-emerald-900 mt-2">{latestReport ? latestReport.date : '20 Sep 2026'}</div>
              <div className="text-xs text-emerald-600 font-600 mt-1 truncate">{latestReport ? latestReport.type : 'Periodic Assessment'}</div>
            </div>
          </div>

          {/* Supportive Engagement Summary Index */}
          <div className="card bg-white p-6 border border-gray-200 shadow-soft">
            <h2 className="text-lg font-display font-700 text-gray-900 mb-4">Primary Cognitive Index Breakdown</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Memory Index', value: cognitiveProfile.memory, color: 'bg-sky-500', text: 'text-sky-700' },
                { label: 'Language Index', value: cognitiveProfile.language, color: 'bg-purple-500', text: 'text-purple-700' },
                { label: 'Attention Index', value: cognitiveProfile.attention, color: 'bg-amber-500', text: 'text-amber-700' },
              ].map(({ label, value, color, text }) => (
                <div key={label} className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className={`text-3xl font-display font-800 ${text} mb-2`}>{value}%</div>
                  <div className="progress-bar mb-2">
                    <div className={`progress-fill ${color}`} style={{ width: `${value}%` }} />
                  </div>
                  <div className="text-xs text-gray-500 font-600">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Details & Contact Grid */}
          <div className="card bg-white p-6 border border-gray-200 shadow-soft">
            <h2 className="text-lg font-display font-700 text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Patient Contact & Clinical Assignment
            </h2>

            <div className="grid md:grid-cols-2 gap-4 text-sm bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div>
                <label className="block text-xs font-600 text-gray-400 mb-0.5">Full Name</label>
                <div className="text-gray-900 font-700 py-0.5">{patient.name}</div>
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-400 mb-0.5">Patient ID</label>
                <div className="text-indigo-700 font-700 py-0.5">{patient.id}</div>
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-400 mb-0.5">Age & Gender</label>
                <div className="text-gray-900 font-700 py-0.5">{patient.age} years · {patient.gender || 'Male'}</div>
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-400 mb-0.5">Primary Caregiver</label>
                <div className="text-gray-900 font-700 py-0.5 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  {patient.caregiverName}
                </div>
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-400 mb-0.5">Attending Specialist</label>
                <div className="text-gray-900 font-700 py-0.5">{patient.doctorName || doctor.name}</div>
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-400 mb-0.5">Date Joined</label>
                <div className="text-gray-900 font-700 py-0.5">{patient.joinedDate}</div>
              </div>
            </div>
          </div>

          {/* Reminiscent Content & Hobbies */}
          <div className="card bg-white p-6 border border-gray-200 shadow-soft">
            <h2 className="text-lg font-display font-700 text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              Interests & Reminiscent Content
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-700 text-gray-500 mb-2">
                  <Music className="w-4 h-4 text-amber-500" />
                  Favourite Music
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedMusic}
                    onChange={e => setEditedMusic(e.target.value)}
                    className="input-field text-xs"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {patient.favouriteMusic.map(m => (
                      <span key={m} className="badge bg-amber-100 text-amber-800 text-xs font-600">{m}</span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-700 text-gray-500 mb-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  Hobbies
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedHobbies}
                    onChange={e => setEditedHobbies(e.target.value)}
                    className="input-field text-xs"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {patient.hobbies.map(h => (
                      <span key={h} className="badge bg-emerald-100 text-emerald-800 text-xs font-600">{h}</span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-700 text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  Important Places
                </div>
                <div className="flex flex-wrap gap-2">
                  {patient.importantPlaces.map(p => (
                    <span key={p} className="badge bg-rose-100 text-rose-800 text-xs font-600">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 2: COGNITIVE ANALYTICS & RADAR ==================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* 1. Cognitive Domain Radar Chart */}
            <div className="card bg-white p-6 border border-gray-200 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-display font-700 text-gray-900">Cognitive Domain Radar</h3>
                  <p className="text-xs text-gray-500">6-Domain Performance Profile for {patient.name}</p>
                </div>
                <span className="badge bg-indigo-100 text-indigo-700 text-xs font-700">6 Domains</span>
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11, fill: '#475569' }} />
                  <Radar
                    name="Performance Index"
                    dataKey="value"
                    stroke="#4f46e5"
                    fill="#6366f1"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>

              {/* 6 Metric Badges Grid */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="p-2.5 bg-sky-50/80 rounded-xl border border-sky-100">
                  <span className="text-[11px] text-gray-500 font-600 block">Memory</span>
                  <strong className="text-sm font-700 text-sky-700">{cognitiveProfile.memory}%</strong>
                </div>
                <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-100">
                  <span className="text-[11px] text-gray-500 font-600 block">Attention</span>
                  <strong className="text-sm font-700 text-amber-700">{cognitiveProfile.attention}%</strong>
                </div>
                <div className="p-2.5 bg-purple-50/80 rounded-xl border border-purple-100">
                  <span className="text-[11px] text-gray-500 font-600 block">Language</span>
                  <strong className="text-sm font-700 text-purple-700">{cognitiveProfile.language}%</strong>
                </div>
                <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-100">
                  <span className="text-[11px] text-gray-500 font-600 block">Executive</span>
                  <strong className="text-sm font-700 text-emerald-700">{cognitiveProfile.executiveFunction}%</strong>
                </div>
                <div className="p-2.5 bg-rose-50/80 rounded-xl border border-rose-100">
                  <span className="text-[11px] text-gray-500 font-600 block">Visuospatial</span>
                  <strong className="text-sm font-700 text-rose-700">{cognitiveProfile.visuospatial}%</strong>
                </div>
                <div className="p-2.5 bg-indigo-50/80 rounded-xl border border-indigo-100">
                  <span className="text-[11px] text-gray-500 font-600 block">Processing</span>
                  <strong className="text-sm font-700 text-indigo-700">{cognitiveProfile.processingSpeed}%</strong>
                </div>
              </div>
            </div>

            {/* 2. Cognitive History Line Chart */}
            <div className="card bg-white p-6 border border-gray-200 shadow-soft">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-display font-700 text-gray-900">Cognitive History</h3>
                  <p className="text-xs text-gray-500">Longitudinal Performance Trend</p>
                </div>

                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-600">
                  {(['30', '90', '180', '365'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setTimePeriod(p)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        timePeriod === p
                          ? 'bg-indigo-600 text-white font-700 shadow-soft'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {p === '30' ? '30 Days' : p === '90' ? '90 Days' : p === '180' ? '6 Months' : '1 Year'}
                    </button>
                  ))}
                </div>
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={filteredHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[30, 90]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="overall" stroke="#4f46e5" strokeWidth={3} dot={{ fill: '#4f46e5', r: 4 }} name="Overall Score" />
                  <Line type="monotone" dataKey="language" stroke="#9372f5" strokeWidth={1.5} dot={false} name="Language" />
                  <Line type="monotone" dataKey="memory" stroke="#3b9fff" strokeWidth={1.5} dot={false} name="Memory" />
                </LineChart>
              </ResponsiveContainer>

              <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-xs text-indigo-900 mt-3">
                <strong>Cognitive Trend Note:</strong> Index shows gradual positive stabilization for {patient.name} over the evaluated timeframe.
              </div>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="card bg-white p-6 border border-gray-200 shadow-soft">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h3 className="text-lg font-display font-700 text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Recent Cognitive Activity Sessions
              </h3>
              <span className="text-xs text-gray-500">Activity Log</span>
            </div>

            <div className="space-y-3">
              {recentActivities.map(act => (
                <div key={act.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-700 text-gray-900">{act.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{act.date} · {act.duration}</div>
                  </div>
                  <span className={`badge text-xs font-700 ${
                    act.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {act.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 3: ASSESSMENTS & DOCTOR CLINICAL NOTES ==================== */}
      {activeTab === 'clinical' && (
        <div className="space-y-6">
          {/* Assessments Timeline List */}
          <div className="card bg-white p-6 border border-gray-200 shadow-soft">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-display font-700 text-gray-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-indigo-600" />
                  Assessments Timeline ({activePatientReports.length})
                </h3>
                <p className="text-xs text-gray-500">Formal clinical cognitive evaluation history</p>
              </div>
              <button
                onClick={() => navigate('assessment')}
                className="btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-xl font-700 shadow-soft flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Start New Assessment
              </button>
            </div>

            <div className="space-y-3">
              {activePatientReports.length === 0 ? (
                <div className="p-6 bg-gray-50 text-center text-xs text-gray-500 rounded-2xl">
                  No formal assessment reports found for {patient.name}.
                </div>
              ) : (
                activePatientReports.map(rep => (
                  <div key={rep.id} className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100 flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="text-sm font-700 text-indigo-950">{rep.type}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Date: {rep.date} · Evaluator: {rep.evaluator}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge bg-indigo-100 text-indigo-800 text-xs font-600">
                        Score: {rep.overallScore}%
                      </span>
                      <button
                        onClick={() => navigate('doctor-reports')}
                        className="btn bg-white hover:bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-xl font-700 border border-indigo-200"
                      >
                        View Full Report
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Clinical Doctor Notes Module */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form to Add Doctor Note */}
            <div className="card lg:col-span-1 border-2 border-indigo-100 bg-white shadow-soft">
              <h3 className="text-lg font-display font-700 text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" /> Add Clinical Note
              </h3>

              <form onSubmit={handleAddDoctorNoteSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-600 text-gray-600 mb-1">Category</label>
                  <select
                    value={noteCategory}
                    onChange={e => setNoteCategory(e.target.value as DoctorNote['category'])}
                    className="input-field text-xs font-600"
                  >
                    <option value="clinical">Clinical Observation</option>
                    <option value="recommendation">Therapeutic Recommendation</option>
                    <option value="assessment_review">Assessment Review</option>
                    <option value="medication_note">Routine / Medication Note</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-600 text-gray-600 mb-1">Observation Note</label>
                  <textarea
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    placeholder="Enter clinical progress observations or adaptive level adjustments..."
                    className="input-field text-xs resize-none"
                    rows={4}
                    required
                  />
                </div>

                <button type="submit" className="w-full btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2.5 font-700 shadow-soft flex items-center justify-center gap-1.5">
                  <Plus className="w-4 h-4" /> Save Clinical Note
                </button>
              </form>
            </div>

            {/* Existing Doctor Notes History */}
            <div className="card lg:col-span-2 bg-white border border-gray-200 shadow-soft">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <h3 className="text-lg font-display font-700 text-gray-900">Doctor Notes History — {patient.name}</h3>
                <span className="text-xs text-gray-400 font-600">{activePatientNotes.length} Notes</span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {activePatientNotes.length === 0 ? (
                  <div className="p-6 bg-gray-50 text-center text-xs text-gray-500 rounded-2xl">
                    No clinical doctor notes recorded yet for this patient.
                  </div>
                ) : (
                  activePatientNotes.map(n => (
                    <div key={n.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-gray-500 mb-1">
                        <span className="font-700 text-indigo-900 uppercase tracking-wider bg-indigo-100 px-2 py-0.5 rounded-full text-[10px]">
                          {n.category.replace('_', ' ')}
                        </span>
                        <span className="font-600">{n.date} · {n.doctorName}</span>
                      </div>
                      <p className="text-gray-800 text-xs leading-relaxed">{n.note}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Patient Daily Logs Timeline */}
          <div className="card bg-white p-6 border border-gray-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-display font-700 text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Daily Progress & Caregiver Updates Timeline ({patientDailyUpdates.length})
              </h2>
              <button
                onClick={() => setIsAddUpdateOpen(true)}
                className="btn bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs px-3.5 py-1.5 rounded-xl font-700 border border-indigo-200 flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> Add Daily Update
              </button>
            </div>

            <div className="space-y-3">
              {patientDailyUpdates.map((update) => (
                <div key={update.id} className="p-4 rounded-2xl border border-gray-200 bg-white text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                    <span className="font-700 text-indigo-900">📅 {update.date} · {update.author}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-700 text-[10px] capitalize ${
                      update.mood === 'excellent' ? 'bg-emerald-100 text-emerald-800' :
                      update.mood === 'good' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {update.mood}
                    </span>
                  </div>
                  <p className="text-gray-800 text-xs leading-relaxed">{update.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 4: PATIENT DIRECTORY GRID ==================== */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          <div className="card bg-white p-6 border border-gray-200 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-display font-800 text-gray-900">Patient Directory</h1>
                <p className="text-xs text-gray-500">Clinical Directory & Patient Daily Status Overview</p>
              </div>

              {userRole === 'doctor' && (
                <button
                  onClick={() => {
                    setActiveTab('clinical');
                    setIsAddUpdateOpen(true);
                  }}
                  className="btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2.5 rounded-xl font-700 shadow-soft flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Record Patient Daily Update
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Bar */}
              <div className="relative md:col-span-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by Name, ID, Caregiver..."
                  className="input-field pl-9 text-xs font-600"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="input-field text-xs font-600"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Monitoring</option>
                  <option value="monitoring">Stable Monitoring</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="input-field text-xs font-600"
                >
                  <option value="name">Sort by Name (A-Z)</option>
                  <option value="id">Sort by Patient ID</option>
                  <option value="age">Sort by Age</option>
                </select>
              </div>
            </div>
          </div>

          {/* Directory Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredPatients.map(p => {
              const latestUpdate = getLatestUpdateForPatient(p.id);
              const isSelected = p.id === activePatientId;

              return (
                <div
                  key={p.id}
                  className={`card p-5 bg-white border-2 transition-all hover:shadow-medium flex flex-col justify-between ${
                    isSelected ? 'border-indigo-500 bg-indigo-50/20 ring-1 ring-indigo-200' : 'border-gray-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start gap-4 mb-3">
                      <img
                        src={p.profilePhoto}
                        alt={p.name}
                        className="w-16 h-16 rounded-2xl bg-sky-100 object-cover border-2 border-white shadow-soft"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-display font-800 text-gray-900 truncate">{p.name}</h3>
                        <div className="text-xs text-indigo-700 font-700">ID: {p.id}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Age: {p.age} yrs · {p.gender || 'Male'}</div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600 border-t border-gray-100 pt-3 mb-3">
                      <div>Caregiver: <strong className="text-gray-800">{p.caregiverName}</strong></div>
                      <div>Stage: <strong className="text-indigo-700 capitalize">{p.diagnosisStage} Monitoring</strong></div>
                      <div>Status: <span className="badge bg-green-100 text-green-800 text-[10px]">{p.status || 'Active'}</span></div>
                    </div>

                    {/* LATEST DAILY UPDATE BOX */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-4 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-700 mb-1">
                        <span className="flex items-center gap-1 text-indigo-700">
                          <Activity className="w-3 h-3 text-indigo-600" /> Latest Daily Update
                        </span>
                        <span>{latestUpdate ? latestUpdate.date : 'Recent'}</span>
                      </div>
                      <p className="text-gray-700 text-[11px] leading-snug line-clamp-2">
                        {latestUpdate ? latestUpdate.summary : 'Patient participating in daily cognitive exercises.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        switchPatient(p.id);
                        setActiveTab('profile');
                      }}
                      className={`flex-1 btn text-xs py-2 font-700 rounded-xl ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-soft'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {isSelected ? 'Active Patient ✓' : 'Select Patient'}
                    </button>
                    <button
                      onClick={() => {
                        switchPatient(p.id);
                        setActiveTab('analytics');
                      }}
                      className="btn bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs px-3 py-2 rounded-xl font-700"
                      title="View Cognitive Analytics for this patient"
                    >
                      Analytics
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== ADD DAILY UPDATE MODAL ==================== */}
      {isAddUpdateOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl">
                  📝
                </div>
                <div>
                  <h2 className="text-xl font-display font-800 text-gray-900">Record Daily Patient Update</h2>
                  <p className="text-xs text-gray-500">For {patient.name} ({patient.id})</p>
                </div>
              </div>
              <button onClick={() => setIsAddUpdateOpen(false)} className="text-gray-400 hover:text-gray-600 p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDailyUpdateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-700 text-gray-700 mb-1">Update Date</label>
                  <input
                    type="date"
                    value={updateFormData.date}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, date: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block font-700 text-gray-700 mb-1">Engagement & Mood</label>
                  <select
                    value={updateFormData.mood}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, mood: e.target.value as any })}
                    className="input-field font-700"
                  >
                    <option value="excellent">🌟 Excellent Engagement</option>
                    <option value="good">👍 Stable & Calm</option>
                    <option value="fair">⚠️ Fair / Needs Monitoring</option>
                    <option value="poor">😴 Low / Rest Recommended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-700 text-gray-700 mb-1">Update Category</label>
                <select
                  value={updateFormData.category}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, category: e.target.value as any })}
                  className="input-field"
                >
                  <option value="clinical_progress">Clinical Progress & Cognition</option>
                  <option value="daily_log">Daily Activity & Routine Log</option>
                  <option value="medication_routine">Medication & Health Check</option>
                  <option value="behavioral">Behavioral & Reminiscence Note</option>
                </select>
              </div>

              <div>
                <label className="block font-700 text-gray-700 mb-1">Doctor / Caregiver Daily Observation Note</label>
                <textarea
                  value={updateFormData.summary}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, summary: e.target.value })}
                  placeholder="Record today's cognitive response, engagement, memory retention, or daily notes..."
                  rows={4}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block font-700 text-gray-700 mb-1">Cognitive Activities Completed Today</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={updateFormData.activitiesCount}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, activitiesCount: parseInt(e.target.value) || 0 })}
                  className="input-field"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddUpdateOpen(false)}
                  className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-700 flex items-center gap-2 shadow-soft"
                >
                  <Save className="w-4 h-4" /> Save Daily Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
