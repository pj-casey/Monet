# Contributing to Monet

Thanks for your interest in contributing. This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 20+
- pnpm 10+

### Getting Running

```bash
git clone https://github.com/pj-casey/Monet.git
cd Monet
pnpm install
pnpm dev
```

The development server starts at [http://localhost:5173](http://localhost:5173). Changes hot-reload automatically.

### Useful Commands

```bash
pnpm dev          # Start the dev server
pnpm build        # Production build (runs TypeScript check + Vite)
pnpm lint         # ESLint
pnpm typecheck    # TypeScript type checking
pnpm test         # Run tests
```

## Code Style

- **TypeScript strict mode.** No `any` types unless documented.
- **Functional React components only.** No class components.
- **File naming:** `kebab-case.ts` for regular files, `PascalCase.tsx` for React components.
- **Named exports** preferred (except page/route components use default export).
- **Tests** go next to the file they test: `foo.ts` -> `foo.test.ts`.

### Architecture Rules

1. **React components never import Fabric.js directly.** All canvas operations go through `packages/canvas-engine/`.
2. **Zustand stores don't depend on each other.** No circular dependencies.
3. **Every design is a `DesignDocument`** — a JSON object that can be saved, loaded, and shared.
4. **The editor works fully client-side.** No backend required. Backend features are always optional.
5. **All bundled assets must use permissive licenses** (CC0, MIT, Apache 2.0).

### Design System

All UI must use tokens from `DESIGN.md`. No hardcoded colors, no Tailwind default palette colors (`gray-*`, `blue-*`, etc.). Read `DESIGN.md` before touching any UI.

## Finding Issues to Work On

Check the [Issues](https://github.com/pj-casey/Monet/issues) tab. Issues labeled `good first issue` are a great starting point.

Common areas where help is welcome:

- **Templates** — adding new built-in templates (see the [Template Guide](docs/TEMPLATE_GUIDE.md))
- **Translations** — adding new languages to `apps/web/src/i18n/`
- **Bug fixes** — anything in the issue tracker
- **Accessibility** — keyboard navigation, screen reader support, contrast

## Pull Request Process

1. Fork the repo and create a branch from `main`.
2. Make your changes. Run `pnpm build` to verify everything compiles.
3. Write a clear PR description explaining what changed and why.
4. One approval required to merge.

Keep PRs focused. One logical change per PR.

## Adding Templates

Templates are a great first contribution. See [docs/TEMPLATE_GUIDE.md](docs/TEMPLATE_GUIDE.md) for the format, coordinate system, available fonts, and design tips.

## License

By contributing, you agree that your contributions will be licensed under the [AGPL-3.0](LICENSE) license.
