/**
 * Test Data Helpers - Dynamic Backend Data Discovery
 * 
 * These utilities help tests work with whatever data is available in the backend
 * instead of assuming specific videos, categories, or counts exist.
 */

const { APP_URL } = require('./test-helpers');

/**
 * Discover available videos from the backend API
 * @returns {Promise<{videos: Array, firstVideo: Object|null, categories: Array}>}
 */
async function discoverAvailableVideos() {
    try {
        const response = await fetch('http://localhost:8080/api/videos/list');
        const data = await response.json();
        
        const videos = data.videos || [];
        const firstVideo = videos.length > 0 ? videos[0] : null;
        const categories = [...new Set(videos.map(v => v.category).filter(Boolean))];
        
        return {
            videos,
            firstVideo,
            categories,
            hasVideos: videos.length > 0,
            videoCount: videos.length
        };
    } catch (error) {
        console.warn('Failed to discover videos:', error.message);
        return {
            videos: [],
            firstVideo: null,
            categories: [],
            hasVideos: false,
            videoCount: 0
        };
    }
}

/**
 * Discover available aspects from the backend API
 * @param {string} videoName - Optional video name for enhanced API
 * @param {string} category - Optional category for enhanced API
 * @returns {Promise<{aspects: Array, firstAspect: Object|null, hasAspects: boolean}>}
 */
async function discoverAvailableAspects(videoName = null, category = null) {
    try {
        let url = 'http://localhost:8080/api/editing/aspects';
        if (videoName && category) {
            url += `?videoName=${encodeURIComponent(videoName)}&category=${encodeURIComponent(category)}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        const aspects = data.aspects || [];
        const firstAspect = aspects.length > 0 ? aspects[0] : null;
        
        return {
            aspects,
            firstAspect,
            hasAspects: aspects.length > 0,
            aspectCount: aspects.length
        };
    } catch (error) {
        console.warn('Failed to discover aspects:', error.message);
        return {
            aspects: [],
            firstAspect: null,
            hasAspects: false,
            aspectCount: 0
        };
    }
}

/**
 * Discover available phases from the backend API
 * @returns {Promise<{phases: Array, firstPhase: Object|null, hasPhases: boolean}>}
 */
async function discoverAvailablePhases() {
    try {
        const response = await fetch('http://localhost:8080/api/videos/phases');
        const data = await response.json();
        
        const phases = data.phases || [];
        const firstPhase = phases.length > 0 ? phases[0] : null;
        
        return {
            phases,
            firstPhase,
            hasPhases: phases.length > 0,
            phaseCount: phases.length
        };
    } catch (error) {
        console.warn('Failed to discover phases:', error.message);
        return {
            phases: [],
            firstPhase: null,
            hasPhases: false,
            phaseCount: 0
        };
    }
}

/**
 * Get a safe video ID for testing (uses first available video)
 * @returns {Promise<string|null>}
 */
async function getSafeVideoIdForTesting() {
    const { firstVideo } = await discoverAvailableVideos();
    return firstVideo ? firstVideo.id : null;
}

/**
 * Get a safe video name and category for testing
 * @returns {Promise<{videoName: string|null, category: string|null}>}
 */
async function getSafeVideoDetailsForTesting() {
    const { firstVideo } = await discoverAvailableVideos();
    if (!firstVideo) {
        return { videoName: null, category: null };
    }
    
    return {
        videoName: firstVideo.name || firstVideo.title || 'test-video',
        category: firstVideo.category || 'test'
    };
}

/**
 * Create a test URL with a real video ID
 * @param {string} baseUrl - Base URL (e.g., '/videos')
 * @param {Object} params - URL parameters
 * @returns {Promise<string>}
 */
async function createTestUrlWithRealVideo(baseUrl, params = {}) {
    const videoId = await getSafeVideoIdForTesting();
    if (!videoId) {
        throw new Error('No videos available for testing. Backend may be empty or down.');
    }
    
    const urlParams = new URLSearchParams();
    
    // Add the real video ID to edit parameter if needed
    if (params.edit !== false) {
        urlParams.set('edit', videoId);
    }
    
    // Add any other parameters
    Object.entries(params).forEach(([key, value]) => {
        if (key !== 'edit' && value !== undefined && value !== false) {
            urlParams.set(key, value);
        }
    });
    
    const queryString = urlParams.toString();
    return `${APP_URL}${baseUrl}${queryString ? '?' + queryString : ''}`;
}

/**
 * Validate that backend has minimum required data for tests
 * @returns {Promise<{isValid: boolean, issues: Array<string>}>}
 */
async function validateBackendDataForTesting() {
    const issues = [];
    
    try {
        // Check if we have videos
        const { hasVideos, videoCount } = await discoverAvailableVideos();
        if (!hasVideos) {
            issues.push(`No videos found in backend (expected at least 1, found ${videoCount})`);
        }
        
        // Check if we have phases
        const { hasPhases, phaseCount } = await discoverAvailablePhases();
        if (!hasPhases) {
            issues.push(`No phases found in backend (expected at least 1, found ${phaseCount})`);
        }
        
        // Check if we have aspects (basic endpoint)
        const { hasAspects, aspectCount } = await discoverAvailableAspects();
        if (!hasAspects) {
            issues.push(`No aspects found in backend (expected at least 1, found ${aspectCount})`);
        }
        
    } catch (error) {
        issues.push(`Backend connectivity issue: ${error.message}`);
    }
    
    return {
        isValid: issues.length === 0,
        issues
    };
}

module.exports = {
    discoverAvailableVideos,
    discoverAvailableAspects,
    discoverAvailablePhases,
    getSafeVideoIdForTesting,
    getSafeVideoDetailsForTesting,
    createTestUrlWithRealVideo,
    validateBackendDataForTesting
}; 