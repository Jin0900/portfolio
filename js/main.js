/* ============================================================
   He Zheng Portfolio — 共享交互脚本
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. 导航栏：滚动状态 ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    if (backTop) backTop.classList.toggle('show', window.scrollY > 500);
  };

  /* ---------- 2. 移动端菜单 ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      })
    );
  }

  /* ---------- 3. 滚动进入动画 ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- 4. Work 页分类筛选 ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('.work-item');
  const emptyNote = document.querySelector('.empty-note');
  if (filterBtns.length && workItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        let visible = 0;
        workItems.forEach(item => {
          const match = cat === 'all' || item.dataset.category === cat;
          item.classList.toggle('hide', !match);
          item.classList.remove('showing');
          if (match) {
            visible++;
            void item.offsetWidth; /* 重触发入场动画 */
            item.classList.add('showing');
          }
        });
        if (emptyNote) emptyNote.classList.toggle('show', visible === 0);
      });
    });
  }

  /* ---------- 5. 项目详情页：目录高亮 ---------- */
  const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length) {
    const sections = [...tocLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const tocIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => tocIO.observe(s));
  }

  /* ---------- 6. 联系表单（前端演示） ---------- */
  const form = document.querySelector('.contact-form');
  const toast = document.querySelector('.form-toast');
  if (form && toast) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      toast.classList.add('show');
      form.reset();
      setTimeout(() => toast.classList.remove('show'), 4000);
    });
  }

  /* ---------- 7. 回到顶部 ---------- */
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- 8. 顶部滚动进度条 ---------- */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  const setProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', setProgress, { passive: true });
  setProgress();

  /* ---------- 9. Hero 标题逐字入场 ---------- */
  document.querySelectorAll('.hero-title').forEach(title => {
    const baseDelay = parseFloat(getComputedStyle(title).getPropertyValue('--d')) || 0.2;
    title.classList.remove('fade-up');
    const split = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...child.textContent].forEach(ch => {
            const s = document.createElement('span');
            s.className = 'char';
            s.textContent = ch === ' ' ? '\u00A0' : ch;
            frag.appendChild(s);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          split(child);
        }
      });
    };
    split(title);
    title.querySelectorAll('.char').forEach((c, i) => {
      c.style.setProperty('--cd', (baseDelay + i * 0.07).toFixed(2) + 's');
    });
  });

  /* ---------- 10. Hero 视差 ---------- */
  const fineHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && fineHover) {
    const frameImg = heroVisual.querySelector('.frame img');
    if (frameImg) {
      heroVisual.addEventListener('mousemove', e => {
        const r = heroVisual.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * -10;
        const y = ((e.clientY - r.top) / r.height - 0.5) * -10;
        frameImg.style.transform = `scale(1.07) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      });
      heroVisual.addEventListener('mouseleave', () => { frameImg.style.transform = ''; });
    }
  }

  /* ---------- 11. 卡片 3D tilt ---------- */
  if (fineHover) {
    document.querySelectorAll('.work-card, .cap-card').forEach(card => {
      const lift = card.classList.contains('cap-card') ? -6 : -8;
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.18s ease-out, border-color 0.4s, box-shadow 0.5s, background 0.45s';
      });
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        card.style.transform = `perspective(900px) translateY(${lift}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        card.style.transform = '';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

  /* ---------- 12. 数字滚动计数 ---------- */
  const counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        cio.unobserve(entry.target);
        const el = entry.target;
        const target = parseFloat(el.dataset.countTo);
        const t0 = performance.now();
        const tick = now => {
          const p = Math.min((now - t0) / 1300, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => cio.observe(el));
  }

  /* ---------- 13. 流程步骤依次入场 ---------- */
  const flowGrids = document.querySelectorAll('.flow-steps');
  if (flowGrids.length) {
    const fio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          fio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    flowGrids.forEach(g => fio.observe(g));
  }
  
  /* ---------- 14. 详情页文字左右交替滑入 + 图片上下淡入（上下滚动可重复触发） ---------- */
  const detailSections = document.querySelectorAll('.project-section');
  if (detailSections.length) {
    // 1) 文字：交替从左/右
    let flip = 0;
    detailSections.forEach(section => {
      section.querySelectorAll(':scope > h2, :scope > p').forEach(el => {
        el.classList.add('reveal-x', flip % 2 === 0 ? 'from-left' : 'from-right');
        flip++;
      });
      // 2) 图片 / 统计卡：上下淡入
      section.querySelectorAll(':scope > .img-single, :scope > .img-duo, :scope > .stat-row, :scope > .flow-steps, :scope > figure, :scope > .callout, :scope > .tech-list').forEach(el => {
        el.classList.add('reveal-y');
      });
    });

    // 3) 双 IO 阈值 + 滚动兜底：入场（0% 进入）就加 visible，退场（0% 离开）才移除；快速滚动时 scroll 兜底不丢事件
    const revealTargets = document.querySelectorAll('.reveal-x, .reveal-y');
    if (revealTargets.length) {
      const applyVisible = (el, v) => {
        if (v) el.classList.add('visible');
        else el.classList.remove('visible');
      };
      const vh = () => window.innerHeight || document.documentElement.clientHeight;
      const sweep = () => {
        const h = vh();
        revealTargets.forEach(el => {
          const r = el.getBoundingClientRect();
          const inView = r.top < h - 20 && r.bottom > 20;
          applyVisible(el, inView);
        });
      };

      const bio = new IntersectionObserver(entries => {
        entries.forEach(entry => applyVisible(entry.target, entry.isIntersecting));
      }, { threshold: [0, 0.05, 0.2], rootMargin: '0px' });
      revealTargets.forEach(el => bio.observe(el));

      // 初始同步：DOM 就绪后立即扫描 + 下一帧再扫描，避免 IO 初始回调延迟
      sweep();
      requestAnimationFrame(sweep);
      setTimeout(sweep, 150);

      // 滚动兜底（rAF 节流）
      let rafPending = false;
      window.addEventListener('scroll', () => {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => { rafPending = false; sweep(); });
      }, { passive: true });

      // 视口尺寸变化时重扫
      window.addEventListener('resize', sweep);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
