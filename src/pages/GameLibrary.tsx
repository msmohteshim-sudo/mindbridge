import { useState } from 'react';
import { Search, Clock, ChevronRight, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { gameLibrary } from '../data/demoData';

const CATEGORIES = [
  { id: 'all', label: 'All Activities', emoji: '✨' },
  { id: 'memory', label: 'Memory', emoji: '🧠' },
  { id: 'attention', label: 'Attention', emoji: '👁️' },
  { id: 'language', label: 'Language', emoji: '💬' },
  { id: 'executive', label: 'Planning', emoji: '📋' },
  { id: 'relaxation', label: 'Relaxation', emoji: '🎨' },
  { id: 'reallife', label: 'Real Life', emoji: '🏠' },
  { id: 'social', label: 'Memories', emoji: '❤️' },
];

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Gentle',
  2: 'Comfortable',
  3: 'Engaging',
  4: 'Stimulating',
  5: 'Challenging',
};

export function GameLibrary() {
  const { navigate } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [favourites] = useState<string[]>(['music-recognition', 'family-memory', 'coloring-relaxation']);

  const filtered = gameLibrary.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || g.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="section-header">Activity Library</h1>
        <p className="section-subheader">गतिविधि पुस्तकालय · 12 personalised activities</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="search"
          placeholder="Search activities..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-12"
          aria-label="Search activities"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap text-sm font-600 transition-all border-2 ${
              category === cat.id
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Favourites Section */}
      {category === 'all' && !search && (
        <div className="mb-6">
          <h2 className="text-lg font-display font-700 text-gray-900 mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            Arjun's Favourites
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {gameLibrary
              .filter(g => favourites.includes(g.type))
              .map(game => (
                <button
                  key={game.type}
                  onClick={() => navigate('activity')}
                  className={`card card-hover p-5 text-left border-2 ${game.bgColor}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{game.icon}</span>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </div>
                  <div className={`font-display font-700 ${game.color}`}>{game.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{game.minDuration}–{game.maxDuration} min</div>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* All Games Grid */}
      <div>
        <h2 className="text-lg font-display font-700 text-gray-900 mb-3">
          {filtered.length} {filtered.length === 1 ? 'Activity' : 'Activities'}
        </h2>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <p>No activities found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map(game => (
              <div
                key={game.type}
                className={`card border-2 ${game.bgColor}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl flex-shrink-0">{game.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-display font-700 ${game.color}`}>{game.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{game.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {game.minDuration}–{game.maxDuration} min
                  </span>
                  <span className="text-gray-300">·</span>
                  <span>Targets: {game.cognitiveTargets.slice(0, 2).join(', ')}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {[1, 2, 3].map(d => (
                      <span
                        key={d}
                        className={`text-xs px-2 py-1 rounded-full border ${
                          d === 2
                            ? 'bg-sky-100 border-sky-200 text-sky-700'
                            : 'bg-gray-100 border-gray-200 text-gray-500'
                        }`}
                      >
                        {DIFFICULTY_LABELS[d]}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('activity')}
                    className="btn-primary py-2 px-4 text-sm"
                  >
                    Play
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
