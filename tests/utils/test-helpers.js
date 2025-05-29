/**
 * Test Helper Utilities
 * Shared functions and configurations for all test modules
 */

const APP_URL = 'http://localhost:3000';

/**
 * Initialize browser with optimized settings
 */
async function initializeBrowser() {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    return { browser, page };
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
    validateTests,
    logTestCompletion,
    printTestSummary
};
