import { CheckCircle, Clock, Flame, ChevronRight, Sun, Music, Image } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { todaysPlan, gameLibrary } from '../data/demoData';

export function Dashboard() {
  const { patient, navigate } = useApp();
  const completedToday = todaysPlan.activities.filter(a => a.completed).length;
  const totalToday = todaysPlan.activities.length;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Supportive Warm Greeting Header */}
      <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-soft">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-8 -translate-x-8" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-5 h-5 text-yellow-300" />
                <span className="text-sky-100 text-sm font-600">Friday, 25 September 2026</span>
              </div>
              <h1 className="text-3xl font-display font-800 mb-1">
                {greeting()}, {patient.name.split(' ')[0]}!
              </h1>
              <p className="text-sky-100 text-lg">
                {greeting() === 'Good morning' ? 'नमस्ते! आज का सत्र शुरू करें' : 'आज भी बढ़िया काम करें'}
              </p>
            </div>
            <img
              src={patient.profilePhoto}
              alt={patient.name}
              className="w-16 h-16 rounded-full bg-sky-300 border-2 border-white/50 shadow-soft"
            />
          </div>

          {/* Simple Encouragement Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
              <Flame className="w-5 h-5 text-orange-300" />
              <span className="font-700 text-lg">{todaysPlan.streak}</span>
              <span className="text-sky-100 text-sm">day streak!</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span className="font-700 text-lg">{completedToday}/{totalToday}</span>
              <span className="text-sky-100 text-sm">activities done today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gentle Positive Encouragement Card */}
      <div className="card bg-gradient-to-r from-cream-100 via-sky-50 to-sage-50 border border-sky-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl flex-shrink-0">
            🌟
          </div>
          <div>
            <h2 className="text-lg font-display font-700 text-gray-900">Great Job Keeping Active!</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              "Every little activity brings joy and keeps your mind refreshed. Take your time and enjoy each moment."
            </p>
          </div>
        </div>
      </div>

      {/* Today's Activities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-header text-2xl mb-0">Today's Activities</h2>
            <p className="text-sm text-gray-500">आज की गतिविधियाँ · Fun & simple exercises</p>
          </div>
          <button
            onClick={() => navigate('activity')}
            className="btn-ghost text-sm font-600"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {todaysPlan.activities.map((activity) => {
            const game = gameLibrary.find(g => g.type === activity.gameType);
            return (
              <button
                key={activity.id}
                onClick={() => navigate(`activity:${activity.gameType}`)}
                className={`w-full card flex items-center gap-4 p-4 text-left transition-all duration-200 ${
                  activity.completed
                    ? 'bg-sage-50/60 border border-sage-200'
                    : 'card-hover border-2 border-transparent hover:border-sky-200'
                }`}
              >
                <div className={`text-3xl w-14 h-14 flex items-center justify-center rounded-2xl ${game?.bgColor ?? 'bg-gray-100 border-gray-200'} border-2 flex-shrink-0`}>
                  {game?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-700 text-gray-900 text-base">{activity.name}</span>
                    {activity.completed && (
                      <span className="badge bg-green-100 text-green-700 text-xs font-600">
                        <CheckCircle className="w-3.5 h-3.5" /> Completed!
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {activity.estimatedMinutes} min
                    </span>
                    <span className="text-gray-300">·</span>
                    <span>Scheduled for {activity.scheduledTime}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">Enjoy a calm and relaxing exercise</p>
                </div>
                {!activity.completed ? (
                  <div className="btn-primary py-2.5 px-5 text-sm font-700 flex-shrink-0 shadow-soft">
                    Start Activity
                  </div>
                ) : (
                  <div className="btn-ghost py-2 px-3 text-xs text-sage-700 font-600 flex-shrink-0">
                    Play Again
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Fun Activities Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Favorite Music & Reminiscence */}
        <div className="card bg-gradient-to-br from-amber-50 to-cream-50 border border-amber-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">
              🎵
            </div>
            <div>
              <h3 className="font-display font-700 text-gray-900 text-lg">Music & Melodies</h3>
              <p className="text-xs text-gray-500">Listen to classic songs you love</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Relax and listen to familiar ragas, Lata Mangeshkar classics, and Rafi songs from your favorite era.
          </p>
          <button
            onClick={() => navigate('activity:music-recognition')}
            className="btn-warm w-full text-base py-3 font-700"
          >
            <Music className="w-4 h-4" />
            Listen to Music Session
          </button>
        </div>

        {/* Memory Gallery Quick Card */}
        <div className="card bg-gradient-to-br from-rose-50 to-cream-50 border border-rose-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-xl">
              🖼️
            </div>
            <div>
              <h3 className="font-display font-700 text-gray-900 text-lg">Family Memories</h3>
              <p className="text-xs text-gray-500">Explore photos of family & special places</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Look through photos from Jaipur, family gatherings, and beautiful places uploaded by Priya.
          </p>
          <button
            onClick={() => navigate('memories')}
            className="btn bg-rose-500 hover:bg-rose-600 text-white w-full text-base py-3 font-700 shadow-soft"
          >
            <Image className="w-4 h-4" />
            Open Memory Gallery
          </button>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div>
        <h2 className="text-xl font-display font-700 text-gray-900 mb-3">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'All Games', emoji: '🎮', page: 'games' },
            { label: 'Voice Companion', emoji: '🎙️', page: 'voice' },
            { label: 'Memory Universe', emoji: '🌟', page: 'universe' },
            { label: 'Daily Simulations', emoji: '🛒', page: 'reallife' },
          ].map(({ label, emoji, page }) => (
            <button
              key={label}
              onClick={() => navigate(page)}
              className="card card-hover p-4 text-center border border-gray-100"
            >
              <div className="text-3xl mb-2">{emoji}</div>
              <div className="text-sm font-display font-700 text-gray-800">{label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
