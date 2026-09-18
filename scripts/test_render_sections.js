import { chromium } from 'playwright';

async function testScreenshots() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 950 });

  await page.goto('http://localhost:4173');
  await page.waitForLoadState('networkidle');

  // Test 1.3
  await page.click('button:has-text("pbrt 시스템 전체 개요")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_ch01_03_full.png' });
  console.log('Successfully captured 1.3');

  // Test 1.4
  await page.click('button:has-text("이 책을 효율적으로 공부하는 법")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_ch01_04_full.png' });
  console.log('Successfully captured 1.4');

  // Test 1.5
  await page.click('button:has-text("코드 이해 및 활용 가이드")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_ch01_05_full.png' });
  console.log('Successfully captured 1.5');

  // Test 1.6
  await page.click('button:has-text("물리 기반 렌더링의 간략한 역사")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_ch01_06_full.png' });
  console.log('Successfully captured 1.6');

  await browser.close();
}
testScreenshots().catch(console.error);
