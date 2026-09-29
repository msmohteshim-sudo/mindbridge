import { useState } from 'react';
import { ShoppingCart, CheckCircle, RotateCcw, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

// ─── Activity catalogue ────────────────────────────────────────────────────
const ACTIVITIES = [
  {
    id: 'shopping',
    name: 'Market Visit',
    description: 'Visit the virtual market and buy items from your shopping list',
    emoji: '🛒',
    instructions: 'Your caregiver asked you to buy: Milk, Bread, and Tomatoes. Find them in the market and add them to your basket.',
    successMessage: '🌟 Wonderful! You bought all the right items.',
  },
  {
    id: 'phone',
    name: 'Make a Phone Call',
    description: 'Navigate the phone to call your family member',
    emoji: '📞',
    instructions: 'Your daughter Priya wants you to call her. Find her number in the contacts and make the call.',
    successMessage: '📞 You called Priya successfully! She is happy to hear from you.',
  },
  {
    id: 'tea',
    name: 'Making Tea',
    description: 'Follow the steps to make a perfect cup of chai',
    emoji: '☕',
    instructions: "Let's make your favourite morning chai! Tap the steps in the correct order.",
    successMessage: '☕ Perfect! Your chai is ready. Enjoy!',
  },
  {
    id: 'calendar',
    name: 'Calendar Reading',
    description: "Identify today's date and upcoming events",
    emoji: '📅',
    instructions: "Look at the calendar carefully and answer the questions about dates and events.",
    successMessage: '📅 Great job reading the calendar!',
  },
  {
    id: 'money',
    name: 'Counting Money',
    description: 'Practice counting coins and notes',
    emoji: '💰',
    instructions: 'Count the coins and notes shown and select the correct total amount.',
    successMessage: '💰 Excellent! You counted the money correctly!',
  },
  {
    id: 'medicine',
    name: 'Medication Reminder',
    description: 'Organise and track daily medicines',
    emoji: '💊',
    instructions: 'Match each medicine to its correct time of day — morning, afternoon, or night.',
    successMessage: '💊 Perfect! You organised your medicines correctly!',
  },
];

// ─── Shopping Activity ─────────────────────────────────────────────────────
const SHOP_ITEMS = [
  { id: 1, name: 'Milk 500ml',   emoji: '🥛', price: 28,  needed: true  },
  { id: 2, name: 'Whole Bread',  emoji: '🍞', price: 35,  needed: true  },
  { id: 3, name: 'Tomatoes (4)', emoji: '🍅', price: 20,  needed: true  },
  { id: 4, name: 'Apple Juice',  emoji: '🧃', price: 60,  needed: false },
  { id: 5, name: 'Biscuits',     emoji: '🍪', price: 30,  needed: false },
  { id: 6, name: 'Rice 1kg',     emoji: '🌾', price: 65,  needed: false },
];

function ShoppingActivity({ onComplete }: { onComplete: (score: number) => void }) {
  const [basket, setBasket] = useState<number[]>([]);

  const toggleItem = (id: number) =>
    setBasket(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleCheckout = () => {
    const needed = SHOP_ITEMS.filter(i => i.needed).map(i => i.id);
    const correctItems = needed.filter(id => basket.includes(id)).length;
    const extraItems = basket.filter(id => !needed.includes(id)).length;
    const score = Math.max(0, Math.round((correctItems / needed.length) * 100 - extraItems * 10));
    onComplete(score);
  };

  const total = basket.reduce((sum, id) => {
    const item = SHOP_ITEMS.find(i => i.id === id);
    return sum + (item?.price ?? 0);
  }, 0);

  return (
    <div>
      <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 mb-5">
        <p className="text-gray-700 font-600">📋 Shopping List: Milk, Bread, Tomatoes</p>
        <p className="text-sm text-gray-500 mt-1">Tap items to add them to your basket</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {SHOP_ITEMS.map(item => {
          const inBasket = basket.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                inBasket
                  ? 'border-sage-400 bg-sage-50'
                  : 'border-gray-200 hover:border-sky-300 hover:bg-sky-50'
              }`}
            >
              <div className="text-3xl mb-2">{item.emoji}</div>
              <div className="font-700 text-gray-900 text-sm">{item.name}</div>
              <div className="text-xs text-gray-500 mt-1">₹{item.price}</div>
              {inBasket && <div className="text-xs text-sage-600 mt-1 font-700">✓ In basket</div>}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-4">
        <div>
          <div className="font-700 text-gray-900">{basket.length} items selected</div>
          <div className="text-sm text-gray-500">Total: ₹{total}</div>
        </div>
        <button
          onClick={handleCheckout}
          disabled={basket.length === 0}
          className="btn-primary disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4" />
          Checkout
        </button>
      </div>
    </div>
  );
}

// ─── Phone Call Activity ───────────────────────────────────────────────────
function PhoneActivity({ onComplete }: { onComplete: (score: number) => void }) {
  const steps = ['Pick up phone', 'Open Contacts', 'Find Priya', 'Press Call'];
  const [doneSteps, setDoneSteps] = useState<number[]>([]);

  const handleStep = (i: number) => {
    if (doneSteps.includes(i)) return;
    const next = doneSteps.length;
    if (i !== next) return; // must go in order
    const updated = [...doneSteps, i];
    setDoneSteps(updated);
    if (updated.length === steps.length) onComplete(88);
  };

  return (
    <div className="text-center py-4">
      <div className="text-8xl mb-6">📱</div>
      <p className="text-sm text-gray-500 mb-4">Tap each step in order to make the call:</p>
      <div className="space-y-3">
        {steps.map((step, i) => {
          const isDone = doneSteps.includes(i);
          const isNext = doneSteps.length === i;
          return (
            <button
              key={step}
              onClick={() => handleStep(i)}
              disabled={isDone || !isNext}
              className={`w-full p-4 rounded-2xl border-2 font-700 text-gray-700 transition-all flex items-center gap-3 ${
                isDone
                  ? 'border-sage-400 bg-sage-50 text-sage-700'
                  : isNext
                  ? 'border-sky-400 bg-sky-50 hover:bg-sky-100'
                  : 'border-gray-200 opacity-50 cursor-not-allowed'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-800 flex-shrink-0 ${
                isDone ? 'bg-sage-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {isDone ? '✓' : i + 1}
              </span>
              {i + 1}. {step}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tea Activity ──────────────────────────────────────────────────────────
const TEA_STEPS = [
  { label: 'Put water in the pot', emoji: '💧', order: 1 },
  { label: 'Add tea leaves',       emoji: '🍃', order: 2 },
  { label: 'Add milk',             emoji: '🥛', order: 3 },
  { label: 'Add sugar and ginger', emoji: '🫚', order: 4 },
  { label: 'Boil for 3 minutes',   emoji: '🔥', order: 5 },
  { label: 'Pour into cup',        emoji: '☕', order: 6 },
];

function TeaActivity({ onComplete }: { onComplete: (score: number) => void }) {
  const [shuffled] = useState(() => [...TEA_STEPS].sort(() => Math.random() - 0.5));
  const [arranged, setArranged] = useState<typeof TEA_STEPS>([]);

  const addStep = (step: typeof TEA_STEPS[0]) => {
    if (arranged.find(s => s.order === step.order)) return;
    const newArr = [...arranged, step];
    setArranged(newArr);
    if (newArr.length === TEA_STEPS.length) {
      const isCorrect = newArr.every((s, i) => s.order === i + 1);
      onComplete(isCorrect ? 100 : 65);
    }
  };

  return (
    <div>
      <p className="text-gray-600 mb-4 text-sm">Tap the steps in the correct order to make chai:</p>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {shuffled
          .filter(s => !arranged.find(a => a.order === s.order))
          .map(step => (
            <button
              key={step.order}
              onClick={() => addStep(step)}
              className="flex items-center gap-3 p-3 rounded-2xl border-2 border-gray-200 hover:border-sky-400 hover:bg-sky-50 transition-all text-left"
            >
              <span className="text-2xl">{step.emoji}</span>
              <span className="text-sm font-600 text-gray-700">{step.label}</span>
            </button>
          ))}
      </div>
      {arranged.length > 0 && (
        <div>
          <p className="text-sm font-600 text-gray-500 mb-2">Your sequence:</p>
          <div className="space-y-2">
            {arranged.map((step, i) => (
              <div key={step.order} className="flex items-center gap-3 p-3 bg-sage-50 rounded-2xl border border-sage-200">
                <span className="w-6 h-6 bg-sage-500 text-white rounded-full text-sm flex items-center justify-center font-700 flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-xl">{step.emoji}</span>
                <span className="text-sm font-600 text-sage-800">{step.label}</span>
                {step.order === i + 1
                  ? <CheckCircle className="w-4 h-4 text-sage-500 ml-auto" />
                  : <span className="text-red-400 ml-auto text-xs">Wrong position</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Calendar Reading Activity ─────────────────────────────────────────────
const CALENDAR_QUESTIONS = [
  {
    q: 'What day of the week is the 15th?',
    options: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
    correct: 1, // Wednesday
  },
  {
    q: 'How many Sundays are in this month?',
    options: ['3', '4', '5', '2'],
    correct: 1, // 4
  },
  {
    q: "Which week does the doctor's appointment fall on?",
    options: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    correct: 2, // Week 3
  },
];

// A simple static calendar for October 2026
const CALENDAR_EVENTS: { day: number; label: string; color: string }[] = [
  { day: 8,  label: 'Family visit',        color: 'bg-sky-200 text-sky-800'   },
  { day: 15, label: "Doctor's appt.",      color: 'bg-red-100 text-red-700'   },
  { day: 22, label: 'Medicine review',     color: 'bg-amber-100 text-amber-700' },
  { day: 28, label: 'Birthday - Priya',    color: 'bg-pink-100 text-pink-700' },
];

function CalendarActivity({ onComplete }: { onComplete: (score: number) => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(CALENDAR_QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  // Oct 2026: starts on Thursday (day 0=Sun)
  const daysInMonth = 31;
  const firstDay = 4; // Thursday
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const handleAnswer = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setAnswers(prev => prev.map((a, i) => (i === qIdx ? optIdx : a)));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = CALENDAR_QUESTIONS.filter((q, i) => answers[i] === q.correct).length;
    onComplete(Math.round((correct / CALENDAR_QUESTIONS.length) * 100));
  };

  return (
    <div>
      {/* Mini calendar */}
      <div className="mb-5">
        <div className="text-center font-800 text-gray-800 mb-3 text-lg">📅 October 2026</div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-700 text-gray-500 mb-1">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map(b => <div key={`b${b}`} />)}
          {days.map(day => {
            const event = CALENDAR_EVENTS.find(e => e.day === day);
            return (
              <div
                key={day}
                className={`rounded-lg p-1 text-center min-h-[40px] flex flex-col items-center justify-start ${
                  event ? event.color : 'bg-gray-50 text-gray-700'
                } text-xs`}
              >
                <span className="font-700">{day}</span>
                {event && <span className="text-[9px] leading-tight mt-0.5">{event.label}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {CALENDAR_QUESTIONS.map((q, qi) => (
          <div key={qi} className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="font-700 text-gray-800 mb-3 text-sm">{qi + 1}. {q.q}</p>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, oi) => {
                const selected = answers[qi] === oi;
                const isCorrect = submitted && oi === q.correct;
                const isWrong = submitted && selected && oi !== q.correct;
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(qi, oi)}
                    disabled={submitted}
                    className={`p-3 rounded-xl border-2 text-sm font-600 transition-all ${
                      isCorrect ? 'border-sage-400 bg-sage-50 text-sage-800' :
                      isWrong   ? 'border-red-300 bg-red-50 text-red-700' :
                      selected  ? 'border-sky-400 bg-sky-50 text-sky-800' :
                                  'border-gray-200 hover:border-sky-300 text-gray-700'
                    }`}
                  >
                    {opt}
                    {isCorrect && ' ✓'}
                    {isWrong   && ' ✗'}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitted || answers.some(a => a === null)}
        className="btn-primary w-full mt-5 disabled:opacity-50"
      >
        Submit Answers
      </button>
    </div>
  );
}

// ─── Counting Money Activity ───────────────────────────────────────────────
const MONEY_ROUNDS = [
  {
    label: '2 × ₹10 coins + 1 × ₹5 coin',
    display: ['🪙₹10', '🪙₹10', '🪙₹5'],
    options: ['₹20', '₹25', '₹30', '₹15'],
    correct: 1, // ₹25
  },
  {
    label: '1 × ₹50 note + 3 × ₹10 coins',
    display: ['💵₹50', '🪙₹10', '🪙₹10', '🪙₹10'],
    options: ['₹70', '₹80', '₹60', '₹90'],
    correct: 1, // ₹80
  },
  {
    label: '2 × ₹100 notes + 1 × ₹50 note',
    display: ['💵₹100', '💵₹100', '💵₹50'],
    options: ['₹200', '₹250', '₹300', '₹150'],
    correct: 1, // ₹250
  },
];

function MoneyActivity({ onComplete }: { onComplete: (score: number) => void }) {
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const current = MONEY_ROUNDS[round];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const wasCorrect = idx === current.correct;
    if (wasCorrect) setCorrect(c => c + 1);

    setTimeout(() => {
      if (round + 1 < MONEY_ROUNDS.length) {
        setRound(r => r + 1);
        setSelected(null);
      } else {
        const finalCorrect = wasCorrect ? correct + 1 : correct;
        onComplete(Math.round((finalCorrect / MONEY_ROUNDS.length) * 100));
      }
    }, 1200);
  };

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-4">
        <span>Question {round + 1} of {MONEY_ROUNDS.length}</span>
        <span className="font-700 text-sage-700">✓ {correct} correct</span>
      </div>

      <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 mb-5 text-center">
        <p className="text-sm text-gray-600 mb-3 font-600">Count the money below:</p>
        <div className="flex flex-wrap gap-3 justify-center mb-3">
          {current.display.map((coin, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-full bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center text-xs font-800 text-yellow-800 shadow-soft"
            >
              {coin}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">{current.label}</p>
      </div>

      <p className="text-sm font-700 text-gray-700 mb-3">What is the total?</p>
      <div className="grid grid-cols-2 gap-3">
        {current.options.map((opt, i) => {
          const isCorrect = i === current.correct;
          const isSelected = selected === i;
          return (
            <button
              key={opt}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`p-4 rounded-2xl border-2 text-lg font-800 transition-all ${
                selected !== null && isCorrect ? 'border-sage-400 bg-sage-50 text-sage-800' :
                isSelected && !isCorrect       ? 'border-red-300 bg-red-50 text-red-700' :
                                                 'border-gray-200 hover:border-sky-400 hover:bg-sky-50 text-gray-800'
              }`}
            >
              {opt}
              {selected !== null && isCorrect && ' ✓'}
              {isSelected && !isCorrect       && ' ✗'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Medication Reminder Activity ──────────────────────────────────────────
const MEDICINES = [
  { id: 1, name: 'Amlodipine',   emoji: '💊', color: 'bg-red-100',    correct: 'Morning'   },
  { id: 2, name: 'Metformin',    emoji: '💉', color: 'bg-blue-100',   correct: 'Afternoon' },
  { id: 3, name: 'Atorvastatin', emoji: '🔵', color: 'bg-purple-100', correct: 'Night'     },
  { id: 4, name: 'Vitamin D',    emoji: '🌞', color: 'bg-yellow-100', correct: 'Morning'   },
  { id: 5, name: 'Pantoprazole', emoji: '🟠', color: 'bg-orange-100', correct: 'Afternoon' },
];
const TIME_SLOTS = ['Morning', 'Afternoon', 'Night'] as const;

function MedicineActivity({ onComplete }: { onComplete: (score: number) => void }) {
  const [assignments, setAssignments] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAssign = (medId: number, slot: string) => {
    if (submitted) return;
    setAssignments(prev => ({ ...prev, [medId]: slot }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = MEDICINES.filter(m => assignments[m.id] === m.correct).length;
    onComplete(Math.round((correct / MEDICINES.length) * 100));
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">Assign each medicine to its correct time of day:</p>

      {/* Time slot labels */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {TIME_SLOTS.map(slot => (
          <div key={slot} className="p-2 bg-sky-50 rounded-xl border border-sky-200 text-center text-xs font-700 text-sky-700">
            {slot === 'Morning' ? '🌅' : slot === 'Afternoon' ? '☀️' : '🌙'} {slot}
          </div>
        ))}
      </div>

      {/* Medicine cards */}
      <div className="space-y-3 mb-5">
        {MEDICINES.map(med => {
          const isCorrectSlot = submitted && assignments[med.id] === med.correct;
          const isWrongSlot   = submitted && assignments[med.id] && assignments[med.id] !== med.correct;
          return (
            <div
              key={med.id}
              className={`p-4 rounded-2xl border-2 transition-all ${
                isCorrectSlot ? 'border-sage-400 bg-sage-50' :
                isWrongSlot   ? 'border-red-300 bg-red-50' :
                                'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className={`w-10 h-10 rounded-xl ${med.color} flex items-center justify-center text-xl`}>
                  {med.emoji}
                </span>
                <div>
                  <div className="font-700 text-gray-900 text-sm">{med.name}</div>
                  {submitted && (
                    <div className={`text-xs font-600 ${isCorrectSlot ? 'text-sage-600' : 'text-red-500'}`}>
                      {isCorrectSlot ? '✓ Correct!' : `✗ Should be ${med.correct}`}
                    </div>
                  )}
                </div>
                {!submitted && assignments[med.id] && (
                  <span className="ml-auto text-xs font-700 text-sky-600 bg-sky-50 px-2 py-1 rounded-lg border border-sky-200">
                    {assignments[med.id]}
                  </span>
                )}
              </div>

              {!submitted && (
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      onClick={() => handleAssign(med.id, slot)}
                      className={`p-2 rounded-xl text-xs font-700 border-2 transition-all ${
                        assignments[med.id] === slot
                          ? 'border-sky-400 bg-sky-100 text-sky-800'
                          : 'border-gray-200 text-gray-600 hover:border-sky-300 hover:bg-sky-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitted || Object.keys(assignments).length < MEDICINES.length}
        className="btn-primary w-full disabled:opacity-50"
      >
        Submit
      </button>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export function RealLifeActivities() {
  const { navigate, addSession } = useApp();
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const activity = ACTIVITIES.find(a => a.id === activeActivity);

  const handleComplete = (finalScore: number) => {
    setScore(finalScore);
    setCompleted(true);
    addSession({
      id: `session-${Date.now()}`,
      activityType: 'daily-routine',
      activityName: activity?.name ?? 'Real Life Activity',
      completedAt: new Date().toISOString(),
      durationMinutes: 10,
      score: finalScore,
      difficulty: 2,
      engagement: finalScore >= 75 ? 'high' : 'medium',
      domainScores: { executiveFunction: finalScore, processingSpeed: finalScore - 10 },
    });
  };

  // ── Completion Screen ──────────────────────────────────────────────────
  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-lg mx-auto">
        <div className="text-6xl mb-4">🌟</div>
        <h2 className="text-3xl font-display font-800 text-gray-900 mb-2">Excellent work!</h2>
        <p className="text-gray-500 mb-2">You completed {activity?.name}</p>
        <p className="text-gray-500 text-sm mb-6 italic">{activity?.successMessage}</p>
        <div className="card w-full mb-6">
          <div className="text-5xl font-display font-800 text-sky-600 mb-2">{score}%</div>
          <p className="text-gray-500 text-sm">Engagement score</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setCompleted(false); setActiveActivity(null); }}
            className="btn-secondary"
          >
            <RotateCcw className="w-4 h-4" />
            Try another
          </button>
          <button onClick={() => navigate('dashboard')} className="btn-primary">
            Home <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── Active Activity ────────────────────────────────────────────────────
  if (activeActivity && activity) {
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setActiveActivity(null)} className="btn-ghost mb-4">← Back</button>
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{activity.emoji}</span>
            <div>
              <h2 className="text-2xl font-display font-800 text-gray-900">{activity.name}</h2>
              <p className="text-gray-500 text-sm">Take your time · No rush</p>
            </div>
          </div>
          <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 mb-6">
            <p className="text-gray-700">{activity.instructions}</p>
          </div>

          {activeActivity === 'shopping'  && <ShoppingActivity onComplete={handleComplete} />}
          {activeActivity === 'phone'     && <PhoneActivity    onComplete={handleComplete} />}
          {activeActivity === 'tea'       && <TeaActivity      onComplete={handleComplete} />}
          {activeActivity === 'calendar'  && <CalendarActivity onComplete={handleComplete} />}
          {activeActivity === 'money'     && <MoneyActivity    onComplete={handleComplete} />}
          {activeActivity === 'medicine'  && <MedicineActivity onComplete={handleComplete} />}
        </div>
      </div>
    );
  }

  // ── Activity Grid ──────────────────────────────────────────────────────
  return (
    <div>
      <div className="mb-6">
        <h1 className="section-header">Real-Life Activities</h1>
        <p className="section-subheader">दैनिक जीवन गतिविधियाँ · Practise everyday tasks gently</p>
      </div>

      <div className="p-4 bg-sage-50 rounded-2xl border border-sage-200 mb-6">
        <p className="text-sage-800 text-sm leading-relaxed">
          🏡 These activities simulate real-life cognitive tasks in a safe, gentle environment.
          They help practise everyday skills that support independent living.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {ACTIVITIES.map(act => (
          <button
            key={act.id}
            onClick={() => setActiveActivity(act.id)}
            className="card card-hover text-left p-6"
          >
            <div className="text-5xl mb-4">{act.emoji}</div>
            <h3 className="text-xl font-display font-700 text-gray-900 mb-2">{act.name}</h3>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">{act.description}</p>
            <div className="btn-primary py-2 px-4 text-sm inline-flex">Start →</div>
          </button>
        ))}
      </div>
    </div>
  );
}
