from pathlib import Path
import json
import re
import sys
from jinja2 import Environment, FileSystemLoader, select_autoescape

sys.path.insert(0, str(Path('C:/Users/eazyboytt/second-brain')))
from app import build_resume_docx_bytes

ROOT = Path('C:/Users/eazyboytt/second-brain')
DOCS = ROOT / 'docs'
TEMPLATES = ROOT / 'templates'
STATIC = ROOT / 'static'
DATA_FILE = ROOT / 'data.json'

# Clean docs
if DOCS.exists():
    for f in DOCS.rglob('*'):
        if f.is_file():
            f.unlink()
    for f in sorted(DOCS.rglob('*'), reverse=True):
        if f.is_dir() and not any(f.iterdir()):
            f.rmdir()
DOCS.mkdir(exist_ok=True)

# Copy static assets
static_dest = DOCS / 'static'
if static_dest.exists():
    for f in static_dest.rglob('*'):
        if f.is_file():
            f.unlink()
    for f in sorted(static_dest.rglob('*'), reverse=True):
        if f.is_dir() and not any(f.iterdir()):
            f.rmdir()
if STATIC.exists():
    import shutil
    shutil.copytree(STATIC, static_dest)

# Load data
with open(DATA_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)
p = data.get('profile', {})

env = Environment(
    loader=FileSystemLoader(str(TEMPLATES)),
    autoescape=select_autoescape(['html', 'xml'])
)
env.globals['now'] = __import__('datetime').datetime.now()
env.globals['template_name'] = ''

# Generate resume DOCX for static hosting
try:
    docx_bytes = build_resume_docx_bytes()
    (DOCS / 'resume.docx').write_bytes(docx_bytes.read())
    resume_docx_url = 'resume.docx'
except Exception as e:
    resume_docx_url = '#'
    print('DOCX build failed:', e)

# Make resume_docx_url available in all templates
env.globals['resume_docx_url'] = resume_docx_url

routes = {
    'dashboard.html': 'index.html',
    'about.html': 'about.html',
    'profile.html': 'profile.html',
    'skills.html': 'skills.html',
    'experience.html': 'experience.html',
    'projects.html': 'projects.html',
    'resume.html': 'resume.html',
    'certifications.html': 'certifications.html',
}

path_map = {
    '/': 'index.html',
    '/about': 'about.html',
    '/profile': 'profile.html',
    '/skills': 'skills.html',
    '/experience': 'experience.html',
    '/projects': 'projects.html',
    '/certifications': 'certifications.html',
    '/resume': 'resume.html',
}

for template_name, output_name in routes.items():
    env.globals['template_name'] = template_name
    template = env.get_template(template_name)
    html = template.render(data=data, p=p)
    # Rewrite nav hrefs to relative paths for GitHub Pages
    for abs_path, rel_name in path_map.items():
        html = html.replace(f'href="{abs_path}"', f'href="{rel_name}"')
    # Replace resume download link with static file when available
    if resume_docx_url != '#':
        html = html.replace('href="/api/resume/docx"', f'href="{resume_docx_url}"')
    else:
        html = html.replace('href="/api/resume/docx"', 'href="#"')
    out = DOCS / output_name
    out.write_text(html, encoding='utf-8')
    print(f'rendered {template_name} -> {out}')

index = DOCS / 'index.html'
if not index.exists():
    raise SystemExit('Missing docs/index.html')

print('Static site build complete.')
