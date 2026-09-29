import React, { useState, useRef } from 'react';
import {
  Stethoscope, Activity, FileText, Plus, CheckCircle, TrendingUp, AlertTriangle, Search,
  Camera, Printer, X, Brain, UserPlus, CheckCircle2
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { useApp } from '../context/AppContext';
import { patientCognitiveHistories } from '../data/demoData';
import type { DoctorNote } from '../types';
import { AddPatientModal } from '../components/AddPatientModal';

export function DoctorDashboard() {
  const {
    doctor,
    allPatients,
    activePatientId,
    switchPatient,
    patient,
    updatePatientPhoto,
    removePatientPhoto,
    cognitiveProfile,
    sessions,
    doctorNotes,
    addDoctorNote,
    assessmentReports,
    navigate,
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [timePeriod, setTimePeriod] = useState<'30' | '90' | '180' | '365'>('180');

  // Doctor Note state
  const [noteCategory, setNoteCategory] = useState<DoctorNote['category']>('clinical');
  const [newNoteText, setNewNoteText] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // PDF Preview Modal state
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Add Patient Modal state
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [addPatientSuccess, setAddPatientSuccess] = useState<{ name: string; id: string } | null>(null);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filtered patients for search
  const assignedPatients = allPatients.filter(p =>
    !doctor.assignedPatients || doctor.assignedPatients.length === 0 || doctor.assignedPatients.includes(p.id)
  );

  const searchedPatients = assignedPatients.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.caregiverName.toLowerCase().includes(q) ||
      (p.phoneNumber && p.phoneNumber.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q))
    );
  });

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
      }
    };
    reader.readAsDataURL(file);
  };

  // Active patient notes & reports
  const activePatientNotes = doctorNotes.filter(n => n.patientId === patient.id);
  const activePatientReports = assessmentReports.filter(r => r.patientId === patient.id);
  const latestReport = activePatientReports[0] || assessmentReports[0];

  // Radar Data
  const radarData = [
    { domain: 'Memory', value: cognitiveProfile.memory, fullMark: 100 },
    { domain: 'Attention', value: cognitiveProfile.attention, fullMark: 100 },
    { domain: 'Language', value: cognitiveProfile.language, fullMark: 100 },
    { domain: 'Executive', value: cognitiveProfile.executiveFunction, fullMark: 100 },
    { domain: 'Visuospatial', value: cognitiveProfile.visuospatial, fullMark: 100 },
    { domain: 'Processing', value: cognitiveProfile.processingSpeed, fullMark: 100 },
  ];

  // Cognitive History Data for Chart
  const fullHistory = patientCognitiveHistories[patient.id] || patientCognitiveHistories['patient-001'];
  const getFilteredHistory = () => {
    if (timePeriod === '30') return fullHistory.slice(-2);
    if (timePeriod === '90') return fullHistory.slice(-3);
    return fullHistory;
  };
  const filteredHistory = getFilteredHistory();

  // Handle Note Submission
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addDoctorNote({
      patientId: patient.id,
      doctorName: doctor.name,
      note: newNoteText,
      category: noteCategory,
    });
    setNewNoteText('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Activities list for selected patient
  const recentActivities = [
    { id: 'act-1', name: 'Memory Match', status: 'Completed', date: '25 Sep 2026, 09:30 AM', duration: '12 min' },
    { id: 'act-2', name: 'Virtual Market Shopping', status: 'Completed', date: '24 Sep 2026, 02:00 PM', duration: '18 min' },
    { id: 'act-3', name: 'Story Completion', status: 'Completed', date: '23 Sep 2026, 11:00 AM', duration: '15 min' },
    { id: 'act-4', name: 'Attention Focus Activity', status: 'Pending', date: 'Scheduled Today, 05:00 PM', duration: '10 min' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-sky-50 to-indigo-50/90 rounded-3xl p-6 text-gray-900 shadow-soft relative overflow-hidden border border-indigo-100">
        <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div
            onClick={() => navigate('doctor-profile')}
            className="flex items-center gap-3 cursor-pointer group"
            title="Click to view Dr. Ananya Verma's full doctor profile"
          >
            <div className="w-11 h-11 rounded-2xl bg-indigo-100/80 border border-indigo-200 flex items-center justify-center text-xl text-indigo-700 shadow-soft group-hover:scale-105 transition-transform">
              👨‍⚕️
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-700 uppercase tracking-wider text-indigo-700">Doctor Portal</span>
                <span className="text-[11px] bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full border border-indigo-200 font-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  Doctor Profile →
                </span>
              </div>
              <h1 className="text-xl font-display font-800 text-gray-900 group-hover:text-indigo-700 transition-colors">{doctor.name}</h1>
              <p className="text-xs text-gray-600 font-600">{doctor.title} · {doctor.hospital}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* + Add Patient - Primary CTA */}
            <button
              onClick={() => setShowAddPatient(true)}
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2.5 rounded-2xl font-700 shadow-soft flex items-center gap-1.5 border border-emerald-700"
            >
              <UserPlus className="w-4 h-4" />
              + Add Patient
            </button>
            <button
              onClick={() => setShowPdfModal(true)}
              className="btn bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs px-4 py-2.5 rounded-2xl font-700 shadow-soft flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-indigo-600" />
              Preview PDF Report
            </button>
            <button
              onClick={() => navigate('doctor-reports')}
              className="btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2.5 rounded-2xl font-700 shadow-soft flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              Clinical Reports
            </button>
            <button
              onClick={() => navigate('assessment')}
              className="btn bg-white hover:bg-gray-50 text-gray-700 text-xs px-4 py-2.5 rounded-2xl font-700 border border-gray-200 shadow-soft flex items-center gap-1.5"
            >
              <Stethoscope className="w-4 h-4 text-indigo-600" />
              New Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Success banner after adding patient */}
      {addPatientSuccess && (
        <div className="flex items-center justify-between gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-700 text-emerald-900">
                Patient created successfully!
              </p>
              <p className="text-xs text-emerald-700">
                <strong>{addPatientSuccess.name}</strong> (ID: {addPatientSuccess.id}) has been added to your patient directory and can now log in.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAddPatientSuccess(null)}
            className="text-emerald-500 hover:text-emerald-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. PATIENT SEARCH / SELECTION */}
      <div className="card bg-white p-5 border border-indigo-100 shadow-soft relative z-30">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-700 text-indigo-900 uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-600" />
            Patient Search & Selection
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Assigned: <strong className="text-indigo-700 font-700">{assignedPatients.length}</strong>
            </span>
            <button
              onClick={() => setShowAddPatient(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-700 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              + Add Patient
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="🔍 Search patient by name, Patient ID, phone number or caregiver name..."
              className="w-full bg-slate-50 border-2 border-indigo-100 focus:border-indigo-500 focus:bg-white rounded-2xl pl-12 pr-10 py-3 text-sm font-600 text-gray-800 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchFocused(false);
                }}
                className="absolute right-3 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearchFocused && searchQuery.trim() !== '' && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-indigo-200 shadow-2xl overflow-hidden z-50 animate-fade-in max-h-80 overflow-y-auto">
              <div className="px-4 py-2.5 bg-indigo-50/70 border-b border-indigo-100 text-xs font-700 text-indigo-900 flex justify-between">
                <span>Matching Patients ({searchedPatients.length})</span>
                <button
                  onClick={() => setIsSearchFocused(false)}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Close
                </button>
              </div>

              {searchedPatients.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500 font-600">
                  No patient found matching "{searchQuery}"
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {searchedPatients.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        switchPatient(p.id);
                        setSearchQuery('');
                        setIsSearchFocused(false);
                      }}
                      className={`w-full text-left p-4 hover:bg-indigo-50/80 transition-colors flex items-center justify-between ${
                        p.id === activePatientId ? 'bg-indigo-50/60 font-700' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.profilePhoto}
                          alt={p.name}
                          className="w-10 h-10 rounded-full bg-sky-100 border border-white shadow-soft object-cover"
                        />
                        <div>
                          <div className="text-sm font-700 text-gray-900 flex items-center gap-2">
                            {p.name}
                            <span className="badge bg-indigo-100 text-indigo-800 text-[10px] font-600">
                              ID: {p.id}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Age: {p.age} yrs · Caregiver: <strong className="text-gray-700">{p.caregiverName}</strong>
                            {p.phoneNumber && ` · ${p.phoneNumber}`}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="badge bg-green-100 text-green-800 text-xs font-600 capitalize">
                          {p.status || 'Active'}
                        </span>
                        <div className="text-[11px] text-indigo-600 font-600 mt-1">Select Patient →</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. PATIENT SELECTOR & PROFILE SUMMARY HEADER CARD */}
      <div className="card bg-white p-6 border-2 border-indigo-100 shadow-soft">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Patient Photo & Controls */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="relative group">
              <img
                src={patient.profilePhoto}
                alt={patient.name}
                className="w-28 h-28 rounded-3xl object-cover bg-sky-100 border-4 border-white shadow-medium transition-transform group-hover:scale-105"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-medium transition-colors"
                title="Upload/Change Photo"
                aria-label="Upload photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
            />

            {/* Photo Action Buttons */}
            <div className="flex items-center gap-1.5 mt-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-ghost text-xs py-1 px-2.5 text-indigo-700 hover:bg-indigo-50 font-600 border border-indigo-200 rounded-xl"
              >
                Upload Photo
              </button>
              <button
                onClick={() => removePatientPhoto(patient.id)}
                className="btn-ghost text-xs py-1 px-2 text-rose-600 hover:bg-rose-50 font-600 rounded-xl"
                title="Remove photo"
              >
                Remove
              </button>
            </div>
          </div>

          {/* Patient Info Fields */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
              <h2 className="text-2xl font-display font-800 text-gray-900">{patient.name}</h2>
              <span className="badge bg-indigo-100 text-indigo-800 text-xs font-700">
                Patient ID: {patient.id}
              </span>
              <span className="badge bg-green-100 text-green-800 text-xs font-700">
                Status: {patient.status || 'Active'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-gray-100">
              <div>
                <span className="text-gray-400 font-600 block">Age / Gender</span>
                <strong className="text-gray-800 font-700 text-sm">{patient.age} years · {patient.gender || 'Male'}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-600 block">Primary Caregiver</span>
                <strong className="text-gray-800 font-700 text-sm">{patient.caregiverName}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-600 block">Diagnosis Stage</span>
                <strong className="text-indigo-700 font-700 text-sm capitalize">{patient.diagnosisStage} Monitoring</strong>
              </div>
              <div>
                <span className="text-gray-400 font-600 block">Preferred Language</span>
                <strong className="text-gray-800 font-700 text-sm">
                  {patient.language === 'hi' ? '🇮🇳 Hindi' : patient.language === 'as' ? '🇮🇳 Assamese' : patient.language === 'mr' ? '🇮🇳 Marathi' : '🇬🇧 English'}
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
              <div className="text-xs text-gray-500">
                Attending Specialist: <strong className="text-gray-800">{patient.doctorName || doctor.name}</strong> · Joined: {patient.joinedDate}
              </div>

              <button
                onClick={() => navigate('profile')}
                className="btn bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-700 px-4 py-2 rounded-xl flex items-center gap-1"
              >
                View Full Patient Profile →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. KEY PATIENT INDICATOR CARDS */}
      <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
          {/* Card 1: Overall Cognitive Indicator */}
          <div className="card p-5 bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200">
            <span className="text-xs text-indigo-700 font-700 uppercase tracking-wider">1. Overall Cognitive Performance</span>
            <div className="text-3xl font-display font-800 text-indigo-900 mt-2">{cognitiveProfile.overallScore}%</div>
            <div className="text-xs text-indigo-600 font-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Trend: <span className="capitalize">{cognitiveProfile.trend}</span>
            </div>
          </div>

          {/* Card 2: Completed Sessions */}
          <div className="card p-5 bg-gradient-to-br from-sky-50 to-sky-100/50 border border-sky-200">
            <span className="text-xs text-sky-700 font-700 uppercase tracking-wider">2. Completed Sessions</span>
            <div className="text-3xl font-display font-800 text-sky-900 mt-2">{sessions.length} Sessions</div>
            <div className="text-xs text-sky-600 font-600 mt-1">High engagement rating</div>
          </div>

          {/* Card 3: Current Adaptive Level */}
          <div className="card p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200">
            <span className="text-xs text-purple-700 font-700 uppercase tracking-wider">3. Adaptive Activity Level</span>
            <div className="text-3xl font-display font-800 text-purple-900 mt-2">Level 2</div>
            <div className="text-xs text-purple-600 font-600 mt-1">Auto-tuned difficulty</div>
          </div>

          {/* Card 4: Last Assessment */}
          <div className="card p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200">
            <span className="text-xs text-emerald-700 font-700 uppercase tracking-wider">4. Last Assessment</span>
            <div className="text-xl font-display font-800 text-emerald-900 mt-2">{latestReport ? latestReport.date : '20 Sep 2026'}</div>
            <div className="text-xs text-emerald-600 font-600 mt-1 truncate">{latestReport ? latestReport.type : 'Periodic Assessment'}</div>
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs leading-relaxed flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div>
            <strong>Supportive Cognitive Performance Indicators:</strong> Prototype values reflect activity engagement and do NOT constitute formal medical diagnoses.
          </div>
        </div>
      </div>

      {/* 5. COGNITIVE ANALYTICS (RADAR & LONGITUDINAL TREND) */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Profile */}
        <div className="card bg-white p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-display font-700 text-gray-900">Cognitive Domain Radar</h3>
              <p className="text-xs text-gray-500">6-Domain Performance Overview for {patient.name}</p>
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

          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="p-2 bg-sky-50/70 rounded-xl border border-sky-100">
              <span className="text-[11px] text-gray-500 font-600 block">Memory</span>
              <strong className="text-sm font-700 text-sky-700">{cognitiveProfile.memory}%</strong>
            </div>
            <div className="p-2 bg-amber-50/70 rounded-xl border border-amber-100">
              <span className="text-[11px] text-gray-500 font-600 block">Attention</span>
              <strong className="text-sm font-700 text-amber-700">{cognitiveProfile.attention}%</strong>
            </div>
            <div className="p-2 bg-purple-50/70 rounded-xl border border-purple-100">
              <span className="text-[11px] text-gray-500 font-600 block">Language</span>
              <strong className="text-sm font-700 text-purple-700">{cognitiveProfile.language}%</strong>
            </div>
            <div className="p-2 bg-emerald-50/70 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-gray-500 font-600 block">Executive</span>
              <strong className="text-sm font-700 text-emerald-700">{cognitiveProfile.executiveFunction}%</strong>
            </div>
            <div className="p-2 bg-rose-50/70 rounded-xl border border-rose-100">
              <span className="text-[11px] text-gray-500 font-600 block">Visuospatial</span>
              <strong className="text-sm font-700 text-rose-700">{cognitiveProfile.visuospatial}%</strong>
            </div>
            <div className="p-2 bg-indigo-50/70 rounded-xl border border-indigo-100">
              <span className="text-[11px] text-gray-500 font-600 block">Processing</span>
              <strong className="text-sm font-700 text-indigo-700">{cognitiveProfile.processingSpeed}%</strong>
            </div>
          </div>
        </div>

        {/* Longitudinal History Line Chart */}
        <div className="card bg-white p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-display font-700 text-gray-900">Cognitive History</h3>
              <p className="text-xs text-gray-500">Longitudinal Performance Trend</p>
            </div>

            {/* Time Period Filter */}
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

      {/* 6. RECENT ASSESSMENTS & RECENT ACTIVITY */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity List */}
        <div className="card bg-white p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-700 text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Recent Activity
            </h3>
            <span className="text-xs text-gray-400">Activity Info</span>
          </div>

          <div className="space-y-3">
            {recentActivities.map(act => (
              <div key={act.id} className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between">
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

        {/* Assessments Timeline List */}
        <div className="card bg-white p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-700 text-gray-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-indigo-600" />
              Assessments Timeline
            </h3>
            <button
              onClick={() => navigate('assessment')}
              className="text-xs text-indigo-600 font-700 hover:underline"
            >
              Start New +
            </button>
          </div>

          <div className="space-y-3">
            {activePatientReports.length === 0 ? (
              <div className="p-4 bg-gray-50 text-center text-xs text-gray-500 rounded-2xl">
                No formal reports found for this patient.
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
                      View Report
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 7. CLINICAL REPORTS & DOCTOR NOTES MODULE */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form to Add Doctor Note */}
        <div className="card lg:col-span-1 border-2 border-indigo-100 bg-white">
          <h3 className="text-lg font-display font-700 text-gray-900 mb-3">Add Clinical Note</h3>

          {savedSuccess && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" /> Clinical note saved for {patient.name}!
            </div>
          )}

          <form onSubmit={handleAddNote} className="space-y-3">
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

            <button type="submit" className="w-full btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2.5 font-700 shadow-soft">
              <Plus className="w-4 h-4" />
              Save Clinical Note
            </button>
          </form>
        </div>

        {/* Existing Doctor Notes */}
        <div className="card lg:col-span-2 bg-white border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-700 text-gray-900">Doctor Notes History — {patient.name}</h3>
            <span className="text-xs text-gray-400">{activePatientNotes.length} Notes</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {activePatientNotes.length === 0 ? (
              <p className="text-xs text-gray-500 italic p-4 bg-gray-50 rounded-2xl text-center">
                No clinical notes recorded for {patient.name} yet.
              </p>
            ) : (
              activePatientNotes.map(note => (
                <div key={note.id} className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="badge bg-indigo-100 text-indigo-800 text-xs font-700 capitalize">
                      {note.category.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-gray-400">{note.date} · {note.doctorName}</span>
                  </div>
                  <p className="text-xs text-gray-800 leading-relaxed font-sans">{note.note}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* PDF PREVIEW MODAL */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl relative space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span className="font-display font-700 text-gray-900">Clinical Cognitive Report — PDF Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-xl font-700 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="btn-ghost text-xs text-gray-500 px-3 py-2"
                >
                  Close ✕
                </button>
              </div>
            </div>

            <div className="space-y-6 text-gray-900 font-sans">
              <div className="flex items-start justify-between border-b-2 border-indigo-600 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-indigo-700 font-display font-800 text-xl">
                    <Brain className="w-6 h-6 text-indigo-600" />
                    <span>MINDBRIDGE COGNITIVE CARE</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{doctor.hospital} · Neuro-Cognitive Unit</p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-700 text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-200">
                    Official Clinical Report
                  </span>
                  <p className="text-xs text-gray-400 mt-1">Generated: 25 Sep 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                <img
                  src={patient.profilePhoto}
                  alt={patient.name}
                  className="w-16 h-16 rounded-xl bg-sky-100 object-cover border border-white shadow-soft"
                />
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div>
                    <div>Patient Name: <strong className="text-gray-900">{patient.name}</strong></div>
                    <div>Patient ID: <strong className="text-gray-900">{patient.id}</strong></div>
                    <div>Age / Gender: <strong className="text-gray-900">{patient.age} yrs · {patient.gender || 'Male'}</strong></div>
                  </div>
                  <div>
                    <div>Attending Physician: <strong className="text-gray-900">{doctor.name}</strong></div>
                    <div>Caregiver: <strong className="text-gray-900">{patient.caregiverName}</strong></div>
                    <div>Overall Index: <strong className="text-indigo-700">{cognitiveProfile.overallScore}% ({cognitiveProfile.trend})</strong></div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-700 uppercase tracking-wider text-indigo-900 mb-2 border-b border-gray-200 pb-1">
                  1. Cognitive Domain Performance Summary
                </h4>
                <div className="grid grid-cols-6 gap-2 text-center text-xs">
                  <div className="p-2 border border-gray-200 rounded-lg">
                    <span className="text-gray-500">Memory</span>
                    <div className="font-800 text-sm text-indigo-700">{cognitiveProfile.memory}%</div>
                  </div>
                  <div className="p-2 border border-gray-200 rounded-lg">
                    <span className="text-gray-500">Attention</span>
                    <div className="font-800 text-sm text-sky-700">{cognitiveProfile.attention}%</div>
                  </div>
                  <div className="p-2 border border-gray-200 rounded-lg">
                    <span className="text-gray-500">Language</span>
                    <div className="font-800 text-sm text-purple-700">{cognitiveProfile.language}%</div>
                  </div>
                  <div className="p-2 border border-gray-200 rounded-lg">
                    <span className="text-gray-500">Executive</span>
                    <div className="font-800 text-sm text-emerald-700">{cognitiveProfile.executiveFunction}%</div>
                  </div>
                  <div className="p-2 border border-gray-200 rounded-lg">
                    <span className="text-gray-500">Visuospatial</span>
                    <div className="font-800 text-sm text-rose-700">{cognitiveProfile.visuospatial}%</div>
                  </div>
                  <div className="p-2 border border-gray-200 rounded-lg">
                    <span className="text-gray-500">Processing</span>
                    <div className="font-800 text-sm text-amber-700">{cognitiveProfile.processingSpeed}%</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-700 uppercase tracking-wider text-indigo-900 mb-2 border-b border-gray-200 pb-1">
                  2. Clinical Observations
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {latestReport ? latestReport.clinicalObservations : 'Patient shows stable cognitive engagement over past 90 days.'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs">
                <div>
                  <p className="text-gray-400 text-[10px]">Confidential Medical Report — MindBridge Platform</p>
                  <p className="text-gray-400 text-[10px]">Supportive performance indicator — Not a formal diagnostic conclusion.</p>
                </div>
                <div className="text-right">
                  <div className="h-6 border-b border-gray-400 w-36 mb-1" />
                  <p className="font-700 text-gray-900">{doctor.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddPatient && (
        <AddPatientModal
          onClose={() => setShowAddPatient(false)}
          onSuccess={(name, id) => {
            setShowAddPatient(false);
            setAddPatientSuccess({ name, id });
            // Auto-dismiss after 8 seconds
            setTimeout(() => setAddPatientSuccess(null), 8000);
          }}
        />
      )}
    </div>
  );
}
