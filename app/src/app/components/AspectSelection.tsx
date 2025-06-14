'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { 
  apiClient, 
  EditingAspectOverview, 
  EditingFieldMetadata,
  AspectOverviewResponse,
  AspectFieldsResponse 
} from '../../lib/api-client';

interface AspectSelectionProps {
  videoId?: string;
  videoName?: string;        // NEW: For progress tracking API (Issue #16)
  category?: string;         // NEW: For progress tracking API (Issue #16)
  onAspectSelect?: (aspectKey: string, fields: EditingFieldMetadata[]) => void;
}

// Add ref interface for external refresh capability
export interface AspectSelectionRef {
  refreshAspects: () => Promise<void>;
}

// Helper function to map API data to mock design format
const getAspectDisplayInfo = (aspectKey: string, aspect: EditingAspectOverview) => {
  // Convert simple icon names from API to Font Awesome class names
  const iconMapping: Record<string, string> = {
    'info': 'fas fa-info-circle',
    'video': 'fas fa-video',
    'edit': 'fas fa-edit', 
    'scissors': 'fas fa-cut',
    'upload': 'fas fa-upload',
    'share': 'fas fa-share-alt'
  };

  // Color mapping for visual consistency (this could also come from API in the future)
  const colorMapping: Record<string, string> = {
    'initial-details': '#3B82F6', // Blue
    'work-progress': '#D98E0B',   // Orange
    'definition': '#7A4FD0',      // Purple
    'post-production': '#D33F3F', // Red
    'publishing': '#0E9F70',      // Green
    'post-publish': '#3575D9'     // Light Blue
  };

  // Use API data with icon conversion
  return {
    icon: iconMapping[aspect.icon] || 'fas fa-circle',
    color: colorMapping[aspectKey] || '#FFD700',
    title: aspect.title,
    description: aspect.description
  };
};

// Helper function to calculate completion using real API data (Issue #16)
const calculateProgress = (aspect: EditingAspectOverview): { completed: number; total: number; percentage: number; colorClass: string } => {
  const total = aspect.fieldCount || 7;
  const completed = aspect.completedFieldCount || 0; // Use real API data from Issue #16
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Color coding as per Issue #16 requirements
  let colorClass = 'progress-red';    // 0-33%
  if (percentage >= 67) {
    colorClass = 'progress-green';    // 67-100%
  } else if (percentage >= 34) {
    colorClass = 'progress-yellow';   // 34-66%
  }
  
  return { completed, total, percentage, colorClass };
};

const AspectSelection = forwardRef<AspectSelectionRef, AspectSelectionProps>(
  ({ videoId = "sample-video", videoName, category, onAspectSelect }, ref) => {
  const [aspects, setAspects] = useState<EditingAspectOverview[]>([]);
  const [selectedFields, setSelectedFields] = useState<EditingFieldMetadata[]>([]);
  const [selectedAspect, setSelectedAspect] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchAspects = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Fetching aspects with progress data...');
      // Use enhanced API with progress tracking when video context is available (Issue #16)
      const response: AspectOverviewResponse = await apiClient.getAspectsOverview(videoName, category);
      setAspects(response.aspects || []);
      console.log('✅ Aspects refreshed:', response.aspects?.length || 0);
    } catch (err) {
      setError('Failed to load aspects');
      console.error('Error loading aspects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Expose refresh function through ref
  useImperativeHandle(ref, () => ({
    refreshAspects: fetchAspects
  }));

  useEffect(() => {
    fetchAspects();
  }, [videoId, videoName, category]);

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
                    className={`progress-fill ${progress.colorClass}`}
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
});

export default AspectSelection; 