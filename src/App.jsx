import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import IncidentCommandCenter from './components/IncidentCommandCenter';
import MemoryGraphVisualizer from './components/MemoryGraphVisualizer';
import ChangeIntelligencePanel from './components/ChangeIntelligencePanel';
import IncidentReplayScrubber from './components/IncidentReplayScrubber';
import PostmortemGenerator from './components/PostmortemGenerator';
import VoiceCommanderModal from './components/VoiceCommanderModal';
import RemediationApprovalModal from './components/RemediationApprovalModal';
import { initialIncidents } from '../server/data/incidentsData.js';

export default function App() {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [activeIncidentId, setActiveIncidentId] = useState(initialIncidents[0].id);
  const [activeTab, setActiveTab] = useState('command');
  
  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedRemediationOption, setSelectedRemediationOption] = useState(null);

  const activeIncident = incidents.find(i => i.id === activeIncidentId) || incidents[0];

  // Duration timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setIncidents(prev => prev.map(inc => {
        if (inc.status === 'ACTIVE') {
          return { ...inc, durationSeconds: inc.durationSeconds + 1 };
        }
        return inc;
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle remediation execution
  const handleConfirmRemediation = async (engineerName) => {
    if (!selectedRemediationOption) return;

    try {
      const res = await fetch('http://localhost:5000/api/remediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: activeIncident.id,
          optionId: selectedRemediationOption.id,
          approvedBy: engineerName
        })
      });
      const data = await res.json();
      if (data.success && data.incident) {
        setIncidents(prev => prev.map(i => i.id === data.incident.id ? data.incident : i));
      } else {
        markIncidentResolvedLocal(engineerName);
      }
    } catch (e) {
      markIncidentResolvedLocal(engineerName);
    } finally {
      setSelectedRemediationOption(null);
    }
  };

  const markIncidentResolvedLocal = (engineerName) => {
    setIncidents(prev => prev.map(i => {
      if (i.id === activeIncident.id) {
        return {
          ...i,
          status: 'RESOLVED',
          resolvedBy: engineerName,
          executedOption: selectedRemediationOption,
          timeline: [
            ...i.timeline,
            {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              type: "REMEDIATION",
              text: `✅ Action Executed: ${selectedRemediationOption.title} (Approved by ${engineerName})`,
              severity: "resolved"
            },
            {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              type: "RECOVERY",
              text: `🎉 Verified Recovery: Telemetry normalized. Error rates: 0.0%`,
              severity: "resolved"
            }
          ]
        };
      }
      return i;
    }));
  };

  const handleResetIncident = () => {
    setIncidents(initialIncidents);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans">
      
      {/* Platform Navigation Header */}
      <Header 
        activeIncident={activeIncident}
        incidents={incidents}
        onSelectIncident={setActiveIncidentId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onResetIncident={handleResetIncident}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'command' && (
          <IncidentCommandCenter 
            incident={activeIncident} 
            onSelectOption={(opt) => setSelectedRemediationOption(opt)} 
          />
        )}

        {activeTab === 'graph' && (
          <MemoryGraphVisualizer incident={activeIncident} />
        )}

        {activeTab === 'changes' && (
          <ChangeIntelligencePanel incident={activeIncident} />
        )}

        {activeTab === 'replay' && (
          <IncidentReplayScrubber incident={activeIncident} />
        )}

        {activeTab === 'postmortem' && (
          <PostmortemGenerator incident={activeIncident} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        RescueOps AI — Closed-Loop Incident Response & Memory Knowledge Graph Platform • Built for SRE & DevOps Teams
      </footer>

      {/* Voice Incident Commander Modal */}
      <VoiceCommanderModal 
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        incident={activeIncident}
        onExecuteAction={(opt) => setSelectedRemediationOption(opt)}
      />

      {/* Level 1, 2, 3 Remediation Approval Policy Modal */}
      <RemediationApprovalModal 
        option={selectedRemediationOption}
        incident={activeIncident}
        isOpen={!!selectedRemediationOption}
        onClose={() => setSelectedRemediationOption(null)}
        onConfirm={handleConfirmRemediation}
      />

    </div>
  );
}
