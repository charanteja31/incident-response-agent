import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, Dna, ArrowRight } from 'lucide-react';

export default function IncidentCommanderChat({ incident }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello! I am **RescueOps AI Incident Commander**. I have correlated telemetry for **${incident.title}** (${incident.id}). How can I assist your incident response?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Why is checkout failing?",
    "Have we seen this before?",
    "What should I do?",
    "What happens if we do nothing?"
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query, incidentId: incident.id })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.answer }]);
    } catch (e) {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: `Based on incident correlation for ${incident.id}: Recommended action is **${incident.remediationOptions[0]?.title}**.` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 flex flex-col h-[420px]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              👨‍💻 AI Incident Commander
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </h3>
            <p className="text-xs text-slate-400">Conversational AI Teammate for Incident Investigation</p>
          </div>
        </div>

        <span className="text-xs font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
          DNA: {incident.dna}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'bot' && (
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 text-white mt-1">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
              m.sender === 'user'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-tr-none shadow-md'
                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none shadow-inner'
            }`}>
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-slate-200 mt-1">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic">
            <Bot className="w-4 h-4 animate-spin text-indigo-400" />
            Analyzing Knowledge Graph memory...
          </div>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="px-2.5 py-1 rounded-full text-[11px] bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 whitespace-nowrap transition-all"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
        className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800"
      >
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask RescueOps AI anything about this incident..."
          className="bg-transparent flex-1 text-xs text-white placeholder-slate-500 focus:outline-none px-2"
        />
        <button 
          type="submit" 
          className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}
