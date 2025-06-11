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
const { testVideosPage, testModalUrlState } = require('./pages/videos.test');
const { testCreatePage } = require('./pages/create.test');
const { testAspectSelection } = require('./pages/aspect-selection.test');
const { testAspectProgressTracking } = require('./pages/aspect-progress-tracking.test');
const { testAspectEditFormBasics, testSmartFieldTypeDetection, testFormValidationAndErrorHandling, testFocusOnValidationFailure, testLabelFormatting, testAPIClientIntegration, testAIGenerationButtons, testCompletionCriteriaLogic, testFormSubmissionAndAPIIntegration } = require('./pages/aspect-edit-form.test');
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
        
        // Execute TDD Modal URL State tests
        await testModalUrlState(page, counters);
        
        await testCreatePage(page, counters);
        await testAspectSelection(page, counters);
        
        // Execute progress tracking tests (Issue #16)
        await testAspectProgressTracking(page, counters);
        
        // Execute TDD AspectEditForm basic component tests
        await testAspectEditFormBasics(page, counters);
        
        // Execute TDD Smart Field Type Detection tests (Subtask 6.3)
        await testSmartFieldTypeDetection(page, counters);
        
        // Execute TDD Form Validation and Error Handling tests (Subtask 6.5)
        await testFormValidationAndErrorHandling(page, counters);
        
        // Execute TDD Focus on Validation Failure tests (UX Enhancement)
        await testFocusOnValidationFailure(page, counters);
        
        // Execute TDD Label Formatting tests (Subtask 6.9)
        await testLabelFormatting(page, counters);
        
        // Execute TDD API Client Integration tests (Subtask 6.10)
        await testAPIClientIntegration(page, counters);
        
        // Execute TDD AI Generation Buttons tests (Subtask 6.8)
        await testAIGenerationButtons(page, counters);
        
        // Execute TDD Completion Criteria Logic tests (Issue #17)
        await testCompletionCriteriaLogic(page, counters);
        
        // Execute TDD Form Submission and API Integration tests (Subtask 6.11)
        await testFormSubmissionAndAPIIntegration(page, counters);
        
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
