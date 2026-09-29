import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, Bot, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export default function VoiceCommanderModal({ isOpen, onClose, incident, onExecuteAction }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [spokenResponse, setSpokenResponse] = useState('');
  const [statusText, setStatusText] = useState('Click "Start Listening" to speak with RescueOps AI');

  // Speech Recognition initialization
  useEffect(() => {
    if (!isOpen) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusText('Web Speech API is not supported in this browser. You can type commands below.');
      return;
    }
  }, [isOpen]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setStatusText('Listening... Speak your command clearly (e.g., "What is happening with payment API?")');
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      processVoiceCommand(speechToText);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setStatusText(`Voice recognition error: ${event.error}. Please try again.`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processVoiceCommand = (cmdText) => {
    const cmd = cmdText.toLowerCase();
    let resp = "";

    if (cmd.includes("payment") || cmd.includes("happening") || cmd.includes("status")) {
      resp = `Payment API errors increased 34 percent in the last six minutes. Deployment v2.8.1 is the strongest correlated change.`;
    } else if (cmd.includes("previous") || cmd.includes("history") || cmd.includes("seen")) {
      resp = `I found three similar incidents with 87 percent match. Two were resolved through deployment rollback.`;
    } else if (cmd.includes("prepare") || cmd.includes("rollback") || cmd.includes("fix")) {
      resp = `Rollback prepared. Level 3 Human Approval is required before execution.`;
    } else {
      resp = `I received your command: "${cmdText}". Telemetry indicates ${incident.title} requires remediation. Recommended option: ${incident.remediationOptions[0]?.title}.`;
    }

    setSpokenResponse(resp);
    speakText(resp);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-6 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                🗣️ Voice Incident Commander
              </h3>
              <p className="text-xs text-slate-400">Hands-Free Voice Interface for Live Demos</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Animated Waveform Visualizer */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-1.5 h-12">
            {[0.4, 0.8, 1.0, 0.6, 0.9, 0.3, 0.7, 1.0, 0.5, 0.8].map((h, i) => (
              <div 
                key={i} 
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  isListening 
                    ? 'bg-gradient-to-t from-indigo-500 to-violet-400 audio-bar' 
                    : 'bg-slate-800 h-3'
                }`}
                style={{ height: isListening ? `${h * 40}px` : '12px', animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>

          <p className="text-xs font-mono text-indigo-300 text-center">
            {statusText}
          </p>
        </div>

        {/* Voice Transcript Box */}
        {transcript && (
          <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-3 text-xs space-y-1">
            <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase block">
              YOU SAID (VOICE TRANSCRIPT):
            </span>
            <p className="text-white font-medium italic">"{transcript}"</p>
          </div>
        )}

        {/* Spoken Response Box */}
        {spokenResponse && (
          <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 rounded-xl p-3.5 text-xs space-y-1">
            <div className="flex items-center gap-2 text-indigo-300 font-bold">
              <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>RESCUEOPS AI SPOKEN RESPONSE:</span>
            </div>
            <p className="text-slate-200 leading-relaxed">{spokenResponse}</p>
          </div>
        )}

        {/* Quick Voice Simulation Buttons */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Click to simulate voice speech:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const text = "RescueOps, what's happening with payment API?";
                setTranscript(text);
                processVoiceCommand(text);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs border border-indigo-500/30"
            >
              "What's happening with payment API?"
            </button>
            <button
              onClick={() => {
                const text = "Show previous incidents";
                setTranscript(text);
                processVoiceCommand(text);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs border border-indigo-500/30"
            >
              "Show previous incidents"
            </button>
            <button
              onClick={() => {
                const text = "Prepare rollback";
                setTranscript(text);
                processVoiceCommand(text);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs border border-indigo-500/30"
            >
              "Prepare rollback"
            </button>
          </div>
        </div>

        {/* Mic Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={handleStartListening}
            disabled={isListening}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
              isListening
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/30 active:scale-95'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Listening...' : 'Start Listening'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
