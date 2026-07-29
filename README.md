# Second Brain — Career Vault

**Local web app for managing your profile, skills, experience, projects, and resume DOCX export.**

- **Location:** `C:\Users\eazyboytt\second-brain\`
- **Data file:** `C:\Users\eazyboytt\second-brain\data.json`
- **Stack:** Flask 3.1 + python-docx 1.2 + Jinja2 templates
- **Python:** 3.11 (venv at `.venv/`)

---

## Quick Start

```powershell
cd C:\Users\eazyboytt\second-brain
.venv\Scripts\python.exe app.py
```

Then open: **http://127.0.0.1:5678**

### If dependencies were ever lost
```powershell
cd C:\Users\eazyboytt\second-brain
uv venv
uv pip install flask python-docx
```

---

## Pages / Routes

| Route | Description |
|---|---|
| `/` | Dashboard — counts, quick actions |
| `/profile` | Name, title, company, email, phone, location, summary |
| `/skills` | Skills list with level + evidence |
| `/experience` | Work history + achievements |
| `/projects` | Projects with impact + tech stack |
| `/resume` | Resume preview + download DOCX |
| `/api/resume/docx` | DOCX export endpoint |

---

## Data Model (`data.json`)

```json
{
  "profile": {
    "name": "Jhansi Yeoj Gatus",
    "title": "IT Support",
    "company": "PRTNA Outsourcing Corporation (StrataStaff)",
    "phone": "+63",
    "location": "Philippines",
    "summary": "...",
    "target_roles": ["IT Support", "Help Desk Engineer", "Systems Administrator"]
  },
  "skills": [
    {"name": "...", "level": "Advanced|Intermediate|Beginner", "evidence": "...", "last_used": "YYYY-MM"}
  ],
  "experience": [
    {"company": "...", "role": "...", "start": "YYYY-MM", "end": null, "location": "...", "achievements": [...], "tech": [...]}
  ],
  "projects": [
    {"title": "...", "date": "...", "impact": "...", "tech": [...], "description": "..."}
  ],
  "education": [
    {"school": "...", "degree": "...", "field": "...", "start": "...", "end": "..."}
  ]
}
```

---

## Current Seeds (from chat history)

### Skills
- Microsoft 365 / Exchange — Advanced
- Windows Administration — Advanced
- VPN & Remote Access — Advanced
- Hardware Troubleshooting — Intermediate
- Networking — Intermediate
- ServiceNow / Ticketing — Intermediate
- Application Support — Intermediate
- Automation / Scripting — Beginner
- Python — Beginner

### Experience
- **PRTNA Outsourcing Corporation (StrataStaff)** — IT Support (2025-01 → Present)
  - 15+ concurrent tickets across Marisol / San Fernando
  - M365 migration support (mailbox, OneDrive, broken links)
  - VPN onboarding (OpenVPN, GlobalProtect, RDP)
  - Hardware triage (headsets, monitors, keyboards)

### Projects
- M365 Migration & Access Remediation (2026-06)
- VPN Onboarding for Remote Work (2026-04)
- Ticket Operations Hygiene (ongoing)

---

## Editing Data

Edit `data.json` directly — the app reloads on every request, so changes are live immediately. No restart needed.

### Adding a new skill
```json
{"name": "Skill Name", "level": "Intermediate", "evidence": "Brief proof", "last_used": "2026-07"}
```

### Adding a new experience entry
```json
{"company": "Company", "role": "Role", "start": "YYYY-MM", "end": null, "location": "...", "achievements": ["..."], "tech": [...]}
```

---

## Resume DOCX Export

- Header: Name, title, company, location, email, phone
- Sections: Summary, Skills (table), Experience, Projects, Education
- Trigger: `/resume` page → download DOCX
- Generated with `python-docx`, in-memory zip, no temp files

---

## Backups

Recommended backup locations (pick one):
- `C:\Users\eazyboytt\OneDrive - Strata Staff\backups\second-brain-data.json`
- External USB / Google Drive
- Git repo if you want version history

To back up now:
```powershell
Copy-Item "C:\Users\eazyboytt\second-brain\data.json" "C:\Users\eazyboytt\OneDrive - Strata Staff\backups\second-brain-data.json"
```

---

## Notes

- App is **local-only** by design — no cloud sync, no auth
- Change port in `app.py` line `app.run(host="127.0.0.1", port=5678, ...)`
- Dark theme via CSS custom properties — easy to reskin in `static/css/style.css`
- Auto-add new skills discovered in conversation to `data.json`

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| "Module not found" | `.venv\Scripts\python.exe` not used; activate venv first |
| Port 5678 busy | Change `port=5678` in `app.py` to another port |
| Blank page | Check browser console / refresh; app may have crashed on bad JSON in `data.json` |
| DOCX download fails | Ensure `python-docx` installed in venv |
