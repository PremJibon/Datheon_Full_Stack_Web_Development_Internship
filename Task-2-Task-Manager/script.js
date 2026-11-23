/**
 * TaskFlow Pro - Productivity Task Manager
 * Complete CRUD, LocalStorage Persistence, Drag & Drop Reordering,
 * Live Search & Multi-Filter, Interactive Confetti & Accessible Dialogs.
 * Built for Datheon Full Stack Web Development Internship (Task 2).
 * Author: Shahed Hossain Prem
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Constants & Initial State
     ========================================================================== */
  const STORAGE_KEY = 'datheon_taskflow_pro_tasks';
  const THEME_KEY = 'taskflow-theme';

  let tasks = [];
  let deletedTaskBackup = null; // Used for Undo functionality
  let undoTimeout = null;
  let draggedTaskId = null;

  // Active filters and sort state
  const filterState = {
    search: '',
    status: 'all',     // 'all' | 'active' | 'completed'
    category: 'all',   // 'all' | 'work' | 'personal' | 'study' | 'urgent' | 'health'
    sortBy: 'manual'   // 'manual' | 'due-asc' | 'due-desc' | 'priority-desc' | 'created-desc' | 'alpha-asc'
  };

  /* Default Seed Tasks (Loaded on first visit) */
  const SEED_TASKS = [
    {
      id: 'task-seed-1',
      title: 'Complete Datheon Internship Task 2',
      description: 'Implement full CRUD operations, LocalStorage persistence, and drag-and-drop reordering.',
      category: 'work',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      completed: true,
      createdAt: Date.now() - 3600000 * 5,
      order: 0
    },
    {
      id: 'task-seed-2',
      title: 'Review REST API integration endpoints for Task 3',
      description: 'Prepare OpenWeatherMap and WeatherAPI async fetch telemetry architecture.',
      category: 'study',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      completed: false,
      createdAt: Date.now() - 3600000 * 3,
      order: 1
    },
    {
      id: 'task-seed-3',
      title: 'Update LinkedIn internship progress post',
      description: 'Share project milestone screenshot tagging @Datheon for credential verification.',
      category: 'personal',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0], // Today
      completed: false,
      createdAt: Date.now() - 3600000 * 2,
      order: 2
    },
    {
      id: 'task-seed-4',
      title: '30-minute cardio & stretch workout',
      description: 'Daily health routine to maintain high engineering focus.',
      category: 'health',
      priority: 'low',
      dueDate: '',
      completed: false,
      createdAt: Date.now() - 3600000 * 1,
      order: 3
    }
  ];

  /* ==========================================================================
     2. DOM Element Selectors
     ========================================================================== */
  const rootElement = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');

  // Metrics
  const statTotal = document.getElementById('stat-total');
  const statActive = document.getElementById('stat-active');
  const statCompleted = document.getElementById('stat-completed');
  const statPercent = document.getElementById('stat-percent');
  const progressBar = document.getElementById('progress-bar');

  // Form Elements
  const taskForm = document.getElementById('task-form');
  const taskTitleInput = document.getElementById('task-title-input');
  const taskDescInput = document.getElementById('task-desc-input');
  const taskCategorySelect = document.getElementById('task-category-select');
  const taskPrioritySelect = document.getElementById('task-priority-select');
  const taskDueInput = document.getElementById('task-due-input');

  // Toolbar
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const statusTabs = document.querySelectorAll('.status-tab');
  const categoryFilter = document.getElementById('category-filter');
  const sortSelect = document.getElementById('sort-select');

  // Task List & Empty State
  const taskListEl = document.getElementById('task-list');
  const emptyStateEl = document.getElementById('empty-state');
  const renderedCountEl = document.getElementById('rendered-count');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');

  // Edit Modal
  const editModal = document.getElementById('edit-modal');
  const editTaskForm = document.getElementById('edit-task-form');
  const editTaskId = document.getElementById('edit-task-id');
  const editTitleInput = document.getElementById('edit-title-input');
  const editTitleError = document.getElementById('edit-title-error');
  const editDescInput = document.getElementById('edit-desc-input');
  const editCategorySelect = document.getElementById('edit-category-select');
  const editPrioritySelect = document.getElementById('edit-priority-select');
  const editDueInput = document.getElementById('edit-due-input');
  const closeEditModalBtn = document.getElementById('close-edit-modal-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');

  // Backup / Restore
  const exportBtn = document.getElementById('export-btn');
  const importFile = document.getElementById('import-file');

  // Toast Container & Confetti
  const toastContainer = document.getElementById('toast-container');
  const confettiCanvas = document.getElementById('confetti-canvas');

  /* ==========================================================================
     3. Theme Initialization & Management
     ========================================================================== */
  const initTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    const preferred = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    rootElement.setAttribute('data-theme', preferred);
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = rootElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      rootElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ==========================================================================
     4. LocalStorage Helpers
     ========================================================================== */
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      updateMetrics();
    } catch (e) {
      console.error('LocalStorage quota exceeded or error saving tasks', e);
      showToast('⚠️ Storage limit reached. Cannot save changes.');
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        tasks = JSON.parse(raw);
      } else {
        tasks = [...SEED_TASKS];
        saveToLocalStorage();
      }
    } catch (e) {
      console.error('Failed to parse localStorage tasks, falling back to seed', e);
      tasks = [...SEED_TASKS];
    }
  };

  /* ==========================================================================
     5. Productivity Metrics & Progress Bar
     ========================================================================== */
  let previousPercent = 0;

  const updateMetrics = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    statTotal.textContent = total;
    statActive.textContent = active;
    statCompleted.textContent = completed;
    statPercent.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;
    progressBar.parentElement.setAttribute('aria-valuenow', percent);

    // Trigger celebration when user achieves 100% completion (and has at least 1 task)
    if (percent === 100 && total > 0 && previousPercent < 100) {
      triggerConfetti();
      showToast('🎉 Outstanding! You completed all tasks!');
    }
    previousPercent = percent;
  };

  /* ==========================================================================
     6. Rendering & Filtering Pipeline
     ========================================================================== */
  const getFilteredAndSortedTasks = () => {
    let result = [...tasks];

    // Status Filter
    if (filterState.status === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (filterState.status === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Category Filter
    if (filterState.category !== 'all') {
      result = result.filter((t) => t.category === filterState.category);
    }

    // Search Query Filter
    if (filterState.search.trim()) {
      const q = filterState.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (filterState.sortBy) {
      case 'due-asc':
        result.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        });
        break;
      case 'due-desc':
        result.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return b.dueDate.localeCompare(a.dueDate);
        });
        break;
      case 'priority-desc': {
        const pWeight = { high: 3, medium: 2, low: 1 };
        result.sort((a, b) => (pWeight[b.priority] || 0) - (pWeight[a.priority] || 0));
        break;
      }
      case 'created-desc':
        result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
      case 'alpha-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'manual':
      default:
        result.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        break;
    }

    return result;
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const todayStr = new Date().toISOString().split('T')[0];
    const dueTime = new Date(dateStr + 'T00:00:00');
    const todayTime = new Date(todayStr + 'T00:00:00');
    const diffDays = Math.round((dueTime - todayTime) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)}d`, status: 'is-overdue' };
    } else if (diffDays === 0) {
      return { text: 'Due Today', status: 'is-today' };
    } else if (diffDays === 1) {
      return { text: 'Due Tomorrow', status: 'is-upcoming' };
    } else {
      const options = { month: 'short', day: 'numeric' };
      return { text: dueTime.toLocaleDateString(undefined, options), status: 'is-upcoming' };
    }
  };

  const escapeHTML = (str) => {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const renderTaskList = () => {
    const filtered = getFilteredAndSortedTasks();
    renderedCountEl.textContent = filtered.length;

    taskListEl.innerHTML = '';

    if (filtered.length === 0) {
      emptyStateEl.style.display = 'block';
      return;
    }

    emptyStateEl.style.display = 'none';

    filtered.forEach((task) => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'is-completed' : ''}`;
      li.setAttribute('data-id', task.id);
      li.setAttribute('data-priority', task.priority);
      li.setAttribute('draggable', filterState.sortBy === 'manual' ? 'true' : 'false');

      const dueInfo = formatDueDate(task.dueDate);

      li.innerHTML = `
        <div class="drag-handle" title="${filterState.sortBy === 'manual' ? 'Drag to reorder' : 'Sorting active (switch to Custom Order to drag)'}" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="2"></circle><circle cx="15" cy="6" r="2"></circle>
            <circle cx="9" cy="12" r="2"></circle><circle cx="15" cy="12" r="2"></circle>
            <circle cx="9" cy="18" r="2"></circle><circle cx="15" cy="18" r="2"></circle>
          </svg>
        </div>

        <button type="button" class="checkbox-btn" aria-label="${task.completed ? 'Mark task incomplete' : 'Mark task complete'}" title="${task.completed ? 'Mark incomplete' : 'Mark complete'}">
          <span class="checkbox-box">
            <svg class="checkmark-icon" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </button>

        <div class="task-content">
          <div class="task-title-line">
            <span class="task-title">${escapeHTML(task.title)}</span>
          </div>
          ${task.description ? `<p class="task-notes">${escapeHTML(task.description)}</p>` : ''}
          <div class="task-meta-row">
            <span class="badge-category" data-cat="${task.category}">${task.category}</span>
            <span class="badge-priority" data-prio="${task.priority}">${task.priority}</span>
            ${dueInfo ? `<span class="badge-due ${dueInfo.status}">📅 ${dueInfo.text}</span>` : ''}
          </div>
        </div>

        <div class="task-actions">
          <button type="button" class="action-btn btn-edit" title="Edit task" aria-label="Edit task">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button type="button" class="action-btn btn-delete" title="Delete task" aria-label="Delete task">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      `;

      // Event Listeners for Task Items
      const checkboxBtn = li.querySelector('.checkbox-btn');
      checkboxBtn.addEventListener('click', () => toggleTaskComplete(task.id));

      const editBtn = li.querySelector('.btn-edit');
      editBtn.addEventListener('click', () => openEditModal(task));

      const deleteBtn = li.querySelector('.btn-delete');
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      // Drag and Drop listeners
      if (filterState.sortBy === 'manual') {
        bindDragAndDropEvents(li);
      }

      taskListEl.appendChild(li);
    });
  };

  /* ==========================================================================
     7. CRUD Operations
     ========================================================================== */
  // Create
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const titleVal = taskTitleInput.value.trim();
    if (!titleVal) {
      taskTitleInput.focus();
      return;
    }

    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      title: titleVal,
      description: taskDescInput.value.trim(),
      category: taskCategorySelect.value,
      priority: taskPrioritySelect.value,
      dueDate: taskDueInput.value,
      completed: false,
      createdAt: Date.now(),
      order: tasks.length
    };

    tasks.unshift(newTask);
    // Reindex order
    tasks.forEach((t, i) => (t.order = i));

    saveToLocalStorage();
    renderTaskList();

    // Reset Form
    taskForm.reset();
    taskCategorySelect.value = 'study';
    taskPrioritySelect.value = 'medium';
    taskTitleInput.focus();

    showToast('✨ Task created successfully!');
  });

  // Toggle Complete
  const toggleTaskComplete = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    saveToLocalStorage();
    renderTaskList();
  };

  // Delete with Undo Toast
  const deleteTask = (id) => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;

    deletedTaskBackup = { task: { ...tasks[index] }, index };
    tasks.splice(index, 1);
    tasks.forEach((t, i) => (t.order = i));

    saveToLocalStorage();
    renderTaskList();

    showToast(`🗑️ Task deleted`, () => {
      // Undo Callback
      if (deletedTaskBackup) {
        tasks.splice(deletedTaskBackup.index, 0, deletedTaskBackup.task);
        tasks.forEach((t, i) => (t.order = i));
        saveToLocalStorage();
        renderTaskList();
        deletedTaskBackup = null;
        showToast('↩️ Task restored');
      }
    });
  };

  // Clear Completed Tasks
  clearCompletedBtn.addEventListener('click', () => {
    const completedCount = tasks.filter((t) => t.completed).length;
    if (completedCount === 0) {
      showToast('No completed tasks to clear.');
      return;
    }

    if (confirm(`Clear all ${completedCount} completed task(s)?`)) {
      tasks = tasks.filter((t) => !t.completed);
      tasks.forEach((t, i) => (t.order = i));
      saveToLocalStorage();
      renderTaskList();
      showToast(`Cleared ${completedCount} completed tasks.`);
    }
  });

  // Edit Modal Flow
  const openEditModal = (task) => {
    editTaskId.value = task.id;
    editTitleInput.value = task.title;
    editTitleError.textContent = '';
    editDescInput.value = task.description || '';
    editCategorySelect.value = task.category || 'work';
    editPrioritySelect.value = task.priority || 'medium';
    editDueInput.value = task.dueDate || '';

    if (typeof editModal.showModal === 'function') {
      editModal.showModal();
    } else {
      editModal.setAttribute('open', '');
    }
    editTitleInput.focus();
  };

  const closeEditModal = () => {
    if (typeof editModal.close === 'function') {
      editModal.close();
    } else {
      editModal.removeAttribute('open');
    }
  };

  closeEditModalBtn.addEventListener('click', closeEditModal);
  cancelEditBtn.addEventListener('click', closeEditModal);

  // Backdrop click dismiss for dialog
  editModal.addEventListener('click', (e) => {
    const rect = editModal.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      closeEditModal();
    }
  });

  editTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = editTaskId.value;
    const titleVal = editTitleInput.value.trim();

    if (!titleVal) {
      editTitleError.textContent = 'Please enter a task title.';
      editTitleInput.focus();
      return;
    }

    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.title = titleVal;
      task.description = editDescInput.value.trim();
      task.category = editCategorySelect.value;
      task.priority = editPrioritySelect.value;
      task.dueDate = editDueInput.value;

      saveToLocalStorage();
      renderTaskList();
      closeEditModal();
      showToast('💾 Task updated successfully!');
    }
  });

  /* ==========================================================================
     8. Drag and Drop Reordering (HTML5 API)
     ========================================================================== */
  const bindDragAndDropEvents = (itemEl) => {
    itemEl.addEventListener('dragstart', (e) => {
      draggedTaskId = itemEl.getAttribute('data-id');
      itemEl.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', draggedTaskId);
    });

    itemEl.addEventListener('dragend', () => {
      itemEl.classList.remove('is-dragging');
      document.querySelectorAll('.task-item').forEach((el) => {
        el.classList.remove('drag-over-top', 'drag-over-bottom');
      });
      draggedTaskId = null;
    });

    itemEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      const rect = itemEl.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;

      if (e.clientY < mid) {
        itemEl.classList.add('drag-over-top');
        itemEl.classList.remove('drag-over-bottom');
      } else {
        itemEl.classList.add('drag-over-bottom');
        itemEl.classList.remove('drag-over-top');
      }
    });

    itemEl.addEventListener('dragleave', () => {
      itemEl.classList.remove('drag-over-top', 'drag-over-bottom');
    });

    itemEl.addEventListener('drop', (e) => {
      e.preventDefault();
      itemEl.classList.remove('drag-over-top', 'drag-over-bottom');

      const targetId = itemEl.getAttribute('data-id');
      if (!draggedTaskId || draggedTaskId === targetId) return;

      const fromIndex = tasks.findIndex((t) => t.id === draggedTaskId);
      const toIndex = tasks.findIndex((t) => t.id === targetId);

      if (fromIndex === -1 || toIndex === -1) return;

      // Reorder array
      const [movedTask] = tasks.splice(fromIndex, 1);

      const rect = itemEl.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const insertIndex = e.clientY < mid ? toIndex : toIndex + 1;

      tasks.splice(insertIndex > fromIndex ? insertIndex - 1 : insertIndex, 0, movedTask);

      // Persist order indices
      tasks.forEach((t, idx) => (t.order = idx));

      saveToLocalStorage();
      renderTaskList();
      showToast('↕️ Task order saved');
    });
  };

  /* ==========================================================================
     9. Search, Filter & Sort Listeners
     ========================================================================== */
  // Debounced Search
  let searchDebounceTimer = null;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchDebounceTimer);
    const val = e.target.value;
    clearSearchBtn.style.display = val ? 'block' : 'none';

    searchDebounceTimer = setTimeout(() => {
      filterState.search = val;
      renderTaskList();
    }, 250);
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    filterState.search = '';
    renderTaskList();
    searchInput.focus();
  });

  // Status Tabs
  statusTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      statusTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      filterState.status = tab.getAttribute('data-status');
      renderTaskList();
    });
  });

  // Category Filter
  categoryFilter.addEventListener('change', (e) => {
    filterState.category = e.target.value;
    renderTaskList();
  });

  // Sorting
  sortSelect.addEventListener('change', (e) => {
    filterState.sortBy = e.target.value;
    renderTaskList();
  });

  // Reset Filters CTA
  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    filterState.search = '';
    filterState.status = 'all';
    filterState.category = 'all';
    filterState.sortBy = 'manual';

    statusTabs.forEach((t) => {
      t.classList.toggle('active', t.getAttribute('data-status') === 'all');
      t.setAttribute('aria-selected', t.getAttribute('data-status') === 'all');
    });

    categoryFilter.value = 'all';
    sortSelect.value = 'manual';

    renderTaskList();
  });

  /* ==========================================================================
     10. Backup & Restore (JSON Export & Import)
     ========================================================================== */
  exportBtn.addEventListener('click', () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TaskFlow_Backup_${today}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('📦 Tasks exported to JSON backup.');
  });

  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          tasks = imported;
          tasks.forEach((t, i) => {
            if (t.order === undefined) t.order = i;
          });
          saveToLocalStorage();
          renderTaskList();
          showToast(`✅ Successfully imported ${tasks.length} task(s)!`);
        } else {
          showToast('⚠️ Invalid JSON backup format.');
        }
      } catch (err) {
        console.error('Import parse error', err);
        showToast('⚠️ Error parsing uploaded JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  });

  /* ==========================================================================
     11. Toast Notification System
     ========================================================================== */
  const showToast = (message, undoAction = null) => {
    const toast = document.createElement('div');
    toast.className = 'toast';

    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    toast.appendChild(textSpan);

    if (undoAction) {
      const undoBtn = document.createElement('button');
      undoBtn.className = 'toast-undo-btn';
      undoBtn.textContent = 'Undo';
      undoBtn.addEventListener('click', () => {
        undoAction();
        toast.remove();
      });
      toast.appendChild(undoBtn);
    }

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  };

  /* ==========================================================================
     12. Confetti Particle Engine (Pure Canvas 2D)
     ========================================================================== */
  const triggerConfetti = () => {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    let width = (confettiCanvas.width = window.innerWidth);
    let height = (confettiCanvas.height = window.innerHeight);

    const particles = [];
    const colors = ['#38bdf8', '#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ec4899'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: width / 2,
        y: height / 2,
        r: Math.random() * 6 + 4,
        d: Math.random() * 90,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncremental: Math.random() * 0.07 + 0.05,
        tiltAngle: 0,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14 - 3
      });
    }

    let animationFrame;
    let opacity = 1;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.d);
        p.tilt = Math.sin(p.tiltAngle) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      opacity -= 0.008;
      confettiCanvas.style.opacity = Math.max(0, opacity);

      if (opacity > 0) {
        animationFrame = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, width, height);
        confettiCanvas.style.opacity = '1';
      }
    };

    draw();
  };

  window.addEventListener('resize', () => {
    if (confettiCanvas) {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  });

  /* ==========================================================================
     13. Initialize App
     ========================================================================== */
  initTheme();
  loadFromLocalStorage();
  updateMetrics();
  renderTaskList();
});
