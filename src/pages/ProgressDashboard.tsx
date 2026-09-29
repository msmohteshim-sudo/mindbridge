import { useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Award, Target, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cognitiveHistory, weeklyProgress } from '../data/demoData';

const DOMAIN_COLORS: Record<string, string> = {
  memory: '#3b9fff',
  attention: '#ff9a3c',
  language: '#9372f5',
  executive: '#4e9858',
  visuospatial: '#f472b6',
  processing: '#fbbf24',
};

const DOMAIN_LABELS: Record<string, string> = {
  memory: 'Memory',
  attention: 'Attention',
  language: 'Language',
  executive: 'Executive Function',
  visuospatial: 'Visuospatial',
  processing: 'Processing Speed',
};

function ScoreCard({ label, value, trend, color }: {
  label: string; value: number; trend?: 'up' | 'down' | 'stable'; color: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 font-600">{label}</span>
        {trend === 'up' && <TrendingUp className="w-4 h-4 text-sage-500" />}
        {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
        {trend === 'stable' && <Minus className="w-4 h-4 text-gray-400" />}
      </div>
      <div className="text-3xl font-display font-800 mb-2" style={{ color }}>
        {value}%
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function ProgressDashboard() {
  const { cognitiveProfile, sessions } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'domains' | 'history' | 'sessions'>('overview');

  const radarData = [
    { domain: 'Memory', value: cognitiveProfile.memory, fullMark: 100 },
    { domain: 'Attention', value: cognitiveProfile.attention, fullMark: 100 },
    { domain: 'Language', value: cognitiveProfile.language, fullMark: 100 },
    { domain: 'Executive\nFunction', value: cognitiveProfile.executiveFunction, fullMark: 100 },
    { domain: 'Visuospatial', value: cognitiveProfile.visuospatial, fullMark: 100 },
    { domain: 'Processing\nSpeed', value: cognitiveProfile.processingSpeed, fullMark: 100 },
  ];

  const weeklyData = weeklyProgress.map(w => ({
    week: w.week.split('–')[0],
    sessions: w.sessionsCompleted,
    score: w.avgScore,
    engagement: w.engagementRate,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-header">Progress Dashboard</h1>
        <p className="section-subheader">
          प्रगति रिपोर्ट · Last updated: 25 September 2026
        </p>
      </div>

      <div className="disclaimer-banner mb-6">
        <strong>📊 Note:</strong> These engagement metrics reflect activity performance within MindBridge.
        They are not clinical assessments and should not be interpreted as medical diagnoses.
        Always consult a qualified healthcare professional for clinical evaluation.
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Overall Score', value: cognitiveProfile.overallScore, icon: Target, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Sessions (Sep)', value: 18, icon: Clock, color: 'text-sage-600', bg: 'bg-sage-50' },
          { label: 'Day Streak', value: 7, icon: Award, color: 'text-warm-600', bg: 'bg-warm-50' },
          { label: 'Engagement', value: 84, icon: TrendingUp, color: 'text-lavender-600', bg: 'bg-lavender-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`card p-5 ${bg}`}>
            <div className={`${color} mb-2`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className={`text-3xl font-display font-800 ${color}`}>
              {value}{label === 'Engagement' ? '%' : label === 'Overall Score' ? '%' : ''}
            </div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(['overview', 'domains', 'history', 'sessions'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-2xl font-600 text-sm capitalize whitespace-nowrap transition-all border-2 ${
              activeTab === tab
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="card">
            <h2 className="text-xl font-display font-700 text-gray-900 mb-4">Cognitive Profile</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="domain"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#0f7be8"
                  fill="#3b9fff"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Engagement */}
          <div className="card">
            <h2 className="text-xl font-display font-700 text-gray-900 mb-4">Weekly Engagement %</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 30px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="engagement" radius={[6, 6, 0, 0]}>
                  {weeklyData.map((_, i) => (
                    <Cell key={i} fill={i === weeklyData.length - 1 ? '#0f7be8' : '#93c5fd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* AI Insights */}
          <div className="card md:col-span-2">
            <h2 className="text-xl font-display font-700 text-gray-900 mb-4">💡 AI Observations</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-sage-50 rounded-2xl border border-sage-200">
                <div className="font-700 text-sage-700 mb-1">✅ Strength</div>
                <p className="text-sm text-gray-600">Language skills are strong at 74%. Music and storytelling activities show consistently high engagement.</p>
              </div>
              <div className="p-4 bg-warm-50 rounded-2xl border border-warm-200">
                <div className="font-700 text-warm-700 mb-1">🎯 Focus Area</div>
                <p className="text-sm text-gray-600">Processing speed (48%) benefits from practice. Virtual Market and Daily Routine activities are recommended.</p>
              </div>
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
                <div className="font-700 text-sky-700 mb-1">📈 Trend</div>
                <p className="text-sm text-gray-600">Overall score has improved from 54 to 60 since March. Consistent daily engagement is the key driver.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Domains Tab */}
      {activeTab === 'domains' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ScoreCard label="Memory" value={cognitiveProfile.memory} trend="stable" color="#3b9fff" />
          <ScoreCard label="Attention" value={cognitiveProfile.attention} trend="up" color="#ff9a3c" />
          <ScoreCard label="Language" value={cognitiveProfile.language} trend="up" color="#9372f5" />
          <ScoreCard label="Executive Function" value={cognitiveProfile.executiveFunction} trend="stable" color="#4e9858" />
          <ScoreCard label="Visuospatial" value={cognitiveProfile.visuospatial} trend="stable" color="#f472b6" />
          <ScoreCard label="Processing Speed" value={cognitiveProfile.processingSpeed} trend="stable" color="#fbbf24" />
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="card">
          <h2 className="text-xl font-display font-700 text-gray-900 mb-4">6-Month Trend</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={cognitiveHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis domain={[30, 90]} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 30px rgba(0,0,0,0.1)' }}
              />
              {Object.entries(DOMAIN_COLORS).map(([key, color]) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key === 'executive' ? 'executive' : key === 'processing' ? 'processing' : key}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  name={DOMAIN_LABELS[key]}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          <div className="flex flex-wrap gap-3 mt-4">
            {Object.entries(DOMAIN_COLORS).map(([key, color]) => (
              <div key={key} className="flex items-center gap-1.5 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-gray-500">{DOMAIN_LABELS[key]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-3">
          {sessions.map(session => (
            <div key={session.id} className="card p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gray-100 flex-shrink-0`}>
                {session.activityType === 'music-recognition' ? '🎵'
                  : session.activityType === 'family-memory' ? '👨‍👩‍👧'
                  : session.activityType === 'memory-match' ? '🃏'
                  : session.activityType === 'coloring-relaxation' ? '🎨'
                  : session.activityType === 'story-completion' ? '📖'
                  : session.activityType === 'virtual-shopping' ? '🛒'
                  : '🧩'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-700 text-gray-900">{session.activityName}</div>
                <div className="text-sm text-gray-500">
                  {new Date(session.completedAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })} · {session.durationMinutes} min · Level {session.difficulty}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`text-2xl font-display font-800 ${
                  session.score >= 75 ? 'text-sage-600' : session.score >= 50 ? 'text-sky-600' : 'text-warm-600'
                }`}>
                  {session.score}%
                </div>
                <div className={`text-xs badge ${
                  session.engagement === 'high' ? 'badge-green'
                  : session.engagement === 'medium' ? 'badge-blue'
                  : 'badge-warm'
                }`}>
                  {session.engagement}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
