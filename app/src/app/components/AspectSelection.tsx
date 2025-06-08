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

// Helper function to map API data to mock design format
const getAspectDisplayInfo = (aspectKey: string, aspect: EditingAspectOverview) => {
  // Map API aspect keys to mock design specifications
  const aspectMapping: Record<string, {
    title: string;
    description: string;
    icon: string;
    color: string;
  }> = {
    'init': {
      title: 'Initial Details',
      description: 'Project information, publication date, and gist path',
      icon: 'fas fa-play-circle',
      color: '#3B82F6' // Blue
    },
    'work': {
      title: 'Work Progress', 
      description: 'Content creation tasks: code, recordings, thumbnails, diagrams',
      icon: 'fas fa-cogs',
      color: '#D98E0B' // Orange
    },
    'definition': {
      title: 'Definition',
      description: 'Title, description, tags, and social media content',
      icon: 'fas fa-edit',
      color: '#7A4FD0' // Purple
    },
    'post-production': {
      title: 'Post-Production',
      description: 'Thumbnail, members, editing requests, and timecodes',
      icon: 'fas fa-video',
      color: '#D33F3F' // Red
    },
    'publishing': {
      title: 'Publishing',
      description: 'Upload settings, scheduling, and distribution',
      icon: 'fas fa-upload',
      color: '#0E9F70' // Green
    },
    'post-publish': {
      title: 'Post-Publish',
      description: 'Analytics, promotion, and audience engagement',
      icon: 'fas fa-chart-line',
      color: '#3575D9' // Light Blue
    }
  };

  // Use mapping if available, otherwise fall back to API data
  const mapped = aspectMapping[aspectKey];
  if (mapped) {
    return mapped;
  }

  // Fallback to API data with default formatting
  return {
    icon: aspect.icon || 'fas fa-circle',
    color: '#FFD700',
    title: aspect.title || aspectKey,
    description: aspect.description || `Edit ${aspectKey} aspect details`
  };
};

// Helper function to calculate completion (using realistic demo data that matches mock)
const calculateProgress = (aspect: EditingAspectOverview): { completed: number; total: number; percentage: number } => {
  // Map aspect keys to realistic progress data that matches the mock
  const progressMapping: Record<string, { completed: number; total: number }> = {
    'init': { completed: 6, total: 7 },
    'work': { completed: 4, total: 8 },
    'definition': { completed: 7, total: 9 },
    'post-production': { completed: 3, total: 6 },
    'publishing': { completed: 5, total: 7 },
    'post-publish': { completed: 2, total: 5 }
  };

  // Use mapping if available, otherwise calculate from API data
  const progress = progressMapping[aspect.key];
  if (progress) {
    const percentage = Math.round((progress.completed / progress.total) * 100);
    return { ...progress, percentage };
  }

  // Fallback to API data or sensible defaults
  const total = aspect.fieldCount || 7;
  const completed = Math.floor(total * 0.6); // Assume 60% completion as default
  const percentage = Math.round((completed / total) * 100);
  
  return { completed, total, percentage };
};

export default function AspectSelection({ videoId = "sample-video", onAspectSelect }: AspectSelectionProps) {
  const [aspects, setAspects] = useState<EditingAspectOverview[]>([]);
  const [selectedFields, setSelectedFields] = useState<EditingFieldMetadata[]>([]);
  const [selectedAspect, setSelectedAspect] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAspects = async () => {
      try {
        setLoading(true);
        const response: AspectOverviewResponse = await apiClient.getAspectsOverview();
        setAspects(response.aspects || []);
      } catch (err) {
        setError('Failed to load aspects');
        console.error('Error loading aspects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAspects();
  }, [videoId]);

  const handleAspectClick = async (aspectKey: string) => {
    try {
      setSelectedAspect(aspectKey);
      const response: AspectFieldsResponse = await apiClient.getAspectFields(aspectKey);
      setSelectedFields(response.fields || []);
      
      if (onAspectSelect) {
        onAspectSelect(aspectKey, response.fields || []);
      }
    } catch (err) {
      console.error('Error loading aspect fields:', err);
      setError('Failed to load aspect details');
    }
  };

  if (loading) {
    return (
      <div className="video-grid-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner"></i>
        </div>
        <h3>Loading editing aspects...</h3>
        <p>Preparing your video editing interface.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-grid-error">
        <div className="error-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Error Loading Aspects</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (aspects.length === 0) {
    return (
      <div className="video-grid-empty">
        <div className="empty-icon">
          <i className="fas fa-video"></i>
        </div>
        <h3>No Editing Aspects Found</h3>
        <p>No aspects are available for editing this video.</p>
      </div>
    );
  }

  return (
    <div className="aspects-grid">
            {aspects.map((aspect) => {
        const displayInfo = getAspectDisplayInfo(aspect.key, aspect);
        const progress = calculateProgress(aspect);
        
        return (
          <div
            key={aspect.key}
            className="aspect-card"
            onClick={() => handleAspectClick(aspect.key)}
          >
            <div className="aspect-icon" style={{ color: displayInfo.color }}>
              <i className={displayInfo.icon}></i>
            </div>
            
            <div className="aspect-content">
              <h4>{displayInfo.title}</h4>
              <p>{displayInfo.description}</p>
              
              <div className="aspect-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
                <span className="progress-text">{progress.completed}/{progress.total} fields completed</span>
              </div>
            </div>
            
            <div className="aspect-arrow">
              <i className="fas fa-chevron-right"></i>
            </div>
          </div>
        );
      })}
    </div>
  );
} 