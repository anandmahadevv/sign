import { chromium } from 'playwright';

// Change this to your production URL if you want to test the live site
const TARGET_URL = 'https://sign.hackarena.dev/';
const TOTAL_USERS = 100;
const CONCURRENT_USERS = 5;

async function simulateTraffic() {
  console.log(`Starting traffic simulation for ${TOTAL_USERS} users...`);
  console.log(`Targeting: ${TARGET_URL}`);
  
  // Launching browser in headless mode (invisible)
  const browser = await chromium.launch({ headless: true });
  
  let completed = 0;

  async function visitSite(userId) {
    // Each user gets their own fresh context (no shared cookies/cache) 
    // This is crucial so Google Analytics sees them as 100 distinct users!
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      console.log(`[User ${userId}] Visiting site...`);
      await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
      
      // Wait for a few seconds to let GA register the active time on page
      const waitTime = Math.floor(Math.random() * 5000) + 3000; // 3-8 seconds
      await page.waitForTimeout(waitTime);
      
    } catch (err) {
      console.error(`[User ${userId}] Error:`, err.message);
    } finally {
      await context.close();
      completed++;
      console.log(`Progress: ${completed}/${TOTAL_USERS} visits completed`);
    }
  }

  // Run in batches to avoid overloading your computer's memory
  for (let i = 0; i < TOTAL_USERS; i += CONCURRENT_USERS) {
    const batch = [];
    for (let j = 0; j < CONCURRENT_USERS && i + j < TOTAL_USERS; j++) {
      batch.push(visitSite(i + j + 1));
    }
    await Promise.all(batch);
  }

  await browser.close();
  console.log('✅ Traffic simulation complete! Check your Google Analytics Realtime dashboard.');
}

simulateTraffic().catch(console.error);
