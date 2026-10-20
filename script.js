(() => {
  'use strict';

  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const storage = {
    get(key, session = false) {
      try { return (session ? sessionStorage : localStorage).getItem(key); } catch { return null; }
    },
    set(key, value, session = false) {
      try { (session ? sessionStorage : localStorage).setItem(key, value); } catch { /* Storage is optional. */ }
    }
  };
  let motionPaused = reducedMotion.matches || storage.get('set-facility-motion') === 'paused';
  let scene = null;
  let galleryAnimation = null;
  let scrollFrame = 0;
  let pageTurnAnimation = null;
  let techScene = null;
  const motionButton = document.querySelector('.motion-toggle');

  function setMotion(paused) {
    motionPaused = paused;
    root.dataset.motion = paused ? 'paused' : 'playing';
    root.classList.toggle('motion-off', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', window.FacilityI18n.t(paused ? '开启动效' : '暂停动效'));
    if (paused) {
      galleryAnimation?.cancel();galleryAnimation = null;
      pageTurnAnimation?.cancel();pageTurnAnimation = null;
    }
    scheduleScroll();
    scene?.refresh();
  }
  motionButton.addEventListener('click', () => {
    setMotion(!motionPaused);
    storage.set('set-facility-motion', motionPaused ? 'paused' : 'playing');
  });
  reducedMotion.addEventListener('change', () => setMotion(reducedMotion.matches || storage.get('set-facility-motion') === 'paused'));
  setMotion(motionPaused);


  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    root.classList.add('js');
  }

  const ambientSections = [...document.querySelectorAll('[data-ambient]')];
  let ambientObserver;
  if ('IntersectionObserver' in window) {
    ambientObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting));
    });
    ambientSections.forEach(section => ambientObserver.observe(section));
  } else {
    ambientSections.forEach(section => section.classList.add('in-view'));
  }
  function refreshAmbient() {
    const idle = document.hidden || !!document.querySelector('dialog[open]');
    root.classList.toggle('page-idle', idle);
    for (const animation of [galleryAnimation, pageTurnAnimation]) {
      if (!animation || animation.playState === 'finished' || animation.playState === 'idle') continue;
      if (idle || motionPaused) animation.pause();
      else if (animation.playState === 'paused') animation.play();
    }
  }
  refreshAmbient();

  const field = document.querySelector('[data-field]');
  const ns = 'http://www.w3.org/2000/svg';
  const lines = document.createElementNS(ns, 'g');
  lines.classList.add('field-lines');
  for (let rib = 0; rib < 40; rib++) {
    const phi = rib / 40 * Math.PI * 2;
    const points = [];
    for (let step = 0; step <= 56; step++) {
      const theta = step / 56 * Math.PI * 2;
      const radius = 160 + 48 * Math.cos(theta);
      const x = radius * Math.cos(phi), y = radius * Math.sin(phi), z = 48 * Math.sin(theta);
      const px = x * .94 + z * .34, py = y * .38 + z * .93;
      points.push(`${step ? 'L' : 'M'}${(300 + px * 1.08 - py * .4).toFixed(2)},${(240 + px * .4 + py * 1.08).toFixed(2)}`);
    }
    const line = document.createElementNS(ns, 'path');
    line.setAttribute('d', points.join(' ') + 'Z');
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', rib % 10 ? '#4f729a' : '#438bd1');
    line.setAttribute('stroke-width', rib % 10 ? '.8' : '1.2');
    line.setAttribute('opacity', '.65');
    lines.append(line);
  }
  field.append(lines);
  const plate = document.querySelector('.possibility-plate');
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let pointerFrame = 0, pointerX = 0, pointerY = 0;
    plate.addEventListener('pointermove', event => {
      if (motionPaused) return;
      pointerX = event.clientX;pointerY = event.clientY;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        const bounds = plate.getBoundingClientRect();
        field.style.transform = `rotateX(${(pointerY - bounds.top) / bounds.height * -12 + 6}deg) rotateY(${(pointerX - bounds.left) / bounds.width * 12 - 6}deg)`;
      });
    }, { passive: true });
    plate.addEventListener('pointerleave', () => {
      cancelAnimationFrame(pointerFrame);pointerFrame = 0;field.style.transform = '';
    });
  }

  const navigation = document.querySelector('#navigation');
  const menu = document.querySelector('.menu-toggle');
  function closeMenu(returnFocus = false) {
    navigation.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    if (returnFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('open', open);
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.header') && navigation.classList.contains('open')) closeMenu();
  });
  matchMedia('(max-width: 760px)').addEventListener('change', () => closeMenu());
  const navLinks = [...navigation.querySelectorAll('a')];
  const sections = navLinks.map(link => document.querySelector(link.hash));
  const progress = document.querySelector('.read-progress');

  function updateScroll() {
    scrollFrame = 0;
    const distance = root.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, scrollY / distance) : 0})`;
    techScene?.update();
    let current = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top < innerHeight * .42) current = index;
    });
    navLinks.forEach((link, index) => {
      link.classList.toggle('active', index === current);
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }
  addEventListener('scroll', scheduleScroll, { passive: true });
  addEventListener('resize', scheduleScroll, { passive: true });
  document.addEventListener('facility:languagechange', scheduleScroll);
  updateScroll();

  const clock = document.querySelector('#utc-clock');
  function updateClock() {
    if (document.hidden) return;
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = `${now.toISOString().slice(11, 16)} UTC`;
  }
  updateClock();
  const clockInterval = setInterval(updateClock, 30000);

  const lifeTabs = [...document.querySelectorAll('.living-tab')];
  const lifeImage = document.querySelector('#living-image');
  let galleryVersion = 0;
  let selectedLife = lifeTabs[0];
  function selectLife(button) {
    if (selectedLife === button) return;
    selectedLife = button;
    galleryAnimation?.cancel();galleryAnimation = null;
    pageTurnAnimation?.cancel();pageTurnAnimation = null;
    document.querySelector(".photo-number").textContent = String(lifeTabs.indexOf(button) + 1).padStart(2, "0");
    const template = document.querySelector(`#life-${button.dataset.life}`);
    const data = template.dataset;
    const version = ++galleryVersion;
    lifeTabs.forEach(tab => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    const panel = document.querySelector('#living-detail');
    panel.setAttribute('aria-labelledby', button.id);
    for (const key of ['coordinate', 'category', 'name', 'description']) {
      document.querySelector(`#living-${key}`).textContent = data[key];
    }
    document.querySelector('#living-note').textContent = template.content.textContent;
    document.querySelector('#living-read').dataset.article = data.article;
    const next = new Image();
    next.onload = () => {
      if (version !== galleryVersion) return;
      lifeImage.src = data.image;
      lifeImage.alt = data.alt;
      if (!motionPaused) {
        lifeImage.getAnimations().forEach(animation => animation.cancel());
        galleryAnimation = lifeImage.animate([
          { opacity: .2, clipPath: 'inset(0 95% 0 0)', transform: 'scale(1.04)' },
          { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'scale(1)' }
        ], { duration: 700, easing: 'cubic-bezier(.2,.7,.2,1)' });
        pageTurnAnimation?.cancel();
        pageTurnAnimation = document.querySelector('.photo-caption').animate([
          { opacity: .2, transform: 'translateY(18px) rotateX(-8deg)' },
          { opacity: 1, transform: 'translateY(0) rotateX(0)' }
        ], { duration: 550, easing: 'cubic-bezier(.2,.7,.2,1)' });
        refreshAmbient();
      }
    };
    next.src = data.image;
  }
  const techTrack = document.querySelector('.tech-scroll');
  const techExhibit = document.querySelector('.living-exhibit');
  const scrollMode = matchMedia('(min-width: 900px) and (min-height: 740px)');
  const techBar = document.querySelector('.tech-progress i');
  let pinned = false;
  function goToLife(button) {
    selectLife(button);
    if (!pinned) return;
    const distance = techTrack.offsetHeight - techExhibit.offsetHeight;
    const index = lifeTabs.indexOf(button);
    const position = (index + .5) / lifeTabs.length;
    scrollTo({ top: scrollY + techTrack.getBoundingClientRect().top - 102 + distance * position, behavior: 'instant' });
  }
  techScene = {
    update() {
      const enable = scrollMode.matches && !motionPaused;
      if (enable !== pinned) {
        pinned = enable;
        techTrack.classList.toggle('scroll-enabled', pinned);
      }
      const rect = techTrack.getBoundingClientRect();
      if (!pinned) { techBar.style.transform = `scaleX(${(lifeTabs.indexOf(selectedLife)+1)/3})`;return; }
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const distance = Math.max(1, techTrack.offsetHeight - techExhibit.offsetHeight);
      const progress = Math.max(0, Math.min(1, (102 - rect.top) / distance));
      techBar.style.transform = `scaleX(${progress})`;
      if (!document.body.classList.contains('dialog-open')) selectLife(lifeTabs[Math.min(2, Math.floor(progress * 3))]);
    }
  };
  scrollMode.addEventListener('change', scheduleScroll);
  scheduleScroll();
  lifeTabs.forEach((button, index) => {
    button.addEventListener('click', () => goToLife(button));
    button.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % lifeTabs.length;
      if (event.key === 'ArrowLeft') target = (index + lifeTabs.length - 1) % lifeTabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = lifeTabs.length - 1;
      if (target === undefined) return;
      event.preventDefault();
      lifeTabs[target].focus();
      goToLife(lifeTabs[target]);
    });
  });

  const dialog = document.querySelector('.archive-dialog');
  const articleContent = document.querySelector('#article-content');
  let articleTrigger;
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-article]');
    if (!button) return;
    const article = document.getElementById(`article-${button.dataset.article}`);
    if (!article || dialog.open) return;
    articleContent.replaceChildren(article.content.cloneNode(true));
    articleTrigger = button;
    dialog.showModal();
    dialog.querySelector('.dialog-close').focus({ preventScroll: true });
    dialog.scrollTop = 0;
    document.body.classList.add('dialog-open');
    refreshAmbient();
    scene?.refresh();
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.dialog-return').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    refreshAmbient();
    articleTrigger?.focus({ preventScroll: true });
    scheduleScroll();
    scene?.refresh();
  });

  scene = window.createFacilityGravity(document.querySelector('#gravity-viewport'), () => !motionPaused && !dialog.open);

  document.addEventListener('visibilitychange', () => { updateClock();refreshAmbient();scene?.refresh(); });
  addEventListener('pagehide', event => {
    if (event.persisted) return;
    clearInterval(clockInterval);cancelAnimationFrame(scrollFrame);ambientObserver?.disconnect();galleryAnimation?.cancel();pageTurnAnimation?.cancel();scene?.dispose();
  });
  addEventListener('pageshow', () => { updateClock();scene?.refresh(); });
})();
