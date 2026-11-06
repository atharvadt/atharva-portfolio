(() => {
  const shell = document.querySelector('.shell');
  const nav = document.querySelector('#nav');
  const tabButtons = [...document.querySelectorAll('.nav-tab[data-tab]')];
  const panels = [...document.querySelectorAll('.tab-panel[data-panel]')];
  const tabOrder = ['profile', 'skills', 'projects', 'experience'];
  if (!shell || !nav || !tabButtons.length || !panels.length) return;

  const aliases = {
    about: 'profile',
    certifications: 'profile',
    contact: 'profile'
  };
  let activeTab = 'profile';
  shell.querySelectorAll('.profile-panel.reveal').forEach(item => item.classList.add('visible'));

  function normalizeTab(value) {
    const key = (value || '').replace(/^#/, '').toLowerCase();
    const mapped = aliases[key] || key;
    return tabOrder.includes(mapped) ? mapped : 'profile';
  }

  function activateTab(requested, options = {}) {
    const nextTab = normalizeTab(requested);
    const previousIndex = tabOrder.indexOf(activeTab);
    const nextIndex = tabOrder.indexOf(nextTab);
    const direction = nextIndex >= previousIndex ? 'animate-from-right' : 'animate-from-left';
    activeTab = nextTab;
    shell.dataset.activeTab = nextTab;

    tabButtons.forEach(button => {
      const selected = button.dataset.tab === nextTab;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });

    panels.forEach(panel => {
      const selected = panel.dataset.panel === nextTab;
      panel.classList.toggle('is-active', selected);
      panel.classList.remove('animate-from-left', 'animate-from-right');
      panel.setAttribute('aria-hidden', String(!selected));
      if (selected) {
        // Restart the entrance animation on each tab change.
        void panel.offsetWidth;
        panel.classList.add(direction);
        panel.querySelectorAll('.reveal').forEach(item => item.classList.add('visible'));
      }
    });

    if (options.pushHistory && location.hash !== `#${nextTab}`) {
      history.pushState({ tab: nextTab }, '', `#${nextTab}`);
    }
    if (options.scrollTop !== false) {
      window.scrollTo({ top: 0, behavior: options.behavior || 'smooth' });
    }
  }

  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => activateTab(button.dataset.tab, { pushHistory: true }));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let targetIndex = index;
      if (event.key === 'ArrowLeft') targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      if (event.key === 'ArrowRight') targetIndex = (index + 1) % tabButtons.length;
      if (event.key === 'Home') targetIndex = 0;
      if (event.key === 'End') targetIndex = tabButtons.length - 1;
      tabButtons[targetIndex].focus();
      activateTab(tabButtons[targetIndex].dataset.tab, { pushHistory: true });
    });
  });

  // Swipe left/right anywhere in the portfolio canvas to move between tabs.
  let touchStartX = 0;
  let touchStartY = 0;
  shell.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }, { passive: true });

  shell.addEventListener('touchend', event => {
    if (!event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStartX;
    const dy = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 65 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
    const index = tabOrder.indexOf(activeTab);
    const nextIndex = dx < 0
      ? Math.min(index + 1, tabOrder.length - 1)
      : Math.max(index - 1, 0);
    if (nextIndex !== index) activateTab(tabOrder[nextIndex], { pushHistory: true });
  }, { passive: true });

  window.addEventListener('popstate', () => activateTab(location.hash, { scrollTop: false }));
  window.addEventListener('hashchange', () => activateTab(location.hash, { scrollTop: false }));

  document.querySelectorAll('.topbar .wordmark, footer .wordmark').forEach(wordmark => {
    wordmark.addEventListener('click', event => {
      event.preventDefault();
      activateTab('profile', { pushHistory: true });
    });
  });

  // Open the requested section when a visitor lands on a shared tab URL.
  const initialTab = normalizeTab(location.hash);
  activateTab(initialTab, { scrollTop: false });
})();
