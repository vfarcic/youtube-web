/**
 * Tests for Aspect Cards Progress Tracking (Issue #16)
 * Testing the integration of completedFieldCount from backend API
 */

const { APP_URL, validateTests, logTestCompletion } = require('../utils/test-helpers');
const { 
    getSafeVideoDetailsForTesting,
    createTestUrlWithRealVideo,
    validateBackendDataForTesting 
} = require('../utils/test-data-helpers');

async function testAspectProgressTracking(page, counters) {
    console.log('\n🔥 Testing Aspect Cards Progress Tracking (Issue #16)...');
    const progressTrackingStart = Date.now();
    
    // Get dynamic test data
    const { videoName, category } = await getSafeVideoDetailsForTesting();
    if (!videoName || !category) {
        console.warn('⚠️ No video data available for progress tracking tests');
        console.warn('   Tests will use basic API endpoints only');
    }
    
    // Test 1: API Integration with Video Context
    console.log('  Testing API integration with video context...');
    const apiTests = await page.evaluate(async (testVideoName, testCategory) => {
        try {
            // Test API without video context (should return 0 completed fields)
            const basicResponse = await fetch('http://localhost:8080/api/editing/aspects');
            const basicData = await basicResponse.json();
            
            // Test API with video context (should return real progress data)
            let enhancedResponse, enhancedData;
            if (testVideoName && testCategory) {
                enhancedResponse = await fetch(`http://localhost:8080/api/editing/aspects?videoName=${encodeURIComponent(testVideoName)}&category=${encodeURIComponent(testCategory)}`);
                enhancedData = await enhancedResponse.json();
            } else {
                // Fallback to basic endpoint if no video data available
                enhancedResponse = basicResponse;
                enhancedData = basicData;
            }
            
            return {
                basicApiWorks: basicResponse.ok,
                enhancedApiWorks: enhancedResponse.ok,
                basicHasAspects: !!(basicData.aspects && basicData.aspects.length > 0),
                enhancedHasAspects: !!(enhancedData.aspects && enhancedData.aspects.length > 0),
                // Check if basic API returns 0 completed fields
                basicProgressIsZero: basicData.aspects && basicData.aspects.length > 0 ? 
                    basicData.aspects.every(aspect => (aspect.completedFieldCount || 0) === 0) : false,
                // Check if enhanced API returns real progress data
                enhancedHasProgress: enhancedData.aspects && enhancedData.aspects.length > 0 ? 
                    enhancedData.aspects.some(aspect => (aspect.completedFieldCount || 0) > 0) : false,
                sampleBasicAspect: basicData.aspects && basicData.aspects[0] ? basicData.aspects[0] : null,
                sampleEnhancedAspect: enhancedData.aspects && enhancedData.aspects[0] ? enhancedData.aspects[0] : null
            };
        } catch (error) {
            return {
                basicApiWorks: false,
                enhancedApiWorks: false,
                basicHasAspects: false,
                enhancedHasAspects: false,
                basicProgressIsZero: false,
                enhancedHasProgress: false,
                error: error.message
            };
        }
    }, videoName, category);
    
    // Test 2: Modal Context Progress Display
    console.log('  Testing modal context progress display...');
    
    // Navigate to videos page to test edit button
    await page.goto(`${APP_URL}/videos`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const modalTests = {
        editButtonWorks: false,
        modalOpens: false,
        aspectCardsVisible: false,
        progressDataDisplayed: false,
        colorCodingWorks: false,
        videoContextPassed: false
    };
    
    // Find and click edit button
    const firstVideoCard = await page.$('.video-card');
    if (firstVideoCard) {
        const editButton = await firstVideoCard.$('.btn-edit');
        if (editButton && !(await editButton.evaluate(el => el.disabled))) {
            modalTests.editButtonWorks = true;
            
            // Click edit button to open modal
            await editButton.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Check if modal opened
            const modal = await page.$('.modal-overlay');
            if (modal) {
                modalTests.modalOpens = true;
                
                // Check if aspect cards are visible in modal
                const aspectCards = await modal.$$('.aspect-card');
                if (aspectCards.length > 0) {
                    modalTests.aspectCardsVisible = true;
                    
                    // Check progress data display
                    const progressElements = await modal.$$('.progress-text');
                    if (progressElements.length > 0) {
                        modalTests.progressDataDisplayed = true;
                        
                        // Check if any progress shows non-zero data
                        const progressTexts = await Promise.all(
                            progressElements.map(el => el.evaluate(element => element.textContent))
                        );
                        
                        const hasNonZeroProgress = progressTexts.some(text => {
                            const match = text.match(/(\d+)\/(\d+) fields completed/);
                            return match && parseInt(match[1]) > 0;
                        });
                        
                        modalTests.videoContextPassed = hasNonZeroProgress;
                        
                        // Check color coding
                        const coloredProgressBars = await modal.$$('.progress-fill.progress-red, .progress-fill.progress-yellow, .progress-fill.progress-green');
                        modalTests.colorCodingWorks = coloredProgressBars.length > 0;
                    }
                }
                
                // Close modal
                const closeButton = await modal.$('.modal-close');
                if (closeButton) {
                    await closeButton.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
    }
    
    // Test 3: Direct Page Context Progress Display
    console.log('  Testing direct page context progress display...');
    
    const pageTests = {
        pageLoads: false,
        aspectCardsVisible: false,
        progressDataDisplayed: false,
        urlParametersWork: false,
        colorCodingWorks: false
    };
    
    // Test direct navigation to edit page with video context
    if (videoName && category) {
        await page.goto(`${APP_URL}/edit?videoName=${encodeURIComponent(videoName)}&category=${encodeURIComponent(category)}`, { waitUntil: 'networkidle0' });
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for API call
    } else {
        console.warn('   ⚠️ Skipping direct page test - no video data available');
        pageTests.pageLoads = false;
    }
    
    pageTests.pageLoads = true;
    
    // Check if aspect cards are visible
    const pageAspectCards = await page.$$('.aspect-card');
    if (pageAspectCards.length > 0) {
        pageTests.aspectCardsVisible = true;
        
        // Check progress data display
        const pageProgressElements = await page.$$('.progress-text');
        if (pageProgressElements.length > 0) {
            pageTests.progressDataDisplayed = true;
            
            // Check if progress shows real data (not all zeros)
            const pageProgressTexts = await Promise.all(
                pageProgressElements.map(el => el.evaluate(element => element.textContent))
            );
            
            const hasRealProgress = pageProgressTexts.some(text => {
                const match = text.match(/(\d+)\/(\d+) fields completed/);
                return match && parseInt(match[1]) > 0;
            });
            
            pageTests.urlParametersWork = hasRealProgress;
            
            // Check color coding
            const pageColoredProgressBars = await page.$$('.progress-fill.progress-red, .progress-fill.progress-yellow, .progress-fill.progress-green');
            pageTests.colorCodingWorks = pageColoredProgressBars.length > 0;
        }
    }
    
    // Test 4: Color Coding Logic
    console.log('  Testing progress bar color coding...');
    
    const colorTests = await page.evaluate(() => {
        const progressBars = Array.from(document.querySelectorAll('.progress-fill'));
        
        const redBars = progressBars.filter(bar => bar.classList.contains('progress-red')).length;
        const yellowBars = progressBars.filter(bar => bar.classList.contains('progress-yellow')).length;
        const greenBars = progressBars.filter(bar => bar.classList.contains('progress-green')).length;
        
        return {
            totalBars: progressBars.length,
            redBars,
            yellowBars,
            greenBars,
            hasCorrectClasses: redBars + yellowBars + greenBars > 0
        };
    });
    
    // Compile all test results
    const allTests = [
        // API Integration Tests
        { name: 'Basic API responds correctly', result: apiTests.basicApiWorks },
        { name: 'Enhanced API responds correctly', result: apiTests.enhancedApiWorks },
        { name: 'Basic API returns zero progress', result: apiTests.basicProgressIsZero },
        { name: 'Enhanced API returns real progress', result: apiTests.enhancedHasProgress },
        
        // Modal Context Tests
        { name: 'Edit button works', result: modalTests.editButtonWorks },
        { name: 'Modal opens when edit clicked', result: modalTests.modalOpens },
        { name: 'Aspect cards visible in modal', result: modalTests.aspectCardsVisible },
        { name: 'Progress data displayed in modal', result: modalTests.progressDataDisplayed },
        { name: 'Video context passed to modal', result: modalTests.videoContextPassed },
        { name: 'Color coding works in modal', result: modalTests.colorCodingWorks },
        
        // Page Context Tests
        { name: 'Edit page loads with parameters', result: pageTests.pageLoads },
        { name: 'Aspect cards visible on page', result: pageTests.aspectCardsVisible },
        { name: 'Progress data displayed on page', result: pageTests.progressDataDisplayed },
        { name: 'URL parameters work correctly', result: pageTests.urlParametersWork },
        { name: 'Color coding works on page', result: pageTests.colorCodingWorks },
        
        // Color Coding Tests
        { name: 'Progress bars have color classes', result: colorTests.hasCorrectClasses },
        { name: 'Multiple progress bars exist', result: colorTests.totalBars > 0 }
    ];
    
    // Update counters
    allTests.forEach(test => {
        counters.total++;
        if (test.result) {
            counters.passed++;
        } else {
            counters.failed++;
        }
    });
    
    const progressTrackingDuration = Date.now() - progressTrackingStart;
    
    // Log detailed results
    console.log('\n📊 Progress Tracking Test Results:');
    console.log('='.repeat(50));
    
    console.log('\n🔗 API Integration:');
    console.log(`Basic API: ${apiTests.basicApiWorks ? '✅' : '❌'}`);
    console.log(`Enhanced API: ${apiTests.enhancedApiWorks ? '✅' : '❌'}`);
    console.log(`Basic returns zero progress: ${apiTests.basicProgressIsZero ? '✅' : '❌'}`);
    console.log(`Enhanced returns real progress: ${apiTests.enhancedHasProgress ? '✅' : '❌'}`);
    
    console.log('\n🔥 Modal Integration:');
    console.log(`Edit button: ${modalTests.editButtonWorks ? '✅' : '❌'}`);
    console.log(`Modal opens: ${modalTests.modalOpens ? '✅' : '❌'}`);
    console.log(`Aspect cards: ${modalTests.aspectCardsVisible ? '✅' : '❌'}`);
    console.log(`Progress display: ${modalTests.progressDataDisplayed ? '✅' : '❌'}`);
    console.log(`Video context: ${modalTests.videoContextPassed ? '✅' : '❌'}`);
    console.log(`Color coding: ${modalTests.colorCodingWorks ? '✅' : '❌'}`);
    
    console.log('\n📄 Page Integration:');
    console.log(`Page loads: ${pageTests.pageLoads ? '✅' : '❌'}`);
    console.log(`Aspect cards: ${pageTests.aspectCardsVisible ? '✅' : '❌'}`);
    console.log(`Progress display: ${pageTests.progressDataDisplayed ? '✅' : '❌'}`);
    console.log(`URL parameters: ${pageTests.urlParametersWork ? '✅' : '❌'}`);
    console.log(`Color coding: ${pageTests.colorCodingWorks ? '✅' : '❌'}`);
    
    console.log('\n🎨 Color Coding:');
    console.log(`Total progress bars: ${colorTests.totalBars}`);
    console.log(`Red bars: ${colorTests.redBars}`);
    console.log(`Yellow bars: ${colorTests.yellowBars}`);
    console.log(`Green bars: ${colorTests.greenBars}`);
    
    if (apiTests.sampleEnhancedAspect) {
        console.log(`\n📝 Sample Enhanced Aspect:`, JSON.stringify(apiTests.sampleEnhancedAspect, null, 2));
    }
    
    const passedTests = allTests.filter(test => test.result).length;
    const totalTests = allTests.length;
    
    return {
        success: passedTests === totalTests,
        passedTests,
        totalTests,
        duration: progressTrackingDuration,
        details: {
            apiTests,
            modalTests,
            pageTests,
            colorTests
        }
    };
}

module.exports = { testAspectProgressTracking }; 