# Spendly Design Guide

This document describes the actual frontend design language currently used in Spendly. Use it as the source of truth when creating new pages such as login, register, dashboard, settings, transaction import, budgets, and reports.

## 1. Design Direction

Spendly currently uses a clean, premium fintech landing-page style:

- Light, neutral, mostly monochrome interface.
- Large editorial typography with serif display headings.
- Full-width sections with generous vertical spacing.
- Image and video-led hero/feature areas.
- Soft white cards with subtle shadows.
- Minimal borders and restrained color.
- Small financial accent colors used only for data, status, charts, and category labels.
- Smooth scroll, reveal animations, animated charts, and subtle hover motion.

The feeling should be trustworthy, calm, modern, polished, and finance-focused. It should not feel loud, playful, crypto-like, gaming-like, or overly colorful.

## 2. Frontend Stack

The frontend is built with:

- Next.js App Router.
- React and TypeScript.
- Tailwind CSS v4 using CSS variables from `frontend/app/globals.css`.
- shadcn/ui style components configured as `new-york`.
- Radix UI primitives for accessible interactions.
- `lucide-react` for icons.
- `class-variance-authority`, `clsx`, and `tailwind-merge` for component variants and class composition.
- `framer-motion` for animated sections and cards.
- `recharts` for chart visuals.
- `next/font/google` with Inter, Playfair Display, and Geist Mono.

When adding new UI, prefer the existing `frontend/components/ui/*` primitives before creating custom controls.

## 3. Brand Personality

Spendly should communicate:

- Confidence: users trust it with financial data.
- Clarity: money status should be readable in seconds.
- Control: users feel guided, not overwhelmed.
- Intelligence: AI and automation feel useful, not flashy.
- Calm premium quality: the app feels like a polished financial tool.

Use plain, practical copy. Avoid exaggerated marketing claims, slang, and decorative UI that does not help the user understand money.

## 4. Core UX Principle

Every page should answer the user's immediate question first.

For dashboard pages:

- "How am I doing financially?"
- "What changed?"
- "What needs attention?"
- "What should I do next?"

For auth pages:

- "Where am I?"
- "What do I need to do?"
- "Can I trust this?"
- "How do I continue?"

For import or setup pages:

- "What file/data is needed?"
- "What will Spendly do with it?"
- "What happens after upload?"

## 5. Visual Hierarchy

Use this hierarchy for finance product pages:

1. Financial health or primary page outcome.
2. Income, expenses, savings, and cashflow summary.
3. Important insights and alerts.
4. Spending breakdown by category.
5. Trends over time.
6. Budgets and goal progress.
7. Subscriptions and recurring payments.
8. Recent transactions.
9. Advanced settings or filters.

Use this hierarchy for marketing/auth pages:

1. Brand and page purpose.
2. Primary action.
3. Trust signal or concise benefit.
4. Supporting preview, visual, or secondary action.
5. Legal/security/support links.

## 6. Color System

The app uses a light neutral theme defined in `frontend/app/globals.css`.

### Core Tokens

Use semantic Tailwind classes first:

```txt
bg-background
text-foreground
bg-card
text-card-foreground
bg-popover
text-popover-foreground
bg-primary
text-primary-foreground
bg-secondary
text-secondary-foreground
bg-muted
text-muted-foreground
bg-accent
text-accent-foreground
border-border
border-input
ring-ring
bg-destructive
text-destructive-foreground
```

### Current Token Values

The active light theme uses these OKLCH values:

```css
--background: oklch(0.98 0 0);
--foreground: oklch(0.1 0 0);
--card: oklch(0.99 0 0);
--card-foreground: oklch(0.1 0 0);
--primary: oklch(0.1 0 0);
--primary-foreground: oklch(0.98 0 0);
--secondary: oklch(0.94 0 0);
--muted: oklch(0.92 0 0);
--muted-foreground: oklch(0.45 0 0);
--accent: oklch(0.94 0 0);
--destructive: oklch(0.577 0.245 27.325);
--border: oklch(0.88 0 0);
--input: oklch(0.94 0 0);
--ring: oklch(0.1 0 0);
```

### Practical Palette

- Page background: near-white neutral, `bg-background`.
- Main text: near-black, `text-foreground`, `text-black`, or `text-slate-900` inside data cards.
- Secondary text: `text-muted-foreground`, `text-zinc-600`, `text-slate-500`, or `text-slate-600`.
- Card surface: `bg-card` or `bg-white`.
- Borders: `border-border`, `border-zinc-200`, `border-zinc-300`, or `border-input`.
- Primary button: black/foreground background with white/background text.
- Secondary button: transparent or white with border.
- Hover background: very light gray such as `hover:bg-zinc-50` or `hover:bg-accent`.

### Data And Status Accents

Use color accents sparingly for financial meaning:

- Success/positive: emerald or teal, such as `text-emerald-600`, `bg-emerald-50`, `from-emerald-400 to-teal-500`.
- Informational: blue, such as `#3b82f6`, `#60a5fa`, `from-blue-100 to-blue-200`.
- AI or subscriptions: violet/purple, such as `#8b5cf6`, `from-violet-100 to-purple-200`.
- Warning/bills: amber/orange, such as `#f59e0b`, `from-amber-400 to-orange-500`.
- Danger/critical: destructive token, red, rose, or pink.
- Neutral chart bars: `#e2e8f0`.

Do not turn the whole interface blue, purple, green, or gradient-heavy. Accent colors should support data and status, not dominate the page.

## 7. Typography

The app defines:

```css
--font-sans: "Inter", "Inter Fallback", system-ui, sans-serif;
--font-serif: "Playfair Display", "Georgia", serif;
--font-mono: "Geist Mono", "Geist Mono Fallback";
```

### Current Type Pattern

- Body and UI text use `font-sans`.
- Main editorial headings often use `font-serif`.
- Large background brand words use bold sans with tight tracking.
- Labels use small uppercase text with wide tracking.
- Numbers use light or bold sans depending on importance.

### Recommended Scale

Marketing hero:

```txt
Hero H1: text-[3.5rem] to text-[8.5rem], font-serif, font-normal, leading-tight
Large brand word: text-[20vw] to text-[28vw], font-bold, tracking-tighter, leading-none
Section H2: text-4xl md:text-5xl, font-serif, font-normal
Body intro: text-lg, leading-relaxed, text-muted-foreground
```

Product/dashboard:

```txt
Page H1: text-3xl md:text-4xl, font-serif or font-sans, font-normal/medium
Panel title: text-lg, font-semibold
Card label: text-sm, font-medium, text-slate-700 or text-muted-foreground
Metric: text-3xl to text-7xl depending on prominence
Table/list text: text-sm
Caption: text-xs, uppercase, tracking-wider
```

Auth pages:

```txt
Auth title: text-4xl md:text-5xl, font-serif, font-normal
Auth subtitle: text-sm or text-base, text-muted-foreground, leading-relaxed
Form labels: text-sm, font-medium
Input text: text-base on mobile, md:text-sm
Legal/help text: text-xs or text-sm, text-muted-foreground
```

## 8. Layout System

### Containers

Use these widths consistently:

- Main marketing sections: `max-w-7xl mx-auto px-6`.
- Narrow text/FAQ sections: `max-w-4xl mx-auto px-6`.
- Supporting copy: `max-w-2xl mx-auto`.
- Auth form panels: `max-w-md` or `max-w-lg`.
- Dashboard content: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.

### Spacing

Current landing sections are spacious:

- Major sections: `py-32 px-6`.
- Medium sections: `py-24 px-6`.
- Section heading bottom margin: `mb-16` or `mb-20`.
- Card grid gaps: `gap-6`, `gap-8`, `gap-12`, `gap-16`.
- Card padding: `p-6` or `p-8`.

Dashboard pages should be denser:

- Page shell: `py-8` to `py-10`.
- Dashboard grid gap: `gap-4` or `gap-6`.
- Metric card padding: `p-5` or `p-6`.
- Tables and lists should favor scanability over large empty space.

### Grids

Common patterns:

- Marketing split section: `grid lg:grid-cols-2 gap-16 items-center`.
- Three feature cards: `grid md:grid-cols-3 gap-8`.
- Stats: `grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16`.
- Feature checklist: `grid sm:grid-cols-2 gap-4`.
- Dashboard summary: `grid gap-4 md:grid-cols-2 lg:grid-cols-4`.
- Dashboard main area: `grid gap-6 lg:grid-cols-[2fr_1fr]`.

## 9. Shape, Borders, And Shadows

The system uses rounded shapes, but the radius depends on context:

- UI primitives: `rounded-md`, matching shadcn defaults.
- Inputs/buttons: `rounded-md` for standard forms, `rounded-full` for marketing CTAs.
- Data cards: `rounded-xl` or `rounded-2xl`.
- Image-led marketing cards: `rounded-3xl`.
- Header shell: `rounded-2xl`.
- Pills/badges: `rounded-md`, `rounded-lg`, or `rounded-full`.

Use subtle borders:

- Default: `border border-border`.
- Header: `border border-zinc-200`.
- Open accordion emphasis: `data-[state=open]:border-foreground/30`.

Use soft shadows only on cards that need elevation. Current custom card shadow:

```css
rgba(14, 63, 126, 0.04) 0px 0px 0px 1px,
rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px,
rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px,
rgba(42, 51, 70, 0.04) 0px 6px 6px -3px,
rgba(14, 63, 126, 0.04) 0px 12px 12px -6px,
rgba(14, 63, 126, 0.04) 0px 24px 24px -12px
```

For standard UI, use existing `shadow-sm`, `shadow-md`, or the `Card` component default.

## 10. Component Patterns

### Buttons

Standard buttons come from `frontend/components/ui/button.tsx`.

Variants:

- `default`: primary black button.
- `outline`: bordered secondary button.
- `secondary`: muted neutral button.
- `ghost`: low emphasis action.
- `destructive`: destructive action.
- `link`: text link button.

Marketing CTAs often use a custom pill pattern:

```tsx
<button className="relative flex items-center justify-center gap-0 bg-foreground text-background rounded-full pl-6 pr-1.5 py-1.5 transition-all duration-300 group overflow-hidden">
  <span className="text-sm pr-4">Upload Transactions</span>
  <span className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
    <ArrowUpRight className="w-4 h-4 text-foreground" />
  </span>
</button>
```

Use icons from `lucide-react`. Common current icons include arrows, menu, close, check, chart/status, and social icons.

### Inputs And Forms

Use `Input`, `Label`, `Button`, `Checkbox`, `Alert`, and form primitives from `frontend/components/ui`.

Input style:

- Height: `h-9`.
- Radius: `rounded-md`.
- Border: `border-input`.
- Focus: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`.
- Invalid: `aria-invalid:border-destructive`.

Auth forms should be clean and direct:

- Label above each field.
- Muted helper/error text under fields.
- Full-width primary submit button.
- Optional social login as outline buttons.
- Keep legal/security notes small and muted.

### Cards

Use `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter` for standard app surfaces.

Use custom cards only when building rich visualization cards with charts, images, or animated financial summaries.

Current card language:

- `bg-card` or `bg-white`.
- `rounded-xl`, `rounded-2xl`, or `rounded-3xl`.
- Subtle border or soft custom shadow.
- `p-6` or `p-8`.
- Text hierarchy: title, muted subtitle, metric, supporting rows.

Do not nest cards inside cards unless it is clearly a repeated item inside a larger dashboard widget.

### Badges And Pills

Use badges for category/status metadata:

- Positive categories: `bg-emerald-50 text-emerald-700`.
- Neutral extras: `bg-slate-100 text-slate-700`.
- Trust/status: small rounded pills with icon and text.
- Large marketing badges can use `rounded-full`, but dashboard badges should remain compact.

### Accordion

Use the existing accordion component for FAQ and expandable settings. Current FAQ items use:

```txt
bg-card border border-border rounded-xl px-6
trigger: text-base font-medium py-5
content: text-sm text-muted-foreground leading-relaxed
```

### Navigation

Header pattern:

- Fixed at top.
- `max-w-7xl mx-auto`.
- Glass surface: `bg-white/70 backdrop-blur-xl border border-zinc-200`.
- Rounded shell: `rounded-2xl`.
- Desktop nav uses small muted links.
- Mobile nav collapses behind `Menu` and `X` icons.
- Primary nav CTA uses rounded pill button with arrow icon transition.

Dashboard navigation should reuse the neutral shell but be more functional:

- Use sidebar primitives for complex dashboards.
- Active items should use `bg-sidebar-accent text-sidebar-accent-foreground`.
- Keep icons at `size-4`.

## 11. Imagery And Media

The current landing page relies heavily on media:

- Full-screen hero video.
- Large product/phone preview image.
- Feature image panels with dark overlays.
- Image cards with gradient overlays.
- Footer background image.

Rules:

- Marketing pages should include real visual assets or product-like visuals.
- Auth pages can use a split layout with a product preview, financial chart card, or cropped brand image.
- Dashboard pages should prioritize live product UI over decorative imagery.
- Use dark overlays on photos when white text sits on top: `bg-black/20` or gradient overlays from black to transparent.
- Images should be `object-cover`, stable aspect ratio, and clipped with rounded corners.

Keep visual card language aligned with Spendly finance content. New pages should not include unrelated product language.

## 12. Motion And Interaction

Current motion style:

- Smooth scrolling on the whole document.
- Hero media scales and rounds while scrolling.
- Content fades/slides into place on load or viewport entry.
- Counters count up with eased animation.
- Horizontal carousels auto-scroll and slow/pause on hover.
- Charts update gently.
- Hover states use subtle scale, x-offset, color, or background changes.

Use motion to communicate liveliness and state change, not to distract.

Recommended timing:

- Simple hover transition: `duration-300`.
- Section reveal: `duration-600` to `duration-1000`.
- Large hero reveal: `duration-[1500ms]`.
- Chart/data refresh: 2 to 4 seconds only for demo/marketing visuals.

Use `framer-motion` for complex reveal/animated card behavior. Use Tailwind transitions for simple hover/focus changes.

## 13. Charts And Data Visualization

The app uses Recharts.

Current chart colors:

```txt
Food & Dining: #3b82f6
Housing & Rent: #10b981
Subscriptions: #8b5cf6
Bills & Utilities: #f59e0b
Neutral bars/grid: #e2e8f0
Axis muted text: #64748b
Positive trend: emerald-600
Negative trend: red-600
```

Chart cards should use:

- White surface.
- Rounded 2xl/3xl corners.
- Soft shadow.
- Clear title and period.
- Large primary metric.
- Muted labels.
- Compact legends.
- Minimal axes and grid lines.

For dashboard charts, avoid fake constant animation. Use real state changes, loading states, filters, and empty states.

## 14. Page Recipes

### Login Page

Use a calm two-column auth layout on desktop and single-column on mobile.

Recommended structure:

- Fixed or simple top brand row with Spendly logo.
- Left side: auth form in `max-w-md`.
- Right side on desktop: product preview card, chart card, or image panel.
- Title: "Welcome back" or "Log in to Spendly".
- Subtitle: one muted sentence about financial dashboard access.
- Fields: email, password.
- Secondary row: remember me, forgot password.
- Primary action: full-width black button.
- Optional secondary action: outline button for OAuth.
- Bottom copy: link to register.
- Trust note: encrypted/private data message in muted small text.

Suggested classes:

```txt
min-h-screen bg-background
grid lg:grid-cols-2
px-6 py-8
max-w-md mx-auto w-full
font-serif text-4xl md:text-5xl font-normal
space-y-5
```

### Register Page

Follow the login layout, but focus on getting started quickly.

Recommended fields:

- Name.
- Email.
- Password.
- Confirm password.
- Terms checkbox.

Use a concise right-side benefit list:

- Auto-categorize spending.
- Track financial health.
- Detect subscriptions.
- Ask AI finance questions.

Use green/emerald check icons for benefits, matching the current features checklist.

### Dashboard Page

Dashboard should be denser than the landing page.

Recommended structure:

- App shell with sidebar or compact top nav.
- Page header with title, date range, import button, and settings/action menu.
- First row: financial health score, income, expenses, savings rate.
- Second row: spending breakdown chart and insights panel.
- Third row: budgets/goals and subscriptions.
- Bottom: recent transactions table with filters.

Recommended card patterns:

```txt
Metric card: Card + p-5 + rounded-xl + border-border
Large metric: text-3xl font-semibold
Small label: text-sm text-muted-foreground
Positive delta: text-emerald-600
Negative delta: text-red-600
Warning: text-amber-600
```

### Transaction Import Page

Recommended structure:

- Page title and short explanation.
- Upload dropzone card.
- Supported file notes: CSV/manual entry.
- Preview table after upload.
- Categorization status badges.
- Primary action: import transactions.
- Secondary action: download a sample CSV or enter manually.

Use clear empty/loading/error states.

## 15. Accessibility And States

Keep these behaviors:

- Every interactive element must have a visible focus ring.
- Buttons and links need clear hover states.
- Inputs must expose invalid state using `aria-invalid`.
- Icons used alone need accessible labels.
- Text must maintain strong contrast against images and overlays.
- Mobile nav must be keyboard and touch friendly.
- Loading states should use skeleton/spinner components.
- Empty states should tell the user what action to take next.

## 16. Implementation Rules

When creating new pages:

- Use semantic CSS variables before hard-coded colors.
- Use `cn()` from `frontend/lib/utils.ts` for conditional classes.
- Use existing shadcn/ui components from `frontend/components/ui`.
- Use `lucide-react` icons.
- Use `next/image` for local images where possible.
- Use `font-serif` for marketing/auth display headings.
- Use `font-sans` for dashboard headings, labels, tables, and controls unless a page needs editorial emphasis.
- Keep section layouts full-width, with constrained inner content.
- Keep dashboard surfaces practical and scannable.
- Avoid decorative gradients except small data/status accents.
- Avoid introducing another color theme without updating tokens.
- Do not create new UI primitives unless the existing set cannot support the page.

## 17. AI Page Generation Prompt

Use this prompt when asking Styler or another UI generation tool to create Spendly pages:

```txt
Create a Spendly page using the existing Spendly design language: a calm premium fintech interface, light neutral background, near-black text, white/card surfaces, subtle borders, soft shadows, Inter body text, Playfair Display for large editorial headings, shadcn/ui new-york components, lucide-react icons, Tailwind CSS semantic tokens, and restrained financial accent colors.

Use bg-background, text-foreground, bg-card, text-muted-foreground, border-border, bg-primary, and text-primary-foreground. Primary actions should be black/foreground with white/background text. Secondary actions should be outlined or ghost. Use emerald for positive financial states, amber for warnings, red/destructive for errors, blue/violet/amber/emerald only inside charts, category markers, or status chips.

Layout should be spacious for marketing/auth pages and denser for dashboard pages. Use max-w-7xl containers, rounded-xl to rounded-3xl cards, p-6/p-8 card padding, small uppercase labels when needed, and subtle hover/focus transitions. Do not make the design colorful, playful, crypto-like, or gradient-heavy. Reuse shadcn/ui primitives and lucide icons.
```

## 18. Quick Do And Do Not

Do:

- Keep the interface light, neutral, and calm.
- Use high contrast black/white actions.
- Use accent colors for meaning.
- Use soft cards and clear spacing.
- Make finance data readable first.
- Reuse existing UI primitives.
- Add polished but restrained motion.

Do not:

- Use loud gradients as the main background.
- Overuse purple, blue, or green.
- Add decorative blobs or unrelated illustrations.
- Build dashboard pages like marketing landing pages.
- Hide important financial data behind animation.
- Create one-off button/input/card styles without reason.
- Use unrelated product language in new Spendly pages.
