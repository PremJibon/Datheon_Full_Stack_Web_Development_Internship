/**
 * Shahed Hossain Prem - Developer Portfolio Scripts
 * Vanilla ES6+, Dark/Light Theme Toggle, Native <dialog> Modal,
 * Responsive Hamburger Menu, IntersectionObserver ScrollSpy & Accessible Form Handling
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Theme Management (Dark / Light with LocalStorage & OS Preference)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Detect user preference from localStorage or fallback to system preference
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const applyTheme = (theme) => {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
      themeToggleBtn.setAttribute(
        'title',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
  };

  // Initialize theme on load
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Listen for toggle button clicks
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // Listen for OS system theme changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });

  /* ==========================================================================
     2. Mobile Hamburger Menu & Keyboard Accessibility
     ========================================================================== */
  const navToggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const openMobileMenu = () => {
    navMenu.classList.add('is-open');
    navToggleBtn.classList.add('is-active');
    navToggleBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMobileMenu = () => {
    navMenu.classList.remove('is-open');
    navToggleBtn.classList.remove('is-active');
    navToggleBtn.setAttribute('aria-expanded', 'false');
  };

  if (navToggleBtn && navMenu) {
    navToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('is-open')) {
        if (!navMenu.contains(e.target) && !navToggleBtn.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMobileMenu();
        navToggleBtn.focus();
      }
    });
  }

  /* ==========================================================================
     3. Smooth Scrolling & Scrollspy (Active Navigation Highlight)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 120; // Offset for sticky header

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (matchingLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* ==========================================================================
     4. Project Modal Dialog (<dialog> Native Element)
     ========================================================================== */
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalTagline = document.getElementById('modal-tagline');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalTechContainer = document.getElementById('modal-tech');
  const modalHighlightsList = document.getElementById('modal-highlights');
  const modalLiveLink = document.getElementById('modal-live-link');
  const modalGithubLink = document.getElementById('modal-github-link');

  let lastFocusedElement = null;

  const openProjectModal = (card, triggerElement) => {
    if (!modal) return;
    lastFocusedElement = triggerElement || card;

    const title = card.getAttribute('data-title') || 'Project Details';
    const tagline = card.getAttribute('data-tagline') || '';
    const desc = card.getAttribute('data-desc') || '';
    const tech = card.getAttribute('data-tech') || '';
    const features = card.getAttribute('data-features') || '';
    const liveUrl = card.getAttribute('data-live') || '#';
    const githubUrl = card.getAttribute('data-github') || '#';
    const categoryBadge = card.querySelector('.project-category');
    const categoryText = categoryBadge ? categoryBadge.textContent : 'Featured Project';

    // Populate modal contents
    modalTitle.textContent = title;
    modalTagline.textContent = tagline;
    modalCategory.textContent = categoryText;
    modalDesc.textContent = desc;

    // Split tech tags into pills
    modalTechContainer.innerHTML = '';
    if (tech) {
      tech.split(',').forEach((item) => {
        const pill = document.createElement('span');
        pill.className = 'modal-tech-pill';
        pill.textContent = item.trim();
        modalTechContainer.appendChild(pill);
      });
    }

    // Split features into bullet items
    modalHighlightsList.innerHTML = '';
    if (features) {
      features.split(';').forEach((feat) => {
        if (feat.trim()) {
          const li = document.createElement('li');
          li.textContent = feat.trim();
          modalHighlightsList.appendChild(li);
        }
      });
    }

    // Links
    modalLiveLink.href = liveUrl;
    modalGithubLink.href = githubUrl;

    // Show native dialog modal
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }

    // Lock body scrolling while modal is open
    document.body.style.overflow = 'hidden';
    modalCloseBtn.focus();
  };

  const closeProjectModal = () => {
    if (!modal) return;
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  // Bind project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    const detailBtn = card.querySelector('.btn-details');

    // Click on detail button
    if (detailBtn) {
      detailBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openProjectModal(card, detailBtn);
      });
    }

    // Click anywhere on card (except links)
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      openProjectModal(card, card);
    });

    // Enter / Space key accessibility on card
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${card.getAttribute('data-title')}`);
    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a')) {
        e.preventDefault();
        openProjectModal(card, card);
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  // Backdrop click closing for native dialog
  if (modal) {
    modal.addEventListener('click', (e) => {
      const dialogDimensions = modal.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        closeProjectModal();
      }
    });

    modal.addEventListener('close', () => {
      document.body.style.overflow = '';
    });
  }

  /* ==========================================================================
     5. Contact Form Validation & Accessible Submission
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  const setError = (elementId, message) => {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = message;
    }
  };

  const clearErrors = () => {
    setError('name-error', '');
    setError('email-error', '');
    setError('subject-error', '');
    setError('message-error', '');
    if (formStatus) {
      formStatus.className = 'form-status';
      formStatus.textContent = '';
      formStatus.style.display = 'none';
    }
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let hasErrors = false;
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const subjectVal = subjectInput ? subjectInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      if (!nameVal) {
        setError('name-error', 'Please enter your name.');
        hasErrors = true;
      }

      if (!emailVal) {
        setError('email-error', 'Please enter your email address.');
        hasErrors = true;
      } else if (!isValidEmail(emailVal)) {
        setError('email-error', 'Please enter a valid email address.');
        hasErrors = true;
      }

      if (!subjectVal) {
        setError('subject-error', 'Please enter a subject.');
        hasErrors = true;
      }

      if (!messageVal) {
        setError('message-error', 'Please enter your message.');
        hasErrors = true;
      } else if (messageVal.length < 10) {
        setError('message-error', 'Message should be at least 10 characters.');
        hasErrors = true;
      }

      if (hasErrors) {
        return;
      }

      // Simulate sending with user feedback
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle>
        </svg>
        <span>Sending...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Send Message</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        `;

        formStatus.className = 'form-status success';
        formStatus.textContent = `Thank you, ${nameVal}! Your message has been received. You can also reach me directly at prempfp96@gmail.com.`;
        contactForm.reset();
      }, 700);
    });
  }
});
