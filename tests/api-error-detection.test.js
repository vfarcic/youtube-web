/**
 * API Error Detection Test Module
 * Dedicated tests for detecting and reporting API failures across all components
 */

const { APP_URL, validateTests, logTestCompletion } = require('./utils/test-helpers');

async function testApiErrorDetection(page, counters) {
    console.log('\n🚨 Testing API Error Detection...');
    const apiTestStart = Date.now();
    
    // Test each page that makes API calls
    const apiTestResults = {
        videosPage: await testPageApiErrors(page, '/videos', 'Videos Page'),
        homepage: await testPageApiErrors(page, '/', 'Homepage'),
        overallApiHealth: {}
    };
    
    // Aggregate all API results
    const allNetworkRequests = [
        ...apiTestResults.videosPage.networkRequests,
        ...apiTestResults.homepage.networkRequests
    ];
    
    const allApiErrors = [
        ...apiTestResults.videosPage.apiErrors,
        ...apiTestResults.homepage.apiErrors
    ];
    
    const allConsoleErrors = [
        ...apiTestResults.videosPage.consoleErrors,
        ...apiTestResults.homepage.consoleErrors
    ];
    
    apiTestResults.overallApiHealth = {
        totalRequests: allNetworkRequests.length,
        totalErrors: allApiErrors.length,
        hasNetworkErrors: allApiErrors.length > 0,
        hasConsoleErrors: allConsoleErrors.filter(e => 
            e.includes('HTTP error!') || e.includes('Failed to fetch') || e.includes('status: 400')
        ).length > 0,
        usingMockData: allConsoleErrors.some(e => 
            e.includes('Using fallback mock data') || 
            e.includes('Failed to fetch') ||
            e.includes('backend API')
        ),
        endpoints: {
            videos: allNetworkRequests.filter(r => r.url.includes('/api/videos') && !r.url.includes('/phases')),
            phases: allNetworkRequests.filter(r => r.url.includes('/api/videos/phases'))
        }
    };
    
    // Validate API Error Detection Results
    const apiErrorTests = [
        { 
            name: 'All API endpoints accessible', 
            result: !apiTestResults.overallApiHealth.hasNetworkErrors,
            errorMessage: `API Error Detection: ${apiTestResults.overallApiHealth.totalErrors} API endpoint(s) returning errors - ` + 
                allApiErrors.map(e => `${e.status} ${e.statusText} for ${e.url}`).join(', ')
        },
        { 
            name: 'No console API errors detected', 
            result: !apiTestResults.overallApiHealth.hasConsoleErrors,
            errorMessage: `API Error Detection: Console contains API errors - ` + 
                allConsoleErrors.filter(e => 
                    e.includes('HTTP error!') || e.includes('Failed to fetch') || e.includes('status: 400')
                ).join('; ')
        },
        { 
            name: 'Using real API data (not fallback)', 
            result: !apiTestResults.overallApiHealth.usingMockData,
            errorMessage: `API Error Detection: Application is using mock fallback data instead of real API across multiple pages`
        },
        { 
            name: 'Videos API endpoint responding', 
            result: apiTestResults.overallApiHealth.endpoints.videos.length > 0 && 
                    apiTestResults.overallApiHealth.endpoints.videos.every(r => r.status >= 200 && r.status < 300),
            errorMessage: `API Error Detection: Videos API endpoint (/api/videos) is not responding correctly`
        },
        { 
            name: 'Phases API endpoint responding', 
            result: apiTestResults.overallApiHealth.endpoints.phases.length > 0 && 
                    apiTestResults.overallApiHealth.endpoints.phases.every(r => r.status >= 200 && r.status < 300),
            errorMessage: `API Error Detection: Phases API endpoint (/api/videos/phases) is not responding correctly`
        }
    ];
    
    validateTests(apiTestResults, apiErrorTests, counters);
    
    // Detailed API Health Reporting
    console.log(`   📊 API Health Summary:`);
    console.log(`       Total API Requests: ${apiTestResults.overallApiHealth.totalRequests}`);
    console.log(`       Total API Errors: ${apiTestResults.overallApiHealth.totalErrors}`);
    console.log(`       Videos Endpoint Calls: ${apiTestResults.overallApiHealth.endpoints.videos.length}`);
    console.log(`       Phases Endpoint Calls: ${apiTestResults.overallApiHealth.endpoints.phases.length}`);
    
    if (apiTestResults.overallApiHealth.hasNetworkErrors) {
        console.error(`   🚨 API Network Errors Found:`);
        allApiErrors.forEach(error => {
            console.error(`       • ${error.status} ${error.statusText} - ${error.url}`);
        });
    }
    
    if (apiTestResults.overallApiHealth.hasConsoleErrors) {
        console.error(`   🚨 Console API Errors Found:`);
        allConsoleErrors
            .filter(e => e.includes('HTTP error!') || e.includes('Failed to fetch') || e.includes('status: 400'))
            .forEach(error => {
                console.error(`       • ${error}`);
            });
    }
    
    if (apiTestResults.overallApiHealth.usingMockData) {
        console.warn(`   ⚠️ Mock Data Usage Detected - Backend API may be down`);
    } else {
        console.log(`   ✅ Real API Data - Backend is responding correctly`);
    }
    
    logTestCompletion('API Error Detection', apiTestStart, Date.now() - apiTestStart);
    
    return apiTestResults;
}

async function testPageApiErrors(page, pagePath, pageName) {
    console.log(`   Testing ${pageName} API calls...`);
    
    // Monitor console errors and network requests
    const consoleErrors = [];
    const networkRequests = [];
    const apiErrors = [];
    
    // Set up console monitoring
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });
    
    // Set up network request monitoring
    page.on('response', response => {
        const url = response.url();
        if (url.includes('/api/')) {
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
    
    // Navigate to page and wait for network activity
    await page.goto(`${APP_URL}${pagePath}`, { waitUntil: 'networkidle0' });
    
    // Give extra time for any delayed API calls
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const pageResults = await page.evaluate(() => {
        // Check for error state elements
        const errorElements = document.querySelectorAll('.video-grid-error, .error, [class*="error"]');
        const loadingElements = document.querySelectorAll('.loading, .video-grid-loading, [class*="loading"]');
        
        return {
            hasErrorElements: errorElements.length > 0,
            hasLoadingElements: loadingElements.length > 0,
            pageLoaded: document.readyState === 'complete'
        };
    });
    
    return {
        page: pageName,
        path: pagePath,
        consoleErrors,
        networkRequests,
        apiErrors,
        hasNetworkErrors: apiErrors.length > 0,
        hasConsoleErrors: consoleErrors.length > 0,
        errorElementsDisplayed: pageResults.hasErrorElements,
        stillLoading: pageResults.hasLoadingElements,
        pageLoaded: pageResults.pageLoaded
    };
}

module.exports = { testApiErrorDetection };
