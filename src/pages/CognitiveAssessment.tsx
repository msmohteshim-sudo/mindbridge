import { useState } from 'react';
import { Brain, ChevronRight, Info, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ASSESSMENT_SECTIONS = [
  {
    id: 'memory',
    title: 'Memory',
    description: 'Simple questions about recent and older memories',
    questions: [
      {
        id: 'q1',
        text: 'What did you have for breakfast today?',
        type: 'open',
        hint: 'Take your time — any answer is perfectly fine',
      },
      {
        id: 'q2',
        text: 'Which of these items were shown earlier?',
        type: 'mcq',
        options: ['🍎 Apple', '🚗 Car', '🌷 Flower', '📚 Book'],
        correct: [0, 2],
      },
    ],
  },
  {
    id: 'attention',
    title: 'Attention',
    description: 'Brief focus and concentration tasks',
    questions: [
      {
        id: 'q3',
        text: 'Count how many stars you see: ⭐⭐⭐⭐⭐⭐⭐⭐',
        type: 'number',
        correct: 8,
      },
      {
        id: 'q4',
        text: 'Select all the animals:',
        type: 'mcq',
        options: ['🐘 Elephant', '🌳 Tree', '🦋 Butterfly', '🏠 House'],
        correct: [0, 2],
      },
    ],
  },
  {
    id: 'language',
    title: 'Language',
    description: 'Simple naming and word tasks',
    questions: [
      {
        id: 'q5',
        text: 'What is the word for a place where books are kept?',
        type: 'open',
        hint: 'Think about a building with many books...',
      },
      {
        id: 'q6',
        text: 'Complete the well-known phrase: "A stitch in time saves ___"',
        type: 'mcq',
        options: ['nine', 'ten', 'seven', 'time'],
        correct: [0],
      },
    ],
  },
];

interface Answer {
  questionId: string;
  value: string | number | number[];
}

export function CognitiveAssessment() {
  const { navigate, updateProfile } = useApp();
  const [stage, setStage] = useState<'intro' | 'assessment' | 'complete'>('intro');
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string | number | number[]>('');
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [scores, setScores] = useState({ memory: 0, attention: 0, language: 0 });

  const section = ASSESSMENT_SECTIONS[currentSection];
  const question = section?.questions[currentQuestion];
  const totalQuestions = ASSESSMENT_SECTIONS.reduce((s, sec) => s + sec.questions.length, 0);

  const handleNext = () => {
    // Save answer
    const answer: Answer = {
      questionId: question.id,
      value: question.type === 'mcq' ? selectedOptions : currentAnswer,
    };
    setAnswers(prev => [...prev, answer]);

    // Simple scoring
    if (question.type === 'mcq' && 'correct' in question) {
      const correct = question.correct as number[];
      const isCorrect = correct.every(c => selectedOptions.includes(c)) && selectedOptions.length === correct.length;
      if (isCorrect) {
        setScores(prev => ({ ...prev, [section.id]: prev[section.id as keyof typeof prev] + 1 }));
      }
    }

    setSelectedOptions([]);
    setCurrentAnswer('');

    // Move to next
    if (currentQuestion + 1 < section.questions.length) {
      setCurrentQuestion(q => q + 1);
    } else if (currentSection + 1 < ASSESSMENT_SECTIONS.length) {
      setCurrentSection(s => s + 1);
      setCurrentQuestion(0);
    } else {
      // Complete
      const finalScores = {
        memory: Math.round(50 + scores.memory * 25 + Math.random() * 10),
        attention: Math.round(55 + scores.attention * 20 + Math.random() * 10),
        language: Math.round(60 + scores.language * 25 + Math.random() * 10),
      };
      updateProfile({
        memory: finalScores.memory,
        attention: finalScores.attention,
        language: finalScores.language,
      });
      setStage('complete');
    }
  };

  const toggleOption = (index: number) => {
    setSelectedOptions(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const progress = ((currentSection * 2 + currentQuestion) / totalQuestions) * 100;

  if (stage === 'intro') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center p-10">
          <div className="w-20 h-20 bg-sky-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-sky-600" />
          </div>
          <h1 className="text-3xl font-display font-800 text-gray-900 mb-3">
            Cognitive Engagement Check
          </h1>
          <p className="text-gray-500 mb-6 leading-relaxed">
            A short, gentle set of activities to help personalise your MindBridge experience.
            This takes about 5–8 minutes. Take your time — there are no wrong answers.
          </p>

          <div className="disclaimer-banner text-left mb-6">
            <strong>Important:</strong> This is a brief engagement exercise — not a clinical cognitive test.
            Results are used only to personalise your activities within MindBridge. Please consult a
            healthcare professional for formal cognitive assessment.
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {ASSESSMENT_SECTIONS.map(sec => (
              <div key={sec.id} className="bg-cream-50 rounded-2xl p-4">
                <div className="font-700 text-gray-900 capitalize mb-1">{sec.title}</div>
                <div className="text-sm text-gray-500">{sec.description}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('dashboard')} className="btn-ghost">
              Not now
            </button>
            <button onClick={() => setStage('assessment')} className="btn-primary text-xl py-5 px-10">
              Begin Gently
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'complete') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center p-10">
          <div className="text-6xl mb-4 animate-bounce">🌟</div>
          <h2 className="text-3xl font-display font-800 text-gray-900 mb-3">Wonderful!</h2>
          <p className="text-gray-500 mb-8">You've completed the engagement check. Your activities will now be personalised.</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Memory', value: Math.round(50 + scores.memory * 25 + 8), color: 'text-sky-600', bg: 'bg-sky-50' },
              { label: 'Attention', value: Math.round(55 + scores.attention * 20 + 12), color: 'text-warm-600', bg: 'bg-warm-50' },
              { label: 'Language', value: Math.round(60 + scores.language * 25 + 14), color: 'text-lavender-600', bg: 'bg-lavender-50' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-5`}>
                <div className={`text-3xl font-display font-800 ${color}`}>{value}%</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-sage-50 rounded-2xl border border-sage-200 mb-6 text-left">
            <p className="text-sm text-sage-700 leading-relaxed">
              <strong>🎵 Personalised suggestion:</strong> Based on your engagement patterns, we recommend starting with
              Music Recognition — a high-engagement activity that aligns with your interests.
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => { setStage('intro'); setCurrentSection(0); setCurrentQuestion(0); setAnswers([]); }} className="btn-ghost">
              <RotateCcw className="w-4 h-4" />
              Retake
            </button>
            <button onClick={() => navigate('dashboard')} className="btn-primary text-lg py-4 px-8">
              View My Dashboard
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{section.title} — Question {currentQuestion + 1} of {section.questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill bg-sky-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex gap-2 mt-3">
          {ASSESSMENT_SECTIONS.map((sec, i) => (
            <div
              key={sec.id}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i < currentSection ? 'bg-sky-500' : i === currentSection ? 'bg-sky-300' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="card p-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <span className={`badge text-sm ${
            section.id === 'memory' ? 'badge-blue' : section.id === 'attention' ? 'badge-warm' : 'badge-lavender'
          }`}>
            {section.title}
          </span>
        </div>

        <h2 className="text-2xl font-display font-700 text-gray-900 mb-6">{question.text}</h2>

        {'hint' in question && question.hint && (
          <div className="flex items-start gap-2 p-3 bg-cream-50 rounded-2xl border border-cream-200 mb-6 text-sm text-gray-600">
            <Info className="w-4 h-4 text-warm-500 flex-shrink-0 mt-0.5" />
            {question.hint}
          </div>
        )}

        {/* MCQ */}
        {question.type === 'mcq' && Array.isArray((question as any).options) && (
          <div className="space-y-3">
            {((question as any).options as string[]).map((opt, i) => (
              <button
                key={i}
                onClick={() => toggleOption(i)}
                className={`w-full text-left py-4 px-5 rounded-2xl border-2 text-lg font-600 transition-all ${
                  selectedOptions.includes(i)
                    ? 'border-sky-400 bg-sky-50 text-sky-700'
                    : 'border-gray-200 hover:border-sky-300 hover:bg-sky-50 text-gray-700'
                }`}
              >
                <span className="mr-2">{selectedOptions.includes(i) ? '✓' : '○'}</span>
                {opt}
              </button>
            ))}
            <p className="text-sm text-gray-400 mt-2">Select all that apply</p>
          </div>
        )}

        {/* Open text */}
        {question.type === 'open' && (
          <textarea
            value={currentAnswer as string}
            onChange={e => setCurrentAnswer(e.target.value)}
            placeholder="Your answer..."
            className="input-field resize-none"
            rows={3}
          />
        )}

        {/* Number */}
        {question.type === 'number' && (
          <input
            type="number"
            value={currentAnswer as number}
            onChange={e => setCurrentAnswer(Number(e.target.value))}
            placeholder="Enter a number"
            className="input-field text-center text-2xl"
            min={0}
            max={20}
          />
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => { if (currentQuestion > 0) setCurrentQuestion(q => q - 1); else if (currentSection > 0) { setCurrentSection(s => s - 1); setCurrentQuestion(ASSESSMENT_SECTIONS[currentSection - 1].questions.length - 1); } }}
            className="btn-ghost"
            disabled={currentSection === 0 && currentQuestion === 0}
          >
            ← Previous
          </button>
          <button onClick={handleNext} className="btn-primary text-lg py-4 px-8">
            {currentSection === ASSESSMENT_SECTIONS.length - 1 && currentQuestion === section.questions.length - 1
              ? 'Complete ✓'
              : 'Next →'}
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        You can skip any question — just press Next
      </p>
    </div>
  );
}
