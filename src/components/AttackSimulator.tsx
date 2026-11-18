import React, { useState, useMemo } from 'react';
import {
  Terminal,
  Globe,
  ShieldAlert,
  ShieldCheck,
  Play,
  RotateCcw,
  Search,
  MessageSquare,
  User,
  Star,
  Link2,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Lock
} from 'lucide-react';

type TargetSiteMode = 'search' | 'comment' | 'profile' | 'review' | 'url';
type XSSCategory = 'Reflected XSS' | 'Stored XSS' | 'DOM-Based XSS';

interface SimulatorPreset {
  id: string;
  label: string;
  category: XSSCategory;
  recommendedTarget: TargetSiteMode;
  payload: string;
  explanation: string;
  whyItHappens: string;
  howSecureModeFixesIt: string;
}

const SIMULATOR_PRESETS: SimulatorPreset[] = [
  {
    id: 'sim-1',
    label: 'Reflected Search Alert Probe',
    category: 'Reflected XSS',
    recommendedTarget: 'search',
    payload: `<script>alert('XSS Security Test')</script>`,
    explanation:
      'Injects a standard <script> tag into the search query parameter to test if the server echoes raw HTML.',
    whyItHappens:
      'The search page concatenates the query string directly into the HTML response without encoding < and >.',
    howSecureModeFixesIt:
      'Secure Mode HTML-encodes < into &lt; and > into &gt; (or uses textContent), displaying the literal string safely.'
  },
  {
    id: 'sim-2',
    label: 'Stored Comment Image Onerror Probe',
    category: 'Stored XSS',
    recommendedTarget: 'comment',
    payload: `Great course! <img src=x onerror=alert('Stored Comment XSS')>`,
    explanation:
      'Submits a comment with an invalid image source so the onerror event handler executes whenever the comment list loads.',
    whyItHappens:
      'The comment is stored raw in the database and rendered into every visitor page using innerHTML.',
    howSecureModeFixesIt:
      'Secure Mode renders comments via textContent or sanitizes rich HTML with DOMPurify to strip onerror attributes.'
  },
  {
    id: 'sim-3',
    label: 'User Profile Bio SVG Probe',
    category: 'Stored XSS',
    recommendedTarget: 'profile',
    payload: `CS Senior · Security Researcher <svg onload=alert('Profile Bio XSS')></svg>`,
    explanation:
      'Embeds an inline <svg onload=...> vector inside a student profile biography field.',
    whyItHappens:
      'The profile page renders the user biography as raw HTML markup without stripping SVG script events.',
    howSecureModeFixesIt:
      'Secure Mode binds biography fields strictly as plain text nodes.'
  },
  {
    id: 'sim-4',
    label: 'Product Review Heading Manipulation',
    category: 'Stored XSS',
    recommendedTarget: 'review',
    payload: `<h2>Verified 5-Star Academic Textbook</h2><script>alert('Review XSS')</script>`,
    explanation:
      'Demonstrates both visual HTML layout manipulation (<h2>) and script injection inside a review card.',
    whyItHappens:
      'Review cards are assembled with unescaped template literals and injected into the page.',
    howSecureModeFixesIt:
      'Secure Mode encodes all review text so neither <h2> nor <script> is parsed as HTML.'
  },
  {
    id: 'sim-5',
    label: 'DOM Hash Fragment Sink Probe',
    category: 'DOM-Based XSS',
    recommendedTarget: 'url',
    payload: `<img src=x onerror=alert('DOM Hash Sink XSS')>`,
    explanation:
      'Places an event-handler payload in the URL #hash source, which client-side JavaScript writes into innerHTML.',
    whyItHappens:
      'Client-side script reads window.location.hash (Source) and assigns it directly to element.innerHTML (Sink).',
    howSecureModeFixesIt:
      'Secure Mode validates the hash against an allowlist and writes to element.textContent.'
  }
];

function encodeEntities(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const AttackSimulator: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<XSSCategory>('Reflected XSS');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SIMULATOR_PRESETS[0].id);
  const [targetMode, setTargetMode] = useState<TargetSiteMode>('search');
  const [payloadInput, setPayloadInput] = useState<string>(SIMULATOR_PRESETS[0].payload);
  const [executedPayload, setExecutedPayload] = useState<string>(SIMULATOR_PRESETS[0].payload);
  const [securityMode, setSecurityMode] = useState<'vulnerable' | 'secure'>('vulnerable');
  const [activeImpactScenario, setActiveImpactScenario] = useState<
    'page-load' | 'alert-box' | 'content-change' | 'fake-login'
  >('alert-box');

  const currentPreset =
    SIMULATOR_PRESETS.find((p) => p.id === selectedPresetId) || SIMULATOR_PRESETS[0];

  const handleSelectCategory = (cat: XSSCategory) => {
    setSelectedCategory(cat);
    const matching = SIMULATOR_PRESETS.find((p) => p.category === cat);
    if (matching) {
      setSelectedPresetId(matching.id);
      setTargetMode(matching.recommendedTarget);
      setPayloadInput(matching.payload);
      setExecutedPayload(matching.payload);
    }
  };

  const handleSelectPreset = (preset: SimulatorPreset) => {
    setSelectedPresetId(preset.id);
    setSelectedCategory(preset.category);
    setTargetMode(preset.recommendedTarget);
    setPayloadInput(preset.payload);
    setExecutedPayload(preset.payload);
  };

  const handleExecuteTest = (e: React.FormEvent) => {
    e.preventDefault();
    setExecutedPayload(payloadInput);
  };

  const handleClear = () => {
    setPayloadInput('Normal Student Input (No Script Tags)');
    setExecutedPayload('Normal Student Input (No Script Tags)');
  };

  const targetMetadata: Record<
    TargetSiteMode,
    { label: string; url: string; contextName: string; sinkUsed: string }
  > = {
    search: {
      label: 'Search Page',
      url: `https://academy-target.local/search?q=${encodeURIComponent(executedPayload)}`,
      contextName: 'Search Results Banner',
      sinkUsed: securityMode === 'vulnerable' ? 'Server Raw HTML Reflection' : 'HTML Entity Encoded Output'
    },
    comment: {
      label: 'Comment Section',
      url: `https://academy-target.local/course/comments`,
      contextName: 'Stored Student Discussion Thread',
      sinkUsed: securityMode === 'vulnerable' ? 'commentBox.innerHTML' : 'commentBox.textContent'
    },
    profile: {
      label: 'User Profile',
      url: `https://academy-target.local/profile/student-2670`,
      contextName: 'Student Biography Card',
      sinkUsed: securityMode === 'vulnerable' ? 'bioContainer.innerHTML' : 'bioContainer.textContent'
    },
    review: {
      label: 'Product Review',
      url: `https://academy-target.local/bookstore/cybersecurity-handbook`,
      contextName: 'Verified Reader Review List',
      sinkUsed: securityMode === 'vulnerable' ? 'reviewList.innerHTML' : 'DOMPurify / textContent'
    },
    url: {
      label: 'URL-Based Page',
      url: `https://academy-target.local/portal#view=${executedPayload}`,
      contextName: 'Client-Side Hash Router Container',
      sinkUsed: securityMode === 'vulnerable' ? 'location.hash -> innerHTML' : 'Allowlist -> textContent'
    }
  };

  const activeTargetInfo = targetMetadata[targetMode];

  const victimBrowserSrcDoc = useMemo(() => {
    const renderedContent =
      securityMode === 'secure' ? encodeEntities(executedPayload) : executedPayload;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { margin: 0; padding: 14px; background: #080D1A; color: #F1F5F9; font-size: 13px; line-height: 1.5; }
    .dialog {
      display: none;
      background: rgba(244, 63, 94, 0.18);
      border: 1px solid rgba(244, 63, 94, 0.65);
      color: #FECDD3;
      padding: 10px 12px;
      border-radius: 8px;
      margin-bottom: 12px;
      font-size: 12px;
    }
    .dialog.active { display: block; }
    .safe-pill {
      background: rgba(16, 185, 129, 0.14);
      border: 1px solid rgba(16, 185, 129, 0.45);
      color: #A7F3D0;
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 12px;
      font-size: 12px;
    }
    .target-box {
      background: #0F172A;
      border: 1px solid #1E293B;
      border-radius: 8px;
      padding: 12px;
    }
    .target-header {
      font-size: 11px;
      color: #38BDF8;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 6px;
      font-weight: 600;
    }
    .payload-slot {
      background: #020617;
      border: 1px solid #1E293B;
      border-radius: 6px;
      padding: 10px;
      color: #E2E8F0;
      word-break: break-word;
    }
  </style>
  <script>
    window.alert = function(msg) {
      var text = String(msg !== undefined ? msg : 'XSS Security Test');
      window.addEventListener('DOMContentLoaded', function() {
        triggerBanner(text);
      });
      triggerBanner(text);
    };
    function triggerBanner(text) {
      var el = document.getElementById('alert-banner');
      var msgEl = document.getElementById('alert-text');
      if (el && msgEl) {
        el.classList.add('active');
        msgEl.textContent = 'Isolated Victim Browser Executed: alert("' + text + '")';
      }
    }
  </script>
</head>
<body>
  <div id="alert-banner" class="dialog">
    <div style="font-weight:700;color:#FDA4AF;margin-bottom:2px;">VULNERABILITY TRIGGERED IN SANDBOXED BROWSER</div>
    <div id="alert-text"></div>
  </div>
  ${
    securityMode === 'secure'
      ? `<div class="safe-pill"><strong>Secure Mode Active:</strong> Input was encoded as literal text. Zero JavaScript executed.</div>`
      : ''
  }
  <div class="target-box">
    <div class="target-header">${activeTargetInfo.label} · ${activeTargetInfo.contextName}</div>
    <div class="payload-slot">${renderedContent}</div>
  </div>
</body>
</html>`;
  }, [executedPayload, securityMode, activeTargetInfo]);

  return (
    <div className="space-y-8">
      {/* Top Banner & Mode Switch */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400">
              Three-Panel Interactive Exploitation &amp; Remediation Workbench
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mt-1">
              XSS Attack Simulator — Attacker vs. Victim Environment
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Craft an educational test case in the <strong>Attacker Environment</strong>, send it to
              a realistic target in the <strong>Vulnerable Website</strong>, and observe the live
              result inside the isolated <strong>Victim Browser</strong>. Toggle between Vulnerable
              and Secure modes at any time.
            </p>
          </div>

          {/* Global Vulnerable vs Secure Mode Switch */}
          <div className="flex items-center bg-slate-950 border border-slate-800 p-1.5 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setSecurityMode('vulnerable')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                securityMode === 'vulnerable'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Vulnerable Training Mode
            </button>
            <button
              type="button"
              onClick={() => setSecurityMode('secure')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                securityMode === 'secure'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Secure Remediated Mode
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          THREE-PANEL SIMULATOR INTERFACE
      ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* PANEL 1: ATTACKER ENVIRONMENT */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <h2 className="text-base font-bold text-slate-100">Attacker Environment</h2>
              </div>
              <span className="text-xs font-mono text-amber-400">Payload Console</span>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Select XSS Category
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(['Reflected XSS', 'Stored XSS', 'DOM-Based XSS'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSelectCategory(cat)}
                    className={`px-2 py-1.5 text-[11px] font-semibold rounded transition-colors truncate ${
                      selectedCategory === cat
                        ? 'bg-cyan-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat.replace(' XSS', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Educational Test Case Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Select Educational Test Case
              </label>
              <div className="space-y-1.5">
                {SIMULATOR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors flex items-center justify-between gap-2 ${
                      selectedPresetId === preset.id
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{preset.label}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {preset.category.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payload Input Editor */}
            <form onSubmit={handleExecuteTest} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Payload Input Editor
                </label>
                <textarea
                  rows={3}
                  value={payloadInput}
                  onChange={(e) => setPayloadInput(e.target.value)}
                  aria-label="Attacker payload editor"
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-amber-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5" />
                  Execute Test
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Explanation of Selected Payload */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-1.5">
            <div className="text-xs font-semibold text-cyan-400">
              Selected Payload Explanation
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{currentPreset.explanation}</p>
          </div>
        </div>

        {/* PANEL 2: VULNERABLE WEBSITE */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h2 className="text-base font-bold text-slate-100">Vulnerable Website</h2>
              </div>
              <span className="text-xs font-mono text-cyan-400">Target Application</span>
            </div>

            {/* 5 Target Selectors */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Select Target Application Surface
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5">
                {(
                  [
                    { id: 'search', label: 'Search Page', icon: <Search className="w-3.5 h-3.5" /> },
                    {
                      id: 'comment',
                      label: 'Comment Section',
                      icon: <MessageSquare className="w-3.5 h-3.5" />
                    },
                    { id: 'profile', label: 'User Profile', icon: <User className="w-3.5 h-3.5" /> },
                    { id: 'review', label: 'Product Review', icon: <Star className="w-3.5 h-3.5" /> },
                    { id: 'url', label: 'URL-Based Page', icon: <Link2 className="w-3.5 h-3.5" /> }
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTargetMode(t.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
                      targetMode === t.id
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {t.icon}
                    <span className="truncate">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Target Processing View */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Active Surface:</span>
                <span className="font-semibold text-slate-200">{activeTargetInfo.contextName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Rendering Mechanism:</span>
                <span
                  className={`font-mono ${
                    securityMode === 'vulnerable' ? 'text-rose-300' : 'text-emerald-300'
                  }`}
                >
                  {activeTargetInfo.sinkUsed}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-400 mb-1">
                  Server / DOM Output Constructed by Target:
                </div>
                <pre
                  className={`p-2.5 bg-slate-900 border border-slate-800 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap ${
                    securityMode === 'vulnerable' ? 'text-rose-300' : 'text-emerald-300'
                  }`}
                >
                  {securityMode === 'vulnerable'
                    ? `<div class="output">${executedPayload}</div>`
                    : `<div class="output">${encodeEntities(executedPayload)}</div>`}
                </pre>
              </div>
            </div>
          </div>

          {/* Why Vulnerability Occurred vs How Secure Mode Fixes It */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div
              className={`text-xs font-semibold ${
                securityMode === 'vulnerable' ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {securityMode === 'vulnerable'
                ? 'Why the Vulnerability Occurred'
                : 'How Secure Mode Neutralized the Payload'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {securityMode === 'vulnerable'
                ? currentPreset.whyItHappens
                : currentPreset.howSecureModeFixesIt}
            </p>
          </div>
        </div>

        {/* PANEL 3: VICTIM BROWSER */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {securityMode === 'vulnerable' ? (
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                )}
                <h2 className="text-base font-bold text-slate-100">Victim Browser</h2>
              </div>
              <span
                className={`text-xs font-mono ${
                  securityMode === 'vulnerable' ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {securityMode === 'vulnerable' ? 'Vulnerable State' : 'Protected State'}
              </span>
            </div>

            {/* Simulated Browser Address Bar */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
              <div className="text-[10px] text-slate-400 mb-0.5">Victim Browser Address Bar</div>
              <div className="text-xs font-mono text-cyan-300 truncate">{activeTargetInfo.url}</div>
            </div>

            {/* Sandboxed Iframe Preview */}
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
              <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Sandboxed Victim Viewport</span>
                <span>sandbox="allow-scripts"</span>
              </div>
              <iframe
                title="Victim Browser Isolated Preview"
                sandbox="allow-scripts"
                srcDoc={victimBrowserSrcDoc}
                className="w-full h-56 border-0"
              />
            </div>
          </div>

          {/* Security Status Notification */}
          <div
            className={`rounded-lg p-3.5 border text-xs ${
              securityMode === 'vulnerable'
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <div className="font-semibold mb-1">
              {securityMode === 'vulnerable'
                ? 'Vulnerability Notification: Unsanitized Output Rendered'
                : 'Security Status: Output Encoded & Safe'}
            </div>
            <p className="text-slate-300">
              {securityMode === 'vulnerable'
                ? 'Switch to "Secure Remediated Mode" at the top right and observe how the exact same input is rendered safely as plain text.'
                : 'Even with a script payload submitted, the browser renders literal characters with zero script execution.'}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================================
          VICTIM IMPACT VISUALIZATION SECTION (Section 10 Requirement)
      ===================================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="text-xs font-mono text-purple-400">
              Victim Impact Visualization · Non-Destructive Educational Scenarios
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              Understanding Possible Victim Impacts &amp; Security Controls
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl">
              Explore what can happen inside a victim browser when an XSS vulnerability is exploited,
              and how layered security controls prevent each scenario.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 border border-slate-800 p-1.5 rounded-xl shrink-0">
            {(
              [
                { id: 'page-load', label: 'Affected Page Load' },
                { id: 'alert-box', label: 'Browser Alert Proof' },
                { id: 'content-change', label: 'Page Manipulation' },
                { id: 'fake-login', label: 'UI Spoofing Illustration' }
              ] as const
            ).map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => setActiveImpactScenario(sc.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeImpactScenario === sc.id
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Core Impact Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Session Compromise Risk',
              risk: 'If session cookies do not have the HttpOnly flag, injected JavaScript can access document.cookie within the browser.',
              control: 'Set the HttpOnly, Secure, and SameSite=Strict flags on all authentication cookies.'
            },
            {
              title: 'Account Takeover Risk',
              risk: 'An injected script running inside an authenticated session can call password/email change endpoints if re-authentication is not required.',
              control: 'Require current password verification or multi-factor re-authentication for sensitive account changes.'
            },
            {
              title: 'Information Exposure',
              risk: 'Scripts executing in the page origin can read sensitive personal data, grades, or messages displayed inside the DOM.',
              control: 'Apply strict output encoding on all pages and enforce Content Security Policy (CSP) connect-src limits.'
            },
            {
              title: 'Page Manipulation (DOM Defacement)',
              risk: 'Injected code can rewrite headings, alter displayed figures, or change instructions shown to the victim user.',
              control: 'Render user content strictly via textContent so external input can never mutate DOM elements.'
            },
            {
              title: 'UI Spoofing & Phishing Prompts',
              risk: 'Attackers can inject realistic HTML forms inside a trusted page to mislead users into entering information.',
              control: 'Encode HTML angle brackets (< and >) and sanitize rich text so <form> and <input> tags cannot be injected.'
            },
            {
              title: 'Unauthorized Session Actions',
              risk: 'The script can trigger automated form submissions or API calls from the victim browser without user consent.',
              control: 'Combine XSS prevention (Output Encoding + CSP) with step-up confirmation for critical actions.'
            }
          ].map((card) => (
            <div
              key={card.title}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-100">{card.title}</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{card.risk}</p>
              </div>
              <div className="pt-2.5 border-t border-slate-800/80 text-xs text-emerald-300">
                <strong>Security Control: </strong>
                <span className="text-slate-300">{card.control}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Visual Scenario Stage */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <div className="text-xs font-mono text-cyan-400">
              Interactive Visual Scenario Walkthrough
            </div>
            {activeImpactScenario === 'page-load' && (
              <>
                <h3 className="text-lg font-bold text-slate-100">
                  Scenario: A Victim Opens an Affected Page
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  The user navigates normally to a discussion board or course catalog page. Because
                  a stored comment or reflected parameter was not encoded, the browser parses the
                  injected tag automatically in the background as part of loading the page.
                </p>
              </>
            )}
            {activeImpactScenario === 'alert-box' && (
              <>
                <h3 className="text-lg font-bold text-slate-100">
                  Scenario: An Unexpected Browser Alert Appears
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  In ethical hacking and university demonstrations, <code className="text-cyan-300">alert('XSS Test')</code>{' '}
                  is used as a harmless visual indicator. Seeing the dialog proves that untrusted text
                  broke out of the data context and executed inside the JavaScript engine.
                </p>
              </>
            )}
            {activeImpactScenario === 'content-change' && (
              <>
                <h3 className="text-lg font-bold text-slate-100">
                  Scenario: Webpage Content Changes Unexpectedly
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Because JavaScript has full access to the Document Object Model (DOM), an injected
                  script can change headings, announcements, or status notices on the victim screen
                  in real time.
                </p>
              </>
            )}
            {activeImpactScenario === 'fake-login' && (
              <>
                <h3 className="text-lg font-bold text-slate-100">
                  Scenario: Visual Illustration of Injected UI Prompt (Non-Submitting)
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  If an application allows raw HTML injection, an attacker could inject markup that
                  looks like a "Session Expired" box inside the trusted page. (Note: The visual box on
                  the right is a static, non-submitting educational illustration—never enter real
                  credentials).
                </p>
              </>
            )}
          </div>

          {/* Visual Illustration Frame */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Simulated Victim Browser View (Educational Illustration)</span>
              <span className="text-cyan-400">Read-Only Demo</span>
            </div>

            {activeImpactScenario === 'page-load' && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs">
                <div className="text-slate-200 font-semibold">University Lecture Discussion Thread</div>
                <div className="text-slate-400">Loading comments from database...</div>
                <div className="p-2.5 bg-rose-950/30 border border-rose-500/40 rounded text-rose-200 font-mono">
                  Parser Warning: Unencoded &lt;script&gt; encountered in Comment Row — executing in page origin.
                </div>
              </div>
            )}

            {activeImpactScenario === 'alert-box' && (
              <div className="p-4 bg-slate-950 border border-amber-500/40 rounded-lg space-y-2 text-xs">
                <div className="font-mono font-bold text-amber-300">
                  academy-target.local says:
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 text-slate-100 font-mono">
                  "XSS Security Test — Proof of Concept Executed"
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-cyan-500 text-slate-950 font-semibold rounded">
                    OK
                  </span>
                </div>
              </div>
            )}

            {activeImpactScenario === 'content-change' && (
              <div className="p-4 bg-slate-950 border border-rose-500/40 rounded-lg space-y-2 text-xs">
                <div className="text-slate-400 line-through">
                  Original Heading: Final Exam Schedule — Room 204
                </div>
                <div className="text-rose-300 font-bold text-sm">
                  Modified by DOM Script: Exam Cancelled Today!
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Executed: document.querySelector('h1').textContent = 'Exam Cancelled Today!';
                </div>
              </div>
            )}

            {activeImpactScenario === 'fake-login' && (
              <div className="p-4 bg-slate-950 border border-purple-500/40 rounded-lg space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-purple-300 font-semibold">
                  <span>Visual Illustration: Spoofed Modal Overlay (Static / Disabled)</span>
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-slate-400 font-mono">
                  [Disabled Educational Illustration — Input Fields Not Interactive]
                </div>
                <div className="text-[11px] text-emerald-300">
                  Prevention: Encoding &lt;form&gt; and &lt;input&gt; tags stops HTML UI injection completely.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
