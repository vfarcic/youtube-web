/**
 * YouTube Web App - Modular Test Runner
 * 
 * This runner executes comprehensive tests with maximum speed optimization
 * using a modular architecture for maintainability and scalability.
 * 
 * Features:
 * - Modular test architecture (separate file per page)
 * - Batched DOM evaluations for speed optimization
 * - Shared utilities and helper functions
 * - Easy to extend with new pages and test cases
 * 
 * Usage: node tests/test-runner.js
 * Prerequisites: npm install puppeteer
 */

const { initializeBrowser, printTestSummary } = require('./utils/test-helpers');
const { testHomepage } = require('./pages/homepage.test');
const { testVideosPage } = require('./pages/videos.test');
const { testCreatePage } = require('./pages/create.test');
const { testApiErrorDetection } = require('./api-error-detection.test');

async function runOptimizedTests() {
    console.log('🚀 OPTIMIZED TEST SUITE STARTING...');
    console.log('🎯 Goal: Comprehensive testing with maximum speed\n');
    
    const overallStart = Date.now();
    const counters = {
        totalTests: 0,
        passedTests: 0
    };
    
    let browser;
    let page;
    
    try {
        // Initialize browser
        ({ browser, page } = await initializeBrowser());
        
        // Execute all page tests in sequence
        await testHomepage(page, counters);
        await testVideosPage(page, counters);
        await testCreatePage(page, counters);
        
        // Execute API error detection tests
        await testApiErrorDetection(page, counters);
        
    } catch (error) {
        console.error('❌ Test execution failed:', error);
        return 1;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    
    // Print final results and return exit code
    return printTestSummary(counters, overallStart);
}

// Run tests if this file is executed directly
if (require.main === module) {
    runOptimizedTests()
        .then(exitCode => process.exit(exitCode))
        .catch(error => {
            console.error('💥 Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { runOptimizedTests };
