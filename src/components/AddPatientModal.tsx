import React, { useState, useRef } from 'react';
import {
  X, User, Mail, Lock, Eye, EyeOff, Phone, Globe, UserPlus,
  CheckCircle2, AlertCircle, Camera, Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { AddPatientInput } from '../context/AppContext';

interface AddPatientModalProps {
  onClose: () => void;
  onSuccess: (patientName: string, patientId: string) => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
];

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

interface FormErrors {
  fullName?: string;
  email?: string;
  pin?: string;
  confirmPin?: string;
  age?: string;
  global?: string;
}

export function AddPatientModal({ onClose, onSuccess }: AddPatientModalProps) {
  const { addPatient, checkEmailAvailable } = useApp();
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverEmail, setCaregiverEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [profilePhotoData, setProfilePhotoData] = useState<string | null>(null);

  // UI state
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(true);

  // ── Photo upload ─────────────────────────────────────────────────────────
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, or WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const dataUrl = ev.target.result as string;
        setProfilePhotoPreview(dataUrl);
        setProfilePhotoData(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Email availability check ──────────────────────────────────────────────
  const handleEmailBlur = () => {
    if (!email.trim()) return;
    const available = checkEmailAvailable(email.trim());
    setEmailAvailable(available);
    setEmailChecked(true);
    if (!available) {
      setErrors((prev) => ({
        ...prev,
        email: 'This email is already registered.',
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    else if (fullName.trim().length < 2) newErrors.fullName = 'Name must be at least 2 characters.';

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    } else if (!emailAvailable) {
      newErrors.email = 'This email is already registered.';
    }

    if (!pin) {
      newErrors.pin = 'PIN is required.';
    } else if (!/^\d{6}$/.test(pin)) {
      newErrors.pin = 'PIN must be exactly 6 digits.';
    }

    if (!confirmPin) {
      newErrors.confirmPin = 'Please confirm the PIN.';
    } else if (pin !== confirmPin) {
      newErrors.confirmPin = 'PINs do not match.';
    }

    const ageNum = parseInt(age, 10);
    if (!age.trim()) {
      newErrors.age = 'Age is required.';
    } else if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      newErrors.age = 'Enter a valid age (1–120).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const input: AddPatientInput = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      pin,
      age: parseInt(age, 10),
      gender: gender || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
      preferredLanguage,
      caregiverName: caregiverName.trim() || undefined,
      caregiverEmail: caregiverEmail.trim() || undefined,
      notes: notes.trim() || undefined,
      profilePhoto: profilePhotoData || undefined,
    };

    // Small artificial delay for UX
    await new Promise((r) => setTimeout(r, 600));

    const error = addPatient(input);
    setIsSubmitting(false);

    if (error) {
      setErrors({ global: error });
      return;
    }

    // Derive the patient ID from the current list
    const storedRaw = localStorage.getItem('mindbridge_patients');
    let newPatientId = 'patient-???';
    if (storedRaw) {
      const list = JSON.parse(storedRaw) as Array<{ id: string; name: string }>;
      const match = list.find(
        (p) => p.name.toLowerCase() === fullName.trim().toLowerCase()
      );
      if (match) newPatientId = match.id;
    }

    onSuccess(fullName.trim(), newPatientId);
  };

  // ── PIN digit input (numbers only) ───────────────────────────────────────
  const handlePinInput = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    field: 'pin' | 'confirmPin'
  ) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setter(digits);
    setErrors((prev) => ({ ...prev, [field]: undefined, global: undefined }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-fade-in"
        style={{ border: '1.5px solid #e0e7ff' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-indigo-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <h2 className="text-xl font-display font-800 text-gray-900">Add New Patient</h2>
              <p className="text-xs text-gray-500 mt-0.5">Create a patient account with login credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Global Error */}
          {errors.global && (
            <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.global}
            </div>
          )}

          {/* Profile Photo (Optional) */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative w-24 h-24 rounded-3xl overflow-hidden bg-indigo-50 border-2 border-dashed border-indigo-200 flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors group"
              onClick={() => photoInputRef.current?.click()}
            >
              {profilePhotoPreview ? (
                <img
                  src={profilePhotoPreview}
                  alt="Patient photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Camera className="w-8 h-8 text-indigo-300 group-hover:text-indigo-500 transition-colors mx-auto" />
                  <span className="text-xs text-indigo-400 mt-1 block">Photo</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="text-xs text-indigo-600 font-600 hover:underline"
            >
              {profilePhotoPreview ? 'Change photo' : 'Upload photo (optional)'}
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          {/* Required Fields */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-px bg-indigo-100" />
              <span className="text-xs font-700 text-indigo-700 uppercase tracking-wider">Required Information</span>
              <div className="flex-1 h-px bg-indigo-100" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-600 text-gray-700 mb-1.5">
                  <User className="w-3.5 h-3.5 inline mr-1.5 text-indigo-500" />
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                  placeholder="e.g. Arjun Sharma"
                  className={`w-full rounded-2xl border-2 px-4 py-3 text-sm font-500 outline-none transition-all ${
                    errors.fullName
                      ? 'border-red-300 bg-red-50 focus:border-red-400'
                      : 'border-gray-200 bg-gray-50 focus:border-indigo-400 focus:bg-white'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-600 text-gray-700 mb-1.5">
                  <Mail className="w-3.5 h-3.5 inline mr-1.5 text-indigo-500" />
                  Patient Email <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-400 font-400 ml-2">(used for login)</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailChecked(false);
                      setEmailAvailable(true);
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    onBlur={handleEmailBlur}
                    placeholder="e.g. arjun@example.com"
                    className={`w-full rounded-2xl border-2 px-4 py-3 text-sm font-500 outline-none transition-all pr-10 ${
                      errors.email
                        ? 'border-red-300 bg-red-50 focus:border-red-400'
                        : emailChecked && emailAvailable
                        ? 'border-green-300 bg-green-50 focus:border-green-400'
                        : 'border-gray-200 bg-gray-50 focus:border-indigo-400 focus:bg-white'
                    }`}
                  />
                  {emailChecked && emailAvailable && email && (
                    <CheckCircle2 className="w-4 h-4 text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                  {emailChecked && !emailAvailable && (
                    <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* PIN */}
              <div>
                <label className="block text-sm font-600 text-gray-700 mb-1.5">
                  <Lock className="w-3.5 h-3.5 inline mr-1.5 text-indigo-500" />
                  Patient PIN <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-400 font-400 ml-2">(6 digits)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => handlePinInput(e.target.value, setPin, 'pin')}
                    placeholder="● ● ● ● ● ●"
                    maxLength={6}
                    inputMode="numeric"
                    className={`w-full rounded-2xl border-2 px-4 py-3 text-sm font-500 outline-none transition-all text-center tracking-widest pr-10 ${
                      errors.pin
                        ? 'border-red-300 bg-red-50 focus:border-red-400'
                        : 'border-gray-200 bg-gray-50 focus:border-indigo-400 focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.pin && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.pin}
                  </p>
                )}
              </div>

              {/* Confirm PIN */}
              <div>
                <label className="block text-sm font-600 text-gray-700 mb-1.5">
                  <Lock className="w-3.5 h-3.5 inline mr-1.5 text-indigo-500" />
                  Confirm PIN <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPin ? 'text' : 'password'}
                    value={confirmPin}
                    onChange={(e) => handlePinInput(e.target.value, setConfirmPin, 'confirmPin')}
                    placeholder="● ● ● ● ● ●"
                    maxLength={6}
                    inputMode="numeric"
                    className={`w-full rounded-2xl border-2 px-4 py-3 text-sm font-500 outline-none transition-all text-center tracking-widest pr-10 ${
                      errors.confirmPin
                        ? 'border-red-300 bg-red-50 focus:border-red-400'
                        : confirmPin && pin === confirmPin
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-gray-50 focus:border-indigo-400 focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPin && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.confirmPin}
                  </p>
                )}
                {confirmPin && pin === confirmPin && !errors.confirmPin && (
                  <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> PINs match
                  </p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-600 text-gray-700 mb-1.5">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setErrors((prev) => ({ ...prev, age: undefined }));
                  }}
                  placeholder="e.g. 72"
                  min={1}
                  max={120}
                  className={`w-full rounded-2xl border-2 px-4 py-3 text-sm font-500 outline-none transition-all ${
                    errors.age
                      ? 'border-red-300 bg-red-50 focus:border-red-400'
                      : 'border-gray-200 bg-gray-50 focus:border-indigo-400 focus:bg-white'
                  }`}
                />
                {errors.age && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.age}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-600 text-gray-700 mb-1.5">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-500 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                >
                  <option value="">Select gender (optional)</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs font-700 text-gray-400 uppercase tracking-wider">Optional Information</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div>
                <label className="block text-sm font-600 text-gray-700 mb-1.5">
                  <Phone className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-500 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                />
              </div>

              {/* Preferred Language */}
              <div>
                <label className="block text-sm font-600 text-gray-700 mb-1.5">
                  <Globe className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                  Preferred Language
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-500 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Caregiver Name */}
              <div>
                <label className="block text-sm font-600 text-gray-700 mb-1.5">
                  <User className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                  Caregiver Name
                </label>
                <input
                  type="text"
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-500 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                />
              </div>

              {/* Caregiver Email */}
              <div>
                <label className="block text-sm font-600 text-gray-700 mb-1.5">
                  <Mail className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                  Caregiver Email
                </label>
                <input
                  type="email"
                  value={caregiverEmail}
                  onChange={(e) => setCaregiverEmail(e.target.value)}
                  placeholder="caregiver@example.com"
                  className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-500 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                />
              </div>

              {/* Notes */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-600 text-gray-700 mb-1.5">Clinical Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Initial observations, diagnosis stage, care preferences..."
                  rows={3}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-500 outline-none focus:border-indigo-400 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* PIN Security note */}
          <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-800 leading-relaxed">
              <strong>Security:</strong> The patient's PIN is securely hashed before storage and never displayed again. 
              Share the PIN directly with the patient or their caregiver. The patient will use their 
              <strong> email + PIN</strong> to log in.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-700 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-700 text-sm shadow-soft transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Patient...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Patient
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
