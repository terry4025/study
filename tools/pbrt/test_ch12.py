#!/usr/bin/env python3
"""Synthetic inputs exercise the real native renderer data conversion."""
import contextlib, hashlib, io, json, tempfile, unittest, zipfile
from pathlib import Path
import fitz
from bs4 import BeautifulSoup
import prepare_ch12 as build
from source_units import source_units

class Chapter12BuildTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name);self.data=self.root/'data';self.data.mkdir()
        self.source=self.root/'source.zip';self.out=self.root/'out'
        self.html='''<!doctype html><html><title>Test</title><body><div class="pretext-layout-root">
<h2 id="section">12.1 Test light</h2><p>Use <code>SampleLi()</code> and <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><title>x</title><defs><path id="glyph" d="M0 0L10 10"/></defs><use href="#glyph"/></svg>.</p>
<div class="fragmentname">fragment</div><pre class="fragmentcode">float f() { return 1; }</pre>
<div class="figure" id="figure"><figcaption>Figure 12.1: Test figure.</figcaption></div>
<p>Remember this.<button class="footnote-button">1</button></p>
<script>window.shouldNeverRun=true</script></div></body></html>'''
        self.src=source_units(self.html)
        self.payload={'translations':{u['id']:u['text'] for u in self.src['units']},'footnotes':['원문 주석 번역'],'notes':[{'after':'u0001','title':'학습 도움','text':'도움말.'}]}
        self.pdf=fitz.open();p=self.pdf.new_page(width=200,height=200);p.draw_rect(fitz.Rect(10,10,90,90),color=(0,0,0));raw=self.pdf.tobytes();self.pdf.close();self.pdf_raw=raw
        self.meta={'path':'Light_Sources/Light_Interface.html','archive_html':'html/test.html','archive_pdf':'pdf/test.pdf','source_sha256':build.digest(self.html.encode()),'pdf_sha256':build.digest(raw),'units':len(self.src['units']),'translated':len(self.payload['translations']),'canonical_translation_sha256':build.digest(build.canonical(self.payload))}
        self.provenance=[{'image':'figure-12-1.png','parts':[{'pdf':'test.pdf','page':1,'rect':[10,10,90,90]}]}]
        self.write()
    def write(self):
        self.meta['canonical_translation_sha256']=build.digest(build.canonical(self.payload))
        (self.data/'12-01.ko.json').write_text(json.dumps(self.payload),encoding='utf8')
        (self.data/'source-manifest.json').write_text(json.dumps({'12-01':self.meta}),encoding='utf8')
        (self.data/'figure-provenance.json').write_text(json.dumps(self.provenance),encoding='utf8')
        with zipfile.ZipFile(self.source,'w') as z:z.writestr('html/test.html',self.html);z.writestr('pdf/test.pdf',self.pdf_raw)
    def run_build(self,**kwargs):
        with contextlib.redirect_stdout(io.StringIO()):build.prepare(self.source,self.out,data=self.data,**kwargs)
    def test_real_pipeline(self):
        self.run_build();cat=json.loads((self.out/'catalog.json').read_text());self.assertEqual(len(cat['lessons']),1)
        meta=cat['lessons'][0];raw=(self.out/meta['file']).read_bytes();self.assertEqual(build.digest(raw),meta['sha256'])
        lesson=json.loads(raw);self.assertEqual(lesson['kind'],'translation');self.assertEqual(lesson['chapter'],'12')
        soup=BeautifulSoup(''.join(b['html'] for b in lesson['blocks']),'lxml')
        self.assertFalse(soup.find(['script','button','iframe']));self.assertIn('SampleLi()',soup.get_text())
        self.assertIn('원문 주석 번역',soup.get_text());self.assertEqual(len(soup.select('.fragmentcode')),1)
        self.assertTrue((self.out/'assets/12/figure-12-1.png').is_file())
        ids=[e['id'] for e in soup.select('[id]')];self.assertEqual(len(ids),len(set(ids)))
    def test_changed_source_is_refused(self):
        self.html+='changed';self.write()
        with self.assertRaisesRegex(ValueError,'Source snapshot'):self.run_build()
        self.assertFalse(self.out.exists())
    def test_changed_translation_is_refused(self):
        p=self.data/'12-01.ko.json';p.write_text(p.read_text().replace('Test light','Changed light'))
        with self.assertRaisesRegex(ValueError,'Translation snapshot'):self.run_build()
        self.assertFalse(self.out.exists())
    def test_missing_token_is_refused(self):
        self.payload['translations']['u0001']=self.payload['translations']['u0001'].replace('{{0}}','');self.write()
        with self.assertRaisesRegex(ValueError,'token mismatch'):self.run_build()
    def test_missing_unit_is_refused(self):
        self.payload['translations'].pop('u0001');self.write()
        with self.assertRaisesRegex(ValueError,'coverage mismatch'):self.run_build()
    def test_missing_footnote_is_refused(self):
        self.payload['footnotes']=[];self.write()
        with self.assertRaisesRegex(ValueError,'footnote'):self.run_build()
    def test_unsafe_figure_path_is_refused(self):
        self.provenance[0]['image']='../outside.png';self.write()
        with self.assertRaisesRegex(ValueError,'Unsafe figure'):self.run_build()
        self.assertFalse((self.root/'outside.png').exists())
    def test_existing_output_requires_opt_in(self):
        self.out.mkdir();(self.out/'keep.txt').write_text('keep')
        with self.assertRaisesRegex(ValueError,'Output exists'):self.run_build()
        self.assertEqual((self.out/'keep.txt').read_text(),'keep')
    def test_failed_replace_preserves_output(self):
        self.out.mkdir();(self.out/'keep.txt').write_text('keep');self.html+='different';self.write()
        with self.assertRaises(ValueError):self.run_build(replace=True)
        self.assertEqual((self.out/'keep.txt').read_text(),'keep')
    def test_append_keeps_other_chapter_data(self):
        old=self.root/'old';old.mkdir();(old/'lessons').mkdir()
        (old/'lessons/translation-11-00.json').write_text('prior lesson')
        (old/'catalog.json').write_text(json.dumps({'schema':1,'bookId':'pbrt-4ed','lessons':[{'id':'translation-11-00'}]}))
        self.run_build(existing=old)
        self.assertEqual((self.out/'lessons/translation-11-00.json').read_text(),'prior lesson')
        self.assertEqual(len(json.loads((self.out/'catalog.json').read_text())['lessons']),2)
    def test_second_append_is_refused(self):
        self.run_build();old=self.out;self.out=self.root/'second'
        with self.assertRaisesRegex(ValueError,'already exists'):self.run_build(existing=old)
        self.assertTrue((old/'catalog.json').is_file());self.assertFalse(self.out.exists())
if __name__=='__main__':unittest.main()
