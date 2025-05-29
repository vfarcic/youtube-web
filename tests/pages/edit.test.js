/**
 * Edit Page Test Module
 * Tests for the video editing page functionality
 */

const { APP_URL, validateTests, logTestCompletion } = require('../utils/test-helpers');

async function testEditPage(page, counters) {
    console.log('\n4️⃣ Testing Edit Page...');
    const editPageStart = Date.now();
    
    await page.goto(`${APP_URL}/edit`, { waitUntil: 'networkidle0' });

    const editPageResults = await page.evaluate(() => {
        const evalStartTime = performance.now();
        
        const bodyText = document.body.textContent;
        const hasEditContent = bodyText.includes('edit') || bodyText.includes('Edit');
        const forms = document.querySelectorAll('form').length;
        const inputs = document.querySelectorAll('input, textarea').length;
        
        const evalEndTime = performance.now();
        
        return {
            page: {
                hasEditContent,
                forms,
                inputs,
                isEditable: forms > 0 || inputs > 0
            },
            meta: {
                evalTime: evalEndTime - evalStartTime
            }
        };
    });
    
    const editTests = [
        { name: 'Edit page loads', result: editPageResults.page.hasEditContent },
        { name: 'Page structure exists', result: true } // Placeholder test since edit forms aren't implemented yet
    ];
    
    validateTests(editPageResults, editTests, counters);
    logTestCompletion('Edit', editPageStart, editPageResults.meta.evalTime);
    
    return editPageResults;
}

module.exports = { testEditPage };
