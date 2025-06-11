/**
 * API Integration Tests for Aspect Selection Feature
 * 
 * These tests verify the backend API endpoints from Issue #14 and Issue #16
 * Note: The frontend AspectSelection component is now tested as part of the modal
 * implementation in videos.test.js and aspect-progress-tracking.test.js
 */

const { APP_URL, validateTests, logTestCompletion } = require('../utils/test-helpers');

async function testAspectSelection(page, counters) {
    console.log('\n🔥 Testing Aspect Selection API Integration...');
    const aspectSelectionStart = Date.now();
    
    // Navigate to any page to test API endpoints
    await page.goto(`${APP_URL}/videos`, { waitUntil: 'networkidle0' });
    
    // Monitor network requests for API calls
    const networkRequests = [];
    const apiErrors = [];
    
    page.on('response', response => {
        const url = response.url();
        if (url.includes('/api/editing/aspects')) {
            networkRequests.push({
                url,
                status: response.status(),
                statusText: response.statusText()
            });
            if (!response.ok()) {
                apiErrors.push({
                    url,
                    status: response.status(),
                    statusText: response.statusText()
                });
            }
        }
    });
    
    // API Integration Tests (Issue #14 + Issue #16 progress tracking)
    const apiTest = await page.evaluate(async () => {
        try {
            console.log('🔍 Testing backend API endpoints (Issue #14 + Issue #16 progress tracking)');
            
            // Test basic aspects overview endpoint (Issue #14)
            const aspectsResponse = await fetch('http://localhost:8080/api/editing/aspects');
            const aspectsData = await aspectsResponse.json();
            
            // Test enhanced aspects overview with progress tracking (Issue #16)
            const enhancedResponse = await fetch('http://localhost:8080/api/editing/aspects?videoName=vibe-web-mocking&category=ai');
            const enhancedData = await enhancedResponse.json();
            
            let fieldsData = null;
            let fieldsResponse = null;
            
            // Test field details endpoint if we have aspects
            if (aspectsData.aspects && aspectsData.aspects.length > 0) {
                const firstAspectKey = aspectsData.aspects[0].key;
                fieldsResponse = await fetch(`http://localhost:8080/api/editing/aspects/${firstAspectKey}/fields`);
                fieldsData = await fieldsResponse.json();
            }
            
            return {
                // Aspects overview test (Issue #14)
                aspectsApiResponds: aspectsResponse.ok,
                aspectsStatusCode: aspectsResponse.status,
                hasAspects: !!(aspectsData.aspects && Array.isArray(aspectsData.aspects)),
                aspectCount: aspectsData.aspects ? aspectsData.aspects.length : 0,
                aspectsStructure: aspectsData.aspects && aspectsData.aspects.length > 0 ? (() => {
                    const sample = aspectsData.aspects[0];
                    return !!(sample.key && sample.title && sample.description && 
                             sample.icon && sample.fieldCount !== undefined && 
                             sample.order !== undefined);
                })() : false,
                
                // Progress tracking test (Issue #16)
                enhancedApiResponds: enhancedResponse.ok,
                enhancedStatusCode: enhancedResponse.status,
                hasCompletedFieldCount: enhancedData.aspects && enhancedData.aspects.length > 0 ? 
                    enhancedData.aspects.every(aspect => aspect.hasOwnProperty('completedFieldCount')) : false,
                hasRealProgress: enhancedData.aspects && enhancedData.aspects.length > 0 ?
                    enhancedData.aspects.some(aspect => (aspect.completedFieldCount || 0) > 0) : false,
                
                // Field details test
                fieldsApiResponds: fieldsResponse ? fieldsResponse.ok : false,
                fieldsStatusCode: fieldsResponse ? fieldsResponse.status : 0,
                hasFields: !!(fieldsData && fieldsData.fields && Array.isArray(fieldsData.fields)),
                fieldCount: fieldsData && fieldsData.fields ? fieldsData.fields.length : 0,
                fieldsStructure: fieldsData && fieldsData.fields && fieldsData.fields.length > 0 ? (() => {
                    const sample = fieldsData.fields[0];
                    return !!(sample.name && sample.type && sample.required !== undefined);
                })() : false,
                
                // Sample data for debugging
                sampleAspect: aspectsData.aspects && aspectsData.aspects[0] ? aspectsData.aspects[0] : null,
                sampleEnhancedAspect: enhancedData.aspects && enhancedData.aspects[0] ? enhancedData.aspects[0] : null,
                sampleField: fieldsData && fieldsData.fields && fieldsData.fields[0] ? fieldsData.fields[0] : null
            };
        } catch (error) {
            return {
                aspectsApiResponds: false,
                aspectsStatusCode: 0,
                hasAspects: false,
                aspectCount: 0,
                aspectsStructure: false,
                enhancedApiResponds: false,
                enhancedStatusCode: 0,
                hasCompletedFieldCount: false,
                hasRealProgress: false,
                fieldsApiResponds: false,
                fieldsStatusCode: 0,
                hasFields: false,
                fieldCount: 0,
                fieldsStructure: false,
                error: error.message,
                sampleAspect: null,
                sampleEnhancedAspect: null,
                sampleField: null
            };
        }
    });

    const aspectPageTime = Date.now() - aspectSelectionStart;

    // Validate API Tests
    const testDefinitions = [
        // API Integration Tests (Issue #14)
        { name: 'Aspects overview API responds successfully', result: apiTest.aspectsApiResponds },
        { name: 'Aspects API returns expected data structure', result: apiTest.hasAspects && apiTest.aspectsStructure },
        { name: 'Field details API responds successfully', result: apiTest.fieldsApiResponds },
        { name: 'Field details API returns expected structure', result: apiTest.hasFields && apiTest.fieldsStructure },
        
        // Progress Tracking API Tests (Issue #16)  
        { name: 'Enhanced API includes completedFieldCount', result: apiTest.hasCompletedFieldCount },
        { name: 'Enhanced API returns real progress data', result: apiTest.hasRealProgress },
    ];

    validateTests(apiTest, testDefinitions, counters);

    // Log detailed test results
    console.log('\n📊 Aspect Selection API Test Results:');
    console.log(`Aspects API Status: ${apiTest.aspectsApiResponds ? '✅' : '❌'} (${apiTest.aspectsStatusCode})`);
    console.log(`Fields API Status: ${apiTest.fieldsApiResponds ? '✅' : '❌'} (${apiTest.fieldsStatusCode})`);
    console.log(`Enhanced API Status: ${apiTest.enhancedApiResponds ? '✅' : '❌'} (${apiTest.enhancedStatusCode})`);
    console.log(`Aspects Found: ${apiTest.aspectCount}`);
    console.log(`Fields Found: ${apiTest.fieldCount}`);
    
    if (apiTest.sampleAspect) {
        console.log(`\n📝 Sample Aspect: ${JSON.stringify(apiTest.sampleAspect, null, 2).substring(0, 200)}...`);
    }
    
    if (apiTest.sampleEnhancedAspect) {
        console.log(`\n🎯 Sample Enhanced Aspect: ${JSON.stringify(apiTest.sampleEnhancedAspect, null, 2).substring(0, 200)}...`);
    }
    
    if (apiErrors.length > 0) {
        console.log(`\n❌ API Errors: ${apiErrors.length}`);
        apiErrors.forEach(error => console.log(`  ❌ ${error.url}: ${error.status}`));
    }

    logTestCompletion('Aspect Selection API Tests', aspectPageTime, 0);
    return testDefinitions.every(test => test.result);
}

module.exports = { testAspectSelection }; 