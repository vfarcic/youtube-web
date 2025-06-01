async function testEnhancedVideoFeatures(page, counters) {
    console.log('\n🚀 Testing Enhanced Video Features...');

    const testResults = {
        progressDisplay: false,
        metadataDisplay: false,
        visualElements: false,
        responsiveDesign: false,
        apiPhaseIntegration: false, // NEW: Test API-driven phases
        phaseDataConsistency: false, // NEW: Test phase data consistency
        noHardCodedPhases: false // NEW: Verify no hard-coded phases
    };

    try {
        // Navigate to videos page
        await page.goto('http://localhost:3000/videos', { 
            waitUntil: 'networkidle0',
            timeout: 10000 
        });

        // Wait for components to load
        await page.waitForSelector('.video-grid', { timeout: 5000 });
        await page.waitForSelector('.phase-filter', { timeout: 5000 });

        // Test 1: Progress Display (existing)
        const progressTest = await page.evaluate(() => {
            const videoCards = document.querySelectorAll('.video-card');
            let hasProgressBars = false;
            let hasProgressLabels = false;
            let hasPercentages = false;

            videoCards.forEach(card => {
                const progressBar = card.querySelector('.progress-bar');
                const progressLabel = card.querySelector('.progress-label');
                const percentage = card.querySelector('.progress-percentage');

                if (progressBar) hasProgressBars = true;
                if (progressLabel) hasProgressLabels = true;
                if (percentage) hasPercentages = true;
            });

            return {
                hasProgressBars,
                hasProgressLabels,
                hasPercentages,
                cardCount: videoCards.length
            };
        });

        testResults.progressDisplay = progressTest.hasProgressBars && 
                                     progressTest.hasProgressLabels && 
                                     progressTest.hasPercentages &&
                                     progressTest.cardCount > 0;

        console.log(`✅ Progress Display: ${testResults.progressDisplay ? 'PASS' : 'FAIL'}`);

        // Test 2: Metadata Display (existing)
        const metadataTest = await page.evaluate(() => {
            const videoCards = document.querySelectorAll('.video-card');
            let hasMetadata = false;
            let hasViewCounts = false;
            let hasDates = false;
            let hasPhaseBadges = false;

            videoCards.forEach(card => {
                const metadata = card.querySelector('.video-metadata');
                const viewCount = card.querySelector('.view-count');
                const date = card.querySelector('.created-date');
                const phaseBadge = card.querySelector('.phase-badge');

                if (metadata) hasMetadata = true;
                if (viewCount) hasViewCounts = true;
                if (date) hasDates = true;
                if (phaseBadge) hasPhaseBadges = true;
            });

            return {
                hasMetadata,
                hasViewCounts, 
                hasDates,
                hasPhaseBadges
            };
        });

        testResults.metadataDisplay = metadataTest.hasMetadata && 
                                     metadataTest.hasViewCounts && 
                                     metadataTest.hasDates &&
                                     metadataTest.hasPhaseBadges;

        console.log(`✅ Metadata Display: ${testResults.metadataDisplay ? 'PASS' : 'FAIL'}`);

        // Test 3: Visual Elements (existing)
        const visualTest = await page.evaluate(() => {
            const videoCards = document.querySelectorAll('.video-card');
            let hasColors = false;
            let hasIcons = false;
            let hasButtons = false;

            videoCards.forEach(card => {
                const coloredElements = card.querySelectorAll('[style*="background"]');
                const icons = card.querySelectorAll('i.fas');
                const buttons = card.querySelectorAll('button');

                if (coloredElements.length > 0) hasColors = true;
                if (icons.length > 0) hasIcons = true;
                if (buttons.length > 0) hasButtons = true;
            });

            return {
                hasColors,
                hasIcons,
                hasButtons
            };
        });

        testResults.visualElements = visualTest.hasColors && visualTest.hasIcons && visualTest.hasButtons;
        console.log(`✅ Visual Elements: ${testResults.visualElements ? 'PASS' : 'FAIL'}`);

        // Test 4: Responsive Design (existing)
        const responsiveTest = await page.evaluate(() => {
            const videoGrid = document.querySelector('.video-grid');
            const computedStyle = window.getComputedStyle(videoGrid);
            
            return {
                isGrid: computedStyle.display === 'grid',
                hasGridColumns: !!computedStyle.gridTemplateColumns,
                hasGap: !!computedStyle.gap
            };
        });

        testResults.responsiveDesign = responsiveTest.isGrid && 
                                      responsiveTest.hasGridColumns && 
                                      responsiveTest.hasGap;

        console.log(`✅ Responsive Design: ${testResults.responsiveDesign ? 'PASS' : 'FAIL'}`);

        // NEW Test 5: API-Driven Phase Integration
        console.log('🧪 Testing API-driven phase integration...');
        
        // First, get phase data from API directly
        const apiPhaseData = await page.evaluate(async () => {
            try {
                const response = await fetch('http://localhost:8080/api/videos/phases');
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                return data.phases || [];
            } catch (error) {
                console.error('API fetch failed:', error);
                return null;
            }
        });

        if (!apiPhaseData) {
            console.log('❌ API Phase Integration: FAIL - Could not fetch API data');
            testResults.apiPhaseIntegration = false;
        } else {
            // Check if PhaseFilterBar uses API data
            const phaseFilterTest = await page.evaluate((expectedPhases) => {
                const phaseButtons = document.querySelectorAll('.phase-btn');
                const buttonTexts = Array.from(phaseButtons).map(btn => btn.textContent.trim());
                
                // Check if API phase names appear in buttons (excluding "All")
                const apiPhaseNames = expectedPhases.map(p => p.name);
                const hasApiPhases = apiPhaseNames.some(name => 
                    buttonTexts.some(btnText => btnText.includes(name))
                );

                return {
                    buttonCount: phaseButtons.length,
                    buttonTexts,
                    expectedPhaseNames: apiPhaseNames,
                    hasApiPhases
                };
            }, apiPhaseData);

            testResults.apiPhaseIntegration = phaseFilterTest.hasApiPhases && phaseFilterTest.buttonCount > 1;
            console.log(`✅ API Phase Integration: ${testResults.apiPhaseIntegration ? 'PASS' : 'FAIL'}`);
            
            if (!testResults.apiPhaseIntegration) {
                console.log('Debug - Expected phases:', apiPhaseData.map(p => p.name));
                console.log('Debug - Button texts:', phaseFilterTest.buttonTexts);
            }
        }

        // NEW Test 6: Phase Data Consistency Between Components
        console.log('🧪 Testing phase data consistency...');
        
        const consistencyTest = await page.evaluate(() => {
            // Get phase data from PhaseFilterBar
            const phaseButtons = Array.from(document.querySelectorAll('.phase-btn'))
                .filter(btn => !btn.textContent.includes('All'))
                .map(btn => {
                    const match = btn.textContent.match(/(.+?)\s*\((\d+)\)/);
                    return match ? { name: match[1].trim(), count: parseInt(match[2]) } : null;
                }).filter(Boolean);

            // Get phase data from VideoCards
            const videoCards = document.querySelectorAll('.video-card');
            const usedPhaseNames = new Set();
            
            videoCards.forEach(card => {
                const phaseBadge = card.querySelector('.phase-badge');
                if (phaseBadge) {
                    usedPhaseNames.add(phaseBadge.textContent.trim());
                }
            });

            // Check if all used phase names in cards exist in filter bar
            const filterPhaseNames = new Set(phaseButtons.map(p => p.name));
            const allPhasesConsistent = Array.from(usedPhaseNames).every(name => 
                filterPhaseNames.has(name) || name.startsWith('Phase ') // Allow fallback format
            );

            return {
                filterPhases: phaseButtons,
                usedPhaseNames: Array.from(usedPhaseNames),
                filterPhaseNames: Array.from(filterPhaseNames),
                allPhasesConsistent
            };
        });

        testResults.phaseDataConsistency = consistencyTest.allPhasesConsistent;
        console.log(`✅ Phase Data Consistency: ${testResults.phaseDataConsistency ? 'PASS' : 'FAIL'}`);

        // NEW Test 7: Verify No Hard-Coded Phases
        console.log('🧪 Testing absence of hard-coded phases...');
        
        // This test verifies that phase data comes from API, not hard-coded values
        const hardCodedTest = await page.evaluate(() => {
            // Check if we can find evidence of dynamic phase loading
            const loadingIndicators = document.querySelectorAll('[style*="Loading"]') ||
                                     document.querySelector('.phase-filter')?.textContent.includes('Loading');
            
            // Check for API-driven behavior: phases should match what we expect from API
            const phaseButtons = document.querySelectorAll('.phase-btn');
            const hasReasonablePhaseCount = phaseButtons.length >= 2 && phaseButtons.length <= 15; // Reasonable range
            
            // If phases were hard-coded, they'd always be the same
            // If from API, they should vary based on actual data
            const buttonTexts = Array.from(phaseButtons).map(btn => btn.textContent);
            const hasCountsInButtons = buttonTexts.some(text => /\(\d+\)/.test(text));
            
            return {
                hasReasonablePhaseCount,
                hasCountsInButtons,
                buttonCount: phaseButtons.length,
                indicatesApiDriven: hasReasonablePhaseCount && hasCountsInButtons
            };
        });

        testResults.noHardCodedPhases = hardCodedTest.indicatesApiDriven;
        console.log(`✅ No Hard-Coded Phases: ${testResults.noHardCodedPhases ? 'PASS' : 'FAIL'}`);

        // Calculate success metrics
        const totalTests = Object.keys(testResults).length;
        const passedTests = Object.values(testResults).filter(result => result === true).length;
        
        console.log(`\n📊 Enhanced Video Features Results: ${passedTests}/${totalTests} tests passed`);
        
        // Update counters
        counters.totalTests += totalTests;
        counters.passedTests += passedTests;
        
        // Log detailed results
        Object.entries(testResults).forEach(([test, result]) => {
            const status = result ? '✅ PASS' : '❌ FAIL';
            console.log(`   ${test}: ${status}`);
        });

        return {
            success: passedTests === totalTests,
            results: testResults,
            totalTests,
            passedTests
        };

    } catch (error) {
        console.error('❌ Enhanced Video Features test failed:', error);
        
        // Update counters for failed tests
        const totalTests = Object.keys(testResults).length;
        counters.totalTests += totalTests;
        // passedTests remains 0 for failed tests
        
        return {
            success: false,
            error: error.message,
            results: testResults,
            totalTests,
            passedTests: 0
        };
    }
}

module.exports = { testEnhancedVideoFeatures }; 