import { test, expect } from '@playwright/test';

test('current chapter stays visible without moving the reading viewport',async({page})=>{
  await page.goto('/?sec=ch16-05');
  await expect(page.locator('h1')).toContainText('작은 렌더러');
  await expect.poll(async()=>page.evaluate(()=>{
    const active=document.querySelector('.desktop-toc [aria-current="page"]');
    const tree=active?.closest('.toc-list');
    if(!active||!tree)return false;
    const a=active.getBoundingClientRect(),t=tree.getBoundingClientRect();
    return a.top>=t.top&&a.bottom<=t.bottom;
  })).toBeTruthy();
  expect(await page.evaluate(()=>scrollY)).toBeLessThan(5);
});

test('saved paragraph position returns after reload',async({page})=>{
  await page.goto('/?sec=ch00-04');
  await page.locator('.block-lab').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  await expect.poll(async()=>page.evaluate(()=>{
    const saved=JSON.parse(localStorage.getItem('cs-reader:v2')||'{}');
    return saved.positions?.['ch00-04']?.ratio||0;
  })).toBeGreaterThan(0.1);
  const previous=await page.evaluate(()=>scrollY);
  await page.reload();
  await expect(page.locator('h1')).toContainText('적분');
  await expect.poll(async()=>Math.abs((await page.evaluate(()=>scrollY))-previous)).toBeLessThan(30);
  await page.locator('.block-lab').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  await page.screenshot({path:'artifacts/integral-lab.png'});
});
