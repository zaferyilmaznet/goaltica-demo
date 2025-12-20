# 🏔️ Goaltica

> **Set goals. Track progress. Stay motivated — privately, offline.**

Goaltica is a minimalist, offline-first goal tracker designed for focus and privacy.  
No accounts, no cloud sync — just your goals stored securely in your browser.

---

## ✨ Features

- 🧠 **Smart goal management** — Add, edit, complete, or delete goals easily.
- 🌈 **Dark & light themes** — Toggle theme anytime.
- 📱 **Mobile-first design** — Clean, compact, and responsive.
- 🧭 **Priority levels** — Visual indicators for _High_, _Medium_, and _Low_ goals.
- 🔍 **Search support** — Instantly find your goals by keyword.
- ✅ **Completed state** — Mark finished goals and keep them for review.
- 💾 **Offline storage** — Everything stays in your browser’s localStorage.
- 🔄 **Service Worker** — PWA-ready; works even without internet.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/zaferyilmaznet/goaltica-demo.git
cd goaltica

2. Open the app

Simply open index.html in your browser — no server required.
For full PWA functionality (like offline caching), you can also serve locally:

npx serve .


Then visit http://localhost:3000
 (or the port shown).

---

🧩 Folder Structure

goaltica-demo/

├── index.html
├── manifest.json
├── service-worker.js
├── icons/
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-192.png
│   └── icon-512.png
├── css/
│   └── main.css
└── js/
    ├── app.js
    ├── model.js
    ├── storage.js
    ├── ui.js
    ├── utils.js
    └── theme.js


---

📦 Tech Stack

HTML5, CSS3 (mobile-first)
Vanilla JavaScript (ES6+)
LocalStorage for data
Service Worker for offline support
No dependencies, no build tools — just open and go!


---

🧠 Roadmap

Goal categories / tags
Progress tracking (percent-based)
Data export / import
Reminders or notifications
Cloud sync (optional)


---

📄 License

MIT License © 2025 Zafer Yilmaz - https://zaferyilmaz.dev

---
```
