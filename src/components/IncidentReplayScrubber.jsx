import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, History, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function IncidentReplayScrubber({ incident }) {
  const steps = [
    { time: "14:02", title: "Deployment Initiated", detail: "Deployment payment-api:v2.8.1 pushed by CI pipeline.", type: "trigger" },
    { time: "14:03", title: "Latency Increase", detail: "API response latency increased +38% (120ms -> 450ms).", type: "warning" },
    { time: "14:04", title: "DB Saturation", detail: "PostgreSQL active connection pool reached 92% limit.", type: "warning" },
    { time: "14:05", title: "Error Spike", detail: "HTTP 500 errors spike on POST /api/v1/checkout/pay.", type: "error" },
    { time: "14:06", title: "AI Diagnosis", detail: "RescueOps AI generated INC-1042 & matched DNA PAY-500-DBPOOL-DEPLOY (87% similarity).", type: "ai" },
    { time: "14:07", title: "Rollback Approved", detail: "Level 3 Human Approval: Rollback v2.8.1 executed.", type: "remediation" },
    { time: "14:09", title: "Verified Recovery", detail: "Connection pool back to 24%. HTTP 500 error rate: 0.0%. Outage resolved.", type: "recovery" }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const currentStep = steps[currentStepIndex];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <History className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              🔁 Incident Replay Scrubber
            </h3>
            <p className="text-xs text-slate-400">
              Interactive timeline player for postmortems, team training, and runbook verification
            </p>
          </div>
        </div>

        {/* Play / Pause / Reset Controls */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-all active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button
            onClick={() => { setIsPlaying(false); setCurrentStepIndex(0); }}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-indigo-300 px-2">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>
      </div>

      {/* Visual Timeline Scrubber Track */}
      <div className="relative py-4">
        {/* Track Line */}
        <div className="h-2 bg-slate-800 rounded-full w-full relative overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        {/* Step Nodes */}
        <div className="flex items-center justify-between relative -mt-3">
          {steps.map((s, idx) => {
            const isActive = idx === currentStepIndex;
            const isPassed = idx <= currentStepIndex;

            return (
              <button
                key={idx}
                onClick={() => { setIsPlaying(false); setCurrentStepIndex(idx); }}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-500 border-white text-white ring-4 ring-indigo-500/30 scale-125 z-10' 
                    : isPassed 
                    ? 'bg-slate-800 border-indigo-400 text-indigo-300' 
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                <span className="text-[9px] font-mono font-bold">{idx + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Highlight Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              TIME: {currentStep.time}
            </span>
            <h4 className="text-sm font-bold text-white">{currentStep.title}</h4>
          </div>
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
            {currentStep.type}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          {currentStep.detail}
        </p>
      </div>

    </div>
  );
}
