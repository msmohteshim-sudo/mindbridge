import { useState } from 'react';
import { Brain, Heart, Star, Shield, ArrowRight, Users, BarChart3, Mic, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

const features = [
  {
    icon: Brain,
    title: 'Personalised Cognitive Activities',
    description: 'AI adapts every activity to your loved one\'s unique abilities and interests.',
    color: 'bg-sky-100 text-sky-600',
  },
  {
    icon: Heart,
    title: 'Family Memories & Photos',
    description: 'Upload family photos and stories to create deeply personal memory exercises.',
    color: 'bg-rose-100 text-rose-600',
  },
  {
    icon: BarChart3,
    title: 'Gentle Progress Tracking',
    description: 'Monitor cognitive engagement trends with clear, compassionate reporting.',
    color: 'bg-sage-100 text-sage-600',
  },
  {
    icon: Mic,
    title: 'Voice Interaction',
    description: 'Speak naturally in your regional language. No typing needed.',
    color: 'bg-lavender-100 text-lavender-600',
  },
  {
    icon: Globe,
    title: 'Regional Languages',
    description: 'Full support for Hindi, Marathi, Assamese, Manipuri, Bodo, and English.',
    color: 'bg-warm-100 text-warm-600',
  },
  {
    icon: Users,
    title: 'Caregiver Dashboard',
    description: 'Family and caregivers get clear insights into daily engagement and wellbeing.',
    color: 'bg-amber-100 text-amber-600',
  },
];

const testimonials = [
  {
    text: '"Papa recognised 8 out of 10 old songs. He hasn\'t smiled like that in months."',
    author: 'Priya S., Mumbai',
    relation: 'Daughter and caregiver',
  },
  {
    text: '"The family memory feature is incredible. Amma lit up when she saw the old temple photo."',
    author: 'Karthik R., Chennai',
    relation: 'Son and caregiver',
  },
  {
    text: '"MindBridge gives me meaningful data without making me feel like I\'m running a clinic at home."',
    author: 'Dr. Sunita Mehta',
    relation: 'Geriatric specialist',
  },
];

export function LandingPage() {
  const { navigate } = useApp();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-sage-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sage-400 rounded-2xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-800">
              Mind<span className="text-sky-600">Bridge</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('login')}
              className="btn-primary py-3 px-6 text-base"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-600 mb-6">
          <Shield className="w-4 h-4" />
          SIH 2026 · AI-Powered Dementia Care · Project SIH26003
        </div>

        <h1 className="text-5xl md:text-6xl font-display font-800 text-gray-900 mb-6 leading-tight">
          A Caring Companion for
          <br />
          <span className="text-sky-600">Every Memory</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          MindBridge gently supports cognitive engagement for people living with dementia through
          personalised activities, family memories, and compassionate AI — in your regional language.
        </p>

        <div className="disclaimer-banner max-w-xl mx-auto mb-10 text-left">
          <strong>Important:</strong> MindBridge is a supportive cognitive engagement and monitoring prototype.
          It is not a medical diagnostic tool, does not diagnose or treat dementia, and is not a substitute for professional medical care.
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('login')}
            className="btn-primary text-xl py-5 px-10"
          >
            Begin Today's Session
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('caregiver')}
            className="btn-secondary text-xl py-5 px-10"
          >
            Caregiver Dashboard
          </button>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-white border-y border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '12', label: 'Cognitive Activities', suffix: '+' },
            { value: '10', label: 'Regional Languages', suffix: '+' },
            { value: '6', label: 'Cognitive Domains\nTracked', suffix: '' },
            { value: '100%', label: 'Privacy First\nLocal Data', suffix: '' },
          ].map(({ value, label, suffix }) => (
            <div key={label}>
              <div className="text-4xl font-display font-800 text-sky-600">
                {value}{suffix}
              </div>
              <div className="text-sm text-gray-500 mt-1 whitespace-pre-line">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-800 text-gray-900 mb-3">
            Everything a Caring Family Needs
          </h2>
          <p className="text-lg text-gray-500">
            Thoughtfully designed for the people who need it most.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`card card-hover p-6 transition-all duration-300 ${
                hoveredFeature === i ? 'shadow-medium -translate-y-1' : ''
              }`}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-700 text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Game Types Preview */}
      <section className="bg-sky-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-800 text-gray-900 mb-3">
              Gentle, Engaging Activities
            </h2>
            <p className="text-lg text-gray-500">
              Every activity is designed to engage — never to frustrate.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { emoji: '🃏', name: 'Memory Match', desc: 'Matching pairs' },
              { emoji: '👨‍👩‍👧', name: 'Family Memories', desc: 'Your own photos' },
              { emoji: '🎵', name: 'Music Recognition', desc: 'Familiar melodies' },
              { emoji: '🎨', name: 'Mindful Colouring', desc: 'Calm & creative' },
              { emoji: '📖', name: 'Story Completion', desc: 'Gentle storytelling' },
              { emoji: '🛒', name: 'Virtual Market', desc: 'Real-life tasks' },
              { emoji: '☀️', name: 'Daily Routines', desc: 'Familiar activities' },
              { emoji: '🌸', name: 'Word Garden', desc: 'Language activities' },
            ].map(({ emoji, name, desc }) => (
              <div key={name} className="card text-center p-5 card-hover">
                <div className="text-4xl mb-3">{emoji}</div>
                <div className="font-display font-700 text-gray-900 text-sm">{name}</div>
                <div className="text-xs text-gray-500 mt-1">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-800 text-gray-900 mb-3">
            Stories from Families
          </h2>
          <p className="text-lg text-gray-500">Demo testimonials from our pilot programme.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.author} className="card p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 italic">{t.text}</p>
              <div>
                <div className="font-600 text-gray-900">{t.author}</div>
                <div className="text-sm text-gray-500">{t.relation}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-sky-500 to-sage-500 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-display font-800 mb-4">
            Start a Session Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            15 minutes of gentle activity can make a meaningful difference.
          </p>
          <button
            onClick={() => navigate('login')}
            className="bg-white text-sky-700 font-display font-700 text-xl px-10 py-5 rounded-2xl hover:bg-cream-50 transition-colors shadow-medium"
          >
            Get Started — It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
          <p className="mb-2">
            <strong>MindBridge</strong> · SIH26003 · AI-Powered Personalized Cognitive Companion for Dementia Care
          </p>
          <p>
            This is a hackathon prototype. Not a medical device. Not intended for clinical diagnosis or treatment.
            Always consult a qualified healthcare professional for medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
