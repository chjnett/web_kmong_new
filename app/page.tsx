'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactDialog from '@/components/contact-dialog';
import { viewpoints } from '@/data/showroom';
import { projects } from '@/data/projects';
const Showroom3D = dynamic(() => import('@/components/showroom-3d'), { ssr: false, loading: () => <div className="viewer-fallback">3D 공간을 준비하고 있습니다…</div> });
const navigation = [['프로젝트', '#projects'], ['스튜디오', '#studio'], ['3D 쇼룸', '#showroom'], ['진행 과정', '#process']];
const steps = [
 { number: '01', title: '상담과 현장 실측', en: 'CONSULTATION', text: '생활 방식과 예산, 입주 일정을 듣고 현장을 실측합니다. 구조 변경 범위와 공정별 견적은 함께 검토합니다.', duration: '상담 · 실측 / 1–2주' },
 { number: '02', title: '평면 계획과 3D 설계', en: 'DESIGN & 3D', text: '평면 계획과 마감재 샘플, 조명 배치를 검토합니다. 3D 공간에서 동선과 비례를 확인한 뒤 실시설계를 확정합니다.', duration: '설계 · 소재 협의 / 4–6주' },
 { number: '03', title: '공정별 시공과 현장 관리', en: 'CONSTRUCTION', text: '철거부터 설비, 전기, 목공, 마감 순으로 시공합니다. 현장 담당자가 주간 공정과 변경 사항을 알려드립니다.', duration: '현장 시공 / 8–12주' },
 { number: '04', title: '준공 검수와 하자 점검', en: 'AFTERCARE', text: '준공 체크리스트에 따라 마감을 검수하고 사용 안내를 드립니다. 입주 후에도 하자를 접수하고 정기 점검을 진행합니다.', duration: '준공 검수 · A/S / 12개월' },
];
export default function Home() {
 const root = useRef<HTMLElement>(null);
 const video = useRef<HTMLVideoElement>(null);
 const wantsPlayback = useRef(true);
 const projectDialog = useRef<HTMLDialogElement>(null);
 const tabs = useRef<(HTMLButtonElement | null)[]>([]);
 const [scrolled, setScrolled] = useState(false);
 const [menu, setMenu] = useState(false);
 const [contact, setContact] = useState(false);
 const [playing, setPlaying] = useState(true);
 const [view, setView] = useState(0);
 const [viewerActive, setViewerActive] = useState(false);
 const [selectedProject, setSelectedProject] = useState<typeof projects[number] | null>(null);
 useEffect(() => {
  const scroll = () => setScrolled(window.scrollY > 48); scroll(); window.addEventListener('scroll', scroll, { passive: true });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) { video.current?.pause(); setPlaying(false); }
  gsap.registerPlugin(ScrollTrigger);
  const context = gsap.context(() => {
   if (!reduced.matches) gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => gsap.from(element, { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } }));
  }, root);
  return () => { window.removeEventListener('scroll', scroll); context.revert(); };
 }, []);
 useEffect(() => {
  const el = video.current; if (!el) return;
  let inView = true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) wantsPlayback.current = false;
  const syncPlayback = () => { if (!document.hidden && inView && wantsPlayback.current) el.play().catch(() => setPlaying(false)); else el.pause(); };
  const observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; syncPlayback(); }, { threshold: .05 });
  observer.observe(el); document.addEventListener('visibilitychange', syncPlayback); syncPlayback();
  return () => { observer.disconnect(); document.removeEventListener('visibilitychange', syncPlayback); };
 }, []);
 useEffect(() => { const dialog = projectDialog.current; if (selectedProject && dialog && !dialog.open) dialog.showModal(); }, [selectedProject]);
 useEffect(() => { if (!menu) return; const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenu(false); }; document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close); }, [menu]);
 function toggleVideo() { const el = video.current; if (!el) return; wantsPlayback.current = el.paused; if (el.paused) el.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); else { el.pause(); setPlaying(false); } }
 function closeProject() { projectDialog.current?.close(); setSelectedProject(null); }
 const currentView = viewpoints[view];
 return <main ref={root}>
  <a className="skip-link" href="#studio">본문으로 건너뛰기</a>
  <header className={`navbar ${scrolled ? 'scrolled' : ''} ${menu ? 'menu-open' : ''}`}>
   <a className="wordmark" href="#top" aria-label="아틀리에 에어로 홈">ATELIER AERO<span>INTERIOR ARCHITECTURE</span></a>
   <nav className="desktop-nav" aria-label="주요 메뉴">{navigation.map(([label, link]) => <a href={link} key={link}>{label}</a>)}</nav>
   <button className="nav-contact" onClick={() => setContact(true)}>견적 문의 <span>↗</span></button>
   <button className="menu-button" aria-label={menu ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(!menu)}>{menu ? '닫기 −' : '메뉴 +'}</button>
   {menu && <nav id="mobile-nav" className="mobile-nav" aria-label="모바일 메뉴">{navigation.map(([label, link]) => <a href={link} key={link} onClick={() => setMenu(false)}>{label}<span>↗</span></a>)}<button onClick={() => { setMenu(false); setContact(true); }}>무료 견적 신청 <span>↗</span></button></nav>}
  </header>
  <section className="hero" id="top" aria-label="아틀리에 에어로 소개">
   <div className="hero-media"><video ref={video} autoPlay muted playsInline loop preload="metadata" poster="/images/hero-poster.jpg" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setPlaying(false)} aria-label="거실의 설계가 완성되는 인테리어 영상"><source src="/videos/hero-interior.mp4" type="video/mp4" /></video></div>
   <div className="hero-shade" />
   <div className="hero-content"><span className="eyebrow">A NEW PERSPECTIVE ON LIVING</span><h1>Spaces,<br /><em>with intention.</em></h1><div className="hero-copy"><h2>생활을 담고, 여백을 남기다.</h2><p>아틀리에 에어로의 고급 주거 리모델링.<br />당신의 일상에 맞춰 구조를 바꾸고 마지막 마감까지 살핍니다.</p><button className="button bronze" onClick={() => setContact(true)}>리모델링 상담하기 <span>↗</span></button></div></div>
   <div className="hero-bottom"><span>SEOUL, KOREA <span className="hero-dot">/</span> RESIDENTIAL DESIGN & BUILD</span><a href="#studio">SCROLL TO EXPLORE <span>↓</span></a><button className="video-control" onClick={toggleVideo} aria-label={playing ? '배경 영상 일시정지' : '배경 영상 재생'}>{playing ? 'Ⅱ' : '▷'}</button></div>
  </section>
  <section id="studio" className="studio section-wrap">
   <div className="section-label" data-reveal><span className="eyebrow">01 / OUR PHILOSOPHY</span><span className="label-caption">설계할 때 중요하게 보는 것</span></div>
   <div className="studio-main" data-reveal><h2>매일 걷는 동선부터<br />손이 닿는 소재까지.<br /><span>당신의 생활에 맞춰 설계합니다.</span></h2><div className="studio-bottom"><p>보여주기 위한 장식을 덜고 매일 닿는 것에 집중합니다.<br />걷는 동선과 손이 닿는 소재, 빛이 머무는 자리를 살핍니다.<br />설계는 당신의 생활을 이해하는 데서 시작합니다.</p><a className="text-link" href="#process">설계·시공 과정 보기 <span>↗</span></a></div></div>
   <div className="principles" data-reveal><div><span>01</span><h3>동선과 수납을 먼저</h3><p>동선과 수납, 가족의 생활 리듬을<br />평면 계획에 담습니다.</p></div><div><span>02</span><h3>질감과 내구성을 함께</h3><p>유행보다 질감과 내구성을 먼저 봅니다.<br />마감은 실물 샘플로 결정합니다.</p></div><div><span>03</span><h3>설계부터 준공 이후까지</h3><p>설계와 현장에 같은 기준을 적용합니다.<br />준공 이후에도 관리를 맡습니다.</p></div></div>
  </section>
  <section id="projects" className="portfolio section-wrap">
   <div className="section-top" data-reveal><div><span className="eyebrow">02 / SELECTED WORKS</span><h2 className="display-title">Selected <em>spaces.</em></h2></div><p>가족의 생활 방식에 맞춰 바꾼 세 개의 집.<br />면적과 마감재, 설계·시공 범위를 살펴보세요.</p></div>
   <div className="project-grid">{projects.map((project, index) => <article className={`project project-${index + 1}`} key={project.id} data-reveal><button className="project-image" onClick={() => setSelectedProject(project)} aria-label={`${project.korean} 시공 사례 자세히 보기`}><Image src={project.image} alt={`${project.korean} — 밝은 갤러리 스타일 주거 인테리어`} fill sizes={index === 0 ? '(max-width: 700px) 100vw, 90vw' : '(max-width: 700px) 100vw, 50vw'} /><span className="project-view">시공 사례 보기 <span>↗</span></span></button><div className="project-info"><div><span className="eyebrow">{project.number} / {project.type}</span><h3><button onClick={() => setSelectedProject(project)}>{project.title}</button></h3><p>{project.korean}</p></div><div className="project-meta"><span>{project.location}</span><span>{project.area} <span className="meta-slash">/</span> {project.year}</span></div></div></article>)}</div>
   <p className="portfolio-note">본 프로젝트는 포트폴리오 시연을 위한 가상의 시공 사례입니다.</p>
  </section>
  <section id="showroom" className="showroom-section">
   <div className="section-wrap"><div className="section-top" data-reveal><div><span className="eyebrow">03 / SPATIAL EXPERIENCE</span><h2 className="display-title">Before it <em>becomes real.</em></h2></div><p>도면에 담긴 공간을 먼저 살펴보세요.<br />시공 전 설계를 세 가지 시점으로 확인합니다.</p></div>
    <div className="showroom-layout"><div className="viewer" role="tabpanel" id="showroom-panel" aria-labelledby={`view-tab-${view}`} aria-label={`${currentView.title} 3D 공간`}>
     {viewerActive ? <Showroom3D view={view} /> : <><Image src="/images/showroom-poster.png" alt="갤러리 스타일 거실과 다이닝의 3D 공간 미리보기" fill sizes="(max-width: 900px) 100vw, 70vw" /><div className="viewer-cover"><button className="viewer-start" onClick={() => setViewerActive(true)}><span className="play-circle">▷</span><span>3D 공간 둘러보기<small>거실 · 다이닝 · 마감 디테일</small></span></button></div></>}
     <span className="viewer-label">ATELIER AERO / VIRTUAL RESIDENCE</span><span className="viewer-index">0{view + 1} / 03</span>
    </div><aside className="viewer-side"><div className="view-tabs" role="tablist" aria-label="3D 쇼룸 시점 선택">{viewpoints.map((point, index) => <button key={point.title} ref={el => { tabs.current[index] = el; }} id={`view-tab-${index}`} role="tab" aria-selected={view === index} tabIndex={view === index ? 0 : -1} aria-controls="showroom-panel" className={view === index ? 'active' : ''} onClick={() => setView(index)} onKeyDown={event => { let next = index; if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % 3; else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + 2) % 3; else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = 2; else return; event.preventDefault(); setView(next); tabs.current[next]?.focus(); }}><span>0{index + 1}</span>{point.title}<span className="tab-arrow">↗</span></button>)}</div><div className="view-description" aria-live="polite"><span className="eyebrow">{currentView.english}</span><h3>{currentView.subtitle}</h3><p>{currentView.description}</p><div className="material-note"><span>FINISH & MATERIAL</span><p>{currentView.material}</p></div></div><p className="viewer-hint">거실·다이닝·마감 디테일을 선택해 살펴보세요.<br />3D 모델은 공간 배치와 마감을 보여주는 설계 예시입니다.</p></aside></div>
   </div>
  </section>
  <section id="process" className="process section-wrap"><div className="section-top" data-reveal><div><span className="eyebrow">04 / HOW WE WORK</span><h2 className="display-title">Every detail.<br /><em>Every step.</em></h2></div><p>상담, 설계, 시공, 입주 후 점검.<br />각 단계에서 무엇을 확인하는지 안내합니다.</p></div><div className="process-steps">{steps.map(step => <article key={step.number} data-reveal><div className="step-heading"><span className="step-number">{step.number}</span><span className="eyebrow">{step.en}</span></div><h3>{step.title}</h3><p>{step.text}</p><span className="step-duration">{step.duration}</span></article>)}</div><p className="process-note">설계·시공 기간은 면적과 공사 범위, 현장 여건에 따라 조정됩니다.</p></section>
  <section className="trust section-wrap"><div className="section-label" data-reveal><span className="eyebrow">05 / LIVED EXPERIENCE</span><span className="label-caption">입주 후 고객의 이야기</span></div><div className="review" data-reveal><span className="quote-mark">“</span><blockquote>예쁜 집보다,<br />우리에게 맞는 집이 되었습니다.</blockquote><p>주방에서 아이가 노는 거실까지 한눈에 보이는 동선,<br />생활 물건이 제자리를 찾는 수납.<br />살아볼수록 설계할 때 나눴던 대화가 떠올라요.</p><div className="review-person"><span>한남동 62평 주거 리모델링</span><span>김○○ 고객 / 2025.06</span></div></div><div className="trust-stats" data-reveal><div><strong>38<span>spaces</span></strong><p>주거 리모델링 프로젝트</p></div><div><strong>92<span>%</span></strong><p>상담 고객 만족도</p></div><div><strong>12<span>months</span></strong><p>준공 이후 무상 하자 점검</p></div></div><p className="trust-note">프로젝트 수, 만족도 및 후기는 포트폴리오용 더미 데이터입니다.</p></section>
  <section className="final-cta" id="contact"><div className="section-wrap" data-reveal><span className="eyebrow">YOUR SPACE, OUR NEXT STORY</span><h2>리모델링 계획,<br /><em>함께 정리해 보세요.</em></h2><div className="final-cta-bottom"><p>지금의 공간에서 바꾸고 싶은 점과 바라는 일상을 알려주세요.<br />계획이 아직 구체적이지 않아도 함께 정리해 드립니다.</p><button className="button bronze" onClick={() => setContact(true)}>무료 견적 상담 신청 <span>↗</span></button></div></div></section>
  <footer className="footer section-wrap"><div className="footer-main"><a className="footer-wordmark" href="#top">ATELIER AERO<span>공간에 새로운 시선을.</span></a><div className="footer-details"><span>INTERIOR ARCHITECTURE & DESIGN</span><p>서울특별시 용산구 한남대로 42길 18, 2F<br />MON — FRI / 10:00 — 18:00</p><button className="text-link" onClick={() => setContact(true)}>방문 상담 예약 <span>↗</span></button></div><a className="back-top" href="#top">BACK TO TOP ↑</a></div><div className="footer-bottom"><span>© 2026 ATELIER AERO. ALL RIGHTS RESERVED.</span><span>포트폴리오 시연 사이트 · 브랜드 및 사업장 정보는 가상입니다.</span></div></footer>
  <ContactDialog open={contact} onClose={() => setContact(false)} />
  <dialog ref={projectDialog} className="project-dialog" aria-labelledby="project-title" onCancel={() => setSelectedProject(null)} onClose={() => setSelectedProject(null)} onClick={event => { if (event.target === event.currentTarget) closeProject(); }}>{selectedProject && <><button className="close-button" onClick={closeProject} aria-label="프로젝트 닫기">×</button><div className="project-detail-image"><Image src={selectedProject.image} alt={selectedProject.korean} fill sizes="90vw" /></div><div className="project-detail-content"><span className="eyebrow">{selectedProject.type} / {selectedProject.year}</span><h2 id="project-title">{selectedProject.korean}</h2><p>{selectedProject.description}</p><dl><div><dt>LOCATION</dt><dd>{selectedProject.location}</dd></div><div><dt>AREA</dt><dd>{selectedProject.area}</dd></div><div><dt>MATERIAL</dt><dd>{selectedProject.materials}</dd></div><div><dt>PERIOD</dt><dd>{selectedProject.period}</dd></div></dl><button className="button dark" onClick={() => { closeProject(); setContact(true); }}>이 시공 사례로 상담하기 <span>↗</span></button><p className="detail-note">가상의 시공 사례입니다. 이미지는 설계 분위기를 보여주는 시각화 예시입니다.</p></div></>}</dialog>
 </main>;
}
