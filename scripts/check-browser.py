#!/usr/bin/env python3
"""Real Chromium + HTTP app checks. No History/localStorage mocks.
Requires: pip install playwright==1.57.0; playwright install chromium
Start app: npm run preview -- --host 127.0.0.1 --port 4173
"""
import json, os, re
from pathlib import Path
from urllib.parse import quote
from playwright.sync_api import sync_playwright, expect
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'validation';OUT.mkdir(exist_ok=True)
BASE=os.environ.get('READER_TEST_URL','http://127.0.0.1:4173')
KEY='gyeol.reader.v2.book.pbrt-4ed'
outline=json.loads((ROOT/'src/platform/pbrt-outline.json').read_text())
original=[]
for name in ['foundations.ts','curriculum.ts']:
 original+=re.findall(r'"id": "((?:math-\d{2}|guide-\d{2}-\d{2}))"',(ROOT/'src/reader'/name).read_text())
lesson_ids=list(dict.fromkeys(original+[e['lessonId'] for e in outline]))
assert len(lesson_ids)==137
report={'lessonPages':0,'viewportChecks':[],'consoleErrors':[],'checks':[],'transport':'real HTTP, native History and localStorage'}
def check(condition,message):
 assert condition,message
 report['checks'].append(message)
with sync_playwright() as p:
 launch={'headless':True,'args':['--no-sandbox']}
 if os.environ.get('CHROMIUM_PATH'):launch['executable_path']=os.environ['CHROMIUM_PATH']
 browser=p.chromium.launch(**launch)
 context=browser.new_context(viewport={'width':1440,'height':1000})
 page=context.new_page();page.on('pageerror',lambda e:report['consoleErrors'].append(str(e)))
 def visit(query=''):
  page.goto(BASE+'/'+query,wait_until='networkidle');page.wait_for_selector('#main-content');page.wait_for_timeout(70)
 def lesson(id):
  visit('?book=pbrt-4ed&sec='+quote(id));page.wait_for_selector('#lesson-title')
 try:
  visit();expect(page.locator('.shelf-card')).to_have_count(6)
  page.screenshot(path=str(OUT/'shelf-desktop.png'),full_page=True)
  old={'version':2,'settings':{'fontSize':20},'lastLesson':'math-03','completed':['math-01'],'bookmarks':[],'positions':{},'notes':{'math-03:lesson-title':{'lessonId':'math-03','blockId':'lesson-title','text':'기존 기록 보존 확인','updated':'2026-09-18'}},'answers':{}}
  old_bytes=json.dumps(old,ensure_ascii=False)
  page.evaluate('(s)=>{localStorage.clear();localStorage.setItem("gyeol.reader.v2",s)}',old_bytes)
  page.reload(wait_until='networkidle')
  page.get_by_role('button',name='이어 읽기 →',exact=True).click();page.wait_for_selector('#lesson-title')
  check('sec=math-03' in page.url,'root resume honors migrated PBRT record')
  check(page.evaluate('localStorage.getItem("gyeol.reader.v2")')==old_bytes,'migration leaves legacy bytes unchanged')
  check(json.loads(page.evaluate('(k)=>localStorage.getItem(k)',KEY))['notes']['math-03:lesson-title']['text']=='기존 기록 보존 확인','native localStorage note migration')
  page.get_by_role('button',name='전체 서재',exact=True).click();expect(page.locator('.shelf-card')).to_have_count(6)
  page.locator('.shelf-card').nth(1).get_by_role('button').click()
  expect(page.get_by_text('아직 수업을 제공하지 않는 예정 도서입니다.',exact=True)).to_be_visible()
  expect(page.locator('#lesson-title')).to_have_count(0)
  page.go_back(wait_until='networkidle');expect(page.locator('.shelf-card')).to_have_count(6)
  page.go_back(wait_until='networkidle');expect(page.locator('#lesson-title')).to_be_visible()
  check('sec=math-03' in page.url,'cross-screen browser back restores the book/lesson')
  visit('?book=unknown&sec=math-03');expect(page.get_by_text('등록되지 않은 책입니다.',exact=True)).to_be_visible()
  check(page.locator('#lesson-title').count()==0,'unknown books never fall back to PBRT')
  visit('?book=pbrt-4ed&view=outline');expect(page.locator('.source-row')).to_have_count(105)
  page.get_by_label('9.6 원문 읽음',exact=True).check()
  state=json.loads(page.evaluate('(k)=>localStorage.getItem(k)',KEY))
  check('source:9.6' in state['completed'] and 'read-09-06' not in state['completed'],'source reading state is not lesson completion')
  page.reload(wait_until='networkidle');expect(page.get_by_label('9.6 원문 읽음',exact=True)).to_be_checked()
  page.locator('.outline-tools input').fill('9.6');expect(page.locator('.source-row')).to_have_count(1)
  page.get_by_role('button',name='읽기 안내',exact=True).click();page.wait_for_selector('#lesson-title')
  check('read-09-06' in page.url,'source outline opens the correct guide')
  page.locator('.paragraph-note').first.click();page.locator('textarea').fill('새로운 메모: 기호보다 의미부터')
  page.get_by_role('button',name='메모 저장',exact=True).click();expect(page.locator('dialog')).to_have_count(0)
  page.locator('.quiz-block input[type=radio]').first.check();page.get_by_role('button',name='선택한 답 확인',exact=True).click()
  expect(page.locator('.quiz-feedback')).to_be_visible()
  page.reload(wait_until='networkidle');page.wait_for_selector('#lesson-title');expect(page.locator('.quiz-block input[type=radio]').first).to_be_checked()
  state=json.loads(page.evaluate('(k)=>localStorage.getItem(k)',KEY))
  check(any(n['text']=='새로운 메모: 기호보다 의미부터' for n in state['notes'].values()),'edited note survives real reload')
  page.get_by_role('button',name='읽기 설정',exact=True).click();page.get_by_label('본문 글자 크기',exact=True).focus();page.keyboard.press('End')
  page.get_by_role('button',name='어둡게',exact=True).click();page.keyboard.press('Escape');expect(page.locator('dialog')).to_have_count(0)
  check(page.evaluate('document.documentElement.dataset.readerTheme')=='dark','theme changes on actual DOM')
  page.keyboard.press('Control+k');expect(page.locator('dialog')).to_be_visible();page.locator('#fulltext-search').fill('마이크로패싯')
  page.wait_for_timeout(600);page.keyboard.press('Escape');expect(page.locator('dialog')).to_have_count(0)
  page.get_by_role('button',name='학습 기록',exact=True).click()
  with page.expect_download() as dl:page.get_by_role('button',name='기록 내보내기',exact=True).click()
  payload=json.loads(Path(dl.value.path()).read_text());check(payload['bookId']=='pbrt-4ed','backup contains explicit book ID')
  page.keyboard.press('Escape')
  for id in lesson_ids:
   lesson(id)
   check(page.locator('[data-block-id]').count()>0,id+' renders blocks')
   check(page.locator('.formula-error').count()==0,id+' has no math fallback errors')
   report['lessonPages']+=1
  for width in [320,390,768,1440]:
   page.set_viewport_size({'width':width,'height':900})
   for suffix in ['', '?book=pbrt-4ed&view=outline','?book=pbrt-4ed&sec=math-03','?book=pbrt-4ed&sec=read-09-06','?book=pbrt-4ed&sec=ch07-03']:
    visit(suffix)
    overflow=page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
    report['viewportChecks'].append({'width':width,'route':suffix or '/', 'overflow':overflow})
    check(not overflow,f'{width}px {suffix or "/"}: no page-wide overflow')
   if width==390:
    lesson('read-09-06');page.screenshot(path=str(OUT/'reader-mobile.png'),full_page=True)
  page.set_viewport_size({'width':1440,'height':1000});lesson('read-09-06')
  page.get_by_role('button',name='읽기 설정',exact=True).click();page.get_by_role('button',name='밝게',exact=True).click();page.get_by_label('본문 글자 크기',exact=True).focus();page.keyboard.press('Home');page.keyboard.press('ArrowRight');page.keyboard.press('ArrowRight');page.keyboard.press('Escape')
  page.screenshot(path=str(OUT/'reader-desktop.png'),full_page=True)
  visit('?book=pbrt-4ed&view=outline');page.screenshot(path=str(OUT/'outline-desktop.png'),full_page=False)
  check(not report['consoleErrors'],'no uncaught page errors across all pages')
  report['passed']=True
 except Exception as e:
  report['passed']=False;report['failure']=str(e);page.screenshot(path=str(OUT/'failure.png'),full_page=True);raise
 finally:
  (OUT/'browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
  browser.close()
print(json.dumps({k:v for k,v in report.items() if k!='checks'},ensure_ascii=False,indent=2))
