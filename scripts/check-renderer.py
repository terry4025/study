#!/usr/bin/env python3
"""Regression checks for inline/display TeX and working interactive labs."""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'validation';OUT.mkdir(exist_ok=True)
BASE=os.environ.get('READER_TEST_URL','http://127.0.0.1:4173')
checks=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1000})
    page.goto(BASE+'/?book=pbrt-4ed&sec=ch03-09',wait_until='networkidle')
    page.wait_for_selector('#lesson-title')
    # Matrices in a multiline $$ block embedded between prose must be actual MathML.
    expect(page.locator('#ch03-09-b5 math mtable')).to_have_count(2)
    expect(page.locator('#ch03-09-b5 .formula-error')).to_have_count(0)
    checks.append('known legacy multiline matrix renders as two MathML tables')
    for id in ['math-03','math-04','guide-09-01','guide-10-02','guide-11-01','guide-12-02','guide-13-03','guide-15-01']:
        page.goto(BASE+'/?book=pbrt-4ed&sec='+id,wait_until='networkidle')
        page.wait_for_selector('#lesson-title')
        labs=page.locator('.lab-block')
        for i in range(labs.count()):
            lab=labs.nth(i)
            sliders=lab.locator('input[type=range]')
            if not sliders.count():continue
            slider=sliders.first
            before=slider.input_value()
            slider.focus();page.keyboard.press('Home')
            if slider.input_value()==before:page.keyboard.press('End')
            assert slider.input_value()!=before,id+' interactive range did not change'
            checks.append(id+' native interactive range accepts input')
    browser.close()
(OUT/'renderer-report.json').write_text(json.dumps({'passed':True,'checks':checks,'scope':'targeted rendering and input regressions, not editorial certification'},ensure_ascii=False,indent=2))
print(json.dumps({'passed':True,'checks':checks},ensure_ascii=False))
