/**
 * Incident DNA Signature & Matching Engine
 * Fingerprints incident telemetry into an easily comparable DNA string
 * e.g., PAY-500-DBPOOL-DEPLOY
 */

export function generateIncidentDna(incident) {
  const serviceCode = (incident.service || 'SVC').substring(0, 4).toUpperCase();
  const errorType = incident.summary?.includes('500') ? '500' : 
                    incident.summary?.includes('403') ? '403' : 
                    incident.summary?.includes('OOM') ? 'OOM' : 'FAIL';
  const symptom = incident.rootCause?.toLowerCase().includes('pool') ? 'DBPOOL' :
                  incident.rootCause?.toLowerCase().includes('redis') ? 'REDIS' :
                  incident.rootCause?.toLowerCase().includes('credential') ? 'EXPLOIT' : 'SATURATION';
  const trigger = incident.changesLast60Min?.deployments?.length > 0 ? 'DEPLOY' :
                  incident.summary?.toLowerCase().includes('cron') ? 'CRON' : 'TRAFFIC';

  return `${serviceCode}-${errorType}-${symptom}-${trigger}`;
}

export function matchDnaSimilarity(dna1, dna2) {
  const parts1 = dna1.split('-');
  const parts2 = dna2.split('-');
  
  if (parts1.length !== parts2.length) return 50;

  let matchScore = 0;
  if (parts1[0] === parts2[0]) matchScore += 25; // Service match
  if (parts1[1] === parts2[1]) matchScore += 25; // Error code match
  if (parts1[2] === parts2[2]) matchScore += 30; // Symptom match
  if (parts1[3] === parts2[3]) matchScore += 20; // Trigger match

  return matchScore;
}
