/**
 * Comprehensive Video Integration Test Runner
 * Runs both API client integration and enhanced video feature tests
 */

const puppeteer = require('puppeteer');
const { testApiClientIntegration } = require('./api-client-integration.test.js');
const { testEnhancedVideoFeatures } = require('./enhanced-video-features.test.js');

(async () => {
    console.log('🚀 Starting Comprehensive Video Integration Tests...\n');
    
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // For CI/CD compatibility
    });
    const page = await browser.newPage();
    
    // Use correct counter structure that matches test-helpers.js
    const counters = { totalTests: 0, passedTests: 0, errors: [] };
    
    // Set up console logging from browser
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log(`🔍 Browser Error: ${msg.text()}`);
        }
    });
    
    // Set up error handling
    page.on('pageerror', error => {
        console.log(`🚨 Page Error: ${error.message}`);
        counters.errors.push(`Page Error: ${error.message}`);
    });
    
    try {
        // Test 1: API Client Integration
        await testApiClientIntegration(page, counters);
        
        // Test 2: Enhanced Video Features (includes TDD tests for API-driven phases)
        await testEnhancedVideoFeatures(page, counters);
        
        // Final Results
        console.log('\n' + '='.repeat(60));
        console.log('📊 COMPREHENSIVE TEST RESULTS');
        console.log('='.repeat(60));
        console.log(`   ✅ Passed: ${counters.passedTests}`);
        console.log(`   📊 Total: ${counters.totalTests}`);
        console.log(`   ❌ Failed: ${counters.totalTests - counters.passedTests}`);
        console.log(`   📈 Success Rate: ${Math.round((counters.passedTests / counters.totalTests) * 100)}%`);
        
        if (counters.errors.length > 0) {
            console.log('\n🚨 Errors Encountered:');
            counters.errors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error}`);
            });
        }
        
        // Test outcome
        const allTestsPassed = counters.passedTests === counters.totalTests;
        if (allTestsPassed) {
            console.log('\n🎉 ALL TESTS PASSED! 🎉');
            console.log('✅ API client integration working correctly');
            console.log('✅ Enhanced video features functioning properly');
            console.log('✅ Progress display and metadata working');
            console.log('✅ Visual elements and responsive design validated');
            console.log('✅ API-driven phases working correctly (no hard-coded phases)');
        } else {
            console.log(`\n⚠️  ${counters.totalTests - counters.passedTests} test(s) failed`);
            console.log('Please review the failed tests above for issues to resolve.');
        }
        
    } catch (error) {
        console.error('\n❌ Test execution failed:', error);
        console.log('This could indicate a serious issue with the test setup or application.');
    } finally {
        await browser.close();
        console.log('\n🏁 Test run completed.');
    }
})(); 