# Documentation Setup Guide

This guide explains how to work with the VitePress documentation for MiniJob Admin Dashboard.

## Local Development

### Start the documentation server

```bash
npm run docs:dev
```

The documentation will be available at `http://localhost:5173`

### Build for production

```bash
npm run docs:build
```

The built site will be in `docs/.vitepress/dist`

### Preview the production build

```bash
npm run docs:preview
```

## Documentation Structure

```
docs/
├── .vitepress/
│   ├── config.js              # VitePress configuration
│   └── theme/
│       ├── index.js           # Custom theme
│       ├── custom.css         # Purple-themed styles
│       └── components/        # Custom Vue components
│           ├── FeatureGrid.vue
│           ├── CodeBlock.vue
│           ├── Screenshot.vue
│           └── StatsCounter.vue
├── index.md                   # Homepage
├── guide/                     # User guides
│   ├── getting-started.md
│   ├── configuration.md
│   ├── deployment.md
│   ├── troubleshooting.md
│   ├── contributing.md
│   └── features/              # Feature-specific guides
│       ├── dashboard.md
│       ├── jobs.md
│       ├── resources.md
│       ├── system.md
│       ├── topics.md
│       └── health-monitoring.md
├── reference/                 # Technical reference
│   ├── api.md
│   ├── job-states.md
│   └── environment-variables.md
└── public/
    └── images/
        ├── logo.svg
        └── screenshots/       # Add screenshots here
```

## Writing Documentation

### Markdown Features

VitePress supports:

- Standard Markdown
- GitHub-Flavored Markdown
- Custom containers (`::: tip`, `::: warning`, `::: danger`)
- Code highlighting with line numbers
- Frontmatter for page metadata

### Custom Components

Use the custom Vue components in your documentation:

#### FeatureGrid

Display features in a grid:

```vue
<FeatureGrid
  :features="[
    { title: 'Feature 1', description: 'Description' },
    { title: 'Feature 2', description: 'Description' },
  ]"
/>
```

#### CodeBlock

Display code with copy button:

```vue
<CodeBlock code="npm install" language="bash" />
```

#### Screenshot

Display image with zoom:

```vue
<Screenshot src="/images/screenshots/dashboard.png" alt="Dashboard" caption="MiniJob Admin Dashboard" />
```

#### StatsCounter

Animated statistics:

```vue
<StatsCounter :value="10000" label="Jobs Processed" duration="2000" />
```

### Code Highlighting

Supports syntax highlighting for:

- JavaScript/TypeScript
- Vue
- JSON
- Bash/Shell
- YAML
- Dockerfile
- And more...

Example:

````markdown
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
console.log(apiUrl);
```
````

### Custom Containers

```markdown
::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a danger message
:::
```

### Linking

Internal links:

```markdown
[Getting Started](/guide/getting-started)
[API Reference](/reference/api)
```

External links:

```markdown
[Vue.js](https://vuejs.org/)
```

## Adding Screenshots

1. Take screenshots of the application
2. Save them to `docs/public/images/screenshots/`
3. Reference in documentation:

```markdown
![Dashboard](/images/screenshots/dashboard.png)

Or use the Screenshot component:

<Screenshot
  src="/images/screenshots/dashboard.png"
  alt="Dashboard view"
  caption="MiniJob Admin Dashboard showing job statistics"
/>
```

Recommended screenshots:

- `dashboard.png` - Main dashboard view
- `jobs-list.png` - Jobs listing page
- `job-details.png` - Job detail view
- `resources.png` - Resource locking view
- `system.png` - System information page
- `topics.png` - Topics organization
- `health-monitoring.png` - Health monitoring page

## Deployment to GitHub Pages

### Automatic Deployment

The documentation is automatically deployed to GitHub Pages when you push to the `main` or `docs` branch.

The workflow file is at `.github/workflows/deploy-docs.yml`

### Manual Deployment

Trigger manually on GitHub:

1. Go to **Actions** tab
2. Select **Deploy Documentation**
3. Click **Run workflow**

### First-Time Setup

1. **Enable GitHub Pages:**
   - Go to repository **Settings** → **Pages**
   - Source: **GitHub Actions**

2. **Update base path in config:**
   - Edit `docs/.vitepress/config.js`
   - Set `base: '/minijob-admin/'` (use your repo name)

3. **Update README links:**
   - Replace `nbigot` with your actual username
   - Replace `minijob-admin` if you renamed the repo

## Customization

### Color Theme

The documentation uses a purple theme inspired by Sentry.io.

Main colors defined in `docs/.vitepress/theme/custom.css`:

- Primary: `#5B21B6` (deep purple)
- Accent: `#7C3AED` (purple)
- Background gradient: `#1E1B4B → #312E81`

To change the theme:

1. Edit CSS variables in `custom.css`
2. Update brand colors (`--vp-c-brand-1`, `--vp-c-brand-2`, `--vp-c-brand-3`)

### Navigation

Edit `docs/.vitepress/config.js`:

```javascript
themeConfig: {
  nav: [
    { text: "Home", link: "/" },
    { text: "Guide", link: "/guide/getting-started" },
    // Add more nav items
  ];
}
```

### Sidebar

Edit sidebar in `docs/.vitepress/config.js`:

```javascript
sidebar: [
  {
    text: "Getting Started",
    items: [
      { text: "Installation", link: "/guide/getting-started" },
      // Add more items
    ],
  },
];
```

## Best Practices

1. **Keep it updated** - Update documentation with code changes
2. **Add examples** - Include code examples and use cases
3. **Use screenshots** - Visual aids help users understand
4. **Link extensively** - Cross-reference related documentation
5. **Test locally** - Always preview before committing
6. **Write for users** - Focus on user needs, not implementation details
7. **Version documentation** - Keep docs in sync with releases

## Troubleshooting

### Port already in use

```bash
# Kill the process using port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5173 | xargs kill
```

### Build errors

```bash
# Clear cache and rebuild
rm -rf docs/.vitepress/dist
rm -rf docs/.vitepress/cache
npm run docs:build
```

### Broken links

VitePress will warn about broken links during build:

```
[vitepress] Dead link found: /guide/non-existent.html
```

Fix by updating the link or creating the missing page.

## Resources

- [VitePress Documentation](https://vitepress.dev/)
- [Vue.js 3](https://vuejs.org/)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Pages](https://pages.github.com/)

## Support

For documentation issues:

1. Check this setup guide
2. Review VitePress documentation
3. Open an issue on GitHub

---

**Happy documenting! 📚✨**
