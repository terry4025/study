import { test, expect } from '@playwright/test';
import fs from 'node:fs';
fs.mkdirSync('artifacts',{recursive:true});

test('library, foundations, equations, experiment and quiz',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('h1')).toContainText('나의 서재');
 await page.screenshot({path:'artifacts/library-desktop.png'});
 await page.getByRole('button',{name:'기초부터 시작하기',exact:true}).click();
 await expect(page).toHaveURL(/sec=ch00-01/);await expect(page.locator('.display-math .katex')).toHaveCount(1);await expect(page.locator('.math-error')).toHaveCount(0);
 await page.goto('/?book=pbrt-4ed&sec=ch00-03');
 await expect(page.locator('h1')).toContainText('미분');await expect(page.locator('.math-error')).toHaveCount(0);
 const range=page.getByRole('slider',{name:'입력 간격 h'});await range.fill('0.01');await expect(page.locator('.lab-output')).toContainText('4.01');
 await page.locator('.lab').scrollIntoViewIfNeeded();await page.screenshot({path:'artifacts/derivative-lab.png'});
 await page.locator('.choice').nth(1).click();await page.getByRole('button',{name:'답 확인하기',exact:true}).click();await expect(page.locator('.feedback')).toContainText('잘 이해하셨어요');
 await page.reload();await expect(page.locator('.feedback')).toContainText('잘 이해하셨어요');expect(errors).toEqual([]);
});

test('full-text search navigates to a matching paragraph and browser back works',async({page})=>{
 await page.goto('/?sec=ch09-01');await page.keyboard.press('Control+k');
 await page.getByRole('searchbox',{name:'전체 본문 검색어'}).fill('가상 사건');
 const item=page.locator('.search-result').filter({hasText:'11.4'});await expect(item).toHaveCount(1);await item.click();
 await expect(page).toHaveURL(/sec=ch11-04/);await expect(page).toHaveURL(/block=/);await expect(page.locator('dialog')).toHaveCount(0);
 await page.goBack();await expect(page).toHaveURL(/sec=ch09-01/);await expect(page.locator('h1')).toContainText('세 가지 질문');
});

test('notes, bookmarks, read state, backup and reader preferences persist',async({page})=>{
 await page.goto('/?sec=ch09-02');await page.getByRole('button',{name:'책갈피',exact:true}).click();
 await page.getByRole('button',{name:'읽음 표시',exact:true}).click();
 await page.getByRole('button',{name:'절 메모',exact:true}).click();await page.getByRole('textbox',{name:'이 절의 메모'}).fill('PDF와 반사율은 다르다. 내 설명으로 복습하기.');
 await page.getByRole('button',{name:'보조 패널 닫기'}).click();await page.getByRole('button',{name:'읽기 설정',exact:true}).click();
 await page.getByRole('button',{name:'밤',exact:true}).click();await page.getByRole('slider',{name:'본문 크기'}).fill('20');await page.keyboard.press('Escape');
 await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','night');await expect(page.getByRole('button',{name:'책갈피',exact:true})).toHaveAttribute('aria-pressed','true');await expect(page.getByRole('button',{name:'읽음 표시 해제',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'artifacts/reader-night.png'});
 await page.getByRole('button',{name:'학습 기록',exact:true}).click();await expect(page.locator('.journal-entry')).toContainText('PDF와 반사율은 다르다');
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'기록 내보내기'}).click();expect((await download).suggestedFilename()).toMatch(/cs-reader-notes-.*\.json/);
 await page.locator('input[type=file]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{broken')});await expect(page.getByRole('status')).toContainText('기존 기록은 변경하지 않았습니다');await expect(page.locator('.journal-entry')).toContainText('PDF와 반사율은 다르다');
});

test('legacy equation blocks render; English is not falsely labelled original',async({page})=>{
 await page.goto('/?sec=ch04-01');await expect(page.locator('.block-equation')).not.toHaveCount(0);
 await page.getByRole('button',{name:'읽기 설정',exact:true}).click();await page.getByRole('checkbox').check();await page.keyboard.press('Escape');
 await expect(page.locator('.english-reference').first()).toContainText('원문 일치 미검수');await expect(page.getByText('Original English',{exact:true})).toHaveCount(0);
 await page.goto('/?sec=ch06-05');await expect(page.locator('h1')).toContainText('틈이 없는 교차');await expect(page.locator('.book-figure')).toHaveCount(0);
});

test('invalid route and malformed persisted settings recover safely',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('cs-reader:v2','{broken'));
 await page.goto('/?sec=missing');await expect(page.locator('h1')).toContainText('찾을 수 없습니다');
 await page.getByRole('button',{name:'목차로 이동',exact:true}).click();await expect(page.locator('.chapter-index-item')).toHaveCount(17);
});

test('mobile reading has no page-wide horizontal overflow and tools remain usable',async({page})=>{
 await page.setViewportSize({width:375,height:812});await page.goto('/');await page.screenshot({path:'artifacts/library-mobile.png',fullPage:true});
 await page.goto('/?sec=ch13-01');await expect(page.locator('h1')).toContainText('반사의 합');
 await page.getByRole('button',{name:'목차 열기',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.getByRole('button',{name:'절 메모',exact:true}).click();await expect(page.locator('.study-panel')).toBeVisible();await page.getByRole('textbox',{name:'이 절의 메모'}).fill('모바일 메모');await page.getByRole('button',{name:'보조 패널 닫기'}).click();
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'artifacts/reader-mobile.png'});
 for(const width of [320,375,768,1024,1440]){await page.setViewportSize({width,height:900});await page.waitForTimeout(100);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow at ${width}`).toBeTruthy();}
});

test('all 95 routes load with no runtime errors; new lessons have valid rendered equations',async({page})=>{
 test.setTimeout(180000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const counts=[6,6,4,11,6,4,8,3,8,9,5,4,6,4,3,3,5];
 for(let c=0;c<counts.length;c++)for(let n=1;n<=counts[c];n++){
  const id=`ch${String(c).padStart(2,'0')}-${String(n).padStart(2,'0')}`;
  await page.goto(`/?sec=${id}`,{waitUntil:'domcontentloaded'});await expect(page.locator('.reader-article h1')).toBeVisible();
  if(c===0||c>=9||id==='ch06-05')await expect(page.locator('.math-error')).toHaveCount(0);
 }
 expect(errors).toEqual([]);
 await page.goto('/?sec=ch09-01');await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'artifacts/reader-desktop.png'});
 await page.goto('/?page=overview');await page.screenshot({path:'artifacts/chapter-map.png'});
});
