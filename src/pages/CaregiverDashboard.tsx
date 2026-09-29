import { useState } from 'react';
import {
  Users, Activity,
  CheckCircle, Clock, Plus, Image, Sparkles, Music
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { caregiverNotes, todaysPlan } from '../data/demoData';
import type { MemoryItem } from '../types';

const MOOD_CONFIG = {
  excellent: { label: 'Excellent', emoji: '😊', color: 'text-sage-600 bg-sage-50 border-sage-200' },
  good: { label: 'Good', emoji: '🙂', color: 'text-sky-600 bg-sky-50 border-sky-200' },
  fair: { label: 'Fair', emoji: '😐', color: 'text-warm-600 bg-warm-50 border-warm-200' },
  poor: { label: 'Poor', emoji: '😔', color: 'text-red-600 bg-red-50 border-red-200' },
};

export function CaregiverDashboard() {
  const { navigate, patient, addMemory } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'schedule' | 'upload'>('overview');
  const [noteText, setNoteText] = useState('');
  const [mood, setMood] = useState<keyof typeof MOOD_CONFIG>('good');
  const [notes, setNotes] = useState(caregiverNotes);

  // New Memory Upload state
  const [memTitle, setMemTitle] = useState('');
  const [memDesc, setMemDesc] = useState('');
  const [memCategory, setMemCategory] = useState<MemoryItem['category']>('photo');
  const [memTags, setMemTags] = useState('');
  const [memYear, setMemYear] = useState('2022');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const completedToday = todaysPlan.activities.filter(a => a.completed).length;

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      note: noteText,
      mood,
      author: 'Priya Sharma',
    };
    setNotes(prev => [newNote, ...prev]);
    setNoteText('');
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memTitle.trim()) return;
    const newMem: MemoryItem = {
      id: `mem-${Date.now()}`,
      title: memTitle,
      description: memDesc || 'Uploaded by caregiver',
      category: memCategory,
      tags: memTags.split(',').map(t => t.trim()).filter(Boolean),
      uploadedBy: 'Priya Sharma (Caregiver)',
      uploadedAt: new Date().toISOString().split('T')[0],
      year: parseInt(memYear) || 2026,
      imageUrl: 'https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=600&h=400&fit=crop',
    };
    addMemory(newMem);
    setUploadSuccess(true);
    setMemTitle('');
    setMemDesc('');
    setMemTags('');
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div>
      {/* Caregiver Header */}
      <div className="bg-gradient-to-br from-sage-500 to-sage-600 rounded-3xl p-6 text-white mb-6 relative overflow-hidden shadow-soft">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-sage-200" />
            <span className="text-sage-200 text-sm font-600">Caregiver Support Dashboard</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-800 mb-1">{patient.name}</h1>
              <p className="text-sage-100 text-sm">
                Caregiver: <strong className="text-white">Priya Sharma</strong> · Joined {patient.joinedDate}
              </p>
            </div>
            <button
              onClick={() => navigate('profile')}
              className="bg-white/20 hover:bg-white/30 text-white font-600 text-xs px-3.5 py-2 rounded-2xl transition-colors backdrop-blur-sm"
            >
              View Patient Profile →
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center">
              <div className="text-xl font-700">{completedToday}/{todaysPlan.activities.length}</div>
              <div className="text-xs text-sage-100">Today's activities</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center">
              <div className="text-xl font-700">{todaysPlan.streak} Days</div>
              <div className="text-xs text-sage-100">Activity streak</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center">
              <div className="text-xl font-700">18 Sessions</div>
              <div className="text-xs text-sage-100">This month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gentle Disclaimer Banner */}
      <div className="disclaimer-banner mb-6">
        <strong>💚 Caregiver Note:</strong> This portal is designed to help you personalize activities, upload family memories, and support {patient.name.split(' ')[0]}'s daily cognitive engagement routine. Clinical evaluations are managed separately by {patient.doctorName || 'the attending physician'}.
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(['overview', 'notes', 'schedule', 'upload'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-2xl font-600 text-sm whitespace-nowrap transition-all border-2 capitalize ${
              activeTab === tab
                ? 'bg-sage-600 text-white border-sage-600 shadow-soft'
                : 'bg-white text-gray-600 border-gray-200 hover:border-sage-300'
            }`}
          >
            {tab === 'upload' ? 'Upload Memories' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Activity Completion Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Today Status', value: completedToday > 0 ? 'Participated' : 'Pending', icon: Activity, color: 'text-sage-600', bg: 'bg-sage-50' },
              { label: 'Weekly Streak', value: `${todaysPlan.streak} Days`, icon: Sparkles, color: 'text-sky-600', bg: 'bg-sky-50' },
              { label: 'Top Music', value: 'Rafi Classics', icon: Music, color: 'text-warm-600', bg: 'bg-warm-50' },
              { label: 'Uploaded Photos', value: '12 Photos', icon: Image, color: 'text-lavender-600', bg: 'bg-lavender-50' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className={`card p-5 ${bg}`}>
                <Icon className={`w-5 h-5 ${color} mb-2`} />
                <div className={`text-xl font-display font-800 ${color}`}>{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Today's Activity Plan for Patient */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-700 text-gray-900">Today's Activity Completion</h2>
              <button
                onClick={() => navigate('activity')}
                className="btn-primary text-xs py-2 px-3"
              >
                Help Patient Start Activity
              </button>
            </div>
            <div className="space-y-3">
              {todaysPlan.activities.map(act => (
                <div key={act.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${act.completed ? 'bg-sage-100' : 'bg-gray-200'}`}>
                    {act.completed ? <CheckCircle className="w-5 h-5 text-sage-600" /> : <Clock className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <span className={`font-600 text-sm ${act.completed ? 'text-sage-800' : 'text-gray-800'}`}>{act.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{act.scheduledTime} · {act.estimatedMinutes} min</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-600 ${act.completed ? 'bg-sage-100 text-sage-700' : 'bg-amber-100 text-amber-700'}`}>
                    {act.completed ? 'Completed Today ✓' : 'Scheduled'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Caregiver Guidance */}
          <div className="card bg-gradient-to-r from-sage-50 to-sky-50 border border-sage-200">
            <h2 className="text-xl font-display font-700 text-gray-900 mb-3">Tips for Today's Session</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-sage-600 font-bold">1.</span>
                <span>Play his favourite Rafi songs before starting music recognition activities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage-600 font-bold">2.</span>
                <span>If he feels tired in the afternoon, try the 15-minute coloring relaxation session.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage-600 font-bold">3.</span>
                <span>Keep text size set to "Large" in Settings for easy viewing.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-display font-700 text-gray-900 mb-4">Add Daily Caregiver Observation</h2>
            <div className="mb-4">
              <label className="block text-sm font-600 text-gray-700 mb-2">How was {patient.name.split(' ')[0]} today?</label>
              <div className="flex gap-3">
                {(Object.entries(MOOD_CONFIG) as [keyof typeof MOOD_CONFIG, typeof MOOD_CONFIG[keyof typeof MOOD_CONFIG]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setMood(key)}
                    className={`flex-1 flex flex-col items-center py-3 rounded-2xl border-2 transition-all ${
                      mood === key ? cfg.color + ' border-current' : 'border-gray-200 text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{cfg.emoji}</span>
                    <span className="text-xs mt-1 font-600">{cfg.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Note daily observations — energy levels, favorite moments, music reactions..."
              className="input-field resize-none mb-3"
              rows={4}
            />
            <button
              onClick={handleAddNote}
              disabled={!noteText.trim()}
              className="btn-primary disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Save Observation
            </button>
          </div>

          <div>
            <h2 className="text-xl font-display font-700 text-gray-900 mb-4">Past Observations Log</h2>
            <div className="space-y-3">
              {notes.map(note => {
                const cfg = MOOD_CONFIG[note.mood];
                return (
                  <div key={note.id} className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`badge ${cfg.color} text-sm font-600`}>
                        {cfg.emoji} {cfg.label}
                      </span>
                      <span className="text-sm text-gray-400">{note.date} · {note.author}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">{note.note}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="card">
          <h2 className="text-xl font-display font-700 text-gray-900 mb-2">Weekly Activity Schedule</h2>
          <p className="text-sm text-gray-500 mb-6">Suggested daily routine to maintain consistent engagement</p>

          <div className="space-y-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
              <div key={day} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-24 flex-shrink-0">
                  <div className="font-700 text-gray-900 text-sm">{day}</div>
                </div>
                <div className="flex-1 flex flex-wrap gap-2">
                  {i < 5 ? (
                    <>
                      <span className="text-xs bg-sky-100 text-sky-700 px-3 py-1 rounded-full font-600">🎵 09:30 Music Session</span>
                      <span className="text-xs bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-600">👨‍👩‍👧 11:00 Family Memory</span>
                      {i % 2 === 0 && <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-600">🎨 15:30 Mindful Colouring</span>}
                    </>
                  ) : (
                    <span className="text-xs bg-sage-100 text-sage-700 px-3 py-1 rounded-full font-600">💚 Light Sunday Routine — Family conversation</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-display font-700 text-gray-900 mb-2">Upload Family Photos & Memories</h2>
            <p className="text-gray-500 text-sm mb-6">
              Photos, stories, and songs you upload are automatically woven into {patient.name.split(' ')[0]}'s reminiscence activities.
            </p>

            {uploadSuccess && (
              <div className="mb-4 p-3.5 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-sm font-600 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Memory successfully added to gallery!
              </div>
            )}

            <form onSubmit={handleSaveMemory} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-600 text-gray-700 mb-1">Title / Caption</label>
                  <input
                    type="text"
                    value={memTitle}
                    onChange={e => setMemTitle(e.target.value)}
                    placeholder="e.g. Diwali in Jaipur 2018"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-600 text-gray-700 mb-1">Category</label>
                  <select
                    value={memCategory}
                    onChange={e => setMemCategory(e.target.value as MemoryItem['category'])}
                    className="input-field"
                  >
                    <option value="photo">Family Photo</option>
                    <option value="place">Special Place</option>
                    <option value="person">Family Member</option>
                    <option value="event">Celebration / Event</option>
                    <option value="music">Favorite Music</option>
                    <option value="story">Life Story</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-600 text-gray-700 mb-1">Memory Details / Description</label>
                <textarea
                  value={memDesc}
                  onChange={e => setMemDesc(e.target.value)}
                  placeholder="Describe the memory — who was there, what happened, special details..."
                  className="input-field resize-none"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-600 text-gray-700 mb-1">Year (Optional)</label>
                  <input
                    type="number"
                    value={memYear}
                    onChange={e => setMemYear(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-600 text-gray-700 mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={memTags}
                    onChange={e => setMemTags(e.target.value)}
                    placeholder="e.g. Jaipur, Diwali, Grandchildren"
                    className="input-field"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-3.5 text-base font-700">
                <Plus className="w-5 h-5" />
                Add to Family Memory Gallery
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
