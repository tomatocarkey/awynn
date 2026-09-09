(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Masthead gains a hairline and blur once the page leaves the top.
  var head = document.querySelector('.masthead');
  if (head) {
    var onScroll = function () {
      head.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (reduced || !('IntersectionObserver' in window)) return;

  var targets = [].slice.call(
    document.querySelectorAll('.section > *, .hero-grid > *')
  );
  if (!targets.length) return;

  var reveal = function (el) { el.classList.add('is-in'); };

  // Failsafe: whatever happens with the observer, nothing stays hidden.
  // Anything already on screen reveals next frame, and everything else is
  // force-revealed shortly after, so content is never left invisible.
  var releaseAll = function () { targets.forEach(reveal); };
  var timer = setTimeout(releaseAll, 1000);

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      reveal(e.target);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  targets.forEach(function (el, i) {
    el.classList.add('will-reveal');
    el.style.setProperty('--reveal-delay', (i % 4) * 60 + 'ms');
    io.observe(el);
  });

  requestAnimationFrame(function () {
    targets.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) reveal(el);
    });
  });

  window.addEventListener('load', function () {
    clearTimeout(timer);
    setTimeout(releaseAll, 400);
  });
})();
