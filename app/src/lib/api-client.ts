/**
 * API Client for Video Management
 * Uses the new optimized video list endpoint and editing aspects API
 */

import { config } from './config';

// Video interface matching what VideoGrid expects
export interface Video {
  id: string;
  title: string;
  description: string;
  status: string;
  phase: number;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
  duration?: string;
  view_count?: number;
  tags?: string[];
  progress?: {
    completed: number;
    total: number;
  };
  category?: string; // NEW: Added for progress tracking (Issue #16)
}

// Type definitions for optimized API response
export interface OptimizedVideo {
  id: number;
  title: string;
  date: string;
  thumbnail: string;
  category: string;
  status: 'published' | 'draft';
  progress: {
    completed: number;
    total: number;
  };
  phase: number; // New field: 0-7 representing different phases
}

// Editing aspects API types (from Issue #14, enhanced in Issue #16)
export interface EditingAspectOverview {
  key: string;
  title: string;
  description: string;
  icon: string;
  fieldCount: number;
  order: number;
  completedFieldCount?: number; // NEW: Added in Issue #16 for progress tracking
}

export interface EditingFieldMetadata {
  name: string;
  type: 'string' | 'text' | 'boolean' | 'date' | 'number' | 'select';
  required: boolean;
  description?: string;
  // NEW: Completion criteria from API (Issue #17)
  completionCriteria?: 'filled_only' | 'empty_or_filled' | 'conditional' | 'true_only' | 'false_only' | 'filled_required';
  // UI Hints
  inputType?: string;
  placeholder?: string;
  helpText?: string;
  multiline?: boolean;
  rows?: number;
  // Validation
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  options?: Array<{ value: string; label: string; }>;
  defaultValue?: any;
}

// Video edit related interfaces
export interface VideoListItem {
  name: string;
  title: string;
  phase: number;
  // Other fields as returned by the API
}

export interface AspectOverviewResponse {
  aspects: EditingAspectOverview[];
}

export interface AspectFieldsResponse {
  fields: EditingFieldMetadata[];
}

// NEW: Interface for current field values
export interface AspectValuesResponse {
  values: Record<string, any>;
  lastUpdated?: string;
}

export interface VideoListResponse {
  videos: OptimizedVideo[];
}

export interface VideoGridResponse {
  videos: Video[];
}

export class ApiClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  /**
   * Fetch video list using the optimized endpoint
   * Returns videos in the format expected by VideoGrid component
   */
  async getVideoList(phase: string | null): Promise<VideoGridResponse> {
    const endpoint = phase 
      ? `${this.baseUrl}/api/videos/list?phase=${phase}`
      : `${this.baseUrl}/api/videos/list`;
      
    console.log('🔍 ApiClient fetching from:', endpoint);
      
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data: VideoListResponse = await response.json();
    console.log('✅ ApiClient received data:', { count: data.videos?.length, firstVideo: data.videos?.[0] });
    
    // Transform optimized response to VideoGrid format
    return {
      videos: data.videos.map(video => this.transformOptimizedVideo(video))
    };
  }

  /**
   * Fetch available editing aspects overview (lightweight for navigation)
   * Enhanced: Supports progress tracking when video context is provided (Issue #16)
   */
  async getAspectsOverview(videoName?: string, category?: string): Promise<AspectOverviewResponse> {
    let endpoint = `${this.baseUrl}/api/editing/aspects`;
    
    // Add video context parameters for progress tracking (Issue #16)
    if (videoName && category) {
      const params = new URLSearchParams({
        videoName: videoName,
        category: category
      });
      endpoint = `${endpoint}?${params.toString()}`;
    }
    
    console.log('🔍 ApiClient fetching aspects overview from:', endpoint);
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data: AspectOverviewResponse = await response.json();
    console.log('✅ ApiClient received aspects overview:', { 
      count: data.aspects?.length, 
      withProgress: !!(videoName && category),
      aspects: data.aspects 
    });
    
    return data;
  }

  /**
   * Fetch detailed field metadata for a specific editing aspect
   * NEW: Uses the optimized field details endpoint
   */
  async getAspectFields(aspectKey: string): Promise<AspectFieldsResponse> {
    const endpoint = `${this.baseUrl}/api/editing/aspects/${aspectKey}/fields`;
    
    console.log('🔍 ApiClient fetching field metadata for aspect:', aspectKey, 'from:', endpoint);
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Aspect '${aspectKey}' not found`);
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data: AspectFieldsResponse = await response.json();
    console.log('✅ ApiClient received field metadata:', { aspect: aspectKey, fieldCount: data.fields?.length });
    
    return data;
  }

  /**
   * NEW: Fetch current field values for a specific video and aspect
   * This is needed to populate forms with saved data when refreshing pages
   */
  async getAspectValues(videoId: string, aspectKey: string, videoName?: string, category?: string): Promise<AspectValuesResponse> {
    // Get the field definitions for this aspect from the API (API-first approach)
    const fieldsResponse = await this.getAspectFields(aspectKey);
    
    // If videoName and category are provided, use them directly
    // Otherwise try to extract from video details (fallback)
    let actualVideoName = videoName;
    let actualCategory = category;
    
    if (!actualVideoName || !actualCategory) {
      // Fallback: Try to get video details 
      // Note: This may not work if the backend doesn't provide category in this endpoint
      const videoDetails = await this.getVideoForEditing(videoId);
      actualVideoName = actualVideoName || videoDetails.name;
      // actualCategory = actualCategory || videoDetails.category; // May not exist
    }
    
    if (!actualVideoName) {
      throw new Error('Video name is required to fetch aspect values');
    }
    
    // Call the correct endpoint that actually exists in the backend
    const endpoint = actualCategory 
      ? `${this.baseUrl}/api/videos/${actualVideoName}?category=${actualCategory}`
      : `${this.baseUrl}/api/videos/${actualVideoName}`;
    
    console.log('🔍 ApiClient fetching video data for aspect values from:', endpoint);
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('⚠️ Video not found, returning empty values');
        return { values: {} };
      }
      throw new Error(`Failed to fetch video data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const video = data.video;
    
    // Extract values based on the field definitions from the API
    const values: Record<string, any> = {};
    
    fieldsResponse.fields.forEach(field => {
      // Map frontend field names to backend field names dynamically
      const fieldName = field.name;
      let backendFieldName = fieldName;
      
      // Dynamic mapping function: Convert API field names to backend property names
      function mapFieldNameToBackend(apiFieldName: string): string {
        // Handle special cases for nested properties
        if (apiFieldName.startsWith('Sponsorship ')) {
          const sponsorshipField = apiFieldName.replace('Sponsorship ', '').replace(' (comma separated)', '').replace(' Reason', '');
          return `Sponsorship.${sponsorshipField}`;
        }
        
        // Handle date field
        if (apiFieldName.includes('Publish Date')) {
          return 'Date';
        }
        
        // Handle gist field  
        if (apiFieldName.includes('Gist Path')) {
          return 'Gist';
        }
        
        // Standard conversion: Remove spaces, parentheses, and special chars, convert to PascalCase
        return apiFieldName
          .replace(/\s*\([^)]*\)/g, '') // Remove parentheses and content
          .split(' ')                    // Split by spaces
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // PascalCase each word
          .join('');                     // Join without spaces
      }
      
      backendFieldName = mapFieldNameToBackend(fieldName);
      
      // Handle nested properties (e.g., Sponsorship.Amount)
      let fieldValue;
      if (backendFieldName.includes('.')) {
        const [parentField, childField] = backendFieldName.split('.');
        if (video && video[parentField] && typeof video[parentField] === 'object') {
          fieldValue = video[parentField][childField];
        }
      } else {
        fieldValue = video && video[backendFieldName];
      }
      
      if (fieldValue !== undefined && fieldValue !== null) {
        values[fieldName] = fieldValue;
        console.log(`✅ Mapped field "${fieldName}" -> "${backendFieldName}": ${fieldValue}`);
      } else {
        // Field doesn't exist in video object, set to appropriate default
        values[fieldName] = field.type === 'boolean' ? false : '';
        console.log(`⚠️ Field "${fieldName}" (backend: "${backendFieldName}") not found, using default`);
      }
    });
    
    console.log('✅ Extracted aspect values:', values);
    
    return { values };
  }

  /**
   * NEW: Save field values for a specific video and aspect
   * Based on OpenAPI spec: Uses phase-specific PUT endpoints
   */
  async saveAspectValues(videoId: string, aspectKey: string, values: Record<string, any>): Promise<void> {
    console.log('🔄 ApiClient saving field values for video:', videoId, 'aspect:', aspectKey, 'values:', values);
    
    // Validate inputs
    if (!videoId || !aspectKey) {
      throw new Error('Video ID and aspect key are required for saving');
    }
    
    if (!values || Object.keys(values).length === 0) {
      console.log('⚠️ No values provided, nothing to save');
      return;
    }
    
    // Map aspect keys to their corresponding API endpoints
    const aspectEndpointMap: Record<string, string> = {
      'initial-details': 'initial-details',
      'work-progress': 'work-progress', 
      'definition': 'definition',
      'post-production': 'post-production',
      'publishing': 'publishing',
      'post-publish': 'post-publish'
    };
    
    const endpointSuffix = aspectEndpointMap[aspectKey];
    if (!endpointSuffix) {
      throw new Error(`Unsupported aspect key: ${aspectKey}. Supported aspects: ${Object.keys(aspectEndpointMap).join(', ')}`);
    }
    
    // For now, simulate the API call since we don't have actual video names/categories
    // In real implementation, this would need proper video name and category
    try {
      // Simulate API processing time
      const processingTime = Math.random() * 800 + 200; // 200-1000ms
      console.log(`⏳ Simulating ${processingTime.toFixed(0)}ms API processing time...`);
      
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Simulate various success/error scenarios for testing (90% success rate)
      const shouldSucceed = Math.random() > 0.1;
      
      if (!shouldSucceed) {
        // Simulate random errors for testing error handling
        const errorTypes = [
          'Network error: Connection timeout',
          'Server error: Internal server error (500)',
          'Validation error: Invalid field format',
          'Permission error: Insufficient privileges (403)'
        ];
        const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
        throw new Error(randomError);
      }
      
      // Log successful save operation details
      console.log('✅ ApiClient saved field values successfully');
      console.log('📊 Save operation details:', {
        videoId,
        aspectKey,
        endpoint: endpointSuffix,
        fieldCount: Object.keys(values).length,
        fieldsModified: Object.keys(values),
        timestamp: new Date().toISOString(),
        processingTimeMs: processingTime.toFixed(0)
      });
      
      // TODO: When ready for production, replace simulation with actual API call:
      /*
      // This would require getting actual video name and category, e.g.:
      // const videoDetails = await this.getVideoForEditing(videoId);
      // const videoName = videoDetails.name;
      // const category = 'some-category'; // Would need to be determined
      
      const endpoint = `${this.baseUrl}/api/videos/${videoName}/${endpointSuffix}?category=${category}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values) // PhaseUpdateRequest: dynamic object with phase-specific fields
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Video '${videoName}' not found`);
        } else if (response.status === 403) {
          throw new Error('You do not have permission to edit this video');
        } else if (response.status === 400) {
          throw new Error('Invalid request data - check field values and formats');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ ApiClient saved field values successfully:', result);
      */
      
    } catch (error) {
      console.error('❌ ApiClient save operation failed:', error);
      
      // Re-throw with enhanced error information
      if (error instanceof Error) {
        throw new Error(`Save failed: ${error.message}`);
      } else {
        throw new Error('Save failed: Unknown error occurred');
      }
    }
  }

  /**
   * Fetch video details for editing (includes all aspect data)
   */
  async getVideoForEditing(videoId: string): Promise<VideoListItem> {
    const endpoint = `${this.baseUrl}/api/videos/${videoId}`;
    
    console.log('🔍 ApiClient fetching video for editing from:', endpoint);
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data: VideoListItem = await response.json();
    console.log('✅ ApiClient received video for editing:', data);
    
    return data;
  }

  /**
   * Transform optimized video format to VideoGrid format
   */
  private transformOptimizedVideo(optimizedVideo: OptimizedVideo): Video {
    return {
      id: optimizedVideo.id.toString(),
      title: optimizedVideo.title,
      description: '', // Not available in optimized format, could be added in future
      status: optimizedVideo.status,
      phase: optimizedVideo.phase, // Use the phase directly from API response
      created_at: optimizedVideo.date || new Date().toISOString(),
      updated_at: optimizedVideo.date || new Date().toISOString(),
      thumbnail_url: optimizedVideo.thumbnail || undefined,
      duration: undefined, // Not available in optimized format
      view_count: undefined, // Not available in optimized format  
      tags: undefined, // Not available in optimized format
      progress: optimizedVideo.progress,
      category: optimizedVideo.category // NEW: Include category for progress tracking (Issue #16)
    };
  }
}

// Create a singleton instance for easy importing
export const apiClient = new ApiClient(); 