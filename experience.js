(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  const motionAllowed = () => root.dataset.motion !== 'paused' && !reduced.matches;
  const pageActive = () => !document.hidden && !document.querySelector('dialog[open]');
  const canAnimate = () => motionAllowed() && pageActive();
  function animate(element, frames, options) {
    if (!element || !canAnimate()) return;
    const animation = element.animate(frames, options);
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    return animation;
  }
  function settleAnimations() {
    animations.forEach(animation => animation.cancel());
    animations.clear();
  }

  const opening = document.querySelector('.opening');
  const replay = document.querySelector('.boot-replay');
  const skip = opening.querySelector('.boot-skip');
  let bootTimer = 0, exitTimer = 0, bootRunning = false;
  function finishBoot() {
    clearTimeout(bootTimer);clearTimeout(exitTimer);
    const focused = opening.contains(document.activeElement);
    bootRunning = false;
    opening.hidden = true;
    opening.setAttribute('aria-hidden', 'true');
    opening.classList.remove('boot-exit');
    if (focused) replay?.focus({ preventScroll: true });
  }
  function dismissBoot() {
    if (!bootRunning) return;
    if (!canAnimate()) { finishBoot();return; }
    opening.classList.add('boot-exit');
    exitTimer = setTimeout(finishBoot, 550);
  }
  function startBoot(force = false) {
    if (!canAnimate()) return;
    if (!force) {
      let seen = false;
      try { seen = sessionStorage.getItem('set-facility-visited') === '1'; } catch { /* Storage is optional. */ }
      if (location.hash || seen) return;
    }
    finishBoot();
    opening.hidden = false;
    opening.setAttribute('aria-hidden', 'false');
    bootRunning = true;
    try { sessionStorage.setItem('set-facility-visited', '1'); } catch { /* Storage is optional. */ }
    bootTimer = setTimeout(dismissBoot, 1900);
  }
  skip.addEventListener('click', finishBoot);
  replay.addEventListener('click', () => startBoot(true));
  const keyHandler = event => { if (bootRunning && event.key === 'Escape') finishBoot(); };
  const focusHandler = event => { if (bootRunning && !opening.contains(event.target)) finishBoot(); };
  document.addEventListener('keydown', keyHandler);
  document.addEventListener('focusin', focusHandler);

  const atlas = document.querySelector('.atlas');
  const consoleElement = atlas.querySelector('.atlas-console');
  const stage = atlas.querySelector('.atlas-stage');
  const tabs = [...atlas.querySelectorAll('[data-world]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  const counter = atlas.querySelector('#atlas-index');
  const announcement = atlas.querySelector('.atlas-announcement');
  let selected = 0, atlasVisible = false, scrollFrame = 0;
  const panelAnimations = new Set();
  function turn(element, frames, options) {
    const animation = animate(element, frames, options);
    if (!animation) return;
    panelAnimations.add(animation);
    animation.finished.then(() => panelAnimations.delete(animation), () => panelAnimations.delete(animation));
  }
  function selectWorld(index, announce = true) {
    index = (index + panels.length) % panels.length;
    if (index === selected && consoleElement.classList.contains('atlas-enhanced')) return;
    panelAnimations.forEach(animation => animation.cancel());panelAnimations.clear();
    const previous = selected;
    selected = index;
    panels.forEach((panel, i) => { panel.hidden = i !== selected; });
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === selected));
      tab.tabIndex = i === selected ? 0 : -1;
    });
    const panel = panels[selected];
    panel.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
    counter.textContent = String(selected + 1).padStart(2, '0');
    if (announce) announcement.textContent = tabs[selected].querySelector('strong').textContent;
    if (announce && canAnimate()) {
      const direction = selected >= previous ? 1 : -1;
      turn(panel.querySelector('.atlas-scene-art'), [
        { opacity: .65, clipPath: direction > 0 ? 'inset(0 85% 0 0)' : 'inset(0 0 0 85%)' },
        { opacity: 1, clipPath: 'inset(0)' }
      ], { duration: 800, easing: 'cubic-bezier(.16,1,.3,1)' });
      [...panel.querySelector('.world-copy').children].forEach((element, i) => turn(element, [
        { opacity: .65, transform: `translate(${direction * 18}px, 8px)` },
        { opacity: 1, transform: 'none' }
      ], { duration: 550, delay: i * 45, easing: 'cubic-bezier(.16,1,.3,1)' }));
      turn(atlas.querySelector('.atlas-shutter'), [
        { transform: 'translateX(-110%)' }, { transform: 'translateX(110%)' }
      ], { duration: 850, easing: 'cubic-bezier(.3,.8,.3,1)' });
      turn(atlas.querySelector('.atlas-frame'), [{ opacity: .35 }, { opacity: 1 }], { duration: 650 });
      atlas.querySelectorAll('.atlas-gate i').forEach((slice, i) => turn(slice, [
        { transform: 'translateX(-700%) skewX(-24deg)', opacity: .85 },
        { opacity: .55, offset: .55 },
        { transform: `translateX(${stage.clientWidth + 400}px) skewX(-24deg)`, opacity: 0 }
      ], { duration: 820, delay: i * 60, easing: 'cubic-bezier(.32,.7,.22,1)' }));
      registerScan(stage);
    }
    scheduleScroll();
  }
  selectWorld(0, false);
  consoleElement.classList.add('atlas-enhanced');
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectWorld(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();tabs[next].focus({ preventScroll: true });selectWorld(next);
    });
  });
  atlas.querySelectorAll('[data-atlas-step]').forEach(button => button.addEventListener('click', () => selectWorld(selected + Number(button.dataset.atlasStep))));
  panels.forEach(panel => panel.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();selectWorld(selected + (event.key === 'ArrowRight' ? 1 : -1));panels[selected].focus({ preventScroll: true });
  }));

  function updateScroll() {
    scrollFrame = 0;
    if (!atlasVisible || !canAnimate()) return;
    const rect = stage.getBoundingClientRect();
    const p = Math.max(-1, Math.min(1, (innerHeight * .5 - rect.top - rect.height * .5) / innerHeight));
    stage.style.setProperty('--atlas-shift', `${(p * 18).toFixed(2)}px`);
    stage.style.setProperty('--atlas-angle', `${(p * 12).toFixed(2)}deg`);
  }
  function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
  addEventListener('scroll', scheduleScroll, { passive: true });
  addEventListener('resize', scheduleScroll, { passive: true });
  let observer;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      atlasVisible = entries[0].isIntersecting;
      if (!atlasVisible) { panelAnimations.forEach(animation => animation.cancel());panelAnimations.clear(); }
      scheduleScroll();
    });
    observer.observe(consoleElement);
  } else { atlasVisible = true; }
  function refresh() {
    replay.disabled = !motionAllowed();
    if (!motionAllowed()) {
      finishBoot();settleAnimations();
      stage.style.removeProperty('--atlas-shift');stage.style.removeProperty('--atlas-angle');
    } else if (!pageActive()) {
      finishBoot();
      animations.forEach(animation => { if (animation.playState === 'running') animation.pause(); });
    } else {
      animations.forEach(animation => { if (animation.playState === 'paused') animation.play(); });
      scheduleScroll();
    }
  }

  const techSurfaces = [...document.querySelectorAll('.tech-surface')];
  let surfaceObserver;
  function registerScan(container) {
    const scan = container.querySelector('.tech-register i');
    if (!scan) return;
    animate(scan, [
      { transform: 'translateX(0)', opacity: 0 },
      { opacity: .8, offset: .12 },
      { opacity: .55, offset: .8 },
      { transform: `translateX(${container.clientWidth}px)`, opacity: 0 }
    ], { duration: 950, easing: 'cubic-bezier(.25,.7,.2,1)' });
  }
  function assembleSurface(surface) {
    if (!canAnimate()) return;
    const mass = surface.querySelector('.tech-mass');
    ['.mass-ice', '.mass-white', '.mass-blue'].forEach((selector, index) => {
      const element = mass?.querySelector(selector);
      animate(element, [
        { transform: `translate(${70 + index * 22}px, ${-36 - index * 12}px)`, opacity: 0 },
        { transform: 'translate(0,0)', opacity: 1 }
      ], { duration: 1050, delay: index * 85, easing: 'cubic-bezier(.16,1,.3,1)' });
    });
    animate(surface.querySelector('.chapter-rule i'), [
      { transform: 'translateX(-105%)' }, { transform: 'translateX(365%)' }
    ], { duration: 1250, easing: 'cubic-bezier(.22,.8,.22,1)' });
  }
  if ('IntersectionObserver' in window) {
    surfaceObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        assembleSurface(entry.target);
        surfaceObserver.unobserve(entry.target);
      });
    }, { threshold: .12 });
    techSurfaces.filter(surface => !surface.classList.contains('hero')).forEach(surface => surfaceObserver.observe(surface));
  }
  const livingPhoto = document.querySelector('.living-photo');
  const livingImageObserver = new MutationObserver(() => registerScan(livingPhoto));
  livingImageObserver.observe(document.getElementById('living-image'), { attributes: true, attributeFilter: ['src'] });

  const motionObserver = new MutationObserver(refresh);
  motionObserver.observe(root, { attributes: true, attributeFilter: ['class', 'data-motion'] });
  document.addEventListener('visibilitychange', refresh);
  refresh();startBoot();
  addEventListener('pagehide', event => {
    finishBoot();settleAnimations();
    if (event.persisted) return;
    observer?.disconnect();surfaceObserver?.disconnect();livingImageObserver.disconnect();motionObserver.disconnect();cancelAnimationFrame(scrollFrame);
    removeEventListener('scroll', scheduleScroll);removeEventListener('resize', scheduleScroll);
    document.removeEventListener('visibilitychange', refresh);
    document.removeEventListener('keydown', keyHandler);document.removeEventListener('focusin', focusHandler);
  });
  addEventListener('pageshow', refresh);
})();
