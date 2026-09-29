import React, { useState, useRef } from 'react';
import {
  Stethoscope,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Clock,
  Award,
  Users,
  FileText,
  Edit3,
  CheckCircle2,
  ChevronRight,
  X,
  Save,
  Check,
  Camera,
  Upload,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const PRESET_DOCTOR_PHOTOS = [
  {
    id: 'preset-1',
    name: 'Dr. Ananya (Female Neurologist)',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'preset-2',
    name: 'Clinical Specialist',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'preset-3',
    name: 'Consultant Specialist',
    url: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'preset-4',
    name: 'Senior Medical Doctor',
    url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'preset-5',
    name: 'MindBridge Illustrated Avatar',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DrAnanyaVerma&backgroundColor=c0aede',
  },
];

export function DoctorProfile() {
  const { doctor, updateDoctor, allPatients, doctorNotes, assessmentReports, navigate, switchPatient } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: doctor.name,
    title: doctor.title,
    specialty: doctor.specialty,
    hospital: doctor.hospital,
    email: doctor.email,
    medicalLicenseId: doctor.medicalLicenseId || 'DOC-94827 / MCI-2026-9918',
    phone: doctor.phone || '+91 98110 49201',
    department: doctor.department || 'Department of Neurology & Cognitive Sciences',
    consultationHours: doctor.consultationHours || 'Mon - Fri, 09:00 AM - 04:00 PM',
    experienceYears: doctor.experienceYears || 16,
    bio: doctor.bio || 'Lead Cognitive Neurologist specializing in early detection, digital therapeutics, and personalized care planning for dementia patients across North India.',
    avatarUrl: doctor.avatarUrl || PRESET_DOCTOR_PHOTOS[0].url,
  });

  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Doctor profile details updated successfully!');

  // File Upload Handler (Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      alert('Please select a valid image format (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const photoData = event.target.result as string;
        updateDoctor({ avatarUrl: photoData });
        setFormData(prev => ({ ...prev, avatarUrl: photoData }));
        setIsPhotoModalOpen(false);
        setSuccessMessage('Doctor profile picture updated successfully!');
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Select Preset Photo
  const handleSelectPreset = (url: string) => {
    updateDoctor({ avatarUrl: url });
    setFormData(prev => ({ ...prev, avatarUrl: url }));
    setIsPhotoModalOpen(false);
    setSuccessMessage('Doctor profile picture updated!');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Custom Photo URL Submit
  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhotoUrl.trim()) return;
    updateDoctor({ avatarUrl: customPhotoUrl.trim() });
    setFormData(prev => ({ ...prev, avatarUrl: customPhotoUrl.trim() }));
    setCustomPhotoUrl('');
    setIsPhotoModalOpen(false);
    setSuccessMessage('Profile picture updated via URL!');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Full Form Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDoctor(formData);
    setIsEditing(false);
    setSuccessMessage('Doctor profile details updated successfully!');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const assignedPatientsList = allPatients.filter(p => doctor.assignedPatients.includes(p.id)) || allPatients;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Hidden File Input for Direct Trigger */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />

      {/* 1. SUCCESS NOTIFICATION */}
      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center justify-between shadow-soft animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-700">{successMessage}</span>
          </div>
          <button onClick={() => setSavedSuccess(false)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. DOCTOR HERO HEADER CARD */}
      <div className="card bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-strong relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Avatar / Photo with Hover Camera Edit Overlay */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className="relative group cursor-pointer"
              onClick={() => setIsPhotoModalOpen(true)}
              title="Click to change profile picture"
            >
              <img
                src={doctor.avatarUrl || PRESET_DOCTOR_PHOTOS[0].url}
                alt={doctor.name}
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-indigo-400/40 shadow-medium transition-all group-hover:scale-[1.02] group-hover:border-white/80"
              />
              {/* Hover Camera Overlay */}
              <div className="absolute inset-0 rounded-3xl bg-indigo-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1.5 p-2 text-center backdrop-blur-[2px]">
                <Camera className="w-7 h-7 text-indigo-200" />
                <span className="text-xs font-700">Change Photo</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-soft border-2 border-indigo-900" title="Medical Registration Verified">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            {/* Direct Quick Action Button */}
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="mt-3 text-xs font-700 text-indigo-200 hover:text-white bg-indigo-800/80 hover:bg-indigo-700/80 border border-indigo-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-soft"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-300" />
              Edit Profile Picture
            </button>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 rounded-full text-xs font-700 uppercase tracking-wider">
                👨‍⚕️ Clinical Specialist Profile
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Verified Medical License
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-800 tracking-tight text-white">
              {doctor.name}
            </h1>
            <p className="text-indigo-200 font-600 text-base">
              {doctor.title}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-indigo-200/90 pt-1">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-400" />
                {doctor.hospital}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Award className="w-4 h-4 text-amber-400" />
                Lic: {doctor.medicalLicenseId || 'DOC-94827'}
              </span>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-auto flex-shrink-0 pt-2 md:pt-0">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 md:flex-initial btn bg-white hover:bg-indigo-50 text-indigo-900 text-xs px-5 py-3 rounded-2xl font-700 shadow-soft flex items-center justify-center gap-2 transition-all"
            >
              <Edit3 className="w-4 h-4 text-indigo-600" />
              Edit Profile
            </button>
            <button
              onClick={() => navigate('doctor-reports')}
              className="flex-1 md:flex-initial btn bg-indigo-600/60 hover:bg-indigo-600 text-white text-xs px-5 py-3 rounded-2xl font-700 border border-indigo-400/30 shadow-soft flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4" />
              Clinical Reports
            </button>
          </div>
        </div>
      </div>

      {/* 3. QUICK METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white p-5 border border-indigo-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-700 flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-display font-800 text-gray-900">{assignedPatientsList.length}</div>
            <div className="text-xs font-600 text-gray-500">Active Patients</div>
          </div>
        </div>

        <div className="card bg-white p-5 border border-sky-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl font-700 flex-shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-display font-800 text-gray-900">48</div>
            <div className="text-xs font-600 text-gray-500">Assessments Done</div>
          </div>
        </div>

        <div className="card bg-white p-5 border border-purple-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-700 flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-display font-800 text-gray-900">{assessmentReports.length || 14}</div>
            <div className="text-xs font-600 text-gray-500">Clinical Reports</div>
          </div>
        </div>

        <div className="card bg-white p-5 border border-emerald-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-700 flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-display font-800 text-gray-900">{doctor.experienceYears || 16}+ Yrs</div>
            <div className="text-xs font-600 text-gray-500">Clinical Practice</div>
          </div>
        </div>
      </div>

      {/* 4. DOCTOR CREDENTIALS & CLINIC DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Doctor & Clinical Focus */}
          <div className="card bg-white p-6 border border-gray-100 shadow-soft">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <Stethoscope className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-display font-700 text-gray-900">Clinical Background & Bio</h2>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-6">
              {doctor.bio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                <div className="text-xs font-700 text-indigo-900 uppercase tracking-wider mb-1">Primary Specialty</div>
                <div className="text-sm font-700 text-indigo-700">{doctor.specialty}</div>
              </div>

              <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100">
                <div className="text-xs font-700 text-sky-900 uppercase tracking-wider mb-1">Department</div>
                <div className="text-sm font-700 text-sky-700">{doctor.department}</div>
              </div>
            </div>
          </div>

          {/* Assigned Patients Directory */}
          <div className="card bg-white p-6 border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-display font-700 text-gray-900">Patients Under Direct Care ({assignedPatientsList.length})</h2>
              </div>
              <button onClick={() => navigate('profile')} className="text-xs font-700 text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                View Patient Directory <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assignedPatientsList.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex items-center justify-between group cursor-pointer"
                  onClick={() => {
                    switchPatient(p.id);
                    navigate('profile');
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img src={p.profilePhoto} alt={p.name} className="w-11 h-11 rounded-2xl bg-sky-100 object-cover" />
                    <div>
                      <div className="font-700 text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{p.name}</div>
                      <div className="text-xs text-gray-500 font-600">Stage: <span className="capitalize text-indigo-700">{p.diagnosisStage}</span></div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>

          {/* Doctor's Notes Recorded */}
          <div className="card bg-white p-6 border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-display font-700 text-gray-900">Recent Doctor Notes ({doctorNotes.length})</h2>
              </div>
            </div>

            <div className="space-y-3">
              {doctorNotes.slice(0, 3).map((note) => (
                <div key={note.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-700 text-indigo-900 uppercase tracking-wider bg-indigo-100 px-2 py-0.5 rounded-full">
                      {note.category.replace('_', ' ')}
                    </span>
                    <span className="text-gray-500 font-600">{note.date}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{note.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contact & License Info */}
        <div className="space-y-6">
          <div className="card bg-white p-6 border border-gray-100 shadow-soft space-y-4">
            <h3 className="text-base font-display font-700 text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Licensing & Clinic Info
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <Award className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-700 text-gray-500">Medical Registration ID</div>
                  <div className="font-mono font-700 text-gray-900 text-sm">{doctor.medicalLicenseId}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-700 text-gray-500">Affiliated Hospital</div>
                  <div className="font-700 text-gray-900 text-sm">{doctor.hospital}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-700 text-gray-500">Consultation Hours</div>
                  <div className="font-700 text-gray-900 text-sm">{doctor.consultationHours}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-700 text-gray-500">Clinical Email</div>
                  <div className="font-700 text-gray-900 text-sm">{doctor.email}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-700 text-gray-500">Clinic Direct Line</div>
                  <div className="font-700 text-gray-900 text-sm">{doctor.phone}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <button
                onClick={() => setIsPhotoModalOpen(true)}
                className="w-full btn bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs py-2.5 rounded-xl font-700 flex items-center justify-center gap-1.5"
              >
                <Camera className="w-4 h-4 text-indigo-600" /> Change Profile Picture
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full btn bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs py-2.5 rounded-xl font-700 flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" /> Edit Doctor Details
              </button>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-indigo-50 to-sky-50 rounded-3xl border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 font-700 text-sm">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Clinical Portal Permissions
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Dr. Ananya Verma has Level-3 Clinical Master permissions to manage cognitive assessments, export reports, and direct patient interventions.
            </p>
          </div>
        </div>
      </div>

      {/* 5. CHANGE DOCTOR PROFILE PICTURE MODAL */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl">
                  📸
                </div>
                <div>
                  <h2 className="text-xl font-display font-800 text-gray-900">Edit Doctor Profile Picture</h2>
                  <p className="text-xs text-gray-500">Upload a new photo or select a clinical avatar</p>
                </div>
              </div>
              <button onClick={() => setIsPhotoModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Active Preview */}
            <div className="flex flex-col items-center justify-center p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100">
              <img
                src={doctor.avatarUrl || PRESET_DOCTOR_PHOTOS[0].url}
                alt="Current Doctor Avatar"
                className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-medium mb-2"
              />
              <div className="text-xs font-700 text-indigo-900">Active Profile Photo</div>
            </div>

            {/* Method 1: Upload File */}
            <div className="space-y-2">
              <label className="block text-xs font-700 text-gray-700 uppercase tracking-wider">Option 1: Upload Photo File</label>
              <input
                type="file"
                ref={modalFileInputRef}
                onChange={handleFileUpload}
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => modalFileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50 p-4 rounded-2xl transition-all flex flex-col items-center justify-center gap-2 text-indigo-700 group"
              >
                <Upload className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-700">Choose Image File from Computer</span>
                <span className="text-[11px] text-gray-500 font-600">Supports JPG, PNG, or WEBP images</span>
              </button>
            </div>

            {/* Method 2: Select Preset Clinical Avatars */}
            <div className="space-y-3">
              <label className="block text-xs font-700 text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Option 2: Select Preset Medical Avatar
              </label>
              <div className="grid grid-cols-5 gap-3">
                {PRESET_DOCTOR_PHOTOS.map((preset) => {
                  const isSelected = doctor.avatarUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all p-1 group ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-300 scale-105 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                      title={preset.name}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-16 object-cover rounded-xl"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5 shadow-sm">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Method 3: Custom Web Image URL */}
            <form onSubmit={handleCustomUrlSubmit} className="space-y-2 pt-2 border-t border-gray-100">
              <label className="block text-xs font-700 text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-indigo-600" /> Option 3: Paste Custom Image Link (URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  placeholder="https://example.com/doctor-photo.jpg"
                  className="input-field text-xs flex-1"
                />
                <button
                  type="submit"
                  disabled={!customPhotoUrl.trim()}
                  className="btn bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs px-4 rounded-xl font-700 flex items-center gap-1"
                >
                  Apply URL
                </button>
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-4 py-2.5 rounded-xl font-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. EDIT DOCTOR PROFILE DETAILS MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl">
                  👨‍⚕️
                </div>
                <div>
                  <h2 className="text-xl font-display font-800 text-gray-900">Edit Doctor Profile</h2>
                  <p className="text-xs text-gray-500">Update Dr. Ananya Verma's clinical credentials & photo</p>
                </div>
              </div>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Photo selector inside Edit Details Modal */}
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={formData.avatarUrl || PRESET_DOCTOR_PHOTOS[0].url}
                    alt="Doctor Avatar"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-soft"
                  />
                  <div>
                    <div className="font-700 text-gray-900 text-sm">Doctor Profile Picture</div>
                    <div className="text-gray-500 text-[11px]">JPG, PNG or WEBP format</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-2 rounded-xl font-700 flex items-center gap-1.5 shadow-soft cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Photo File
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="btn bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs px-3 py-2 rounded-xl font-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-indigo-600" /> Presets / URL
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-700 text-gray-700 mb-1">Doctor Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block font-700 text-gray-700 mb-1">Medical License ID</label>
                  <input
                    type="text"
                    value={formData.medicalLicenseId}
                    onChange={(e) => setFormData({ ...formData, medicalLicenseId: e.target.value })}
                    className="input-field font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-700 text-gray-700 mb-1">Title & Role</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-700 text-gray-700 mb-1">Specialty</label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block font-700 text-gray-700 mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-700 text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block font-700 text-gray-700 mb-1">Phone Line</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-700 text-gray-700 mb-1">Consultation Hours</label>
                  <input
                    type="text"
                    value={formData.consultationHours}
                    onChange={(e) => setFormData({ ...formData, consultationHours: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block font-700 text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block font-700 text-gray-700 mb-1">Clinical Bio & Overview</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-700 text-gray-700 mb-1">Direct Profile Photo URL</label>
                <input
                  type="url"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-700 flex items-center gap-2 shadow-soft"
                >
                  <Save className="w-4 h-4" /> Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
