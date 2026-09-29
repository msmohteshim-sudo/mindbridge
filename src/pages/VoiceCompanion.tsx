import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supportedLanguages } from '../data/demoData';

const VOICE_COMMANDS = [
  { phrase: 'Start activity', action: 'Opens the activity menu', emoji: '▶️' },
  { phrase: 'Go home', action: 'Returns to dashboard', emoji: '🏠' },
  { phrase: 'Show memories', action: 'Opens memory gallery', emoji: '🖼️' },
  { phrase: 'Play music game', action: 'Starts music recognition', emoji: '🎵' },
  { phrase: 'How am I doing?', action: 'Shows progress report', emoji: '📊' },
  { phrase: 'I need a break', action: 'Opens calming activity', emoji: '😌' },
];

const SAMPLE_CONVERSATIONS = [
  { speaker: 'companion', text: 'Namaste, Arjun! How are you feeling today?', time: '09:30' },
  { speaker: 'user', text: 'I am fine. I want to hear some music.', time: '09:30' },
  { speaker: 'companion', text: 'That sounds wonderful! Shall I start the Music Recognition activity? I have some lovely Rafi and Lata songs ready for you.', time: '09:31' },
  { speaker: 'user', text: 'Yes, please start.', time: '09:31' },
  { speaker: 'companion', text: 'Starting Music Recognition now. I will play a melody — tell me the name or just enjoy it. No rush at all! 🎵', time: '09:31' },
];

export function VoiceCompanion() {
  const { language, setLanguage, voiceEnabled, setVoiceEnabled } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState(SAMPLE_CONVERSATIONS);
  const [inputText, setInputText] = useState('');
  const [selectedLang, setSelectedLang] = useState(language);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateResponse = (userText: string) => {
    const responses: Record<string, string> = {
      music: '🎵 Opening Music Recognition! I have Raga Bhairav and classic Bollywood melodies ready.',
      memory: '🖼️ Let me open your Memory Gallery. You have 6 beautiful memories saved there.',
      home: '🏠 Taking you back to the home screen.',
      help: '😊 I am here to help! You can ask me to start activities, show memories, or just chat.',
      default: "I heard you! Let's make today's session wonderful. What would you like to do?",
    };

    const key = Object.keys(responses).find(k => userText.toLowerCase().includes(k)) || 'default';
    return responses[key];
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg = { speaker: 'user', text: inputText, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
    const response = simulateResponse(inputText);
    const companionMsg = { speaker: 'companion', text: response, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => [...prev, companionMsg]);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
    }, 800);
  };

  const toggleListening = () => {
    setIsListening(prev => !prev);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        const demoText = 'Play music game';
        setInputText(demoText);
        const userMsg = { speaker: 'user', text: demoText, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
        const response = simulateResponse(demoText);
        const companionMsg = { speaker: 'companion', text: response, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        setTimeout(() => setMessages(prev => [...prev, companionMsg]), 800);
      }, 2500);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-header">Voice Companion</h1>
        <p className="section-subheader">वॉइस सहायक · Speak naturally in your language</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2 card flex flex-col" style={{ height: '600px' }}>
          {/* Companion Header */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100 mb-4">
            <div className="relative">
              <div className={`w-14 h-14 bg-gradient-to-br from-lavender-400 to-sky-400 rounded-full flex items-center justify-center text-2xl ${isSpeaking ? 'animate-pulse-soft' : ''}`}>
                🤖
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isListening ? 'bg-red-400 animate-pulse' : isSpeaking ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`} />
            </div>
            <div>
              <div className="font-display font-700 text-gray-900">Sathi — AI Companion</div>
              <div className={`text-sm ${isListening ? 'text-red-500' : isSpeaking ? 'text-green-500' : 'text-gray-400'}`}>
                {isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Speaking...' : '💤 Ready'}
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-500">Language:</span>
              <select
                value={selectedLang}
                onChange={e => { setSelectedLang(e.target.value); setLanguage(e.target.value); }}
                className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-sky-400"
              >
                {supportedLanguages.map(l => (
                  <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin pr-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.speaker === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${
                  msg.speaker === 'companion' ? 'bg-lavender-100 text-lavender-600' : 'bg-sky-100 text-sky-600'
                }`}>
                  {msg.speaker === 'companion' ? '🤖' : '👴'}
                </div>
                <div className={`max-w-xs ${msg.speaker === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.speaker === 'companion'
                      ? 'bg-lavender-50 text-lavender-900 rounded-tl-sm'
                      : 'bg-sky-500 text-white rounded-tr-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-xs text-gray-400 mt-1 px-1">{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="pt-4 border-t border-gray-100 mt-4">
            <div className="flex gap-3">
              <button
                onClick={toggleListening}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-glow-blue'
                    : 'bg-lavender-100 text-lavender-600 hover:bg-lavender-200'
                }`}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type or speak..."
                className="flex-1 input-field py-3"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="btn-primary px-5 py-3 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Commands */}
          <div className="card">
            <h2 className="font-display font-700 text-gray-900 mb-4 text-lg">Voice Commands</h2>
            <div className="space-y-2">
              {VOICE_COMMANDS.map(cmd => (
                <button
                  key={cmd.phrase}
                  onClick={() => {
                    setInputText(cmd.phrase);
                    setTimeout(handleSend, 100);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-sky-50 border border-gray-200 hover:border-sky-200 transition-all text-left"
                >
                  <span className="text-xl flex-shrink-0">{cmd.emoji}</span>
                  <div>
                    <div className="text-sm font-700 text-gray-800">"{cmd.phrase}"</div>
                    <div className="text-xs text-gray-400">{cmd.action}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Language Support */}
          <div className="card">
            <h2 className="font-display font-700 text-gray-900 mb-3 text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-sky-500" />
              Languages
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {supportedLanguages.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setSelectedLang(l.code); setLanguage(l.code); }}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-sm transition-all ${
                    (selectedLang === l.code || language === l.code)
                      ? 'border-sky-400 bg-sky-50 text-sky-700 font-600'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="card">
            <h2 className="font-display font-700 text-gray-900 mb-3 text-lg">Voice Settings</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Voice Responses</span>
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`w-12 h-6 rounded-full transition-all ${voiceEnabled ? 'bg-sky-500' : 'bg-gray-300'}`}
                  aria-checked={voiceEnabled}
                  role="switch"
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${voiceEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Speech Speed</span>
                <select className="text-sm border border-gray-200 rounded-xl px-2 py-1 bg-white">
                  <option>Normal</option>
                  <option>Slow</option>
                  <option>Very Slow</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
