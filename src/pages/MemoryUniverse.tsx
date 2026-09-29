import { useState } from 'react';
import { Star, Heart, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const UNIVERSE_NODES = [
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', angle: 0, description: 'People who matter most', memories: 3, color: 'bg-rose-100 border-rose-200 text-rose-700' },
  { id: 'places', label: 'Places', emoji: '📍', angle: 60, description: 'Locations close to the heart', memories: 2, color: 'bg-sky-100 border-sky-200 text-sky-700' },
  { id: 'work', label: 'Career', emoji: '💼', angle: 120, description: 'Professional journey', memories: 1, color: 'bg-warm-100 border-warm-200 text-warm-700' },
  { id: 'music', label: 'Music', emoji: '🎵', angle: 180, description: 'Songs and melodies', memories: 2, color: 'bg-amber-100 border-amber-200 text-amber-700' },
  { id: 'hobbies', label: 'Hobbies', emoji: '🌱', angle: 240, description: 'Passions and pastimes', memories: 4, color: 'bg-sage-100 border-sage-200 text-sage-700' },
  { id: 'celebrations', label: 'Celebrations', emoji: '🎉', angle: 300, description: 'Joyful moments', memories: 3, color: 'bg-lavender-100 border-lavender-200 text-lavender-700' },
];

const MEMORY_PROMPTS: Record<string, string[]> = {
  family: [
    'Who is the first person that comes to mind when you think of home?',
    'Tell me about your favourite meal that someone cooked for you.',
    'What is a saying or piece of advice a family member gave you?',
  ],
  places: [
    'Which place in your life always made you feel peaceful?',
    'Describe the sights and sounds of a place you loved visiting.',
    'Where did you go on your most memorable journey?',
  ],
  work: [
    'What was the proudest moment in your working life?',
    'Who was your most memorable colleague or boss?',
    'Describe a typical day at your favourite job.',
  ],
  music: [
    'What song takes you straight back to your youth?',
    'Do you remember the first concert or music event you attended?',
    'Which singer or musician did you admire most?',
  ],
  hobbies: [
    'When did you first discover your favourite hobby?',
    'Describe the most beautiful garden, chess game, or creative project you worked on.',
    'Who taught you your favourite skill or hobby?',
  ],
  celebrations: [
    'Describe your most joyful festival celebration.',
    'What is your happiest birthday or wedding memory?',
    'Tell me about a celebration that brought everyone together.',
  ],
};

export function MemoryUniverse() {
  const { memories, navigate } = useApp();
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [response, setResponse] = useState('');
  const [savedResponses, setSavedResponses] = useState<Record<string, string>>({});

  const node = UNIVERSE_NODES.find(n => n.id === activeNode);
  const prompts = activeNode ? MEMORY_PROMPTS[activeNode] : [];

  const handleSave = () => {
    if (!response.trim() || !activeNode) return;
    setSavedResponses(prev => ({ ...prev, [`${activeNode}-${currentPrompt}`]: response }));
    setResponse('');
    if (currentPrompt + 1 < prompts.length) {
      setCurrentPrompt(p => p + 1);
    }
  };

  if (activeNode && node) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <button onClick={() => { setActiveNode(null); setCurrentPrompt(0); setResponse(''); }} className="btn-ghost mb-4">
          ← Back to Universe
        </button>

        <div className={`card border-2 ${node.color.split(' ')[0]} p-6 mb-6`}>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{node.emoji}</span>
            <div>
              <h2 className="text-2xl font-display font-800 text-gray-900">{node.label}</h2>
              <p className="text-gray-500">{node.description}</p>
            </div>
          </div>

          {/* Prompt */}
          <div className="p-5 bg-lavender-50 rounded-2xl border border-lavender-200 mb-4">
            <div className="flex items-start gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-lavender-500 flex-shrink-0 mt-0.5" />
              <p className="text-lg font-600 text-lavender-900 leading-relaxed">{prompts[currentPrompt]}</p>
            </div>
            <div className="flex gap-2">
              {prompts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPrompt(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentPrompt ? 'bg-lavender-500' : 'bg-lavender-200'}`}
                />
              ))}
            </div>
          </div>

          <textarea
            value={response}
            onChange={e => setResponse(e.target.value)}
            placeholder="Share your memory in your own words — any language is welcome..."
            className="input-field resize-none mb-4"
            rows={5}
          />

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentPrompt(p => (p + 1) % prompts.length)}
              className="btn-ghost"
            >
              Skip this question
            </button>
            <button
              onClick={handleSave}
              disabled={!response.trim()}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              <Heart className="w-4 h-4" />
              Save this memory
            </button>
          </div>
        </div>

        {/* Saved responses */}
        {Object.keys(savedResponses).filter(k => k.startsWith(activeNode)).length > 0 && (
          <div className="card">
            <h3 className="font-display font-700 text-gray-900 mb-3">Your saved memories</h3>
            {Object.entries(savedResponses)
              .filter(([k]) => k.startsWith(activeNode))
              .map(([key, val]) => {
                const [, pIndex] = key.split('-');
                return (
                  <div key={key} className="p-3 bg-cream-50 rounded-2xl border border-cream-200 mb-2">
                    <p className="text-xs text-gray-400 mb-1">{prompts[parseInt(pIndex)]}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{val}</p>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-header">Personal Memory Universe</h1>
        <p className="section-subheader">यादों का ब्रह्मांड · Explore the universe of your memories</p>
      </div>

      <div className="p-5 bg-lavender-50 rounded-2xl border border-lavender-200 mb-6">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-lavender-500 flex-shrink-0 mt-0.5" />
          <p className="text-lavender-800 text-sm leading-relaxed">
            <strong>Welcome to your Memory Universe.</strong> Each sphere represents a chapter of your life.
            Tap any sphere to explore memories, answer gentle questions, and build your personal story —
            which your AI companion will use to make activities more meaningful.
          </p>
        </div>
      </div>

      {/* Universe Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {UNIVERSE_NODES.map(node => (
          <button
            key={node.id}
            onClick={() => setActiveNode(node.id)}
            className={`card card-hover p-6 text-center border-2 ${node.color}`}
          >
            <div className="text-5xl mb-3 animate-float">{node.emoji}</div>
            <div className="font-display font-700 text-gray-900 text-lg mb-1">{node.label}</div>
            <div className="text-sm text-gray-500 mb-3">{node.description}</div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <Star className="w-3 h-3" />
              <span>{node.memories} memories</span>
            </div>
            {savedResponses && Object.keys(savedResponses).some(k => k.startsWith(node.id)) && (
              <span className="mt-2 inline-block text-xs bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full">
                ✓ Explored
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Recent Memories from Gallery */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-700 text-gray-900">Recent Memories</h2>
          <button onClick={() => navigate('memories')} className="text-sky-600 text-sm font-600 hover:text-sky-700">
            View gallery →
          </button>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {memories.slice(0, 3).map(m => (
            <button
              key={m.id}
              onClick={() => navigate('memories')}
              className="p-3 bg-cream-50 rounded-2xl border border-cream-200 text-left hover:border-sky-300 transition-all"
            >
              {m.imageUrl && (
                <img src={m.imageUrl} alt={m.title} className="w-full h-24 object-cover rounded-xl mb-2" />
              )}
              <div className="font-600 text-gray-900 text-sm">{m.title}</div>
              <div className="text-xs text-gray-400 mt-1">{m.year}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
