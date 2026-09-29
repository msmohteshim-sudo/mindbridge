import { Brain, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function FirstLoginWelcome() {
  const { patient, dismissFirstLogin, navigate } = useApp();
  const firstName = patient.name.split(' ')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Animated welcome icon */}
        <div className="relative mb-8">
          <div className="w-28 h-28 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-float">
            <Brain className="w-14 h-14 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-medium text-2xl animate-bounce">
            👋
          </div>
        </div>

        {/* Welcome text */}
        <div className="mb-6">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-700 px-4 py-1 rounded-full mb-4">
            ✨ First Login
          </span>
          <h1 className="text-4xl font-display font-800 text-gray-900 mb-2">
            Welcome, {firstName}! 👋
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Great to have you here. MindBridge is your personal cognitive companion.
          </p>
          <p className="text-indigo-600 font-600 text-sm mt-2">
            स्वागत है, {firstName}! 🙏
          </p>
        </div>

        {/* Photo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <img
              src={patient.profilePhoto}
              alt={patient.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-medium object-cover bg-sky-100"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>

        {/* What's next card */}
        <div className="card mb-6 text-left bg-white border border-indigo-100 shadow-soft">
          <h3 className="text-sm font-700 text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-base">🎯</span> Let's get started
          </h3>
          <div className="space-y-2.5 text-sm text-gray-600">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-xs flex-shrink-0">1</div>
              <span>Explore today's cognitive activities</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs flex-shrink-0">2</div>
              <span>Browse your memory gallery</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center text-xs flex-shrink-0">3</div>
              <span>Chat with your voice companion</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            dismissFirstLogin();
            navigate('dashboard');
          }}
          className="btn-primary w-full text-lg py-4 mb-3"
        >
          Let's start today's activity! 🚀
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            dismissFirstLogin();
            navigate('dashboard');
          }}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Skip to dashboard →
        </button>
      </div>
    </div>
  );
}
