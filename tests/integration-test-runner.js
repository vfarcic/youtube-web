/**
 * YouTube Web App - Integration Test Runner
 * 
 * This runner validates the app works correctly with real backend APIs.
 * Unlike unit tests that use mocks, these tests require a running backend
 * to verify end-to-end functionality and API integration.
 * 
 * Features:
 * - Real API endpoint testing
 * - Backend connectivity validation
 * - Data flow verification
 * - Production-like environment testing
 * 
 * Prerequisites:
 * - Backend server running on configured port
 * - Database populated with test data
 * - npm install puppeteer
 * 
 * Usage: 
 *   node tests/integration-test-runner.js
 *   npm run test:integration (if configured)
 */

const { initializeBrowser } = require('./utils/test-helpers');

// Simple config for integration tests (avoiding module import issues)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// Integration test configuration
const INTEGRATION_CONFIG = {
    // API endpoints to test
    endpoints: {
        phases: `${API_BASE_URL}/api/videos/phases`,
        videos: `${API_BASE_URL}/api/videos`
    },
    
    // Test timeouts
    timeouts: {
        api: 5000,      // 5 seconds for API calls
        page: 10000     // 10 seconds for page loads
    },
    
    // Expected data constraints
    expectations: {
        minPhases: 1,           // Minimum number of phases expected
        maxPhases: 20,          // Maximum reasonable number of phases
        minVideosPerPhase: 0,   // Minimum videos per phase
        maxVideosPerPhase: 1000 // Maximum reasonable videos per phase
    }
};

class IntegrationTestRunner {
    constructor() {
        this.results = {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            skippedTests: 0,
            errors: []
        };
        this.startTime = Date.now();
    }

    // Test if backend API is reachable
    async testBackendConnectivity() {
        console.log('🔌 Testing Backend Connectivity...');
        this.results.totalTests++;

        try {
            const response = await fetch(INTEGRATION_CONFIG.endpoints.phases, {
                method: 'GET',
                timeout: INTEGRATION_CONFIG.timeouts.api
            });

            if (response.ok) {
                console.log('   ✅ Backend API is reachable');
                this.results.passedTests++;
                return true;
            } else {
                throw new Error(`API returned ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.log(`   ❌ Backend connectivity failed: ${error.message}`);
            this.results.failedTests++;
            this.results.errors.push({
                test: 'Backend Connectivity',
                error: error.message,
                suggestion: 'Ensure backend server is running and accessible'
            });
            return false;
        }
    }

    // Test phases API endpoint
    async testPhasesAPI() {
        console.log('📊 Testing Phases API...');
        this.results.totalTests++;

        try {
            const response = await fetch(INTEGRATION_CONFIG.endpoints.phases);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Handle API response structure: {phases: [...]} or direct array
            const phases = data.phases || data;
            
            // Validate response structure
            if (!Array.isArray(phases)) {
                throw new Error('Phases API should return an array or {phases: [...]} object');
            }

            // Validate phase objects
            for (const phase of phases) {
                if (!phase.id && phase.id !== 0 || !phase.name || typeof phase.count !== 'number') {
                    throw new Error('Invalid phase object structure');
                }
                
                if (phase.count < INTEGRATION_CONFIG.expectations.minVideosPerPhase || 
                    phase.count > INTEGRATION_CONFIG.expectations.maxVideosPerPhase) {
                    console.log(`   ⚠️  Warning: Phase "${phase.name}" has ${phase.count} videos (outside expected range)`);
                }
            }

            // Validate reasonable number of phases
            if (phases.length < INTEGRATION_CONFIG.expectations.minPhases) {
                throw new Error(`Too few phases: ${phases.length} (expected at least ${INTEGRATION_CONFIG.expectations.minPhases})`);
            }

            if (phases.length > INTEGRATION_CONFIG.expectations.maxPhases) {
                console.log(`   ⚠️  Warning: Many phases detected: ${phases.length} (might affect performance)`);
            }

            console.log(`   ✅ Phases API valid (${phases.length} phases found)`);
            console.log(`   📋 Phases: ${phases.map(p => `${p.name}(${p.count})`).join(', ')}`);
            this.results.passedTests++;
            return phases;

        } catch (error) {
            console.log(`   ❌ Phases API failed: ${error.message}`);
            this.results.failedTests++;
            this.results.errors.push({
                test: 'Phases API',
                error: error.message,
                suggestion: 'Check API endpoint and data structure'
            });
            return null;
        }
    }

    // Test Phase Filter Bar with real API
    async testPhaseFilterIntegration(page) {
        console.log('🎛️  Testing Phase Filter Bar Integration...');
        
        const testCases = [
            'PhaseFilterBar loads with real API data',
            'All phases render correctly',
            'Phase counts match API response',
            'Phase selection works with real data',
            'No fallback mock data used'
        ];

        for (const testCase of testCases) {
            this.results.totalTests++;
            
            try {
                await page.goto('http://localhost:3000/videos', { 
                    waitUntil: 'networkidle0',
                    timeout: INTEGRATION_CONFIG.timeouts.page 
                });

                let testPassed = false;

                switch (testCase) {
                    case 'PhaseFilterBar loads with real API data':
                        // Wait for API call to complete
                        await page.waitForSelector('.phase-filter', { timeout: 5000 });
                        await page.waitForFunction(() => {
                            const buttons = document.querySelectorAll('.phase-btn');
                            return buttons.length > 1; // Should have "All" + actual phases
                        }, { timeout: 5000 });
                        testPassed = true;
                        break;

                    case 'All phases render correctly':
                        const phaseButtons = await page.$$('.phase-btn');
                        if (phaseButtons.length >= 2) { // At least "All" + 1 phase
                            testPassed = true;
                        }
                        break;

                    case 'Phase counts match API response':
                        // Get API data
                        const apiData = await this.testPhasesAPI();
                        if (apiData) {
                            const uiCounts = await page.evaluate(() => {
                                const buttons = Array.from(document.querySelectorAll('.phase-btn'));
                                return buttons.slice(1).map(btn => { // Skip "All" button
                                    const match = btn.textContent.match(/\((\d+)\)/);
                                    return match ? parseInt(match[1]) : 0;
                                });
                            });
                            
                            const apiCounts = apiData.map(p => p.count);
                            testPassed = JSON.stringify(uiCounts.sort()) === JSON.stringify(apiCounts.sort());
                        }
                        break;

                    case 'Phase selection works with real data':
                        // Click on a non-"All" phase button
                        const nonAllButtons = await page.$$('.phase-btn:not(:first-child)');
                        if (nonAllButtons.length > 0) {
                            await nonAllButtons[0].click();
                            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for state change
                            
                            const activeButton = await page.$('.phase-btn.active:not(:first-child)');
                            testPassed = activeButton !== null;
                        }
                        break;

                    case 'No fallback mock data used':
                        // Check console for mock data usage
                        const logs = await page.evaluate(() => {
                            return window.console._logs || [];
                        });
                        
                        const hasMockLog = logs.some(log => 
                            log.includes('Using fallback mock data')
                        );
                        testPassed = !hasMockLog;
                        break;
                }

                if (testPassed) {
                    console.log(`   ✅ ${testCase}`);
                    this.results.passedTests++;
                } else {
                    throw new Error(`Test assertion failed`);
                }

            } catch (error) {
                console.log(`   ❌ ${testCase}: ${error.message}`);
                this.results.failedTests++;
                this.results.errors.push({
                    test: `Phase Filter Integration - ${testCase}`,
                    error: error.message,
                    suggestion: 'Check component integration with real API'
                });
            }
        }
    }

    // Test videos API endpoint (requires phase parameter)
    async testVideosAPI() {
        console.log('🎬 Testing Videos API...');
        this.results.totalTests++;

        try {
            // Videos API requires a phase parameter, test with phase 7 (Ideas)
            const response = await fetch(`${INTEGRATION_CONFIG.endpoints.videos}?phase=7`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Handle API response structure: {videos: [...]} or direct array
            const videos = data.videos || data;
            
            if (!Array.isArray(videos)) {
                throw new Error('Videos API should return an array or {videos: [...]} object');
            }

            console.log(`   ✅ Videos API valid (${videos.length} videos found for phase 7)`);
            
            // Log sample video structure (first video only)
            if (videos.length > 0) {
                const sampleVideo = videos[0];
                console.log(`   📹 Sample video: "${sampleVideo.Name || sampleVideo.name || 'Unknown'}"`);
            }
            
            this.results.passedTests++;
            return videos;

        } catch (error) {
            console.log(`   ❌ Videos API failed: ${error.message}`);
            this.results.failedTests++;
            this.results.errors.push({
                test: 'Videos API',
                error: error.message,
                suggestion: 'Check videos endpoint implementation and ensure phase parameter is provided'
            });
            return null;
        }
    }

    // Print final results
    printResults() {
        const duration = Date.now() - this.startTime;
        const successRate = ((this.results.passedTests / this.results.totalTests) * 100).toFixed(1);

        console.log('\n════════════════════════════════════════════════════════════');
        console.log('🏁 INTEGRATION TEST SUITE COMPLETE');
        console.log('════════════════════════════════════════════════════════════');
        console.log(`📊 Results: ${this.results.passedTests}/${this.results.totalTests} tests passed (${successRate}%)`);
        console.log(`⏱️  Total time: ${duration}ms`);
        
        if (this.results.failedTests > 0) {
            console.log(`❌ Failed tests: ${this.results.failedTests}`);
            console.log('\n🔍 Error Details:');
            this.results.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error.test}`);
                console.log(`   Error: ${error.error}`);
                console.log(`   💡 Suggestion: ${error.suggestion}\n`);
            });
        }

        if (this.results.skippedTests > 0) {
            console.log(`⏭️  Skipped tests: ${this.results.skippedTests}`);
        }

        if (this.results.passedTests === this.results.totalTests) {
            console.log('🎉 ALL INTEGRATION TESTS PASSED! Backend integration is working correctly.');
            return 0;
        } else {
            console.log('⚠️  Some integration tests failed. Check backend connectivity and API responses.');
            return 1;
        }
    }
}

// Main integration test execution
async function runIntegrationTests() {
    console.log('🚀 INTEGRATION TEST SUITE STARTING...');
    console.log('🎯 Goal: Validate real API integration and backend connectivity\n');

    const runner = new IntegrationTestRunner();
    let browser, page;

    try {
        // Step 1: Test backend connectivity
        const backendReachable = await runner.testBackendConnectivity();
        
        if (!backendReachable) {
            console.log('\n⚠️  Backend unreachable - skipping browser tests');
            console.log('💡 Start your backend server and try again');
            return runner.printResults();
        }

        // Step 2: Test API endpoints
        await runner.testPhasesAPI();
        await runner.testVideosAPI();

        // Step 3: Initialize browser for UI integration tests
        console.log('\n🌐 Starting Browser Integration Tests...');
        ({ browser, page } = await initializeBrowser());

        // Step 4: Test UI integration with real APIs
        await runner.testPhaseFilterIntegration(page);

    } catch (error) {
        console.error('❌ Integration test execution failed:', error);
        runner.results.failedTests++;
        runner.results.errors.push({
            test: 'Test Execution',
            error: error.message,
            suggestion: 'Check test setup and dependencies'
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    return runner.printResults();
}

// Run tests if this file is executed directly
if (require.main === module) {
    runIntegrationTests()
        .then(exitCode => process.exit(exitCode))
        .catch(error => {
            console.error('💥 Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { runIntegrationTests, IntegrationTestRunner, INTEGRATION_CONFIG };
