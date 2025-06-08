'use client';

import { useEffect } from 'react';
import AspectSelection from './AspectSelection';

interface AspectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId?: string;
  videoTitle?: string;
}

export default function AspectEditModal({ 
  isOpen, 
  onClose, 
  videoId,
  videoTitle = "Edit Video" 
}: AspectEditModalProps) {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 id="edit-modal-title">{videoTitle}</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-content">
          <div id="aspect-selection-view" className="edit-view active">
            <div className="view-header">
              <h3>Select Aspect to Edit</h3>
            </div>
            
            <AspectSelection 
              videoId={videoId}
              onAspectSelect={(aspectKey, fields) => {
                console.log('Aspect selected:', aspectKey, fields);
                // TODO: Handle aspect selection - navigate to form view
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 