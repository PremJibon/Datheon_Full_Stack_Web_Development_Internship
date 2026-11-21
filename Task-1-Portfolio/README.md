# Task 1: Developer Portfolio & Engineering Showcase

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-brightgreen?style=flat&logo=github)](https://premjibon.github.io/Datheon_Full_Stack_Web_Development_Internship/Task-1-Portfolio/)
[![Internship](https://img.shields.io/badge/Datheon-Cohort_2026-blue)](https://datheon.in)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Variables_%26_Grid-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla_ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A modern, responsive, accessible developer portfolio showcasing real-world technical projects, verified internship credentials, tech stack skills, and interactive contact channels.

Built as **Task 1** of the **Datheon Full Stack Web Development Internship** (Cohort 2026, Application ID: `DT-2026-3JZXE`).

---

## 🌐 Live URL
- **GitHub Pages:** [https://premjibon.github.io/Datheon_Full_Stack_Web_Development_Internship/Task-1-Portfolio/](https://premjibon.github.io/Datheon_Full_Stack_Web_Development_Internship/Task-1-Portfolio/)

---

## ✨ Features

- **Semantic HTML5 Architecture:**
  - Distinct `<header>`, `<main>`, `<section>`, `<article>`, `<dialog>`, and `<footer>` elements.
  - Proper heading hierarchies (`<h1>` through `<h4>`).
- **Dark & Light Mode Toggle:**
  - Implemented with CSS Custom Properties (Variables) on the root document.
  - Persists preference in `localStorage`.
  - Automatically respects user's system OS preference (`prefers-color-scheme`) on initial visit.
- **Mobile-First Responsive Layout:**
  - CSS Grid and Flexbox layouts tested across 320px mobile, tablet, and 4K desktop viewports.
  - Zero horizontal overflow.
- **Accessible Hamburger Navigation:**
  - Smooth mobile menu drawer with ARIA attributes (`aria-expanded`, `aria-controls`).
  - Closes automatically upon link selection, backdrop click, or pressing the `Escape` key.
- **Interactive Project Modals:**
  - Built using the native HTML5 `<dialog>` element for optimal accessibility.
  - Dynamically populates project metrics, technology badges, and capability highlights from data attributes.
  - Fully navigable with keyboard and backdrop click dismissal.
- **Smooth ScrollSpy Navigation:**
  - Real-time active navigation link highlighting as the user scrolls through sections.
- **Credential & Resume Verification:**
  - Direct download and view links for the verified PDF resume (`assets/Shahed_Hossain_Prem_Resume.pdf`).
  - Highlights Datheon Cohort 2026 enrollment and academic background at Kushtia Bheramara Govt. College.
- **Validated Contact Form:**
  - Client-side validation for name, valid email structure, subject, and message length with clear feedback states.

---

## 🛠️ Tech Stack & Tools

- **Markup:** HTML5 (Semantic, OpenGraph SEO, ARIA accessibility)
- **Styling:** Modern CSS3 (Variables, CSS Grid, Flexbox, Transitions)
- **Scripting:** Vanilla JavaScript (ES6+, DOM APIs, Native Dialog API, LocalStorage)
- **Deployment:** GitHub Pages / Vercel

---

## 📂 File Structure

```text
Task-1-Portfolio/
├── index.html                           # Semantic HTML structure & SEO meta tags
├── style.css                            # CSS variables, layout, dark/light themes
├── script.js                            # Theme switch, hamburger, scrollspy, modal logic
├── README.md                            # Task documentation & review guide
└── assets/
    ├── profile.jpg                      # Shahed Hossain Prem profile portrait
    ├── Shahed_Hossain_Prem_Resume.pdf   # Verified technical resume
    └── datheon-internship.png           # Datheon official offer badge
```

---

## 🚀 How to Run Locally

1. Clone or open the repository:
   ```bash
   git clone https://github.com/PremJibon/Datheon_Full_Stack_Web_Development_Internship.git
   cd Datheon_Full_Stack_Web_Development_Internship/Task-1-Portfolio
   ```
2. Open `index.html` in your default browser:
   - On Windows: double-click `index.html` or run `start index.html` in PowerShell.
   - Or run with VS Code Live Server extension.

---

## 👨‍💻 Developer & Evaluation Details

- **Author:** Shahed Hossain Prem
- **Internship ID:** DT-2026-3JZXE
- **Program:** Datheon Full Stack Web Development Internship (Cohort 2026)
- **Repository:** [PremJibon/Datheon_Full_Stack_Web_Development_Internship](https://github.com/PremJibon/Datheon_Full_Stack_Web_Development_Internship)
