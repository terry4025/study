#!/usr/bin/env python3
"""Install a checked local translation data bundle. Never changes app source or Git."""
from __future__ import annotations
import argparse, hashlib, json, re, shutil, tempfile
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath
DEST=Path('public/books/pbrt-4ed/native')
BACKUPS='.study-native-backups'
def digest(path:Path)->str:
    h=hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda:stream.read(1024*1024),b''):h.update(chunk)
    return h.hexdigest()
def inventory(folder:Path)->dict[str,str]:
    result={}
    for path in folder.rglob('*'):
        if path.is_symlink():raise ValueError('Symbolic link refused: '+str(path))
        if path.is_file():result[path.relative_to(folder).as_posix()]=digest(path)
    return result
def check_paths(root:Path,relative:Path)->None:
    path=root
    for part in relative.parts:
        path/=part
        if path.is_symlink():raise ValueError('Symbolic link refused: '+str(path))
def bundle_manifest(bundle:Path)->dict:
    m=json.loads((bundle/'manifest.json').read_text(encoding='utf-8'))
    if m.get('schema')!=1 or m.get('bookId')!='pbrt-4ed' or not isinstance(m.get('files'),dict):raise ValueError('Unsupported bundle manifest')
    if not 1<=len(m['files'])<=5000:raise ValueError('Invalid file count')
    seen=set()
    for name,sha in m['files'].items():
        p=PurePosixPath(name)
        if p.is_absolute() or '..' in p.parts or '\\' in name or ':' in name or not re.fullmatch(r'[A-Za-z0-9_./-]+',name) or name.lower() in seen or not re.fullmatch(r'[0-9a-f]{64}',str(sha)):raise ValueError('Unsafe or duplicate manifest path: '+name)
        seen.add(name.lower())
    if inventory(bundle/'native')!=m['files']:raise ValueError('Bundle is incomplete or has changed')
    return m
def ensure_project(project:Path)->None:
    for p,marker in [('src/App.tsx','attachNativeTranslations'),('src/reader/native.ts','attachNativeTranslations')]:
        f=project/p
        if not f.is_file() or marker not in f.read_text(encoding='utf-8'):raise ValueError('Update the study repository to the native-reader commit first: '+p)
    check_paths(project,DEST);check_paths(project,Path(BACKUPS))
def install(project:Path,bundle:Path,apply:bool=False,verify:bool=False)->dict:
    ensure_project(project);m=bundle_manifest(bundle);target=project/DEST
    if target.exists() and not target.is_dir():raise ValueError('Target is not a directory')
    current=inventory(target) if target.exists() else None
    same=current==m['files']
    if verify:
        if not same:raise ValueError('Installed translation data differs from bundle')
        return {'verified':True,'files':len(m['files'])}
    if same:return {'changed':False,'message':'Already installed','files':len(m['files'])}
    if not apply:return {'dryRun':True,'target':str(target),'files':len(m['files']),'willBackup':current is not None}
    backup=project/BACKUPS/datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
    backup.mkdir(parents=True,exist_ok=False)
    journal={'schema':1,'target':DEST.as_posix(),'previous':current,'installed':m['files']}
    (backup/'journal.json').write_text(json.dumps(journal,indent=2),encoding='utf-8')
    target.parent.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='.native-stage-',dir=project) as temporary:
        staged=Path(temporary)/'native';shutil.copytree(bundle/'native',staged)
        if inventory(staged)!=m['files']:raise ValueError('Staged copy failed verification')
        had_previous=target.exists()
        if had_previous:target.rename(backup/'previous')
        try:staged.rename(target)
        except BaseException:
            if had_previous and not target.exists():(backup/'previous').rename(target)
            raise
    return {'changed':True,'files':len(m['files']),'backup':str(backup),'restoreId':backup.name}
def restore(project:Path,restore_id:str)->dict:
    ensure_project(project)
    if not re.fullmatch(r'\d{8}T\d{12}Z',restore_id):raise ValueError('Invalid restore ID')
    backup=project/BACKUPS/restore_id;check_paths(project,Path(BACKUPS)/restore_id)
    journal=json.loads((backup/'journal.json').read_text(encoding='utf-8'))
    if journal.get('target')!=DEST.as_posix():raise ValueError('Unexpected restore target')
    target=project/DEST
    if inventory(target)!=journal['installed']:raise ValueError('Installed files changed; refusing to overwrite them')
    previous=backup/'previous'
    if journal['previous'] is not None and inventory(previous)!=journal['previous']:raise ValueError('Backup differs from saved inventory')
    retained=backup/'replaced-installation'
    if retained.exists():raise ValueError('This restore has already been used')
    target.rename(retained)
    try:
        if journal['previous'] is not None:previous.rename(target)
    except BaseException:
        retained.rename(target);raise
    return {'restored':True,'retainedInstallation':str(retained)}
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('project',type=Path);p.add_argument('--bundle',type=Path,default=Path(__file__).resolve().parent)
    group=p.add_mutually_exclusive_group();group.add_argument('--apply',action='store_true');group.add_argument('--verify',action='store_true');group.add_argument('--restore')
    args=p.parse_args()
    try:
        project=args.project.expanduser().absolute()
        if project.is_symlink():raise ValueError('Symbolic project root refused')
        result=restore(project,args.restore) if args.restore else install(project,args.bundle.expanduser().resolve(),args.apply,args.verify)
        print(json.dumps(result,ensure_ascii=False,indent=2))
    except (ValueError,OSError,KeyError,TypeError) as error:p.exit(1,'Stopped without discarding existing data: '+str(error)+'\n')
if __name__=='__main__':main()
