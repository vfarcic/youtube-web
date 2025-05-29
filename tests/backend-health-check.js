/**
 * Backend Health Check Utility
 * 
 * Simple utility to check if the backend API is running and responsive
 * before running integration tests.
 */

// Simple config for health check (avoiding module import issues)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

async function checkBackendHealth() {
    console.log('🏥 Checking Backend Health...');
    console.log(`📡 API Base URL: ${API_BASE_URL}`);
    
    const endpoints = [
        '/api/videos/phases',
        '/api/videos?phase=7',  // Test with valid numeric phase ID
        '/api/videos'  // Test without phase parameter (should fail gracefully)
    ];
    
    const results = {};
    
    for (const endpoint of endpoints) {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`\n🔍 Testing: ${url}`);
        
        try {
            const start = Date.now();
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            const duration = Date.now() - start;
            
            if (response.ok) {
                const data = await response.json();
                console.log(`   ✅ Status: ${response.status} ${response.statusText}`);
                console.log(`   ⏱️  Response time: ${duration}ms`);
                console.log(`   📊 Data: ${Array.isArray(data) ? `${data.length} items` : typeof data}`);
                
                results[endpoint] = {
                    status: 'healthy',
                    responseTime: duration,
                    dataCount: Array.isArray(data) ? data.length : 'N/A'
                };
            } else {
                // Try to get error details from response
                let errorDetails = '';
                try {
                    const errorText = await response.text();
                    errorDetails = errorText ? ` - ${errorText}` : '';
                } catch (e) {
                    // Ignore if we can't read response body
                }
                
                // Check if this is an expected error (videos endpoint without phase)
                const isExpectedError = endpoint === '/api/videos' && response.status === 400;
                
                console.log(`   ${isExpectedError ? '⚠️' : '❌'} Status: ${response.status} ${response.statusText}${errorDetails}`);
                if (isExpectedError) {
                    console.log(`   ℹ️  Expected: This endpoint requires a phase parameter`);
                }
                
                results[endpoint] = {
                    status: isExpectedError ? 'expected_error' : 'error',
                    error: `HTTP ${response.status}${errorDetails}`,
                    expected: isExpectedError
                };
            }
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            results[endpoint] = {
                status: 'unreachable',
                error: error.message
            };
        }
    }
    
    console.log('\n════════════════════════════════════════');
    console.log('📋 BACKEND HEALTH SUMMARY');
    console.log('════════════════════════════════════════');
    
    let allHealthy = true;
    for (const [endpoint, result] of Object.entries(results)) {
        const statusIcon = result.status === 'healthy' ? '✅' : 
                          result.status === 'expected_error' ? '⚠️' : '❌';
        console.log(`${statusIcon} ${endpoint}: ${result.status.toUpperCase().replace('_', ' ')}`);
        
        // Only count unexpected errors as unhealthy
        if (result.status !== 'healthy' && result.status !== 'expected_error') {
            allHealthy = false;
        }
    }
    
    if (allHealthy) {
        console.log('\n🎉 Backend is healthy and ready for integration tests!');
        console.log('💡 You can now run: node tests/integration-test-runner.js');
        return 0;
    } else {
        console.log('\n⚠️  Backend issues detected.');
        console.log('💡 Fix backend issues before running integration tests.');
        return 1;
    }
}

// Run health check if this file is executed directly
if (require.main === module) {
    checkBackendHealth()
        .then(exitCode => process.exit(exitCode))
        .catch(error => {
            console.error('💥 Health check failed:', error);
            process.exit(1);
        });
}

module.exports = { checkBackendHealth };
