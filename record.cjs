const { chromium } = require('playwright');

(async () => {
  console.log('Starting the recording process...');
  // Launch browser in non-headless mode to use GPU acceleration
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-fullscreen', '--start-maximized'] // Try to start maximized for best recording
  });

  console.log('Creating a new video context...');
  const context = await browser.newContext({
    viewport: null // Let the browser handle the viewport size based on the window
  });

  const page = await context.newPage();

  // Helper function to sleep
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  console.log('Navigating to local portfolio...');
  await page.goto('http://localhost:4321');

  console.log('=========================================');
  console.log('BROWSER OPENED. START YOUR SCREEN RECORDER NOW!');
  console.log('You have 10 seconds before the automation starts...');
  console.log('=========================================');
  
  // 10-second countdown
  for (let i = 10; i > 0; i--) {
    console.log(`Starting in ${i}...`);
    await sleep(1000);
  }

  // Click on the body to ensure audio starts playing (since we set up our interaction-first audio engine)
  console.log('Initializing Neural Link (Audio)...');
  await page.click('body');
  
  console.log('On Intro Screen. Waiting 5 seconds...');
  await sleep(5000);

  // We have 8 sections to scroll through after the intro.
  // We'll simulate a 'PageDown' key press to trigger the snap-scroll.
  for (let i = 1; i <= 8; i++) {
    console.log(`Scrolling to Section ${i}...`);
    await page.keyboard.press('PageDown');
    // Wait for the smooth scroll animation (1.2s) + some time to read the text
    await sleep(5000); // Increased slightly for better reading pace in video
  }

  console.log('Reached the end. Waiting 8 seconds...');
  await sleep(8000);

  console.log('Closing browser...');
  await context.close();
  await browser.close();

  console.log('Done! You can stop your screen recording now.');
})();
