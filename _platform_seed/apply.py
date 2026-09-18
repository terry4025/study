from pathlib import Path
p=Path('.')
f=p/'src/reader/curriculum.ts';s=f.read_text();a='export const curriculum: Lesson[] = [...foundations, ...['
assert s.count(a)==1 and s.rstrip().endswith(']];'), 'Unexpected course layout; do not overwrite'
s=s.replace(a,'const themedLessons: Lesson[] = [',1).rstrip()[:-3]+'];\nexport const curriculum: Lesson[] = [...foundations, ...themedLessons];\n';f.write_text(s)
f=p/'src/reader/app.ts';s=f.read_text();s=s.replace(r"s.replace(/^\d+\.\d+\s*/, '')",r"s.replace(/^(?:\d+|[A-C])\.\d+\s*(?:·\s*)?/, '')");s=s.replace('수학에서 한 픽셀까지','질문에서 이해까지');f.write_text(s)
print('Applied contextual typing and chapter-title corrections; no textbook data changed.')
