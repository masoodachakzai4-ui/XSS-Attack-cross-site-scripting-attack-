export interface TechnicalConcept {
  term: string;
  category: string;
  definition: string;
  practicalExample: string;
  codeExample: string;
}

export interface LifecycleStage {
  id: string;
  title: string;
  actor: 'Attacker' | 'Web Application' | 'Victim Browser' | 'Security Impact';
  summary: string;
  detailedExplanation: string;
  httpOrDomState: string;
  defensePoint: string;
}

export interface VulnerabilityInputPoint {
  id: string;
  name: string;
  locationExample: string;
  typicalRiskRange: 'Low to Medium' | 'Medium to High' | 'High to Critical';
  userSubmits: string;
  websiteProcesses: string;
  unsafeRenderingPoint: string;
  attackerAction: string;
  victimImpact: string;
  developerFix: string;
  safeCodeSample: string;
}

export interface KnowledgePayloadEntry {
  id: string;
  name: string;
  category:
    | 'Basic XSS'
    | 'Reflected XSS'
    | 'Stored XSS'
    | 'DOM-Based XSS'
    | 'HTML Injection'
    | 'JavaScript Injection Concepts'
    | 'DOM Manipulation'
    | 'Secure Coding Examples'
    | 'Vulnerability Detection'
    | 'XSS Prevention Examples';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  code: string;
  explanation: string;
  howItWorks: string;
  whereRelevant: string;
  expectedOutput: string;
  securityRisk: string;
  prevention: string;
  targetLab: 'reflected' | 'stored' | 'dom';
}

export interface LearningLesson {
  id: string;
  level: 'Beginner' | 'Intermediate' | 'Practical' | 'Advanced Concepts';
  title: string;
  duration: string;
  summary: string;
  keyTakeaway: string;
  codeFocus: string;
  targetSection: string;
}

export interface ExamQuestion {
  id: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface AcademySlide {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  bullets: string[];
  codeComparison?: {
    title: string;
    unsafe?: string;
    safe?: string;
    single?: string;
  };
  diagramVariant?: 'master' | 'reflected' | 'stored' | 'dom';
  speakerNotes: string;
  keyTakeaway: string;
}

export const TECHNICAL_CONCEPTS: TechnicalConcept[] = [
  {
    term: 'HTML (HyperText Markup Language)',
    category: 'Web Foundation',
    definition:
      'The standard markup language used to structure content on the web, such as headings, paragraphs, forms, images, and scripts.',
    practicalExample:
      'When a website displays a student name inside a profile card, HTML tags define the heading and paragraph boxes.',
    codeExample: `<div class="profile"><h2>Muhammad Masood</h2></div>`
  },
  {
    term: 'CSS (Cascading Style Sheets)',
    category: 'Web Foundation',
    definition:
      'The styling language that controls how HTML elements look on screen—including colors, fonts, spacing, and responsive layouts.',
    practicalExample:
      'CSS gives this academy its dark midnight navy background and electric cyan highlights. ("XSS" uses an X so it is not confused with CSS!)',
    codeExample: `.card { background: #0B1120; color: #38BDF8; }`
  },
  {
    term: 'JavaScript',
    category: 'Browser Execution',
    definition:
      'The programming language built into every modern web browser that makes webpages interactive, updates the DOM, and communicates with servers.',
    practicalExample:
      'JavaScript validates forms, switches dashboard tabs, and—if injected via XSS—can read or modify anything on the current webpage.',
    codeExample: `document.getElementById('status').textContent = 'Verified';`
  },
  {
    term: 'Web Browser',
    category: 'Client Environment',
    definition:
      'The client application (such as Chrome, Firefox, Edge, or Safari) that downloads HTML, CSS, and JavaScript from a web server and renders the interactive page.',
    practicalExample:
      'In an XSS attack, the victim web browser is where the injected script actually executes.',
    codeExample: `Browser Engine: HTML Parser -> DOM Tree -> JS Runtime`
  },
  {
    term: 'Web Server',
    category: 'Backend Infrastructure',
    definition:
      'The backend computer program (such as Node.js/Express, Nginx, or FastAPI) that receives HTTP requests from browsers and sends back HTML or JSON responses.',
    practicalExample:
      'In Reflected XSS, the web server takes a search query from the request and echoes it directly into the HTML response.',
    codeExample: `app.get('/search', (req, res) => res.send(...))`
  },
  {
    term: 'Database',
    category: 'Persistent Storage',
    definition:
      'An organized storage system (such as SQLite, PostgreSQL, or MySQL) where a web application permanently saves user accounts, comments, and posts.',
    practicalExample:
      'In Stored XSS, an unsanitized comment saved in the database is later served to every visitor who opens that page.',
    codeExample: `SELECT username, comment_text FROM course_comments;`
  },
  {
    term: 'HTTP Request',
    category: 'Network Protocol',
    definition:
      'The message sent by the user browser to the web server asking for a page or submitting form data (via GET or POST methods).',
    practicalExample:
      'Clicking a search button sends an HTTP GET request containing your search term in the URL query string.',
    codeExample: `GET /catalog?search=Cybersecurity HTTP/1.1`
  },
  {
    term: 'HTTP Response',
    category: 'Network Protocol',
    definition:
      'The message sent back by the web server to the browser containing status codes (like 200 OK), security headers, and the HTML webpage body.',
    practicalExample:
      'If the HTTP response includes unencoded user input inside its HTML body, the browser will parse it as code.',
    codeExample: `HTTP/1.1 200 OK\nContent-Type: text/html`
  },
  {
    term: 'DOM (Document Object Model)',
    category: 'Browser Architecture',
    definition:
      'The live, in-memory tree of objects created by the browser to represent every element on a webpage so JavaScript can inspect or modify them dynamically.',
    practicalExample:
      'DOM-Based XSS happens when client-side JavaScript reads untrusted data and inserts it into the DOM tree using an unsafe method like innerHTML.',
    codeExample: `document.body.appendChild(newElement);`
  },
  {
    term: 'User Input',
    category: 'Attack Surface',
    definition:
      'Any data supplied by an external user or browser—including search queries, comment boxes, profile names, uploaded filenames, and URL parameters.',
    practicalExample:
      'Every piece of user input must be treated as untrusted until it is validated and safely encoded.',
    codeExample: `const untrustedSearch = req.query.q;`
  },
  {
    term: 'Output Encoding',
    category: 'Primary Defense',
    definition:
      'Transforming special characters (<, >, &, ", \') into harmless HTML entities (&lt;, &gt;, &amp;, &quot;, &#39;) right before displaying data in a webpage.',
    practicalExample:
      'When <script> is encoded as &lt;script&gt;, the browser displays those literal characters on screen instead of running a script.',
    codeExample: `&lt;script&gt;alert('XSS')&lt;/script&gt;`
  },
  {
    term: 'HTML Sanitization',
    category: 'Rich-Text Defense',
    definition:
      'Parsing user-supplied HTML and stripping away dangerous tags (<script>, <iframe>, <object>) and event attributes (onerror, onload) while keeping safe formatting.',
    practicalExample:
      'Used in blog editors or forum comments where users are allowed to write bold or italic text safely.',
    codeExample: `const safeHTML = DOMPurify.sanitize(userRichComment);`
  },
  {
    term: 'Session and Cookies',
    category: 'Authentication State',
    definition:
      'Small pieces of data stored by the browser and sent with requests so a website remembers which user is logged in across page loads.',
    practicalExample:
      'Setting the HttpOnly flag on session cookies prevents client-side JavaScript (document.cookie) from reading sensitive session tokens.',
    codeExample: `Set-Cookie: session_id=abc123xyz; Secure; HttpOnly; SameSite=Strict`
  }
];

export const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    id: 'stage-input-discovery',
    title: 'Attacker Identifies an Input Point',
    actor: 'Attacker',
    summary: 'Locates a search bar, comment field, profile setting, or URL parameter that accepts user data and displays it back on a page.',
    detailedExplanation:
      'During reconnaissance, an ethical tester or attacker maps every location where user-supplied data enters the application and later appears in the rendered webpage or DOM.',
    httpOrDomState: `Target Input Vector: /search?query=... or POST /api/comments`,
    defensePoint: 'Maintain a complete inventory of all input parameters and enforce strict input validation.'
  },
  {
    id: 'stage-payload-prep',
    title: 'Attacker Prepares Test Content',
    actor: 'Attacker',
    summary: 'Crafts an HTML or JavaScript test string designed to break out of the data context and trigger code execution.',
    detailedExplanation:
      'In educational testing, a harmless probe like <h2>XSS Security Test</h2> or <script>alert("XSS Test")</script> is prepared to test whether angle brackets and event handlers are interpreted as code.',
    httpOrDomState: `Prepared Probe: <img src=x onerror=alert('XSS Security Test')>`,
    defensePoint: 'Use allowlist validation to reject unexpected markup where only plain alphanumeric strings are expected.'
  },
  {
    id: 'stage-input-submission',
    title: 'Website Receives the Input',
    actor: 'Web Application',
    summary: 'The crafted string arrives via an HTTP request parameter, form submission, or client-side URL hash.',
    detailedExplanation:
      'The application receives the untrusted string either on the server (via query parameters or POST body) or directly inside the browser (via window.location).',
    httpOrDomState: `GET /search?q=%3Cscript%3Ealert(%27XSS%27)%3C%2Fscript%3E HTTP/1.1`,
    defensePoint: 'Never assume data from URL parameters, headers, or database rows is pre-sanitized.'
  },
  {
    id: 'stage-unsafe-handling',
    title: 'Website Handles the Input Incorrectly',
    actor: 'Web Application',
    summary: 'The application concatenates the raw user string directly into HTML markup without output encoding or sanitization.',
    detailedExplanation:
      'Instead of converting < and > into &lt; and &gt;, or using safe text APIs, the developer concatenates the untrusted string directly into an HTML template or innerHTML assignment.',
    httpOrDomState: `const html = "<div class='result'>Search: " + rawUserInput + "</div>";`,
    defensePoint: 'Always separate code structure from user data using auto-escaping templates or textContent.'
  },
  {
    id: 'stage-delivery-channel',
    title: 'Content is Reflected, Stored, or Processed in DOM',
    actor: 'Web Application',
    summary: 'Depending on the XSS type, the unencoded payload is echoed in the response, saved in the database, or written to a DOM sink.',
    detailedExplanation:
      'This stage determines the XSS classification: Reflected XSS echoes it immediately; Stored XSS saves it in a database table; DOM-Based XSS passes it from a JS Source to an unsafe DOM Sink.',
    httpOrDomState: `Pathways: HTTP Reflection | SQLite/DB Persistence | Client DOM Sink`,
    defensePoint: 'Apply context-aware encoding at the exact point where data is rendered into the output document.'
  },
  {
    id: 'stage-victim-load',
    title: 'Victim Opens the Affected Page',
    actor: 'Victim Browser',
    summary: 'A regular user visits the page containing the stored comment or clicks the crafted link.',
    detailedExplanation:
      'The victim browser receives the HTML document (or runs the client-side script) within the trusted origin of the web application.',
    httpOrDomState: `Browser Navigation: https://university-portal.local/course-discussion`,
    defensePoint: 'Configure Content Security Policy (CSP) headers so the browser restricts unauthorized inline scripts.'
  },
  {
    id: 'stage-script-execution',
    title: 'Browser Executes the Injected Script',
    actor: 'Victim Browser',
    summary: 'Because the payload is unencoded, the browser HTML parser treats it as legitimate executable JavaScript from the site.',
    detailedExplanation:
      'The browser cannot distinguish between JavaScript written by the website developer and JavaScript injected by the untrusted input. It executes the script immediately.',
    httpOrDomState: `DOM Parser -> Encounters <script> / onerror -> Invokes JS Engine`,
    defensePoint: 'Use textContent for plain text and Trusted Types / DOMPurify for any dynamic HTML.'
  },
  {
    id: 'stage-security-impact',
    title: 'Unauthorized Page Actions or Data Exposure',
    actor: 'Security Impact',
    summary: 'The running script can alter page content, display fake prompts, or interact with the application inside the user session.',
    detailedExplanation:
      'Because the script runs inside the user authenticated origin, it can read information displayed on the DOM, modify the interface, or send authenticated requests on behalf of the user.',
    httpOrDomState: `Session Impact: DOM Manipulation | Unauthorized Action | Info Exposure`,
    defensePoint: 'Set HttpOnly and SameSite=Strict on session cookies and require re-authentication for sensitive actions.'
  }
];

export const VULNERABILITY_EXPLORER_POINTS: VulnerabilityInputPoint[] = [
  {
    id: 'point-search',
    name: 'Search Boxes',
    locationExample: 'Header search bar, course catalog filter, documentation lookup (?q=...)',
    typicalRiskRange: 'Medium to High',
    userSubmits: 'Keywords, course codes, or search phrases via a text input or URL query parameter.',
    websiteProcesses: 'Reads the query parameter and generates a results page displaying "Results for: [search term]".',
    unsafeRenderingPoint: 'Echoing the raw search term directly into the HTML heading or "No results found" banner using innerHTML or unescaped server templates.',
    attackerAction: 'Crafts a link containing <script> or <img src=x onerror=...> inside the ?q= parameter and shares the link.',
    victimImpact: 'Anyone clicking the link executes the reflected script inside their browser session on that website.',
    developerFix: 'HTML-encode the search query before inserting it into the template, or bind it using element.textContent.',
    safeCodeSample: `searchHeading.textContent = \`Showing results for: \${searchQuery}\`;`
  },
  {
    id: 'point-comments',
    name: 'Comment Sections',
    locationExample: 'Lecture discussion boards, blog comments, support ticket replies',
    typicalRiskRange: 'High to Critical',
    userSubmits: 'Multi-line text feedback or formatted discussion replies submitted via HTTP POST.',
    websiteProcesses: 'Saves the comment string in the database and renders all comments to every user who opens the page.',
    unsafeRenderingPoint: 'Rendering stored database comments using innerHTML, dangerouslySetInnerHTML, or unescaped template variables.',
    attackerAction: 'Submits a single comment containing an embedded script or SVG/image event handler.',
    victimImpact: 'Every student, visitor, or administrator who views the discussion page automatically executes the stored script (Stored XSS).',
    developerFix: 'Render plain-text comments with textContent/auto-escaping, or sanitize rich-text comments with DOMPurify.',
    safeCodeSample: `commentBodyElement.textContent = commentFromDatabase.body;`
  },
  {
    id: 'point-profiles',
    name: 'User Profiles',
    locationExample: 'Display name, biography, personal website URL, organization title',
    typicalRiskRange: 'High to Critical',
    userSubmits: 'Full name, short bio, social link, or status message on the account settings page.',
    websiteProcesses: 'Updates the user record in the database and displays the profile badge across forum posts, leaderboards, and admin directories.',
    unsafeRenderingPoint: 'Inserting the display name into navigation bars or rendering an unvalidated "javascript:..." URL inside an <a href="..."> link.',
    attackerAction: 'Sets their biography to an event-handler payload or sets their website link to a javascript: URI.',
    victimImpact: 'Other users or administrators viewing the profile directory trigger the stored script.',
    developerFix: 'Encode all profile text fields and validate that profile URLs begin strictly with https:// or http://.',
    safeCodeSample: `if (/^https?:\\/\\//i.test(userUrl)) profileLink.href = userUrl;`
  },
  {
    id: 'point-reviews',
    name: 'Product Reviews',
    locationExample: 'E-commerce customer ratings, book reviews, course feedback cards',
    typicalRiskRange: 'High to Critical',
    userSubmits: 'Review headline, star rating, and detailed review paragraph.',
    websiteProcesses: 'Stores the review in the product database table and renders it on the public product page.',
    unsafeRenderingPoint: 'Concatenating the review title or body directly into HTML card markup.',
    attackerAction: 'Posts a product review containing <img src=x onerror=alert("XSS Test")>.',
    victimImpact: 'All shoppers browsing that product page have the script executed in their browsers automatically.',
    developerFix: 'Use auto-escaped component templates (such as React JSX) and strict output encoding.',
    safeCodeSample: `reviewCardTitle.textContent = review.headline;`
  },
  {
    id: 'point-url-params',
    name: 'URL Parameters & Hash Fragments',
    locationExample: 'Query strings (?tab=..., ?redirect=...) and URL hashes (#section=...)',
    typicalRiskRange: 'Medium to High',
    userSubmits: 'Navigation state, active tab name, filter sort order, or language code in the browser address bar.',
    websiteProcesses: 'Client-side JavaScript reads window.location.search or window.location.hash to update the interface.',
    unsafeRenderingPoint: 'Passing the decoded URL parameter directly into element.innerHTML or document.write().',
    attackerAction: 'Distributes a URL with a payload placed after the # hash symbol so it never even appears in server logs.',
    victimImpact: 'Client-side JavaScript writes the payload into the DOM sink, triggering DOM-Based XSS.',
    developerFix: 'Validate URL parameters against a strict allowlist of known tab names and update text via textContent.',
    safeCodeSample: `const safeTab = ALLOWED_TABS.includes(hash) ? hash : 'overview';`
  },
  {
    id: 'point-login',
    name: 'Login Forms',
    locationExample: 'Sign-in page username/email field and "?error=" or "?returnUrl=" parameters',
    typicalRiskRange: 'Medium to High',
    userSubmits: 'Username/email address and redirect destination parameter.',
    websiteProcesses: 'Validates credentials; if login fails, may display "Invalid login for user: [username]" or redirect to returnUrl.',
    unsafeRenderingPoint: 'Reflecting the failed username unencoded in the error banner or redirecting to an unvalidated javascript: returnUrl.',
    attackerAction: 'Crafts a login link with a malicious ?error= message or ?returnUrl=javascript:... parameter.',
    victimImpact: 'Can display a convincing fake error or execute code right on the authentication screen.',
    developerFix: 'Display generic, static error messages ("Invalid email or password") and allow only relative paths for returnUrl.',
    safeCodeSample: `const safeReturn = returnUrl.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/dashboard';`
  },
  {
    id: 'point-registration',
    name: 'Registration Forms',
    locationExample: 'New student sign-up form (Full Name, Department, Roll Number)',
    typicalRiskRange: 'Medium to High',
    userSubmits: 'Account registration fields stored for the new user profile.',
    websiteProcesses: 'Saves the registration record and sends a welcome confirmation view or populates the admin approval queue.',
    unsafeRenderingPoint: 'Rendering the newly registered name without encoding on the confirmation screen or inside the administrator review table.',
    attackerAction: 'Registers an account with an HTML/script payload inside the Full Name field.',
    victimImpact: 'Can trigger Stored XSS inside the administrator dashboard when staff review new registrations ("Blind XSS").',
    developerFix: 'Validate input format on registration and encode all fields in both user-facing and admin-facing views.',
    safeCodeSample: `adminRowNameCell.textContent = applicant.fullName;`
  },
  {
    id: 'point-chat',
    name: 'Chat Applications',
    locationExample: 'Live study group chat, customer support messenger, real-time notifications',
    typicalRiskRange: 'High to Critical',
    userSubmits: 'Instant chat messages, code snippets, or shared links.',
    websiteProcesses: 'Broadcasts messages over WebSockets or saves them in message history and appends them to the chat window.',
    unsafeRenderingPoint: 'Appending incoming chat messages using chatBox.innerHTML += messageHTML.',
    attackerAction: 'Sends a chat message containing an event handler like <svg onload=alert("XSS Test")>.',
    victimImpact: 'Every participant in the chat room immediately executes the script as soon as the message arrives.',
    developerFix: 'Create message nodes with document.createElement("div") and assign message text via textContent.',
    safeCodeSample: `const msgNode = document.createElement('div');\nmsgNode.textContent = incomingChat.text;`
  },
  {
    id: 'point-contact',
    name: 'Contact & Feedback Forms',
    locationExample: 'Helpdesk inquiry form, bug report submission, "Contact Instructor" page',
    typicalRiskRange: 'Medium to High',
    userSubmits: 'Sender name, subject line, and message body.',
    websiteProcesses: 'Echoes a "Thank you, [Name], we received your message" confirmation and stores the ticket for support staff.',
    unsafeRenderingPoint: 'Unencoded confirmation preview or unescaped ticket viewer in the support staff portal.',
    attackerAction: 'Submits a support message containing an HTML/JS test vector.',
    victimImpact: 'Targets either the confirmation view (Reflected) or the support staff member who opens the ticket (Stored).',
    developerFix: 'Encode all ticket fields in the support dashboard and isolate rich HTML previews inside sandboxed iframes.',
    safeCodeSample: `confirmationBanner.textContent = \`Thank you, \${senderName}. Ticket received.\`;`
  },
  {
    id: 'point-admin',
    name: 'Admin Dashboards & Log Viewers',
    locationExample: 'System audit logs, user management tables, HTTP User-Agent / Referer log viewers',
    typicalRiskRange: 'High to Critical',
    userSubmits: 'Indirect inputs such as HTTP User-Agent headers, Referer URLs, search logs, or user account fields.',
    websiteProcesses: 'Aggregates activity logs and renders them in an administrative monitoring console.',
    unsafeRenderingPoint: 'Rendering raw log entries or HTTP headers into an HTML table without encoding.',
    attackerAction: 'Sends requests with a crafted User-Agent or profile field that gets logged and viewed by an admin.',
    victimImpact: 'Executes inside the high-privilege administrator session.',
    developerFix: 'Treat all log data and HTTP headers as untrusted input; render logs strictly as plain text and enforce a strict CSP.',
    safeCodeSample: `logCell.textContent = auditEntry.userAgentString;`
  }
];

export const PAYLOAD_KNOWLEDGE_LIBRARY: KnowledgePayloadEntry[] = [
  {
    id: 'pk-1',
    name: 'Standard Script Alert Probe',
    category: 'Basic XSS',
    difficulty: 'Beginner',
    code: `<script>alert('XSS Security Test')</script>`,
    explanation: 'The classic proof-of-concept payload that tests whether raw <script> tags are parsed and executed by the browser.',
    howItWorks: 'When inserted unencoded into an HTML document stream, the HTML parser switches to script execution mode and runs alert().',
    whereRelevant: 'Server-rendered pages that concatenate user input directly into the HTML response body.',
    expectedOutput: 'Triggers a harmless sandbox alert dialog displaying "XSS Security Test".',
    securityRisk: 'Proves that arbitrary inline JavaScript can execute within the application origin.',
    prevention: 'Encode < as &lt; and > as &gt; before inserting into HTML.',
    targetLab: 'reflected'
  },
  {
    id: 'pk-2',
    name: 'Direct JavaScript Statement Probe',
    category: 'Basic XSS',
    difficulty: 'Beginner',
    code: `alert('XSS Security Test');`,
    explanation: 'A pure JavaScript function call without surrounding HTML tags.',
    howItWorks: 'Used when user input is already placed inside an existing <script> block, an inline event attribute, or an eval() sink.',
    whereRelevant: 'JavaScript execution sinks or server templates that inject variables directly inside <script> tags.',
    expectedOutput: 'Executes alert("XSS Security Test") if placed inside a script execution context.',
    securityRisk: 'Allows direct execution of JavaScript statements without needing to inject < or > angle brackets.',
    prevention: 'Never pass user input to eval() or interpolate unescaped strings inside <script> blocks; use JSON.stringify() safely or data-* attributes.',
    targetLab: 'dom'
  },
  {
    id: 'pk-3',
    name: 'Heading Markup Injection Test',
    category: 'HTML Injection',
    difficulty: 'Beginner',
    code: `<h2>XSS Educational Test</h2>`,
    explanation: 'Tests whether the application allows raw HTML tags to alter page typography and layout.',
    howItWorks: 'The browser parses <h2> as a structural heading element rather than literal text.',
    whereRelevant: 'Search results headers, profile bios, and comment previews.',
    expectedOutput: 'Renders a large level-2 heading saying "XSS Educational Test" inside the page.',
    securityRisk: 'Indicates missing HTML output encoding, which allows UI manipulation and often leads to full XSS.',
    prevention: 'Render plain text via element.textContent or HTML entity encoding.',
    targetLab: 'reflected'
  },
  {
    id: 'pk-4',
    name: 'Image Onerror Event Handler',
    category: 'Reflected XSS',
    difficulty: 'Beginner',
    code: `<img src=x onerror=alert('XSS Security Test')>`,
    explanation: 'Uses an invalid image source ("x") to immediately trigger the onerror JavaScript event handler.',
    howItWorks: 'When the browser attempts to load src="x" and fails, it fires the onerror attribute, which executes JavaScript even inside innerHTML.',
    whereRelevant: 'Reflected, Stored, and DOM-Based XSS—especially where innerHTML is used (since innerHTML blocks <script> but runs <img onerror>).',
    expectedOutput: 'Shows a broken image icon and immediately fires the sandboxed alert dialog.',
    securityRisk: 'Bypasses naive filters that only look for "<script>" tags and executes reliably in dynamic DOM updates.',
    prevention: 'Use textContent for text, or strip all on* event attributes using DOMPurify.',
    targetLab: 'reflected'
  },
  {
    id: 'pk-5',
    name: 'Search Query URL Reflection Vector',
    category: 'Reflected XSS',
    difficulty: 'Beginner',
    code: `?q=<script>alert('Reflected XSS Demo')</script>`,
    explanation: 'Demonstrates how a query parameter in a URL carries a payload to a vulnerable search endpoint.',
    howItWorks: 'The server reads req.query.q and embeds it into the "Results for:" HTML string without encoding.',
    whereRelevant: 'Search bars, filter pages, and error message query parameters.',
    expectedOutput: 'The server response echoes the script tag and executes it in the browser.',
    securityRisk: 'Attackers can share crafted links that execute code when opened by a user.',
    prevention: 'Encode all URL query parameters before rendering them into HTML.',
    targetLab: 'reflected'
  },
  {
    id: 'pk-6',
    name: 'Reflected Attribute Breakout Probe',
    category: 'Reflected XSS',
    difficulty: 'Intermediate',
    code: `" autofocus onfocus=alert('Attribute XSS Demo') x="`,
    explanation: 'Demonstrates how unencoded double quotes allow input to break out of an HTML input value="" attribute.',
    howItWorks: 'Closes the existing value="..." attribute with a quote ("), adds autofocus and onfocus event handlers, and opens a dummy attribute.',
    whereRelevant: 'Search inputs that pre-fill the input box: <input value="[user_query]">.',
    expectedOutput: 'When the input automatically receives focus, the onfocus handler executes.',
    securityRisk: 'Even if < and > are filtered, failing to encode double quotes (") inside HTML attributes allows event handler injection.',
    prevention: 'Always encode double quotes (&quot;) and single quotes (&#39;) inside HTML attributes, or set input.value via JavaScript.',
    targetLab: 'reflected'
  },
  {
    id: 'pk-7',
    name: 'Reflected SVG Onload Probe',
    category: 'Reflected XSS',
    difficulty: 'Intermediate',
    code: `<svg onload=alert('SVG Reflected Test')></svg>`,
    explanation: 'Uses an inline <svg> graphic element whose onload event fires as soon as the tag is parsed.',
    howItWorks: 'HTML5 supports inline SVG elements directly inside HTML documents, including their onload event attributes.',
    whereRelevant: 'Reflected search outputs and rich comment previews.',
    expectedOutput: 'Executes the onload JavaScript handler immediately upon rendering.',
    securityRisk: 'Demonstrates that blocklisting only <script> and <img> leaves other HTML5/SVG tags vulnerable.',
    prevention: 'Use context-aware output encoding rather than tag blocklists.',
    targetLab: 'reflected'
  },
  {
    id: 'pk-8',
    name: 'Persistent Comment Script Vector',
    category: 'Stored XSS',
    difficulty: 'Beginner',
    code: `Helpful lecture! <script>alert('Stored XSS Demo')</script>`,
    explanation: 'Combines normal-looking comment text with an embedded <script> tag saved to the database.',
    howItWorks: 'The database saves the entire string; every time any user loads the comments page, the unencoded script is served and executed.',
    whereRelevant: 'Forum posts, blog comments, and student discussion boards.',
    expectedOutput: 'Displays "Helpful lecture!" and triggers the script for every visitor loading the page.',
    securityRisk: 'Persistent impact—victims do not need to click a special link; simply visiting the page triggers execution.',
    prevention: 'Encode all database-sourced fields before rendering them into HTML.',
    targetLab: 'stored'
  },
  {
    id: 'pk-9',
    name: 'Persistent Profile Bio Image Vector',
    category: 'Stored XSS',
    difficulty: 'Intermediate',
    code: `CS Undergraduate <img src=invalid onerror=alert('Stored Bio XSS')>`,
    explanation: 'A profile biography payload that executes when rendered via innerHTML in a user directory.',
    howItWorks: 'When the application renders user bios using innerHTML, the invalid image triggers onerror.',
    whereRelevant: 'User profile cards, author bio boxes, and team directories.',
    expectedOutput: 'Fires the onerror handler whenever a visitor views the user profile.',
    securityRisk: 'Can affect administrators or instructors reviewing student profiles.',
    prevention: 'Bind profile biography text using element.textContent or framework auto-escaping.',
    targetLab: 'stored'
  },
  {
    id: 'pk-10',
    name: 'Stored Details Toggle Event Probe',
    category: 'Stored XSS',
    difficulty: 'Intermediate',
    code: `<details open ontoggle=alert('Details Toggle XSS')><summary>Notes</summary></details>`,
    explanation: 'Uses the HTML5 <details> element with the open attribute so the ontoggle event fires automatically on load.',
    howItWorks: 'Because the open attribute is present initially, the browser triggers the toggle event immediately when rendering the element.',
    whereRelevant: 'Stored comments or wiki pages that allow partial HTML tags without stripping ontoggle.',
    expectedOutput: 'Renders a collapsible "Notes" widget and immediately executes the ontoggle script.',
    securityRisk: 'Shows how interactive HTML5 tags can execute code without user interaction.',
    prevention: 'Use a strict allowlist sanitizer (DOMPurify) that removes all on* event handler attributes.',
    targetLab: 'stored'
  },
  {
    id: 'pk-11',
    name: 'URL Hash Fragment DOM Probe',
    category: 'DOM-Based XSS',
    difficulty: 'Beginner',
    code: `#tab=<img src=x onerror=alert('DOM XSS Test')>`,
    explanation: 'Places an image event-handler payload inside the URL hash fragment (#) read by client-side JavaScript.',
    howItWorks: 'JavaScript reads window.location.hash and writes it to an element using innerHTML, creating the <img> node in the live DOM.',
    whereRelevant: 'Single-Page Applications (SPAs) and client-side tab routers that use location.hash.',
    expectedOutput: 'Mutates the DOM container and triggers the onerror script entirely on the client side.',
    securityRisk: 'The # fragment is never sent to the web server, so server-side firewalls cannot see or block it.',
    prevention: 'Use textContent instead of innerHTML and validate hash values against a fixed allowlist.',
    targetLab: 'dom'
  },
  {
    id: 'pk-12',
    name: 'DOM Body Onload Vector (document.write)',
    category: 'DOM-Based XSS',
    difficulty: 'Intermediate',
    code: `<body onload=alert('DOM Write Test')>`,
    explanation: 'Demonstrates how unsafe document.write() calls in client-side scripts parse structural tags.',
    howItWorks: 'When client-side code passes URL input into document.write(), the parser executes the body onload handler.',
    whereRelevant: 'Legacy scripts that use document.write(location.search) to print breadcrumbs or titles.',
    expectedOutput: 'Executes the onload event inside the browser.',
    securityRisk: 'Allows full DOM manipulation directly from URL parameters.',
    prevention: 'Replace all document.write() calls with document.createElement() and element.textContent.',
    targetLab: 'dom'
  },
  {
    id: 'pk-13',
    name: 'DOM Iframe Srcdoc Demonstration',
    category: 'DOM-Based XSS',
    difficulty: 'Advanced',
    code: `<iframe srcdoc="<script>alert('Nested Frame Test')</script>"></iframe>`,
    explanation: 'Shows how injecting an <iframe> with a srcdoc attribute can execute <script> tags even when injected via innerHTML.',
    howItWorks: 'While innerHTML does not execute direct <script> children, it DOES load an <iframe> whose srcdoc contains a <script>!',
    whereRelevant: 'Unsafe innerHTML sinks in client-side applications.',
    expectedOutput: 'Creates a sub-frame that executes the script inside srcdoc.',
    securityRisk: 'Demonstrates why innerHTML is never safe for untrusted strings, even if you think <script> is ignored by innerHTML.',
    prevention: 'Never pass untrusted strings to innerHTML; use textContent or sanitize with DOMPurify (which blocks iframe tags by default).',
    targetLab: 'dom'
  },
  {
    id: 'pk-14',
    name: 'Styled Banner HTML Injection',
    category: 'HTML Injection',
    difficulty: 'Beginner',
    code: `<div style="padding:8px;border:1px solid #38bdf8;color:#38bdf8;">System Notice: Maintenance Mode</div>`,
    explanation: 'Injects a styled notification banner without JavaScript to demonstrate visual page manipulation.',
    howItWorks: 'When raw HTML is rendered, inline CSS styles and div containers alter the visual appearance of the page.',
    whereRelevant: 'Comment sections, profile headers, and search result banners.',
    expectedOutput: 'Displays a bordered cyan notice box inside the target page.',
    securityRisk: 'Attackers can spoof official system notices or misleading instructions inside a legitimate webpage.',
    prevention: 'Encode HTML angle brackets so tags cannot be created by user text.',
    targetLab: 'stored'
  },
  {
    id: 'pk-15',
    name: 'Button UI Spoofing Demonstration',
    category: 'HTML Injection',
    difficulty: 'Intermediate',
    code: `<button type="button" onclick="alert('Clicked Injected Button')">Verify Student Account</button>`,
    explanation: 'Demonstrates how unencoded HTML allows an attacker to inject an interactive button with an onclick handler.',
    howItWorks: 'Renders a clickable HTML button element whose onclick attribute runs JavaScript when clicked by a user.',
    whereRelevant: 'Stored comments, forum posts, or unencoded message boards.',
    expectedOutput: 'Renders a button that runs the script when clicked.',
    securityRisk: 'Combines visual UI spoofing with event-driven script execution.',
    prevention: 'Encode output or strip button and onclick attributes via sanitization.',
    targetLab: 'stored'
  },
  {
    id: 'pk-16',
    name: 'Template Literal Interpolation Pitfall',
    category: 'JavaScript Injection Concepts',
    difficulty: 'Intermediate',
    code: `// Unsafe template interpolation:\ncontainer.innerHTML = \`<span class="badge">\${userInput}</span>\`;`,
    explanation: 'Illustrates a common developer mistake: assuming ES6 template literals (`${...}`) automatically escape HTML.',
    howItWorks: 'Standard JavaScript template literals perform raw string concatenation with zero HTML escaping.',
    whereRelevant: 'Vanilla JavaScript frontend components that build HTML strings dynamically.',
    expectedOutput: 'Any HTML or event handler inside userInput is parsed as live DOM markup.',
    securityRisk: 'One of the most frequent causes of DOM-Based and Stored XSS in custom JavaScript code.',
    prevention: 'Create the <span> with document.createElement("span") and set span.textContent = userInput.',
    targetLab: 'dom'
  },
  {
    id: 'pk-17',
    name: 'Unsafe eval() Dynamic Evaluation Pattern',
    category: 'JavaScript Injection Concepts',
    difficulty: 'Advanced',
    code: `// Unsafe code evaluation sink:\neval("console.log('" + untrustedInput + "')");`,
    explanation: 'Shows why passing user-controlled strings into eval() allows arbitrary JavaScript execution.',
    howItWorks: 'If untrustedInput contains \'); alert("XSS"); //, it closes the console.log statement and executes the injected command.',
    whereRelevant: 'Calculators, dynamic filter evaluators, or legacy JSON parsers using eval().',
    expectedOutput: 'Breaks out of the quoted string and runs the injected JavaScript statement.',
    securityRisk: 'Direct code execution sink in the JavaScript runtime.',
    prevention: 'Never use eval() or new Function() on user input; use JSON.parse() for data.',
    targetLab: 'dom'
  },
  {
    id: 'pk-18',
    name: 'Unsafe setTimeout String Argument',
    category: 'JavaScript Injection Concepts',
    difficulty: 'Intermediate',
    code: `// Unsafe: passing a code string to setTimeout\nsetTimeout("updateStatus('" + userStatus + "')", 500);`,
    explanation: 'Passing a string as the first argument to setTimeout() or setInterval() acts just like eval().',
    howItWorks: 'After the timer expires, the browser compiles and executes the string as JavaScript code.',
    whereRelevant: 'Client-side notification timers and polling scripts.',
    expectedOutput: 'Executes any injected statements embedded in userStatus.',
    securityRisk: 'Hidden eval-equivalent sink that security linters always flag.',
    prevention: 'Always pass a function reference: setTimeout(() => updateStatus(userStatus), 500).',
    targetLab: 'dom'
  },
  {
    id: 'pk-19',
    name: 'Safe DOM Text Assignment (textContent)',
    category: 'DOM Manipulation',
    difficulty: 'Beginner',
    code: `document.getElementById('demo').textContent = 'Safe Output';`,
    explanation: 'The gold-standard DOM property for inserting plain text into an element safely.',
    howItWorks: 'Updates the underlying CharacterData / TextNode directly without ever invoking the HTML parser.',
    whereRelevant: 'All client-side JavaScript updates where plain text (names, search queries, comments) is displayed.',
    expectedOutput: 'Renders the exact characters as safe text—even if the string contains <script> tags.',
    securityRisk: 'None—textContent completely neutralizes HTML and script tag injection.',
    prevention: 'Use textContent instead of innerHTML across your application.',
    targetLab: 'dom'
  },
  {
    id: 'pk-20',
    name: 'Unsafe vs Safe Rendering Comparison',
    category: 'DOM Manipulation',
    difficulty: 'Beginner',
    code: `// UNSAFE: Parses HTML & runs event handlers\nelement.innerHTML = userInput;\n\n// SAFE: Renders strictly as literal text\nelement.textContent = userInput;`,
    explanation: 'Side-by-side comparison of the most important DOM security distinction in web development.',
    howItWorks: 'innerHTML parses angle brackets into DOM elements; textContent treats angle brackets as ordinary printable characters.',
    whereRelevant: 'Every frontend codebase and university code review.',
    expectedOutput: 'Switching from innerHTML to textContent immediately stops DOM XSS in plain-text fields.',
    securityRisk: 'Using innerHTML with untrusted data is the #1 cause of DOM-Based XSS.',
    prevention: 'Enforce ESLint rule no-unsanitized/property to ban unverified innerHTML assignments.',
    targetLab: 'dom'
  },
  {
    id: 'pk-21',
    name: 'Safe Element Creation with createElement',
    category: 'DOM Manipulation',
    difficulty: 'Intermediate',
    code: `const item = document.createElement('li');\nitem.className = 'comment-row';\nitem.textContent = untrustedComment;\nlist.appendChild(item);`,
    explanation: 'Shows how to build structured HTML lists dynamically without using innerHTML template strings.',
    howItWorks: 'Creates the <li> element programmatically via the DOM API and populates its text node safely.',
    whereRelevant: 'Rendering lists of comments, search results, or chat messages.',
    expectedOutput: 'Appends a styled <li> element containing safe literal text.',
    securityRisk: 'None—completely immune to HTML tag breakout.',
    prevention: 'Prefer document.createElement() + textContent over string-based HTML building.',
    targetLab: 'stored'
  },
  {
    id: 'pk-22',
    name: 'Safe URL Protocol Validation Pattern',
    category: 'Secure Coding Examples',
    difficulty: 'Intermediate',
    code: `function setSafeLink(anchorEl, rawUrl) {\n  try {\n    const parsed = new URL(rawUrl, window.location.origin);\n    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {\n      anchorEl.href = parsed.href;\n    }\n  } catch {\n    anchorEl.href = '#';\n  }\n}`,
    explanation: 'Prevents javascript: and data: URI XSS when rendering user-submitted profile or website links.',
    howItWorks: 'Uses the built-in URL parser and explicitly checks that parsed.protocol is http: or https: before assigning to href.',
    whereRelevant: 'User profile website links, comment attachments, and redirect parameters.',
    expectedOutput: 'Allows valid web URLs while blocking javascript:alert(1) links.',
    securityRisk: 'Without protocol validation, clicking a link with href="javascript:..." executes code.',
    prevention: 'Always validate URL protocols against an explicit [http:, https:] allowlist.',
    targetLab: 'stored'
  },
  {
    id: 'pk-23',
    name: 'HTML Entity Encoding Helper Function',
    category: 'Secure Coding Examples',
    difficulty: 'Beginner',
    code: `function encodeHTML(str) {\n  return str\n    .replace(/&/g, '&amp;')\n    .replace(/</g, '&lt;')\n    .replace(/>/g, '&gt;')\n    .replace(/"/g, '&quot;')\n    .replace(/'/g, '&#39;');\n}`,
    explanation: 'Encodes the five critical HTML metacharacters into their safe entity equivalents.',
    howItWorks: 'Replaces &, <, >, ", and \' so the string cannot start a tag, close a tag, or break out of a quoted HTML attribute.',
    whereRelevant: 'Server-side HTML rendering and template helpers.',
    expectedOutput: 'Transforms <script> into &lt;script&gt;.',
    securityRisk: 'None when applied to HTML body and quoted attribute contexts.',
    prevention: 'Always encode all 5 characters (&, <, >, ", \'), not just angle brackets.',
    targetLab: 'reflected'
  },
  {
    id: 'pk-24',
    name: 'React JSX Auto-Escaping Pattern',
    category: 'Secure Coding Examples',
    difficulty: 'Beginner',
    code: `// Safe by default in React:\nexport function SearchBanner({ query }: { query: string }) {\n  return <div className="banner">Results for: {query}</div>;\n}`,
    explanation: 'Demonstrates how modern declarative frameworks like React automatically escape variables in curly braces {query}.',
    howItWorks: 'React creates DOM text nodes under the hood and escapes special characters before rendering.',
    whereRelevant: 'Modern React, Vue ({{ query }}), and Angular ({{ query }}) components.',
    expectedOutput: 'Displays any <script> tags in query as harmless plain text.',
    securityRisk: 'Safe unless developers bypass it using dangerouslySetInnerHTML.',
    prevention: 'Use standard JSX {variable} bindings and avoid dangerouslySetInnerHTML.',
    targetLab: 'reflected'
  },
  {
    id: 'pk-25',
    name: 'Harmless canary String Reflection Check',
    category: 'Vulnerability Detection',
    difficulty: 'Beginner',
    code: `XSSCheck_"<>'_2670`,
    explanation: 'A non-executable "canary" string used by security testers to inspect how an application encodes special characters.',
    howItWorks: 'Testers submit this string and inspect the page source (Ctrl+U / Inspect Element) to see which characters (<, >, ", \') were left unencoded.',
    whereRelevant: 'Initial vulnerability assessment of search boxes, forms, and URL parameters.',
    expectedOutput: 'In a secure app, the page source shows: XSSCheck_&quot;&lt;&gt;&#39;_2670.',
    securityRisk: 'If <, >, or " appear raw and unencoded in the HTML source, the field is likely vulnerable to XSS.',
    prevention: 'Verify that all special characters in the canary string are properly entity-encoded.',
    targetLab: 'reflected'
  },
  {
    id: 'pk-26',
    name: 'DevTools DOM Sink Audit Snippet',
    category: 'Vulnerability Detection',
    difficulty: 'Advanced',
    code: `// Search codebase for high-risk DOM XSS sinks:\n// 1. .innerHTML / .outerHTML\n// 2. document.write() / document.writeln()\n// 3. eval() / setTimeout("string")\n// 4. dangerouslySetInnerHTML`,
    explanation: 'Checklist of high-risk JavaScript sinks to search for during static code review.',
    howItWorks: 'By auditing every occurrence of these sinks and tracing where their input comes from, developers find DOM XSS bugs rapidly.',
    whereRelevant: 'Source code security audits and pull request reviews.',
    expectedOutput: 'Identifies lines of code that require refactoring to textContent or DOMPurify.',
    securityRisk: 'Unchecked sinks allow untrusted Sources to execute code.',
    prevention: 'Integrate automated static analysis (SAST / ESLint) into the build pipeline.',
    targetLab: 'dom'
  },
  {
    id: 'pk-27',
    name: 'DOMPurify Rich-Text Sanitization',
    category: 'XSS Prevention Examples',
    difficulty: 'Intermediate',
    code: `import DOMPurify from 'dompurify';\n\n// Strips <script>, onerror, onload while keeping safe <b>, <p>, <ul>:\nconst cleanHTML = DOMPurify.sanitize(untrustedMarkdownHTML);`,
    explanation: 'Shows how to safely allow formatted HTML comments by sanitizing them with DOMPurify before rendering.',
    howItWorks: 'Parses the HTML string into a DOM tree, removes all dangerous tags and event attributes against a strict allowlist, and returns safe HTML.',
    whereRelevant: 'Rich-text editors, blog platforms, and markdown previewers.',
    expectedOutput: 'Input "<b>Hello</b><img src=x onerror=alert(1)>" becomes "<b>Hello</b><img src=\\"x\\">".',
    securityRisk: 'Eliminates script execution while preserving legitimate text formatting.',
    prevention: 'Always run DOMPurify.sanitize() immediately before assigning rich HTML.',
    targetLab: 'stored'
  },
  {
    id: 'pk-28',
    name: 'Strict Content Security Policy (CSP) Header',
    category: 'XSS Prevention Examples',
    difficulty: 'Advanced',
    code: `Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self';`,
    explanation: 'An HTTP response header that instructs the browser to block all inline <script> tags and untrusted external script domains.',
    howItWorks: 'Because \'unsafe-inline\' is not present in script-src, the browser refuses to execute injected <script>alert(1)</script> or inline onerror handlers.',
    whereRelevant: 'All production web servers and API gateways.',
    expectedOutput: 'Browser Console logs a CSP block message and refuses to run the injected script.',
    securityRisk: 'Acts as a powerful second layer of defense (defense-in-depth) even if an encoding bug slips into code.',
    prevention: 'Deploy Content-Security-Policy headers on all HTML responses.',
    targetLab: 'reflected'
  },
  {
    id: 'pk-29',
    name: 'HttpOnly & SameSite Cookie Hardening',
    category: 'XSS Prevention Examples',
    difficulty: 'Intermediate',
    code: `res.cookie('session_token', tokenValue, {\n  httpOnly: true,\n  secure: true,\n  sameSite: 'strict',\n  maxAge: 3600000\n});`,
    explanation: 'Configures the authentication session cookie so client-side JavaScript cannot access it.',
    howItWorks: 'The httpOnly: true flag hides the cookie from document.cookie, preventing injected scripts from reading the session token.',
    whereRelevant: 'Authentication and login endpoints in Node.js/Express, FastAPI, or Django.',
    expectedOutput: 'document.cookie returns "" for the protected session token.',
    securityRisk: 'Drastically reduces the impact of XSS by protecting session identifiers from script access.',
    prevention: 'Always set HttpOnly, Secure, and SameSite on authentication cookies.',
    targetLab: 'stored'
  },
  {
    id: 'pk-30',
    name: 'Allowlist Parameter Validation Pattern',
    category: 'XSS Prevention Examples',
    difficulty: 'Beginner',
    code: `const ALLOWED_VIEWS = ['overview', 'courses', 'grades', 'labs'];\nconst requested = new URLSearchParams(location.search).get('view') ?? 'overview';\nconst activeView = ALLOWED_VIEWS.includes(requested) ? requested : 'overview';`,
    explanation: 'Validates a URL parameter against a fixed list of known safe values before using it in the application.',
    howItWorks: 'Any unexpected string (including HTML or script payloads) fails the .includes() check and safely falls back to "overview".',
    whereRelevant: 'Tab selectors, sort orders, category filters, and routing parameters.',
    expectedOutput: 'Guarantees that activeView only ever holds one of the four trusted strings.',
    securityRisk: 'Completely blocks arbitrary strings from entering the application flow.',
    prevention: 'Combine allowlist input validation with safe textContent rendering.',
    targetLab: 'dom'
  }
];

export const LEARNING_PATH_LESSONS: LearningLesson[] = [
  // LEVEL 1: Beginner
  {
    id: 'lesson-b1',
    level: 'Beginner',
    title: 'XSS Definition & Why It Exists',
    duration: '8 min',
    summary: 'Understand what Cross-Site Scripting means, why it uses the letter X, and how browsers confuse user data with code.',
    keyTakeaway: 'XSS happens when untrusted user input is rendered into a webpage without encoding, causing the victim browser to run it as code.',
    codeFocus: `<div>Welcome, &lt;script&gt;... (Safe Encoded Text)</div>`,
    targetSection: 'intro'
  },
  {
    id: 'lesson-b2',
    level: 'Beginner',
    title: 'HTML Basics & Tag Parsing',
    duration: '10 min',
    summary: 'Learn how the browser HTML parser reads angle brackets (< and >) and attributes to construct elements on screen.',
    keyTakeaway: 'Unescaped < and > characters allow user input to start new HTML elements inside the page structure.',
    codeFocus: `<h2>Injected Heading</h2> vs &lt;h2&gt;Literal Text&lt;/h2&gt;`,
    targetSection: 'intro'
  },
  {
    id: 'lesson-b3',
    level: 'Beginner',
    title: 'JavaScript Basics in the Browser',
    duration: '10 min',
    summary: 'Explore how JavaScript interacts with the webpage DOM, handles events (onload, onerror), and runs within the user session.',
    keyTakeaway: 'JavaScript can be triggered not only by <script> tags, but also by HTML event handler attributes like onerror and onload.',
    codeFocus: `document.getElementById('title').textContent = 'Updated Safely';`,
    targetSection: 'intro'
  },
  {
    id: 'lesson-b4',
    level: 'Beginner',
    title: 'Browser Security & Same-Origin Trust',
    duration: '12 min',
    summary: 'Understand why websites trust scripts delivered from their own domain and how attackers abuse that trust.',
    keyTakeaway: 'The browser trusts any script that arrives inside a legitimate webpage response from that origin.',
    codeFocus: `Origin: https://university.edu (Protocol + Host + Port)`,
    targetSection: 'lifecycle'
  },
  // LEVEL 2: Intermediate
  {
    id: 'lesson-i1',
    level: 'Intermediate',
    title: 'Reflected XSS Mechanics',
    duration: '15 min',
    summary: 'Trace how non-persistent payloads in URL parameters and search queries bounce off the server into the response.',
    keyTakeaway: 'Reflected XSS is non-persistent and typically delivered via a crafted link containing the payload in a query parameter.',
    codeFocus: `GET /search?q=<script>alert('XSS')</script>`,
    targetSection: 'types'
  },
  {
    id: 'lesson-i2',
    level: 'Intermediate',
    title: 'Stored (Persistent) XSS Mechanics',
    duration: '15 min',
    summary: 'Examine how malicious scripts saved in database tables (comments, profiles, reviews) execute automatically for every visitor.',
    keyTakeaway: 'Stored XSS persists in storage and affects every visitor who loads the page without needing a special link.',
    codeFocus: `INSERT INTO comments (body) -> Rendered unencoded to all readers`,
    targetSection: 'types'
  },
  {
    id: 'lesson-i3',
    level: 'Intermediate',
    title: 'DOM-Based XSS: Sources & Sinks',
    duration: '15 min',
    summary: 'Master client-side data flows from untrusted Sources (location.hash) to unsafe DOM Sinks (innerHTML).',
    keyTakeaway: 'DOM-Based XSS occurs entirely in client-side JavaScript, often without the payload ever reaching the server.',
    codeFocus: `Source: window.location.hash -> Unsafe Sink: element.innerHTML`,
    targetSection: 'types'
  },
  {
    id: 'lesson-i4',
    level: 'Intermediate',
    title: 'Mapping Vulnerable Input & Output Contexts',
    duration: '12 min',
    summary: 'Explore common application input surfaces across search bars, profiles, chat rooms, and admin logs.',
    keyTakeaway: 'Different HTML contexts (body text, attributes, href URLs, script blocks) require context-appropriate handling.',
    codeFocus: `HTML Body | Attribute value="..." | <a href="..."> | <script>`,
    targetSection: 'explorer'
  },
  // LEVEL 3: Practical
  {
    id: 'lesson-p1',
    level: 'Practical',
    title: 'Hands-On Attack Simulation (Attacker vs Victim)',
    duration: '20 min',
    summary: 'Run controlled test cases across the 3-panel Attacker Environment, Vulnerable Website, and Sandboxed Victim Browser.',
    keyTakeaway: 'Observe firsthand how switching from Vulnerable Mode to Secure Mode neutralizes every test vector.',
    codeFocus: `3-Panel Simulator: Attacker -> Target App -> Sandboxed Victim Browser`,
    targetSection: 'simulator'
  },
  {
    id: 'lesson-p2',
    level: 'Practical',
    title: 'Practical Laboratories: Search, Comments & URL DOM',
    duration: '20 min',
    summary: 'Test Reflected, Stored, and DOM-Based XSS in dedicated interactive sandboxes and compare raw vs. encoded output.',
    keyTakeaway: 'Hands-on verification of why <img src=x onerror=...> executes in innerHTML but renders as text in textContent.',
    codeFocus: `element.innerHTML (Unsafe) vs element.textContent (Safe)`,
    targetSection: 'lab'
  },
  {
    id: 'lesson-p3',
    level: 'Practical',
    title: 'Code Analysis & DevTools Inspection',
    duration: '15 min',
    summary: 'Use Browser Developer Tools and the local Training Code Analyzer to spot unsafe sinks and missing encoding.',
    keyTakeaway: 'Inspecting the live DOM tree reveals immediately whether user input created an HTML element or a safe #text node.',
    codeFocus: `DevTools Elements Inspector & Static Sink Analysis`,
    targetSection: 'detection'
  },
  {
    id: 'lesson-p4',
    level: 'Practical',
    title: 'Refactoring Vulnerable Code to Secure Code',
    duration: '15 min',
    summary: 'Practice replacing unsafe innerHTML, document.write, and unvalidated URLs with safe DOM APIs.',
    keyTakeaway: 'Small, disciplined code changes eliminate entire classes of injection vulnerabilities.',
    codeFocus: `element.textContent = untrustedInput;`,
    targetSection: 'prevention'
  },
  // LEVEL 4: Advanced Concepts
  {
    id: 'lesson-a1',
    level: 'Advanced Concepts',
    title: 'Context-Aware Encoding & DOMPurify Sanitization',
    duration: '15 min',
    summary: 'Understand how HTML entity encoding works for plain text and how AST-based sanitizers like DOMPurify handle rich HTML.',
    keyTakeaway: 'Use output encoding for plain text and DOMPurify when formatted HTML is intentionally permitted.',
    codeFocus: `const safeHTML = DOMPurify.sanitize(richTextComment);`,
    targetSection: 'prevention'
  },
  {
    id: 'lesson-a2',
    level: 'Advanced Concepts',
    title: 'Content Security Policy (CSP) & Trusted Types',
    duration: '15 min',
    summary: 'Configure HTTP headers that instruct modern browsers to block unauthorized inline scripts and enforce safe DOM sinks.',
    keyTakeaway: 'CSP provides defense-in-depth at the browser level even if a rendering bug exists in application code.',
    codeFocus: `Content-Security-Policy: default-src 'self'; script-src 'self'`,
    targetSection: 'prevention'
  },
  {
    id: 'lesson-a3',
    level: 'Advanced Concepts',
    title: 'Comparing XSS vs SQL Injection & CSRF',
    duration: '12 min',
    summary: 'Distinguish client-side script injection (XSS) from server-side database injection (SQLi) and cross-site request forgery (CSRF).',
    keyTakeaway: 'XSS runs JavaScript in the browser; SQL Injection manipulates SQL queries in the database server.',
    codeFocus: `XSS -> Output Encoding / textContent | SQLi -> Prepared Statements`,
    targetSection: 'comparison'
  },
  {
    id: 'lesson-a4',
    level: 'Advanced Concepts',
    title: 'Comprehensive Security Testing Methodology',
    duration: '15 min',
    summary: 'Complete the security testing checklist and take the 30-question cybersecurity examination.',
    keyTakeaway: 'Systematic verification across all inputs, outputs, cookies, and headers ensures production readiness.',
    codeFocus: `OWASP WSTG & ASVS Verification Workflow`,
    targetSection: 'exam'
  }
];

export const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    category: 'XSS Fundamentals',
    difficulty: 'Beginner',
    question: 'What does the abbreviation XSS stand for in web application security?',
    options: [
      'Extended Server Scripting',
      'Cross-Site Scripting',
      'External Style Sheets',
      'XML Security Standard'
    ],
    correctIndex: 1,
    explanation: 'XSS stands for Cross-Site Scripting. The letter "X" is used to avoid confusion with CSS (Cascading Style Sheets).'
  },
  {
    id: 2,
    category: 'XSS Fundamentals',
    difficulty: 'Beginner',
    question: 'Where does the injected code in a Cross-Site Scripting attack actually execute?',
    options: [
      'Inside the backend SQL database engine',
      'Inside the victim user web browser',
      'Inside the DNS resolver server',
      'Inside the network hardware firewall'
    ],
    correctIndex: 1,
    explanation: 'XSS is a client-side code injection vulnerability: the malicious JavaScript is delivered by the web application and executed inside the victim user browser.'
  },
  {
    id: 3,
    category: 'XSS Fundamentals',
    difficulty: 'Beginner',
    question: 'Why does a victim web browser execute JavaScript injected via XSS?',
    options: [
      'Because browsers cannot tell the difference between unencoded user input and legitimate script tags sent by the website',
      'Because the browser antivirus is turned off',
      'Because HTML files are encrypted on the hard drive',
      'Because JavaScript runs before the network cable is connected'
    ],
    correctIndex: 0,
    explanation: 'When user input is inserted into a webpage without encoding, the browser HTML parser sees it as part of the trusted website document and executes it.'
  },
  {
    id: 4,
    category: 'Reflected XSS',
    difficulty: 'Beginner',
    question: 'Why is Reflected XSS also called "Non-Persistent XSS"?',
    options: [
      'Because the malicious payload is not saved in the application database; it is echoed back immediately in a single HTTP response',
      'Because it only works for 5 seconds after the server starts',
      'Because it deletes the browser history automatically',
      'Because it does not use HTML or JavaScript'
    ],
    correctIndex: 0,
    explanation: 'Reflected XSS payloads travel in a single request (such as a URL query parameter) and are immediately reflected in the server response without being stored in a database.'
  },
  {
    id: 5,
    category: 'Reflected XSS',
    difficulty: 'Intermediate',
    question: 'In a typical Reflected XSS scenario, how does an attacker trigger the vulnerability in a victim browser?',
    options: [
      'By enticing the victim to open a specially crafted URL containing the payload in a query parameter',
      'By logging into the database server via SSH',
      'By changing the victim monitor resolution',
      'By modifying the browser executable binary'
    ],
    correctIndex: 0,
    explanation: 'Because the payload is not stored on the server, the victim must send a request containing the payload—typically by clicking a crafted link.'
  },
  {
    id: 6,
    category: 'Reflected XSS',
    difficulty: 'Intermediate',
    question: 'A search page takes ?q=test and outputs <p>Results for: test</p> without encoding. What happens if ?q=<script>alert(1)</script> is requested?',
    options: [
      'The server outputs <p>Results for: <script>alert(1)</script></p> and the browser executes alert(1)',
      'The database table is dropped automatically',
      'The browser converts the script into a PNG image',
      'Nothing happens because <p> tags disable JavaScript'
    ],
    correctIndex: 0,
    explanation: 'The unencoded <script> tag is placed directly inside the HTML response, causing the browser HTML parser to execute alert(1).'
  },
  {
    id: 7,
    category: 'Stored XSS',
    difficulty: 'Beginner',
    question: 'What defines a Stored (Persistent) XSS vulnerability?',
    options: [
      'The untrusted script is saved in the application storage (such as a database) and later served unencoded to users who view that page',
      'The script is stored only on the attacker USB drive',
      'The payload only works when the internet is disconnected',
      'The vulnerability only affects CSS font files'
    ],
    correctIndex: 0,
    explanation: 'In Stored XSS, the application saves the payload (for example, in a comment or user profile) and embeds it into pages viewed by subsequent visitors.'
  },
  {
    id: 8,
    category: 'Stored XSS',
    difficulty: 'Intermediate',
    question: 'Why does Stored XSS often have a broader impact than Reflected XSS?',
    options: [
      'Because every visitor who opens the affected page automatically receives and executes the stored script without needing to click a crafted link',
      'Because Stored XSS rewrites the operating system kernel',
      'Because Stored XSS bypasses HTTPS encryption on the network wire',
      'Because Stored XSS does not require a web browser'
    ],
    correctIndex: 0,
    explanation: 'Once a Stored XSS payload is saved on a popular page (like a forum thread or product review), every user who views that page is affected automatically.'
  },
  {
    id: 9,
    category: 'Stored XSS',
    difficulty: 'Intermediate',
    question: 'Which of the following features is most susceptible to Stored XSS if output encoding is missing?',
    options: [
      'A public student discussion comment board backed by a database',
      'A static company logo image',
      'A server-side math calculation that returns only a numeric status code',
      'An offline plain-text README file'
    ],
    correctIndex: 0,
    explanation: 'Comment boards accept text from one user, store it in a database, and render it to all other users—making output encoding essential.'
  },
  {
    id: 10,
    category: 'DOM-Based XSS',
    difficulty: 'Beginner',
    question: 'What does "DOM" stand for in DOM-Based XSS?',
    options: [
      'Document Object Model',
      'Database Object Manager',
      'Direct Output Module',
      'Dynamic Operating Memory'
    ],
    correctIndex: 0,
    explanation: 'DOM stands for Document Object Model—the browser live tree representation of the elements on a webpage.'
  },
  {
    id: 11,
    category: 'DOM-Based XSS',
    difficulty: 'Intermediate',
    question: 'In DOM-Based XSS, what is the difference between a "Source" and a "Sink"?',
    options: [
      'A Source is where untrusted input enters JavaScript (like location.hash), and a Sink is where it is written or executed in the DOM (like innerHTML)',
      'A Source is the database table, and a Sink is the network cable',
      'A Source is a CSS class, and a Sink is an HTML heading',
      'A Source is always safe, and a Sink is always a server firewall'
    ],
    correctIndex: 0,
    explanation: 'DOM XSS happens when data flows from a user-controlled Source (such as window.location.hash or location.search) into an unsafe DOM Sink (such as element.innerHTML).'
  },
  {
    id: 12,
    category: 'DOM-Based XSS',
    difficulty: 'Advanced',
    question: 'Why do traditional server-side Web Application Firewalls (WAFs) often fail to detect DOM-Based XSS payloads placed after the # hash symbol in a URL?',
    options: [
      'Because web browsers do not send the URL fragment (#hash) to the server in HTTP requests',
      'Because the # symbol encrypts the entire HTTP packet',
      'Because WAFs only inspect images and videos',
      'Because DOM-Based XSS only works on local files'
    ],
    correctIndex: 0,
    explanation: 'Per RFC specifications, the URL fragment identifier (everything after #) is processed strictly client-side by the browser and is never transmitted in the HTTP request to the server.'
  },
  {
    id: 13,
    category: 'Browser Security',
    difficulty: 'Intermediate',
    question: 'What is the role of the browser Same-Origin Policy (SOP), and how does XSS relate to it?',
    options: [
      'SOP isolates different websites from each other, but XSS bypasses this protection by running the attacker script inside the target website own origin',
      'SOP blocks all JavaScript from running on any website',
      'SOP automatically encodes all HTML tags in databases',
      'SOP prevents users from opening more than one browser tab'
    ],
    correctIndex: 0,
    explanation: 'Because an XSS payload executes inside the vulnerable page itself, the browser considers it part of that website origin, granting it full access to that origin DOM.'
  },
  {
    id: 14,
    category: 'Browser Security',
    difficulty: 'Intermediate',
    question: 'What does the HttpOnly attribute on a Set-Cookie response header accomplish?',
    options: [
      'It prevents client-side JavaScript (document.cookie) from reading the cookie value',
      'It forces the website to use HTTP instead of HTTPS',
      'It blocks the user from typing into HTML forms',
      'It disables all images on the webpage'
    ],
    correctIndex: 0,
    explanation: 'Setting HttpOnly on session cookies ensures that even if an XSS script executes in the browser, it cannot read the session cookie via document.cookie.'
  },
  {
    id: 15,
    category: 'Browser Security',
    difficulty: 'Advanced',
    question: 'When isolating an untrusted preview inside an <iframe>, why must you never combine allow-scripts and allow-same-origin in the sandbox attribute?',
    options: [
      'Because a script inside a same-origin iframe could access the parent page DOM or remove its own sandbox attribute',
      'Because it makes the iframe font size too small',
      'Because browsers do not support the sandbox attribute',
      'Because it deletes local storage automatically'
    ],
    correctIndex: 0,
    explanation: 'Using sandbox="allow-scripts" WITHOUT allow-same-origin places the iframe into a unique opaque origin so scripts inside the sandbox cannot access the host application.'
  },
  {
    id: 16,
    category: 'JavaScript',
    difficulty: 'Beginner',
    question: 'Which DOM property should you use to safely display plain text from a user without parsing HTML tags?',
    options: [
      'element.textContent',
      'element.innerHTML',
      'element.outerHTML',
      'document.write()'
    ],
    correctIndex: 0,
    explanation: 'element.textContent inserts a plain text node and never invokes the HTML parser, neutralizing any <script> or event-handler tags.'
  },
  {
    id: 17,
    category: 'JavaScript',
    difficulty: 'Intermediate',
    question: 'In modern browsers, what happens when <img src=x onerror=alert(1)> is assigned to element.innerHTML?',
    options: [
      'The browser creates the <img> element, fails to load src="x", and immediately executes alert(1)',
      'Nothing happens because innerHTML encodes all angle brackets',
      'The browser throws a syntax error before parsing the string',
      'Only <script> tags can run inside innerHTML'
    ],
    correctIndex: 0,
    explanation: 'While HTML5 specifies that <script> tags inserted via innerHTML should not execute, inline event handlers like <img src=x onerror=...> DO execute immediately!'
  },
  {
    id: 18,
    category: 'JavaScript',
    difficulty: 'Advanced',
    question: 'Why is setTimeout("doWork(\'" + userInput + "\')", 100) considered a dangerous JavaScript sink?',
    options: [
      'Because passing a string to setTimeout() evaluates that string as JavaScript code, acting just like eval()',
      'Because 100 milliseconds is too fast for the browser',
      'Because setTimeout() sends data to external servers',
      'Because setTimeout() modifies CSS stylesheets'
    ],
    correctIndex: 0,
    explanation: 'When setTimeout or setInterval receives a string instead of a function reference, it invokes the JavaScript compiler on that string. Always pass a function: setTimeout(() => doWork(userInput), 100).'
  },
  {
    id: 19,
    category: 'Vulnerability Detection',
    difficulty: 'Beginner',
    question: 'Why do ethical security testers use a harmless canary string like XSSCheck_"<>\'_2670 when testing input fields?',
    options: [
      'To safely inspect in the page source whether special characters (", <, >, \') are properly encoded or reflected raw',
      'To crash the web server CPU',
      'To guess the administrator password',
      'To test internet download speed'
    ],
    correctIndex: 0,
    explanation: 'A canary string containing HTML metacharacters lets testers see in the DOM inspector or page source whether the application encodes special characters.'
  },
  {
    id: 20,
    category: 'Vulnerability Detection',
    difficulty: 'Intermediate',
    question: 'Which panel in Chrome Developer Tools allows you to inspect the live DOM tree and verify whether input became a #text node or an HTML element?',
    options: [
      'The Elements (Inspector) panel',
      'The Memory heap allocation panel',
      'The Audio settings panel',
      'The Device battery simulator'
    ],
    correctIndex: 0,
    explanation: 'The Elements panel displays the live DOM tree. If user input is inside quotes as a #text node, it was rendered safely as text; if it expanded into a tag node, HTML injection occurred.'
  },
  {
    id: 21,
    category: 'Vulnerability Detection',
    difficulty: 'Advanced',
    question: 'During a static code review of a React codebase, which property should immediately be audited for potential XSS?',
    options: [
      'dangerouslySetInnerHTML',
      'className',
      'aria-label',
      'tabIndex'
    ],
    correctIndex: 0,
    explanation: 'React escapes standard JSX expressions by default, but dangerouslySetInnerHTML bypasses auto-escaping and inserts raw HTML directly into the DOM.'
  },
  {
    id: 22,
    category: 'Practical Testing',
    difficulty: 'Beginner',
    question: 'Why must all practical XSS demonstrations in an academic training platform run inside isolated local sandboxes?',
    options: [
      'To demonstrate how vulnerabilities work safely without exposing real sessions, external websites, or real users to harm',
      'To make the website use more RAM',
      'Because browsers cannot run JavaScript outside an iframe',
      'To hide the code from the instructor'
    ],
    correctIndex: 0,
    explanation: 'Ethical cybersecurity training strictly isolates vulnerable targets inside local sandboxed environments so learners can observe real mechanics with zero risk to external systems.'
  },
  {
    id: 23,
    category: 'Practical Testing',
    difficulty: 'Intermediate',
    question: 'In the Attacker vs Victim Simulator, what happens when you run the exact same payload after switching the target from Vulnerable Mode to Secure Mode?',
    options: [
      'The payload is encoded and rendered as harmless literal text on the page, and no script executes',
      'The payload executes twice as fast',
      'The browser closes the tab',
      'The database deletes all user accounts'
    ],
    correctIndex: 0,
    explanation: 'In Secure Mode, output encoding and textContent ensure that angle brackets and script tags are displayed as ordinary text characters.'
  },
  {
    id: 24,
    category: 'Practical Testing',
    difficulty: 'Intermediate',
    question: 'What does the payload <h2>XSS Educational Test</h2> demonstrate when submitted to an unencoded input field?',
    options: [
      'HTML Markup Injection—showing that the application fails to encode < and > angle brackets',
      'A SQL database connection error',
      'A network DNS outage',
      'Password hashing with bcrypt'
    ],
    correctIndex: 0,
    explanation: 'Injecting an <h2> tag proves that the application interprets user input as raw HTML markup rather than plain text.'
  },
  {
    id: 25,
    category: 'Secure Coding',
    difficulty: 'Beginner',
    question: 'Which character conversion correctly represents HTML Entity Output Encoding?',
    options: [
      '< becomes &lt; and > becomes &gt;',
      '< becomes [ and > becomes ]',
      '< becomes / and > becomes \\',
      '< becomes %00 and > becomes %FF'
    ],
    correctIndex: 0,
    explanation: 'HTML entity encoding converts < to &lt;, > to &gt;, & to &amp;, " to &quot;, and \' to &#39;.'
  },
  {
    id: 26,
    category: 'Secure Coding',
    difficulty: 'Intermediate',
    question: 'If an application puts user input inside a quoted HTML attribute like <input value="USER_INPUT">, why is encoding only < and > NOT enough?',
    options: [
      'Because an attacker can use a double quote (") to break out of the value attribute and inject an event handler like onfocus=alert(1)',
      'Because <input> tags do not support the value attribute',
      'Because browsers ignore < and > inside HTML documents',
      'Because attributes only accept numbers'
    ],
    correctIndex: 0,
    explanation: 'Inside a double-quoted attribute, a raw double quote (") closes the attribute early, allowing an attacker to add new attributes like autofocus onfocus=alert(1) without using < or >.'
  },
  {
    id: 27,
    category: 'Secure Coding',
    difficulty: 'Advanced',
    question: 'Why must user-provided URLs placed into <a href="USER_URL"> be validated for their protocol?',
    options: [
      'Because an attacker could supply a javascript:alert(1) URL that executes JavaScript when a user clicks the link',
      'Because http:// links cannot be clicked on mobile devices',
      'Because anchor tags automatically run SQL queries',
      'Because HTML entity encoding blocks javascript: URLs automatically'
    ],
    correctIndex: 0,
    explanation: 'HTML entity encoding does not stop a javascript: URI inside an href attribute! You must verify that the URL starts with https:// or http://.'
  },
  {
    id: 28,
    category: 'Prevention',
    difficulty: 'Beginner',
    question: 'When your application intentionally allows users to submit rich formatted HTML (such as bold text and bullet lists in a blog post), what defense should you use?',
    options: [
      'Sanitize the HTML using an allowlist sanitizer library like DOMPurify before rendering',
      'Disable all security checks so formatting works',
      'Only remove the word "alert" using string.replace()',
      'Use eval() to check the HTML'
    ],
    correctIndex: 0,
    explanation: 'DOMPurify parses the HTML and strips dangerous tags (<script>, <iframe>) and event attributes (onerror, onload) while preserving safe formatting tags.'
  },
  {
    id: 29,
    category: 'Prevention',
    difficulty: 'Intermediate',
    question: 'How does a Content Security Policy (CSP) header like "default-src \'self\'; script-src \'self\'" help defend against XSS?',
    options: [
      'It instructs the browser to block inline <script> tags, inline event handlers, and scripts from untrusted external domains',
      'It encrypts the SQLite database file on disk',
      'It automatically rewrites backend SQL queries',
      'It increases server network bandwidth'
    ],
    correctIndex: 0,
    explanation: 'Without \'unsafe-inline\', a CSP script-src directive tells the browser to refuse to execute inline <script> blocks or inline event attributes.'
  },
  {
    id: 30,
    category: 'Prevention',
    difficulty: 'Intermediate',
    question: 'How does Cross-Site Scripting (XSS) differ from SQL Injection (SQLi) in terms of primary prevention?',
    options: [
      'XSS is prevented by context-aware Output Encoding and safe DOM APIs (textContent), while SQL Injection is prevented by Parameterized Queries (Prepared Statements)',
      'Both are prevented only by changing the server IP address',
      'XSS is prevented by SQL Prepared Statements, while SQLi is prevented by element.textContent',
      'Neither vulnerability can be prevented in web applications'
    ],
    correctIndex: 0,
    explanation: 'XSS is an HTML/JS output & DOM injection issue (solved via Output Encoding, textContent, Sanitization, and CSP), whereas SQLi is a database query issue (solved via Parameterized Queries).'
  }
];

export const ACADEMY_PRESENTATION_SLIDES: AcademySlide[] = [
  {
    id: 1,
    category: 'Project Introduction',
    title: 'XSS Security Academy',
    subtitle: 'Understand Vulnerabilities. Experience Attacks. Master Web Security.',
    bullets: [
      'An interactive Computer Science cybersecurity learning and practical training platform.',
      'Combines foundational web security theory with isolated, hands-on browser simulations.',
      'Submitted By: Muhammad Masood · Roll Number: 2670 · Department of Computer Science.',
      'Subject: Cybersecurity · University Practical & Educational Demonstration.'
    ],
    speakerNotes:
      'Assalamu Alaikum and welcome. Today I am presenting XSS Security Academy—an interactive cybersecurity platform designed to teach Cross-Site Scripting from foundational theory to live, sandboxed exploitation and secure code remediation.',
    keyTakeaway: 'Mission: Bridge the gap between theoretical cybersecurity concepts and practical secure software engineering.'
  },
  {
    id: 2,
    category: 'Core Definition',
    title: 'What is Cross-Site Scripting (XSS)?',
    subtitle: 'Understanding client-side script injection in simple English',
    bullets: [
      'Full Form: Cross-Site Scripting (abbreviated as XSS to avoid confusion with CSS).',
      'Beginner Definition: When a website displays user input without encoding it, causing the browser to run that input as JavaScript code.',
      'Technical Definition: Injection of untrusted data into an HTTP response or DOM sink without context-aware validation or escaping.',
      'Execution Target: Unlike server attacks, XSS executes directly inside the victim user web browser.'
    ],
    codeComparison: {
      title: 'How the Browser Sees Unencoded vs Encoded Input',
      unsafe: `<div>Hello, <script>alert('XSS')</script></div>`,
      safe: `<div>Hello, &lt;script&gt;alert('XSS')&lt;/script&gt;</div>`
    },
    speakerNotes:
      'At its core, XSS is a confusion between data and code. When a user types <script> into a form and the website echoes it raw, the browser thinks the developer wrote that script.',
    keyTakeaway: 'Browsers trust any script that arrives inside a webpage from a trusted origin.'
  },
  {
    id: 3,
    category: 'Root Cause Analysis',
    title: 'Why Does XSS Happen?',
    subtitle: 'Mixing untrusted user input with HTML and JavaScript structure',
    bullets: [
      'HTML documents mix structural tags (<div>, <script>, <img>) and text content in the same character stream.',
      'Web applications constantly reflect search terms, store user comments, and read URL parameters.',
      'When developers concatenate raw strings into HTML or assign them to element.innerHTML, user input can create new tags.',
      'Because the script arrives inside the website own page, it inherits the user active session trust.'
    ],
    speakerNotes:
      'Why does XSS exist? Because web pages are built dynamically from strings. Whenever untrusted input is concatenated into HTML without encoding, the attacker can inject angle brackets or event attributes.',
    keyTakeaway: 'Root Cause: Failing to separate untrusted user data from executable HTML/JavaScript code.'
  },
  {
    id: 4,
    category: 'Attack Architecture',
    title: 'The XSS Attack Lifecycle',
    subtitle: 'From input discovery to browser execution and impact',
    bullets: [
      'Attacker identifies an input point (search bar, comment box, profile field, or URL parameter) and prepares a test payload.',
      'The web application receives the input and inserts it into the response or DOM without output encoding.',
      'The victim opens the affected page in their browser.',
      'The victim browser parses the unencoded markup and executes the injected script inside the session.'
    ],
    diagramVariant: 'master',
    speakerNotes:
      'This interactive diagram illustrates the lifecycle: Attacker -> Vulnerable Website -> Victim Browser -> Security Impact. Notice how encoding output breaks the chain.',
    keyTakeaway: 'Every XSS attack relies on the vulnerable website acting as the trusted delivery channel to the victim browser.'
  },
  {
    id: 5,
    category: 'Classification — Type A',
    title: 'Reflected Cross-Site Scripting (Non-Persistent)',
    subtitle: 'Attacker → Crafted Request → Vulnerable Server → Reflected Response → Victim Browser',
    bullets: [
      'Non-Persistent: The payload is not saved in the database; it travels inside a single HTTP request (such as ?q=...).',
      'Delivery: Typically delivered via a specially crafted URL shared with a victim.',
      'Common Locations: Search results headers, error messages, and unencoded URL query parameters.',
      'Defense: Encode request parameters on output and render search terms via element.textContent.'
    ],
    diagramVariant: 'reflected',
    speakerNotes:
      'In Reflected XSS, the script bounces off the web server in a single request-response cycle. A search bar that prints "Results for: [query]" without encoding is the classic example.',
    keyTakeaway: 'Never echo URL parameters or search queries into HTML without output encoding.'
  },
  {
    id: 6,
    category: 'Classification — Type B',
    title: 'Stored Cross-Site Scripting (Persistent)',
    subtitle: 'Attacker → Submit Content → Website Storage → Victim Opens Page → Browser Executes Script',
    bullets: [
      'Persistent: The payload is permanently saved inside the application database (SQLite / SQL).',
      'Mass Impact: Every visitor who opens the affected page automatically executes the script—no special link required.',
      'Common Locations: Comment sections, discussion forums, user profiles, product reviews, and chat rooms.',
      'Defense: Encode all database records on output and sanitize rich text with DOMPurify.'
    ],
    diagramVariant: 'stored',
    speakerNotes:
      'Stored XSS is often the most severe category because a single malicious comment saved in the database affects every student or administrator who opens that page.',
    keyTakeaway: 'Data loaded from your own database is still untrusted if it originated from user input.'
  },
  {
    id: 7,
    category: 'Classification — Type C',
    title: 'DOM-Based Cross-Site Scripting (Client-Side)',
    subtitle: 'URL Input → JavaScript Source → Unsafe DOM Sink → Browser DOM → Script Execution',
    bullets: [
      'Client-Side Flaw: Happens entirely inside browser JavaScript when data moves from a Source to an unsafe Sink.',
      'Sources: window.location.hash, window.location.search, document.referrer.',
      'Unsafe Sinks: element.innerHTML, outerHTML, document.write(), eval().',
      'Defense: Replace innerHTML with element.textContent and validate URL parameters against an allowlist.'
    ],
    diagramVariant: 'dom',
    speakerNotes:
      'In DOM-Based XSS, the server HTTP response is completely clean. The vulnerability happens when client-side JavaScript reads location.hash and passes it into innerHTML.',
    keyTakeaway: 'Audit every client-side flow from window.location (Source) to DOM mutation methods (Sinks).'
  },
  {
    id: 8,
    category: 'Attack Surface Mapping',
    title: 'Common Website Vulnerabilities',
    subtitle: 'Where XSS hides across real-world web applications',
    bullets: [
      'Search Boxes & Filter Bars: Echoing unencoded query strings on results pages.',
      'Comments, Reviews & Chat: Storing user posts in databases and rendering them with innerHTML.',
      'User Profiles & Registration: Unescaped display names or unvalidated javascript: profile links.',
      'Admin Dashboards: Rendering raw activity logs or HTTP User-Agent strings to privileged staff.'
    ],
    speakerNotes:
      'In our Vulnerability Explorer module, we map ten real-world input points and analyze how each one processes user data and where unsafe rendering can occur.',
    keyTakeaway: 'Every input point—even indirect data viewed only by administrators—must be output-encoded.'
  },
  {
    id: 9,
    category: 'Impact Analysis',
    title: 'Attacker Perspective vs. Victim Impact',
    subtitle: 'Understanding what happens when an XSS script executes in a browser',
    bullets: [
      'Session Risk: If session cookies lack the HttpOnly flag, scripts can inspect document.cookie.',
      'DOM & Page Manipulation: Scripts can alter displayed grades, prices, or announcements in real time.',
      'UI Spoofing: Injecting realistic-looking forms or prompts inside the trusted website layout.',
      'Unauthorized Actions: Sending authenticated requests on behalf of the logged-in user.'
    ],
    speakerNotes:
      'Why do organizations treat XSS so seriously? Because from the victim perspective, the malicious code is running inside the legitimate website they trust.',
    keyTakeaway: 'XSS compromises the integrity of the user browser session on the vulnerable origin.'
  },
  {
    id: 10,
    category: 'Live Demonstration',
    title: 'Practical XSS Attack Simulator Walkthrough',
    subtitle: 'Three-Panel Attacker Environment → Vulnerable Website → Sandboxed Victim Browser',
    bullets: [
      'Panel A (Attacker Environment): Select XSS category, choose an educational payload, and execute the test.',
      'Panel B (Vulnerable Target): Switch between Search, Comments, Profile, Product Review, and URL DOM targets.',
      'Panel C (Victim Browser): Observe isolated sandbox execution, then toggle Secure Mode to verify remediation.',
      'Safety Architecture: Strictly isolated inside a restricted sandboxed iframe with zero external network access.'
    ],
    speakerNotes:
      'We can click "Open Live Attack Simulator" right below to demonstrate Reflected, Stored, and DOM-Based XSS live in our three-panel simulator.',
    keyTakeaway: 'Switching from Vulnerable Mode to Secure Mode demonstrates the exact impact of secure coding.'
  },
  {
    id: 11,
    category: 'Educational Testing Vectors',
    title: 'XSS Payload Knowledge Library',
    subtitle: 'Harmless educational test cases for verifying application security',
    bullets: [
      'Basic Script Probe: <script>alert("XSS Security Test")</script> tests raw HTML response reflection.',
      'Markup Probe: <h2>XSS Educational Test</h2> verifies whether angle brackets are encoded.',
      'Event Handler Probe: <img src=x onerror=alert("XSS Test")> tests innerHTML and attribute filtering.',
      'Safe DOM Pattern: document.getElementById("demo").textContent = "Safe Output" proves safe rendering.'
    ],
    codeComparison: {
      title: 'Core Educational Test Vectors',
      single: `<script>alert('XSS Security Test')</script>\n<h2>XSS Educational Test</h2>\n<img src=x onerror=alert('XSS Security Test')>\ndocument.getElementById('demo').textContent = 'Safe Output';`
    },
    speakerNotes:
      'Our Knowledge Library includes 30 categorized educational entries with explanations, expected outputs, and one-click loading into the laboratory.',
    keyTakeaway: 'Ethical testers use harmless proof-of-concept probes to verify output encoding.'
  },
  {
    id: 12,
    category: 'Security Auditing',
    title: 'Vulnerability Detection Methodology',
    subtitle: 'Using Browser Developer Tools and static code analysis',
    bullets: [
      'Elements Panel: Inspect whether user input created an actual DOM element or a quoted #text node.',
      'Console & Network Panels: Check HTTP response payloads and Content Security Policy (CSP) reports.',
      'Source-to-Sink Code Audit: Search JavaScript files for innerHTML, outerHTML, document.write, and eval.',
      'Canary Testing: Submit harmless special-character probes to verify context-appropriate escaping.'
    ],
    speakerNotes:
      'In the Vulnerability Detection Center, we combine Chrome DevTools inspection techniques with an interactive local code analyzer that flags unsafe DOM sinks.',
    keyTakeaway: 'Combining manual DevTools inspection with automated static code analysis catches XSS early.'
  },
  {
    id: 13,
    category: 'Defense-in-Depth',
    title: 'XSS Prevention & Secure Coding Center',
    subtitle: 'Layered defenses that eliminate Cross-Site Scripting',
    bullets: [
      'Context-Aware Output Encoding: Convert &, <, >, ", and \' into safe HTML entities.',
      'Safe DOM APIs: Always use element.textContent instead of element.innerHTML for plain text.',
      'HTML Sanitization: Use DOMPurify when rich text formatting is intentionally allowed.',
      'Browser Hardening: Enforce Content Security Policy (CSP) headers and HttpOnly session cookies.'
    ],
    codeComparison: {
      title: 'The Golden Rule of DOM Text Rendering',
      unsafe: `// Unsafe: Parses HTML tags and runs scripts\nelement.innerHTML = userInput;`,
      safe: `// Safe for plain text: Never parses HTML\nelement.textContent = userInput;`
    },
    speakerNotes:
      'Replacing element.innerHTML with element.textContent for plain text and applying context-aware output encoding stops the vast majority of XSS vulnerabilities.',
    keyTakeaway: 'Defense-in-Depth: Input Validation + Output Encoding + textContent + DOMPurify + CSP + HttpOnly.'
  },
  {
    id: 14,
    category: 'Evaluation & Verification',
    title: 'Practical Results & Security Assessment',
    subtitle: 'Comparing Vulnerable Mode vs. Remediated Secure Mode across all modules',
    bullets: [
      'Reflected Search Lab: Unencoded query executed in Vulnerable Mode; rendered as literal text in Secure Mode.',
      'Stored Comment Lab: Persistent database script neutralized across all visitors using output encoding.',
      'DOM-Based URL Lab: Replacing innerHTML with textContent and allowlist validation stopped hash injection.',
      'Verified through our 16-lesson Learning Path, Security Testing Checklist, and 30-Question Examination.'
    ],
    speakerNotes:
      'Across all three practical laboratories and our 3-panel simulator, we verified that proper output encoding and safe DOM APIs completely neutralize script injection.',
    keyTakeaway: 'Every vulnerability demonstrated in the academy is paired with a verified, working code fix.'
  },
  {
    id: 15,
    category: 'Conclusion',
    title: 'Conclusion & Academic Summary',
    subtitle: 'XSS Security Academy — Computer Science Cybersecurity Project',
    bullets: [
      'Cross-Site Scripting remains one of the most critical web application security topics in Computer Science.',
      'Understanding how Reflected, Stored, and DOM-Based XSS operate empowers developers to write secure code from day one.',
      'Submitted By: Muhammad Masood · Roll Number: 2670 · Department of Computer Science.',
      'Thank you! Ready for Questions & Live Practical Simulator Demonstration.'
    ],
    speakerNotes:
      'Thank you very much for your time and attention. I would now be happy to answer any questions or demonstrate any scenario live in the Attack Simulator.',
    keyTakeaway: 'Understand Vulnerabilities. Experience Attacks. Master Web Security.'
  }
];

export const SECURITY_CHECKLIST_ITEMS = [
  {
    id: 'chk-1',
    category: 'Output Encoding & Templates',
    title: 'Encode all untrusted data before inserting into HTML body text (&, <, >, ", \')',
    detail: 'Verify that server templates and frontend components escape all five HTML metacharacters.'
  },
  {
    id: 'chk-2',
    category: 'Output Encoding & Templates',
    title: 'Quote all HTML attributes and encode dynamic attribute values',
    detail: 'Always wrap attributes in double quotes (value="...") and encode quotes inside the value.'
  },
  {
    id: 'chk-3',
    category: 'DOM & Client-Side JavaScript',
    title: 'Use element.textContent instead of element.innerHTML for plain text',
    detail: 'Audit all JavaScript files and replace innerHTML/outerHTML with textContent or createElement.'
  },
  {
    id: 'chk-4',
    category: 'DOM & Client-Side JavaScript',
    title: 'Eliminate document.write(), eval(), and string-based setTimeout()',
    detail: 'Never pass user-controllable strings into dynamic code evaluation functions.'
  },
  {
    id: 'chk-5',
    category: 'Rich HTML & URLs',
    title: 'Sanitize rich-text HTML with DOMPurify before rendering',
    detail: 'When formatted HTML is required (comments/blogs), strip <script>, <iframe>, and all on* attributes.'
  },
  {
    id: 'chk-6',
    category: 'Rich HTML & URLs',
    title: 'Validate URL protocols (allow only https: and http:) in href and src attributes',
    detail: 'Block javascript: and data: URIs in user profile links, avatars, and redirect parameters.'
  },
  {
    id: 'chk-7',
    category: 'Input Validation',
    title: 'Validate URL parameters, search filters, and tab names against strict allowlists',
    detail: 'Reject unexpected parameter values before they reach application rendering logic.'
  },
  {
    id: 'chk-8',
    category: 'Browser & Cookie Hardening',
    title: 'Configure a strict Content Security Policy (CSP) HTTP response header',
    detail: 'Restrict script-src to trusted origins or cryptographic nonces and disable unsafe-inline.'
  },
  {
    id: 'chk-9',
    category: 'Browser & Cookie Hardening',
    title: 'Set HttpOnly, Secure, and SameSite=Strict flags on session cookies',
    detail: 'Prevent client-side scripts from accessing sensitive authentication cookies via document.cookie.'
  },
  {
    id: 'chk-10',
    category: 'Verification & Testing',
    title: 'Test all search bars, comment forms, profile fields, and admin views with harmless probes',
    detail: 'Inspect the live DOM in Browser DevTools to confirm user input renders strictly as #text nodes.'
  }
];
