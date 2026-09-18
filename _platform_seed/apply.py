#!/usr/bin/env python3
"""One-time, base-checked source migration. Removed after generated files are committed.
No user browser records or textbook source files are modified.
"""
from pathlib import Path
import json,re,subprocess
p=Path.cwd();BASE='cc09c8aff9847120c6c3fc3140fbae5579060d1c'
def baseline(path):return subprocess.check_output(['git','show',BASE+':'+path]).decode('utf-8')
def write(path,text):
 f=p/path;f.parent.mkdir(parents=True,exist_ok=True);f.write_text(text,encoding='utf-8')
old=baseline('src/reader/app.ts')
assert (p/'src/reader/app.ts').read_text()==old,'Reader changed since inspected base; refusing overwrite'
lines=old.splitlines(keepends=True)
for start,end,replacement in reversed(json.loads((p/'_platform_seed/app-edits.json').read_text())):
 lines[start:end]=[replacement]
write('src/reader/app.ts',''.join(lines))
s=baseline('src/reader/repository.ts')
write('src/reader/legacy.ts',"import type { Block, Lesson } from './types.js';\nimport type { SectionContent } from '../types/book.js';\n"+s[s.index('const tidy ='):s.index('export class Repository')])
f=p/'src/reader/types.ts';s=f.read_text();assert "kind: 'original' | 'legacy' | 'correction';" in s
f.write_text(s.replace("kind: 'original' | 'legacy' | 'correction';","kind: 'original' | 'legacy' | 'correction' | 'reading-guide';"))
text=baseline('src/reader/curriculum.ts');lessons=json.loads(text.split('= ',1)[1].strip().removesuffix(';'))
assert len(lessons)==32
foundation=[l for l in lessons if l['chapter']=='0'];other=[l for l in lessons if l['chapter']!='0'];assert len(foundation)==8
write('src/reader/foundations.ts',"import type { Lesson } from './types.js';\n// Shared beginner lessons. Stable IDs preserve existing learner records.\nexport const foundations: Lesson[] = "+json.dumps(foundation,ensure_ascii=False,indent=4)+';\n')
write('src/reader/curriculum.ts',"import type { Lesson } from './types.js';\nimport { foundations } from './foundations.js';\n// Independent thematic lessons, not a translation of PBRT.\nexport const curriculum: Lesson[] = [...foundations, ..."+json.dumps(other,ensure_ascii=False,indent=4)+'];\n')
chapters={
'9':('반사 모델','Reflection_Models',['BSDF Representation','Diffuse Reflection','Specular Reflection and Transmission','Conductor BRDF','Dielectric BSDF','Roughness Using Microfacet Theory','Rough Dielectric BSDF','Measured BSDFs','Scattering from Hair']),
'10':('텍스처와 재질','Textures_and_Materials',['Texture Sampling and Antialiasing','Texture Coordinate Generation','Texture Interface and Basic Textures','Image Texture','Material Interface and Implementations']),
'11':('볼륨 산란','Volume_Scattering',['Volume Scattering Processes','Transmittance','Phase Functions','Media']),
'12':('광원','Light_Sources',['Light Interface','Point Lights','Distant Lights','Area Lights','Infinite Area Lights','Light Sampling']),
'13':('표면에서의 빛 전달','Light_Transport_I_Surface_Reflection',['The Light Transport Equation','Path Tracing','A Simple Path Tracer','A Better Path Tracer']),
'14':('볼륨 렌더링','Light_Transport_II_Volume_Rendering',['The Equation of Transfer','Volume Scattering Integrators','Scattering from Layered Materials']),
'15':('GPU 웨이브프론트 렌더링','Wavefront_Rendering_on_GPUs',['Mapping Path Tracing to the GPU','Implementation Foundations','Path Tracer Implementation']),
'16':('회고와 앞으로의 질문','Retrospective_and_the_Future',['pbrt over the Years','Design Alternatives','Emerging Topics','The Future','Conclusion']),
'A':('샘플링 알고리즘','Sampling_Algorithms',['The Alias Method','Reservoir Sampling','The Rejection Method','Sampling 1D Functions','Sampling Multidimensional Functions']),
'B':('기반 유틸리티','Utilities',['System Startup, Cleanup, and Options','Mathematical Infrastructure','User Interaction','Containers and Memory Management','Images','Parallelism','Statistics']),
'C':('장면 설명 처리','Processing_the_Scene_Description',['Tokenizing and Parsing','Managing the Scene Description','BasicScene and Final Object Creation','Adding New Object Implementations'])}
rows=[]
for line in (p/'_platform_seed/readings.txt').read_text().splitlines():
 if not line.strip():continue
 vals=line.split('|');assert len(vals)==8
 number,title,concept,worked,q,answer,wrong,feedback=vals
 rows.append(dict(number=number,title=title,concept=concept,worked=worked,question=q,options=[answer,wrong],answer=0,feedback=feedback))
assert len(rows)==55 and len({r['number'] for r in rows})==55
outline=[]
for f in sorted((p/'src/data/books/pbrt-4ed/content').glob('ch*.ts')):
 s=f.read_text()
 def get(k):return re.search(r'\b'+k+r":\s*'([^']*)'",s).group(1)
 number=get('sectionNumber');chapter=number.split('.')[0]
 if int(chapter)>8:continue
 outline.append(dict(number=number,chapter=chapter,chapterTitle=get('chapterTitleKo'),title=get('sectionTitle'),url=get('originalUrl'),lessonId='ch'+chapter.zfill(2)+'-'+number.split('.')[1].zfill(2),coverage='legacy-note',review='pending'))
for c,(name,slug,titles) in chapters.items():
 for n,title in enumerate(titles,1):
  number=f'{c}.{n}';row=next(x for x in rows if x['number']==number)
  url='https://pbr-book.org/4ed/'+slug+'/'+title.replace(' ','_').replace(':','').replace(',','')
  if number=='B.1':url='https://pbr-book.org/4ed/Utilities/System_Startup,_Cleanup,_and_Options'
  outline.append(dict(number=number,chapter=c,chapterTitle=name,title=title+' · '+row['title'],url=url,lessonId=f'read-{c.zfill(2)}-{str(n).zfill(2)}',coverage='reading-guide',review='pending'))
assert len(outline)==105
write('src/platform/pbrt-outline.json',json.dumps(outline,ensure_ascii=False,indent=2)+'\n')
write('src/platform/pbrt-readings.json',json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
print('Prepared generic reader, shared foundations, 105 source links and 55 short guides. No editorial completion certification.')
