# 📰 Editorial Times — Premium News & Blog Platform

🔗 **Live Website**: [vishwesh9835.github.io/Editorial_Times](https://vishwesh9835.github.io/Editorial_Times/)

Welcome to **Editorial Times**, a state-of-the-art, lightning-fast news and blog website designed with vanilla web technologies (HTML5, CSS3, and modern ES6 JavaScript). Powered by **The Guardian Open Platform**, this application provides a sleek, modern, and accessible interface for discovering and reading breaking global news and deep financial analytics.

---

## 🌟 Key Technical Features

### 1. **Dynamic Guardian API Integration**
* Sourced live via **The Guardian Open Platform** (utilizing highly optimized `fetch` mechanisms).
* Integrates multiple advanced endpoints: latest breaking stories, top editorial streams, custom section grids, specific article views, related readings, and a live search index.
* Visual skeletons are immediately injected prior to asynchronous API results to avoid page layout shifts (CLS) and ensure a pristine user experience.

### 2. **Refined Design System**
* **Harmonious Indigo & Gold Palette**: Uses dynamic HSL-tailored variables supporting both sleek high-contrast light mode and navy-accented dark mode.
* **Premium Typography**: Sourced from Google Fonts, utilizing `Playfair Display` for bold headlines and `Inter` for highly readable body paragraphs.
* **Sticky Glassmorphic Header**: Interactive navigation that shifts to a blurred, translucent backdrop upon scroll.
* **Interactive Live Stream Board**: Interactive simulated live stream featuring audio waveform visualizations, tickers, and mute indicators.

### 3. **Persistent Theme Toggle**
* Easily toggle between beautiful Light and Dark modes.
* Saved locally via `localStorage` so the user's preference persists across tabs and future visits.

---

## 🔒 Production Security Implementations

* **Reflected XSS Mitigation**: Fully escaped reflections (e.g., search queries on `search.html`) and external API text injections using custom HTML-escaping utilities (`escapeHTML`).
* **Secure Context Clipboard Fallbacks**: Safe link-sharing mechanism which detects browser compatibility, supports HTTPS or localhost environments, and gracefully falls back to dynamic element copying to prevent script exceptions in insecure contexts.
* **Defensive DOM Operations**: Every script selection of DOM components is guarded against `null` returns, preventing script crashes if a page renders without a sticky bar or dark mode button.

---

## ♿ Accessibility & Modern UX Upgrades

* **Semantic Anchor Links (`<a>`)**: Avoids keyboard traps and assistive-technology violations. Clickable category cards, search outputs, and related posts are written as standard anchors, allowing search indexing and standard right-click / middle-click "Open in new tab" operations.
* **Skip-to-Content Action**: A keyboard-focusable accessibility link bypasses the main layout straight into the core article content.
* **Tab Navigation Support**: Complete keyboard focus support with outline rings (`*:focus-visible`) for all search pills, inputs, and interactive widgets.
* **Toast Notification Queue**: An asynchronous modal toast notifications queue replaces invasive browser alerts.

---

## 📁 Project Structure

The project has been organized with clean, modular, and performant assets:

```
Newspaper -Blog/
├── index.html       # Homepage showcasing hero items, top stories, live stream and category strips
├── category.html    # Segmented layout supporting dynamic categories and newest/oldest sorting
├── article.html     # Dedicated reading experience, author byline, full story CTA, and related links
├── search.html      # Comprehensive search engine with real-time debouncing, input filter pills, and default queries
├── api.js           # Guardian Open Platform wrapper, skeleton systems, escapes, clipboards, and animations
├── script.js        # Core UI handlers, sticky navbar, sidebar toggles, theme settings, and Date utilities
├── style.css        # Responsive mobile-first CSS grid, variables, HSL color tokens, and smooth fades
└── readme.md        # Technical project documentation (This file)
```

---

## 🎨 Design Tokens & HSL Variable Schema

### 🌓 Colors (HSL Variable Tokens)

```css
:root {
  --primary: 238 82% 59%;       /* Electric Indigo: hsl(238, 82%, 59%) */
  --primary-dark: 244 75% 36%;  /* Deep Royal Indigo */
  --accent: 38 92% 50%;         /* Rich Warm Amber/Gold: hsl(38, 92%, 50%) */
  --navy: 224 71% 8%;           /* Dark Editorial Navy */
  --background: 210 20% 98%;    /* Crisp Alabaster White (Light Mode) */
  --surface: 0 0% 100%;         /* Pure White Surface */
}

body.dark-mode {
  --background: 224 71% 4%;     /* Deep Slate Navy (Dark Mode) */
  --surface: 224 50% 8%;        /* Slate Surface */
  --foreground: 210 20% 98%;    /* Off-white */
}
```

### ✍️ Typography Stacks

```css
--font-display: "Playfair Display", Georgia, serif; /* Headlines and logos */
--font-body: "Inter", -apple-system, sans-serif;    /* Clean, highly readable text */
```

---

## 🚀 Setup & Launch

To launch **Editorial Times** locally:

1. **Clone or Download** the project folder.
2. **Double-click `index.html`** or launch using a simple HTTP server (such as VS Code's "Live Server" extension, or `npx http-server`).
3. Set your custom Guardian API key on line 7 of `api.js`:
   ```javascript
   const GUARDIAN_KEY = 'YOUR_KEY_HERE';
   ```
   *Note: If left as `'test'`, the app will use the public Guardian trial key, which has rate-limiting quotas.*

---

## 🛠️ Browser Compatibility

* Google Chrome (latest)
* Mozilla Firefox (latest)
* Apple Safari (latest)
* Microsoft Edge (latest)
* Mobile Webkit & Blink Viewports