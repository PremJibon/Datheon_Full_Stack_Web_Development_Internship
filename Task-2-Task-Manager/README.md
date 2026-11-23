# Task 2: TaskFlow Pro — Productivity Task Management Application

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-brightgreen?style=flat&logo=github)](https://premjibon.github.io/Datheon_Full_Stack_Web_Development_Internship/Task-2-Task-Manager/)
[![Internship](https://img.shields.io/badge/Datheon-Cohort_2026-blue)](https://datheon.in)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic_Markup-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Variables_%26_Grid-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla_ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![LocalStorage](https://img.shields.io/badge/Storage-Browser_LocalStorage_API-0284c7)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

A modern, responsive productivity application supporting complete task CRUD operations (Create, Read, Update, Delete), multi-category classification, due date tracking with overdue alerts, HTML5 drag-and-drop reordering, instant search, and browser `localStorage` persistence.

Built as **Task 2** of the **Datheon Full Stack Web Development Internship** (Cohort 2026, Application ID: `DT-2026-3JZXE`).

---

## 🌐 Live URL
- **GitHub Pages:** [https://premjibon.github.io/Datheon_Full_Stack_Web_Development_Internship/Task-2-Task-Manager/](https://premjibon.github.io/Datheon_Full_Stack_Web_Development_Internship/Task-2-Task-Manager/)

---

## ✨ Core Features & Technical Implementation

### 1. Complete Task CRUD Operations
- **Create:** Intuitive single-key entry with title, optional notes/description, category selector, priority level, and due date.
- **Read:** Dynamic card rendering with category color badges, priority indicator stripes, overdue warning tags, and completion checkmarks.
- **Update:** Accessible modal dialog using the native HTML5 `<dialog>` element allowing full inline edits of title, notes, category, priority, and due date.
- **Delete:** Instant removal with an interactive Toast Notification featuring an **Undo** action that restores the deleted task to its exact previous order.
- **Bulk Action:** "Clear Completed" action to clean up finished items with confirmation.

### 2. Multi-Tier Categorization & Priority Matrix
- **Categories:** Color-coded classification:
  - 💼 **Work**
  - 🏠 **Personal**
  - 📚 **Study**
  - 🔥 **Urgent**
  - 🏋️ **Health**
- **Priority Indicator:** Low (Green), Medium (Yellow), and High (Red) visual indicator stripes and badges.

### 3. Date Intelligence & Overdue Indicators
- Dynamically computes relative date differences:
  - 🔴 **Overdue:** Highlighted in red with count of overdue days.
  - 🟡 **Due Today:** Highlighted in amber.
  - 🟢 **Due Tomorrow / Upcoming:** Formatted in clean locale date strings.

### 4. Native HTML5 Drag-and-Drop Reordering
- Implemented with the standard HTML5 Drag and Drop API (`dragstart`, `dragover`, `drop`, `dragend`).
- Smooth visual feedback with ghosting, elevation, and active drop indicator lines.
- Custom drag ordering persists automatically into `localStorage`.

### 5. Instant Search, Multi-Filter & Sorting Engine
- **Search:** Debounced (250ms) real-time search across task titles and notes with a one-click clear button.
- **Status Filter:** Segmented tabs for `All`, `Active`, and `Completed`.
- **Category Filter:** Instant dropdown filter by specific category.
- **Sorting Options:**
  - ↕️ Custom Drag Order
  - 📅 Due Date (Earliest / Latest)
  - ⚡ Priority (High → Low)
  - 🕒 Created Date (Newest)
  - 🔤 Alphabetical (A-Z)

### 6. LocalStorage Persistence & Backup/Restore
- Tasks array (`tasks = []`) automatically syncs to browser `localStorage` on any state change.
- **Preloaded Seed Data:** First-time visits load realistic demo tasks demonstrating all features.
- **JSON Backup Export:** One-click export downloading timestamped `TaskFlow_Backup_YYYY-MM-DD.json`.
- **JSON Restore Import:** Validates and restores tasks from any exported JSON backup file.

### 7. Interactive Feedback & Canvas Confetti
- Custom animated checkbox with SVG spring stroke animation.
- Dynamic productivity metrics bar (Total, Active, Completed, and Completion Percentage).
- Pure HTML5 Canvas 2D confetti burst celebration upon reaching 100% completion rate.
- Dark & Light theme toggle respecting system preference and persisting in `localStorage`.

---

## 🛠️ Tech Stack & Tools

- **Markup:** HTML5 (Semantic, OpenGraph, ARIA accessibility attributes)
- **Styling:** CSS3 (Custom Variables, CSS Grid, Flexbox, Keyframe Animations)
- **Scripting:** Vanilla JavaScript (ES6+, DOM APIs, HTML5 Drag & Drop API, LocalStorage API, Canvas 2D)
- **Dependencies:** None (Zero external dependencies or build steps)

---

## 📂 File Structure

```text
Task-2-Task-Manager/
├── index.html                           # Semantic HTML structure, metrics & modal dialogs
├── style.css                            # CSS variables, layout, dark/light themes & animations
├── script.js                            # State engine, CRUD, localStorage, DnD & confetti
├── README.md                            # Task 2 documentation & review guide
└── assets/                              # Icons & documentation assets
```

---

## 🚀 How to Run Locally

1. Clone or navigate to the repository:
   ```bash
   git clone https://github.com/PremJibon/Datheon_Full_Stack_Web_Development_Internship.git
   cd Datheon_Full_Stack_Web_Development_Internship/Task-2-Task-Manager
   ```
2. Open `index.html` in your browser:
   - On Windows: double-click `index.html` or run `start index.html` in PowerShell.
   - Or run with VS Code Live Server extension.

---

## 👨‍💻 Developer & Evaluation Details

- **Author:** Shahed Hossain Prem
- **Internship ID:** DT-2026-3JZXE
- **Program:** Datheon Full Stack Web Development Internship (Cohort 2026)
- **Repository:** [PremJibon/Datheon_Full_Stack_Web_Development_Internship](https://github.com/PremJibon/Datheon_Full_Stack_Web_Development_Internship)
