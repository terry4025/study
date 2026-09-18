import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Visit main page
  await page.goto('http://localhost:4173');
  await page.waitForTimeout(1000);

  // Click on 1.3 in sidebar
  await page.click('button:has-text("1.3 pbrt 시스템 전체 개요")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_ch01_03_full.png' });
  console.log('Captured ch01-03');

  // Click on 1.4 in sidebar
  await page.click('button:has-text("1.4 이 책을 효율적으로 공부하는 법")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_ch01_04_full.png' });
  console.log('Captured ch01-04');

  // Click on 1.5 in sidebar
  await page.click('button:has-text("1.5 코드 이해 및 활용 가이드")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_ch01_05_full.png' });
  console.log('Captured ch01-05');

  // Click on 1.6 in sidebar
  await page.click('button:has-text("1.6 물리 기반 렌더링의 간략한 역사")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_ch01_06_full.png' });
  console.log('Captured ch01-06');

  await browser.close();
}
capture().catch(console.error);
