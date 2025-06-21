/**
 * TDD Tests for Definition Aspect - Backend Integration & AI Features
 */

const { APP_URL, validateTests, logTestCompletion } = require('../utils/test-helpers');

/**
 * TDD Test: Definition Phase Field Count Update (Backend Integration)
 * Test that Definition phase has 8 fields instead of 9
 * The backend has moved Gist field from Definition to InitialDetails phase
 */
async function testDefinitionPhaseFieldCount(page, counters) {
    console.log('\n🔥 Testing Definition Phase Field Count (TDD - Backend Integration)...');
    const testStart = Date.now();
    
    // Navigate to Definition aspect
    await page.goto(`${APP_URL}/videos?edit=ai%2Fai-kills-iac&video=ai%2Fai-kills-iac&aspect=definition`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test 1: API returns 8 fields for Definition phase
    console.log('   🧪 TEST: Definition phase API should return 8 fields...');
    const apiFieldCountTest = await page.evaluate(async () => {
        try {
            const response = await fetch('http://localhost:8080/api/editing/aspects/definition/fields?videoName=ai%2Fai-kills-iac&category=ai');
            const data = await response.json();
            
            return {
                apiWorks: response.ok,
                hasFields: !!(data.fields && Array.isArray(data.fields)),
                fieldCount: data.fields ? data.fields.length : 0,
                fields: data.fields || [],
                hasGistField: data.fields ? data.fields.some(f => f.fieldName === 'gist' || f.displayName === 'Gist') : false,
                hasRequestThumbnailField: data.fields ? data.fields.some(f => f.fieldName === 'requestThumbnail' || f.displayName === 'Request Thumbnail') : false
            };
        } catch (error) {
            return {
                apiWorks: false,
                hasFields: false,
                fieldCount: 0,
                fields: [],
                hasGistField: false,
                hasRequestThumbnailField: false,
                error: error.message
            };
        }
    });
    
    // Test 2: Form renders exactly 8 form fields
    console.log('   🧪 TEST: Definition form should render 8 form fields...');
    const formFieldCountTest = await page.evaluate(() => {
        const form = document.querySelector('form');
        if (!form) return { formExists: false, fieldCount: 0, fields: [] };
        
        // Count form groups (one per field) instead of individual inputs
        const formGroups = Array.from(form.querySelectorAll('.form-group'));
        const fieldDetails = formGroups.map(group => {
            const label = group.querySelector('label');
            const inputs = Array.from(group.querySelectorAll('input:not([type="button"]):not([type="submit"]), textarea, select'));
            return {
                label: label ? label.textContent.trim() : 'No label',
                inputCount: inputs.length,
                inputTypes: inputs.map(input => input.type || input.tagName.toLowerCase()),
                fieldName: inputs[0] ? (inputs[0].name || inputs[0].id || 'unnamed') : 'no-input'
            };
        });
        
        return {
            formExists: true,
            fieldCount: formGroups.length,
            fields: fieldDetails,
            hasGistField: fieldDetails.some(field => 
                field.label.toLowerCase().includes('gist') ||
                field.fieldName.toLowerCase().includes('gist')
            ),
            hasRequestThumbnailField: fieldDetails.some(field => 
                field.label.toLowerCase().includes('thumbnail') ||
                field.fieldName.toLowerCase().includes('requestthumbnail') ||
                field.fieldName.toLowerCase().includes('request')
            )
        };
    });
    
    // Test 3: Progress calculation should be based on 8 fields
    console.log('   🧪 TEST: Progress calculation should be based on 8 fields...');
    const progressCalculationTest = await page.evaluate(() => {
        // Look for progress text that shows field completion
        const progressElements = document.querySelectorAll('.progress-text, [class*="progress"]');
        const progressTexts = Array.from(progressElements).map(el => el.textContent || '');
        
        // Find text that shows "X/Y fields completed" format
        const fieldProgressText = progressTexts.find(text => text.includes('fields completed') || text.includes('field completed'));
        
        if (fieldProgressText) {
            const match = fieldProgressText.match(/(\d+)\/(\d+)\s+fields?\s+completed/i);
            if (match) {
                return {
                    hasProgressText: true,
                    completedFields: parseInt(match[1]),
                    totalFields: parseInt(match[2]),
                    progressText: fieldProgressText,
                    isBasedOnEightFields: parseInt(match[2]) === 8
                };
            }
        }
        
        return {
            hasProgressText: false,
            completedFields: 0,
            totalFields: 0,
            progressText: '',
            isBasedOnEightFields: false,
            allProgressTexts: progressTexts
        };
    });
    
    const definitionFieldCountTestResults = [
        {
            name: 'Definition phase API returns exactly 8 fields',
            result: apiFieldCountTest.apiWorks && apiFieldCountTest.fieldCount === 8,
            errorMessage: `Definition phase API should return 8 fields, got ${apiFieldCountTest.fieldCount}`
        },
        {
            name: 'Definition phase API does NOT include Gist field',
            result: apiFieldCountTest.apiWorks && !apiFieldCountTest.hasGistField,
            errorMessage: 'Definition phase API should not include Gist field (moved to InitialDetails phase)'
        },
        {
            name: 'Definition phase API includes RequestThumbnail field',
            result: apiFieldCountTest.apiWorks && apiFieldCountTest.hasRequestThumbnailField,
            errorMessage: 'Definition phase API should include new RequestThumbnail field'
        },
        {
            name: 'Definition form renders exactly 8 form fields',
            result: formFieldCountTest.formExists && formFieldCountTest.fieldCount === 8,
            errorMessage: `Definition form should render 8 form fields, got ${formFieldCountTest.fieldCount}`
        },
        {
            name: 'Definition form does NOT include Gist field',
            result: formFieldCountTest.formExists && !formFieldCountTest.hasGistField,
            errorMessage: 'Definition form should not include Gist field'
        },
        {
            name: 'Definition form includes RequestThumbnail field',
            result: formFieldCountTest.formExists && formFieldCountTest.hasRequestThumbnailField,
            errorMessage: 'Definition form should include RequestThumbnail field'
        },
        {
            name: 'Progress calculation based on 8 fields',
            result: progressCalculationTest.hasProgressText && progressCalculationTest.isBasedOnEightFields,
            errorMessage: `Progress calculation should be based on 8 fields, got ${progressCalculationTest.totalFields}`
        }
    ];
    
    validateTests({
        apiFieldCount: apiFieldCountTest,
        formFieldCount: formFieldCountTest,
        progressCalculation: progressCalculationTest
    }, definitionFieldCountTestResults, counters);
    
    console.log('\n📊 Definition Phase Field Count Test Results:');
    console.log('API Returns 8 Fields:', apiFieldCountTest.fieldCount === 8 ? '✅' : `❌ (${apiFieldCountTest.fieldCount})`);
    console.log('API Excludes Gist:', !apiFieldCountTest.hasGistField ? '✅' : '❌');
    console.log('API Includes RequestThumbnail:', apiFieldCountTest.hasRequestThumbnailField ? '✅' : '❌');
    console.log('Form Renders 8 Fields:', formFieldCountTest.fieldCount === 8 ? '✅' : `❌ (${formFieldCountTest.fieldCount})`);
    console.log('Form Excludes Gist:', !formFieldCountTest.hasGistField ? '✅' : '❌');
    console.log('Form Includes RequestThumbnail:', formFieldCountTest.hasRequestThumbnailField ? '✅' : '❌');
    console.log('Progress Based on 8 Fields:', progressCalculationTest.isBasedOnEightFields ? '✅' : `❌ (${progressCalculationTest.totalFields})`);
    
    if (apiFieldCountTest.fields && apiFieldCountTest.fields.length > 0) {
        console.log('\n📋 Current Definition Phase Fields from API:');
        apiFieldCountTest.fields.forEach((field, index) => {
            console.log(`   ${index + 1}. ${field.displayName || field.fieldName} (${field.fieldName})`);
        });
    }
    
    if (formFieldCountTest.fields && formFieldCountTest.fields.length > 0) {
        console.log('\n📋 Current Definition Phase Form Fields:');
        formFieldCountTest.fields.forEach((field, index) => {
            console.log(`   ${index + 1}. ${field.label} (${field.fieldName}) - ${field.inputCount} input(s)`);
        });
    }
    
    logTestCompletion('Definition Phase Field Count (TDD)', testStart);
    
    return definitionFieldCountTestResults.every(test => test.result);
}

/**
 * TDD Test: Animations Endpoint Integration (Backend Enhancement) - GREEN Phase
 * Testing the new /api/animations/{videoName}?category={category} endpoint
 * Backend endpoint is implemented and should return successful responses
 */
async function testAnimationsEndpointIntegration(page, counters) {
    console.log('\n🎬 Testing Animations Endpoint Integration (TDD - Backend Enhancement)...');
    const testStart = Date.now();
    
    // Navigate to Definition aspect
    await page.goto(`${APP_URL}/videos?edit=ai%2Fai-kills-iac&video=ai%2Fai-kills-iac&aspect=definition`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test 1: Animations field exists and has AI button
    console.log('   🧪 TEST: Animations field should have AI generation button...');
    const animationsFieldTest = await page.evaluate(() => {
        const form = document.querySelector('form');
        if (!form) return { formExists: false };
        
        // Find animations field by looking for the animations form group
        const animationsFormGroup = Array.from(form.querySelectorAll('.form-group')).find(group => {
            const label = group.querySelector('label');
            const input = group.querySelector('input, textarea');
            return (label && label.textContent.toLowerCase().includes('animation')) ||
                   (input && input.name && input.name.toLowerCase().includes('animation'));
        });
        
        if (!animationsFormGroup) {
            return {
                formExists: true,
                fieldExists: false,
                labelExists: false,
                aiButtonExists: false,
                fieldName: null,
                labelText: null
            };
        }
        
        const animationsField = animationsFormGroup.querySelector('input, textarea');
        const animationsLabel = animationsFormGroup.querySelector('label');
        const animationsAIButton = animationsFormGroup.querySelector('.ai-generate-btn');
        
        return {
            formExists: true,
            fieldExists: !!animationsField,
            labelExists: !!animationsLabel,
            aiButtonExists: !!animationsAIButton,
            fieldName: animationsField ? (animationsField.name || animationsField.id) : null,
            labelText: animationsLabel ? animationsLabel.textContent.trim() : null,
            buttonAriaLabel: animationsAIButton ? animationsAIButton.getAttribute('aria-label') : null
        };
    });
    
    // Test 2: Click AI button and verify API call (TDD RED phase)
    console.log('   🧪 TEST: Animations AI button should call animations endpoint...');
    let animationsAPITest = { 
        buttonClicked: false, 
        apiCallMade: false, 
        correctEndpoint: false,
        responseReceived: false,
        errorHandled: false
    };
    
    if (animationsFieldTest.aiButtonExists) {
        // Set up network monitoring
        const apiCalls = [];
        page.on('response', response => {
            if (response.url().includes('/api/animations/') || response.url().includes('/api/ai/animations')) {
                apiCalls.push({
                    url: response.url(),
                    status: response.status(),
                    method: response.request().method()
                });
            }
        });
        
        try {
            // Click the animations AI button by finding the form group and clicking its AI button
            await page.evaluate(() => {
                const form = document.querySelector('form');
                const animationsFormGroup = Array.from(form.querySelectorAll('.form-group')).find(group => {
                    const label = group.querySelector('label');
                    const input = group.querySelector('input, textarea');
                    return (label && label.textContent.toLowerCase().includes('animation')) ||
                           (input && input.name && input.name.toLowerCase().includes('animation'));
                });
                
                if (animationsFormGroup) {
                    const aiButton = animationsFormGroup.querySelector('.ai-generate-btn');
                    if (aiButton) {
                        aiButton.click();
                    }
                }
            });
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for API call
            
            animationsAPITest = await page.evaluate((apiCalls) => {
                // Check if the animations field got populated
                const form = document.querySelector('form');
                const animationsFormGroup = Array.from(form.querySelectorAll('.form-group')).find(group => {
                    const label = group.querySelector('label');
                    const input = group.querySelector('input, textarea');
                    return (label && label.textContent.toLowerCase().includes('animation')) ||
                           (input && input.name && input.name.toLowerCase().includes('animation'));
                });
                
                const animationsField = animationsFormGroup ? animationsFormGroup.querySelector('input, textarea') : null;
                const fieldValue = animationsField ? animationsField.value : '';
                
                return {
                    buttonClicked: true,
                    apiCallMade: apiCalls.length > 0,
                    correctEndpoint: apiCalls.some(call => 
                        call.url.includes('/api/animations/ai-kills-iac') && 
                        call.url.includes('category=ai')
                    ),
                    responseReceived: apiCalls.length > 0,
                    errorHandled: apiCalls.some(call => call.status === 404 || call.status >= 400),
                    fieldPopulated: fieldValue.length > 0,
                    fieldValue: fieldValue,
                    fieldValueLength: fieldValue.length,
                    apiCalls: apiCalls
                };
            }, apiCalls);
        } catch (error) {
            console.log('   ⚠️  Could not test animations API call:', error.message);
        }
    }
    
    // Test 3: Verify error handling for missing endpoint (TDD RED phase)
    console.log('   🧪 TEST: Should handle missing animations endpoint gracefully...');
    const errorHandlingTest = await page.evaluate(() => {
        // Check for error messages or user feedback
        const errorElements = document.querySelectorAll('.error, .alert-danger, .text-danger, [class*="error"]');
        const loadingElements = document.querySelectorAll('.loading, .spinner, [class*="loading"]');
        
        return {
            hasErrorElements: errorElements.length > 0,
            hasLoadingElements: loadingElements.length > 0,
            errorMessages: Array.from(errorElements).map(el => el.textContent.trim()),
            loadingStates: Array.from(loadingElements).map(el => el.textContent.trim())
        };
    });
    
    const animationsEndpointTestResults = [
        {
            name: 'Animations field exists with AI button (TDD)',
            result: animationsFieldTest.formExists && animationsFieldTest.fieldExists && animationsFieldTest.aiButtonExists,
            errorMessage: 'Animations field or AI button not found in Definition form'
        },
        {
            name: 'Animations AI button triggers API call (TDD RED)',
            result: animationsAPITest.buttonClicked && animationsAPITest.apiCallMade,
            errorMessage: 'Animations AI button does not trigger API call'
        },
        {
            name: 'Animations API call uses correct endpoint format (TDD RED)',
            result: animationsAPITest.correctEndpoint,
            errorMessage: 'Animations API call does not use expected endpoint format /api/animations/{videoName}?category={category}'
        },
        {
            name: 'Animations endpoint returns successful response (TDD GREEN)',
            result: animationsAPITest.responseReceived && !animationsAPITest.errorHandled,
            errorMessage: 'Animations endpoint should return successful response when implemented'
        },
        {
            name: 'Animations field gets populated with AI content (TDD GREEN)',
            result: animationsAPITest.fieldPopulated,
            errorMessage: 'Animations field should be populated with AI-generated content after clicking AI button'
        }
    ];
    
    validateTests({
        animationsField: animationsFieldTest,
        animationsAPI: animationsAPITest,
        errorHandling: errorHandlingTest
    }, animationsEndpointTestResults, counters);
    
    console.log('\n📊 Animations Endpoint Integration Test Results (TDD GREEN Phase):');
    console.log('Field & Button Exist:', animationsFieldTest.fieldExists && animationsFieldTest.aiButtonExists ? '✅' : '❌');
    console.log('API Call Triggered:', animationsAPITest.apiCallMade ? '✅' : '❌');
    console.log('Correct Endpoint Format:', animationsAPITest.correctEndpoint ? '✅' : '❌');
    console.log('Successful Response:', (animationsAPITest.responseReceived && !animationsAPITest.errorHandled) ? '✅' : '❌');
    console.log('Field Gets Populated:', animationsAPITest.fieldPopulated ? '✅' : '❌');
    
    if (animationsAPITest.fieldValue !== undefined) {
        console.log(`Field Content Length: ${animationsAPITest.fieldValueLength} characters`);
        if (animationsAPITest.fieldValueLength > 0) {
            console.log(`Field Preview: "${animationsAPITest.fieldValue.substring(0, 100)}${animationsAPITest.fieldValueLength > 100 ? '...' : ''}"`);
        }
    }
    
    if (animationsAPITest.apiCalls && animationsAPITest.apiCalls.length > 0) {
        console.log('\n📋 Animations API Calls Made:');
        animationsAPITest.apiCalls.forEach((call, index) => {
            console.log(`   ${index + 1}. ${call.method} ${call.url} - Status: ${call.status}`);
        });
    }
    
    logTestCompletion('Animations Endpoint Integration (TDD)', testStart);
    
    return animationsEndpointTestResults.every(test => test.result);
}

// Main test function for Definition aspect
async function testDefinitionAspect(page, counters) {
    console.log('\n🎯 Running Definition Aspect Tests...');
    
    try {
        // Run Definition phase field count test
        const fieldCountResult = await testDefinitionPhaseFieldCount(page, counters);
        
        // Run animations endpoint integration test
        const animationsResult = await testAnimationsEndpointIntegration(page, counters);
        
        // All tests must pass
        return fieldCountResult && animationsResult;
    } catch (error) {
        console.error('❌ Definition Aspect test failed:', error.message);
        return false;
    }
}

module.exports = { 
    testDefinitionAspect,
    testDefinitionPhaseFieldCount,
    testAnimationsEndpointIntegration
}; 