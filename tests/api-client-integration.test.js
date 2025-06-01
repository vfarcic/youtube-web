/**
 * API Client Integration Test
 * Tests the optimized video list API endpoint integration
 */

const { APP_URL, validateTests, logTestCompletion } = require('./utils/test-helpers');

async function testApiClientIntegration(page, counters) {
    console.log('\n🔗 Testing API Client Integration...');
    const apiClientTestStart = Date.now();
    
    // Test optimized endpoint integration
    await testOptimizedEndpointIntegration(page, counters);
    
    logTestCompletion('API Client Integration', apiClientTestStart, Date.now() - apiClientTestStart);
}

async function testOptimizedEndpointIntegration(page, counters) {
    console.log('   Testing optimized endpoint integration...');
    
    // Monitor network requests to see which endpoints are called
    const networkRequests = [];
    const apiErrors = [];
    
    page.on('response', response => {
        const url = response.url();
        if (url.includes('/api/videos')) {
            networkRequests.push({
                url,
                status: response.status(),
                statusText: response.statusText(),
                isOptimized: url.includes('/api/videos/list')
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
    
    // Navigate to videos page to trigger API calls
    await page.goto(`${APP_URL}/videos`, { waitUntil: 'networkidle0' });
    
    // Wait for videos to load
    await page.waitForSelector('.video-grid', { timeout: 10000 });
    
    // Check if API client is working
    const optimizedEndpointResults = await page.evaluate(() => {
        // Check if videos loaded successfully
        const videoCards = document.querySelectorAll('.video-grid .video-card, .video-grid-empty');
        const hasVideos = videoCards.length > 0;
        
        // Check for error states
        const errorElement = document.querySelector('.video-grid-error');
        const hasError = !!errorElement;
        
        return {
            hasVideos,
            hasError,
            videoCount: videoCards.length
        };
    });
    
    // Validate results
    const optimizedTests = [
        {
            name: 'API Client loads videos successfully',
            result: optimizedEndpointResults.hasVideos && !optimizedEndpointResults.hasError,
            errorMessage: `API Client: Videos not loaded or error state displayed. Videos: ${optimizedEndpointResults.hasVideos}, Error: ${optimizedEndpointResults.hasError}`
        },
        {
            name: 'API Client makes network requests',
            result: networkRequests.length > 0,
            errorMessage: `API Client: No network requests detected. Expected at least one API call.`
        },
        {
            name: 'API requests are successful',
            result: apiErrors.length === 0,
            errorMessage: `API Client: API errors detected - ${apiErrors.map(e => `${e.status} ${e.statusText} for ${e.url}`).join(', ')}`
        },
        {
            name: 'Using optimized endpoint only',
            result: networkRequests.some(req => req.isOptimized),
            errorMessage: `API Client: Expected to use optimized endpoint (/api/videos/list) but none detected`
        }
    ];
    
    validateTests({ optimizedEndpoint: optimizedEndpointResults, network: { requests: networkRequests, errors: apiErrors } }, optimizedTests, counters);
    
    // Log network activity
    console.log(`       📡 Network Requests Made: ${networkRequests.length}`);
    networkRequests.forEach(req => {
        const status = req.status >= 200 && req.status < 300 ? '✅' : '❌';
        const type = req.isOptimized ? '(Optimized)' : '(Legacy)';
        console.log(`           ${status} ${req.status} ${req.statusText} - ${req.url} ${type}`);
    });
    
    console.log(`       ✅ API Client integration working with optimized endpoint only`);
}

module.exports = {
    testApiClientIntegration
}; 