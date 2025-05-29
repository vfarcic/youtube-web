/**
 * Homepage Test Module
 * Tests for the main dashboard/homepage functionality
 */

const { APP_URL, validateTests, logTestCompletion } = require('../utils/test-helpers');

async function testHomepage(page, counters) {
    console.log('1️⃣ Testing Homepage...');
    const homepageStart = Date.now();
    
    await page.goto(APP_URL, { waitUntil: 'networkidle0' });
    
    const homepageResults = await page.evaluate(() => {
        const evalStart = performance.now();
        
        // Structure Tests
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        const allLinks = Array.from(document.querySelectorAll('a[href^="/"]'));
        
        // Content Tests
        const bodyText = document.body.textContent;
        const hasExpectedContent = ['Dashboard Overview', 'Statistics', 'Quick Actions'].some(text => 
            bodyText.includes(text)
        );
        
        // Navigation Tests
        const expectedPaths = ['/', '/videos', '/create', '/edit'];
        const foundPaths = allLinks.map(link => link.getAttribute('href'));
        const hasAllPaths = expectedPaths.every(path => foundPaths.includes(path));
        
        // Performance Tests
        const domLoadTime = performance.timing ? 
            performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart : 
            performance.now();
        
        // UI Tests
        const buttons = document.querySelectorAll('button').length;
        const forms = document.querySelectorAll('form').length;
        const links = document.querySelectorAll('a').length;
        const navElements = document.querySelectorAll('nav a, .tab-btn').length;
        
        const evalEnd = performance.now();
        
        return {
            structure: {
                hasHeader: !!header,
                hasNav: !!nav,
                linkCount: allLinks.length
            },
            content: {
                hasExpectedContent,
                bodyLength: bodyText.length
            },
            navigation: {
                hasAllPaths,
                foundPaths
            },
            performance: {
                domLoadTime,
                isUnder2Seconds: domLoadTime < 2000
            },
            ui: {
                buttons,
                forms,
                links,
                navElements,
                hasInteractiveElements: buttons > 0 || forms > 0 || links > 0
            },
            meta: {
                evalTime: evalEnd - evalStart,
                timestamp: new Date().toISOString()
            }
        };
    });
    
    // Validate Homepage Results
    const homepageTests = [
        { name: 'Header exists', result: homepageResults.structure.hasHeader },
        { name: 'Navigation exists', result: homepageResults.structure.hasNav },
        { name: 'Has navigation links', result: homepageResults.structure.linkCount > 0 },
        { name: 'Expected content present', result: homepageResults.content.hasExpectedContent },
        { name: 'All navigation paths found', result: homepageResults.navigation.hasAllPaths },
        { name: 'Page loads under 2s', result: homepageResults.performance.isUnder2Seconds },
        { name: 'Interactive elements present', result: homepageResults.ui.hasInteractiveElements }
    ];
    
    validateTests(homepageResults, homepageTests, counters);
    logTestCompletion('Homepage', homepageStart, homepageResults.meta.evalTime);
    
    return homepageResults;
}

module.exports = { testHomepage };
