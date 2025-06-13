/**
 * API Client Integration Test
 * Tests the frontend API client against the real backend
 */

async function testApiClient() {
    console.log('🔌 Testing API Client Integration...');
    
    const API_BASE_URL = 'http://localhost:8080';
    const tests = [];
    
    try {
        // Test 1: Video list endpoint
        console.log('  📹 Testing video list endpoint...');
        const videoListResponse = await fetch(`${API_BASE_URL}/api/videos/list`);
        const videoListSuccess = videoListResponse.ok;
        tests.push({
            name: 'Video list endpoint',
            success: videoListSuccess,
            details: { status: videoListResponse.status, endpoint: '/api/videos/list' }
        });
        
        let sampleVideoId = null;
        if (videoListSuccess) {
            const videoData = await videoListResponse.json();
            const hasCorrectStructure = videoData.videos && Array.isArray(videoData.videos);
            tests.push({
                name: 'Video list structure',
                success: hasCorrectStructure,
                details: { 
                    hasVideosWrapper: 'videos' in videoData,
                    isArray: Array.isArray(videoData.videos),
                    count: videoData.videos?.length || 0
                }
            });
            
            // Capture a sample video ID for later tests
            if (videoData.videos && videoData.videos.length > 0) {
                sampleVideoId = videoData.videos[0].id;
            }
        }
        
        // Test 2: Phase filtering
        console.log('  🎯 Testing phase filtering...');
        const phaseResponse = await fetch(`${API_BASE_URL}/api/videos/list?phase=7`);
        const phaseSuccess = phaseResponse.ok;
        tests.push({
            name: 'Phase filtering',
            success: phaseSuccess,
            details: { status: phaseResponse.status, endpoint: '/api/videos/list?phase=7' }
        });
        
        if (phaseSuccess) {
            const phaseData = await phaseResponse.json();
            const allPhase7 = phaseData.videos?.every(video => video.phase === 7) || false;
            tests.push({
                name: 'Phase filter accuracy',
                success: allPhase7,
                details: { 
                    expectedPhase: 7,
                    allCorrectPhase: allPhase7,
                    samplePhases: phaseData.videos?.slice(0, 3).map(v => v.phase) || []
                }
            });
        }
        
        // Test 3: Data format validation (PRD #18)
        console.log('  🔍 Testing string-based ID format...');
        const stringIdResponse = await fetch(`${API_BASE_URL}/api/videos/list?phase=7`);
        if (stringIdResponse.ok) {
            const stringIdData = await stringIdResponse.json();
            if (stringIdData.videos && stringIdData.videos.length > 0) {
                const firstVideo = stringIdData.videos[0];
                const hasStringId = typeof firstVideo.id === 'string' && firstVideo.id.includes('/');
                const hasNameField = typeof firstVideo.name === 'string';
                
                tests.push({
                    name: 'String-based ID format',
                    success: hasStringId,
                    details: { 
                        idType: typeof firstVideo.id,
                        idFormat: firstVideo.id,
                        hasSlash: firstVideo.id?.includes('/') || false
                    }
                });
                
                tests.push({
                    name: 'Name field present',
                    success: hasNameField,
                    details: { 
                        nameType: typeof firstVideo.name,
                        nameValue: firstVideo.name
                    }
                });
            }
        }
        
        // Test 4: getVideoForEditing endpoint (PRD #18 - NEW)
        console.log('  📝 Testing getVideoForEditing endpoint...');
        if (sampleVideoId) {
            const videoEditResponse = await fetch(`${API_BASE_URL}/api/videos/${sampleVideoId}`);
            const videoEditSuccess = videoEditResponse.ok;
            tests.push({
                name: 'getVideoForEditing endpoint',
                success: videoEditSuccess,
                details: { 
                    status: videoEditResponse.status, 
                    endpoint: `/api/videos/${sampleVideoId}`,
                    videoId: sampleVideoId
                }
            });
            
            if (videoEditSuccess) {
                const videoEditData = await videoEditResponse.json();
                const hasRequiredFields = videoEditData.name && videoEditData.category && videoEditData.id;
                const idMatchesFormat = typeof videoEditData.id === 'string' && videoEditData.id.includes('/');
                
                tests.push({
                    name: 'Video edit response structure',
                    success: hasRequiredFields,
                    details: { 
                        hasName: !!videoEditData.name,
                        hasCategory: !!videoEditData.category,
                        hasId: !!videoEditData.id,
                        nameValue: videoEditData.name,
                        categoryValue: videoEditData.category,
                        idValue: videoEditData.id
                    }
                });
                
                tests.push({
                    name: 'Video edit ID format consistency',
                    success: idMatchesFormat,
                    details: { 
                        idFormat: videoEditData.id,
                        hasSlash: videoEditData.id?.includes('/') || false,
                        expectedFormat: 'category/filename'
                    }
                });
                
                // Test that the ID components match the separate fields
                if (videoEditData.id && videoEditData.id.includes('/')) {
                    const [idCategory, idName] = videoEditData.id.split('/');
                    const fieldsMatch = idCategory === videoEditData.category && idName === videoEditData.name;
                    tests.push({
                        name: 'ID components match separate fields',
                        success: fieldsMatch,
                        details: { 
                            idCategory,
                            idName,
                            separateCategory: videoEditData.category,
                            separateName: videoEditData.name,
                            categoryMatch: idCategory === videoEditData.category,
                            nameMatch: idName === videoEditData.name
                        }
                    });
                }
            }
        } else {
            tests.push({
                name: 'getVideoForEditing endpoint',
                success: false,
                details: { error: 'No sample video ID available for testing' }
            });
        }
        
        // Test 5: Error handling
        console.log('  ⚠️  Testing error handling...');
        const errorResponse = await fetch(`${API_BASE_URL}/api/videos/list?phase=999`);
        const handlesErrors = errorResponse.status === 400 || errorResponse.ok; // Either handles gracefully or returns valid data
        tests.push({
            name: 'Error handling',
            success: handlesErrors,
            details: { 
                status: errorResponse.status,
                statusText: errorResponse.statusText,
                endpoint: '/api/videos/list?phase=999'
            }
        });
        
        console.log('✅ API client integration test completed');
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
        console.error('❌ API client integration test failed:', error.message);
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

module.exports = { testApiClient }; 