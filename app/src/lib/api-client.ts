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

// Editing aspects API types (from Issue #14)
export interface EditingAspectOverview {
  key: string;
  title: string;
  description: string;
  icon: string;
  fieldCount: number;
  order: number;
}

export interface EditingFieldMetadata {
  name: string;
  type: 'string' | 'text' | 'boolean' | 'date' | 'number' | 'select';
  required: boolean;
  description?: string;
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
   * NEW: Uses the optimized aspects overview endpoint
   */
  async getAspectsOverview(): Promise<AspectOverviewResponse> {
    const endpoint = `${this.baseUrl}/api/editing/aspects`;
    
    console.log('🔍 ApiClient fetching aspects overview from:', endpoint);
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data: AspectOverviewResponse = await response.json();
    console.log('✅ ApiClient received aspects overview:', { count: data.aspects?.length, aspects: data.aspects });
    
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
      progress: optimizedVideo.progress
    };
  }
}

// Create a singleton instance for easy importing
export const apiClient = new ApiClient(); 