(() => {
  'use strict';
  let library;
  function loadLibrary() {
    if (!library) {
      library = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'assets/gravity-scene.js';
        script.onload = () => window.SETGravity ? resolve(window.SETGravity) : reject(new Error('Gravity scene unavailable'));
        script.onerror = () => reject(new Error('Gravity scene unavailable'));
        document.head.append(script);
      });
    }
    return library;
  }

  window.createFacilityGravity = function (container, allowMotion) {
    const hero = document.querySelector('.hero');
    const handle = container.querySelector('[data-gravity-drag-handle]');
    let cleanup, visible = true, disposed = false, initializing = false, failed = false;
    const active = () => !disposed && visible && !document.hidden && allowMotion();
    function fail() {
      failed = true;
      container.dataset.status = 'fallback';
      handle.tabIndex = -1;
      queueMicrotask(() => { cleanup?.();cleanup = null; });
    }
    async function initialize() {
      if (initializing || disposed || cleanup || failed || !visible || document.hidden) return;
      initializing = true;
      try {
        const api = await loadLibrary();
        await api.prepareGravityScene();
        if (disposed) return;
        cleanup = api.createGravityScene(container, () => {
          if (disposed || failed) return;
          container.dataset.status = 'ready';
          handle.tabIndex = 0;
        }, fail, {
          miniTool: true,
          active,
          progress() {
            const rect = hero.getBoundingClientRect();
            return .08 + Math.max(0, Math.min(1, -rect.top / rect.height)) * .28;
          }
        });
        container.dispatchEvent(new Event('setgravitystate'));
      } catch { fail(); }
      finally { initializing = false; }
    }
    function refresh() {
      if (disposed) return;
      if (cleanup) container.dispatchEvent(new Event('setgravitystate'));
      else initialize();
    }
    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        refresh();
      });
      observer.observe(hero);
    }
    initialize();
    return {
      refresh,
      dispose() {
        disposed = true;
        observer?.disconnect();
        cleanup?.();cleanup = null;
      }
    };
  };
})();
