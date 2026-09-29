import React, { useState } from 'react';
import { Brain, Eye, EyeOff, ArrowRight, Globe, Shield, CheckCircle2, Mail, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supportedLanguages, demoDoctor } from '../data/demoData';
import type { UserRole } from '../types';

export function LoginPage() {
  const { loginAsRole, loginWithCredentials, navigate, setLanguage, language, t } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [medicalId, setMedicalId] = useState('DOC-94827');
  const [doctorLoginMethod, setDoctorLoginMethod] = useState<'email' | 'medicalId'>('email');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState(language || 'hi');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    setPin('');
    if (role === 'patient') {
      setEmail('');
    } else if (role === 'caregiver') {
      setEmail('caregiver.demo@example.com');
      setPassword('caregiver123');
    } else if (role === 'doctor') {
      setEmail('doctor.demo@example.com');
      setMedicalId('DOC-94827');
      setPassword('doctor123');
      setDoctorLoginMethod('email');
    }
  };

  // Patient login uses real credential check
  const handlePatientSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!pin.trim()) { setError('Please enter your PIN.'); return; }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400)); // small UX delay
    const err = loginWithCredentials(email.trim(), pin.trim());
    setIsLoading(false);
    if (err) setError(err);
  };

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedRole) return;

    if (selectedRole === 'doctor') {
      const identifier = doctorLoginMethod === 'medicalId' ? medicalId : email;
      loginAsRole('doctor', identifier);
    } else if (selectedRole === 'caregiver') {
      loginAsRole('caregiver', email);
    }
  };

  // Step 1: Role Selection Screen
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-sage-50 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sage-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-medium animate-float">
              <Brain className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-4xl font-display font-800 text-gray-900">
              Mind<span className="text-sky-600">Bridge</span>
            </h1>
            <p className="text-gray-500 mt-1">AI Cognitive Companion for Dementia Care</p>
            <div className="inline-block mt-2 px-3 py-1 bg-sky-100 text-sky-700 text-xs font-700 rounded-full">
              Role-Based Access Portal
            </div>
          </div>

          {/* Language Selector */}
          <div className="card mb-6">
            <div className="flex items-center gap-2 mb-3 text-gray-600">
              <Globe className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-600">{t('selectLanguageHeader')}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLang(lang.code);
                    setLanguage(lang.code);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-2xl border-2 transition-all text-xs font-600 ${
                    (selectedLang === lang.code || language === lang.code)
                      ? 'border-sky-400 bg-sky-50 text-sky-700'
                      : 'border-gray-100 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  {lang.nativeName}
                </button>
              ))}
            </div>
          </div>

          {/* Role Selection Cards */}
          <div className="card">
            <h2 className="text-2xl font-display font-700 text-gray-900 mb-1 text-center">
              Select Your Role
            </h2>
            <p className="text-gray-500 text-center mb-6 text-sm">
              कृपया अपनी भूमिका चुनें · Choose account type to proceed
            </p>

            <div className="space-y-4">
              {/* Card 1: Patient */}
              <button
                onClick={() => handleRoleSelect('patient')}
                className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-sky-200 bg-sky-50/70 hover:border-sky-400 hover:bg-sky-100/70 transition-all text-left group"
              >
                <div className="w-14 h-14 rounded-2xl bg-sky-200 text-3xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  👴
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-display font-700 text-gray-900 text-lg">
                    <span>Patient</span>
                    <span className="text-xs bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full font-600">Simple Mode</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    For the person participating in cognitive activities.
                  </p>
                  <p className="text-xs text-sky-700 font-600 mt-1">मरीज़ मोड · Calm, non-clinical environment</p>
                </div>
                <ArrowRight className="w-5 h-5 text-sky-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </button>

              {/* Card 2: Caregiver */}
              <button
                onClick={() => handleRoleSelect('caregiver')}
                className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-sage-200 bg-sage-50/70 hover:border-sage-400 hover:bg-sage-100/70 transition-all text-left group"
              >
                <div className="w-14 h-14 rounded-2xl bg-sage-200 text-3xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  👨‍👩‍👧
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-display font-700 text-gray-900 text-lg">
                    <span>Caregiver</span>
                    <span className="text-xs bg-sage-200 text-sage-800 px-2 py-0.5 rounded-full font-600">Support Mode</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    For family members or caregivers supporting the patient.
                  </p>
                  <p className="text-xs text-sage-700 font-600 mt-1">देखभालकर्ता मोड · Memories & daily routine</p>
                </div>
                <ArrowRight className="w-5 h-5 text-sage-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </button>

              {/* Card 3: Doctor */}
              <button
                onClick={() => handleRoleSelect('doctor')}
                className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-indigo-200 bg-indigo-50/70 hover:border-indigo-400 hover:bg-indigo-100/70 transition-all text-left group"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-200 text-3xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  👨‍⚕️
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-display font-700 text-gray-900 text-lg">
                    <span>Doctor</span>
                    <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full font-600">Clinical Portal</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    For healthcare professionals reviewing cognitive activity & reports.
                  </p>
                  <p className="text-xs text-indigo-700 font-600 mt-1">चिकित्सक पोर्टल · Clinical analytics & reports</p>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate('landing')}
            className="w-full text-center text-gray-400 mt-6 hover:text-gray-600 transition-colors text-sm"
          >
            ← Back to Landing Page
          </button>
        </div>
      </div>
    );
  }

  // PATIENT LOGIN FLOW
  if (selectedRole === 'patient') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sage-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-sky-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-medium text-4xl">
              🧠
            </div>
            <h1 className="text-4xl font-display font-800 text-gray-900 mb-1">
              Mind<span className="text-sky-600">Bridge</span>
            </h1>
            <span className="inline-block bg-sky-100 text-sky-700 text-xs font-700 px-3 py-1 rounded-full mb-2">
              Patient Login
            </span>
            <p className="text-gray-500 text-sm">Enter your email and PIN to continue</p>
            <p className="text-sky-600 font-600 text-xs mt-1">अपना ईमेल और पिन दर्ज करें</p>
          </div>

          <div className="card shadow-medium border border-sky-100">
            <form onSubmit={handlePatientSignIn} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-700 text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-5 py-4 text-base font-500 outline-none focus:border-sky-400 focus:bg-white transition-all"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>

              {/* PIN */}
              <div>
                <label className="block text-sm font-700 text-gray-700 mb-2">
                  PIN <span className="text-gray-400 font-400 text-xs">(6-digit number)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                    placeholder="● ● ● ● ● ●"
                    className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-5 py-4 text-xl font-700 text-center tracking-widest outline-none focus:border-sky-400 focus:bg-white transition-all pr-14"
                    maxLength={6}
                    inputMode="numeric"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center font-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full text-lg py-4 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Demo helper */}
            <div className="mt-5 p-4 bg-sky-50 rounded-2xl border border-sky-100">
              <p className="text-xs font-700 text-sky-800 mb-2">Demo Patient Account:</p>
              <div className="flex flex-col gap-1 text-xs text-sky-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <code className="font-600">patient.demo@example.com</code>
                  <span className="text-sky-400">PIN: 123456</span>
                </div>
                <div className="text-sky-500 text-[11px] mt-0.5">For doctor-created patients, use the email and PIN set by your doctor.</div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                Need help? Contact your caregiver or doctor.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedRole(null)}
            className="w-full text-center text-gray-400 mt-4 hover:text-gray-600 transition-colors text-sm"
          >
            ← Change Role
          </button>
        </div>
      </div>
    );
  }

  // CAREGIVER LOGIN FLOW
  if (selectedRole === 'caregiver') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-cream-50 to-lavender-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">👨‍👩‍👧</div>
            <span className="badge bg-sage-100 text-sage-800 text-xs font-700 mb-2">Caregiver Support Portal</span>
            <h1 className="text-3xl font-display font-800 text-gray-900">Caregiver Sign In</h1>
            <p className="text-gray-500 mt-1">Priya Sharma · Supporting Arjun Sharma</p>
          </div>

          <div className="card">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-600 text-gray-700 mb-1">Caregiver Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="caregiver.demo@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-600 text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="p-3 bg-sage-50 rounded-xl border border-sage-200">
                <div className="flex items-center gap-2 text-xs text-sage-800">
                  <CheckCircle2 className="w-4 h-4 text-sage-600 flex-shrink-0" />
                  <span>Access memory uploader, daily logs & patient assistance</span>
                </div>
              </div>

              <button type="submit" className="btn-secondary w-full text-lg py-3.5">
                Access Caregiver Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-4 p-3 bg-cream-100 rounded-xl border border-cream-200 text-center">
              <p className="text-xs text-gray-600">
                <strong>Demo Account:</strong> <code>caregiver.demo@example.com</code>
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedRole(null)}
            className="w-full text-center text-gray-400 mt-4 hover:text-gray-600 transition-colors text-sm"
          >
            ← Change Role
          </button>
        </div>
      </div>
    );
  }

  // DOCTOR LOGIN FLOW
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-sky-600 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-medium text-3xl text-white">
            👨‍⚕️
          </div>
          <span className="badge bg-indigo-100 text-indigo-800 text-xs font-700 mb-2">Doctor Clinical Portal</span>
          <h1 className="text-3xl font-display font-800 text-gray-900">{demoDoctor.name}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{demoDoctor.title}</p>
          <p className="text-xs text-indigo-600 font-600 mt-1">{demoDoctor.hospital}</p>
        </div>

        <div className="card border-2 border-indigo-100">
          {/* Method Selector Tabs */}
          <div className="flex border-b border-indigo-100 mb-5 p-1 bg-indigo-50/70 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setDoctorLoginMethod('email');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-700 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                doctorLoginMethod === 'email'
                  ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200'
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setDoctorLoginMethod('medicalId');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-700 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                doctorLoginMethod === 'medicalId'
                  ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200'
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Doctor Medical ID
            </button>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            {doctorLoginMethod === 'email' ? (
              <div>
                <label className="block text-sm font-600 text-gray-700 mb-1">Doctor Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="doctor.demo@example.com"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-600 text-gray-700 mb-1">Doctor Medical License / ID Number</label>
                <input
                  type="text"
                  value={medicalId}
                  onChange={(e) => setMedicalId(e.target.value)}
                  className="input-field font-mono uppercase tracking-wide"
                  placeholder="DOC-94827"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-600 text-gray-700 mb-1">
                {doctorLoginMethod === 'email' ? 'Secure Passcode' : 'Clinical Security PIN / Passcode'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="flex items-start gap-2.5 text-xs text-indigo-900 leading-relaxed">
                <Shield className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Clinical Access:</strong> Cognitive domain trends, assessment history, adaptive difficulty analytics, & exportable clinical reports.
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-3.5 font-700 shadow-soft"
            >
              Access Doctor Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-4 p-3 bg-slate-100 rounded-xl border border-slate-200 text-center">
            <p className="text-xs text-gray-600 mb-2 font-600">
              Demo Credentials (Click to switch):
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setDoctorLoginMethod('email');
                  setEmail('doctor.demo@example.com');
                  setPassword('doctor123');
                }}
                className={`w-full sm:w-auto px-3 py-1.5 border rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  doctorLoginMethod === 'email'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>Email: <code>doctor.demo@example.com</code></span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDoctorLoginMethod('medicalId');
                  setMedicalId('DOC-94827');
                  setPassword('doctor123');
                }}
                className={`w-full sm:w-auto px-3 py-1.5 border rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  doctorLoginMethod === 'medicalId'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-200'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                <span>Medical ID: <code>DOC-94827</code></span>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setSelectedRole(null)}
          className="w-full text-center text-gray-400 mt-4 hover:text-gray-600 transition-colors text-sm"
        >
          ← Change Role
        </button>
      </div>
    </div>
  );
}
