'use client';

import React, { useEffect, useState } from 'react';
import { apiClient, EditingAspect, AspectListResponse } from '../../lib/api-client';

interface AspectSelectionProps {
  videoId: string;
  onAspectSelected: (aspect: EditingAspect) => void;
  onClose: () => void;
}

const AspectSelection: React.FC<AspectSelectionProps> = ({
  videoId,
  onAspectSelected,
  onClose
}) => {
  const [aspects, setAspects] = useState<EditingAspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAspects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Loading aspects for video:', videoId);
        const data: AspectListResponse = await apiClient.getAspects();
        
        console.log('✅ Aspects loaded:', data.aspects);
        setAspects(data.aspects || []);
      } catch (err) {
        console.error('❌ Error loading aspects:', err);
        setError(`Failed to load aspects: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadAspects();
  }, [videoId]);

  if (loading) {
    return (
      <div className="video-grid-container">
        <div className="video-grid-header">
          <h2 className="video-grid-title">Edit Video</h2>
          <button onClick={onClose} className="header-btn">×</button>
        </div>
        <div className="video-grid-loading">
          <div className="loading-spinner">
            <i className="fas fa-circle-notch"></i>
          </div>
          <p>Loading aspects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-grid-container">
        <div className="video-grid-header">
          <h2 className="video-grid-title">Edit Video</h2>
          <button onClick={onClose} className="header-btn">×</button>
        </div>
        <div className="video-grid-error">
          <h3>Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-grid-container">
      <div className="video-grid-header">
        <h2 className="video-grid-title">Edit Video</h2>
        <button onClick={onClose} className="header-btn">×</button>
      </div>
      
      <div className="content-section">
        <h3 className="section-title">Select an aspect to edit</h3>
        <p className="page-subtitle">Choose which aspect of the video you'd like to work on</p>
        
        <div className="video-grid">
          {aspects.map(aspect => (
            <div 
              key={aspect.key} 
              className="video-card"
              onClick={() => {
                console.log('🎯 Aspect selected:', aspect);
                onAspectSelected(aspect);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="video-card-content">
                <div className="icon accent" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                  {aspect.icon ? (
                    <i className={aspect.icon}></i>
                  ) : (
                    <i className="fas fa-cog"></i>
                  )}
                </div>
                <h3>{aspect.title}</h3>
                {aspect.description && (
                  <p>{aspect.description}</p>
                )}
                <div className="video-actions" style={{ marginTop: '1rem' }}>
                  <i className="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {aspects.length === 0 && (
          <div className="video-grid-empty">
            <h3>No aspects available</h3>
            <p>No aspects available for editing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AspectSelection; 