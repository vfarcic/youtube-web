/**
 * Complete Test Suite Runner
 * 
 * Runs both unit tests and integration tests in sequence,
 * providing comprehensive coverage of the application.
 */

const { runOptimizedTests } = require('./test-runner');
const { runIntegrationTests } = require('./integration-test-runner');
const { checkBackendHealth } = require('./backend-health-check');

async function runCompleteTestSuite() {
    console.log('🚀 COMPLETE TEST SUITE STARTING...');
    console.log('🎯 Running both Unit Tests and Integration Tests\n');
    
    const overallStart = Date.now();
    let unitTestsResult = 0;
    let integrationTestsResult = 0;
    
    try {
        // Phase 1: Unit Tests (UI/Mock tests)
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('📱 PHASE 1: UNIT TESTS (UI/Mock)');
        console.log('═══════════════════════════════════════════════════════════════');
        unitTestsResult = await runOptimizedTests();
        
        if (unitTestsResult !== 0) {
            console.log('\n⚠️  Unit tests failed. Continuing with integration tests...\n');
        }
        
        // Phase 2: Backend Health Check
        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('🏥 PHASE 2: BACKEND HEALTH CHECK');
        console.log('═══════════════════════════════════════════════════════════════');
        const healthCheck = await checkBackendHealth();
        
        // Phase 3: Integration Tests (Real API tests)
        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('🔗 PHASE 3: INTEGRATION TESTS (Real API)');
        console.log('═══════════════════════════════════════════════════════════════');
        
        if (healthCheck === 0) {
            integrationTestsResult = await runIntegrationTests();
        } else {
            console.log('⏭️  Skipping integration tests due to backend health issues');
            integrationTestsResult = 1;
        }
        
    } catch (error) {
        console.error('💥 Test suite execution failed:', error);
        return 1;
    }
    
    // Final Summary
    const totalDuration = Date.now() - overallStart;
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🏁 COMPLETE TEST SUITE RESULTS');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📱 Unit Tests: ${unitTestsResult === 0 ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`🔗 Integration Tests: ${integrationTestsResult === 0 ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    
    if (unitTestsResult === 0 && integrationTestsResult === 0) {
        console.log('\n🎉 ALL TESTS PASSED! Your app is fully validated.');
        console.log('✨ Both UI functionality and API integration are working correctly.');
        return 0;
    } else {
        console.log('\n⚠️  Some tests failed. Check the details above.');
        
        if (unitTestsResult !== 0) {
            console.log('💡 Fix UI/component issues first');
        }
        if (integrationTestsResult !== 0) {
            console.log('💡 Check backend connectivity and API responses');
        }
        
        return 1;
    }
}

// Run complete test suite if this file is executed directly
if (require.main === module) {
    runCompleteTestSuite()
        .then(exitCode => process.exit(exitCode))
        .catch(error => {
            console.error('💥 Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { runCompleteTestSuite };
