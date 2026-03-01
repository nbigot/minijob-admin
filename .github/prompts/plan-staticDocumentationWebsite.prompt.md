# Plan: Static Documentation Website with GitHub Pages

Building a modern documentation site for MiniJob Admin Dashboard using **VitePress** with a **hybrid structure** (marketing landing page + technical docs). The site will be hosted in the `/docs` directory and deployed via GitHub Pages with a **purple-themed design** inspired by Sentry and Document360.

> **Status (March 2026):** All steps completed. ✅

## Steps

### 1. ✅ Initialize VitePress structure in `/docs` directory

- ✅ `/docs` folder created at project root
- ✅ VitePress `v1.6.4` installed as dev dependency
- ✅ `docs/index.md` (marketing homepage) and `docs/.vitepress/config.js` created
- ✅ Custom theme configured in `docs/.vitepress/theme/index.js` extending default VitePress theme
- ✅ `docs/.vitepress/theme/custom.css` created with purple color scheme
- ✅ `docs/public/images/logo.svg` created (purple "M" icon for navbar and favicon)

### 2. ✅ Create marketing homepage at `docs/index.md`

- ✅ **Hero section**: Bold headline "Real-time Job Queue Management", CTAs (Get Started, GitHub), hero image uses `dashboard.png` screenshot
- ✅ **Features showcase**: 10 key features (Real-time Monitoring, Job Lifecycle Management, Resource Locking, Dark Mode, Docker-Ready, Visual Analytics, Job Cloning, Advanced Filtering, Topic Organization, Mock Data Mode)
- ✅ **Stats section**: Animated counters (10 Job States, 7+ Key Features, <5min Setup Time, 100% Docker Ready)
- ✅ **Quick start code block**: Docker run and npm dev commands displayed
- ✅ **Architecture overview**: ASCII diagram Frontend (Vue.js) → Backend (MiniJob) → Database
- ✅ **Key Benefits**: 3-column feature grid (Easy Setup, Comprehensive Monitoring, Production Ready)
- ✅ **What's Next?**: 3-column links to Guide, Reference, Contributing

### 3. ✅ Build technical documentation pages in `/docs/guide/`

- ✅ `docs/guide/getting-started.md` - Installation, prerequisites, quick setup
- ✅ `docs/guide/configuration.md` - Environment variables, `.env` file structure, `VITE_*` variables
- ✅ `docs/guide/deployment.md` - Development mode, Docker deployment, docker-compose setup
- ✅ `docs/guide/features/` directory with pages:
  - ✅ `dashboard.md` - Dashboard overview, metrics, polling intervals + screenshot
  - ✅ `jobs.md` - Job management, filtering, bulk operations + screenshot
  - ✅ `resources.md` - Resource locking concept and management + screenshot
  - ✅ `topics.md` - Topic organization patterns + screenshot
  - ✅ `health-monitoring.md` - Health checks and system status + screenshot
  - ✅ `system.md` - System administration: server control, bulk operations, API reference + screenshot

### 4. ✅ Add reference documentation in `/docs/reference/`

- ✅ `docs/reference/job-states.md` - Job lifecycle diagram: Created → Delayed → Pending → Queued → Running → Succeeded/Failed/Canceled
- ✅ `docs/reference/api.md` - Service layer APIs from `src/services/` (jobService, dashboardService, etc.)
- ✅ `docs/reference/environment-variables.md` - Complete list of all `VITE_*` variables with descriptions

### 5. ✅ Configure VitePress navigation and sidebar in `docs/.vitepress/config.js`

- ✅ Top nav: Home, Guide, Reference, version dropdown (Changelog, Contributing)
- ✅ Sidebar for Guide: Getting Started → Configuration → Deployment → Features (Dashboard, Jobs, Resources, Topics, Health Monitoring, System Admin) → Additional (Troubleshooting, Contributing)
- ✅ Sidebar for Reference: Job States, API Reference, Environment Variables
- ✅ Social links: GitHub repo
- ✅ Local search enabled
- ✅ Edit link pointing to GitHub
- ✅ Footer with MIT license and copyright © 2026

### 6. ✅ Implement custom Vue components in `docs/.vitepress/theme/components/`

- ✅ `FeatureGrid.vue` - Reusable feature cards with icons
- ✅ `CodeBlock.vue` - Syntax-highlighted code examples with copy button
- ✅ `Screenshot.vue` - Image component with zoom feature
- ✅ `StatsCounter.vue` - Animated numbers for metrics

### 7. ✅ Apply Sentry-inspired purple design via `docs/.vitepress/theme/custom.css`

- ✅ Primary purple: `#7C3AED` / `#5B21B6`
- ✅ Dark mode hero: smooth `linear-gradient(180deg, #1E1B4B → #1B1838 → #13111F)` to eliminate horizontal color break
- ✅ Dark mode backgrounds: softened (`#13111f`, `#1a1630`) matching VitePress.dev readability
- ✅ Text colors: VitePress defaults kept (no custom overrides), superior readability
- ✅ Feature grid CSS: `.feature-grid`, `.feature-card`, `.feature-title`, `.feature-description`, `.feature-link`
- ✅ Stats counter cards, screenshot containers, custom block containers
- ✅ Smooth hover transitions (300ms ease-in-out) on feature and stat cards
- ✅ Code blocks with purple border and lang label coloring
- ✅ Navbar with backdrop blur

### 8. ✅ Screenshots for documentation

- ✅ All screenshots saved to `docs/public/images/screenshots/`:
  - `dashboard.png` — used as hero image on homepage
  - `jobs-list.png`
  - `job-details.png`
  - `resources.png`
  - `topics.png`
  - `health-monitoring.png`
  - `system.png`
- ✅ Each feature page (`dashboard`, `jobs`, `resources`, `topics`, `health-monitoring`, `system`) includes its screenshot after the opening paragraph

### 9. ✅ Configure GitHub Pages deployment

- ✅ `docs/.vitepress/config.js` has `base: '/minijob-admin/'`
- ✅ `.github/workflows/deploy-docs.yml` GitHub Action created
- ✅ npm scripts in `package.json`: `docs:dev`, `docs:build`, `docs:preview`
- ⏳ Enable GitHub Pages in repo settings (source: `gh-pages` branch) — manual step required after first deploy

### 10. ✅ Add content finishing touches

- ✅ `docs/guide/contributing.md` - How to contribute, code style, PR process
- ✅ `docs/guide/troubleshooting.md` - Common issues and solutions
- ✅ `README.md` updated with link to documentation site

## Verification

- ✅ `npm run docs:build` completes without errors (~10s build time)
- ✅ `npm run docs:preview` serves site at `http://localhost:4173/minijob-admin/`
- ✅ All internal links valid (VitePress link checker passes)
- ✅ Purple theme renders correctly in light and dark modes
- ✅ Hero section blends seamlessly into page background (no horizontal color break)
- ✅ Feature grid cards render with hover effects on homepage
- ✅ All 6 feature pages display their respective screenshots
- ⏳ After GitHub Actions deployment, verify site at `https://nbigot.github.io/minijob-admin/`

## Decisions

- **VitePress over other SSGs**: Already using Vue.js in the main app; VitePress provides excellent Vue integration, built-in search/dark mode, and minimal configuration
- **Hybrid structure over single-page**: Allows comprehensive technical documentation while maintaining an engaging marketing presence
- **In-repo `docs/` folder**: Keeps documentation close to code, easier to maintain, single repository
- **Purple color scheme (`#7C3AED` / `#5B21B6` family)**: Matches Sentry's modern aesthetic while being distinct, professional yet approachable
- **Hero image = real screenshot**: Using `dashboard.png` in the hero is more compelling than a custom illustration and requires no extra asset
- **Text colors follow VitePress defaults**: Overriding `--vp-c-text-*` caused washed-out text; removing overrides gives VitePress's own well-tuned contrast ratios
- **Dark mode gradient instead of `::before` overlay**: The pseudo-element approach created a hard seam; a `background` gradient on `.dark .VPHero` fades naturally into the page background
- **GitHub Actions for CI/CD**: Automated deployment on every push, no manual intervention needed

## Key Features of the Documentation Site

### Marketing Homepage

- Modern hero section with real dashboard screenshot and purple gradient (dark mode)
- 10-feature grid with icons and descriptions
- Animated stats counter (job states, features, setup time, Docker-ready)
- Quick start code examples (Docker + npm)
- Architecture ASCII diagram
- 3-column benefits section with hover cards
- Navigation links to Guide, Reference, Contributing

### Technical Documentation

- Getting started guide with prerequisites and quick setup
- Full configuration reference (all `VITE_*` environment variables)
- Deployment guide: development, Docker, docker-compose
- 6 feature pages each with screenshot, overview, and detailed reference:
  - Dashboard, Jobs Management, Resources, Topics, Health Monitoring, System Admin
- API reference for all service layer methods
- Job lifecycle and state documentation

### Design Elements

- Purple-themed design inspired by Sentry (2026 modern aesthetic)
- Seamless dark mode with deep purple backgrounds and smooth hero gradient
- Responsive layout for all devices
- Local search functionality
- Smooth card hover animations and transitions
- VitePress-default typography for optimal readability
- Navbar with backdrop blur

### Developer Experience

- Local dev server: `npm run docs:dev` (hot reload)
- Production build: `npm run docs:build`
- Preview built site: `npm run docs:preview`
- Automated GitHub Pages deployment via `.github/workflows/deploy-docs.yml`
- Built-in VitePress link validation on every build
- Edit-on-GitHub links on every documentation page

This plan creates a professional, modern documentation site that showcases MiniJob Admin Dashboard's capabilities while providing comprehensive technical documentation for users and developers.
