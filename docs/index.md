---
layout: home

hero:
  name: MiniJob Admin Dashboard
  text: Real-time Job Queue Management
  tagline: A modern, Vue.js-powered dashboard for monitoring and managing your MiniJob backend job processing system with real-time metrics, dark mode, and Docker-ready deployment.
  image:
    src: /images/screenshots/dashboard.png
    alt: MiniJob Admin Dashboard
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/nbigot/minijob-admin

features:
  - icon: 📊
    title: Real-time Monitoring
    details: Live job statistics and metrics with configurable refresh intervals. Monitor 10 different job states including created, queued, running, succeeded, and failed jobs.

  - icon: 🔄
    title: Complete Job Lifecycle
    details: Create, monitor, retry, cancel, and delete jobs with ease. Advanced filtering by status, topic, and search makes finding specific jobs effortless.

  - icon: 🔒
    title: Resource Management
    details: Prevent resource conflicts with built-in locking mechanism. View locked resources, unlock individual or all resources with confirmation modals.

  - icon: 🌙
    title: Dark Mode Support
    details: Full dark theme support with smooth transitions. Perfect for long monitoring sessions and reduces eye strain.

  - icon: 🐳
    title: Docker-Ready
    details: Easy deployment with Docker and docker-compose. Runtime configuration via environment variables means no rebuild required.

  - icon: 📈
    title: Visual Analytics
    details: Interactive charts showing job processing trends over time with Chart.js. Track succeeded, failed, and pending jobs at a glance.

  - icon: 🎯
    title: Job Cloning
    details: Quickly duplicate jobs for testing scenarios. Generate random jobs with the built-in job generator for development.

  - icon: 🔍
    title: Advanced Filtering
    details: Search and filter jobs by status, topic, name, or ID. Sortable columns and pagination for handling large job lists.

  - icon: 🏷️
    title: Topic Organization
    details: Organize jobs by business logic with topics. View job distribution, success rates, and average duration by topic.

  - icon: ⚡
    title: Mock Data Mode
    details: Full mock API with realistic job lifecycle simulation. Develop and test without a backend server using axios-mock-adapter.
---

<div class="container-wide stats-section">
  <h2 class="text-gradient" style="text-align: center; border: none; margin-bottom: 2rem;">Why MiniJob Admin Dashboard?</h2>
  
  <StatsCounter :stats="[
    { value: '10', label: 'Job States' },
    { value: '7+', label: 'Key Features' },
    { value: '< 5min', label: 'Setup Time' },
    { value: '100%', label: 'Docker Ready' }
  ]" />
</div>

## Quick Start

Get up and running in under 5 minutes:

### Using Docker (Recommended)

```bash
# Run with runtime configuration
docker run -e BACKEND_URL="http://localhost:8080" \
  -e PROMETHEUS_URL="http://localhost:9090" \
  -p 8081:80 nbigot/minijob-admin
```

Access the dashboard at `http://localhost:8081`

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or use mock data mode
npm run dev -- --mode simul
```

Access the dashboard at `http://localhost:3000`

## Architecture Overview

<div style="display:flex; justify-content:center; margin: 2rem 0;">
<svg class="arch-diagram" viewBox="0 0 480 390" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:480px; height:auto;" aria-label="Architecture diagram">
  <defs>
    <linearGradient id="grad-admin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#5b21b6"/>
    </linearGradient>
    <linearGradient id="grad-backend" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="grad-db" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#0f766e"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0,0,0,0.18)"/>
    </filter>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#94a3b8"/>
    </marker>
  </defs>

  <!-- Box 1: MiniJob Admin -->
  <rect x="80" y="10" width="320" height="96" rx="14" fill="url(#grad-admin)" filter="url(#shadow)"/>
  <text x="240" y="44" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="white">🖥️  MiniJob Admin Dashboard</text>
  <text x="240" y="66" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="rgba(255,255,255,0.82)">Vue.js 3 + Vite + TailwindCSS</text>
  <rect x="148" y="80" width="62" height="20" rx="6" fill="rgba(255,255,255,0.18)"/>
  <text x="179" y="94" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="white">Frontend</text>
  <rect x="222" y="80" width="62" height="20" rx="6" fill="rgba(255,255,255,0.18)"/>
  <text x="253" y="94" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="white">Charts</text>
  <rect x="296" y="80" width="62" height="20" rx="6" fill="rgba(255,255,255,0.18)"/>
  <text x="327" y="94" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="white">Dark Mode</text>

  <!-- Arrow 1 -->
  <line x1="240" y1="106" x2="240" y2="154" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#arrow)"/>
  <rect x="170" y="119" width="140" height="22" rx="6" fill="#f1f5f9" opacity="0.92"/>
  <text x="240" y="134" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#475569">HTTP / REST API</text>

  <!-- Box 2: MiniJob Backend -->
  <rect x="80" y="155" width="320" height="96" rx="14" fill="url(#grad-backend)" filter="url(#shadow)"/>
  <text x="240" y="189" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="white">⚙️  MiniJob Backend</text>
  <text x="240" y="211" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="rgba(255,255,255,0.82)">Job Processing Engine</text>
  <rect x="122" y="225" width="72" height="20" rx="6" fill="rgba(255,255,255,0.18)"/>
  <text x="158" y="239" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="white">Scheduler</text>
  <rect x="204" y="225" width="72" height="20" rx="6" fill="rgba(255,255,255,0.18)"/>
  <text x="240" y="239" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="white">Workers</text>
  <rect x="286" y="225" width="72" height="20" rx="6" fill="rgba(255,255,255,0.18)"/>
  <text x="322" y="239" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="white">REST API</text>

  <!-- Arrow 2 -->
  <line x1="240" y1="251" x2="240" y2="299" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#arrow)"/>
  <rect x="175" y="264" width="130" height="22" rx="6" fill="#f1f5f9" opacity="0.92"/>
  <text x="240" y="279" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#475569">Persist / Query</text>

  <!-- Box 3: Database -->
  <rect x="80" y="300" width="320" height="80" rx="14" fill="url(#grad-db)" filter="url(#shadow)"/>
  <text x="240" y="334" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="white">🗄️  Database / Queue</text>
  <text x="240" y="356" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="rgba(255,255,255,0.82)">Persistent Job Store</text>
</svg>
</div>

## Key Benefits

<div class="feature-grid">
  <div class="feature-card">
    <div class="feature-icon">⚙️</div>
    <h3 class="feature-title">Easy Setup</h3>
    <p class="feature-description">One command to get started. Works with Docker, npm, or pure development mode with hot reload.</p>
  </div>
  
  <div class="feature-card">
    <div class="feature-icon">📡</div>
    <h3 class="feature-title">Comprehensive Monitoring</h3>
    <p class="feature-description">Track every aspect of your job queue. From creation to completion, with detailed metrics and history.</p>
  </div>
  
  <div class="feature-card">
    <div class="feature-icon">🚀</div>
    <h3 class="feature-title">Production Ready</h3>
    <p class="feature-description">Built with modern technologies. TailwindCSS, Vue 3, and Vite ensure fast, reliable performance.</p>
  </div>
</div>

## Technology Stack

- **[Vue.js 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Chart.js](https://www.chartjs.org/)** - Beautiful, responsive charts
- **[Font Awesome](https://fontawesome.com/)** - Icon library
- **[Docker](https://www.docker.com/)** - Containerization platform

## What's Next?

<div class="feature-grid">
  <div class="feature-card">
    <h3 class="feature-title">📚 Read the Guide</h3>
    <p class="feature-description">Learn how to configure, deploy, and use all features of MiniJob Admin Dashboard.</p>
    <a href="/guide/getting-started" class="feature-link">Get Started →</a>
  </div>
  
  <div class="feature-card">
    <h3 class="feature-title">🔍 Explore Reference</h3>
    <p class="feature-description">Deep dive into job states, API documentation, and environment variables.</p>
    <a href="/reference/job-states" class="feature-link">View Reference →</a>
  </div>
  
  <div class="feature-card">
    <h3 class="feature-title">🤝 Contribute</h3>
    <p class="feature-description">Help improve MiniJob Admin Dashboard. Contributions are welcome!</p>
    <a href="/guide/contributing" class="feature-link">Contributing Guide →</a>
  </div>
</div>
