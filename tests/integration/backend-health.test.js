/**
 * Backend Health Integration Test
 * Tests backend connectivity and basic API health
 */

async function testBackendHealth() {
    console.log('🏥 Testing Backend Health...');
    
    const API_BASE_URL = 'http://localhost:8080';
    const tests = [];
    
    try {
        // Test 1: Basic connectivity
        console.log('  📡 Testing basic connectivity...');
        const healthResponse = await fetch(`${API_BASE_URL}/api/videos/list?phase=7`);
        tests.push({
            name: 'Backend connectivity',
            success: healthResponse.ok,
            details: { status: healthResponse.status, statusText: healthResponse.statusText }
        });
        
        if (!healthResponse.ok) {
            throw new Error(`Backend not responding: ${healthResponse.status} ${healthResponse.statusText}`);
        }
        
        // Test 2: Response format
        console.log('  📋 Testing response format...');
        const data = await healthResponse.json();
        const hasValidFormat = data && Array.isArray(data.videos);
        tests.push({
            name: 'Valid response format',
            success: hasValidFormat,
            details: { hasVideosArray: Array.isArray(data.videos), videoCount: data.videos?.length || 0 }
        });
        
        // Test 3: Data structure validation
        console.log('  🔍 Testing data structure...');
        if (data.videos && data.videos.length > 0) {
            const firstVideo = data.videos[0];
            const hasRequiredFields = firstVideo.id && firstVideo.title && firstVideo.category;
            tests.push({
                name: 'Required fields present',
                success: hasRequiredFields,
                details: { 
                    hasId: !!firstVideo.id, 
                    hasTitle: !!firstVideo.title, 
                    hasCategory: !!firstVideo.category,
                    sampleVideo: firstVideo
                }
            });
        }
        
        // Test 4: Performance check
        console.log('  ⚡ Testing response time...');
        const startTime = Date.now();
        await fetch(`${API_BASE_URL}/api/videos/list?phase=0`);
        const responseTime = Date.now() - startTime;
        const isPerformant = responseTime < 5000; // 5 second threshold
        tests.push({
            name: 'Response time under 5s',
            success: isPerformant,
            details: { responseTime, threshold: 5000 }
        });
        
        console.log('✅ Backend health check completed');
        return {
            success: true,
            tests,
            summary: {
                total: tests.length,
                passed: tests.filter(t => t.success).length,
                failed: tests.filter(t => !t.success).length
            }
        };
        
    } catch (error) {
        console.error('❌ Backend health check failed:', error.message);
        return {
            success: false,
            error: error.message,
            tests,
            summary: {
                total: tests.length,
                passed: tests.filter(t => t.success).length,
                failed: tests.filter(t => !t.success).length
            }
        };
    }
}

module.exports = { testBackendHealth }; 