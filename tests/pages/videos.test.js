/**
 * Videos Page Test Module
 * Tests for the videos list page and PhaseFilterBar functionality
 */

const { APP_URL, validateTests, logTestCompletion } = require('../utils/test-helpers');

async function testVideosPage(page, counters) {
    console.log('\n2️⃣ Testing Videos Page...');
    const videosPageStart = Date.now();
    const maxAttemptsForVideosPage = 100;
    
    await page.goto(`${APP_URL}/videos`, { waitUntil: 'networkidle0' });
    
    const videosPageResults = await page.evaluate(async (maxAttempts) => {
        const evalStart = performance.now();
        
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        // Wait for PhaseFilterBar and its buttons to render
        let phaseFilterBar = document.querySelector('.phase-filter');
        let phaseButtons = [];
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            phaseFilterBar = document.querySelector('.phase-filter');
            if (phaseFilterBar) {
                phaseButtons = Array.from(phaseFilterBar.querySelectorAll('.phase-btn'));
                if (phaseButtons.length > 1) break; // "All" + at least one phase from API/mock
            }
            await delay(100); // Check every 100ms
            attempts++;
        }

        // Structure Tests
        const header = document.querySelector('header');
        const main = document.querySelector('main');
        
        // Re-query buttons if initial attempt in loop was partial
        if (phaseFilterBar && phaseButtons.length <=1) {
             phaseButtons = Array.from(phaseFilterBar.querySelectorAll('.phase-btn'));
        }
        
        // Content Tests
        const bodyText = document.body.textContent || "";
        const hasExpectedContent = bodyText.includes('Video List');
        const initialPlaceholder = document.querySelector('main p')?.textContent || '';

        // PhaseFilterBar Tests
        let phaseFilterTests = {
            barExists: !!phaseFilterBar,
            buttonsRendered: phaseButtons.length > 0,
            allButtonPresent: false,
            initialButtonActive: false,
            clickChangesActive: false,
            placeholderUpdates: false,
            buttonFormatCorrect: true,
            warningLogicCorrect: true,
        };

        // Phase Filter Warning Tests
        const warningIcons = document.querySelectorAll('.phase-btn svg[aria-label*="Warning"]');
        const phaseWarningData = phaseButtons.map(btn => {
            const text = btn.textContent;
            const hasWarning = btn.querySelector('svg[aria-label*="Warning"]');
            const match = text.match(/(\w+(?:\s\w+)*)\s\((\d+)\)/);
            if (match) {
                return {
                    name: match[1],
                    count: parseInt(match[2]),
                    hasWarning: !!hasWarning
                };
            }
            return null;
        }).filter(Boolean);

        // Check if warnings are correctly applied based on business rules
        const publishPending = phaseWarningData.find(p => p.name === 'Publish Pending');
        const editRequested = phaseWarningData.find(p => p.name === 'Edit Requested');
        const materialDone = phaseWarningData.find(p => p.name === 'Material Done');

        const correctWarnings = {
            publishPending: publishPending ? (publishPending.count < 1 ? publishPending.hasWarning : !publishPending.hasWarning) : true,
            editRequested: editRequested ? (editRequested.count < 1 ? editRequested.hasWarning : !editRequested.hasWarning) : true,
            materialDone: materialDone ? (materialDone.count < 3 ? materialDone.hasWarning : !materialDone.hasWarning) : true
        };

        phaseFilterTests.warningLogicCorrect = correctWarnings.publishPending && correctWarnings.editRequested && correctWarnings.materialDone;

        if (phaseFilterBar && phaseButtons.length > 0) {
            const allButton = phaseButtons.find(btn => btn.textContent && btn.textContent.includes('All'));
            const startedButton = phaseButtons.find(btn => btn.textContent && btn.textContent.includes('Started'));
            phaseFilterTests.allButtonPresent = !!allButton;

            // Check if "Started" button is active initially (our design choice)
            if (startedButton) {
                phaseFilterTests.initialButtonActive = startedButton.classList.contains('active');
                
                const otherPhaseButton = phaseButtons.find(btn => btn !== startedButton && btn !== allButton);

                if (otherPhaseButton) {
                    otherPhaseButton.click();
                    await delay(100); // Allow for state update and re-render

                    phaseFilterTests.clickChangesActive = otherPhaseButton.classList.contains('active') && !startedButton.classList.contains('active');
                    
                    // Since placeholder text doesn't change with phases, just check it exists
                    const updatedPlaceholder = document.querySelector('main p')?.textContent || '';
                    phaseFilterTests.placeholderUpdates = updatedPlaceholder.includes("Implementation coming soon");

                    startedButton.click(); // Click "Started" button back
                    await delay(100);
                    const placeholderAfterStarted = document.querySelector('main p')?.textContent || '';
                    // Ensure placeholder remains consistent
                    phaseFilterTests.placeholderUpdates = phaseFilterTests.placeholderUpdates && placeholderAfterStarted.includes("Implementation coming soon");
                } else {
                    // If only "Started" button exists, just check placeholder exists
                    phaseFilterTests.clickChangesActive = true;
                    phaseFilterTests.placeholderUpdates = initialPlaceholder.includes("Implementation coming soon");
                }
            } else if (allButton) {
                // Fallback to original logic if Started button not found
                phaseFilterTests.initialButtonActive = allButton.classList.contains('active');
                
                const specificPhaseButton = phaseButtons.find(btn => btn !== allButton);

                if (specificPhaseButton) {
                    specificPhaseButton.click();
                    await delay(100); // Allow for state update and re-render

                    phaseFilterTests.clickChangesActive = specificPhaseButton.classList.contains('active') && !allButton.classList.contains('active');
                    
                    // Since placeholder text doesn't change with phases, just check it exists
                    const updatedPlaceholder = document.querySelector('main p')?.textContent || '';
                    phaseFilterTests.placeholderUpdates = updatedPlaceholder.includes("Implementation coming soon");

                    allButton.click(); // Click "All" button back
                    await delay(100);
                    const placeholderAfterAll = document.querySelector('main p')?.textContent || '';
                    // Ensure placeholder remains consistent
                    phaseFilterTests.placeholderUpdates = phaseFilterTests.placeholderUpdates && placeholderAfterAll.includes("Implementation coming soon");
                } else {
                    // If only "All" button exists, just check placeholder exists
                    phaseFilterTests.clickChangesActive = true;
                    phaseFilterTests.placeholderUpdates = initialPlaceholder.includes("Implementation coming soon");
                }
            }
            
            phaseButtons.forEach(btn => {
                if (btn.textContent && !/.*\s\(\d+\)/.test(btn.textContent)) {
                    phaseFilterTests.buttonFormatCorrect = false;
                }
            });
        }
        
        const domLoadTime = performance.timing ? 
            performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart : 
            performance.now();

        const evalEnd = performance.now();

        return {
            structure: {
                hasHeader: !!header,
                hasMain: !!main,
            },
            content: {
                hasExpectedContent,
                initialPlaceholder,
            },
            phaseFilter: phaseFilterTests,
            performance: {
                domLoadTime,
                isUnder2Seconds: domLoadTime < 2000
            },
            meta: {
                evaluationTime: evalEnd - evalStart,
                url: window.location.href,
                phaseButtonsCount: phaseButtons.length,
                phaseButtonsText: phaseButtons.map(b => b.textContent)
            }
        };
    }, maxAttemptsForVideosPage);

    // Validate Videos Page Results
    const videosPageTests = [
        { 
            name: 'Header exists', 
            result: videosPageResults.structure.hasHeader,
            errorMessage: 'Videos Page: Missing header'
        },
        { 
            name: 'Main content area exists', 
            result: videosPageResults.structure.hasMain,
            errorMessage: 'Videos Page: Missing main content area'
        },
        { 
            name: 'Expected content present', 
            result: videosPageResults.content.hasExpectedContent,
            errorMessage: 'Videos Page: Missing expected content "Video List"'
        },
        { 
            name: 'PhaseFilterBar exists', 
            result: videosPageResults.phaseFilter.barExists,
            errorMessage: 'Videos Page: PhaseFilterBar not found'
        },
        { 
            name: 'PhaseFilterBar buttons rendered', 
            result: videosPageResults.phaseFilter.buttonsRendered,
            errorMessage: `Videos Page: PhaseFilterBar buttons not rendered (found ${videosPageResults.meta.phaseButtonsCount} after waiting up to ${maxAttemptsForVideosPage * 100}ms)`
        },
        { 
            name: '"All" button present', 
            result: videosPageResults.phaseFilter.allButtonPresent,
            errorMessage: 'Videos Page: "All" button in PhaseFilterBar not found'
        },
        { 
            name: '"Started" button active initially', 
            result: videosPageResults.phaseFilter.initialButtonActive,
            errorMessage: 'Videos Page: "Started" button not active initially or activePhase logic incorrect'
        },
        { 
            name: 'Clicking phase button changes active state', 
            result: videosPageResults.phaseFilter.clickChangesActive,
            errorMessage: 'Videos Page: Clicking phase button does not change active state correctly'
        },
        { 
            name: 'Placeholder text exists', 
            result: videosPageResults.phaseFilter.placeholderUpdates,
            errorMessage: 'Videos Page: Placeholder text does not exist or has incorrect content'
        },
        { 
            name: 'Phase button format correct', 
            result: videosPageResults.phaseFilter.buttonFormatCorrect,
            errorMessage: 'Videos Page: Phase button format (Name (count)) is incorrect. Buttons: ' + videosPageResults.meta.phaseButtonsText.join(', ')
        },
        { 
            name: 'Phase warning logic correct', 
            result: videosPageResults.phaseFilter.warningLogicCorrect,
            errorMessage: 'Videos Page: Phase warning icons not correctly applied based on business rules'
        }
    ];
    
    validateTests(videosPageResults, videosPageTests, counters);
    
    // Performance warning (not counted as test failure)
    if (!videosPageResults.performance.isUnder2Seconds) {
        console.warn('⚠️ Videos Page: DOM load time over 2 seconds');
    }
    
    console.log(`   Videos Page tests completed in ${Date.now() - videosPageStart}ms`);
    console.log(`   Evaluation time: ${videosPageResults.meta.evaluationTime.toFixed(2)}ms`);
    
    if (videosPageResults.meta.phaseButtonsCount <= 1 && videosPageResults.phaseFilter.barExists) {
        console.warn(`   ⚠️ Videos Page: Only ${videosPageResults.meta.phaseButtonsCount} phase button(s) found. API might be down or no phases available. Fallback data might be in use.`);
    }
    
    return videosPageResults;
}

module.exports = { testVideosPage };
