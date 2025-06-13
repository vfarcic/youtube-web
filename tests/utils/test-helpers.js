/**
 * Test Helper Utilities
 * Shared functions and configurations for all test modules
 */

const APP_URL = 'http://localhost:3000';

/**
 * Initialize browser with optimized settings and API mocking
 */
async function initializeBrowser(enableApiMocking = true) {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    
    if (enableApiMocking) {
        await setupApiMocking(page);
    }
    
    return { browser, page };
}

/**
 * Setup API request interception to prevent modifying backend data
 */
async function setupApiMocking(page) {
    await page.setRequestInterception(true);
    
    console.log('🛡️  API request interception enabled');
    
    page.on('request', (request) => {
        const url = request.url();
        const method = request.method();
        
        // Log all API requests for debugging
        if (url.includes('/api/') || url.includes('localhost:8080/api')) {
            console.log(`📡 API REQUEST: ${method} ${url}`);
        }
        
        // Intercept API calls that modify data (POST, PUT, PATCH, DELETE, OPTIONS)
        // Block both relative /api/ URLs and absolute localhost:8080/api URLs
        if ((url.includes('/api/') || url.includes('localhost:8080/api')) && 
            ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(method)) {
            console.log(`🚫 BLOCKED WRITE OPERATION: ${method} ${url}`);
            
            // Handle OPTIONS requests (CORS preflight)
            if (method === 'OPTIONS') {
                try {
                    request.respond({
                        status: 200,
                        contentType: 'text/plain',
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                        },
                        body: ''
                    });
                } catch (error) {
                    console.log(`⚠️  OPTIONS request already handled: ${error.message}`);
                }
                return;
            }
            
            // Return mock success response for form submissions with small delay for loading state visibility
            if ((url.includes('/api/editing/aspects/') || url.includes('/api/videos/') || 
                 url.includes('localhost:8080/api/editing/aspects/') || url.includes('localhost:8080/api/videos/')) && 
                (method === 'POST' || method === 'PUT')) {
                // Add a small delay to make loading state visible for testing
                setTimeout(() => {
                    try {
                        request.respond({
                            status: 200,
                            contentType: 'application/json',
                            body: JSON.stringify({
                                success: true,
                                message: 'Mock: Data saved successfully',
                                data: { saved: true, timestamp: new Date().toISOString() }
                            })
                        });
                    } catch (error) {
                        console.log(`⚠️  Request already handled: ${error.message}`);
                    }
                }, 300); // 300ms delay to ensure loading state is visible for testing
                return; // CRITICAL: Return immediately to prevent continue()
            }
            
            // Return immediate mock success response for other POST/PUT/PATCH/DELETE calls
            try {
                request.respond({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        success: true,
                        message: 'Mock: Operation completed successfully',
                        data: { mocked: true, timestamp: new Date().toISOString() }
                    })
                });
            } catch (error) {
                console.log(`⚠️  Request already handled: ${error.message}`);
            }
            return; // CRITICAL: Return immediately to prevent continue()
        }
        
        // Allow GET requests to pass through (read-only operations)
        if (method === 'GET') {
            request.continue();
            return;
        }
        
        // Allow all other non-API requests (static files, etc.)
        if (!url.includes('/api/')) {
            request.continue();
            return;
        }
        
        // If we get here, it's an API request with an unexpected method
        console.log(`⚠️  UNEXPECTED API REQUEST: ${method} ${url} - allowing through`);
        request.continue();
    });
    
    console.log('🛡️  API mocking enabled - write operations will be intercepted');
}

/**
 * Validate test results and update counters
 */
function validateTests(testResults, testDefinitions, counters) {
    testDefinitions.forEach(test => {
        const status = test.result ? '✅' : '❌';
        console.log(`   ${status} ${test.name}`);
        counters.totalTests++;
        if (test.result) counters.passedTests++;
        if (!test.result && test.errorMessage) {
            console.error(`❌ ${test.errorMessage}`);
        }
    });
}

/**
 * Performance and timing utilities
 */
function logTestCompletion(testName, startTime, evalTime = null) {
    const duration = Date.now() - startTime;
    let output = `   ⏱️  ${testName} test: ${duration}ms`;
    if (evalTime !== null) {
        output += ` (eval: ${evalTime.toFixed(1)}ms)`;
    }
    console.log(output + '\n');
}

/**
 * Final test results summary
 */
function printTestSummary(counters, overallStartTime) {
    const totalTime = Date.now() - overallStartTime;
    const successRate = ((counters.passedTests / counters.totalTests) * 100).toFixed(1);
    const testsPerSecond = (counters.totalTests / (totalTime / 1000)).toFixed(1);
    
    console.log('════════════════════════════════════════════════════════════');
    console.log('🏁 TEST SUITE COMPLETE');
    console.log('════════════════════════════════════════════════════════════');
    console.log(`📊 Results: ${counters.passedTests}/${counters.totalTests} tests passed (${successRate}%)`);
    console.log(`⏱️  Total time: ${totalTime}ms`);
    console.log(`⚡ Performance: ${testsPerSecond} tests/second`);
    
    if (counters.passedTests === counters.totalTests) {
        console.log('🎉 ALL TESTS PASSED! App is working correctly.');
    } else {
        const failedCount = counters.totalTests - counters.passedTests;
        console.log(`⚠️  ${failedCount} test(s) failed. Review output above.`);
    }
    
    console.log('\n✨ Test execution completed successfully');
    
    return counters.passedTests === counters.totalTests ? 0 : 1;
}

module.exports = {
    APP_URL,
    initializeBrowser,
    setupApiMocking,
    validateTests,
    logTestCompletion,
    printTestSummary
};
