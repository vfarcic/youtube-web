/**
 * Test Runner for API Client Integration
 */

const puppeteer = require('puppeteer');
const { testApiClientIntegration } = require('./api-client-integration.test.js');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const counters = { totalTests: 0, passedTests: 0, errors: [] };
    
    try {
        await testApiClientIntegration(page, counters);
        console.log('\n📊 Test Results:');
        console.log(`   ✅ Passed: ${counters.passedTests}`);
        console.log(`   📊 Total: ${counters.totalTests}`);
        console.log(`   ❌ Failed: ${counters.totalTests - counters.passedTests}`);
        if (counters.errors.length > 0) {
            console.log('   🚨 Errors:');
            counters.errors.forEach(error => console.log(`     - ${error}`));
        }
    } catch (error) {
        console.error('❌ Test execution failed:', error);
    } finally {
        await browser.close();
    }
})(); 