import React, { useState } from 'react';
import {
  ArrowRight,
  Terminal,
  Server,
  Globe,
  ShieldAlert,
  ShieldCheck,
  Database,
  Code2,
  Play,
  RotateCcw
} from 'lucide-react';

interface AttackFlowDiagramProps {
  variant: 'master' | 'reflected' | 'stored' | 'dom';
  compact?: boolean;
}

interface FlowNode {
  id: string;
  actorLabel: string;
  title: string;
  vulnerableDesc: string;
  safeDesc: string;
  packetCode: string;
  safePacketCode: string;
  icon: 'attacker' | 'server' | 'database' | 'browser' | 'impact' | 'dom';
}

const FLOW_CONFIGS: Record<
  'master' | 'reflected' | 'stored' | 'dom',
  {
    heading: string;
    subtitle: string;
    nodes: FlowNode[];
  }
> = {
  master: {
    heading: 'Interactive XSS Attack-Flow Architecture',
    subtitle: 'Attacker → Vulnerable Website → Victim Browser → Possible Security Impact',
    nodes: [
      {
        id: 'node-1',
        actorLabel: 'Origin',
        title: 'Attacker',
        vulnerableDesc: 'Crafts a harmless-looking URL or form submission containing an embedded JavaScript payload.',
        safeDesc: 'Submits the exact same crafted script input into the search bar or comment form.',
        packetCode: `<script>alert('XSS Demonstration')</script>`,
        safePacketCode: `<script>alert('XSS Demonstration')</script>`,
        icon: 'attacker'
      },
      {
        id: 'node-2',
        actorLabel: 'Delivery',
        title: 'Vulnerable Website',
        vulnerableDesc: 'Accepts the untrusted input and inserts it directly into the HTML response without output encoding.',
        safeDesc: 'Encodes special characters (<, >, ", \') into safe HTML entities before building the response.',
        packetCode: `<div>Results: <script>alert('XSS')</script></div>`,
        safePacketCode: `<div>Results: &lt;script&gt;alert('XSS')&lt;/script&gt;</div>`,
        icon: 'server'
      },
      {
        id: 'node-3',
        actorLabel: 'Execution',
        title: 'Victim Browser',
        vulnerableDesc: 'Parses the response HTML, encounters the unencoded <script> tag, and runs the JavaScript.',
        safeDesc: 'Renders the encoded entities strictly as harmless text characters on the screen.',
        packetCode: `JS Engine: Executing alert('XSS Demonstration')`,
        safePacketCode: `DOM Text Node: "<script>alert('XSS')</script>"`,
        icon: 'browser'
      },
      {
        id: 'node-4',
        actorLabel: 'Consequence',
        title: 'Possible Security Impact',
        vulnerableDesc: 'Unauthorized script runs inside the user session—modifying page content or reading unprotected data.',
        safeDesc: 'Attack neutralized: Zero script execution, session integrity and page structure remain intact.',
        packetCode: `STATUS: Unintended Script Executed in Session`,
        safePacketCode: `STATUS: Safe Plain-Text Rendering Verified`,
        icon: 'impact'
      }
    ]
  },
  reflected: {
    heading: 'Reflected XSS Request-Response Flow',
    subtitle: 'Crafted URL Parameter → Unencoded Server Reflection → Browser Execution',
    nodes: [
      {
        id: 'ref-1',
        actorLabel: 'Crafted Link',
        title: 'Attacker Crafts URL',
        vulnerableDesc: 'Places a test script inside the ?q= search query parameter of a link.',
        safeDesc: 'Places the same script inside the ?q= search query parameter.',
        packetCode: `/search?q=<script>alert('XSS')</script>`,
        safePacketCode: `/search?q=<script>alert('XSS')</script>`,
        icon: 'attacker'
      },
      {
        id: 'ref-2',
        actorLabel: 'HTTP Request',
        title: 'Victim Clicks Link',
        vulnerableDesc: 'The browser sends an HTTP GET request containing the unencoded query parameter to the website.',
        safeDesc: 'The browser sends the HTTP GET request to the web application.',
        packetCode: `GET /search?q=%3Cscript%3E... HTTP/1.1`,
        safePacketCode: `GET /search?q=%3Cscript%3E... HTTP/1.1`,
        icon: 'browser'
      },
      {
        id: 'ref-3',
        actorLabel: 'Server Reflection',
        title: 'Website Echoes Input',
        vulnerableDesc: 'The server reflects the raw search term directly into the HTML response body.',
        safeDesc: 'The application HTML-encodes the search parameter or binds it via textContent.',
        packetCode: `<p>Search for: <script>alert('XSS')</script></p>`,
        safePacketCode: `<p>Search for: &lt;script&gt;alert('XSS')&lt;/script&gt;</p>`,
        icon: 'server'
      },
      {
        id: 'ref-4',
        actorLabel: 'Browser Parse',
        title: 'Reflected Script Runs',
        vulnerableDesc: 'The victim browser interprets the reflected <script> tag as legitimate code from the site.',
        safeDesc: 'The browser displays the literal search string as harmless text without executing code.',
        packetCode: `Executed: alert('XSS Demonstration')`,
        safePacketCode: `Displayed as Text: <script>alert('XSS')</script>`,
        icon: 'impact'
      }
    ]
  },
  stored: {
    heading: 'Stored (Persistent) XSS Database Flow',
    subtitle: 'Form Submission → Database Persistence → Automatic Execution for Every Visitor',
    nodes: [
      {
        id: 'sto-1',
        actorLabel: 'Form Post',
        title: 'Attacker Posts Comment',
        vulnerableDesc: 'Submits a comment containing an HTML script or event-handler payload.',
        safeDesc: 'Submits a comment containing the same script payload.',
        packetCode: `POST /comments { body: "<script>alert('XSS')</script>" }`,
        safePacketCode: `POST /comments { body: "<script>alert('XSS')</script>" }`,
        icon: 'attacker'
      },
      {
        id: 'sto-2',
        actorLabel: 'Persistence',
        title: 'Database Storage',
        vulnerableDesc: 'The comment string is stored permanently inside the comments table.',
        safeDesc: 'The comment is stored, and sanitized/encoded before rendering.',
        packetCode: `INSERT INTO comments VALUES ('<script>alert("XSS")</script>')`,
        safePacketCode: `Stored safely; encoded on output read`,
        icon: 'database'
      },
      {
        id: 'sto-3',
        actorLabel: 'Page Load',
        title: 'Normal User Visits Page',
        vulnerableDesc: 'Any visitor opens the article page; the server embeds all stored comments into the HTML.',
        safeDesc: 'Visitor opens the page; each comment is rendered via textContent or HTML entity encoding.',
        packetCode: `<div class="comment"><script>alert('XSS')</script></div>`,
        safePacketCode: `<div class="comment">&lt;script&gt;alert('XSS')&lt;/script&gt;</div>`,
        icon: 'server'
      },
      {
        id: 'sto-4',
        actorLabel: 'Mass Impact',
        title: 'Executes in Every Browser',
        vulnerableDesc: 'Every visitor who reads the comment section automatically executes the stored script.',
        safeDesc: 'All visitors see the literal text string safely with zero script execution.',
        packetCode: `All Visitors: Script Executed Automatically`,
        safePacketCode: `All Visitors: Safe Plain-Text Comment Shown`,
        icon: 'impact'
      }
    ]
  },
  dom: {
    heading: 'DOM-Based XSS Client-Side Flow',
    subtitle: 'URL Source (location.hash) → Client-Side JavaScript → Unsafe DOM Sink (innerHTML)',
    nodes: [
      {
        id: 'dom-1',
        actorLabel: 'URL Source',
        title: 'Untrusted URL Fragment',
        vulnerableDesc: 'Payload is placed after the # hash symbol in the URL (never sent to the server).',
        safeDesc: 'Payload is placed after the # hash symbol in the URL.',
        packetCode: `https://site.edu/app#<img src=x onerror=alert('XSS')>`,
        safePacketCode: `https://site.edu/app#<img src=x onerror=alert('XSS')>`,
        icon: 'attacker'
      },
      {
        id: 'dom-2',
        actorLabel: 'Clean Page',
        title: 'Static HTML Loads',
        vulnerableDesc: 'The server sends normal, clean HTML and JavaScript files to the browser.',
        safeDesc: 'The server sends normal, clean HTML and JavaScript files to the browser.',
        packetCode: `<div id="panel">Loading view...</div>`,
        safePacketCode: `<div id="panel">Loading view...</div>`,
        icon: 'server'
      },
      {
        id: 'dom-3',
        actorLabel: 'Source to Sink',
        title: 'JS Reads Source & Writes Sink',
        vulnerableDesc: 'Client-side script reads window.location.hash and assigns it directly to panel.innerHTML.',
        safeDesc: 'Client-side script validates the hash against an allowlist and writes to panel.textContent.',
        packetCode: `panel.innerHTML = location.hash.slice(1);`,
        safePacketCode: `panel.textContent = location.hash.slice(1);`,
        icon: 'dom'
      },
      {
        id: 'dom-4',
        actorLabel: 'DOM Mutation',
        title: 'In-Browser Execution',
        vulnerableDesc: 'The live DOM inserts the <img> element, src=x fails, and onerror executes JavaScript.',
        safeDesc: 'The DOM updates only a safe TextNode; no HTML tags or event handlers are created.',
        packetCode: `DOM Event Fired: onerror -> alert('XSS')`,
        safePacketCode: `DOM TextNode Updated Safely`,
        icon: 'impact'
      }
    ]
  }
};

export const AttackFlowDiagram: React.FC<AttackFlowDiagramProps> = ({ variant, compact = false }) => {
  const config = FLOW_CONFIGS[variant];
  const [activeStep, setActiveStep] = useState<number>(0);
  const [defenseMode, setDefenseMode] = useState<'vulnerable' | 'safe'>('vulnerable');

  const renderIcon = (iconType: FlowNode['icon'], isSafe: boolean, isLast: boolean) => {
    const baseClass = 'w-5 h-5';
    if (isLast) {
      return isSafe ? (
        <ShieldCheck className={`${baseClass} text-emerald-400`} />
      ) : (
        <ShieldAlert className={`${baseClass} text-rose-400`} />
      );
    }
    switch (iconType) {
      case 'attacker':
        return <Terminal className={`${baseClass} text-amber-400`} />;
      case 'server':
        return <Server className={`${baseClass} text-cyan-400`} />;
      case 'database':
        return <Database className={`${baseClass} text-blue-400`} />;
      case 'dom':
        return <Code2 className={`${baseClass} text-cyan-400`} />;
      case 'browser':
        return <Globe className={`${baseClass} text-emerald-400`} />;
      default:
        return <ShieldAlert className={`${baseClass} text-rose-400`} />;
    }
  };

  const handleNextStep = () => {
    setActiveStep((prev) => (prev + 1) % config.nodes.length);
  };

  const currentNode = config.nodes[activeStep];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 md:p-6">
      {/* Header & Interactive Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="text-xs text-cyan-400 font-medium tracking-wide">
            Interactive Architecture Diagram · {currentNode.title}
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-slate-100 mt-1">{config.heading}</h3>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">{config.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Mode Control */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setDefenseMode('vulnerable')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                defenseMode === 'vulnerable'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Vulnerable Path
            </button>
            <button
              type="button"
              onClick={() => setDefenseMode('safe')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                defenseMode === 'safe'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Encoded Safe Path
            </button>
          </div>

          <button
            type="button"
            onClick={handleNextStep}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5" />
            Next Flow Step
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(0)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* 4-Stage Visual Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-5">
        {config.nodes.map((node, index) => {
          const isCurrent = index === activeStep;
          const isPassed = index <= activeStep;
          const isLast = index === config.nodes.length - 1;

          let borderClass = 'border-slate-800 bg-slate-950/60 hover:border-slate-700';
          if (isCurrent) {
            borderClass =
              defenseMode === 'safe'
                ? 'border-emerald-500/70 bg-emerald-950/20'
                : 'border-cyan-400/80 bg-cyan-950/20';
          } else if (isPassed) {
            borderClass = 'border-slate-700 bg-slate-900/80';
          }

          return (
            <div key={node.id} className="relative flex items-stretch">
              <button
                type="button"
                onClick={() => setActiveStep(index)}
                className={`w-full text-left rounded-lg border p-4 transition-colors flex flex-col justify-between ${borderClass}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-slate-400">{node.actorLabel}</span>
                    {renderIcon(node.icon, defenseMode === 'safe', isLast)}
                  </div>
                  <div className="text-sm font-semibold text-slate-100 mt-2">{node.title}</div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {defenseMode === 'safe' ? node.safeDesc : node.vulnerableDesc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-400 truncate">
                    {defenseMode === 'safe' ? node.safePacketCode : node.packetCode}
                  </div>
                </div>
              </button>

              {!isLast && (
                <div className="hidden md:flex items-center justify-center -right-2.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <ArrowRight
                    className={`w-4 h-4 mx-0.5 ${
                      index < activeStep
                        ? defenseMode === 'safe'
                          ? 'text-emerald-400'
                          : 'text-cyan-400'
                        : 'text-slate-600'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Packet & Execution Inspector */}
      {!compact && (
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-slate-400">
              Active Stage Inspection · <span className="text-slate-200 font-medium">{currentNode.title}</span>
              <span aria-hidden="true"> · </span>
              <span className={defenseMode === 'safe' ? 'text-emerald-400' : 'text-rose-400'}>
                {defenseMode === 'safe' ? 'Protected by Output Encoding / textContent' : 'Unencoded Raw Input Path'}
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-300">
              {defenseMode === 'safe' ? currentNode.safeDesc : currentNode.vulnerableDesc}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 shrink-0 max-w-full overflow-x-auto">
            <div className="text-[11px] text-slate-400 mb-0.5">Live Payload / DOM State ({currentNode.title}):</div>
            <code
              className={`text-xs font-mono ${
                defenseMode === 'safe' ? 'text-emerald-300' : 'text-cyan-300'
              }`}
            >
              {defenseMode === 'safe' ? currentNode.safePacketCode : currentNode.packetCode}
            </code>
          </div>
        </div>
      )}
    </div>
  );
};
