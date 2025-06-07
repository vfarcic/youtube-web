'use client';

import React, { useMemo, useCallback } from 'react';
import { usePhases } from '../../lib/hooks/usePhases';

interface Video {
  id: string;
  title: string;
  description: string;
  status: string;
  phase: number;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
  duration?: string;
  tags?: string[];
  progress?: {
    completed: number;
    total: number;
  };
}

interface VideoCardProps {
  video: Video;
  onEdit?: (videoId: string) => void;
  onDelete?: (videoId: string) => void;
  onMove?: (videoId: string) => void;
  showPhase?: boolean;
}

// Memoized utility functions
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  } catch {
    return 'Invalid Date';
  }
};

const getProgressColor = (percentage: number): string => {
  if (percentage === 100) return '#22c55e'; // green
  if (percentage >= 75) return '#3b82f6';   // blue
  if (percentage >= 50) return '#f59e0b';   // amber
  if (percentage >= 25) return '#f97316';   // orange
  return '#ef4444'; // red
};

const VideoCard: React.FC<VideoCardProps> = React.memo(({ 
  video, 
  onEdit, 
  onDelete, 
  onMove, 
  showPhase 
}) => {
  // Use shared phase data from API
  const { getPhaseById, getPhaseColor } = usePhases();

  // Memoized expensive calculations
  const progressData = useMemo(() => {
    if (!video.progress || video.progress.total === 0) {
      return { percentage: 0, color: '#ef4444' };
    }
    const percentage = Math.round((video.progress.completed / video.progress.total) * 100);
    return { 
      percentage, 
      color: getProgressColor(percentage) 
    };
  }, [video.progress]);

  const phaseData = useMemo(() => {
    const phase = getPhaseById(video.phase);
    return {
      name: phase?.name || `Phase ${video.phase}`,
      color: getPhaseColor(video.phase)
    };
  }, [video.phase, getPhaseById, getPhaseColor]);

  const formattedDate = useMemo(() => formatDate(video.created_at), [video.created_at]);

  const displayTags = useMemo(() => {
    if (!video.tags || video.tags.length === 0) return null;
    return {
      visible: video.tags.slice(0, 3),
      additional: video.tags.length > 3 ? video.tags.length - 3 : 0
    };
  }, [video.tags]);

  // Memoized event handlers to prevent unnecessary re-renders
  const handleEdit = useCallback(() => {
    onEdit?.(video.id);
  }, [onEdit, video.id]);

  const handleDelete = useCallback(() => {
    onDelete?.(video.id);
  }, [onDelete, video.id]);

  const handleMove = useCallback(() => {
    onMove?.(video.id);
  }, [onMove, video.id]);

  return (
    <div className="video-card">
      <h3>{video.title}</h3>
      <p>{video.description}</p>
      
      {/* Progress bar (from optimized API) */}
      {video.progress && (
        <div className="video-progress">
          <div className="progress-label">
            <span>Progress: {video.progress.completed}/{video.progress.total}</span>
            <span className="progress-percentage">{progressData.percentage}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ 
                width: `${progressData.percentage}%`,
                backgroundColor: progressData.color
              }}
            />
          </div>
        </div>
      )}
      
      {/* Video metadata section */}
      <div className="video-metadata">
        <div className="video-stats">
          {video.duration && (
            <span className="video-duration">
              <i className="fas fa-clock"></i>
              {video.duration}
            </span>
          )}
          <span className="created-date">
            <i className="fas fa-calendar"></i>
            {formattedDate}
          </span>
        </div>
        <div className="video-phase">
          {showPhase && (
            <div className="phase-badge" style={{ backgroundColor: phaseData.color }}>
              {phaseData.name}
            </div>
          )}
        </div>
      </div>

      {/* Video tags if they exist */}
      {displayTags && (
        <div className="video-tags">
          {displayTags.visible.map((tag, index) => (
            <span key={index} className="video-tag">
              {tag}
            </span>
          ))}
          {displayTags.additional > 0 && (
            <span className="video-tag-more">
              +{displayTags.additional} more
            </span>
          )}
        </div>
      )}
      
      <div className="video-actions">
        <button className="btn-edit" onClick={handleEdit} title="Edit Video">
          <i className="fas fa-edit"></i>
          Edit
        </button>
        <button className="btn-delete" onClick={handleDelete} disabled title="Coming Soon">
          <i className="fas fa-trash"></i>
          Delete (Coming Soon)
        </button>
        <button className="btn-move" onClick={handleMove} disabled title="Coming Soon">
          <i className="fas fa-arrows-alt"></i>
          Move (Coming Soon)
        </button>
      </div>
    </div>
  );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;
