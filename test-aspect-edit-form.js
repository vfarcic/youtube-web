const { testAspectEditForm } = require('./tests/pages/aspect-edit-form.test.js');
const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting AspectEditForm TDD tests...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const counters = { total: 0, passed: 0, failed: 0 };
  
  try {
    const result = await testAspectEditForm(page, counters);
    console.log('\nFinal Results:', result);
    
    if (result.success) {
      console.log('✅ All tests passed! Ready to implement component.');
    } else {
      console.log('❌ Tests failed. Component needs implementation.');
    }
  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    await browser.close();
  }
})(); 