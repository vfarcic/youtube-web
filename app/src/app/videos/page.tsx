'use client';

import { useState } from 'react';
import PhaseFilterBar from '../components/PhaseFilterBar';
import VideoGrid from '../components/VideoGrid';

export default function VideosPage() {
  const [currentPhase, setCurrentPhase] = useState<string | null>('4'); // Default to "Started" 
  const [currentPhaseName, setCurrentPhaseName] = useState<string>('Started'); // Default phase name

  const handlePhaseChange = (phaseId: string | null) => {
    console.log('🎯 Page - Phase change requested - from:', currentPhase, 'to:', phaseId);
    console.log('🎯 Page - Type check - currentPhase type:', typeof currentPhase, 'phaseId type:', typeof phaseId);
    setCurrentPhase(phaseId);
    setCurrentPhaseName(phaseId ? `Phase ${phaseId}` : 'All phases');
    console.log('✅ Page - Phase state updated - currentPhase:', phaseId);
  };

  return (
    <main className="page-container">
      <div className="view-header">
        <h1 className="page-title">
          <i className="fas fa-video icon"></i>
          Video Management
        </h1>
      </div>
      
      <div className="content-section">
        <h2 className="section-title">
          Phase Filter Bar
        </h2>
        <PhaseFilterBar onPhaseChange={handlePhaseChange} />
      </div>
      
      <div className="content-section">
        <h2 className="section-title">
          Video Cards Grid
        </h2>
        <VideoGrid 
          selectedPhase={currentPhase}
          selectedPhaseName={currentPhaseName}
        />
      </div>
    </main>
  );
}
