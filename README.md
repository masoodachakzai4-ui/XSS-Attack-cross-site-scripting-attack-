# XSS Security Academy

**Tagline:** *Understand Vulnerabilities. Experience Attacks. Master Web Security.*

---

## Academic Project Information

- **Project Title:** XSS Security Academy
- **Submitted By:** Muhammad Masood
- **Roll Number:** 2670
- **Department:** Computer Science
- **Subject:** Cybersecurity
- **Project Type:** University Practical & Educational Platform

---

## Project Overview

**XSS Security Academy** is an interactive web application security learning and practical training platform built for university Computer Science instruction and live classroom demonstration. It explains Cross-Site Scripting (XSS) from foundational concepts to intermediate/advanced defense-in-depth engineering, paired with isolated sandboxed browser laboratories.

### Core Modules Included

- **Overview Dashboard**: Live progress metrics, quick access to all three XSS categories, and the interactive `Attacker → Vulnerable Website → Victim Browser → Security Impact` flow diagram.
- **Introduction to XSS**: Beginner and technical definitions of Cross-Site Scripting plus 13 essential web and cybersecurity concepts with code examples.
- **XSS Attack Lifecycle**: Interactive stage-by-stage breakdown of how untrusted input enters an application and executes inside a victim browser.
- **Types of XSS**: Complete dedicated learning modules for **Reflected XSS**, **Stored XSS**, and **DOM-Based XSS** with architecture diagrams and side-by-side vulnerable vs. safe code.
- **Vulnerability Explorer**: Interactive attack-surface map analyzing 10 common website input points (Search boxes, Comment sections, User profiles, Product reviews, URL parameters, Login forms, Registration forms, Chat apps, Contact forms, and Admin dashboards).
- **Practical Attack Laboratory**: Three dedicated local sandboxes (Reflected Search Lab, Stored Comment Database Lab, and DOM Hash Sink Lab) executing safely inside restricted `sandbox="allow-scripts"` iframes.
- **Attacker vs Victim Simulator**: Three-panel real-time simulation workbench (*Attacker Environment*, *Vulnerable Website*, and *Victim Browser*) with instant switching between **Vulnerable Training Mode** and **Secure Remediated Mode**, plus **Victim Impact Visualization**.
- **XSS Payload Knowledge Library**: Searchable and filterable library of 30 controlled educational test cases, DOM patterns, and prevention examples with one-click copy and lab loading.
- **Step-by-Step Learning**: Structured curriculum organized across Beginner, Intermediate, Practical, and Advanced levels with persistent completion tracking.
- **Vulnerability Detection**: Chrome Developer Tools auditing guide and a local Training-Code Static Analyzer that detects unsafe `innerHTML`, `document.write`, `eval()`, and unencoded HTML strings.
- **XSS Prevention Center**: Comprehensive guide to Input Validation, Context-Aware Output Encoding, HTML Sanitization (`DOMPurify`), Content Security Policy (`CSP`), `HttpOnly` cookies, and safe DOM manipulation (`textContent` vs. `innerHTML`), plus a live encoding workbench.
- **XSS vs Other Attacks**: Side-by-side comparison matrix contrasting XSS against SQL Injection (SQLi), Cross-Site Request Forgery (CSRF), and HTML Injection.
- **Security Testing Checklist**: Interactive verification checklist for code reviews and security audits.
- **Interactive Examination**: 30 multiple-choice questions across 10 cybersecurity topics with a live timer, question navigator, automatic scoring, and detailed explanations.
- **Presentation Mode**: Full-screen university presentation slide deck with keyboard navigation (`←` / `→`), embedded interactive diagrams, and presenter speaker notes.
- **Project Information**: Academic overview, safety architecture, and local setup instructions.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start the local development server (http://localhost:3000)
npm run dev

# Build for production
npm run build
```
