/**
 * API Client for Video Management
 * Uses the new optimized video list endpoint
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