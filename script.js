// ============================================
// PAGE LOAD & LOADING STATES (Prevent Flash)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body to fire CSS opacity fades smoothly
    document.body.classList.add('loaded');
    
    // Bind static card interactivity
    if (typeof reattachInteractivity === 'function') {
        reattachInteractivity();
    }
});

// Fallback in case DOMContentLoaded has already fired or delayed
window.addEventListener('load', () => {
    if (!document.body.classList.contains('loaded')) {
        document.body.classList.add('loaded');
    }
});

// ============================================
// SCROLL HANDLING (Sticky Header & Progress Bar)
// ============================================
const topNav = document.querySelector('.top-nav');
const progressBar = document.getElementById('progressBar');

window.addEventListener('scroll', () => {
    // 1. Sticky Navigation Effect
    if (topNav) {
        if (window.scrollY > 150) {
            topNav.classList.add('sticky-active');
        } else {
            topNav.classList.remove('sticky-active');
        }
    }

    // 2. Reading Progress Bar Logic
    if (progressBar) {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (windowHeight > 0) {
            const scrolledPercentage = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolledPercentage + '%';
        }
    }
});

// ============================================
// SIDEBAR DRAWER MENU LOGIC
// ============================================
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Open Sidebar Drawer
function openSidebar() {
    if (sidebar) sidebar.classList.add('active');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock main scroll
    if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'true');
}

// Close Sidebar Drawer
function closeSidebar() {
    if (sidebar) sidebar.classList.remove('active');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Release scroll
    if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'false');
}

// Attach Event Listeners
if (sidebarToggle) sidebarToggle.addEventListener('click', openSidebar);
if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

// Close sidebar on Escape keyboard press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
        closeSidebar();
    }
});

// ============================================
// SIDEBAR SUBMENU TOGGLE FUNCTIONALITY
// ============================================
const submenuToggles = document.querySelectorAll('.toggle-submenu');

submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const menuItem = toggle.closest('.menu-item');
        const submenu = toggle.nextElementSibling;
        const arrow = toggle.querySelector('.arrow');
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

        // Toggle submenu open/close classes
        submenu.classList.toggle('show');

        // Rotate arrow icon
        if (arrow) {
            arrow.classList.toggle('open');
        }

        // Toggle active submenu states
        menuItem.classList.toggle('submenu-open');
        toggle.setAttribute('aria-expanded', !isExpanded);
    });
});

// ============================================
// DARK THEME TOGGLE WITH LOCAL STORAGE
// ============================================
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon = darkModeToggle ? darkModeToggle.querySelector('i') : null;

// Check and apply stored preference
const currentTheme = localStorage.getItem('darkModePreference');
if (currentTheme === 'enabled') {
    document.body.classList.add('dark-mode');
    if (darkModeIcon) {
        darkModeIcon.className = 'fas fa-sun';
    }
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');

        // Store state in localStorage
        if (isDark) {
            localStorage.setItem('darkModePreference', 'enabled');
            if (darkModeIcon) {
                darkModeIcon.className = 'fas fa-sun';
            }
            showToast('Dark theme activated');
        } else {
            localStorage.setItem('darkModePreference', 'disabled');
            if (darkModeIcon) {
                darkModeIcon.className = 'fas fa-moon';
            }
            showToast('Light theme activated');
        }
    });
}

// ============================================
// CALENDAR & SYSTEM DATE INDICATOR
// ============================================
const dateElement = document.getElementById('currentDate');
if (dateElement) {
    const calendarOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateFormatted = new Date().toLocaleDateString('en-US', calendarOptions);
    dateElement.textContent = dateFormatted;
}

// ============================================
// INTERACTIVE TOAST SYSTEM (Alert Replacer)
// ============================================
const toastContainer = document.getElementById('toastContainer');

function showToast(message, iconClass = 'fa-info-circle') {
    if (!toastContainer) return;

    // Create toast bubble
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;

    // Append to queue
    toastContainer.appendChild(toast);

    // Auto remove after 3.5s
    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3500);
}

// ============================================
// SEARCH LOGIC WITH TOAST GRAPHIC FEEDBACK
// ============================================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

function triggerSearch() {
    const query = searchInput.value.trim();
    if (query) {
        closeSidebar();
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    } else {
        showToast('Please type a keyword first.', 'fa-exclamation-triangle');
    }
}

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', triggerSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            triggerSearch();
        }
    });
}

// ============================================
// NEWSLETTER DYNAMIC ACTION HANDLING
// ============================================
const newsletterForm = document.getElementById('newsletterForm');
const subscriberEmail = document.getElementById('subscriberEmail');
const newsletterSubmitBtn = document.getElementById('newsletterSubmitBtn');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailVal = subscriberEmail.value.trim();

        if (emailVal) {
            // Apply visual spinner loading state
            newsletterForm.classList.add('loading-state');
            newsletterSubmitBtn.disabled = true;

            setTimeout(() => {
                // Return to static and clear inputs
                newsletterForm.classList.remove('loading-state');
                newsletterSubmitBtn.disabled = false;
                subscriberEmail.value = '';
                
                showToast('Welcome to Editorial Times! Please check your inbox for verification.', 'fa-circle-check');
            }, 1500);
        }
    });
}

// ============================================
// CARDS INTERACTIVITY (Bookmarks, Likes, Shares)
// ============================================

// 1. Article likes increments
const likeButtons = document.querySelectorAll('.like-btn');

likeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const countSpan = btn.querySelector('.like-count');
        const isLiked = btn.classList.contains('liked');
        let currentLikes = parseInt(countSpan.textContent, 10) || 0;

        if (isLiked) {
            btn.classList.remove('liked');
            countSpan.textContent = currentLikes - 1;
            btn.querySelector('i').className = 'far fa-heart';
            showToast('Removed like');
        } else {
            btn.classList.add('liked');
            countSpan.textContent = currentLikes + 1;
            btn.querySelector('i').className = 'fas fa-heart';
            showToast('Article liked!', 'fa-heart');
        }
    });
});

// ============================================
// TV MEDIA PLAYER SHOWCASE CONTROLS
// ============================================
const tvPlayIcon = document.getElementById('tvPlayIcon');
const tvMuteBtn = document.getElementById('tvMuteBtn');
const waveform = document.querySelector('.live-audio-waveform');
const tvTicker = document.querySelector('.tv-ticker-text');

let isTVPlaying = false;
let isTVMuted = false;

if (tvPlayIcon && waveform) {
    tvPlayIcon.addEventListener('click', () => {
        isTVPlaying = !isTVPlaying;

        if (isTVPlaying) {
            tvPlayIcon.className = 'fas fa-pause-circle play-overlay-trigger playing';
            waveform.classList.add('active');
            if (tvTicker) {
                tvTicker.textContent = 'Live financial dashboard on-stream... Press pause to freeze feed.';
            }
            showToast('Live stream started', 'fa-play');
        } else {
            tvPlayIcon.className = 'fas fa-play-circle play-overlay-trigger';
            waveform.classList.remove('active');
            if (tvTicker) {
                tvTicker.textContent = 'Global Markets Analysis Live from Mumbai financial district...';
            }
            showToast('Live stream paused', 'fa-pause');
        }
    });

    // Support keyboard activation on Enter key for accessible users
    tvPlayIcon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tvPlayIcon.click();
        }
    });
}

if (tvMuteBtn) {
    tvMuteBtn.addEventListener('click', () => {
        isTVMuted = !isTVMuted;
        const muteIcon = tvMuteBtn.querySelector('i');

        if (isTVMuted) {
            if (muteIcon) muteIcon.className = 'fas fa-volume-mute';
            showToast('Audio muted');
        } else {
            if (muteIcon) muteIcon.className = 'fas fa-volume-up';
            showToast('Audio unmuted');
        }
    });
}

// ============================================
// SMOOTH SCROLL ANCHOR NAVIGATION LOGIC
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const hrefValue = this.getAttribute('href');

        if (hrefValue !== '#' && hrefValue !== '#home') {
            e.preventDefault();

            const targetElement = document.querySelector(hrefValue);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============================================
// INTERSECTION OBSERVER FOR SCROLL REVEALS
// ============================================
const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // Trigger once
        }
    });
}, observerOptions);

const revealElements = document.querySelectorAll('[data-scroll]');
revealElements.forEach(el => revealObserver.observe(el));

// ============================================
// STICKY NAV TRACKING ACTIVE LINKS
// ============================================
const mainNavLinks = document.querySelectorAll('#topNavList a');

mainNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Clear active indicators
        mainNavLinks.forEach(l => {
            l.classList.remove('active');
            l.removeAttribute('aria-current');
        });

        // Set clicked item active
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
    });
});
