export interface GlossaryTerm {
  term: string;
  simpleMeaning: string;
  technicalContext: string;
  example: string;
}

export interface XSSTypeDetail {
  id: 'reflected' | 'stored' | 'dom';
  title: string;
  shortName: string;
  tagline: string;
  persistence: string;
  executionLocation: string;
  definition: string;
  simpleAnalogy: string;
  howItWorks: string;
  extraConceptTitle: string;
  extraConceptBody: string;
  realWorldScenarioTitle: string;
  realWorldScenarioDescription: string;
  craftedInputExample: string;
  attackSteps: {
    step: number;
    actor: string;
    title: string;
    detail: string;
  }[];
  vulnerableCode: string;
  vulnerableExplanation: string;
  safeCode: string;
  safeExplanation: string;
  possibleImpacts: string[];
  preventionMethods: {
    title: string;
    description: string;
  }[];
}

export interface PayloadItem {
  id: string;
  title: string;
  category: 'Script Tags' | 'HTML Injection' | 'Event Handlers' | 'DOM Manipulation';
  code: string;
  meaning: string;
  demonstrates: string;
  relatedConcept: string;
  whyDangerous: string;
  prevention: string;
  recommendedLab: 'reflected' | 'stored' | 'dom';
}

export interface QuizQuestion {
  id: number;
  topic: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface PresentationSlide {
  slideNumber: number;
  sectionTag: string;
  title: string;
  subtitle: string;
  keyPoints: string[];
  codeSnippet?: {
    label: string;
    vulnerable?: string;
    safe?: string;
    single?: string;
  };
  diagramType?: 'master' | 'reflected' | 'stored' | 'dom';
  speakerNotes: string;
  takeaway: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Payload',
    simpleMeaning: 'The piece of test code or script placed inside an input field or URL to test how the website handles it.',
    technicalContext: 'In ethical security testing, a harmless payload like alert("XSS Test") proves that JavaScript can execute in the browser.',
    example: "<script>alert('XSS Demonstration')</script>"
  },
  {
    term: 'DOM (Document Object Model)',
    simpleMeaning: 'The live tree structure that the browser builds in memory to represent every heading, button, paragraph, and script on a webpage.',
    technicalContext: 'JavaScript can read and change the DOM dynamically without reloading the page.',
    example: "document.getElementById('output').textContent = 'Hello';"
  },
  {
    term: 'Source (in DOM XSS)',
    simpleMeaning: 'Where untrusted user input comes from inside the browser (such as the URL address bar or search query).',
    technicalContext: 'A JavaScript property that an external user can control.',
    example: 'window.location.search or window.location.hash'
  },
  {
    term: 'Sink (in DOM XSS)',
    simpleMeaning: 'A JavaScript function or DOM property that takes data and renders it into the webpage or runs it as code.',
    technicalContext: 'Unsafe sinks interpret raw strings as executable HTML or JavaScript.',
    example: 'element.innerHTML = untrustedData;'
  },
  {
    term: 'Output Encoding',
    simpleMeaning: 'Converting special characters like < and > into safe text codes (&lt; and &gt;) so the browser displays them on screen instead of running them as code.',
    technicalContext: 'Neutralizes HTML and script injection before rendering user data in the browser.',
    example: '<script> becomes &lt;script&gt;'
  },
  {
    term: 'Sanitization',
    simpleMeaning: 'Cleaning user input by removing dangerous tags (like <script> or onerror) while keeping safe formatting tags (like <b> or <p>).',
    technicalContext: 'Used when an application intentionally allows rich text or HTML comments using libraries like DOMPurify.',
    example: 'DOMPurify.sanitize(userRichText)'
  }
];

export const XSS_TYPES_DATA: Record<'reflected' | 'stored' | 'dom', XSSTypeDetail> = {
  reflected: {
    id: 'reflected',
    title: 'Reflected Cross-Site Scripting (Non-Persistent XSS)',
    shortName: 'Reflected XSS',
    tagline: 'Untrusted input in a request (such as a URL or search query) is immediately echoed back by the application without safe encoding.',
    persistence: 'Non-Persistent (Not saved in database)',
    executionLocation: 'Victim Browser via crafted HTTP request / URL',
    definition:
      'Reflected XSS happens when a web application receives user input in an HTTP request (for example, a search box term or URL parameter) and immediately includes that exact input in the HTML webpage sent back to the user, without encoding or escaping it as plain text.',
    simpleAnalogy:
      'Imagine shouting a message into a canyon and hearing an instant echo. If a website echoes back whatever you type into the search bar directly as live HTML code, an attacker can craft a special link containing JavaScript that "bounces" off the website and runs in the browser of anyone who clicks that link.',
    howItWorks:
      'Unlike Stored XSS, the malicious script is never saved inside the website database. Instead, the attacker places the script inside a URL parameter (like ?q=...) and tricks a user into clicking the link via email, chat, or social media. When the victim clicks the link, the website reflects the script straight into the response page, and the victim browser executes it.',
    extraConceptTitle: 'How a Specially Crafted URL Works',
    extraConceptBody:
      'Websites frequently pass search queries in the URL query string after a question mark (?). For example: https://uni-library.edu/search?query=cybersecurity. If the page prints "Results for: [query]" directly into the HTML without encoding, replacing "cybersecurity" with <script>alert("XSS Demonstration")</script> turns the URL itself into a delivery vehicle for executable JavaScript.',
    realWorldScenarioTitle: 'Real-World Search-Box Example',
    realWorldScenarioDescription:
      'An online university course catalog displays "No courses found for: [your search]" whenever a student searches for a course name. Because the developer concatenated the raw search string directly into the HTML response, any HTML or <script> tag typed into the search box is interpreted by the browser as part of the page structure.',
    craftedInputExample: 'https://catalog.university.edu/search?q=<script>alert(\'XSS Demonstration\')</script>',
    attackSteps: [
      {
        step: 1,
        actor: 'Attacker',
        title: 'Discovers Unencoded Search Parameter',
        detail: 'The attacker notices that typing <h2>test</h2> into the search bar causes the word "test" to render as a large HTML heading instead of plain text.'
      },
      {
        step: 2,
        actor: 'Attacker',
        title: 'Constructs a Specially Crafted URL',
        detail: 'The attacker embeds a script inside the URL query parameter: ?q=<script>...</script> and sends the link to a user.'
      },
      {
        step: 3,
        actor: 'Victim Browser',
        title: 'Requests the Crafted Link',
        detail: 'The user clicks the link, causing their browser to send the HTTP GET request containing the script parameter to the vulnerable web server.'
      },
      {
        step: 4,
        actor: 'Vulnerable Website',
        title: 'Reflects Unencoded Input in HTML Response',
        detail: 'The server inserts the raw query parameter directly into the HTML body ("Results for: <script>...") and sends it back to the browser.'
      },
      {
        step: 5,
        actor: 'Victim Browser',
        title: 'Executes the Reflected Script',
        detail: 'The browser parses the HTML response, encounters the <script> tag, and executes the JavaScript inside the user session.'
      }
    ],
    vulnerableCode: `// VULNERABLE: Raw search parameter inserted directly as HTML
const searchQuery = new URLSearchParams(window.location.search).get('q');

// Unsafe: innerHTML interprets <script> or <img onerror=...> as executable code
document.getElementById('search-results').innerHTML =
  "Showing search results for: " + searchQuery;`,
    vulnerableExplanation:
      'Using innerHTML or raw string concatenation tells the browser to parse searchQuery as live HTML markup. Any tags inside searchQuery become real DOM elements and execute.',
    safeCode: `// SAFE: Render search query strictly as plain text
const searchQuery = new URLSearchParams(window.location.search).get('q') ?? '';

const resultsHeading = document.getElementById('search-results');
if (resultsHeading) {
  // Safe: textContent automatically treats < and > as literal characters
  resultsHeading.textContent = \`Showing search results for: \${searchQuery}\`;
}`,
    safeExplanation:
      'Using textContent (or server-side HTML entity encoding) ensures that characters like < and > are never parsed as HTML tags. The browser simply displays the literal characters on screen.',
    possibleImpacts: [
      'Unauthorized actions performed on behalf of the user who clicked the link',
      'Fake login prompts injected into the legitimate website page (UI redress)',
      'Exposure of sensitive data visible on the victim screen',
      'Unauthorized profile or account settings changes during an active session'
    ],
    preventionMethods: [
      {
        title: 'Context-Aware Output Encoding',
        description: 'Convert <, >, &, ", and \' into their safe HTML entities (&lt;, &gt;, &amp;, &quot;, &#x27;) before placing any request parameter into HTML.'
      },
      {
        title: 'Use Safe DOM APIs (textContent)',
        description: 'When displaying search terms or error messages in JavaScript, always assign to element.textContent instead of element.innerHTML.'
      },
      {
        title: 'Strict Input Validation',
        description: 'Validate query parameters against expected formats (for example, alphanumeric course codes or numeric IDs) and reject unexpected markup.'
      },
      {
        title: 'Content Security Policy (CSP)',
        description: 'Configure an HTTP Content-Security-Policy header that blocks inline <script> execution so reflected scripts cannot run.'
      }
    ]
  },
  stored: {
    id: 'stored',
    title: 'Stored Cross-Site Scripting (Persistent XSS)',
    shortName: 'Stored XSS',
    tagline: 'Malicious script is permanently saved inside the application database and automatically served to every user who views that page.',
    persistence: 'Persistent (Saved in Database / Storage)',
    executionLocation: 'Every Visitor Browser loading the affected page',
    definition:
      'Stored XSS (also called Persistent XSS) occurs when an application receives untrusted data from a user, saves it permanently in a database (such as a forum post, product review, comment section, or user profile), and later embeds that stored data into webpages served to other users without proper output encoding or sanitization.',
    simpleAnalogy:
      'Think of a public bulletin board in a university hallway. Instead of shouting an echo to one person (Reflected XSS), someone pins a booby-trapped notice directly onto the bulletin board. Now, every single student or professor who walks by and reads the board triggers the trap automatically—no special link required.',
    howItWorks:
      'First, the attacker submits a form (like a blog comment or support ticket) containing JavaScript code. The server stores this string in its database table. Later, when normal users visit the page, the server queries the database and renders all comments into the HTML page. Because the stored string is not encoded, every visitor browser executes the script automatically upon loading the page.',
    extraConceptTitle: 'Why Database Storage Multiplies the Risk',
    extraConceptBody:
      'A database stores whatever text string it is given—to a database column of type VARCHAR or TEXT, "<script>alert(1)</script>" is just a normal sequence of characters. The vulnerability happens when that stored record is retrieved and inserted directly into an HTML page without escaping. A single stored record can impact hundreds or thousands of visitors automatically.',
    realWorldScenarioTitle: 'Real-World Comment-Section Example',
    realWorldScenarioDescription:
      'A student discussion forum allows users to post comments beneath lecture notes. If a user submits a comment containing <img src=x onerror=alert("XSS Demonstration")>, and the application renders each comment using raw HTML injection, every student and instructor who opens that lecture page will have the JavaScript executed in their browser automatically.',
    craftedInputExample: 'Great lecture notes! <script>alert(\'XSS Demonstration\')</script>',
    attackSteps: [
      {
        step: 1,
        actor: 'Attacker',
        title: 'Submits Script in a Comment or Profile Field',
        detail: 'The attacker fills out a comment box or user bio form with JavaScript code and clicks Submit.'
      },
      {
        step: 2,
        actor: 'Vulnerable Website',
        title: 'Saves Unsanitized Input into the Database',
        detail: 'The backend stores the raw comment string inside the database table without sanitizing or stripping dangerous HTML tags.'
      },
      {
        step: 3,
        actor: 'Victim Browser',
        title: 'Visits the Normal Webpage',
        detail: 'Any regular user (or administrator) opens the discussion page normally—without clicking any suspicious link.'
      },
      {
        step: 4,
        actor: 'Vulnerable Website',
        title: 'Loads Stored Comments into HTML',
        detail: 'The application fetches the saved comments from the database and embeds them directly into the page HTML without output encoding.'
      },
      {
        step: 5,
        actor: 'Victim Browser',
        title: 'Executes Stored Script Automatically',
        detail: 'The visitor browser renders the comment list and immediately executes the embedded script inside the visitor session.'
      }
    ],
    vulnerableCode: `// VULNERABLE: Rendering stored database comments using innerHTML
function renderCommentsVulnerable(commentsFromDB) {
  const list = document.getElementById('comments-container');
  list.innerHTML = commentsFromDB
    .map(c => \`<div class="comment"><strong>\${c.author}:</strong> \${c.body}</div>\`)
    .join('');
}`,
    vulnerableExplanation:
      'Building HTML strings with template literals and assigning them to innerHTML allows any <script>, <img>, or <svg> tag stored in c.author or c.body to execute in every viewer browser.',
    safeCode: `// SAFE: Creating DOM elements and setting textContent
function renderCommentsSafe(commentsFromDB) {
  const list = document.getElementById('comments-container');
  list.replaceChildren(); // Clear existing items safely

  commentsFromDB.forEach((c) => {
    const row = document.createElement('div');
    row.className = 'comment';

    const author = document.createElement('strong');
    author.textContent = \`\${c.author}: \`;

    const body = document.createElement('span');
    body.textContent = c.body; // Safe: never parsed as HTML

    row.append(author, body);
    list.appendChild(row);
  });
}`,
    safeExplanation:
      'By creating elements with document.createElement() and assigning user data via textContent, the browser guarantees that stored comments are treated strictly as text nodes, never executable tags.',
    possibleImpacts: [
      'Affects every visitor who opens the page without requiring them to click a special link',
      'Can impact administrators reviewing user-submitted comments or support tickets',
      'Persistent defacement or modification of page content for all users',
      'Self-propagating scripts if comments can be submitted automatically by affected sessions'
    ],
    preventionMethods: [
      {
        title: 'Encode Output Every Time Data Leaves Storage',
        description: 'Always HTML-encode stored database fields when rendering them into templates, even if the data came from your own database.'
      },
      {
        title: 'Sanitize Rich Text with Allowlists (DOMPurify)',
        description: 'If users are allowed to format posts (bold, italics, lists), sanitize the HTML with a battle-tested library like DOMPurify before rendering.'
      },
      {
        title: 'Use Modern Auto-Escaping Templates',
        description: 'Use default JSX bindings in React ({comment.body}) or auto-escaped template engines, and avoid dangerouslySetInnerHTML.'
      },
      {
        title: 'Defense-in-Depth with CSP & HttpOnly Cookies',
        description: 'Combine Content Security Policy headers with HttpOnly session flags to minimize impact even if a rendering flaw is introduced.'
      }
    ]
  },
  dom: {
    id: 'dom',
    title: 'DOM-Based Cross-Site Scripting (Client-Side XSS)',
    shortName: 'DOM-Based XSS',
    tagline: 'The vulnerability exists entirely in client-side JavaScript when data from an untrusted Source is written to an unsafe DOM Sink.',
    persistence: 'Client-Side Only (Often never reaches the server)',
    executionLocation: 'Victim Browser JavaScript Engine & DOM',
    definition:
      'DOM-Based XSS happens when client-side JavaScript reads controllable data from a "Source" (such as window.location.hash, window.location.search, or document.referrer) and passes that data into an unsafe "Sink" (such as element.innerHTML, document.write(), or eval()) that executes code or updates the webpage structure unsafely.',
    simpleAnalogy:
      'Imagine a building where the security guard at the front desk (the web server) checks every package that enters. However, someone slips instructions through an open window directly to an automated robot already inside the room (client-side JavaScript), and that robot blindly follows the instructions without ever asking the front desk.',
    howItWorks:
      'In DOM-Based XSS, the HTTP response sent by the web server is completely clean and unmodified. The malicious payload often sits after the URL hash symbol (#), which browsers do not even send to the server! Once the page loads, the page own JavaScript reads window.location.hash and writes it into the DOM using an unsafe sink like innerHTML, triggering execution entirely inside the browser.',
    extraConceptTitle: 'Understanding Sources and Sinks in the DOM',
    extraConceptBody:
      'Every DOM-Based XSS vulnerability consists of two parts in JavaScript: (1) A SOURCE—an object property that an external user can control, such as location.hash, location.search, or location.href. (2) A SINK—a DOM method or property that interprets strings as HTML or code, such as innerHTML, outerHTML, document.write(), or setTimeout("string"). When data flows from a Source to a Sink without sanitization or safe text assignment, DOM XSS occurs.',
    realWorldScenarioTitle: 'Real-World URL Hash Tab Selector Example',
    realWorldScenarioDescription:
      'A single-page student portal reads the URL hash (#tab=Overview) using JavaScript so users can bookmark specific dashboard tabs. When a tab name is not recognized, the JavaScript writes: panel.innerHTML = "Active section: " + decodeURIComponent(location.hash.slice(1)). If a link contains #<img src=x onerror=alert("XSS Demonstration")>, the client-side script injects the image tag into the DOM and executes the onerror handler immediately.',
    craftedInputExample: 'https://portal.university.edu/dashboard#<img src=x onerror=alert(\'XSS Demonstration\')>',
    attackSteps: [
      {
        step: 1,
        actor: 'Attacker',
        title: 'Identifies a Client-Side Source-to-Sink Flow',
        detail: 'By inspecting the page JavaScript, the tester spots code reading window.location.hash (Source) and assigning it to element.innerHTML (Sink).'
      },
      {
        step: 2,
        actor: 'Attacker',
        title: 'Places Payload in the URL Fragment (#)',
        detail: 'The attacker crafts a URL with a payload after the # hash symbol: https://site.edu/app#<img src=x onerror=alert("XSS Demonstration")>.'
      },
      {
        step: 3,
        actor: 'Vulnerable Website',
        title: 'Serves Normal Static HTML & JavaScript',
        detail: 'The server sends its normal, clean HTML page. Note that the browser never even sends the #hash fragment to the server.'
      },
      {
        step: 4,
        actor: 'Victim Browser',
        title: 'JavaScript Reads the Untrusted Source',
        detail: 'As the page runs in the browser, its JavaScript reads window.location.hash containing the attacker payload.'
      },
      {
        step: 5,
        actor: 'Victim Browser',
        title: 'Writes Payload into an Unsafe DOM Sink',
        detail: 'The script passes the unvalidated string into element.innerHTML, mutating the live DOM tree and executing the script.'
      }
    ],
    vulnerableCode: `// VULNERABLE: Data flows from URL Source directly to innerHTML Sink
window.addEventListener('hashchange', () => {
  // SOURCE: Untrusted input controlled via the URL fragment (#)
  const rawTab = decodeURIComponent(window.location.hash.substring(1));

  // SINK: innerHTML parses rawTab as live HTML and executes event handlers
  document.getElementById('tab-banner').innerHTML =
    "Current View: " + rawTab;
});`,
    vulnerableExplanation:
      'Even though the server never saw the # fragment, the client-side JavaScript reads window.location.hash and dumps it straight into innerHTML, allowing <img src=x onerror=...> to execute.',
    safeCode: `// SAFE: Validate against allowed values and use textContent
const ALLOWED_TABS = new Set(['Overview', 'Courses', 'Grades', 'Settings']);

window.addEventListener('hashchange', () => {
  const rawTab = decodeURIComponent(window.location.hash.substring(1));
  const safeTab = ALLOWED_TABS.has(rawTab) ? rawTab : 'Overview';

  const banner = document.getElementById('tab-banner');
  if (banner) {
    // SAFE SINK: textContent never creates HTML elements or runs scripts
    banner.textContent = \`Current View: \${safeTab}\`;
  }
});`,
    safeExplanation:
      'We apply two defenses: (1) Allowlist validation ensures only known tab names are accepted, and (2) textContent updates the text node safely without parsing HTML.',
    possibleImpacts: [
      'Bypasses traditional server-side firewalls (WAFs) when the payload stays inside the # URL hash fragment',
      'Manipulates client-side single-page application (SPA) state and interface views',
      'Executes unauthorized API requests using the user active browser session',
      'Alters displayed information or form destinations inside the live DOM'
    ],
    preventionMethods: [
      {
        title: 'Replace Unsafe Sinks with Safe DOM APIs',
        description: 'Always use element.textContent or element.setAttribute() on safe attributes instead of innerHTML, outerHTML, or document.write().'
      },
      {
        title: 'Validate Client-Side Sources Against Allowlists',
        description: 'Treat window.location.hash, location.search, and postMessage data as untrusted input and validate against strict allowlists.'
      },
      {
        title: 'Never Pass Strings to Code Evaluation Functions',
        description: 'Avoid eval(), new Function(), and passing code strings to setTimeout() or setInterval().'
      },
      {
        title: 'Enforce Trusted Types (Modern Browser Defense)',
        description: 'Use the W3C Trusted Types CSP directive (require-trusted-types-for \'script\') to block raw strings from reaching DOM XSS sinks.'
      }
    ]
  }
};

export const PAYLOAD_LIBRARY: PayloadItem[] = [
  {
    id: 'payload-1',
    title: 'Basic JavaScript Alert Statement',
    category: 'Script Tags',
    code: `alert('XSS Test');`,
    meaning:
      'Calls the built-in browser JavaScript alert() function to display a simple pop-up message box containing the text "XSS Test".',
    demonstrates:
      'Proves as a harmless "proof of concept" (PoC) that untrusted input has broken out of a data context and is being executed as active JavaScript code.',
    relatedConcept: 'JavaScript Execution Context & Proof-of-Concept Verification',
    whyDangerous:
      'While alert("XSS Test") itself is completely harmless, if an application executes alert(), it means any other JavaScript function could also execute in the context of the user session.',
    prevention:
      'Never pass user input into JavaScript execution sinks like eval(), setTimeout(string), or inline event attributes (onclick="..."). Keep user data strictly inside quoted, encoded data variables.',
    recommendedLab: 'dom'
  },
  {
    id: 'payload-2',
    title: 'HTML Markup Injection Probe',
    category: 'HTML Injection',
    code: `<h2>XSS Security Test</h2>`,
    meaning:
      'An HTML heading tag containing the text "XSS Security Test".',
    demonstrates:
      'Tests whether the application encodes angle brackets (< and >) or renders user input as raw HTML elements inside the page structure.',
    relatedConcept: 'Reflected & Stored HTML Injection / Missing Output Encoding',
    whyDangerous:
      'If a user can inject an <h2> heading, they can also inject fake login forms, misleading messages, or script-bearing tags into the webpage.',
    prevention:
      'Encode < as &lt; and > as &gt; before rendering, or insert text via element.textContent so the browser displays the literal characters "<h2>XSS Security Test</h2>".',
    recommendedLab: 'reflected'
  },
  {
    id: 'payload-3',
    title: 'Image Event-Handler Test Vector',
    category: 'Event Handlers',
    code: `<img src=x onerror=alert('XSS Test')>`,
    meaning:
      'Creates an HTML <img> tag pointing to an invalid image source ("x"). When the image fails to load, the onerror event handler automatically runs alert(\'XSS Test\').',
    demonstrates:
      'Shows that Cross-Site Scripting does NOT require a <script> tag. HTML attributes like onerror, onload, and onmouseover can also execute JavaScript.',
    relatedConcept: 'DOM-Based XSS & Stored XSS (Bypasses naive <script> filters & executes inside innerHTML)',
    whyDangerous:
      'Note that in modern browsers, <script> tags inserted via element.innerHTML often do not run, but <img src=x onerror=...> DOES run immediately when injected via innerHTML!',
    prevention:
      'Do not rely on simply deleting the word "<script>". Use proper HTML output encoding or textContent, and when rich HTML is required, use an allowlist sanitizer like DOMPurify that strips all on* event attributes.',
    recommendedLab: 'dom'
  },
  {
    id: 'payload-4',
    title: 'Classic Script Tag Demonstration',
    category: 'Script Tags',
    code: `<script>alert('XSS Test')</script>`,
    meaning:
      'An HTML <script> element that instructs the browser HTML parser to switch into JavaScript execution mode and run alert(\'XSS Test\').',
    demonstrates:
      'The classic test case for Reflected XSS and Stored XSS when the server embeds unencoded user input directly into the initial HTML document.',
    relatedConcept: 'Reflected XSS & Stored XSS Server-Side Template Injection',
    whyDangerous:
      'When the server includes raw <script> tags in its HTTP response, the browser cannot distinguish between the developer legitimate scripts and the injected script.',
    prevention:
      'Apply context-aware HTML entity encoding on the server or use modern component frameworks (like React) that automatically escape template variables by default.',
    recommendedLab: 'reflected'
  },
  {
    id: 'payload-5',
    title: 'Safe DOM Text Manipulation Pattern',
    category: 'DOM Manipulation',
    code: `document.getElementById('demo').textContent = 'Safe Test';`,
    meaning:
      'Selects the HTML element with id="demo" and sets its plain text content to "Safe Test" using the standard DOM textContent property.',
    demonstrates:
      'Demonstrates the secure way for JavaScript to update text on a webpage without ever invoking the HTML parser.',
    relatedConcept: 'Secure DOM Manipulation & XSS Prevention',
    whyDangerous:
      'This example is SAFE! Even if the string contained "<script>alert(1)</script>", textContent treats the entire string as literal characters and never executes code.',
    prevention:
      'Standardize on element.textContent and document.createElement() across your codebase instead of element.innerHTML or document.write().',
    recommendedLab: 'dom'
  },
  {
    id: 'payload-6',
    title: 'SVG Onload Vector (Tag Filter Check)',
    category: 'Event Handlers',
    code: `<svg onload=alert('XSS Test')></svg>`,
    meaning:
      'An inline Scalable Vector Graphics (<svg>) element with an onload event attribute that fires as soon as the browser parses the graphic.',
    demonstrates:
      'Demonstrates why blocklisting only <script> or <img> tags is insufficient—dozens of HTML and SVG elements support event handlers.',
    relatedConcept: 'Stored XSS & Incomplete Filter Evasion Analysis',
    whyDangerous:
      'Applications that try to prevent XSS using simple regular expressions (like replacing "<script>") leave SVG and other HTML tags open to script execution.',
    prevention:
      'Never use blocklist regular expressions for security. Encode all untrusted text output or use a strict AST-based HTML sanitizer.',
    recommendedLab: 'stored'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'XSS Definition',
    question: 'What does the acronym XSS stand for in cybersecurity?',
    options: [
      'Extreme Server Security',
      'Cross-Site Scripting',
      'External Script Synchronization',
      'XML System Scripting'
    ],
    correctIndex: 1,
    explanation:
      'XSS stands for Cross-Site Scripting. The letter "X" is used instead of "C" so it is not confused with CSS (Cascading Style Sheets).'
  },
  {
    id: 2,
    topic: 'XSS Definition',
    question: 'Where does the malicious code in a Cross-Site Scripting (XSS) attack actually execute?',
    options: [
      'Inside the database server engine',
      'Inside the victim user web browser',
      'Inside the network router firmware',
      'Inside the operating system kernel of the web host'
    ],
    correctIndex: 1,
    explanation:
      'Unlike server-side attacks, XSS payloads are delivered through a vulnerable web application and executed directly inside the victim user web browser.'
  },
  {
    id: 3,
    topic: 'Reflected XSS',
    question: 'Which statement best describes how Reflected XSS works?',
    options: [
      'The script is permanently saved in a SQL database table and shown to every visitor.',
      'Untrusted input in a request (like a URL query parameter) is immediately echoed back unencoded in the HTTP response.',
      'The attack modifies the server firewall configuration files.',
      'The attacker guesses the database administrator password using brute force.'
    ],
    correctIndex: 1,
    explanation:
      'In Reflected XSS, the payload is part of the request (such as a search parameter in a crafted URL) and is immediately reflected back by the server in the response page.'
  },
  {
    id: 4,
    topic: 'Reflected XSS',
    question: 'How is a Reflected XSS attack typically delivered to a victim?',
    options: [
      'By convincing the user to click a specially crafted link containing the script in a URL parameter',
      'By physically unplugging the server network cable',
      'By updating the browser via the official app store',
      'By encrypting the hard drive with ransomware'
    ],
    correctIndex: 0,
    explanation:
      'Because Reflected XSS is non-persistent, the payload must be included in each request—usually via a crafted URL shared in an email, message, or external page.'
  },
  {
    id: 5,
    topic: 'Stored XSS',
    question: 'Why is Stored (Persistent) XSS often considered the most dangerous type of XSS?',
    options: [
      'It only works when the victim disables JavaScript in their browser.',
      'The payload is saved on the server (such as in a database comment) and automatically executes for every user who views that page.',
      'It automatically rewrites the computer BIOS.',
      'It does not use HTML or JavaScript.'
    ],
    correctIndex: 1,
    explanation:
      'Stored XSS persists in the application storage (like a comment section or user profile), so every visitor who opens that page receives and runs the script without needing to click a special link.'
  },
  {
    id: 6,
    topic: 'Stored XSS',
    question: 'Which of the following application features is the most common target for a Stored XSS vulnerability?',
    options: [
      'A public blog comment section or product review list stored in a database',
      'A static CSS stylesheet file that never changes',
      'A local calculator that does not save or display text',
      'An offline PDF textbook'
    ],
    correctIndex: 0,
    explanation:
      'Features that accept user input, save it in a database, and display it to other users—such as comment forms, chat rooms, and user profiles—are prime candidates for Stored XSS if output is not encoded.'
  },
  {
    id: 7,
    topic: 'DOM-Based XSS',
    question: 'What makes DOM-Based XSS different from traditional Reflected or Stored XSS?',
    options: [
      'It only affects mobile phones.',
      'The vulnerability happens entirely in client-side JavaScript when data from a Source is written to an unsafe DOM Sink.',
      'It requires administrative SSH access to the Linux server.',
      'It is written in SQL instead of JavaScript.'
    ],
    correctIndex: 1,
    explanation:
      'DOM-Based XSS occurs inside the browser JavaScript code when untrusted data from a Source (like location.hash) is passed into an unsafe Sink (like element.innerHTML).'
  },
  {
    id: 8,
    topic: 'DOM-Based XSS',
    question: 'In DOM-Based XSS terminology, which pair correctly represents a "Source" and an unsafe "Sink"?',
    options: [
      'Source: window.location.hash — Sink: element.innerHTML',
      'Source: element.textContent — Sink: console.log()',
      'Source: Math.random() — Sink: Array.prototype.map()',
      'Source: JSON.stringify() — Sink: Number.parseInt()'
    ],
    correctIndex: 0,
    explanation:
      'window.location.hash is a user-controllable Source, and element.innerHTML is an unsafe DOM Sink that parses raw strings as HTML and executes inline event handlers.'
  },
  {
    id: 9,
    topic: 'JavaScript',
    question: 'Why is element.textContent safer than element.innerHTML when displaying plain text from a user?',
    options: [
      'textContent encrypts the string with AES-256.',
      'textContent treats the string strictly as literal characters and never parses < or > as HTML tags.',
      'textContent sends the data to an external antivirus server first.',
      'textContent automatically deletes the entire webpage.'
    ],
    correctIndex: 1,
    explanation:
      'When you assign a string to element.textContent, the browser inserts a pure text node without invoking the HTML parser, so tags like <script> or <img onerror=...> cannot execute.'
  },
  {
    id: 10,
    topic: 'HTML',
    question: 'Why does the payload <img src=x onerror=alert("XSS Test")> execute JavaScript even without a <script> tag?',
    options: [
      'Because the browser mistakes the image for a downloadable .exe file',
      'Because the invalid src="x" fails to load, triggering the inline onerror HTML event handler which runs JavaScript',
      'Because all images on the internet contain JavaScript by default',
      'Because the <img> tag rewrites the server database'
    ],
    correctIndex: 1,
    explanation:
      'HTML event handler attributes like onerror and onload execute JavaScript when their event occurs. Setting src="x" forces an image load error, immediately firing onerror.'
  },
  {
    id: 11,
    topic: 'Vulnerability Detection',
    question: 'When an ethical security tester places <h2>XSS Security Test</h2> into a search box, what are they checking for?',
    options: [
      'Whether the application fails to encode HTML angle brackets (< and >) and renders raw HTML tags',
      'Whether the server hard drive is full',
      'Whether the website uses HTTPS encryption',
      'Whether the database uses PostgreSQL or MySQL'
    ],
    correctIndex: 0,
    explanation:
      'Injecting a benign HTML tag like <h2> allows testers to observe in the browser DOM inspector whether angle brackets are rendered as real HTML elements or safely encoded as &lt;h2&gt;.'
  },
  {
    id: 12,
    topic: 'Vulnerability Detection',
    question: 'Which browser tool helps developers inspect whether user input was rendered as a safe text node or an unsafe HTML element?',
    options: [
      'The Browser Developer Tools (Elements / DOM Inspector & Console)',
      'The computer Calculator app',
      'The Windows Disk Defragmenter',
      'The monitor brightness settings'
    ],
    correctIndex: 0,
    explanation:
      'Browser Developer Tools (F12 -> Elements/Inspector and Console) let developers examine the live DOM tree, view network responses, and trace client-side JavaScript sources and sinks.'
  },
  {
    id: 13,
    topic: 'XSS Prevention',
    question: 'What does HTML Output Encoding do to prevent Cross-Site Scripting?',
    options: [
      'It converts special characters like <, >, and " into safe HTML entities (&lt;, &gt;, &quot;) so the browser displays them as text.',
      'It blocks all users from typing vowels into input boxes.',
      'It hides the website behind a VPN.',
      'It compresses images to make the page load faster.'
    ],
    correctIndex: 0,
    explanation:
      'Output encoding transforms characters that have special meaning in HTML into safe entity representations so the browser displays them visually instead of interpreting them as code.'
  },
  {
    id: 14,
    topic: 'XSS Prevention',
    question: 'How does setting the HttpOnly flag on a session cookie help reduce the impact of an XSS vulnerability?',
    options: [
      'It prevents client-side JavaScript (document.cookie) from reading the sensitive session cookie.',
      'It forces the website to run without an internet connection.',
      'It automatically rewrites all innerHTML calls to textContent.',
      'It deletes the database every 24 hours.'
    ],
    correctIndex: 0,
    explanation:
      'An HttpOnly cookie is sent in HTTP requests to the server but is invisible to client-side JavaScript (document.cookie), protecting session tokens from being read by scripts.'
  },
  {
    id: 15,
    topic: 'XSS Prevention',
    question: 'What is the purpose of a Content Security Policy (CSP) HTTP header in defending against XSS?',
    options: [
      'It tells the browser which script sources are trusted and can block unauthorized inline scripts from running.',
      'It increases the font size of headings on mobile screens.',
      'It automatically backs up database tables to the cloud.',
      'It replaces HTML with Python inside the browser.'
    ],
    correctIndex: 0,
    explanation:
      'Content Security Policy (CSP) is a browser security mechanism configured via HTTP headers (such as Content-Security-Policy: default-src \'self\') that restricts inline scripts and untrusted external script domains.'
  },
  {
    id: 16,
    topic: 'SQL Injection Comparison',
    question: 'What is the fundamental difference between Cross-Site Scripting (XSS) and SQL Injection (SQLi)?',
    options: [
      'XSS targets users by executing JavaScript in the victim browser, while SQL Injection targets the backend database by manipulating SQL queries.',
      'XSS only works on databases, while SQL Injection only works on CSS files.',
      'There is no difference; both terms mean the exact same attack.',
      'SQL Injection runs in the browser DOM, while XSS runs inside the database server.'
    ],
    correctIndex: 0,
    explanation:
      'XSS is a client-side code injection attack that runs JavaScript in the victim browser, whereas SQL Injection is a server-side attack where untrusted input alters SQL commands executed by the backend database.'
  }
];

export const PRESENTATION_SLIDES: PresentationSlide[] = [
  {
    slideNumber: 1,
    sectionTag: 'University Cybersecurity Seminar',
    title: 'Introduction to Cross-Site Scripting (XSS)',
    subtitle: 'Understanding, Detecting, and Preventing Client-Side Script Injection in Modern Web Applications',
    keyPoints: [
      'Web applications constantly accept user input (searches, comments, profiles) and display it in browsers.',
      'When an application confuses user data with executable code, attackers can inject malicious scripts.',
      'Ranked consistently among the most widespread web security risks in the OWASP Top 10 (Injection).',
      'Presented by Muhammad Masood (Roll No: 2670) · Department of Computer Science.'
    ],
    speakerNotes:
      'Welcome everyone. Today we are exploring Cross-Site Scripting, known as XSS—one of the most important vulnerabilities in web cybersecurity. We will look at what it is, how the three types of XSS work, demonstrate them live in our isolated practical lab, and learn how to write secure code.',
    takeaway: 'Core Question: How do we ensure a browser treats user input strictly as data and never as executable code?'
  },
  {
    slideNumber: 2,
    sectionTag: 'Core Concept',
    title: 'Definition of Cross-Site Scripting (XSS)',
    subtitle: 'Why is it called "XSS" and what does it actually mean?',
    keyPoints: [
      'Full Form: Cross-Site Scripting (abbreviated XSS to avoid confusion with CSS stylesheets).',
      'Simple Definition: A security flaw where a website includes untrusted user input in a webpage without encoding it, causing the victim browser to run it as JavaScript.',
      'Key Distinction: The attacker does not attack the victim computer directly—they use a vulnerable website as the delivery vehicle.',
      'Because the script comes from the website page, the browser trusts it and runs it inside the user session.'
    ],
    codeSnippet: {
      label: 'Data vs Code Confusion',
      vulnerable: `<!-- Intended as plain text, but interpreted as executable code -->\n<div>Welcome, <script>alert('XSS Demonstration')</script></div>`,
      safe: `<!-- Encoded safely so the browser renders literal characters -->\n<div>Welcome, &lt;script&gt;alert('XSS Demonstration')&lt;/script&gt;</div>`
    },
    speakerNotes:
      'In simple terms, HTML uses angle brackets (< and >) to define tags. If a user types <script> into a form and the website inserts those exact characters into the webpage HTML, the browser has no way of knowing that a user typed it instead of the website developer.',
    takeaway: 'Browsers trust any JavaScript that arrives inside a webpage from a trusted domain.'
  },
  {
    slideNumber: 3,
    sectionTag: 'Architecture & Lifecycle',
    title: 'How Cross-Site Scripting Works',
    subtitle: 'The lifecycle of an XSS vulnerability from injection to execution',
    keyPoints: [
      'Untrusted Input: An attacker supplies crafted HTML or JavaScript via a URL parameter, search bar, or comment form.',
      'Missing Output Defense: The web server or client-side script inserts that input into the webpage without encoding or sanitization.',
      'Browser Parsing: The victim browser receives the HTML or updates the DOM and encounters executable tags or event handlers.',
      'Security Impact: The injected JavaScript executes inside the victim browser with full access to that page DOM.'
    ],
    diagramType: 'master',
    speakerNotes:
      'Look at this flow: Attacker -> Vulnerable Website -> Victim Browser -> Security Impact. Notice that the vulnerable website acts as the bridge that delivers the script into the victim browser.',
    takeaway: 'Breaking any link in this chain—especially encoding output before the browser parses it—stops the attack.'
  },
  {
    slideNumber: 4,
    sectionTag: 'Classification',
    title: 'The Three Types of XSS Attacks',
    subtitle: 'Comparing Reflected XSS, Stored XSS, and DOM-Based XSS',
    keyPoints: [
      'Reflected XSS (Non-Persistent): Payload is inside a URL/request and immediately echoed back in the server response.',
      'Stored XSS (Persistent): Payload is saved in the database (e.g., a comment) and served automatically to every visitor.',
      'DOM-Based XSS (Client-Side): Payload flows from a JavaScript Source (like location.hash) to an unsafe DOM Sink (like innerHTML) inside the browser.',
      'All three end with unwanted JavaScript running in the browser, but they differ in where the flaw lives.'
    ],
    speakerNotes:
      'Security engineers classify XSS into three categories: Reflected, Stored, and DOM-Based. Let us examine a practical example of each one.',
    takeaway: 'Reflected = URL bounce · Stored = Saved in DB · DOM-Based = Client-side JS Source-to-Sink.'
  },
  {
    slideNumber: 5,
    sectionTag: 'Reflected XSS Deep Dive',
    title: 'Reflected XSS Practical Example',
    subtitle: 'How an unencoded search query parameter reflects executable code',
    keyPoints: [
      'Scenario: A search page displays "Showing results for: [query]" using the URL parameter ?q=...',
      'Attack Vector: The attacker puts <script>alert("XSS Demonstration")</script> inside the ?q= URL parameter.',
      'Why it happens: The application inserts the raw query string directly into the HTML response.',
      'Fix: Encode output on the server or assign the search string to element.textContent.'
    ],
    diagramType: 'reflected',
    codeSnippet: {
      label: 'Search Parameter Reflection',
      vulnerable: `resultsBox.innerHTML = "Results for: " + searchParam;`,
      safe: `resultsBox.textContent = "Results for: " + searchParam;`
    },
    speakerNotes:
      'In Reflected XSS, nothing is saved in the database. The script lives in the link itself and bounces off the vulnerable search page into the browser.',
    takeaway: 'Never echo URL parameters or search queries directly into HTML without encoding.'
  },
  {
    slideNumber: 6,
    sectionTag: 'Stored XSS Deep Dive',
    title: 'Stored XSS Practical Example',
    subtitle: 'How an unsanitized comment in a database affects every visitor',
    keyPoints: [
      'Scenario: A discussion board saves student comments in a database and displays them to everyone.',
      'Attack Vector: A comment containing <script>alert("XSS Demonstration")</script> or <img src=x onerror=...> is submitted.',
      'Why it happens: The database stores the raw text, and the page renders comments using innerHTML without escaping.',
      'Fix: Always HTML-encode stored records upon output, or sanitize rich text with DOMPurify.'
    ],
    diagramType: 'stored',
    codeSnippet: {
      label: 'Database Comment Rendering',
      vulnerable: `commentDiv.innerHTML = commentFromDB.text;`,
      safe: `commentDiv.textContent = commentFromDB.text;`
    },
    speakerNotes:
      'Stored XSS is particularly dangerous because victims do not even need to click a suspicious link—simply opening the comment page triggers the stored script.',
    takeaway: 'Data coming from your own database is still untrusted if it was originally submitted by users.'
  },
  {
    slideNumber: 7,
    sectionTag: 'DOM-Based XSS Deep Dive',
    title: 'DOM-Based XSS Practical Example',
    subtitle: 'Client-side JavaScript Sources and Sinks inside the browser',
    keyPoints: [
      'What is the DOM? The Document Object Model is the browser live tree representation of the webpage.',
      'Source: Where untrusted data enters JavaScript (window.location.hash, window.location.search).',
      'Sink: Where JavaScript writes data into the DOM (element.innerHTML, document.write).',
      'Fix: Replace innerHTML with textContent and validate URL parameters against a strict allowlist.'
    ],
    diagramType: 'dom',
    codeSnippet: {
      label: 'Client-Side Source to Sink',
      vulnerable: `const tab = location.hash.slice(1);\ndocument.getElementById('view').innerHTML = tab;`,
      safe: `const tab = location.hash.slice(1);\ndocument.getElementById('view').textContent = tab;`
    },
    speakerNotes:
      'In DOM-Based XSS, the server response is completely clean. The bug is inside the webpage own JavaScript code when it moves data from a URL source into an HTML sink.',
    takeaway: 'Audit every place where client-side JavaScript reads from location and writes to the DOM.'
  },
  {
    slideNumber: 8,
    sectionTag: 'Practical Verification',
    title: 'Vulnerability Testing Laboratory & Methodology',
    subtitle: 'How ethical security testers safely detect XSS in local environments',
    keyPoints: [
      'Map all input entry points—search bars, comment forms, profile fields, and URL parameters.',
      'Test with harmless probes like <h2>XSS Security Test</h2> or alert("XSS Test") in an authorized local environment.',
      'Inspect the browser DOM (DevTools Elements panel) to check if < and > are encoded as &lt; and &gt;.',
      'Review JavaScript code for dangerous sinks (innerHTML, outerHTML, document.write, eval).'
    ],
    codeSnippet: {
      label: 'Harmless Educational Test Probes',
      single: `HTML Tag Probe:      <h2>XSS Security Test</h2>\nScript Tag Probe:    <script>alert('XSS Demonstration')</script>\nEvent Handler Probe: <img src=x onerror=alert('XSS Test')>`
    },
    speakerNotes:
      'Ethical security testing always takes place in isolated, authorized training labs. Using harmless probes lets developers verify whether output encoding works properly.',
    takeaway: 'We can switch directly to the Practical Lab tab at any moment to demonstrate all three simulators live.'
  },
  {
    slideNumber: 9,
    sectionTag: 'Defense-in-Depth',
    title: 'XSS Prevention & Secure Coding Architecture',
    subtitle: 'Layered defenses that eliminate Cross-Site Scripting',
    keyPoints: [
      'Primary Defense — Context-Aware Output Encoding: Convert <, >, &, ", \' into safe HTML entities.',
      'Safe DOM APIs: Use element.textContent instead of element.innerHTML whenever displaying plain text.',
      'HTML Sanitization: When rich formatting is required, sanitize markup with DOMPurify.',
      'Browser Hardening: Enforce a strict Content Security Policy (CSP) header and set HttpOnly on session cookies.'
    ],
    codeSnippet: {
      label: 'Side-by-Side Secure Refactoring',
      vulnerable: `// Vulnerable: Parses user input as HTML\nelement.innerHTML = userInput;`,
      safe: `// Safer: Renders user input strictly as plain text\nelement.textContent = userInput;`
    },
    speakerNotes:
      'Prevention relies on defense-in-depth: use textContent and output encoding as the primary fix, and add Content Security Policy and HttpOnly cookies as safety nets.',
    takeaway: 'One golden rule stops most XSS: never put untrusted data into an HTML or script context without encoding.'
  },
  {
    slideNumber: 10,
    sectionTag: 'Conclusion & Academic Summary',
    title: 'Conclusion & Key Takeaways',
    subtitle: 'XSS Security Lab — University Presentation & Practical Demonstration',
    keyPoints: [
      'Cross-Site Scripting happens when applications allow untrusted user input to execute as code in a victim browser.',
      'Reflected, Stored, and DOM-Based XSS each have distinct pathways, but all are preventable through disciplined engineering.',
      'Using textContent, Context-Aware Output Encoding, HTML Sanitization, and CSP builds resilient web software.',
      'Submitted By: Muhammad Masood · Roll Number: 2670 · Subject: Cybersecurity · Department of Computer Science.'
    ],
    speakerNotes:
      'Thank you for your attention. We can now jump into the live Practical Training Lab or run through the interactive Knowledge Quiz.',
    takeaway: 'Thank you! Questions & Live Practical Lab Walkthrough.'
  }
];
