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
  'Hello! I am One Call Service AI. Ask me about any service — plumber, electrician, haircut, chef and more! You can also speak to me. 😊',
  'నమస్కారం! నేను One Call Service AI. మీకు ఏ సేవ కావాలో చెప్పండి — plumber, electrician, haircut మొదలైనవి! 😊',
  'नमस्ते! मैं One Call Service AI हूँ। कोई भी सेवा पूछें — plumber, electrician, haircut, chef आदि! 😊',
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all"
        title="One Call Service AI"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-[#fffef9] rounded-2xl shadow-2xl border border-[#e8e0cc] flex flex-col overflow-hidden" style={{ maxHeight: '70vh' }}>
          {/* Header */}
          <div className="bg-amber-500 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
            <div>
              <p className="text-white font-black text-sm">One Call Service AI</p>
              <p className="text-amber-100 text-xs">Telugu • Hindi • English</p>
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
                    ? 'bg-amber-500 text-white rounded-br-sm'
                    : 'bg-[#f5f0e8] text-[#2c2416] rounded-bl-sm border border-[#e8e0cc]'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#f5f0e8] border border-[#e8e0cc] px-4 py-2 rounded-2xl rounded-bl-sm text-sm text-[#7a6a4a]">
                  Searching... ⏳
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#e8e0cc] flex gap-2">
            <button
              onClick={toggleListen}
              className={`p-2 rounded-xl transition-all ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-[#f5f0e8] text-amber-600 hover:bg-amber-100'}`}
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
              className="flex-1 bg-[#f5f0e8] border border-[#e8e0cc] rounded-xl px-3 py-2 text-sm text-[#2c2416] placeholder-[#b8a98a] focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
