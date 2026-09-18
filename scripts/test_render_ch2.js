import { chromium } from 'playwright';

async function testCh2() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 950 });

  await page.goto('http://localhost:4173');
  await page.waitForLoadState('networkidle');

  // Click to expand Chapter 2 in sidebar
  await page.click('button:has-text("제2장 몬테카를로 적분")');
  await page.waitForTimeout(500);

  // 1. Click 2.1
  await page.click('button:has-text("몬테카를로 적분의 기초 원리")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_ch02_01_full.png' });
  console.log('Captured 2.1');

  // 2. Click 2.2
  await page.click('button:has-text("샘플링 효율성 향상 기법")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_ch02_02_full.png' });
  console.log('Captured 2.2');

  // 3. Click 2.3
  await page.click('button:has-text("역변환 방법을 이용한 확률 샘플링")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_ch02_03_full.png' });
  console.log('Captured 2.3');

  // 4. Click 2.4
  await page.click('button:has-text("다차원 확률 분포 간 변환")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_ch02_04_full.png' });
  console.log('Captured 2.4');

  await browser.close();
}
testCh2().catch(console.error);
