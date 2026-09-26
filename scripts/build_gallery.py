"""Create a static image index at publish time; no browser API requests."""
import json
import re
from pathlib import Path
from urllib.parse import quote
ROOT = Path(__file__).resolve().parents[1]
EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'}
def natural(path):
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r'(\d+)', path.name)]
def images(folder):
    directory = ROOT / 'assets' / 'images' / folder
    files = sorted((p for p in directory.iterdir() if p.is_file() and p.suffix.lower() in EXTENSIONS), key=natural) if directory.exists() else []
    return [quote(p.relative_to(ROOT).as_posix(), safe='/') for p in files]
def build():
    gallery = {f'series-{n:02}': images(f'series-{n:02}') for n in range(1, 6)}
    for n in (1, 2):
        directory = ROOT / 'assets/images/singles'
        files = sorted((p for p in directory.iterdir() if p.is_file() and p.suffix.lower() in EXTENSIONS and p.stem in (str(n), f'{n:02}')), key=natural) if directory.exists() else []
        if len(files) > 1:
            raise ValueError(f'Duplicate single {n}: keep only one image with this number.')
        gallery[f'single-{n:02}'] = [quote(p.relative_to(ROOT).as_posix(), safe='/') for p in files]
    (ROOT/'gallery.js').write_text('window.GALLERY = '+json.dumps(gallery, ensure_ascii=False)+';\n', encoding='utf-8')
    print('Gallery:', {key:len(value) for key,value in gallery.items()})
if __name__ == '__main__':
    build()
