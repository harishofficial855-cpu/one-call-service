import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Mic, MicOff, Send, Volume2 } from 'lucide-react';
import api from '../services/api';

const LANG_MAP = {
  telugu: 'te-IN',
  hindi: 'hi-IN',
  english: 'en-IN',
  తెలుగు: 'te-IN',
  हिंदी: 'hi-IN',
};

const GREETINGS = [
  'Hello! I am One Call Service AI. Ask me to find services currently listed on One Call Service. You can also speak to me. 😊',
  'నమస్కారం! One Call Service లో ప్రస్తుతం అందుబాటులో ఉన్న సేవల గురించి అడగండి. మీరు నాతో మాట్లాడవచ్చు. 😊',
  'नमस्ते! One Call Service पर उपलब्ध सेवाओं के बारे में पूछें। आप मुझसे बोलकर भी पूछ सकते हैं। 😊',
];

function detectLang(text) {
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN';
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
  const lower = text.toLowerCase();
  for (const [key, val] of Object.entries(LANG_MAP)) {
    if (lower.includes(key)) return val;
  }
  return 'en-IN';
}

function speak(text, lang = 'en-IN') {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 0.95;
  window.speechSynthesis.speak(utter);
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: GREETINGS[0] }]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMsg = (role, text) => setMessages((prev) => [...prev, { role, text }]);

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    addMsg('user', msg);
    setLoading(true);

    const lang = detectLang(msg);

    try {
      // Search services from backend
      const params = new URLSearchParams({ search: msg });
      const { data } = await api.get(`/services?${params}`);
      const services = data.services || [];

      let reply = '';
      if (services.length === 0) {
        const replies = {
          'te-IN': `క్షమించండి, "${msg}" కోసం ఏ సేవ దొరకలేదు. దయచేసి వేరే పదం ప్రయత్నించండి.`,
          'hi-IN': `माफ़ करें, "${msg}" के लिए कोई सेवा नहीं मिली। कृपया दूसरा शब्द आज़माएं।`,
          'en-IN': `Sorry, no services found for "${msg}". Try a different keyword.`,
        };
        reply = replies[lang] || replies['en-IN'];
      } else {
        const headers = {
          'te-IN': `"${msg}" కోసం ${services.length} సేవలు దొరికాయి:\n\n`,
          'hi-IN': `"${msg}" के लिए ${services.length} सेवाएं मिलीं:\n\n`,
          'en-IN': `Found ${services.length} service(s) for "${msg}":\n\n`,
        };
        reply = (headers[lang] || headers['en-IN']) +
          services.slice(0, 5).map((s, i) =>
            `${i + 1}. ${s.name}${s.providerName ? ` — ${s.providerName}` : ''}${s.serviceLocation ? ` 📍 ${s.serviceLocation}` : ''}${s.phone ? ` 📞 ${s.phone}` : ''}`
          ).join('\n');
      }

      addMsg('bot', reply);
      speak(reply, lang);
    } catch {
      const err = 'Sorry, something went wrong. Please try again.';
      addMsg('bot', err);
      speak(err, lang);
    } finally {
      setLoading(false);
    }
  };

  const toggleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addMsg('bot', 'Voice input is not supported in your browser. Please use Chrome.');
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'te-IN'; // supports multilingual input
    recognitionRef.current = rec;

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setListening(false);
      handleSend(transcript);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    rec.start();
    setListening(true);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-32 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-2xl transition-all hover:bg-blue-800 sm:right-6 md:bottom-6"
        title="One Call Service AI"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-4 z-[60] flex w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-2xl sm:right-6 sm:w-96" style={{ maxHeight: '70vh' }}>
          {/* Header */}
          <div className="flex items-center gap-3 bg-blue-700 px-4 py-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
            <div>
              <p className="text-white font-black text-sm">One Call Service AI</p>
              <p className="text-blue-100 text-xs">Telugu • Hindi • English</p>
            </div>
            <button onClick={() => speak(messages[messages.length - 1]?.text || '', 'en-IN')} className="ml-auto text-white/80 hover:text-white" title="Replay last message">
              <Volume2 size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-blue-700 text-white rounded-br-sm'
                    : 'bg-blue-50 text-slate-800 rounded-bl-sm border border-blue-100'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl rounded-bl-sm text-sm text-slate-600">
                  Searching... ⏳
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 border-t border-slate-200 p-3">
            <button
              onClick={toggleListen}
              className={`p-2 rounded-xl transition-all ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
              title={listening ? 'Stop listening' : 'Speak'}
            >
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type or speak in any language..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="rounded-xl bg-blue-700 p-2 text-white transition-all hover:bg-blue-800 disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
