/**
 * API Client for Video Management
 * Uses the new optimized video list endpoint and editing aspects API
 */

import { config } from './config';

// Video interface matching what VideoGrid expects
export interface Video {
  id: string;
  name?: string; // NEW: Backend video name field (e.g., "ai-kills-iac")
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
  id: string; // PRD #18: Changed from number to string format "category/filename"
  name: string; // Backend video name field (e.g., "ai-kills-iac")
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
  fieldName: string; // NEW: Actual property name from backend field metadata enhancement
  type: 'string' | 'text' | 'boolean' | 'date' | 'number' | 'select';
  required: boolean;
  description?: string;
  order?: number; // NEW: Field ordering from API
  // NEW: Completion criteria from API (Issue #17)
  completionCriteria?: 'filled_only' | 'empty_or_filled' | 'conditional' | 'conditional_sponsorship' | 'true_only' | 'false_only' | 'filled_required';
  // NEW: UI Hints from API
  uiHints?: {
    inputType: string;
    placeholder: string;
    helpText: string;
    multiline: boolean;
  };
  // NEW: Validation hints from API
  validationHints?: {
    required: boolean;
  };
  // Legacy UI Hints (for backward compatibility)
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

/**
 * Video edit related interfaces
 * 
 * Field Usage Guidelines (based on backend API consistency update):
 * - Use `ProjectName` for user-friendly display names (e.g., "My Video Name")
 * - Use `Name` for file operations, URLs, and technical references (sanitized filename)
 * - Use `Title` for legacy compatibility where needed
 * 
 * The `Name` field now consistently returns sanitized filenames (lowercase with hyphens)
 * that match the filename part of the `id` field.
 */
export interface VideoListItem {
  id: string; // PRD #18: Added string-based ID field in format "category/filename"
  Name: string; // API returns sanitized filename (lowercase with hyphens) - use for technical operations
  Title?: string; // API may return "Title" - legacy field
  ProjectName?: string; // API returns user-friendly display name - use for UI display
  phase?: number; // API may return phase
  Category: string; // PRD #18: API returns "Category" with capital C
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
        videoName: videoName, // URLSearchParams automatically handles encoding
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
      // Fallback: Get video details which now includes separate Name and Category fields
      const videoDetails = await this.getVideoForEditing(videoId);
      actualVideoName = actualVideoName || videoDetails.Name;
      actualCategory = actualCategory || videoDetails.Category;
    }
    
    if (!actualVideoName) {
      throw new Error('Video name is required to fetch aspect values');
    }
    
    // Call the correct endpoint that actually exists in the backend
    // PRD #18: Use separate name and category fields instead of encoding combined ID
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
      // Use the fieldName property from backend field metadata enhancement
      const displayName = field.name; // For UI display
      const backendFieldName = field.fieldName; // For API data mapping
      
      // Handle nested properties (e.g., sponsorship.amount)
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
        values[displayName] = fieldValue;
        console.log(`✅ Mapped field "${displayName}" -> "${backendFieldName}": ${fieldValue}`);
      } else {
        // Field doesn't exist in video object, set to appropriate default
        values[displayName] = field.type === 'boolean' ? false : '';
        console.log(`⚠️ Field "${displayName}" (backend: "${backendFieldName}") not found, using default`);
      }
    });
    
    console.log('✅ Extracted aspect values:', values);
    
    return { values };
  }

  /**
   * NEW: Save field values for a specific video and aspect
   * Based on OpenAPI spec: Uses phase-specific PUT endpoints
   */
  async saveAspectValues(videoId: string, aspectKey: string, values: Record<string, any>, videoName?: string, category?: string): Promise<void> {
    console.log('🔄 ApiClient saving field values for video:', videoId, 'aspect:', aspectKey, 'values:', values);
    console.log('🔄 Video context - videoName:', videoName, 'category:', category);
    
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
    
    // Check if we have the required data for real API call
    if (!videoName || !category) {
      console.warn('⚠️ Missing videoName or category, cannot make real API call');
      throw new Error('Video name and category are required for saving aspect values');
    }
    
    try {
      // Make the real API call based on OpenAPI spec
      // PRD #18: Use separate name and category fields from the API response
      const endpoint = `${this.baseUrl}/api/videos/${videoName}/${endpointSuffix}?category=${category}`;
      console.log('🌐 Making PUT request to:', endpoint);
      console.log('📤 Request body:', values);
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values) // PhaseUpdateRequest: dynamic object with phase-specific fields
      });
      
      console.log('📥 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Video '${videoName}' not found`);
        } else if (response.status === 403) {
          throw new Error('You do not have permission to edit this video');
        } else if (response.status === 400) {
          const errorText = await response.text();
          throw new Error(`Invalid request data: ${errorText}`);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Try to parse response as JSON, but handle cases where there's no response body
      let result;
      const responseText = await response.text();
      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          result = responseText;
        }
      }
      
      console.log('✅ ApiClient saved field values successfully:', result);
      console.log('📊 Save operation details:', {
        videoId,
        videoName,
        category,
        aspectKey,
        endpoint: endpointSuffix,
        fieldCount: Object.keys(values).length,
        fieldsModified: Object.keys(values),
        timestamp: new Date().toISOString(),
        responseStatus: response.status
      });
      
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
    // PRD #18: Extract name and category from "category/filename" ID format
    // The backend API expects separate name and category parameters
    const [category, name] = videoId.split('/');
    if (!category || !name) {
      throw new Error(`Invalid video ID format. Expected "category/filename", got: ${videoId}`);
    }
    
    const endpoint = `${this.baseUrl}/api/videos/${name}?category=${category}`;
    
    console.log('🔍 ApiClient fetching video for editing from:', endpoint);
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const rawData = await response.json();
    console.log('✅ ApiClient received raw video data:', rawData);
    
    // Return the video data directly as the API provides it
    // No field mapping needed - use the API field names as-is
    const videoData: VideoListItem = rawData.video;
    
    console.log('✅ ApiClient returning video for editing:', videoData);
    
    return videoData;
  }

  /**
   * Generate AI titles for video content
   * Uses the optimized /api/ai/titles/{videoName}?category={category} endpoint when video context is available,
   * or falls back to the legacy /api/ai/titles endpoint
   */
  async generateAITitles(manuscriptOrVideoName?: string, category?: string): Promise<string[]> {
    // Determine if we should use optimized or legacy endpoint
    const useOptimizedEndpoint = manuscriptOrVideoName && category;
    
    if (useOptimizedEndpoint) {
      console.log('🤖 ApiClient generating AI titles using optimized endpoint for video:', manuscriptOrVideoName, 'category:', category);
      
      const endpoint = `${this.baseUrl}/api/ai/titles/${encodeURIComponent(manuscriptOrVideoName)}?category=${encodeURIComponent(category)}`;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST'
        });
        
        console.log('📥 AI titles response status:', response.status, response.statusText);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Video '${manuscriptOrVideoName}' not found`);
          } else if (response.status === 400) {
            throw new Error('Missing category parameter');
          } else if (response.status === 500) {
            throw new Error('AI service temporarily unavailable');
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ ApiClient received AI titles (optimized):', data);
        
        // API returns { titles: string[] }
        return data.titles || [];
        
      } catch (error) {
        console.error('❌ ApiClient AI title generation failed (optimized):', error);
        
        if (error instanceof Error) {
          throw new Error(`AI title generation failed: ${error.message}`);
        } else {
          throw new Error('AI title generation failed: Unknown error occurred');
        }
      }
    } else {
      // Legacy endpoint for backward compatibility
      console.log('🤖 ApiClient generating AI titles using legacy endpoint for manuscript length:', manuscriptOrVideoName?.length || 0);
      
      const endpoint = `${this.baseUrl}/api/ai/titles`;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ manuscript: manuscriptOrVideoName || '' })
        });
        
        console.log('📥 AI titles response status:', response.status, response.statusText);
        
        if (!response.ok) {
          if (response.status === 400) {
            throw new Error('Invalid manuscript content provided');
          } else if (response.status === 500) {
            throw new Error('AI service temporarily unavailable');
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ ApiClient received AI titles (legacy):', data);
        
        // API returns { titles: string[] }
        return data.titles || [];
        
      } catch (error) {
        console.error('❌ ApiClient AI title generation failed (legacy):', error);
        
        if (error instanceof Error) {
          throw new Error(`AI title generation failed: ${error.message}`);
        } else {
          throw new Error('AI title generation failed: Unknown error occurred');
        }
      }
    }
  }

  /**
   * Generate AI description for video content
   * Uses the optimized /api/ai/description/{videoName}?category={category} endpoint when video context is available,
   * or falls back to the legacy /api/ai/description endpoint
   */
  async generateAIDescription(manuscriptOrVideoName?: string, category?: string): Promise<string> {
    const useOptimizedEndpoint = manuscriptOrVideoName && category;
    
    if (useOptimizedEndpoint) {
      console.log('🤖 ApiClient generating AI description using optimized endpoint for video:', manuscriptOrVideoName, 'category:', category);
      
      const endpoint = `${this.baseUrl}/api/ai/description/${encodeURIComponent(manuscriptOrVideoName)}?category=${encodeURIComponent(category)}`;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST'
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Video '${manuscriptOrVideoName}' not found`);
          } else if (response.status === 400) {
            throw new Error('Missing category parameter');
          } else if (response.status === 500) {
            throw new Error('AI service temporarily unavailable');
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ ApiClient received AI description (optimized):', data);
        
        return data.description || '';
        
      } catch (error) {
        console.error('❌ ApiClient AI description generation failed (optimized):', error);
        throw new Error(`AI description generation failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    } else {
      // Legacy endpoint for backward compatibility
      const endpoint = `${this.baseUrl}/api/ai/description`;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ manuscript: manuscriptOrVideoName || '' })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.description || '';
        
      } catch (error) {
        console.error('❌ ApiClient AI description generation failed (legacy):', error);
        throw new Error(`AI description generation failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    }
  }

  /**
   * Generate AI tags for video content
   * Uses the optimized /api/ai/tags/{videoName}?category={category} endpoint when video context is available,
   * or falls back to the legacy /api/ai/tags endpoint
   */
  async generateAITags(manuscriptOrVideoName?: string, category?: string): Promise<string[]> {
    const useOptimizedEndpoint = manuscriptOrVideoName && category;
    
    if (useOptimizedEndpoint) {
      console.log('🤖 ApiClient generating AI tags using optimized endpoint for video:', manuscriptOrVideoName, 'category:', category);
      
      const endpoint = `${this.baseUrl}/api/ai/tags/${encodeURIComponent(manuscriptOrVideoName)}?category=${encodeURIComponent(category)}`;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST'
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Video '${manuscriptOrVideoName}' not found`);
          } else if (response.status === 400) {
            throw new Error('Missing category parameter');
          } else if (response.status === 500) {
            throw new Error('AI service temporarily unavailable');
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ ApiClient received AI tags (optimized):', data);
        
        return data.tags || [];
        
      } catch (error) {
        console.error('❌ ApiClient AI tags generation failed (optimized):', error);
        throw new Error(`AI tags generation failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    } else {
      // Legacy endpoint for backward compatibility
      const endpoint = `${this.baseUrl}/api/ai/tags`;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ manuscript: manuscriptOrVideoName || '' })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.tags || [];
        
      } catch (error) {
        console.error('❌ ApiClient AI tags generation failed (legacy):', error);
        throw new Error(`AI tags generation failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    }
  }

  /**
   * Generate AI tweets for video content
   * Uses the optimized /api/ai/tweets/{videoName}?category={category} endpoint when video context is available,
   * or falls back to the legacy /api/ai/tweets endpoint
   */
  async generateAITweets(manuscriptOrVideoName?: string, category?: string): Promise<string[]> {
    const useOptimizedEndpoint = manuscriptOrVideoName && category;
    
    if (useOptimizedEndpoint) {
      console.log('🤖 ApiClient generating AI tweets using optimized endpoint for video:', manuscriptOrVideoName, 'category:', category);
      
      const endpoint = `${this.baseUrl}/api/ai/tweets/${encodeURIComponent(manuscriptOrVideoName)}?category=${encodeURIComponent(category)}`;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST'
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Video '${manuscriptOrVideoName}' not found`);
          } else if (response.status === 400) {
            throw new Error('Missing category parameter');
          } else if (response.status === 500) {
            throw new Error('AI service temporarily unavailable');
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ ApiClient received AI tweets (optimized):', data);
        
        return data.tweets || [];
        
      } catch (error) {
        console.error('❌ ApiClient AI tweets generation failed (optimized):', error);
        throw new Error(`AI tweets generation failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    } else {
      // Legacy endpoint for backward compatibility
      const endpoint = `${this.baseUrl}/api/ai/tweets`;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ manuscript: manuscriptOrVideoName || '' })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.tweets || [];
        
      } catch (error) {
        console.error('❌ ApiClient AI tweets generation failed (legacy):', error);
        throw new Error(`AI tweets generation failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    }
  }

  /**
   * Generate AI highlights for video content
   * Uses the optimized /api/ai/highlights/{videoName}?category={category} endpoint when video context is available,
   * or falls back to the legacy /api/ai/highlights endpoint
   */
  async generateAIHighlights(manuscriptOrVideoName?: string, category?: string): Promise<string[]> {
    const useOptimizedEndpoint = manuscriptOrVideoName && category;
    
    if (useOptimizedEndpoint) {
      console.log('🤖 ApiClient generating AI highlights using optimized endpoint for video:', manuscriptOrVideoName, 'category:', category);
      
      const endpoint = `${this.baseUrl}/api/ai/highlights/${encodeURIComponent(manuscriptOrVideoName)}?category=${encodeURIComponent(category)}`;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST'
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Video '${manuscriptOrVideoName}' not found`);
          } else if (response.status === 400) {
            throw new Error('Missing category parameter');
          } else if (response.status === 500) {
            throw new Error('AI service temporarily unavailable');
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ ApiClient received AI highlights (optimized):', data);
        
        return data.highlights || [];
        
      } catch (error) {
        console.error('❌ ApiClient AI highlights generation failed (optimized):', error);
        throw new Error(`AI highlights generation failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    } else {
      // Legacy endpoint for backward compatibility
      const endpoint = `${this.baseUrl}/api/ai/highlights`;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ manuscript: manuscriptOrVideoName || '' })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.highlights || [];
        
      } catch (error) {
        console.error('❌ ApiClient AI highlights generation failed (legacy):', error);
        throw new Error(`AI highlights generation failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    }
  }

  /**
   * Generate AI animations for video content
   * Uses the optimized /api/animations/{videoName}?category={category} endpoint
   */
  async generateAIAnimations(videoName: string, category: string): Promise<string> {
    console.log('🤖 ApiClient generating AI animations using optimized endpoint for video:', videoName, 'category:', category);
    
    const endpoint = `${this.baseUrl}/api/animations/${encodeURIComponent(videoName)}?category=${encodeURIComponent(category)}`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'GET'
      });
      
      console.log('📥 AI animations response status:', response.status, response.statusText);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Animations for video '${videoName}' not found or endpoint not implemented`);
        } else if (response.status === 400) {
          throw new Error('Missing category parameter');
        } else if (response.status === 500) {
          throw new Error('Animations service temporarily unavailable');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ ApiClient received AI animations:', data);
      
      // API returns { animations: Array<string> } - convert to string for text field
      if (data.animations && Array.isArray(data.animations)) {
        // Join animations array into a formatted string with single line breaks
        return data.animations.join('\n');
      }
      
      // Fallback for other response formats
      return data.animations || data.manuscript || '';
      
    } catch (error) {
      console.error('❌ ApiClient AI animations generation failed:', error);
      
      if (error instanceof Error) {
        throw new Error(`AI animations generation failed: ${error.message}`);
      } else {
        throw new Error('AI animations generation failed: Unknown error occurred');
      }
    }
  }

  /**
   * Generate AI description with tags for video content
   * Uses the optimized /api/ai/description-tags/{videoName}?category={category} endpoint when video context is available,
   * or falls back to the legacy /api/ai/description-tags endpoint
   */
  async generateAIDescriptionTags(manuscriptOrVideoName?: string, category?: string): Promise<string> {
    const useOptimizedEndpoint = manuscriptOrVideoName && category;
    
    if (useOptimizedEndpoint) {
      console.log('🤖 ApiClient generating AI description-tags using optimized endpoint for video:', manuscriptOrVideoName, 'category:', category);
      
      const endpoint = `${this.baseUrl}/api/ai/description-tags/${encodeURIComponent(manuscriptOrVideoName)}?category=${encodeURIComponent(category)}`;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST'
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Video '${manuscriptOrVideoName}' not found`);
          } else if (response.status === 400) {
            throw new Error('Missing category parameter');
          } else if (response.status === 500) {
            throw new Error('AI service temporarily unavailable');
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ ApiClient received AI description-tags (optimized):', data);
        
        // Handle both possible response formats: description_tags (API spec) or descriptionTags (legacy)
        const descriptionTags = data.description_tags || data.descriptionTags || [];
        
        // Join array into a single string if it's an array, otherwise return as string
        return Array.isArray(descriptionTags) ? descriptionTags.join('\n\n') : descriptionTags;
        
      } catch (error) {
        console.error('❌ ApiClient AI description-tags generation failed (optimized):', error);
        throw new Error(`AI description-tags generation failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    } else {
      // Legacy endpoint for backward compatibility
      const endpoint = `${this.baseUrl}/api/ai/description-tags`;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ manuscript: manuscriptOrVideoName || '' })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        // Handle both possible response formats: description_tags (API spec) or descriptionTags (legacy)
        const descriptionTags = data.description_tags || data.descriptionTags || [];
        
        // Join array into a single string if it's an array, otherwise return as string
        return Array.isArray(descriptionTags) ? descriptionTags.join('\n\n') : descriptionTags;
        
      } catch (error) {
        console.error('❌ ApiClient AI description-tags generation failed (legacy):', error);
        throw new Error(`AI description-tags generation failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    }
  }

  /**
   * Transform optimized video format to VideoGrid format
   * PRD #18: Updated to handle string-based IDs directly
   */
  private transformOptimizedVideo(optimizedVideo: OptimizedVideo): Video {
    return {
      id: optimizedVideo.id, // PRD #18: ID is already string format "category/filename"
      name: optimizedVideo.name, // NEW: Include backend video name (e.g., "ai-kills-iac")
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
