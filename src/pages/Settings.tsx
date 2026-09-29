import { useApp } from '../context/AppContext';
import { supportedLanguages } from '../data/demoData';
import { Globe, Accessibility, Bell, Shield, Type } from 'lucide-react';

export function Settings() {
  const { fontScale, setFontScale, highContrast, setHighContrast, language, setLanguage, voiceEnabled, setVoiceEnabled } = useApp();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="section-header">Settings & Accessibility</h1>
        <p className="section-subheader">सेटिंग्स · Personalise your MindBridge experience</p>
      </div>

      {/* Accessibility */}
      <div className="card">
        <h2 className="text-xl font-display font-700 text-gray-900 mb-5 flex items-center gap-2">
          <Accessibility className="w-5 h-5 text-sky-500" />
          Accessibility
        </h2>

        {/* Font Size */}
        <div className="mb-6">
          <label className="block text-sm font-600 text-gray-700 mb-3 flex items-center gap-2">
            <Type className="w-4 h-4" />
            Text Size
          </label>
          <div className="flex gap-3">
            {[
              { scale: 0.9, label: 'Small', preview: 'Aa' },
              { scale: 1.0, label: 'Normal', preview: 'Aa' },
              { scale: 1.15, label: 'Large', preview: 'Aa' },
              { scale: 1.3, label: 'Very Large', preview: 'Aa' },
            ].map(({ scale, label, preview }) => (
              <button
                key={scale}
                onClick={() => setFontScale(scale)}
                className={`flex-1 flex flex-col items-center py-4 rounded-2xl border-2 transition-all ${
                  fontScale === scale
                    ? 'border-sky-400 bg-sky-50 text-sky-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <span className="font-bold mb-1" style={{ fontSize: `${scale * 16}px` }}>{preview}</span>
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-4">
          <div>
            <div className="font-600 text-gray-900">High Contrast Mode</div>
            <div className="text-sm text-gray-500">Increases visual contrast for easier reading</div>
          </div>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`relative w-14 h-7 rounded-full transition-all ${highContrast ? 'bg-sky-500' : 'bg-gray-300'}`}
            role="switch"
            aria-checked={highContrast}
          >
            <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${highContrast ? 'translate-x-7' : ''}`} />
          </button>
        </div>

        {/* Voice */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
          <div>
            <div className="font-600 text-gray-900">Voice Interaction</div>
            <div className="text-sm text-gray-500">Enable voice commands and audio responses</div>
          </div>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`relative w-14 h-7 rounded-full transition-all ${voiceEnabled ? 'bg-sky-500' : 'bg-gray-300'}`}
            role="switch"
            aria-checked={voiceEnabled}
          >
            <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${voiceEnabled ? 'translate-x-7' : ''}`} />
          </button>
        </div>
      </div>

      {/* Language */}
      <div className="card">
        <h2 className="text-xl font-display font-700 text-gray-900 mb-5 flex items-center gap-2">
          <Globe className="w-5 h-5 text-sage-500" />
          Language / भाषा
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {supportedLanguages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
                language === lang.code
                  ? 'border-sage-400 bg-sage-50 text-sage-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="text-left">
                <div className="text-sm font-700">{lang.name}</div>
                <div className="text-xs text-gray-400">{lang.nativeName}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h2 className="text-xl font-display font-700 text-gray-900 mb-5 flex items-center gap-2">
          <Bell className="w-5 h-5 text-warm-500" />
          Reminders
        </h2>

        <div className="space-y-3">
          {[
            { label: 'Daily activity reminder', time: '09:00 AM', enabled: true },
            { label: 'Afternoon break reminder', time: '03:00 PM', enabled: true },
            { label: 'Weekly summary for caregiver', time: 'Sunday 6 PM', enabled: false },
          ].map(({ label, time, enabled }) => (
            <div key={label} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <div className="font-600 text-gray-900 text-sm">{label}</div>
                <div className="text-xs text-gray-400">{time}</div>
              </div>
              <button
                className={`relative w-14 h-7 rounded-full transition-all ${enabled ? 'bg-warm-500' : 'bg-gray-300'}`}
                role="switch"
                aria-checked={enabled}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-7' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="card">
        <h2 className="text-xl font-display font-700 text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-lavender-500" />
          Privacy & Data
        </h2>

        <div className="p-4 bg-lavender-50 rounded-2xl border border-lavender-200 mb-4">
          <p className="text-sm text-lavender-700 leading-relaxed">
            <strong>Your data stays private.</strong> All cognitive activity data and personal memories are stored
            locally and shared only with your designated caregivers. MindBridge does not sell or share your data
            with third parties.
          </p>
        </div>

        <div className="space-y-2">
          <button className="w-full text-left p-3 rounded-2xl hover:bg-gray-50 text-sm text-gray-700 font-600 transition-colors border border-transparent hover:border-gray-200">
            Download my data →
          </button>
          <button className="w-full text-left p-3 rounded-2xl hover:bg-red-50 text-sm text-red-500 font-600 transition-colors border border-transparent hover:border-red-200">
            Delete my account →
          </button>
        </div>
      </div>

      {/* About */}
      <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 text-center">
        <div className="font-700 text-gray-900 mb-1">MindBridge v1.0.0</div>
        <div className="text-sm text-gray-500">SIH26003 · AI-Powered Cognitive Companion · 2026</div>
        <div className="text-xs text-gray-400 mt-2">
          Supportive cognitive engagement prototype · Not a medical device
        </div>
      </div>
    </div>
  );
}
