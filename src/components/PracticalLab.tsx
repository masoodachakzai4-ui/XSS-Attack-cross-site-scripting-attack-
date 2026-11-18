import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MessageSquare,
  Globe,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Play,
  Code2,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export type LabTab = 'reflected' | 'stored' | 'dom';

interface StoredComment {
  id: string;
  username: string;
  comment: string;
  timestamp: string;
}

interface PracticalLabProps {
  initialLab?: LabTab;
  preloadedPayload?: string | null;
  onClearPreloadedPayload?: () => void;
}

const STORAGE_KEY_COMMENTS = 'xss_security_lab_stored_comments_v1';

const DEFAULT_COMMENTS: StoredComment[] = [
  {
    id: 'c-1',
    username: 'Amina Khan (CS-301)',
    comment: 'The lecture slides on HTTP cookies and session management were very clear!',
    timestamp: '10:15 AM'
  },
  {
    id: 'c-2',
    username: 'Bilal Ahmed (Lab TA)',
    comment: 'Reminder: Always test your input validation before submitting the lab assignment.',
    timestamp: '10:42 AM'
  }
];

function encodeHTMLEntities(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generates an isolated srcDoc HTML page for the sandboxed iframe.
 * Inside the sandbox, window.alert is overridden so that it displays a visual
 * browser alert banner inside the sandboxed preview without ever calling the
 * host window's native alert().
 */
function buildSandboxedDocument(options: {
  title: string;
  mode: 'vulnerable' | 'safe';
  bodyMarkup: string;
}): string {
  const { title, mode, bodyMarkup } = options;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body {
      margin: 0;
      padding: 14px;
      background: #090D16;
      color: #E2E8F0;
      font-size: 13px;
      line-height: 1.5;
    }
    .alert-banner {
      display: none;
      background: rgba(244, 63, 94, 0.16);
      border: 1px solid rgba(244, 63, 94, 0.55);
      color: #FECDD3;
      padding: 10px 12px;
      border-radius: 8px;
      margin-bottom: 12px;
      font-size: 12px;
    }
    .alert-banner.visible {
      display: block;
    }
    .alert-title {
      font-weight: 700;
      color: #FDA4AF;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .safe-banner {
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #A7F3D0;
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 12px;
      font-size: 12px;
    }
    .card {
      background: #111827;
      border: 1px solid #1F2937;
      border-radius: 8px;
      padding: 12px;
    }
    .comment-item {
      border-bottom: 1px solid #1F2937;
      padding: 8px 0;
    }
    .comment-item:last-child { border-bottom: none; }
    .comment-author { font-weight: 600; color: #38BDF8; font-size: 12px; }
    .comment-body { margin-top: 3px; color: #F1F5F9; word-break: break-word; }
    code { font-family: monospace; background: #030712; padding: 2px 5px; border-radius: 4px; }
  </style>
  <script>
    window.__alertsTriggered = [];
    window.alert = function(msg) {
      var text = String(msg !== undefined ? msg : 'XSS Demonstration');
      window.__alertsTriggered.push(text);
      window.addEventListener('DOMContentLoaded', function() {
        showAlertBox(text);
      });
      showAlertBox(text);
    };
    function showAlertBox(text) {
      var box = document.getElementById('sandbox-alert-box');
      var msgEl = document.getElementById('sandbox-alert-msg');
      if (box && msgEl) {
        box.classList.add('visible');
        msgEl.textContent = 'JavaScript alert("' + text + '") executed inside isolated sandbox!';
      }
    }
  </script>
</head>
<body>
  <div id="sandbox-alert-box" class="alert-banner">
    <div class="alert-title">
      <span>SANDBOXED BROWSER DIALOG TRIGGERED</span>
      <span>[alert()]</span>
    </div>
    <div id="sandbox-alert-msg"></div>
  </div>
  ${
    mode === 'safe'
      ? `<div class="safe-banner"><strong>Safe Rendering Active:</strong> Untrusted input was encoded as literal text. Zero scripts executed.</div>`
      : ''
  }
  <div class="card">
    <div style="font-size:11px;color:#94A3B8;margin-bottom:6px;">${title}</div>
    <div id="sandbox-output">${bodyMarkup}</div>
  </div>
</body>
</html>`;
}

export const PracticalLab: React.FC<PracticalLabProps> = ({
  initialLab = 'reflected',
  preloadedPayload,
  onClearPreloadedPayload
}) => {
  const [activeLab, setActiveLab] = useState<LabTab>(initialLab);

  // Lab 1: Reflected XSS State
  const [reflectedInput, setReflectedInput] = useState<string>(
    `<script>alert('XSS Demonstration')</script>`
  );
  const [submittedQuery, setSubmittedQuery] = useState<string>(
    `<script>alert('XSS Demonstration')</script>`
  );

  // Lab 2: Stored XSS State
  const [storedMode, setStoredMode] = useState<'vulnerable' | 'safe'>('vulnerable');
  const [usernameInput, setUsernameInput] = useState<string>('Student Tester');
  const [commentInput, setCommentInput] = useState<string>(
    `<script>alert('XSS Demonstration')</script>`
  );
  const [comments, setComments] = useState<StoredComment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMMENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to defaults if localStorage is unavailable
    }
    return DEFAULT_COMMENTS;
  });

  // Lab 3: DOM-Based XSS State
  const [domUrlInput, setDomUrlInput] = useState<string>(
    `https://portal.university.edu/dashboard#tab=<img src=x onerror=alert('XSS Demonstration')>`
  );
  const [domMode, setDomMode] = useState<'vulnerable' | 'safe'>('vulnerable');

  useEffect(() => {
    setActiveLab(initialLab);
  }, [initialLab]);

  useEffect(() => {
    if (preloadedPayload) {
      if (activeLab === 'reflected') {
        setReflectedInput(preloadedPayload);
        setSubmittedQuery(preloadedPayload);
      } else if (activeLab === 'stored') {
        setCommentInput(preloadedPayload);
      } else if (activeLab === 'dom') {
        setDomUrlInput(`https://portal.university.edu/dashboard#tab=${preloadedPayload}`);
      }
      if (onClearPreloadedPayload) {
        onClearPreloadedPayload();
      }
    }
  }, [preloadedPayload, activeLab, onClearPreloadedPayload]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
    } catch {
      // Ignore storage quota errors
    }
  }, [comments]);

  // Handlers for Lab 1
  const handleRunReflectedSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(reflectedInput);
  };

  // Handlers for Lab 2
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newEntry: StoredComment = {
      id: `c-${Date.now()}`,
      username: usernameInput.trim() || 'Anonymous Student',
      comment: commentInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setComments((prev) => [...prev, newEntry]);
  };

  const handleResetComments = () => {
    setComments(DEFAULT_COMMENTS);
    try {
      localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(DEFAULT_COMMENTS));
    } catch {
      // Ignore
    }
  };

  // Derived data for Lab 3
  const extractedHashPayload = useMemo(() => {
    const hashIndex = domUrlInput.indexOf('#');
    if (hashIndex === -1) return 'Overview (Default — no # fragment present)';
    const rawFragment = domUrlInput.slice(hashIndex + 1);
    return rawFragment.replace(/^tab=/i, '') || 'Overview';
  }, [domUrlInput]);

  // Sandboxed documents
  const reflectedVulnerableSrcDoc = useMemo(
    () =>
      buildSandboxedDocument({
        title: 'Simulated Course Search Results (Vulnerable Raw HTML Output)',
        mode: 'vulnerable',
        bodyMarkup: `<div><strong>Search Results for:</strong> ${submittedQuery}</div>`
      }),
    [submittedQuery]
  );

  const storedSandboxSrcDoc = useMemo(() => {
    const renderedList = comments
      .map((item) => {
        const author =
          storedMode === 'safe' ? encodeHTMLEntities(item.username) : item.username;
        const body =
          storedMode === 'safe' ? encodeHTMLEntities(item.comment) : item.comment;
        return `<div class="comment-item">
          <div class="comment-author">${author} <span style="color:#64748B;font-weight:400;">· ${item.timestamp}</span></div>
          <div class="comment-body">${body}</div>
        </div>`;
      })
      .join('');

    return buildSandboxedDocument({
      title: `Course Discussion Comments (${
        storedMode === 'vulnerable' ? 'Vulnerable innerHTML Rendering' : 'Safe Encoded Rendering'
      })`,
      mode: storedMode,
      bodyMarkup: renderedList
    });
  }, [comments, storedMode]);

  const domSandboxSrcDoc = useMemo(() => {
    const content =
      domMode === 'safe'
        ? encodeHTMLEntities(extractedHashPayload)
        : extractedHashPayload;
    return buildSandboxedDocument({
      title: `Portal View Container (#tab-banner via ${
        domMode === 'vulnerable' ? 'element.innerHTML' : 'element.textContent'
      })`,
      mode: domMode,
      bodyMarkup: `<div><strong>Active Portal Tab:</strong> ${content}</div>`
    });
  }, [extractedHashPayload, domMode]);

  return (
    <div className="space-y-6">
      {/* Safety Isolation Notice & Lab Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="text-xs text-emerald-400 font-medium">
              Controlled Local Browser Sandbox · Isolated Educational Environment
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mt-1">
              XSS Practical Training Lab
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Experiment with Reflected, Stored, and DOM-Based XSS in a safe, local simulator.
              Untrusted payloads are strictly isolated inside a restricted sandboxed iframe preview and
              never execute in the host website.
            </p>
          </div>

          {/* Lab Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 border border-slate-800 p-1.5 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setActiveLab('reflected')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeLab === 'reflected'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Reflected XSS
            </button>
            <button
              type="button"
              onClick={() => setActiveLab('stored')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeLab === 'stored'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Stored XSS
            </button>
            <button
              type="button"
              onClick={() => setActiveLab('dom')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeLab === 'dom'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              DOM-Based XSS
            </button>
          </div>
        </div>

        {/* =========================================================
            REFLECTED XSS SIMULATOR
        ========================================================= */}
        {activeLab === 'reflected' && (
          <div className="pt-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-cyan-400 font-mono">
                  Non-Persistent Search Reflection Simulator
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mt-0.5">
                  Reflected XSS Simulator — University Course Catalog Search
                </h3>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                  Enter a search term or click a preset test payload below to compare how a
                  vulnerable server response vs. a properly encoded response handles your input.
                </p>
              </div>

              {/* Preset Test Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const p = `<script>alert('XSS Demonstration')</script>`;
                    setReflectedInput(p);
                    setSubmittedQuery(p);
                  }}
                  className="px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Load &lt;script&gt; Payload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const p = `<h2>XSS Security Test</h2>`;
                    setReflectedInput(p);
                    setSubmittedQuery(p);
                  }}
                  className="px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Load &lt;h2&gt; HTML Probe
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const p = `Cybersecurity 101`;
                    setReflectedInput(p);
                    setSubmittedQuery(p);
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Load Normal Search
                </button>
              </div>
            </div>

            {/* Simulated Search Form */}
            <form
              onSubmit={handleRunReflectedSearch}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>SIMULATED URL: https://catalog.university.edu/search?q={encodeURIComponent(submittedQuery)}</span>
                <span>Method: HTTP GET</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={reflectedInput}
                    onChange={(e) => setReflectedInput(e.target.value)}
                    placeholder="Type a search query or harmless XSS payload..."
                    aria-label="Simulated search query input"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Play className="w-4 h-4" />
                  Search Catalog
                </button>
              </div>
            </form>

            {/* Side-by-Side Vulnerable vs Safe Output Demonstration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left: Vulnerable Output Demo */}
              <div className="bg-slate-950 border border-rose-500/40 rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>Vulnerable Output Demonstration (Raw HTML Reflection)</span>
                    </div>
                    <span className="text-xs font-mono text-rose-300">UNSAFE: innerHTML</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Here, the application places your search query directly into the HTML response without
                    encoding. When the browser sees <code className="text-rose-300">&lt;script&gt;</code>, it
                    switches from HTML mode to JavaScript execution mode:
                  </p>

                  {/* Isolated Sandboxed Iframe Preview */}
                  <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
                    <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                      <span>Isolated Victim Browser Sandbox (sandbox="allow-scripts")</span>
                      <span className="text-rose-400">Unencoded Output</span>
                    </div>
                    <iframe
                      title="Reflected XSS Vulnerable Sandbox"
                      sandbox="allow-scripts"
                      srcDoc={reflectedVulnerableSrcDoc}
                      className="w-full h-40 border-0"
                    />
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                  <div className="text-[11px] text-slate-400 mb-1">
                    Raw HTML Sent to Browser (Notice unescaped tags):
                  </div>
                  <pre className="text-xs font-mono text-rose-300 overflow-x-auto whitespace-pre-wrap">
                    {`<div><strong>Search Results for:</strong> ${submittedQuery}</div>`}
                  </pre>
                </div>
              </div>

              {/* Right: Safe Output Demo */}
              <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>Safe Output Demonstration (Plain-Text / Output Encoded)</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-300">SAFE: textContent</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    In the safe version, special characters (<code className="text-emerald-300">&lt;</code> and{' '}
                    <code className="text-emerald-300">&gt;</code>) are converted into HTML entities or assigned via{' '}
                    <code className="text-emerald-300">textContent</code>. The payload is displayed harmlessly as literal text:
                  </p>

                  {/* Safe Plain-Text Rendering Box */}
                  <div className="border border-slate-800 rounded-lg bg-slate-900 p-4 space-y-3 min-h-[10rem]">
                    <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-md px-3 py-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Safe Text Rendering Verified: Payload rendered as plain characters. Zero script execution.</span>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100">
                      <span className="font-semibold text-slate-300">Search Results for: </span>
                      <span className="font-mono text-emerald-300 break-all">{submittedQuery}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                  <div className="text-[11px] text-slate-400 mb-1">
                    Encoded HTML Sent to Browser (Angle brackets neutralized):
                  </div>
                  <pre className="text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                    {`<div><strong>Search Results for:</strong> ${encodeHTMLEntities(submittedQuery)}</div>`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Explanation of Why the Vulnerability Happens */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-cyan-400">Why the Vulnerability Happens</h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  HTML mixes structure (<code className="text-slate-200">&lt;div&gt;</code>,{' '}
                  <code className="text-slate-200">&lt;script&gt;</code>) and content in the same text stream.
                  When a server concatenates raw user input into HTML, the browser cannot tell where developer
                  markup ends and user data begins.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-rose-400">How Unsafe HTML Interpretation Runs It</h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  As the browser HTML parser reads the response, encountering an unencoded{' '}
                  <code className="text-slate-200">&lt;script&gt;</code> tag instructs the parser to pause HTML
                  layout and hand the inner text directly to the JavaScript engine.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-emerald-400">How Safe Encoding Prevents Execution</h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Replacing <code className="text-slate-200">&lt;</code> with{' '}
                  <code className="text-slate-200">&amp;lt;</code> and <code className="text-slate-200">&gt;</code> with{' '}
                  <code className="text-slate-200">&amp;gt;</code> (or using <code className="text-slate-200">textContent</code>)
                  tells the browser to draw those symbols on screen without ever starting the script engine.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            STORED XSS SIMULATOR
        ========================================================= */}
        {activeLab === 'stored' && (
          <div className="pt-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-cyan-400 font-mono">
                  Persistent Database Comment Simulator (LocalStorage Backed)
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mt-0.5">
                  Stored XSS Simulator — Student Lecture Discussion Board
                </h3>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                  Post a comment containing a test payload into the simulated database and switch between
                  Vulnerable Mode and Safe Mode to see how persistent scripts behave.
                </p>
              </div>

              {/* Safe vs Vulnerable Mode Switch */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setStoredMode('vulnerable')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      storedMode === 'vulnerable'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Vulnerable Mode (innerHTML)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStoredMode('safe')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      storedMode === 'safe'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Safe Mode (Encoded / textContent)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleResetComments}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset Database ({comments.length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Comment Submission Form */}
              <form
                onSubmit={handleAddComment}
                className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-100">
                    Submit Comment to Simulated Database
                  </h4>
                  <span className="text-xs font-mono text-slate-400">Table: course_comments</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter student name..."
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Comment / Test Payload
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setCommentInput(`<script>alert('XSS Demonstration')</script>`)
                        }
                        className="text-[11px] font-mono text-cyan-400 hover:underline"
                      >
                        + &lt;script&gt;
                      </button>
                      <span className="text-slate-600">·</span>
                      <button
                        type="button"
                        onClick={() =>
                          setCommentInput(`<img src=x onerror=alert('Stored XSS Demo')>`)
                        }
                        className="text-[11px] font-mono text-amber-400 hover:underline"
                      >
                        + &lt;img onerror&gt;
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Write a comment or paste a harmless test payload..."
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm rounded-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Post Comment to Database
                </button>

                {/* Stored Records Table Inspection */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="text-xs font-medium text-slate-300">
                    Raw Records in LocalStorage Database ({comments.length} rows):
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {comments.map((c, i) => (
                      <div
                        key={c.id}
                        className="bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-mono"
                      >
                        <div className="text-slate-400">
                          Row #{i + 1} · <span className="text-cyan-300">{c.username}</span>
                        </div>
                        <div className="text-slate-200 truncate mt-0.5">{c.comment}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>

              {/* Right Column: Sandboxed Visitor View + Safe Host View */}
              <div className="lg:col-span-7 space-y-4">
                <div
                  className={`bg-slate-950 border rounded-xl p-5 space-y-3 ${
                    storedMode === 'vulnerable' ? 'border-rose-500/40' : 'border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      {storedMode === 'vulnerable' ? (
                        <>
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          <span className="text-rose-300">
                            Simulated Visitor Browser — Vulnerable Mode Active
                          </span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-300">
                            Simulated Visitor Browser — Safe Encoded Mode Active
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      sandbox="allow-scripts"
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    {storedMode === 'vulnerable'
                      ? 'Every visitor who opens this page receives all stored comments rendered as raw HTML. Any script stored in the database runs automatically on page load:'
                      : 'All stored comments are HTML-encoded before rendering. Even though the script string is still inside the database, it displays harmlessly as plain text:'}
                  </p>

                  <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
                    <iframe
                      title="Stored XSS Isolated Sandbox"
                      sandbox="allow-scripts"
                      srcDoc={storedSandboxSrcDoc}
                      className="w-full h-64 border-0"
                    />
                  </div>
                </div>

                {/* Host Application Safe Comment List */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs font-semibold text-emerald-400 mb-2">
                    Main Website Safe Comment Preview (React Auto-Escaped Text Nodes):
                  </div>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {comments.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-900/80 border border-slate-800/80 rounded-lg px-3 py-2 text-xs"
                      >
                        <span className="font-semibold text-cyan-300">{item.username}</span>
                        <span className="text-slate-500"> · {item.timestamp}: </span>
                        <span className="font-mono text-slate-200 break-all">{item.comment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            DOM-BASED XSS SIMULATOR
        ========================================================= */}
        {activeLab === 'dom' && (
          <div className="pt-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-cyan-400 font-mono">
                  Client-Side JavaScript Source-to-Sink Simulator
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mt-0.5">
                  DOM-Based XSS Simulator — URL Hash Fragment Inspector
                </h3>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                  Trace how untrusted data in a URL <code className="text-cyan-300">#hash</code>{' '}
                  <strong>Source</strong> travels through client-side JavaScript into a DOM{' '}
                  <strong>Sink</strong> without touching the backend server.
                </p>
              </div>

              {/* Preset URL Payloads */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDomUrlInput(
                      `https://portal.university.edu/dashboard#tab=<img src=x onerror=alert('XSS Demonstration')>`
                    );
                    setDomMode('vulnerable');
                  }}
                  className="px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Load #tab=&lt;img onerror&gt;
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDomUrlInput(
                      `https://portal.university.edu/dashboard#tab=<h2>Injected Portal Header</h2>`
                    );
                    setDomMode('vulnerable');
                  }}
                  className="px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Load #tab=&lt;h2&gt;
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDomUrlInput(`https://portal.university.edu/dashboard#tab=CourseSchedule`);
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Load Normal #tab=CourseSchedule
                </button>
              </div>
            </div>

            {/* Simulated Browser Address Bar */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 font-medium">
                  Simulated Browser Address Bar (Modify the URL fragment after <code className="text-cyan-300">#tab=</code>):
                </span>
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setDomMode('vulnerable')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                      domMode === 'vulnerable'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Unsafe Sink (innerHTML)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDomMode('safe')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                      domMode === 'safe'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Safe Sink (textContent)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  value={domUrlInput}
                  onChange={(e) => setDomUrlInput(e.target.value)}
                  aria-label="Simulated URL input for DOM XSS"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs md:text-sm font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Source -> Data Flow -> Sink Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-mono text-amber-400">JAVASCRIPT SOURCE</div>
                <div className="text-sm font-semibold text-slate-100 mt-1">
                  window.location.hash
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  JavaScript reads the substring after <code className="text-slate-200">#tab=</code> directly in the browser:
                </p>
                <div className="mt-3 p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-amber-300 break-all">
                  {extractedHashPayload}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-mono text-cyan-400">CLIENT-SIDE PROCESSING</div>
                <div className="text-sm font-semibold text-slate-100 mt-1">
                  {domMode === 'vulnerable'
                    ? 'No Validation / Raw Concatenation'
                    : 'Allowlist Check & Safe Text Assignment'}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {domMode === 'vulnerable'
                    ? 'The untrusted string is passed straight into an HTML-parsing sink without escaping.'
                    : 'The string is assigned via textContent so angle brackets are never parsed as HTML tags.'}
                </p>
                <div className="mt-3 p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300">
                  {domMode === 'vulnerable'
                    ? `banner.innerHTML = "${extractedHashPayload}"`
                    : `banner.textContent = "${extractedHashPayload}"`}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div
                  className={`text-xs font-mono ${
                    domMode === 'vulnerable' ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  DOM SINK RESULT
                </div>
                <div className="text-sm font-semibold text-slate-100 mt-1">
                  {domMode === 'vulnerable'
                    ? 'Unsafe Sink: element.innerHTML'
                    : 'Safe Sink: element.textContent'}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {domMode === 'vulnerable'
                    ? 'HTML elements and onerror event handlers are created in the live DOM tree.'
                    : 'A pure DOM TextNode is updated. Zero new HTML elements or scripts can be created.'}
                </p>
                <div
                  className={`mt-3 p-2.5 bg-slate-900 border rounded-lg text-xs font-mono ${
                    domMode === 'vulnerable'
                      ? 'border-rose-500/40 text-rose-300'
                      : 'border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {domMode === 'vulnerable'
                    ? 'DOM Tree Mutated -> Event Handler Fired'
                    : 'Safe TextNode Rendered -> No Execution'}
                </div>
              </div>
            </div>

            {/* Live Sandboxed Preview & Code Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-100">
                    Isolated DOM Execution Preview
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Mode: {domMode === 'vulnerable' ? 'Vulnerable innerHTML' : 'Safe textContent'}
                  </span>
                </div>
                <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
                  <iframe
                    title="DOM XSS Isolated Sandbox"
                    sandbox="allow-scripts"
                    srcDoc={domSandboxSrcDoc}
                    className="w-full h-44 border-0"
                  />
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300">
                  <strong className="text-emerald-400">Safe Main-Page Rendering: </strong>
                  <span>Active Portal Tab: </span>
                  <code className="text-cyan-300 break-all">{extractedHashPayload}</code>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <div>
                  <div className="text-xs font-mono text-rose-400 mb-1">
                    VULNERABLE CLIENT-SIDE JAVASCRIPT:
                  </div>
                  <pre className="p-3 bg-slate-900 border border-rose-500/30 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto">
{`// SOURCE: Untrusted URL hash fragment
const rawTab = location.hash.replace('#tab=', '');

// UNSAFE SINK: Parses HTML and fires onerror
document.getElementById('tab-banner').innerHTML =
  "Active Portal Tab: " + rawTab;`}
                  </pre>
                </div>

                <div>
                  <div className="text-xs font-mono text-emerald-400 mb-1">
                    SAFE CLIENT-SIDE JAVASCRIPT:
                  </div>
                  <pre className="p-3 bg-slate-900 border border-emerald-500/30 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto">
{`// SOURCE: Untrusted URL hash fragment
const rawTab = location.hash.replace('#tab=', '');

// SAFE SINK: Always renders as literal text
document.getElementById('tab-banner').textContent =
  "Active Portal Tab: " + rawTab;`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
