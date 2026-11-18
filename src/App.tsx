import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  BookOpen,
  FlaskConical,
  Code2,
  Search,
  Lock,
  GitCompare,
  HelpCircle,
  Presentation,
  Terminal,
  Copy,
  Check,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  Database,
  Globe,
  Layers,
  GraduationCap,
  Compass,
  Crosshair,
  ListChecks,
  Award,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Info
} from 'lucide-react';
import { XSS_TYPES_DATA, XSSTypeDetail } from './data/xssContent';
import {
  TECHNICAL_CONCEPTS,
  LIFECYCLE_STAGES,
  VULNERABILITY_EXPLORER_POINTS,
  PAYLOAD_KNOWLEDGE_LIBRARY,
  LEARNING_PATH_LESSONS,
  SECURITY_CHECKLIST_ITEMS
} from './data/academyData';
import { AttackFlowDiagram } from './components/AttackFlowDiagram';
import { PracticalLab, LabTab } from './components/PracticalLab';
import { AttackSimulator } from './components/AttackSimulator';
import { VulnerabilityDetection } from './components/VulnerabilityDetection';
import { QuizSection, STORAGE_KEY_EXAM } from './components/QuizSection';
import { PresentationMode } from './components/PresentationMode';

export type AcademySection =
  | 'overview'
  | 'intro'
  | 'lifecycle'
  | 'types'
  | 'explorer'
  | 'lab'
  | 'simulator'
  | 'payloads'
  | 'learning'
  | 'detection'
  | 'prevention'
  | 'comparison'
  | 'checklist'
  | 'exam'
  | 'presentation'
  | 'about';

const STORAGE_KEY_COMPLETED_LESSONS = 'xss_academy_completed_lessons_v1';
const STORAGE_KEY_CHECKLIST = 'xss_academy_security_checklist_v1';

export default function App() {
  const [activeSection, setActiveSection] = useState<AcademySection>('overview');
  const [selectedXSSType, setSelectedXSSType] = useState<'reflected' | 'stored' | 'dom'>('reflected');
  const [selectedLabTab, setSelectedLabTab] = useState<LabTab>('reflected');
  const [preloadedPayload, setPreloadedPayload] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Lifecycle Stage Selection
  const [activeLifecycleIndex, setActiveLifecycleIndex] = useState<number>(0);

  // Vulnerability Explorer Selection
  const [selectedExplorerPointId, setSelectedExplorerPointId] = useState<string>(
    VULNERABILITY_EXPLORER_POINTS[0].id
  );

  // Payload Knowledge Library Search & Filter
  const [payloadSearch, setPayloadSearch] = useState<string>('');
  const [payloadCategory, setPayloadCategory] = useState<string>('All');
  const [payloadDifficulty, setPayloadDifficulty] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Completed Lessons Tracking (LocalStorage)
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED_LESSONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return ['lesson-b1', 'lesson-b2'];
  });

  // Security Testing Checklist Tracking (LocalStorage)
  const [checkedItems, setCheckedItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKLIST);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return ['chk-1', 'chk-3'];
  });

  // Exam Score Tracking
  const [examScorePct, setExamScorePct] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXAM);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Number(parsed?.scorePercentage || 0);
      }
    } catch {
      // ignore
    }
    return 0;
  });

  // Prevention Encoding Workbench
  const [workbenchInput, setWorkbenchInput] = useState<string>(
    `<script>alert('XSS Security Test')</script>`
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED_LESSONS, JSON.stringify(completedLessons));
    } catch {
      // ignore
    }
  }, [completedLessons]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(checkedItems));
    } catch {
      // ignore
    }
  }, [checkedItems]);

  const navigateTo = (
    section: AcademySection,
    options?: {
      xssType?: 'reflected' | 'stored' | 'dom';
      labTab?: LabTab;
      payload?: string;
    }
  ) => {
    setActiveSection(section);
    if (options?.xssType) setSelectedXSSType(options.xssType);
    if (options?.labTab) setSelectedLabTab(options.labTab);
    if (options?.payload !== undefined) setPreloadedPayload(options.payload);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLessonCompleted = (lessonId: string) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const toggleChecklistItem = (itemId: string) => {
    setCheckedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 1800);
  };

  const encodeHTML = (raw: string) =>
    raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const sanitizeRichHTML = (raw: string) =>
    raw
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/\son\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '')
      .replace(/javascript:/gi, '');

  const navigationItems: {
    id: AcademySection;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'overview', label: 'Overview Dashboard', icon: <Shield className="w-4 h-4" /> },
    { id: 'intro', label: 'Introduction to XSS', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'lifecycle', label: 'XSS Attack Lifecycle', icon: <Layers className="w-4 h-4" /> },
    { id: 'types', label: 'Types of XSS', icon: <Globe className="w-4 h-4" /> },
    { id: 'explorer', label: 'Vulnerability Explorer', icon: <Compass className="w-4 h-4" /> },
    { id: 'lab', label: 'Practical Attack Laboratory', icon: <FlaskConical className="w-4 h-4" /> },
    {
      id: 'simulator',
      label: 'Attacker vs Victim Simulator',
      icon: <Crosshair className="w-4 h-4" />
    },
    {
      id: 'payloads',
      label: 'XSS Payload Knowledge Library',
      icon: <Code2 className="w-4 h-4" />
    },
    { id: 'learning', label: 'Step-by-Step Learning', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'detection', label: 'Vulnerability Detection', icon: <Terminal className="w-4 h-4" /> },
    { id: 'prevention', label: 'XSS Prevention Center', icon: <Lock className="w-4 h-4" /> },
    { id: 'comparison', label: 'XSS vs Other Attacks', icon: <GitCompare className="w-4 h-4" /> },
    {
      id: 'checklist',
      label: 'Security Testing Checklist',
      icon: <ListChecks className="w-4 h-4" />
    },
    { id: 'exam', label: 'Interactive Examination', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'presentation', label: 'Presentation Mode', icon: <Presentation className="w-4 h-4" /> },
    { id: 'about', label: 'Project Information', icon: <Info className="w-4 h-4" /> }
  ];

  const payloadCategories = [
    'All',
    'Basic XSS',
    'Reflected XSS',
    'Stored XSS',
    'DOM-Based XSS',
    'HTML Injection',
    'JavaScript Injection Concepts',
    'DOM Manipulation',
    'Secure Coding Examples',
    'Vulnerability Detection',
    'XSS Prevention Examples'
  ];

  const filteredPayloads = useMemo(() => {
    return PAYLOAD_KNOWLEDGE_LIBRARY.filter((entry) => {
      const matchesCat = payloadCategory === 'All' || entry.category === payloadCategory;
      const matchesDiff = payloadDifficulty === 'All' || entry.difficulty === payloadDifficulty;
      const q = payloadSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        entry.name.toLowerCase().includes(q) ||
        entry.code.toLowerCase().includes(q) ||
        entry.explanation.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q);
      return matchesCat && matchesDiff && matchesSearch;
    });
  }, [payloadCategory, payloadDifficulty, payloadSearch]);

  const currentTypeDetail: XSSTypeDetail = XSS_TYPES_DATA[selectedXSSType];
  const currentLifecycleStage = LIFECYCLE_STAGES[activeLifecycleIndex];
  const currentExplorerPoint =
    VULNERABILITY_EXPLORER_POINTS.find((p) => p.id === selectedExplorerPointId) ||
    VULNERABILITY_EXPLORER_POINTS[0];

  const learningProgressPct = Math.round(
    (completedLessons.length / LEARNING_PATH_LESSONS.length) * 100
  );

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col">
      {/* =====================================================================
          TOP NAVIGATION BAR (Strict 3-Zone Contract)
      ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#070B14]/95 backdrop-blur border-b border-slate-800/90 px-4 md:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single Text Element Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('overview');
          }}
          className="text-lg md:text-xl font-bold tracking-tight text-slate-100 hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 font-display"
        >
          XSS Security Academy
        </a>

        {/* Zone 2: 5 Concise Single-Line Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            type="button"
            onClick={() => navigateTo('overview')}
            className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'overview' || activeSection === 'intro'
                ? 'text-cyan-400 underline underline-offset-8'
                : ''
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => navigateTo('types')}
            className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'types' || activeSection === 'lifecycle'
                ? 'text-cyan-400 underline underline-offset-8'
                : ''
            }`}
          >
            XSS Types
          </button>
          <button
            type="button"
            onClick={() => navigateTo('simulator')}
            className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'simulator' || activeSection === 'lab'
                ? 'text-cyan-400 underline underline-offset-8'
                : ''
            }`}
          >
            Attack Simulator
          </button>
          <button
            type="button"
            onClick={() => navigateTo('payloads')}
            className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'payloads' || activeSection === 'prevention'
                ? 'text-cyan-400 underline underline-offset-8'
                : ''
            }`}
          >
            Payload Library
          </button>
          <button
            type="button"
            onClick={() => navigateTo('exam')}
            className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'exam' ? 'text-cyan-400 underline underline-offset-8' : ''
            }`}
          >
            Examination
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Button (+ Mobile Drawer Toggle) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigateTo('presentation')}
            className="px-4 py-2 text-xs md:text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Presentation Mode
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-cyan-400"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN WORKSPACE (Collapsible Sidebar + Main Viewport)
      ===================================================================== */}
      <div className="flex-1 flex relative">
        {/* Collapsible Sidebar */}
        <aside
          className={`${
            mobileMenuOpen
              ? 'fixed inset-y-0 left-0 z-50 w-72 bg-[#070B14] border-r border-slate-800 pt-16 overflow-y-auto'
              : sidebarCollapsed
              ? 'hidden lg:block w-16 shrink-0 border-r border-slate-800/80 bg-[#070B14]/60'
              : 'hidden lg:block w-68 shrink-0 border-r border-slate-800/80 bg-[#070B14]/60'
          } transition-all`}
        >
          <div className="p-3 space-y-4 sticky top-16">
            <div className="flex items-center justify-between px-2">
              {!sidebarCollapsed && (
                <span className="text-[11px] font-mono text-slate-400">
                  Academy Navigation
                </span>
              )}
              <button
                type="button"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                className="hidden lg:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateTo(item.id)}
                    title={item.label}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left whitespace-nowrap ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
                    }`}
                  >
                    <span className={`shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                      {item.icon}
                    </span>
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>

            {!sidebarCollapsed && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-xs">
                <div className="text-cyan-400 font-semibold flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>Academic Credentials</span>
                </div>
                <div className="text-slate-200 font-medium">Muhammad Masood</div>
                <div className="text-slate-400 font-mono tabular-nums">
                  Roll No: 2670 · Computer Science
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-10 py-8 max-w-6xl mx-auto w-full">
          {/* =================================================================
              OVERVIEW DASHBOARD
          ================================================================= */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              {/* Welcome Hero Card */}
              <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 space-y-5">
                <div className="text-xs md:text-sm text-cyan-400 font-medium">
                  XSS Security Academy · Understand Vulnerabilities. Experience Attacks. Master Web Security.
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100 tracking-tight leading-tight max-w-3xl">
                  Welcome to XSS Security Academy
                </h1>

                <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
                  Learn how Cross-Site Scripting vulnerabilities work and how to protect modern web
                  applications through interactive attack-flow architecture, a three-panel Attacker
                  vs. Victim Simulator, isolated browser laboratories, and secure coding patterns.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigateTo('simulator')}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <Crosshair className="w-4 h-4" />
                    Open Attack Simulator
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('lab')}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-semibold text-sm rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <FlaskConical className="w-4 h-4" />
                    Practical Attack Laboratory
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('intro')}
                    className="inline-flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    Start Theory &amp; Lessons
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>Submitted By: Muhammad Masood</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">Roll Number: 2670</span>
                  <span aria-hidden="true">·</span>
                  <span>Department: Computer Science</span>
                  <span aria-hidden="true">·</span>
                  <span>Subject: Cybersecurity</span>
                </div>
              </section>

              {/* Key Platform Metrics Strip */}
              <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {[
                  { label: 'Total XSS Categories', value: '3 Types', sub: 'Reflected, Stored, DOM' },
                  { label: 'Practical Laboratories', value: '3 Labs', sub: 'Isolated Browser Sandboxes' },
                  { label: 'Learning Modules', value: '16 Modules', sub: 'Beginner to Advanced' },
                  {
                    label: 'Payload Library',
                    value: `${PAYLOAD_KNOWLEDGE_LIBRARY.length} Entries`,
                    sub: 'Controlled Test Vectors'
                  },
                  {
                    label: 'Completed Lessons',
                    value: `${completedLessons.length} / ${LEARNING_PATH_LESSONS.length}`,
                    sub: `${learningProgressPct}% Curriculum Done`
                  },
                  {
                    label: 'Quiz Performance',
                    value: examScorePct > 0 ? `${examScorePct}%` : 'Ready',
                    sub: '30-Question Examination'
                  }
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1"
                  >
                    <div className="text-[11px] text-slate-400">{stat.label}</div>
                    <div className="text-xl font-bold text-cyan-400 font-mono tabular-nums">
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{stat.sub}</div>
                  </div>
                ))}
              </section>

              {/* Visual Flow Diagram: ATTACKER -> VULNERABLE WEBSITE -> VICTIM BROWSER -> SECURITY IMPACT */}
              <section>
                <AttackFlowDiagram variant="master" />
              </section>

              {/* Dashboard Grid: Continue Learning, Practical Lab Access, Progress, Quick Access */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Continue Learning & Progress */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-purple-400">
                        Structured Learning Path
                      </div>
                      <h2 className="text-lg font-bold text-slate-100 mt-0.5">
                        Continue Learning &amp; Security Progress
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateTo('learning')}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      View All Lessons →
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">
                        Academy Curriculum Progress
                      </span>
                      <span className="font-mono text-cyan-400 font-semibold tabular-nums">
                        {learningProgressPct}% ({completedLessons.length} of{' '}
                        {LEARNING_PATH_LESSONS.length} lessons)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 transition-all"
                        style={{ width: `${learningProgressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Recently Studied Vulnerabilities & Next Modules */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {LEARNING_PATH_LESSONS.slice(0, 4).map((lesson) => {
                      const isDone = completedLessons.includes(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <div className="text-[11px] font-mono text-purple-400">
                              {lesson.level} · {lesson.duration}
                            </div>
                            <h3 className="text-sm font-semibold text-slate-100 mt-1">
                              {lesson.title}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {lesson.summary}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                            <button
                              type="button"
                              onClick={() =>
                                navigateTo(lesson.targetSection as AcademySection)
                              }
                              className="text-xs font-semibold text-cyan-400 hover:underline"
                            >
                              Open Module
                            </button>
                            <span
                              className={`text-[11px] font-mono ${
                                isDone ? 'text-emerald-400' : 'text-slate-500'
                              }`}
                            >
                              {isDone ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Access to All Three XSS Types & Practical Laboratory */}
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                  <div>
                    <div className="text-xs font-mono text-cyan-400">
                      Quick Access to All Three XSS Types &amp; Labs
                    </div>
                    <h2 className="text-lg font-bold text-slate-100 mt-0.5">
                      XSS Categories &amp; Practical Sandboxes
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {(['reflected', 'stored', 'dom'] as const).map((key) => {
                      const item = XSS_TYPES_DATA[key];
                      return (
                        <div
                          key={item.id}
                          className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-100">{item.shortName}</h3>
                            <span className="text-[11px] font-mono text-cyan-400">
                              {item.persistence.split(' ')[0]}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{item.tagline}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => navigateTo('types', { xssType: item.id })}
                              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                            >
                              Study Theory
                            </button>
                            <button
                              type="button"
                              onClick={() => navigateTo('lab', { labTab: item.id })}
                              className="px-3 py-1.5 text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg transition-colors"
                            >
                              Open Practical Lab
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* =================================================================
              INTRODUCTION TO XSS (CHAPTERS: WHAT IS XSS & TECHNICAL CONCEPTS)
          ================================================================= */}
          {activeSection === 'intro' && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 space-y-5">
                <div className="text-xs font-mono text-cyan-400">
                  Foundational Theory · Beginner to Intermediate Guide
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
                  What is Cross-Site Scripting (XSS)?
                </h1>
                <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
                  Full Form: <strong className="text-cyan-300">Cross-Site Scripting</strong>. It is
                  abbreviated as <strong>XSS</strong> so that it is not confused with{' '}
                  <strong>CSS</strong> (Cascading Style Sheets).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                    <div className="text-xs font-mono text-emerald-400">
                      Beginner-Friendly Definition
                    </div>
                    <h2 className="text-base font-bold text-slate-100">
                      When User Input Is Mistaken for Executable Code
                    </h2>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                      Whenever you search for a course or post a comment, the website displays your
                      words on a webpage. If the website inserts your raw input into the HTML page
                      without converting special symbols like <code>&lt;</code> and <code>&gt;</code>{' '}
                      into safe text, someone can type a <code>&lt;script&gt;</code> tag and trick
                      the browser into running it as code.
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                    <div className="text-xs font-mono text-cyan-400">
                      Technical Computer Science Definition
                    </div>
                    <h2 className="text-base font-bold text-slate-100">
                      Client-Side Script Injection in a Trusted Origin
                    </h2>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                      Cross-Site Scripting is an application security vulnerability where untrusted
                      data enters a web application and is included in dynamic HTML responses or
                      passed to unsafe DOM manipulation sinks without context-aware validation or
                      encoding, resulting in script execution within the victim browser session.
                    </p>
                  </div>
                </div>

                {/* Deep-Dive Questions Explained Simply */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {[
                    {
                      title: 'Why XSS Exists & How Input Enters',
                      body: 'Web applications constantly build HTML pages dynamically using data from search bars, comments, user profiles, and URL parameters. When data and HTML code share the same string without encoding, markup injection becomes possible.'
                    },
                    {
                      title: 'What JavaScript Does & How Browsers Execute It',
                      body: 'JavaScript powers interactive features inside the browser and has full access to read or modify the live DOM tree. When the HTML parser encounters an unencoded <script> tag or onerror attribute, it immediately executes that code.'
                    },
                    {
                      title: 'Why Websites Trust Content & How Attackers Abuse It',
                      body: 'Browsers enforce the Same-Origin Policy: scripts loaded inside a page from university.edu are trusted to access university.edu data. By injecting code into university.edu, an attacker abuses that built-in browser trust.'
                    }
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2"
                    >
                      <h3 className="text-sm font-bold text-cyan-300">{item.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Technical Concepts (13 Terms) */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
                <div>
                  <div className="text-xs font-mono text-purple-400">
                    Essential Terminology Reference
                  </div>
                  <h2 className="text-xl font-bold text-slate-100 mt-1">
                    Important Technical Concepts Explained in Simple English
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 mt-1">
                    Every key web and security concept with a plain-English definition and a
                    practical example.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TECHNICAL_CONCEPTS.map((c) => (
                    <div
                      key={c.term}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-mono text-purple-400">{c.category}</div>
                        <h3 className="text-sm font-bold text-slate-100">{c.term}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{c.definition}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          <strong className="text-slate-200">Practical Example: </strong>
                          {c.practicalExample}
                        </p>
                      </div>
                      <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded text-[11px] font-mono text-cyan-300 overflow-x-auto">
                        {c.codeExample}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              XSS ATTACK LIFECYCLE (INTERACTIVE STAGE EXPLORER)
          ================================================================= */}
          {activeSection === 'lifecycle' && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div>
                  <div className="text-xs font-mono text-cyan-400">
                    Interactive Attack Architecture
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mt-1">
                    How an XSS Attack Works — Interactive Lifecycle Explorer
                  </h1>
                  <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                    Click any stage in the attack lifecycle below to inspect what happens inside the
                    request, server, and victim browser, along with how to defend that stage.
                  </p>
                </div>

                {/* Interactive Stage Selector Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {LIFECYCLE_STAGES.map((stage, idx) => {
                    const isSelected = idx === activeLifecycleIndex;
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => setActiveLifecycleIndex(idx)}
                        className={`text-left p-4 rounded-xl border transition-colors flex flex-col justify-between space-y-2 ${
                          isSelected
                            ? 'bg-cyan-950/30 border-cyan-400 text-slate-100'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-[11px] font-mono text-cyan-400">{stage.actor}</div>
                          <div className="text-sm font-bold text-slate-100 mt-1">{stage.title}</div>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">{stage.summary}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Stage Deep-Dive Inspector */}
                <div className="bg-slate-950 border border-cyan-500/40 rounded-xl p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-mono text-cyan-400">
                        Active Stage Actor: {currentLifecycleStage.actor}
                      </div>
                      <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                        {currentLifecycleStage.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveLifecycleIndex((prev) =>
                            prev > 0 ? prev - 1 : LIFECYCLE_STAGES.length - 1
                          )
                        }
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                      >
                        Previous Stage
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveLifecycleIndex(
                            (prev) => (prev + 1) % LIFECYCLE_STAGES.length
                          )
                        }
                        className="px-3 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg"
                      >
                        Next Stage
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed">
                    {currentLifecycleStage.detailedExplanation}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
                      <div className="text-xs font-mono text-amber-400 mb-1">
                        Live HTTP / DOM State at This Stage:
                      </div>
                      <code className="text-xs font-mono text-slate-200 break-all">
                        {currentLifecycleStage.httpOrDomState}
                      </code>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
                      <div className="text-xs font-mono text-emerald-400 mb-1">
                        How to Break the Chain Here:
                      </div>
                      <p className="text-xs text-slate-200">
                        {currentLifecycleStage.defensePoint}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <AttackFlowDiagram variant="master" />
            </div>
          )}

          {/* =================================================================
              TYPES OF XSS (REFLECTED, STORED, DOM-BASED MODULES)
          ================================================================= */}
          {activeSection === 'types' && (
            <div className="space-y-8">
              {/* Type Switcher Header */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-cyan-400">
                    Three Complete XSS Learning Modules
                  </div>
                  <h1 className="text-2xl font-bold text-slate-100 mt-1">
                    {currentTypeDetail.title}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-300 mt-1">
                    {currentTypeDetail.tagline}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 border border-slate-800 p-1.5 rounded-xl shrink-0">
                  {(['reflected', 'stored', 'dom'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedXSSType(t)}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        selectedXSSType === t
                          ? 'bg-cyan-500 text-slate-950'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {XSS_TYPES_DATA[t].shortName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Definition, Analogy, Mechanism, Perspectives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                  <div className="text-xs font-mono text-cyan-400">Definition &amp; Explanation</div>
                  <h2 className="text-base font-bold text-slate-100">
                    What is {currentTypeDetail.shortName}?
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {currentTypeDetail.definition}
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                  <div className="text-xs font-mono text-emerald-400">Working Mechanism</div>
                  <h2 className="text-base font-bold text-slate-100">
                    How {currentTypeDetail.shortName} Operates
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {currentTypeDetail.howItWorks}
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                  <div className="text-xs font-mono text-amber-400">Attacker Perspective</div>
                  <h2 className="text-base font-bold text-slate-100">
                    {currentTypeDetail.extraConceptTitle}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {currentTypeDetail.extraConceptBody}
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                  <div className="text-xs font-mono text-purple-400">
                    Real-World Scenario &amp; Victim Perspective
                  </div>
                  <h2 className="text-base font-bold text-slate-100">
                    {currentTypeDetail.realWorldScenarioTitle}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {currentTypeDetail.realWorldScenarioDescription}
                  </p>
                </div>
              </div>

              {/* Specialized Attack Flow Diagram */}
              <AttackFlowDiagram variant={currentTypeDetail.id} />

              {/* Vulnerable vs Safe Code Comparison */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono text-cyan-400">
                      Code Comparison &amp; Practical Demonstration
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                      Vulnerable vs. Safe Code for {currentTypeDetail.shortName}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo('lab', { labTab: currentTypeDetail.id })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <FlaskConical className="w-4 h-4" />
                    Launch {currentTypeDetail.shortName} Lab
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-slate-950 border border-rose-500/40 rounded-xl p-5 space-y-3">
                    <div className="text-xs font-mono font-semibold text-rose-400">
                      VULNERABLE CODE EXAMPLE
                    </div>
                    <pre className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                      {currentTypeDetail.vulnerableCode}
                    </pre>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentTypeDetail.vulnerableExplanation}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-5 space-y-3">
                    <div className="text-xs font-mono font-semibold text-emerald-400">
                      SAFE REMEDIATED CODE EXAMPLE
                    </div>
                    <pre className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                      {currentTypeDetail.safeCode}
                    </pre>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentTypeDetail.safeExplanation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Risks & Prevention Techniques */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
                  <div className="text-xs font-mono text-rose-400">Security Risks</div>
                  <h2 className="text-lg font-bold text-slate-100">
                    Possible Impact of {currentTypeDetail.shortName}
                  </h2>
                  <ul className="space-y-2.5">
                    {currentTypeDetail.possibleImpacts.map((imp, i) => (
                      <li
                        key={i}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 flex items-start gap-2.5"
                      >
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
                  <div className="text-xs font-mono text-emerald-400">Prevention &amp; Defense</div>
                  <h2 className="text-lg font-bold text-slate-100">
                    How to Prevent {currentTypeDetail.shortName}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentTypeDetail.preventionMethods.map((m, i) => (
                      <div
                        key={i}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5"
                      >
                        <div className="text-sm font-semibold text-emerald-400">{m.title}</div>
                        <p className="text-xs text-slate-300 leading-relaxed">{m.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              VULNERABILITY EXPLORER (10 INTERACTIVE INPUT POINTS)
          ================================================================= */}
          {activeSection === 'explorer' && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="text-xs font-mono text-cyan-400">
                  Interactive Application Attack-Surface Map
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
                  Website Vulnerability Explorer
                </h1>
                <p className="text-sm text-slate-300 max-w-3xl">
                  Select any common website input surface below to inspect what data users submit,
                  how the backend or DOM processes it, where unsafe rendering happens, and how
                  developers should secure it.
                </p>

                {/* 10 Input Point Selector Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {VULNERABILITY_EXPLORER_POINTS.map((point) => (
                    <button
                      key={point.id}
                      type="button"
                      onClick={() => setSelectedExplorerPointId(point.id)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                        selectedExplorerPointId === point.id
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {point.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Inspection of Selected Input Point */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div>
                    <div className="text-xs font-mono text-cyan-400">
                      Example Location: {currentExplorerPoint.locationExample}
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                      {currentExplorerPoint.name}
                    </h2>
                  </div>
                  <div className="text-xs font-mono text-amber-300">
                    Context-Dependent Risk Profile: {currentExplorerPoint.typicalRiskRange}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5">
                    <div className="text-xs font-semibold text-cyan-400">
                      What Information the User Submits
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentExplorerPoint.userSubmits}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5">
                    <div className="text-xs font-semibold text-purple-400">
                      How the Website Processes It
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentExplorerPoint.websiteProcesses}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5">
                    <div className="text-xs font-semibold text-amber-400">
                      Where Unsafe Rendering Could Happen
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentExplorerPoint.unsafeRenderingPoint}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5">
                    <div className="text-xs font-semibold text-rose-400">
                      What an Attacker Could Potentially Do
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentExplorerPoint.attackerAction}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5">
                    <div className="text-xs font-semibold text-rose-300">
                      How the Victim Might Be Affected
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentExplorerPoint.victimImpact}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5">
                    <div className="text-xs font-semibold text-emerald-400">
                      How a Developer Should Fix It
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentExplorerPoint.developerFix}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs font-mono text-emerald-400 mb-1.5">
                    Recommended Secure Code Pattern:
                  </div>
                  <pre className="text-xs font-mono text-slate-200 overflow-x-auto">
                    {currentExplorerPoint.safeCodeSample}
                  </pre>
                </div>
              </div>

              {/* Vulnerability Severity Classification Guide */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div>
                  <div className="text-xs font-mono text-cyan-400">
                    Risk Assessment Methodology
                  </div>
                  <h2 className="text-lg font-bold text-slate-100 mt-0.5">
                    Understanding Vulnerability Severity Levels
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 mt-1">
                    Actual XSS severity is never assigned arbitrarily to an input box—it depends on
                    <strong> exploitability</strong> (reflected vs. persistent),{' '}
                    <strong>authentication context</strong>, and <strong>business impact</strong>:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    {
                      level: 'Informational',
                      color: 'text-slate-300',
                      desc: 'Harmless reflection where special characters are properly encoded or restricted to a non-HTML text response.'
                    },
                    {
                      level: 'Low',
                      color: 'text-cyan-400',
                      desc: 'Self-XSS or unencoded HTML styling tags where script execution is blocked and no other user can be targeted.'
                    },
                    {
                      level: 'Medium',
                      color: 'text-amber-400',
                      desc: 'Reflected or DOM-Based XSS requiring user interaction (clicking a crafted link) on a low-privilege page.'
                    },
                    {
                      level: 'High',
                      color: 'text-rose-400',
                      desc: 'Reflected XSS on sensitive authenticated pages, or Stored XSS affecting regular application users.'
                    },
                    {
                      level: 'Critical',
                      color: 'text-rose-500',
                      desc: 'Stored (Persistent) XSS executing automatically in high-privilege administrator dashboards or across all users.'
                    }
                  ].map((sev) => (
                    <div
                      key={sev.level}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5"
                    >
                      <div className={`text-sm font-bold ${sev.color}`}>{sev.level}</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{sev.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              PRACTICAL ATTACK LABORATORY
          ================================================================= */}
          {activeSection === 'lab' && (
            <PracticalLab
              initialLab={selectedLabTab}
              preloadedPayload={preloadedPayload}
              onClearPreloadedPayload={() => setPreloadedPayload(null)}
            />
          )}

          {/* =================================================================
              ATTACKER VS VICTIM SIMULATOR
          ================================================================= */}
          {activeSection === 'simulator' && <AttackSimulator />}

          {/* =================================================================
              XSS PAYLOAD KNOWLEDGE LIBRARY (30 CATEGORIZED ENTRIES)
          ================================================================= */}
          {activeSection === 'payloads' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono text-cyan-400">
                      Searchable Educational Knowledge Base · {PAYLOAD_KNOWLEDGE_LIBRARY.length} Controlled Entries
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100 mt-1">
                      XSS Knowledge &amp; Payload Library
                    </h1>
                    <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                      Search and filter controlled educational payloads, DOM manipulation patterns,
                      and secure coding examples. Every entry includes a complete technical
                      breakdown, risk analysis, and prevention guide.
                    </p>
                  </div>

                  {/* Difficulty Filter */}
                  <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1.5 rounded-xl shrink-0">
                    {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setPayloadDifficulty(diff)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                          payloadDifficulty === diff
                            ? 'bg-cyan-500 text-slate-950 font-semibold'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={payloadSearch}
                    onChange={(e) => setPayloadSearch(e.target.value)}
                    placeholder="Search payloads by name, tag (script, img, svg, textContent, DOMPurify, CSP)..."
                    aria-label="Search payload knowledge library"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs md:text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Category Filter Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {payloadCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPayloadCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                        payloadCategory === cat
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Entries List */}
              <div className="space-y-4">
                {filteredPayloads.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div>
                        <div className="text-xs font-mono text-cyan-400">
                          {entry.category} · Difficulty: {entry.difficulty}
                        </div>
                        <h2 className="text-lg font-bold text-slate-100 mt-0.5">{entry.name}</h2>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyCode(entry.id, entry.code)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg transition-colors whitespace-nowrap"
                        >
                          {copiedId === entry.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-cyan-400" />
                              Copy Code
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigateTo('lab', {
                              labTab: entry.targetLab,
                              payload: entry.code
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg transition-colors whitespace-nowrap"
                        >
                          <FlaskConical className="w-3.5 h-3.5" />
                          Open in Lab
                        </button>
                      </div>
                    </div>

                    <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto">
                      {entry.code}
                    </pre>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                        <div className="font-semibold text-cyan-400 mb-1">Explanation</div>
                        <p className="text-slate-300 leading-relaxed">{entry.explanation}</p>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                        <div className="font-semibold text-purple-400 mb-1">How It Works</div>
                        <p className="text-slate-300 leading-relaxed">{entry.howItWorks}</p>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                        <div className="font-semibold text-slate-200 mb-1">Where It Is Relevant</div>
                        <p className="text-slate-300 leading-relaxed">{entry.whereRelevant}</p>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                        <div className="font-semibold text-amber-400 mb-1">Expected Output</div>
                        <p className="text-slate-300 leading-relaxed">{entry.expectedOutput}</p>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                        <div className="font-semibold text-rose-400 mb-1">Security Risk</div>
                        <p className="text-slate-300 leading-relaxed">{entry.securityRisk}</p>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                        <div className="font-semibold text-emerald-400 mb-1">Prevention</div>
                        <p className="text-slate-300 leading-relaxed">{entry.prevention}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              STEP-BY-STEP LEARNING CENTER (4 LEVELS)
          ================================================================= */}
          {activeSection === 'learning' && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono text-purple-400">
                      Structured Cybersecurity Curriculum
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mt-1">
                      Professional Step-by-Step Learning Center
                    </h1>
                    <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                      Progress through Beginner, Intermediate, Practical, and Advanced levels. Mark
                      each lesson complete as you study the theory and run its hands-on laboratory.
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-right shrink-0">
                    <div className="text-xs text-slate-400">Completed Lessons</div>
                    <div className="text-xl font-bold text-cyan-400 font-mono tabular-nums">
                      {completedLessons.length} / {LEARNING_PATH_LESSONS.length} ({learningProgressPct}%)
                    </div>
                  </div>
                </div>
              </div>

              {(
                ['Beginner', 'Intermediate', 'Practical', 'Advanced Concepts'] as const
              ).map((levelName) => {
                const levelLessons = LEARNING_PATH_LESSONS.filter((l) => l.level === levelName);
                return (
                  <div
                    key={levelName}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
                  >
                    <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-slate-100">{levelName} Level</h2>
                      <span className="text-xs font-mono text-cyan-400">
                        {
                          levelLessons.filter((l) => completedLessons.includes(l.id))
                            .length
                        }{' '}
                        / {levelLessons.length} Completed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {levelLessons.map((lesson) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            className={`bg-slate-950 border rounded-xl p-5 flex flex-col justify-between space-y-4 ${
                              isCompleted ? 'border-emerald-500/40' : 'border-slate-800'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-purple-400">
                                  {lesson.level} · {lesson.duration}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleLessonCompleted(lesson.id)}
                                  className={`inline-flex items-center gap-1 font-semibold ${
                                    isCompleted
                                      ? 'text-emerald-400'
                                      : 'text-slate-400 hover:text-slate-200'
                                  }`}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  {isCompleted ? 'Completed' : 'Mark Complete'}
                                </button>
                              </div>

                              <h3 className="text-base font-bold text-slate-100">
                                {lesson.title}
                              </h3>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {lesson.summary}
                              </p>
                              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-cyan-300 overflow-x-auto">
                                {lesson.codeFocus}
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                              <span className="text-[11px] text-emerald-300 truncate">
                                {lesson.keyTakeaway}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  navigateTo(lesson.targetSection as AcademySection)
                                }
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-lg shrink-0"
                              >
                                Study Module →
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* =================================================================
              VULNERABILITY DETECTION CENTER
          ================================================================= */}
          {activeSection === 'detection' && <VulnerabilityDetection />}

          {/* =================================================================
              XSS PREVENTION AND SECURE CODING CENTER
          ================================================================= */}
          {activeSection === 'prevention' && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 space-y-5">
                <div className="text-xs font-mono text-emerald-400">
                  XSS Defense &amp; Secure Coding Center
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
                  Comprehensive XSS Prevention &amp; Remediation Architecture
                </h1>
                <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
                  Protecting modern web applications requires combining safe DOM APIs (
                  <code className="text-emerald-300">element.textContent</code>), context-aware
                  output encoding, allowlist HTML sanitization, and browser security headers.
                </p>

                {/* Interactive Side-by-Side Code Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="bg-slate-950 border border-rose-500/40 rounded-xl p-5 space-y-2.5">
                    <div className="text-xs font-mono font-semibold text-rose-400">
                      UNSAFE DOM RENDERING
                    </div>
                    <pre className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-xs md:text-sm font-mono text-rose-300">
                      {`element.innerHTML = userInput;`}
                    </pre>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong>Why it is dangerous:</strong> <code>innerHTML</code> parses the string
                      as live HTML markup. Any injected <code>&lt;img onerror=...&gt;</code> or{' '}
                      <code>&lt;svg onload=...&gt;</code> executes JavaScript immediately.
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-5 space-y-2.5">
                    <div className="text-xs font-mono font-semibold text-emerald-400">
                      SAFE FOR PLAIN TEXT
                    </div>
                    <pre className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-xs md:text-sm font-mono text-emerald-300">
                      {`element.textContent = userInput;`}
                    </pre>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong>What changes and why:</strong> <code>textContent</code> assigns a pure
                      text node without invoking the HTML parser. Angle brackets are displayed as
                      harmless literal characters on screen.
                    </p>
                  </div>
                </div>
              </div>

              {/* 10 Defense Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    title: 'Input Validation (Allowlisting)',
                    tag: 'Entry-Point Filtering',
                    body: 'Validate that incoming parameters match expected data types, lengths, and character sets (for example, numeric roll numbers or fixed tab names).',
                    code: `const ALLOWED_SORTS = ['date', 'rating'];\nconst safeSort = ALLOWED_SORTS.includes(input) ? input : 'date';`
                  },
                  {
                    title: 'Context-Aware Output Encoding',
                    tag: 'Primary HTML Defense',
                    body: 'Encode &, <, >, ", and \' into HTML entities (&amp;, &lt;, &gt;, &quot;, &#39;) right before inserting untrusted text into HTML body or attribute contexts.',
                    code: `// "<script>" -> "&lt;script&gt;"`
                  },
                  {
                    title: 'HTML Sanitization (DOMPurify)',
                    tag: 'Rich-Text & Markdown Protection',
                    body: 'When users intentionally submit formatted HTML (bold, lists, paragraphs), sanitize the markup with DOMPurify to remove <script>, <iframe>, and on* attributes.',
                    code: `const cleanHTML = DOMPurify.sanitize(userRichComment);`
                  },
                  {
                    title: 'Content Security Policy (CSP)',
                    tag: 'Browser Execution Restriction',
                    body: 'Deploy a Content-Security-Policy response header that disables inline scripts and restricts script loading to trusted origins or cryptographic nonces.',
                    code: `Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'`
                  },
                  {
                    title: 'HttpOnly Cookies',
                    tag: 'Session Token Isolation',
                    body: 'Configure authentication cookies with the HttpOnly flag so client-side JavaScript (document.cookie) cannot read or exfiltrate session tokens.',
                    code: `Set-Cookie: session_id=xyz; HttpOnly; Secure; SameSite=Strict`
                  },
                  {
                    title: 'Secure Cookie Configuration',
                    tag: 'Transport & Cross-Origin Hardening',
                    body: 'Pair HttpOnly with Secure (HTTPS-only transmission) and SameSite=Strict or Lax to protect cookies across network and cross-origin contexts.',
                    code: `res.cookie('sid', val, { httpOnly: true, secure: true, sameSite: 'strict' });`
                  },
                  {
                    title: 'Safe DOM Manipulation',
                    tag: 'Client-Side Sink Discipline',
                    body: 'Use document.createElement(), element.textContent, and validated URL assignments instead of innerHTML, outerHTML, or document.write().',
                    code: `const p = document.createElement('p');\np.textContent = untrustedText;`
                  },
                  {
                    title: 'Framework Security Features',
                    tag: 'React, Vue & Angular Auto-Escaping',
                    body: 'Rely on built-in JSX/template auto-escaping ({variable}) and avoid dangerous escape hatches like dangerouslySetInnerHTML or v-html.',
                    code: `return <div className="user-bio">{user.biography}</div>;`
                  },
                  {
                    title: 'Session Protection & Re-Authentication',
                    tag: 'Minimizing Session Abuse',
                    body: 'Use short session lifetimes, rotate session identifiers after login, and require password re-entry before changing account email or credentials.',
                    code: `if (!verifyCurrentPassword(req.body.currentPassword)) return res.status(403);`
                  },
                  {
                    title: 'Secure Application Design',
                    tag: 'Defense-in-Depth Architecture',
                    body: 'Isolate untrusted user previews inside sandboxed iframes (sandbox="allow-scripts" without allow-same-origin) and enforce automated security linting in CI.',
                    code: `<iframe sandbox="allow-scripts" srcDoc={isolatedPreview} />`
                  }
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="text-xs font-mono text-cyan-400">{item.tag}</div>
                      <h2 className="text-base font-bold text-slate-100">{item.title}</h2>
                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                    <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto">
                      {item.code}
                    </pre>
                  </div>
                ))}
              </div>

              {/* Live Output Encoding & Sanitization Workbench */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div>
                  <div className="text-xs font-mono text-cyan-400">
                    Interactive Remediation Tester
                  </div>
                  <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                    Live Output Encoding &amp; Sanitization Workbench
                  </h2>
                </div>
                <input
                  type="text"
                  value={workbenchInput}
                  onChange={(e) => setWorkbenchInput(e.target.value)}
                  aria-label="Input for encoding workbench"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs md:text-sm font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
                    <div className="text-xs font-mono text-emerald-400">
                      HTML Entity Encoded (Plain Text Context):
                    </div>
                    <pre className="text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap">
                      {encodeHTML(workbenchInput)}
                    </pre>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
                    <div className="text-xs font-mono text-cyan-400">
                      Sanitized HTML (Scripts &amp; Event Attributes Stripped):
                    </div>
                    <pre className="text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap">
                      {sanitizeRichHTML(workbenchInput) || '(All script content removed)'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              XSS VS OTHER ATTACKS (SQL INJECTION, CSRF, HTML INJECTION)
          ================================================================= */}
          {activeSection === 'comparison' && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="text-xs font-mono text-cyan-400">
                  Comparative Web Security Analysis
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
                  XSS vs. SQL Injection, CSRF &amp; HTML Injection
                </h1>
                <p className="text-sm text-slate-300 max-w-3xl">
                  Understand how Cross-Site Scripting differs from other major web application
                  vulnerabilities in target, execution location, impact, and primary defense.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-300">
                        <th className="py-3.5 px-4 font-semibold">Dimension</th>
                        <th className="py-3.5 px-4 font-semibold text-cyan-400">
                          Cross-Site Scripting (XSS)
                        </th>
                        <th className="py-3.5 px-4 font-semibold text-amber-400">
                          SQL Injection (SQLi)
                        </th>
                        <th className="py-3.5 px-4 font-semibold text-purple-400">
                          Cross-Site Request Forgery (CSRF)
                        </th>
                        <th className="py-3.5 px-4 font-semibold text-emerald-400">
                          HTML Injection
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-slate-300">Primary Target</td>
                        <td className="py-3.5 px-4">Victim Browser &amp; Active User Session</td>
                        <td className="py-3.5 px-4">Backend Relational Database Server</td>
                        <td className="py-3.5 px-4">Authenticated State-Changing Endpoints</td>
                        <td className="py-3.5 px-4">Visual Page Structure &amp; Layout</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-slate-300">
                          Injected Payload
                        </td>
                        <td className="py-3.5 px-4 font-mono text-cyan-300">
                          JavaScript (&lt;script&gt;, onerror)
                        </td>
                        <td className="py-3.5 px-4 font-mono text-amber-300">
                          SQL Commands (&#39; OR 1=1 --)
                        </td>
                        <td className="py-3.5 px-4 font-mono text-purple-300">
                          Forged Cross-Origin HTTP Request
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-300">
                          Markup Tags (&lt;h2&gt;, &lt;div&gt;)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-slate-300">
                          Possible Damage
                        </td>
                        <td className="py-3.5 px-4">
                          Arbitrary script execution in browser, DOM manipulation, session abuse
                        </td>
                        <td className="py-3.5 px-4">
                          Unauthorized reading, modification, or deletion of database tables
                        </td>
                        <td className="py-3.5 px-4">
                          Unintended actions triggered blindly without reading the response
                        </td>
                        <td className="py-3.5 px-4">
                          Page defacement and visual UI spoofing without script execution
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-slate-300">
                          Primary Prevention
                        </td>
                        <td className="py-3.5 px-4 text-emerald-300">
                          Output Encoding, textContent, DOMPurify, CSP
                        </td>
                        <td className="py-3.5 px-4 text-emerald-300">
                          Parameterized Queries (Prepared Statements)
                        </td>
                        <td className="py-3.5 px-4 text-emerald-300">
                          Anti-CSRF Tokens &amp; SameSite Cookie Flags
                        </td>
                        <td className="py-3.5 px-4 text-emerald-300">
                          HTML Entity Encoding (&amp;lt;, &amp;gt;)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SECURITY TESTING CHECKLIST
          ================================================================= */}
          {activeSection === 'checklist' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-cyan-400">
                    Interactive Verification &amp; Audit Checklist
                  </div>
                  <h1 className="text-2xl font-bold text-slate-100 mt-1">
                    XSS Security Testing &amp; Defense Checklist
                  </h1>
                  <p className="text-sm text-slate-300 mt-1">
                    Use this interactive checklist during code reviews and university project
                    evaluations to verify full XSS protection.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-right shrink-0">
                  <div className="text-xs text-slate-400">Checklist Verified</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
                    {checkedItems.length} / {SECURITY_CHECKLIST_ITEMS.length}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {SECURITY_CHECKLIST_ITEMS.map((item) => {
                  const isChecked = checkedItems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`w-full text-left p-5 rounded-xl border transition-colors flex items-start gap-4 ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-5 h-5 shrink-0 mt-0.5 ${
                          isChecked ? 'text-emerald-400' : 'text-slate-600'
                        }`}
                      />
                      <div className="space-y-1">
                        <div className="text-xs font-mono text-cyan-400">{item.category}</div>
                        <div className="text-sm md:text-base font-semibold text-slate-100">
                          {item.title}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{item.detail}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================================
              INTERACTIVE EXAMINATION (30 QUESTIONS)
          ================================================================= */}
          {activeSection === 'exam' && (
            <QuizSection
              onScoreUpdate={(pct) => {
                setExamScorePct(pct);
              }}
            />
          )}

          {/* =================================================================
              UNIVERSITY PRESENTATION MODE (15 SLIDES)
          ================================================================= */}
          {activeSection === 'presentation' && (
            <PresentationMode
              onOpenLab={(labType) => navigateTo('lab', { labTab: labType })}
              onOpenSimulator={() => navigateTo('simulator')}
            />
          )}

          {/* =================================================================
              PROJECT INFORMATION & ACADEMIC OVERVIEW
          ================================================================= */}
          {activeSection === 'about' && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 space-y-6">
                <div className="text-xs font-mono text-cyan-400">
                  University Computer Science Project Documentation
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
                  Project Information — XSS Security Academy
                </h1>
                <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
                  <strong>XSS Security Academy</strong> is a comprehensive educational and practical
                  cybersecurity training platform designed to demonstrate Cross-Site Scripting
                  vulnerabilities, real-time sandboxed attack simulations, vulnerability detection,
                  and defense-in-depth software engineering.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-3">
                    <h2 className="text-base font-bold text-cyan-400">
                      Academic Submission Details
                    </h2>
                    <dl className="space-y-2.5 text-xs md:text-sm">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <dt className="text-slate-400">Project Title:</dt>
                        <dd className="font-semibold text-slate-100">XSS Security Academy</dd>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <dt className="text-slate-400">Submitted By:</dt>
                        <dd className="font-semibold text-cyan-300">Muhammad Masood</dd>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <dt className="text-slate-400">Roll Number:</dt>
                        <dd className="font-mono font-bold text-emerald-400 tabular-nums">2670</dd>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <dt className="text-slate-400">Department:</dt>
                        <dd className="font-medium text-slate-200">Computer Science</dd>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <dt className="text-slate-400">Subject:</dt>
                        <dd className="font-medium text-slate-200">Cybersecurity</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-400">Project Type:</dt>
                        <dd className="text-slate-200">
                          University Practical &amp; Educational Platform
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-3">
                    <h2 className="text-base font-bold text-emerald-400">
                      Safety &amp; Architectural Design
                    </h2>
                    <ul className="space-y-2 text-xs md:text-sm text-slate-300 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Isolated Sandboxed Execution:</strong> All vulnerable laboratory
                          targets execute strictly inside restricted{' '}
                          <code>sandbox="allow-scripts"</code> iframes with zero access to the host
                          application.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>100% Local &amp; Offline-Ready:</strong> Uses browser LocalStorage
                          for simulated database comments, lesson progress, and examination state.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Ethical Educational Scope:</strong> All 30 library payloads are
                          harmless proof-of-concept educational vectors.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Local Setup Instructions */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-3">
                  <h2 className="text-base font-bold text-slate-100">
                    Local Setup &amp; University Demonstration Instructions
                  </h2>
                  <pre className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto">
{`# Install project dependencies
npm install

# Start the local development server on port 3000
npm run dev

# Build for production
npm run build`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =====================================================================
          ACADEMIC FOOTER
      ===================================================================== */}
      <footer className="bg-slate-950 border-t border-slate-800/90 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <strong className="text-slate-200">XSS Security Academy</strong> — Understand
            Vulnerabilities. Experience Attacks. Master Web Security.
          </div>
          <div>
            Submitted By: <strong className="text-slate-200">Muhammad Masood</strong> · Roll Number:{' '}
            <span className="font-mono text-emerald-400 tabular-nums">2670</span> · Department of
            Computer Science
          </div>
        </div>
      </footer>
    </div>
  );
}
