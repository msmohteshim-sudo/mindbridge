import { useState, useCallback } from 'react';
import { RotateCcw, ChevronRight, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

// ─── Memory Match Game ────────────────────────────────────────────────────
const CARD_EMOJIS = ['🌸', '🐘', '🎵', '🏠', '🌳', '☀️', '🎨', '🦋'];

interface Card { id: number; emoji: string; isFlipped: boolean; isMatched: boolean; }

function MemoryMatchGame({ difficulty, onComplete }: { difficulty: number; onComplete: (score: number) => void }) {
  const pairs = Math.min(4 + difficulty, 8);
  const emojis = CARD_EMOJIS.slice(0, pairs);

  const [cards, setCards] = useState<Card[]>(() =>
    [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, isFlipped: false, isMatched: false }))
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  const handleFlip = useCallback((id: number) => {
    if (selected.length === 2) return;
    if (cards[id].isFlipped || cards[id].isMatched) return;
    const newCards = cards.map(c => c.id === id ? { ...c, isFlipped: true } : c);
    setCards(newCards);
    const newSelected = [...selected, id];
    setSelected(newSelected);
    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newSelected;
      if (newCards[a].emoji === newCards[b].emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === a || c.id === b ? { ...c, isMatched: true } : c));
          setMatches(m => {
            if (m + 1 === pairs) onComplete(Math.max(40, 100 - moves * 2));
            return m + 1;
          });
          setSelected([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === a || c.id === b ? { ...c, isFlipped: false } : c));
          setSelected([]);
        }, 1000);
      }
    }
  }, [cards, selected, moves, matches, pairs, onComplete]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
        <span>Matches: {matches}/{pairs}</span>
        <span>Moves: {moves}</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            className={`aspect-square rounded-2xl text-4xl flex items-center justify-center transition-all duration-300 border-2 ${
              card.isMatched ? 'bg-sage-100 border-sage-300 scale-95'
              : card.isFlipped ? 'bg-sky-100 border-sky-300'
              : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
            }`}
            disabled={card.isFlipped || card.isMatched}
          >
            {(card.isFlipped || card.isMatched) ? card.emoji : '❓'}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Object Recognition Game ───────────────────────────────────────────────
const OBJECTS = [
  { image: '🍎', name: 'Apple',  options: ['Apple', 'Mango', 'Orange', 'Banana'] },
  { image: '🚂', name: 'Train',  options: ['Bus', 'Train', 'Car', 'Bicycle'] },
  { image: '🌷', name: 'Flower', options: ['Tree', 'Grass', 'Flower', 'Leaf'] },
  { image: '⌚', name: 'Watch',  options: ['Clock', 'Watch', 'Phone', 'Compass'] },
  { image: '🏺', name: 'Pot',    options: ['Bowl', 'Cup', 'Pot', 'Plate'] },
  { image: '🪔', name: 'Lamp',   options: ['Candle', 'Torch', 'Lamp', 'Bulb'] },
];

function ObjectRecognitionGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const item = OBJECTS[current];

  const handleAnswer = (answer: string) => {
    setSelected(answer);
    if (answer === item.name) setCorrect(c => c + 1);
    setTimeout(() => {
      if (current + 1 >= OBJECTS.length) {
        onComplete(Math.round(((correct + (answer === item.name ? 1 : 0)) / OBJECTS.length) * 100));
      } else { setCurrent(c => c + 1); setSelected(null); }
    }, 1000);
  };

  return (
    <div className="text-center">
      <div className="text-sm text-gray-500 mb-4">Question {current + 1} of {OBJECTS.length}</div>
      <div className="text-8xl mb-6 animate-breathe">{item.image}</div>
      <p className="text-xl font-700 text-gray-900 mb-6">What is this?</p>
      <div className="grid grid-cols-2 gap-3">
        {item.options.map(opt => (
          <button
            key={opt}
            onClick={() => !selected && handleAnswer(opt)}
            className={`py-4 rounded-2xl text-lg font-700 border-2 transition-all ${
              selected
                ? opt === item.name ? 'bg-sage-100 border-sage-400 text-sage-700'
                  : opt === selected ? 'bg-red-100 border-red-400 text-red-700'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
                : 'bg-white border-gray-200 hover:border-sky-300 hover:bg-sky-50 text-gray-800'
            }`}
          >
            {opt}{selected && opt === item.name && ' ✓'}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Story Completion Game ─────────────────────────────────────────────────
const STORIES = [
  { prompt: 'Every morning, Ramu would wake up and go to the river to fetch ___.', options: ['water', 'fish', 'stones', 'flowers'], answer: 'water', followup: "What do you think Ramu's village looked like?" },
  { prompt: 'The old banyan tree in the village square had been there for ___ years.', options: ['ten', 'hundred', 'twenty', 'five'], answer: 'hundred', followup: 'What stories might the banyan tree have witnessed?' },
  { prompt: 'Grandmother always made the best chai because she added extra ___.', options: ['ginger', 'sugar', 'milk', 'water'], answer: 'ginger', followup: 'What is your favourite memory of drinking chai?' },
];

function StoryCompletionGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const story = STORIES[current];

  const handleAnswer = (answer: string) => {
    setSelected(answer);
    if (answer === story.answer) setCorrect(c => c + 1);
    setTimeout(() => {
      if (current + 1 >= STORIES.length) {
        onComplete(Math.round(((correct + (answer === story.answer ? 1 : 0)) / STORIES.length) * 100));
      } else { setCurrent(c => c + 1); setSelected(null); }
    }, 1500);
  };

  return (
    <div>
      <div className="text-xs text-gray-400 mb-3">Story {current + 1} of {STORIES.length}</div>
      <div className="p-6 bg-cream-50 rounded-2xl border border-cream-200 mb-6">
        <p className="text-xl text-gray-800 leading-relaxed font-500">{story.prompt}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {story.options.map(opt => (
          <button
            key={opt}
            onClick={() => !selected && handleAnswer(opt)}
            className={`py-4 rounded-2xl text-lg font-700 border-2 transition-all capitalize ${
              selected
                ? opt === story.answer ? 'bg-sage-100 border-sage-400 text-sage-700'
                  : opt === selected ? 'bg-red-100 border-red-400 text-red-700'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
                : 'bg-white border-gray-200 hover:border-sky-300 hover:bg-sky-50 text-gray-800'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected && (
        <div className="p-4 bg-lavender-50 rounded-2xl border border-lavender-200">
          <p className="text-lavender-800 font-600">💭 {story.followup}</p>
        </div>
      )}
    </div>
  );
}

// ─── Mindful Colouring (Mandala) ───────────────────────────────────────────
const COLORS = ['#F87171','#FB923C','#FBBF24','#4ADE80','#60A5FA','#A78BFA','#F472B6','#34D399'];
const SEGMENTS = [0,1,2,3,4,5,6,7,8,9,10,11];

function ColoringGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [colored, setColored] = useState<Record<number, string>>({});
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [finished, setFinished] = useState(false);

  const colorSegment = (seg: number) => {
    const newColored = { ...colored, [seg]: activeColor };
    setColored(newColored);
    if (Object.keys(newColored).length >= SEGMENTS.length && !finished) {
      setFinished(true);
      setTimeout(() => onComplete(90), 1000);
    }
  };

  return (
    <div className="text-center">
      <p className="text-gray-600 mb-4">Choose a colour and tap the petals to colour them</p>
      <div className="flex gap-3 justify-center mb-6 flex-wrap">
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => setActiveColor(c)}
            className={`w-10 h-10 rounded-full transition-transform ${activeColor === c ? 'scale-125 ring-4 ring-gray-400 ring-offset-2' : 'hover:scale-110'}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <svg viewBox="0 0 300 300" className="w-64 h-64">
          {SEGMENTS.map(i => {
            const angle = (i / SEGMENTS.length) * 360;
            const fill = colored[i] || '#f3f4f6';
            return (
              <g key={i} transform={`rotate(${angle}, 150, 150)`}>
                <path
                  d="M150,150 L150,60 A90,90 0 0,1 180,67 Z"
                  fill={fill}
                  stroke="white"
                  strokeWidth="2"
                  onClick={() => colorSegment(i)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
                <circle
                  cx={150 + 60 * Math.sin((angle * Math.PI) / 180)}
                  cy={150 - 60 * Math.cos((angle * Math.PI) / 180)}
                  r="8"
                  fill={colored[i] || '#e5e7eb'}
                  onClick={() => colorSegment(i)}
                  className="cursor-pointer hover:opacity-80"
                />
              </g>
            );
          })}
          <circle cx="150" cy="150" r="30" fill="#fef3c7" stroke="white" strokeWidth="2" />
          <text x="150" y="155" textAnchor="middle" fontSize="20">🌸</text>
        </svg>
      </div>
      {finished && <p className="text-sage-700 font-700 mt-4 animate-fade-in">Beautiful! Your mandala is complete 🎨</p>}
    </div>
  );
}

// ─── Sequence Arrangement Game ─────────────────────────────────────────────
const SEQUENCES = [
  {
    title: 'Morning Routine',
    emoji: '🌅',
    steps: [
      { label: 'Wake up', emoji: '⏰', order: 1 },
      { label: 'Brush teeth', emoji: '🪥', order: 2 },
      { label: 'Take a bath', emoji: '🚿', order: 3 },
      { label: 'Have breakfast', emoji: '🍳', order: 4 },
      { label: 'Take medicine', emoji: '💊', order: 5 },
    ],
  },
  {
    title: 'Writing a Letter',
    emoji: '✉️',
    steps: [
      { label: 'Get paper and pen', emoji: '📝', order: 1 },
      { label: 'Write the greeting', emoji: '👋', order: 2 },
      { label: 'Write the message', emoji: '📖', order: 3 },
      { label: 'Sign your name', emoji: '✍️', order: 4 },
      { label: 'Put in envelope', emoji: '📬', order: 5 },
    ],
  },
];

type SeqStep = { label: string; emoji: string; order: number };

function SequenceArrangementGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [seqIdx] = useState(() => Math.floor(Math.random() * SEQUENCES.length));
  const sequence = SEQUENCES[seqIdx];
  const steps = sequence.steps;

  const [shuffled] = useState<SeqStep[]>(() => [...steps].sort(() => Math.random() - 0.5));
  const [arranged, setArranged] = useState<SeqStep[]>([]);

  const addStep = (step: SeqStep) => {
    if (arranged.find(s => s.order === step.order)) return;
    const newArr = [...arranged, step];
    setArranged(newArr);
    if (newArr.length === steps.length) {
      const correctCount = newArr.filter((s, i) => s.order === i + 1).length;
      onComplete(Math.round((correctCount / steps.length) * 100));
    }
  };

  const removeStep = (order: number) => {
    setArranged(prev => prev.filter(s => s.order !== order));
  };

  const remaining = shuffled.filter(s => !arranged.find(a => a.order === s.order));

  return (
    <div>
      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mb-5 flex items-center gap-3">
        <span className="text-3xl">{sequence.emoji}</span>
        <div>
          <p className="font-700 text-indigo-900 text-sm">{sequence.title}</p>
          <p className="text-xs text-indigo-600">Arrange the steps in the correct order</p>
        </div>
      </div>

      {/* Available steps to pick */}
      {remaining.length > 0 && (
        <div>
          <p className="text-xs font-700 text-gray-500 uppercase tracking-wide mb-2">Tap to arrange:</p>
          <div className="grid grid-cols-1 gap-2 mb-5">
            {remaining.map(step => (
              <button
                key={step.order}
                onClick={() => addStep(step)}
                className="flex items-center gap-3 p-3 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left"
              >
                <span className="text-2xl">{step.emoji}</span>
                <span className="text-sm font-600 text-gray-700">{step.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Arranged sequence */}
      {arranged.length > 0 && (
        <div>
          <p className="text-xs font-700 text-gray-500 uppercase tracking-wide mb-2">
            Your sequence ({arranged.length}/{steps.length}):
          </p>
          <div className="space-y-2">
            {arranged.map((step, i) => {
              const isCorrect = step.order === i + 1;
              return (
                <div
                  key={step.order}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 ${
                    isCorrect ? 'border-sage-300 bg-sage-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-800 flex-shrink-0 text-white ${isCorrect ? 'bg-sage-500' : 'bg-red-400'}`}>
                    {i + 1}
                  </span>
                  <span className="text-xl">{step.emoji}</span>
                  <span className={`text-sm font-600 flex-1 ${isCorrect ? 'text-sage-800' : 'text-red-700'}`}>
                    {step.label}
                  </span>
                  {isCorrect
                    ? <span className="text-sage-500 text-sm">✓</span>
                    : <button onClick={() => removeStep(step.order)} className="text-xs text-red-400 hover:text-red-600">✕ Remove</button>
                  }
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Music Recognition Game ────────────────────────────────────────────────
const MUSIC_CLIPS = [
  { title: 'Raag Bhairav',       hint: 'Played at dawn — a peaceful morning raga', emoji: '🎶', genre: 'Classical Raga',  correct: 'Bhairav'      },
  { title: 'Aye Mere Watan',     hint: 'A patriotic song that moved the nation',   emoji: '🎵', genre: 'Patriotic',      correct: 'Aye Mere Watan' },
  { title: 'Tujh Mein Rab',      hint: 'A romantic Bollywood melody',              emoji: '🎸', genre: 'Bollywood',      correct: 'Tujh Mein Rab'  },
  { title: 'Raag Yaman',         hint: 'Played at dusk, an evening raga',          emoji: '🪕', genre: 'Classical Raga',  correct: 'Yaman'         },
  { title: 'Lag Ja Gale',        hint: 'A classic by Lata Mangeshkar',             emoji: '🎤', genre: 'Bollywood',      correct: 'Lag Ja Gale'   },
];

function MusicRecognitionGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [playing, setPlaying] = useState(false);
  const clip = MUSIC_CLIPS[current];

  const shuffledOptions = () => {
    const others = MUSIC_CLIPS.filter((_, i) => i !== current).map(c => c.correct);
    const opts = [clip.correct, ...others.sort(() => Math.random() - 0.5).slice(0, 3)];
    return opts.sort(() => Math.random() - 0.5);
  };
  const [options] = useState<string[]>(() => shuffledOptions());

  const handleAnswer = (answer: string) => {
    if (selected) return;
    setSelected(answer);
    if (answer === clip.correct) setCorrect(c => c + 1);
    setTimeout(() => {
      if (current + 1 >= MUSIC_CLIPS.length) {
        onComplete(Math.round(((correct + (answer === clip.correct ? 1 : 0)) / MUSIC_CLIPS.length) * 100));
      } else { setCurrent(c => c + 1); setSelected(null); setPlaying(false); }
    }, 1500);
  };

  return (
    <div className="text-center">
      <div className="text-xs text-gray-400 mb-3">Clip {current + 1} of {MUSIC_CLIPS.length}</div>
      {/* Music player mock */}
      <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200 mb-6">
        <div className="text-6xl mb-3">{clip.emoji}</div>
        <p className="text-sm font-600 text-amber-800 mb-1">{clip.genre}</p>
        <p className="text-xs text-amber-600 italic mb-5">"{clip.hint}"</p>
        <button
          onClick={() => setPlaying(p => !p)}
          className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl transition-all shadow-medium ${
            playing ? 'bg-amber-500 text-white scale-95' : 'bg-white text-amber-600 hover:bg-amber-50'
          }`}
        >
          {playing ? '⏸' : '▶️'}
        </button>
        {playing && (
          <div className="mt-3 flex justify-center gap-1">
            {[1,2,3,4,5,6,7,8].map(b => (
              <div
                key={b}
                className="w-1 bg-amber-400 rounded-full animate-pulse"
                style={{ height: `${Math.random() * 20 + 8}px`, animationDelay: `${b * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-base font-700 text-gray-800 mb-4">Which song/raga is this? 🎵</p>
      <div className="grid grid-cols-2 gap-3">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className={`py-4 px-3 rounded-2xl text-sm font-700 border-2 transition-all ${
              selected
                ? opt === clip.correct ? 'bg-sage-100 border-sage-400 text-sage-700'
                  : opt === selected ? 'bg-red-100 border-red-400 text-red-700'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
                : 'bg-white border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-gray-800'
            }`}
          >
            {opt}{selected && opt === clip.correct && ' ✓'}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Family Memory Game ────────────────────────────────────────────────────
const FAMILY_MEMORIES = [
  {
    photo: '🏰',
    caption: 'Jaipur family trip — 2018',
    question: 'How many people went on this trip?',
    options: ['3', '5', '7', '4'],
    correct: '5',
    context: 'You, Priya, Rohan, his wife, and little Aarav went together.',
  },
  {
    photo: '🎂',
    caption: "Priya's Birthday — March 2020",
    question: 'What flavour was the birthday cake?',
    options: ['Chocolate', 'Vanilla', 'Mango', 'Strawberry'],
    correct: 'Mango',
    context: "Priya's favourite — mango cream cake from the bakery near the house.",
  },
  {
    photo: '🌺',
    caption: 'Garden in Dehradun — 2019',
    question: 'Who planted these flowers?',
    options: ['You', 'Priya', 'Rohan', 'Your neighbour'],
    correct: 'You',
    context: 'You planted marigolds and roses every year for Diwali decoration.',
  },
];

function FamilyMemoryGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const mem = FAMILY_MEMORIES[current];

  const handleAnswer = (answer: string) => {
    if (selected) return;
    setSelected(answer);
    if (answer === mem.correct) setCorrect(c => c + 1);
    setTimeout(() => {
      if (current + 1 >= FAMILY_MEMORIES.length) {
        onComplete(Math.round(((correct + (answer === mem.correct ? 1 : 0)) / FAMILY_MEMORIES.length) * 100));
      } else { setCurrent(c => c + 1); setSelected(null); }
    }, 2000);
  };

  return (
    <div>
      <div className="text-xs text-gray-400 mb-3">Memory {current + 1} of {FAMILY_MEMORIES.length}</div>
      {/* Photo card */}
      <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl border border-rose-200 text-center mb-6">
        <div className="text-7xl mb-3">{mem.photo}</div>
        <p className="text-sm font-700 text-rose-800">{mem.caption}</p>
      </div>

      <p className="font-700 text-gray-800 text-base mb-4">💭 {mem.question}</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {mem.options.map(opt => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className={`py-4 rounded-2xl text-base font-700 border-2 transition-all ${
              selected
                ? opt === mem.correct ? 'bg-sage-100 border-sage-400 text-sage-700'
                  : opt === selected ? 'bg-red-100 border-red-400 text-red-700'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
                : 'bg-white border-gray-200 hover:border-rose-300 hover:bg-rose-50 text-gray-800'
            }`}
          >
            {opt}{selected && opt === mem.correct && ' ✓'}
          </button>
        ))}
      </div>
      {selected && (
        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 animate-fade-in">
          <p className="text-rose-800 text-sm font-600">🌸 {mem.context}</p>
        </div>
      )}
    </div>
  );
}

// ─── GAMES registry ───────────────────────────────────────────────────────
const GAMES = [
  { type: 'music-recognition',    name: 'Music Recognition',    emoji: '🎵', description: 'Listen and identify familiar songs & ragas',        component: MusicRecognitionGame   },
  { type: 'family-memory',        name: 'Family Memories',       emoji: '👨‍👩‍👧', description: 'Remember stories and moments with your family',      component: FamilyMemoryGame       },
  { type: 'coloring-relaxation',  name: 'Mindful Colouring',    emoji: '🎨', description: 'Colour a calming mandala at your own pace',          component: ColoringGame           },
  { type: 'sequence-arrangement', name: 'Sequence Arrangement',  emoji: '📋', description: 'Arrange daily routine steps in the right order',     component: SequenceArrangementGame },
  { type: 'memory-match',         name: 'Memory Match',          emoji: '🃏', description: 'Flip cards and find matching pairs',                 component: MemoryMatchGame        },
  { type: 'object-recognition',   name: 'Object Recognition',    emoji: '🔍', description: 'Look at objects and name what you see',              component: ObjectRecognitionGame  },
  { type: 'story-completion',     name: 'Story Completion',      emoji: '📖', description: 'Complete the missing word in a short story',         component: StoryCompletionGame    },
];

// ─── Main Activity Page ────────────────────────────────────────────────────
export function ActivityPage({ initialGame }: { initialGame?: string }) {
  const { navigate, addSession } = useApp();
  const [activeGame, setActiveGame] = useState<string | null>(initialGame ?? null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(2);

  const game = GAMES.find(g => g.type === activeGame);

  const handleComplete = (finalScore: number) => {
    setScore(finalScore);
    setCompleted(true);
    addSession({
      id: `session-${Date.now()}`,
      activityType: activeGame as never,
      activityName: game?.name ?? 'Activity',
      completedAt: new Date().toISOString(),
      durationMinutes: 10,
      score: finalScore,
      difficulty,
      engagement: finalScore >= 75 ? 'high' : finalScore >= 50 ? 'medium' : 'low',
      domainScores: { memory: finalScore, attention: finalScore - 5 },
    });
  };

  // Completion screen
  if (completed && game) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-3xl font-display font-800 text-gray-900 mb-2">
          {score >= 75 ? 'Excellent work!' : 'Well done!'}
        </h2>
        <p className="text-gray-500 mb-6">You completed {game.name}</p>
        <div className="card w-full max-w-sm mb-6">
          <div className="text-5xl font-display font-800 text-sky-600 mb-2">{score}%</div>
          <p className="text-gray-500 text-sm">Engagement Score</p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Memory',     value: score },
              { label: 'Attention',  value: Math.max(score - 8,  40) },
              { label: 'Processing', value: Math.max(score - 12, 35) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-sky-50 rounded-2xl p-3">
                <div className="font-700 text-sky-700">{value}%</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setCompleted(false); setActiveGame(null); }} className="btn-secondary">
            <RotateCcw className="w-4 h-4" /> Try another
          </button>
          <button onClick={() => navigate('dashboard')} className="btn-primary">
            Return home <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Active game screen
  if (activeGame && game) {
    const GameComponent = game.component;
    return (
      <div>
        <button onClick={() => setActiveGame(null)} className="btn-ghost mb-4">← Back</button>
        <div className="card max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{game.emoji}</span>
            <div>
              <h2 className="text-2xl font-display font-800 text-gray-900">{game.name}</h2>
              <p className="text-gray-500 text-sm">Take your time · No rush</p>
            </div>
          </div>
          <GameComponent difficulty={difficulty} onComplete={handleComplete} />
        </div>
      </div>
    );
  }

  // Game picker
  return (
    <div>
      <div className="mb-6">
        <h1 className="section-header">Today's Session</h1>
        <p className="section-subheader">आज की गतिविधि · Choose any activity to begin</p>
      </div>

      <div className="disclaimer-banner mb-6">
        <strong>🌟 Remember:</strong> These activities are for gentle cognitive engagement and enjoyment.
        There are no wrong answers, and you can stop anytime. Take your time.
      </div>

      {/* Difficulty */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-sky-500" />
          <h2 className="font-display font-700 text-gray-900">Comfort Level</h2>
        </div>
        <div className="flex gap-3">
          {([1, 2, 3] as const).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`flex-1 py-3 rounded-2xl border-2 font-700 transition-all ${
                difficulty === d
                  ? 'border-sky-400 bg-sky-50 text-sky-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {d === 1 ? '🌱 Easy' : d === 2 ? '🌿 Medium' : '🌳 Gentle challenge'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {GAMES.map(g => (
          <button
            key={g.type}
            onClick={() => setActiveGame(g.type)}
            className="card card-hover text-left p-6"
          >
            <div className="text-4xl mb-3">{g.emoji}</div>
            <h3 className="text-xl font-display font-700 text-gray-900 mb-1">{g.name}</h3>
            <p className="text-gray-500 text-sm mb-4">{g.description}</p>
            <div className="btn-primary py-2 px-4 text-sm inline-flex w-auto">Start Activity →</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Export game type map for Dashboard to use
export { GAMES };
