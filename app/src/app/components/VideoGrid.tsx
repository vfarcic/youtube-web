'use client';

import React, { useState, useEffect, useRef } from 'react';
import VideoCard from './VideoCard';
import AspectEditModal from './AspectEditModal';
import { config, getApiUrl } from '../../lib/config';
import { ApiClient, Video } from '../../lib/api-client';

interface VideoGridProps {
  selectedPhase: string | null;
  selectedPhaseName: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({ selectedPhase, selectedPhaseName }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const currentRequestRef = useRef<number>(0);
  const apiClient = new ApiClient();

  // Debug logging for prop changes
  console.log('🔍 VideoGrid render - selectedPhase:', selectedPhase, 'selectedPhaseName:', selectedPhaseName);
  console.log('🔍 VideoGrid render - videos.length:', videos.length, 'first video title:', videos[0]?.title);

  useEffect(() => {
    console.log('🔄 VideoGrid useEffect triggered - selectedPhase changed to:', selectedPhase);
    
    const fetchVideos = async () => {
      setLoading(true);
      
      try {
        console.log(`🔄 API CALL for phase ${selectedPhase} using API client`);
        
        const videoData = await apiClient.getVideoList(selectedPhase);
        
        console.log(`✅ API SUCCESS for phase ${selectedPhase}:`, videoData?.videos?.length || 0, 'videos');
        console.log(`📝 Setting ${videoData.videos.length} videos in state for phase ${selectedPhase}`);
        console.log('🎬 First 3 video titles:', videoData.videos.slice(0, 3).map((v: Video) => `ID:${v.id} - ${v.title}`));
        
        setVideos(videoData.videos);
        setError(null);
      } catch (err) {
        console.error('❌ API FAILED for phase', selectedPhase, ':', err);
        setError(`Unable to load videos. Please check your connection and try again.`);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedPhase]);

  const handleEditVideo = (videoId: string) => {
    // Find the video and open modal
    const video = videos.find(v => v.id === videoId);
    if (video) {
      setEditingVideo(video);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVideo(null);
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(getApiUrl(`${config.endpoints.videos}/${videoId}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove video from local state
      setVideos(videos.filter(video => video.id !== videoId));
      
    } catch (err) {
      console.error('Failed to delete video:', err);
      alert('Failed to delete video. Please try again.');
    }
  };

  const handleMoveVideo = async (videoId: string) => {
    // For now, we'll prompt the user to select a new phase
    const phases = ['Published', 'Publish Pending', 'Edit Requested', 'Material Done', 'Started', 'Delayed', 'Sponsored Blocked', 'Ideas'];
    const currentVideo = videos.find(v => v.id === videoId);
    if (!currentVideo) return;

    const phaseOptions = phases.map((name, index) => `${index}: ${name}`).join('\n');
    const input = prompt(`Current phase: ${phases[currentVideo.phase]} (${currentVideo.phase})\n\nSelect new phase:\n${phaseOptions}\n\nEnter phase number (0-7):`);
    
    if (input === null) return; // User cancelled
    
    const newPhase = parseInt(input);
    if (isNaN(newPhase) || newPhase < 0 || newPhase > 7) {
      alert('Invalid phase number. Please enter a number between 0 and 7.');
      return;
    }

    try {
      const response = await fetch(getApiUrl(`${config.endpoints.videos}/${videoId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phase: newPhase }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update video in local state
      setVideos(videos.map(video => 
        video.id === videoId ? { ...video, phase: newPhase } : video
      ));
      
    } catch (err) {
      console.error('Failed to update video phase:', err);
      alert('Failed to update video phase. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="video-grid-container">
        <div className="video-grid-loading">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <p>Loading videos...</p>
        </div>
        {/* Always include video-grid div for test consistency */}
        <div className="video-grid" style={{ display: 'none' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-grid-container">
        <div className="video-grid-error">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            <i className="fas fa-redo"></i>
            Retry
          </button>
        </div>
        {/* Always include video-grid div for test consistency */}
        <div className="video-grid" style={{ display: 'none' }}></div>
      </div>
    );
  }

  return (
    <div className="video-grid-container">
      <div className="video-grid">
        {videos.length === 0 ? (
          // Empty state within the grid
          <div className="empty-state video-grid-empty" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-icon">
              <i className="fas fa-video-slash"></i>
            </div>
            <h3>No videos found</h3>
            <p className="no-data-message">
              {selectedPhase === null 
                ? 'No videos have been created yet.' 
                : `No videos found in "${selectedPhaseName}" phase.`
              }
            </p>
            <button 
              onClick={() => window.location.href = '/create'}
              className="create-video-button"
            >
              <i className="fas fa-plus"></i>
              Create Your First Video
            </button>
          </div>
        ) : (
          // Render video cards
          videos.map((video) => {
            console.log('🎬 Rendering video card:', video.id, '-', video.title);
            return (
              <VideoCard
                key={video.id}
                video={video}
                onEdit={handleEditVideo}
                onDelete={handleDeleteVideo}
                onMove={handleMoveVideo}
                showPhase={selectedPhase === null}
              />
            );
          })
        )}
      </div>
      
      {/* Aspect Edit Modal */}
      <AspectEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        videoId={editingVideo?.id}
        videoTitle={editingVideo ? `Edit: ${editingVideo.title}` : "Edit Video"}
      />
    </div>
  );
};

export default VideoGrid;
