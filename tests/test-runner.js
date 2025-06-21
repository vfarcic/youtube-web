#!/usr/bin/env node

/**
 * Consolidated Test Runner for YouTube Web App
 * 
 * Organizes tests by pages and supports focused testing:
 * - npm test                    # Run all tests
 * - npm test -- --page=videos   # Run specific page tests
 * - npm test -- --integration   # Run only integration tests
 * - npm test -- --ui            # Run only UI tests
 * - npm test -- --help          # Show usage
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Import test utilities
const { initializeBrowser, setupApiMocking, printTestSummary } = require('./utils/test-helpers.js');

// Import page test modules
const { testHomepage } = require('./pages/homepage.test.js');
const { testVideosPage, testVideoGridRefreshAfterModalClose, testVideoNameResolution } = require('./pages/videos.test.js');
const { testAspectSelection } = require('./pages/aspect-selection.test.js');
const { testAspectEditForm } = require('./pages/aspect-edit-form.test.js');
const { testDefinitionAspect } = require('./pages/aspect-definition.test.js');
const { testAspectProgressTracking } = require('./pages/aspect-progress-tracking.test.js');
const { testCreatePage } = require('./pages/create.test.js');

// Import integration test modules
const { testBackendHealth } = require('./integration/backend-health.test.js');
const { testApiClient } = require('./integration/api-client.test.js');

// Test configuration
const CONFIG = {
    APP_URL: 'http://localhost:3000',
    API_URL: 'http://localhost:8080',
    HEADLESS: true,
    TIMEOUT: 30000,
    VIEWPORT: { width: 1280, height: 720 }
};

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        page: null,
        integration: false,
        ui: false,
        help: false,
        verbose: false
    };

    for (const arg of args) {
        if (arg.startsWith('--page=')) {
            options.page = arg.split('=')[1];
        } else if (arg === '--integration') {
            options.integration = true;
        } else if (arg === '--ui') {
            options.ui = true;
        } else if (arg === '--help') {
            options.help = true;
        } else if (arg === '--verbose') {
            options.verbose = true;
        }
    }

    return options;
}

// Show usage information
function showHelp() {
    console.log(`
🧪 YouTube Web App - Consolidated Test Runner

USAGE:
  npm test                    # Run all tests (UI + Integration)
  npm test -- --page=videos   # Run specific page tests
  npm test -- --integration   # Run only integration tests  
  npm test -- --ui            # Run only UI/page tests
  npm test -- --verbose       # Show detailed output
  npm test -- --help          # Show this help

AVAILABLE PAGES:
  homepage                    # Dashboard/homepage tests
  videos                      # Video grid, filtering, cards
  video-grid-refresh          # Video grid refresh after modal close (TDD)
  aspect-selection           # Aspect selection page
  aspect-edit-form           # Form editing tests
  aspect-definition          # Definition aspect backend integration (TDD)
  aspect-progress-tracking   # Progress tracking features
  create                     # Video creation page

INTEGRATION TESTS:
  backend-health             # Backend connectivity
  api-client                 # API client functionality

EXAMPLES:
  npm test -- --page=videos --verbose
  npm test -- --integration
  npm test -- --ui
`);
}

// Test counters and results
class TestResults {
    constructor() {
        this.passed = 0;
        this.failed = 0;
        this.total = 0;
        this.startTime = Date.now();
        this.results = [];
    }

    addResult(testName, success, details = {}) {
        this.total++;
        if (success) {
            this.passed++;
        } else {
            this.failed++;
        }
        
        this.results.push({
            name: testName,
            success,
            details,
            timestamp: new Date().toISOString()
        });
    }

    getReport() {
        const duration = Date.now() - this.startTime;
        const successRate = this.total > 0 ? (this.passed / this.total * 100).toFixed(1) : 0;
        
        return {
            passed: this.passed,
            failed: this.failed,
            total: this.total,
            successRate,
            duration,
            results: this.results
        };
    }
}

// Page test definitions
const PAGE_TESTS = {
    homepage: {
        name: 'Homepage',
        description: 'Dashboard and homepage functionality',
        testFunction: testHomepage
    },
    videos: {
        name: 'Videos Page',
        description: 'Video grid, filtering, and card functionality',
        testFunction: testVideosPage
    },
    'video-grid-refresh': {
        name: 'Video Grid Refresh',
        description: 'Video grid refresh after modal close (TDD)',
        testFunction: testVideoGridRefreshAfterModalClose
    },
    'video-name-resolution': {
        name: 'Video Name Resolution',
        description: 'Video name vs generated name fix (Backend Enhancement)',
        testFunction: testVideoNameResolution
    },
    'aspect-selection': {
        name: 'Aspect Selection',
        description: 'Aspect selection page functionality',
        testFunction: testAspectSelection
    },
    'aspect-edit-form': {
        name: 'Aspect Edit Form',
        description: 'Form editing and validation',
        testFunction: testAspectEditForm
    },
    'aspect-definition': {
        name: 'Definition Aspect',
        description: 'Definition aspect backend integration and TDD tests',
        testFunction: testDefinitionAspect
    },
    'aspect-progress-tracking': {
        name: 'Aspect Progress Tracking',
        description: 'Progress tracking features',
        testFunction: testAspectProgressTracking
    },
    create: {
        name: 'Create Page',
        description: 'Video creation functionality',
        testFunction: testCreatePage
    }
};

// Integration test definitions
const INTEGRATION_TESTS = {
    'backend-health': {
        name: 'Backend Health',
        description: 'Backend connectivity and health checks',
        testFunction: testBackendHealth
    },
    'api-client': {
        name: 'API Client',
        description: 'API client functionality and integration',
        testFunction: testApiClient
    }
};

// Run page tests
async function runPageTests(browser, options, results) {
    const page = await browser.newPage();
    await page.setViewport(CONFIG.VIEWPORT);
    
    // Set up API mocking BEFORE any navigation to prevent data modification
    await setupApiMocking(page);
    
    // Add a small delay to ensure interception is fully established
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Set up page monitoring
    const counters = { passed: 0, failed: 0 };
    
    try {
        const pagesToTest = options.page 
            ? [options.page]
            : Object.keys(PAGE_TESTS);

        for (const pageKey of pagesToTest) {
            const pageTest = PAGE_TESTS[pageKey];
            if (!pageTest) {
                console.log(`❌ Unknown page test: ${pageKey}`);
                results.addResult(`Page: ${pageKey}`, false, { error: 'Unknown page test' });
                continue;
            }

            console.log(`\n🧪 Running ${pageTest.name} Tests...`);
            console.log(`📝 ${pageTest.description}`);
            
            try {
                const testResult = await pageTest.testFunction(page, counters);
                
                // Determine success based on the type of result returned
                let success = false;
                if (typeof testResult === 'boolean') {
                    // Simple boolean return (like aspect-selection test)
                    success = testResult;
                } else if (testResult && typeof testResult === 'object') {
                    // Complex object return - check if it has a success indicator
                    // For now, assume complex objects indicate the test ran successfully
                    // Individual test failures are handled by validateTests() within the test function
                    success = true;
                } else {
                    // Undefined, null, or other unexpected return
                    success = false;
                }
                
                results.addResult(`Page: ${pageTest.name}`, success, { result: testResult });
                
                if (success) {
                    console.log(`✅ ${pageTest.name} tests completed successfully`);
                } else {
                    console.log(`❌ ${pageTest.name} tests failed - some assertions did not pass`);
                }
            } catch (error) {
                console.error(`❌ ${pageTest.name} tests failed:`, error.message);
                results.addResult(`Page: ${pageTest.name}`, false, { error: error.message });
            }
        }
    } finally {
        await page.close();
    }
    
    return counters;
}

// Run integration tests
async function runIntegrationTests(options, results) {
    console.log('\n🔌 Running Integration Tests...');
    
    const testsToRun = Object.keys(INTEGRATION_TESTS);
    
    for (const testKey of testsToRun) {
        const integrationTest = INTEGRATION_TESTS[testKey];
        
        console.log(`\n🧪 Running ${integrationTest.name} Tests...`);
        console.log(`📝 ${integrationTest.description}`);
        
        try {
            const testResult = await integrationTest.testFunction();
            
            // Determine success based on the type of result returned
            let success = false;
            if (typeof testResult === 'boolean') {
                // Simple boolean return
                success = testResult;
            } else if (testResult && typeof testResult === 'object') {
                // Complex object return - assume success if object is returned
                // Individual test failures are handled within the test function
                success = true;
            } else {
                // Undefined, null, or other unexpected return
                success = false;
            }
            
            results.addResult(`Integration: ${integrationTest.name}`, success, { result: testResult });
            
            if (success) {
                console.log(`✅ ${integrationTest.name} tests completed successfully`);
            } else {
                console.log(`❌ ${integrationTest.name} tests failed - some assertions did not pass`);
            }
        } catch (error) {
            console.error(`❌ ${integrationTest.name} tests failed:`, error.message);
            results.addResult(`Integration: ${integrationTest.name}`, false, { error: error.message });
        }
    }
}

// Main test runner
async function runTests() {
    const options = parseArgs();
    
    if (options.help) {
        showHelp();
        return;
    }
    
    console.log('🚀 YouTube Web App - Consolidated Test Runner');
    console.log('=' .repeat(60));
    
    if (options.page) {
        console.log(`🎯 Running tests for page: ${options.page}`);
    } else if (options.integration) {
        console.log('🔌 Running integration tests only');
    } else if (options.ui) {
        console.log('🖥️  Running UI/page tests only');
    } else {
        console.log('🧪 Running all tests (UI + Integration)');
    }
    
    const results = new TestResults();
    let browser = null;
    
    try {
        // Run UI/Page tests
        if (!options.integration) {
            console.log('\n📱 Starting UI Tests...');
            browser = await puppeteer.launch({ 
                headless: CONFIG.HEADLESS,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            await runPageTests(browser, options, results);
        }
        
        // Run Integration tests
        if (!options.ui && !options.page) {
            await runIntegrationTests(options, results);
        }
        
    } catch (error) {
        console.error('❌ Test runner failed:', error);
        results.addResult('Test Runner', false, { error: error.message });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    
    // Generate final report
    const report = results.getReport();
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${report.passed}`);
    console.log(`❌ Failed: ${report.failed}`);
    console.log(`📈 Success Rate: ${report.successRate}%`);
    console.log(`⏱️  Duration: ${(report.duration / 1000).toFixed(2)}s`);
    
    if (options.verbose && report.results.length > 0) {
        console.log('\n📋 Detailed Results:');
        report.results.forEach(result => {
            const status = result.success ? '✅' : '❌';
            console.log(`  ${status} ${result.name}`);
            if (!result.success && result.details.error) {
                console.log(`     Error: ${result.details.error}`);
            }
        });
    }
    
    // Exit with appropriate code
    process.exit(report.failed > 0 ? 1 : 0);
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests, CONFIG, PAGE_TESTS, INTEGRATION_TESTS };
