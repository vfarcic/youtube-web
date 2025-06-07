'use client';

import React, { useState, useEffect } from 'react';
import { usePhases } from '../../lib/hooks/usePhases';

interface PhaseFilterBarProps {
  onPhaseChange: (phaseId: string | null) => void;
}

const PhaseFilterBar: React.FC<PhaseFilterBarProps> = ({ onPhaseChange }) => {
  const { phases, loading, error } = usePhases();
  const [activePhase, setActivePhase] = useState<string | null>('4'); // Default to Started
  const [displayPhases, setDisplayPhases] = useState<any[]>([]);

  useEffect(() => {
    if (phases.length > 0) {
      // Calculate total videos for "All" button
      const totalVideos = phases.reduce((sum, phase) => sum + phase.count, 0);
      setDisplayPhases([{ id: 'all', name: 'All', count: totalVideos }, ...phases]);
    }
  }, [phases]);

  const handlePhaseClick = (phaseId: string | number) => {
    const phaseIdStr = phaseId === 'all' ? null : String(phaseId);
    console.log('🎯 PhaseFilterBar - Clicked phase:', phaseId, '-> converted to:', phaseIdStr);
    setActivePhase(phaseIdStr);
    onPhaseChange(phaseIdStr);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '1rem'
      }}>
        <p>Loading phases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '1rem', 
        padding: '1rem', 
        backgroundColor: 'var(--error-bg-color, #fee)', 
        border: '1px solid var(--error-border-color, #fcc)', 
        borderRadius: '8px',
        color: 'var(--error-text-color, #c33)'
      }}>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--error-text-color, #c33)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--error-hover-color, #a22)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--error-text-color, #c33)'}
        >
          Retry
        </button>
      </div>
    );
  }

  // Helper function to check if a phase needs a warning
  const needsWarning = (phase: any): boolean => {
    if (phase.id === 1 && phase.count < 1) return true; // Publish Pending
    if (phase.id === 2 && phase.count < 1) return true; // Edit Requested
    if (phase.id === 3 && phase.count < 3) return true; // Material Done
    return false;
  };

  // Warning icon SVG component
  const WarningIcon = () => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      style={{ marginLeft: '0.5rem', flexShrink: 0 }}
      aria-label="Warning: Insufficient videos"
    >
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  );

  return (
    <div className="phase-filter" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {displayPhases.map((phase, index) => {
        const isActive = String(activePhase) === String(phase.id) || (phase.id === 'all' && activePhase === null);
        const showWarning = needsWarning(phase);
        
        // Debug logging for each button
        console.log(`🎯 Rendering button: ${phase.name} with ID: ${phase.id} (type: ${typeof phase.id}), active: ${isActive}`);
        
        return (
          <button
            key={`phase-${phase.id}-${index}`} // More stable key combining ID and index
            className={`phase-btn ${isActive ? 'active' : ''}`}
            onClick={() => {
              console.log(`🎯 BUTTON CLICKED: ${phase.name} with phase.id:`, phase.id, 'type:', typeof phase.id);
              handlePhaseClick(phase.id);
            }}
            style={{
              background: isActive 
                ? 'linear-gradient(135deg, var(--primary-accent-color) 0%, var(--secondary-accent-color) 100%)' 
                : 'var(--secondary-bg-color)',
              border: `1px solid ${isActive ? 'var(--primary-accent-color)' : 'var(--border-color)'}`,
              color: isActive ? 'var(--text-on-accent-bg)' : 'var(--secondary-text-color)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 2px 8px var(--card-shadow-color)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={showWarning ? `Warning: Insufficient videos in ${phase.name}` : undefined}
          >
            <span>{phase.name} ({phase.count})</span>
            {showWarning && (
              <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center' }}>
                <WarningIcon />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PhaseFilterBar;
