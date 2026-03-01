# Contributing

Thank you for your interest in contributing to MiniJob Admin Dashboard!

## Ways to Contribute

- 🐛 **Report bugs** - Help us identify issues
- ✨ **Suggest features** - Share your ideas
- 📝 **Improve documentation** - Help others understand the project
- 💻 **Submit code** - Fix bugs or add features
- 🎨 **Design improvements** - Enhance UI/UX
- ✅ **Write tests** - Improve code quality
- 🌍 **Translations** - Help internationalize the app

## Getting Started

### Fork and Clone

```bash
# Fork repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/minijob-admin.git
cd minijob-admin

# Add upstream remote
git remote add upstream https://github.com/nbigot/minijob-admin.git
```

### Setup Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run with mock data
npm run dev -- --mode simul
```

### Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

## Development Workflow

### 1. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 2. Test Your Changes

```bash
# Test in development mode
npm run dev

# Test in simulation mode
npm run dev -- --mode simul

# Build and test production build
npm run build
npm run preview
```

### 3. Lint Your Code

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### 4. Commit Your Changes

Use conventional commit messages:

```bash
# Format: type(scope): description

git commit -m "feat(jobs): add bulk delete functionality"
git commit -m "fix(dashboard): correct polling interval calculation"
git commit -m "docs(api): update endpoint documentation"
git commit -m "style(ui): improve dark mode contrast"
git commit -m "refactor(services): simplify axios configuration"
git commit -m "test(jobs): add job creation tests"
```

**Commit Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code restructuring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 5. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Go to GitHub and create Pull Request
```

## Pull Request Guidelines

### PR Title

Use conventional commit format:

```
feat: add job export functionality
fix: resolve dark mode flicker issue
docs: improve deployment guide
```

### PR Description

Include:

**Description:**
Clear explanation of what changes were made and why.

**Related Issue:**
Reference issue number if applicable: `Fixes #123` or `Closes #456`

**Testing:**

- [ ] Tested in development mode
- [ ] Tested in simulation mode
- [ ] Tested production build
- [ ] Tested dark mode
- [ ] Tested on mobile/responsive

**Screenshots:**
Include screenshots for UI changes.

**Additional Notes:**
Any other context or considerations.

### Example PR Description

```markdown
## Description

Adds bulk delete functionality to the Jobs page, allowing users to select multiple jobs and delete them in one action.

## Related Issue

Fixes #123

## Changes

- Added checkbox selection to job list
- Implemented bulk delete action
- Added confirmation modal for bulk operations
- Updated job store to handle bulk deletes

## Testing

- [x] Tested in development mode
- [x] Tested in simulation mode
- [x] Tested production build
- [x] Tested dark mode
- [x] Tested on mobile

## Screenshots

[Screenshot showing bulk delete UI]
```

## Code Style

### JavaScript/Vue

```javascript
// Use modern ES6+ syntax
const jobs = await fetchJobs();

// Destructure imports
import { ref, computed, onMounted } from 'vue';

// Use async/await over promises
async fetchData() {
  try {
    const response = await api.getJobs();
    this.jobs = response.data;
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
  }
}

// Use template literals
console.log(`Processing job ${jobId}`);

// Use arrow functions for callbacks
jobs.filter(job => job.status === 'failed');
```

### Vue Components

```vue
<template>
  <!-- Use semantic HTML -->
  <div class="job-list">
    <h2>Jobs</h2>
    <ul>
      <li v-for="job in jobs" :key="job.id">
        {{ job.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
// Organize imports
import { ref, onMounted } from "vue";
import { useJobStore } from "@/stores/jobStore";

// Define props and emits
const props = defineProps({
  status: String,
});

const emit = defineEmits(["update"]);

// Setup reactive state
const jobs = ref([]);

// Lifecycle hooks
onMounted(async () => {
  await loadJobs();
});
</script>

<style scoped>
/* Use scoped styles */
.job-list {
  padding: 1rem;
}
</style>
```

### CSS/TailwindCSS

```vue
<!-- Prefer TailwindCSS classes -->
<div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
  <h2 class="text-xl font-bold text-gray-900 dark:text-white">
    Title
  </h2>
</div>

<!-- For complex styles, use scoped CSS -->
<style scoped>
.custom-component {
  /* Custom styles when Tailwind isn't sufficient */
}
</style>
```

### File Organization

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
│   ├── common/     # Generic components
│   └── jobs/       # Feature-specific components
├── services/        # API services
├── stores/          # State management
├── utils/           # Utility functions
└── views/           # Page components
```

## Testing

### Manual Testing

Test your changes:

1. Development mode
2. Simulation mode
3. Production build
4. Dark mode
5. Different screen sizes
6. Different browsers

### Adding Tests

```javascript
// tests/unit/jobService.spec.js
import { describe, it, expect } from "vitest";
import { getJobs } from "@/services/jobService";

describe("jobService", () => {
  it("fetches jobs successfully", async () => {
    const jobs = await getJobs();
    expect(jobs).toBeInstanceOf(Array);
  });
});
```

Run tests:

```bash
npm run test
```

## Documentation

### Code Comments

```javascript
/**
 * Fetches jobs from the backend API
 * @param {Object} filters - Filter criteria
 * @param {string} filters.status - Job status filter
 * @param {string} filters.topic - Topic filter
 * @returns {Promise<Array>} Array of job objects
 */
async function getJobs(filters) {
  // Implementation
}
```

### README Updates

Update README.md if you:

- Add new features
- Change installation steps
- Modify configuration
- Add new dependencies

### Documentation Site

Update docs in `docs/` folder:

- `/docs/guide/` - User guides
- `/docs/reference/` - API reference

## Project Structure

```
minijob-admin/
├── src/
│   ├── assets/           # Images, CSS
│   ├── components/       # Vue components
│   ├── mocks/           # Mock data for development
│   ├── router/          # Vue Router configuration
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   └── views/           # Page components
├── docs/                # Documentation site
├── public/              # Static public assets
├── tests/               # Test files
├── .env.example         # Example environment variables
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # TailwindCSS configuration
```

## Reporting Bugs

### Before Reporting

1. Search existing issues
2. Try latest version
3. Test in simulation mode
4. Check documentation

### Bug Report Template

```markdown
**Describe the Bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:

1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**

- OS: [e.g., Windows 11, macOS, Linux]
- Browser: [e.g., Chrome 120, Firefox 121]
- Version: [e.g., 1.0.0]
- Mode: [e.g., development, production, Docker]

**Additional Context**
Any other context about the problem.
```

## Feature Requests

### Feature Request Template

```markdown
**Is your feature related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Screenshots, mockups, or examples.
```

## Code Review Process

### What We Look For

- ✅ Code follows style guidelines
- ✅ Changes are well-documented
- ✅ Tests pass
- ✅ No console errors
- ✅ Responsive design works
- ✅ Dark mode works
- ✅ Performance is acceptable
- ✅ Security considerations addressed

### Review Timeline

- Small changes: 1-3 days
- Medium changes: 3-7 days
- Large changes: 1-2 weeks

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- Open a [GitHub Discussion](https://github.com/nbigot/minijob-admin/discussions)
- Comment on an existing issue
- Tag maintainers in your PR

## Recognition

Contributors are recognized in:

- README.md contributors section
- Release notes
- GitHub contributors page

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on what is best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

### Enforcement

Violations may result in:

1. Warning
2. Temporary ban
3. Permanent ban

Report issues to: [your-email]

## Thank You! 🎉

Your contributions make MiniJob Admin Dashboard better for everyone!

---

## Quick Reference

```bash
# Setup
git clone https://github.com/YOUR_USERNAME/minijob-admin.git
npm install
npm run dev

# Branch
git checkout -b feature/your-feature

# Commit
git commit -m "feat: your feature description"

# Push
git push origin feature/your-feature

# Create PR on GitHub
```

**Commit Format:**

```
type(scope): description

feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructuring
test: tests
chore: maintenance
```
