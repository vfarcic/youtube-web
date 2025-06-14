'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AspectSelection, { AspectSelectionRef } from './AspectSelection';
import AspectEditForm from './AspectEditForm';
import { apiClient, EditingFieldMetadata } from '../../lib/api-client';

interface AspectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId?: string;
  videoTitle?: string;
  videoName?: string;    // NEW: For progress tracking API (Issue #16)
  category?: string;     // NEW: For progress tracking API (Issue #16)
}

export default function AspectEditModal({ 
  isOpen, 
  onClose, 
  videoId,
  videoTitle = "Edit Video",
  videoName,           // NEW: For progress tracking API (Issue #16)
  category             // NEW: For progress tracking API (Issue #16)
}: AspectEditModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for managing which view is active
  const [currentView, setCurrentView] = useState<'selection' | 'form'>('selection');
  const [selectedAspect, setSelectedAspect] = useState<{
    key: string;
    title: string;
    description?: string;
  } | undefined>(undefined);
  const [selectedFields, setSelectedFields] = useState<EditingFieldMetadata[]>([]);

  // Add ref to AspectSelection for refreshing progress data
  const aspectSelectionRef = useRef<AspectSelectionRef>(null);

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

  // Sync state with URL parameters when modal opens
  useEffect(() => {
    if (isOpen) {
      const aspectParam = searchParams.get('aspect');
      if (aspectParam) {
        // Load aspect from URL parameter
        const aspectTitles: Record<string, string> = {
          'initial-details': 'Initial Details',
          'work-progress': 'Work Progress',
          'definition': 'Definition',
          'post-production': 'Post-Production',
          'publishing': 'Publishing',
          'post-publish': 'Post-Publish'
        };

        const aspectData = {
          key: aspectParam,
          title: aspectTitles[aspectParam] || aspectParam,
          description: `Edit ${aspectTitles[aspectParam] || aspectParam} aspect`
        };

        setSelectedAspect(aspectData);
        setCurrentView('form');
        
        // NEW: Load fields for the aspect when loading from URL
        const loadFieldsFromUrl = async () => {
          try {
            console.log('🔄 Loading fields for aspect from URL:', aspectParam);
            const response = await apiClient.getAspectFields(aspectParam);
            setSelectedFields(response.fields || []);
            console.log('✅ Loaded fields from URL:', response.fields?.length || 0);
          } catch (error) {
            console.error('❌ Error loading fields from URL:', error);
            setSelectedFields([]);
          }
        };

        loadFieldsFromUrl();
      } else {
        setCurrentView('selection');
        setSelectedAspect(undefined);
      }
    }
  }, [isOpen, searchParams]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentView('selection');
      setSelectedAspect(undefined);
      setSelectedFields([]);
    }
  }, [isOpen]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle aspect selection
  const handleAspectSelect = (aspectKey: string, fields: EditingFieldMetadata[]) => {
    console.log('Aspect selected:', aspectKey, fields);
    
    // Update URL with aspect parameter
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('aspect', aspectKey);
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/videos${query}`);
    
    // Create aspect object from the key
    const aspectTitles: Record<string, string> = {
      'initial-details': 'Initial Details',
      'work-progress': 'Work Progress',
      'definition': 'Definition',
      'post-production': 'Post-Production',
      'publishing': 'Publishing',
      'post-publish': 'Post-Publish'
    };

    setSelectedAspect({
      key: aspectKey,
      title: aspectTitles[aspectKey] || aspectKey,
      description: `Edit ${aspectTitles[aspectKey] || aspectKey} aspect`
    });
    setSelectedFields(fields);
    setCurrentView('form');
  };

  // Handle going back to aspect selection
  const handleBackToSelection = () => {
    // Remove aspect parameter from URL
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete('aspect');
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/videos${query}`);
    
    setCurrentView('selection');
    setSelectedAspect(undefined);
    setSelectedFields([]);
  };

  // Handle form save with progress refresh
  const handleFormSave = async (formData: any) => {
    console.log('Form data saved:', formData);
    
    // Refresh the aspect progress data after successful save
    try {
      console.log('🔄 Refreshing aspect progress data after save...');
      await aspectSelectionRef.current?.refreshAspects();
      console.log('✅ Aspect progress data refreshed');
    } catch (error) {
      console.error('❌ Failed to refresh aspect progress:', error);
      // Don't block the user flow if refresh fails
    }
    
    // Navigate back to selection view
    handleBackToSelection();
  };

  // Handle form cancel
  const handleFormCancel = () => {
    handleBackToSelection();
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
          {/* Aspect Selection View */}
          <div 
            id="aspect-selection-view" 
            className={`edit-view ${currentView === 'selection' ? 'active' : ''}`}
            style={{ display: currentView === 'selection' ? 'block' : 'none' }}
          >
            <div className="view-header">
              <h3>Select Aspect to Edit</h3>
            </div>
            
            <AspectSelection 
              ref={aspectSelectionRef}
              videoId={videoId}
              videoName={videoName}      // NEW: Pass video context for progress tracking
              category={category}        // NEW: Pass video context for progress tracking  
              onAspectSelect={handleAspectSelect}
            />
          </div>

          {/* Aspect Edit Form View */}
          <div 
            id="aspect-edit-view" 
            className={`edit-view ${currentView === 'form' ? 'active' : ''}`}
            style={{ display: currentView === 'form' ? 'block' : 'none' }}
          >
            <AspectEditForm
              aspect={selectedAspect}
              fields={selectedFields}
              videoData={{ 
                videoId: videoId, 
                videoName: videoName, 
                category: category 
              }}
              onBack={handleBackToSelection}
              onSave={handleFormSave}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 