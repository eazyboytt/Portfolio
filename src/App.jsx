import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight, BriefcaseBusiness, Cloud, Globe, Headset, KeyRound, Network, ShieldCheck, Terminal, Waypoints, Code2, FolderKanban, House, Info, Link, Mail, MapPin, Menu, Moon, Sparkles, Sun, UserRound, X } from 'lucide-react'
import data from '../data.json'
import { Badge, Button, Card, Tabs } from './components/ui'
import LiveBackground from './components/LiveBackground'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const skillIcons = { Network, Waypoints, ShieldCheck, KeyRound, Cloud, Terminal, Headset, Globe }
const nav = ['Home', 'About', 'Skills', 'Experience', 'Projects', 'Certifications']
const toId = label => label.toLowerCase()
const formatRoleDate = value => value.startsWith('2024') ? '2024' : value.replaceAll(' - ', '.')

function MobileTabs({ activeTab, onChange, moreOpen, setMoreOpen }) {
  const tabs = [[ 'home', 'Home', House ], [ 'about', 'About', Info ], [ 'skills', 'Skills', Sparkles ], [ 'experience', 'Work', UserRound ], [ 'projects', 'Projects', FolderKanban ]]
  return <><div className="mobile-tabs" role="tablist" aria-label="Portfolio sections">{tabs.map(([id, label, Icon]) => <button key={id} className={activeTab === id ? 'active' : ''} role="tab" aria-selected={activeTab === id} onClick={() => onChange(id)}><Icon size={19}/><span>{label}</span></button>)}<button className={moreOpen || activeTab === 'certifications' ? 'active' : ''} role="tab" aria-selected={moreOpen || activeTab === 'certifications'} onClick={() => setMoreOpen(true)}><Menu size={19}/><span>More</span></button></div>{moreOpen && <div className="more-sheet-backdrop" onClick={() => setMoreOpen(false)}><section className="more-sheet" role="dialog" aria-modal="true" aria-label="More sections" onClick={event => event.stopPropagation()}><div className="sheet-handle"/><p className="eyebrow">MORE</p><button onClick={() => { onChange('certifications'); setMoreOpen(false) }}>Certifications <span>→</span></button><button onClick={() => { onChange('home'); setMoreOpen(false) }}>Back to home <span>↑</span></button></section></div>}</>
}

function Header() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light')
  const [open, setOpen] = useState(false)
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('theme', dark ? 'dark' : 'light') }, [dark])
  const [active, setActive] = useState('home')
  useEffect(() => {
    const els = nav.map(item => document.getElementById(toId(item))).filter(Boolean)
    const io = new IntersectionObserver(entries => { const hit = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]; if (hit) setActive(hit.target.id) }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .25, .5, 1] })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
  const scroll = item => { document.getElementById(toId(item))?.scrollIntoView({ behavior: 'smooth' }); setOpen(false) }
  return <header className="header"><a className="brand" href="#home" onClick={() => scroll('Home')}>JG<span>.</span></a><nav className={open ? 'nav open' : 'nav'}>{nav.map(item => <button key={item} className={active === toId(item) ? 'active' : ''} aria-current={active === toId(item) ? 'true' : undefined} onClick={() => scroll(item)}>{item}</button>)}</nav><div className="header-actions"><button className={`theme-switch ${dark ? 'is-dark' : ''}`} type="button" aria-label="Toggle theme" aria-pressed={dark} onClick={() => setDark(!dark)}><span className="theme-thumb"><Sun className="theme-sun" size={15}/><Moon className="theme-moon" size={14}/></span></button><Button className="menu" variant="ghost" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X size={20}/> : <Menu size={20}/>}</Button></div></header>
}

function SectionHeading({ eyebrow, title, detail }) { return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{detail && <p className="section-detail">{detail}</p>}</div> }

export default function App() {
  const { profile, skills, experience, projects, certifications = [], education = [] } = data
  const [filter, setFilter] = useState('All')
  const [activeMobileTab, setActiveMobileTab] = useState('home')
  const [moreOpen, setMoreOpen] = useState(false)
  const filters = ['All', ...Array.from(new Set(projects.flatMap(item => item.tech))).slice(0, 5)]
  const shownProjects = useMemo(() => filter === 'All' ? projects : projects.filter(item => item.tech.includes(filter)), [filter, projects])
  const mainRef = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    // Desktop/tablet only: on phones the sections are tab panels, and reduced-motion users get no movement.
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      document.documentElement.classList.add('js-gsap')
      const q = gsap.utils.selector(mainRef)
      const ease = 'power3.out'

      // Hero intro
      gsap.timeline({ defaults: { ease, duration: 1 } })
        .from(document.querySelector('.header'), { y: -40, opacity: 0, duration: .8 }, 0)
        .from(q('.hero .eyebrow, .hero h1, .hero .lede, .hero .actions'), { x: -70, opacity: 0, stagger: .12 }, .1)
        .fromTo(q('.portrait-card'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut', clearProps: 'clipPath' }, .2)
        .fromTo(q('.portrait-card img'), { scale: 1.3 }, { scale: 1.1, duration: 1.8, ease: 'power3.out' }, .2)
        .from(q('.availability'), { y: 18, scale: .85, opacity: 0, duration: .7, ease: 'back.out(1.6)' }, 1.3)
      gsap.fromTo(q('.portrait-card img'), { yPercent: 4 }, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: q('.hero')[0], start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to(q('.status-dot'), { scale: 1.6, opacity: .45, duration: 1.1, ease: 'sine.inOut', repeat: -1, yoyo: true })

      // Section headings and top-level blocks slide in from the left
      gsap.utils.toArray(q('.section-heading, .about-grid > p, .proof-strip, .contact-strip, .cta')).forEach(el => {
        gsap.from(el, { x: -90, opacity: 0, duration: 1, ease, scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      })
      gsap.from(q('.role-list > div'), { x: 90, opacity: 0, duration: .9, ease, stagger: .1, scrollTrigger: { trigger: q('.role-list')[0], start: 'top 88%', once: true } })

      // Cards slide in from alternating sides, batched so they stagger as they enter
      const cards = q('.skill-group, .role-card, .project-card, .cert-grid .card, .tabs')
      gsap.set(cards, { opacity: 0 })
      ScrollTrigger.batch(cards, {
        start: 'top 90%',
        once: true,
        onEnter: batch => batch.forEach((el, i) => gsap.fromTo(el, { x: i % 2 ? 90 : -90, opacity: 0 }, { x: 0, opacity: 1, duration: .9, ease, delay: i * .1, clearProps: 'transform' }))
      })
      // Experience sub-groups slide up as the card settles
      gsap.from(q('.role-groups > div'), { y: 40, opacity: 0, duration: .8, ease, stagger: .12, scrollTrigger: { trigger: q('.role-groups')[0], start: 'top 85%', once: true } })

      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh)
      return () => { document.documentElement.classList.remove('js-gsap'); window.removeEventListener('load', refresh) }
    })
  }, { scope: mainRef })
  // Phones: sections are tab panels, so animate the visible panel in whenever the tab changes
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
      document.documentElement.classList.add('js-gsap')
      window.scrollTo(0, 0)
      const root = mainRef.current
      const panels = [...root.querySelectorAll('.mobile-panel')].filter(p => getComputedStyle(p).display !== 'none')
      const ease = 'power3.out'
      const text = panels.flatMap(p => [...p.querySelectorAll('.eyebrow, .hero h1, .lede, .actions, .section-heading, .about-grid > p, .role-list > div, .proof-strip > div, .contact-strip, .cta > *, .tabs')])
      const cards = panels.flatMap(p => [...p.querySelectorAll('.skill-group, .role-card, .project-card, .cert-grid .card, .portrait-card')])
      gsap.from(text, { y: 30, x: -24, opacity: 0, duration: .75, ease, stagger: .06, clearProps: 'transform,opacity' })
      gsap.set(cards, { opacity: 0 })
      ScrollTrigger.batch(cards, {
        start: 'top 94%',
        once: true,
        onEnter: batch => batch.forEach((el, i) => gsap.fromTo(el, { x: i % 2 ? 48 : -48, y: 18, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: .8, ease, delay: i * .09, clearProps: 'transform' }))
      })
      return () => { document.documentElement.classList.remove('js-gsap') }
    })
  }, { scope: mainRef, dependencies: [activeMobileTab], revertOnUpdate: true })
  return <><LiveBackground /><Header /><main ref={mainRef} className={`mobile-active-${activeMobileTab}`}>
    <section id="home" className="hero mobile-panel mobile-home"><div className="hero-copy"><p className="eyebrow">IT SUPPORT · PHILIPPINES</p><h1>Reliable systems.<br/><em>Calmer teams.</em></h1><p className="lede">{profile.summary}</p><div className="actions"><a className="button button-default" href={`mailto:${profile.email}`}>Let’s talk <ArrowUpRight size={17}/></a><Button variant="outline" onClick={() => document.getElementById('projects').scrollIntoView({behavior:'smooth'})}>View selected work</Button></div></div><Card className="portrait-card"><div className="portrait-glow"/><img className="portrait-dark" src="/static/images/profile-portrait-theme-current.webp" alt={`Portrait of ${profile.name}`}/><img className="portrait-light" src="/static/images/profile-portrait-light-theme.webp" alt="" aria-hidden="true"/><div className="availability"><span className="status-dot"/> Available for opportunities</div></Card></section>
    <section className="proof-strip mobile-panel mobile-home" aria-label="Highlights">{[['Multi-site SDN', 'TP-Link Omada'], ['Microsoft 365 & Azure', 'Exchange, identity, access'], ['PowerShell automation', 'Scripted migrations'], [`Since ${experience[0].start.slice(0, 4)}`, 'Hands-on IT support']].map(([title, sub]) => <div key={title}><strong>{title}</strong><span>{sub}</span></div>)}</section>
    <section className="contact-strip mobile-panel mobile-home" aria-label="Contact details"><a href={`mailto:${profile.email}`}><Mail/> <span><small>Email</small>{profile.email}</span></a><span><MapPin/> <span><small>Location</small>{profile.location}</span></span><span className="socials"><a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><Link size={18}/><span>LinkedIn</span></a><a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub profile"><Code2 size={18}/><span>GitHub</span></a></span></section>
    <section id="about" className="section about mobile-panel mobile-about"><SectionHeading eyebrow="01 / ABOUT" title="The person behind the support."/><div className="about-grid"><p>I turn complex infrastructure into reliable, day-to-day operations. My approach is practical: resolve the immediate issue, then build the process and documentation that keeps it from coming back.</p><div className="role-list">{profile.target_roles.map(role => <div key={role}><span>✦</span>{role}</div>)}</div></div></section>
    <section id="skills" className="section mobile-panel mobile-skills"><SectionHeading eyebrow="02 / CAPABILITIES" title="Tools I use to keep work moving."/><div className="skills-grid skill-groups">{skills.map((skill, i) => <Card key={skill.name} className="skill-group"><div className="skill-top"><span className="skill-icon">{(() => { const Icon = skillIcons[skill.icon] || Network; return <Icon size={20} aria-hidden="true"/> })()}</span><span className="skill-number">{String(i + 1).padStart(2,'0')}</span></div><h3>{skill.name}</h3><p>{skill.summary}</p><div className="tag-list">{skill.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}</div></Card>)}</div></section>
    <section id="experience" className="section mobile-panel mobile-experience"><SectionHeading eyebrow="03 / EXPERIENCE" title="Where I’ve made an impact." detail={`${experience.length} role${experience.length === 1 ? '' : 's'}`}/><div className="timeline">{experience.map(role => <Card className="role-card" key={`${role.company}${role.role}`}><div className="role-header"><div><h3>{role.role}</h3><p>{role.company} · {role.location}</p></div><Badge>{formatRoleDate(role.start)} – {(role.end || 'PRESENT').toUpperCase()}</Badge></div><div className="role-groups">{role.groups.map(group => <div key={group.title}><h4>{group.title}</h4><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></div>)}</div><div className="tag-list">{role.tech.map(tech => <Badge key={tech}>{tech}</Badge>)}</div></Card>)}</div></section>
    <section id="projects" className="section mobile-panel mobile-projects"><SectionHeading eyebrow="04 / SELECTED WORK" title="Projects with practical outcomes." detail={`${projects.length} projects`}/><Tabs tabs={filters} value={filter} onChange={setFilter}/><div className="projects-grid">{shownProjects.map(project => <Card className="project-card" key={project.title}><div className="project-top"><span className="project-icon"><BriefcaseBusiness size={19}/></span><span>{project.date}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="impact"><strong>Impact</strong>{project.impact}</div><div className="tag-list">{project.tech.map(tech => <Badge key={tech}>{tech}</Badge>)}</div></Card>)}</div></section>
    <section id="certifications" className="section mobile-panel mobile-certifications"><SectionHeading eyebrow="05 / CREDENTIALS" title="Education & training."/><div className="cert-grid">{certifications.length ? certifications.map(c => <Card key={c.name}><h3>{c.name}</h3><p>{c.issuer}</p></Card>) : <Card className="empty"><p>Certifications are being curated. In the meantime, explore the experience and project work above.</p></Card>}</div>{education.length > 0 && <div className="cert-grid edu-grid">{education.map(e => <Card key={e.degree}><h3>{e.degree}</h3><p>{e.school} · {e.start}–{e.end}</p></Card>)}</div>}</section>
    <section className="cta mobile-panel mobile-home"><p className="eyebrow">GET IN TOUCH</p><h2>Let’s make technology<br/><em>feel dependable.</em></h2><a className="button button-light" href={`mailto:${profile.email}?subject=${encodeURIComponent('Portfolio enquiry')}`}>Send an email <Mail size={17}/></a></section>
  </main><footer><span>© {new Date().getFullYear()} {profile.name}</span><a href="#home">Back to top ↑</a></footer><MobileTabs activeTab={activeMobileTab} onChange={setActiveMobileTab} moreOpen={moreOpen} setMoreOpen={setMoreOpen}/></>
}
