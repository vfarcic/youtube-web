'use client';

import { useState, useEffect } from 'react';
import { 
  apiClient, 
  EditingAspectOverview, 
  EditingFieldMetadata,
  AspectOverviewResponse,
  AspectFieldsResponse 
} from '../../lib/api-client';

interface AspectSelectionProps {
  videoId?: string;
  onAspectSelect?: (aspectKey: string, fields: EditingFieldMetadata[]) => void;
}

export default function AspectSelection({ videoId: propVideoId, onAspectSelect }: AspectSelectionProps) {
  // State management following Issue #14 requirements
  const [aspects, setAspects] = useState<EditingAspectOverview[]>([]);
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null);
  const [fields, setFields] = useState<EditingFieldMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingFields, setLoadingFields] = useState(false);
  
  // Read videoId from URL parameters if not provided as prop
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(propVideoId || null);

  useEffect(() => {
    // Check URL parameters for videoId if not provided as prop
    if (!propVideoId && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlVideoId = params.get('videoId');
      setCurrentVideoId(urlVideoId);
    }
  }, [propVideoId]);

  // Fetch aspects overview on mount
  useEffect(() => {
    const fetchAspects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getAspectsOverview();
        setAspects(response.aspects);
      } catch (err) {
        console.error('Failed to fetch aspects:', err);
        setError(err instanceof Error ? err.message : 'Failed to load aspects');
      } finally {
        setLoading(false);
      }
    };

    fetchAspects();
  }, []);

  // Handle aspect selection with lazy loading of field details
  const handleAspectClick = async (aspectKey: string) => {
    if (selectedAspect === aspectKey) {
      // Deselect if clicking the same aspect
      setSelectedAspect(null);
      setFields([]);
      return;
    }

    try {
      setLoadingFields(true);
      setSelectedAspect(aspectKey);
      
      // Fetch field details for selected aspect
      const response = await apiClient.getAspectFields(aspectKey);
      setFields(response.fields);
      
      // Notify parent component
      onAspectSelect?.(aspectKey, response.fields);
    } catch (err) {
      console.error(`Failed to fetch fields for aspect ${aspectKey}:`, err);
      setError(`Failed to load fields for ${aspectKey}`);
    } finally {
      setLoadingFields(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="aspect-selection" data-testid="aspect-selection">
        <div className="loading-state" data-testid="loading">
          <h2 className="section-title">Video Editing Aspects</h2>
          <div className="aspect-grid">
            <div className="loading-placeholder">Loading aspects...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="aspect-selection" data-testid="aspect-selection">
        <div className="error-state" data-testid="error">
          <h2 className="section-title">Video Editing Aspects</h2>
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-selection" data-testid="aspect-selection">
      <h1 className="section-title">
        Video Editing Aspects
        {currentVideoId && <span className="video-context"> - Video ID: {currentVideoId}</span>}
      </h1>
      <p className="section-description">
        Select an aspect to edit specific parts of your video content
        {currentVideoId && ' for this video'}
      </p>
      
      <div className="aspect-grid aspect-navigation">
        {aspects.map((aspect) => (
          <div 
            key={aspect.key}
            className={`aspect-card ${selectedAspect === aspect.key ? 'selected' : ''}`}
            onClick={() => handleAspectClick(aspect.key)}
            role="button"
            style={{ cursor: 'pointer' }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAspectClick(aspect.key);
              }
            }}
          >
            <div className="aspect-icon">{aspect.icon}</div>
            <h3 className="aspect-title">{aspect.title}</h3>
            <p className="aspect-description">{aspect.description}</p>
            <div className="aspect-meta">
              <span className="field-count">{aspect.fieldCount} fields</span>
              <span className="aspect-order">#{aspect.order}</span>
            </div>
            {selectedAspect === aspect.key && loadingFields && (
              <div className="loading-fields">Loading fields...</div>
            )}
          </div>
        ))}
      </div>

      {/* Field Details Section */}
      {selectedAspect && fields.length > 0 && (
        <div className="field-details">
          <h2>
            {aspects.find(a => a.key === selectedAspect)?.title} Fields
          </h2>
          <div className="field-list">
            {fields.map((field, index) => (
              <div key={field.name || index} className="field-item">
                <div className="field-header">
                  <h4 className="field-name">
                    {field.name}
                    {field.required && <span className="required">*</span>}
                  </h4>
                  <span className="field-type">{field.type}</span>
                </div>
                {field.description && (
                  <p className="field-description">{field.description}</p>
                )}
                {field.helpText && (
                  <div className="field-help">
                    <small>{field.helpText}</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debugging Info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info" style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', fontSize: '12px' }}>
          <strong>Debug Info:</strong><br />
          Aspects loaded: {aspects.length}<br />
          Selected aspect: {selectedAspect || 'none'}<br />
          Fields loaded: {fields.length}<br />
          Loading: {loading ? 'yes' : 'no'}<br />
          Error: {error || 'none'}
        </div>
      )}
    </div>
  );
} 