// ============================================
// EDITORIAL TIMES — API MODULE
// Guardian Open Platform (free, no CORS issues)
// Register at: https://open-platform.theguardian.com/access/
// ============================================

const GUARDIAN_KEY = 'test'; // Replace with your free Guardian API key
const GUARDIAN_BASE = 'https://content.guardianapis.com';

// Core fetch helper
async function guardianFetch(path, params = {}) {
  const defaults = {
    'api-key': GUARDIAN_KEY,
    'show-fields': 'thumbnail,trailText,byline,wordcount',
    format: 'json'
  };
  const qs = new URLSearchParams({ ...defaults, ...params }).toString();
  try {
    const res = await fetch(`${GUARDIAN_BASE}${path}?${qs}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.response?.status === 'ok' ? data.response : null;
  } catch (err) {
    console.error('[Guardian]', err.message);
    return null;
  }
}

// ---- API Endpoints ----

async function getLatest(pageSize = 1) {
  return guardianFetch('/search', { 'order-by': 'newest', 'page-size': pageSize });
}

async function getTopStories(pageSize = 9, page = 1) {
  return guardianFetch('/search', { 'order-by': 'newest', 'page-size': pageSize, page });
}

async function getSectionArticles(section, pageSize = 12, page = 1, orderBy = 'newest') {
  return guardianFetch('/search', { section, 'order-by': orderBy, 'page-size': pageSize, page });
}

async function getCategoryStrip(section, pageSize = 3) {
  return guardianFetch('/search', { section, 'order-by': 'newest', 'page-size': pageSize });
}

async function searchArticles(query, params = {}) {
  return guardianFetch('/search', { q: query, 'order-by': 'relevance', 'page-size': 10, ...params });
}

async function getArticleById(id) {
  return guardianFetch(`/${id}`, {
    'show-fields': 'thumbnail,trailText,byline,wordcount,bodyText,standfirst'
  });
}

async function getRelated(section, exclude, pageSize = 4) {
  return guardianFetch('/search', {
    section,
    'order-by': 'newest',
    'page-size': pageSize + 1
  });
}

// ---- Utilities ----

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (success) return Promise.resolve();
      else return Promise.reject(new Error('Copy command failed'));
    } catch (err) {
      document.body.removeChild(textArea);
      return Promise.reject(err);
    }
  }
}

function timeAgo(iso) {
  if (!iso) return 'N/A';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return 'N/A';
  const s = (Date.now() - date.getTime()) / 1000;
  if (s < 0) return 'Just now';
  if (s < 60) return 'Just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function readTime(words = 0) {
  return `${Math.max(1, Math.round((words || 300) / 200))} min read`;
}

function sectionBadgeClass(sectionId = '') {
  const map = { technology:'tech', sport:'sports', sports:'sports', business:'business',
    politics:'politics', culture:'culture', world:'world', science:'featured',
    environment:'featured', opinion:'politics', lifeandstyle:'culture', travel:'featured' };
  return map[sectionId.toLowerCase()] || 'featured';
}

const FALLBACKS = {
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  sport:      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  business:   'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  world:      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
  politics:   'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
  culture:    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
  science:    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80',
  environment:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  default:    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'
};

function getThumb(article) {
  return article.fields?.thumbnail || FALLBACKS[article.sectionId] || FALLBACKS.default;
}

function articlePageUrl(article) {
  return `article.html?id=${encodeURIComponent(article.id)}&sec=${encodeURIComponent(article.sectionId || '')}`;
}

function categoryPageUrl(section) {
  return `category.html?section=${encodeURIComponent(section)}`;
}

// Skeleton HTML
function skeleton(n = 3, compact = false) {
  return Array.from({ length: n }, () =>
    compact
      ? `<div class="skel-card skel-compact"><div class="skel-img"></div><div class="skel-body"><div class="skel-line s"></div><div class="skel-line"></div><div class="skel-line m"></div></div></div>`
      : `<div class="skel-card"><div class="skel-img"></div><div class="skel-body"><div class="skel-line s"></div><div class="skel-line"></div><div class="skel-line m"></div><div class="skel-line s"></div></div></div>`
  ).join('');
}

// Reattach dynamic interactivity after rendering API cards
function reattachInteractivity() {
  document.querySelectorAll('.card-bookmark:not([data-attached]), .bookmark-btn:not([data-attached])').forEach(btn => {
    btn.dataset.attached = '1';
    btn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const on = btn.getAttribute('data-bookmarked') === 'true';
      btn.setAttribute('data-bookmarked', String(!on));
      const ic = btn.querySelector('i');
      if (ic) ic.className = on ? 'far fa-bookmark' : 'fas fa-bookmark';
      if (typeof showToast === 'function') showToast(on ? 'Removed from reading list' : 'Saved to reading list!', 'fa-bookmark');
    });
  });

  document.querySelectorAll('.share-btn:not([data-attached])').forEach(btn => {
    btn.dataset.attached = '1';
    btn.addEventListener('click', e => {
      e.preventDefault();
      copyToClipboard(window.location.href).then(() => {
        if (typeof showToast === 'function') showToast('Link copied!', 'fa-share-nodes');
      }).catch(() => {
        if (typeof showToast === 'function') showToast('Unable to copy link.', 'fa-triangle-exclamation');
      });
    });
  });

  // Reveal observer for new [data-scroll] elements
  const unseen = document.querySelectorAll('[data-scroll]:not(.visible)');
  if (!unseen.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  unseen.forEach(el => obs.observe(el));
}
