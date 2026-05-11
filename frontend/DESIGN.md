# AgriForecast Design System

This project uses a restrained, operational SaaS interface for agricultural supply-chain work. The UI should feel like production software: clear hierarchy, low visual noise, reliable controls, and role-aware entry points for farmers, retailers, and distributors.

## Principles

- Prefer dense, scannable information over decorative marketing layouts.
- Use icons to identify actions and roles, not as decoration.
- Keep copy specific and avoid unverifiable metrics, fake team names, and placeholder promises.
- Use cards for repeated objects, forms, and dashboard panels. Avoid nested cards.
- Every public portal link should route to a real sign-in or sign-up page.

## Tokens

- Background: `#f6f7f9`
- Surface: `#ffffff`
- Text: `#0f172a`
- Muted text: `#64748b`
- Border: `#e2e8f0`
- Primary: `#047857`
- Primary dark: `#065f46`
- Distributor accent: `#2563eb`
- Warning: `#d97706`
- Danger: `#dc2626`

## Typography

- Font family: system UI stack.
- Hero: 48-72px, semibold, tight line-height.
- Page heading: 32-44px, semibold.
- Section heading: 28-36px, semibold.
- Body: 14-18px, regular, 1.6 line-height.
- UI labels: 12-14px, medium or semibold.

## Components

- Buttons: 8px radius, 44px minimum height, clear hover/focus states.
- Inputs: 8px radius, 44px minimum height, visible labels, icon-leading only when useful.
- Cards: 8px radius, 1px border, subtle shadow only where it improves separation.
- Navigation: fixed top bar, white surface after scroll, all links must resolve.
- Auth pages: split layout on desktop with a plain left context panel and a focused form panel.

## Motion

- Use short fade/slide transitions only. Avoid bouncing, spinning, or novelty effects.
- Interactive controls should feel immediate: 150-250ms transitions.
