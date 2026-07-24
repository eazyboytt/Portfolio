from pathlib import Path
import json
from jinja2 import Environment, FileSystemLoader, select_autoescape

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

for template_name, output_name in routes.items():
    env.globals['template_name'] = template_name
    template = env.get_template(template_name)
    html = template.render(data=data, p=p)
    out = DOCS / output_name
    out.write_text(html, encoding='utf-8')
    print(f'rendered {template_name} -> {out}')

# Ensure docs/index.html exists for GitHub Pages root
index = DOCS / 'index.html'
if not index.exists():
    raise SystemExit('Missing docs/index.html')

print('Static site build complete.')
