# Responsive Website Previewer

Paste a URL and see the site rendered in phone, tablet, laptop and desktop viewports side by side. Built with **Next.js (App Router), TypeScript and Tailwind CSS**, with Lucide icons.

## Quick start

Requires Node.js 18.18 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
npm run typecheck  # optional: tsc --noEmit
```

## Using it

1. Type or paste an address (`example.com`, `https://example.com`, `localhost:5173`) and press **Preview** (or Enter). `https://` is added automatically; `http://` is used for `localhost` and IP addresses.
2. Four devices open by default: iPhone 14 Pro (393 × 852), iPad Mini (768 × 1024), MacBook Pro (1440 × 900) and Desktop monitor (1920 × 1080).
3. Use the toolbar above each device:

| Control | What it does |
| --- | --- |
| Device name ▾ | Switch that preview to another preset or a custom size |
| Rotate | Swap width and height (phones, tablets, custom sizes). Independent per device |
| Reload | Reload only this preview |
| 50 / 75 / 100 / Fit | Zoom this preview. **Fit** shares one scale across all fitted devices |
| Full screen | Show this preview scaled to the whole screen (Esc to exit) |
| Open in new tab | Open the original site |
| Camera | Capture a PNG of the preview (see notes) |
| ✕ | Remove the device |

Top bar: refresh all, **Add device** (presets or a custom width × height), zoom-all-to-fit, reset layout, compact layout, dark/light workspace theme.

Device selection, orientation, zoom, theme, compact mode and the last URL are stored in `localStorage` (key `rwp:v1`).

## How previews work

- Each preview is a native `<iframe>` with its **real CSS viewport size** (e.g. 393 × 852). It is made smaller on screen with a CSS `transform: scale()` on a wrapper, so the site's media queries always see the true device size. Zoom and layout changes never reload an iframe.
- Rotating changes the iframe's width/height (animated), so the page responds to the new viewport without a reload.
- Overlays (loading spinner, errors) sit outside the scaled layer, so they stay readable at any zoom.

### Sites that refuse to be embedded

Many sites send `X-Frame-Options` or a CSP `frame-ancestors` directive that tells browsers not to show them in frames. This is a deliberate security setting and **this app does not try to bypass it**.

When you submit a URL, the server route `GET /api/check` reads the page's response headers (no body) and reports whether framing is forbidden. If so, each preview shows a clear "This site doesn't allow embedding" message with the exact header, plus **Open in new tab** and **Retry**. A blocked site is never described as broken.

Other explained states: site unreachable (with "Try loading anyway"), slow load (20 s timeout), and HTTPS-page-embedding-HTTP-site (mixed content blocked by the browser).

### Header-check endpoint and private networks

`/api/check` makes a server-side request, so to prevent misuse when deployed publicly it refuses to fetch private, loopback and link-local addresses **in production**. In `npm run dev` they are allowed so you can preview local projects. To allow them in a production build (for example when self-hosting on your own network):

```bash
ALLOW_PRIVATE_HOSTS=true npm start
```

When a private address is skipped, the preview still loads in the iframe; you just don't get the friendly explanation if that site blocks framing.

## Notes and limits

- **Screenshots**: browsers do not let a page read pixels from a cross-origin iframe, so the camera button uses the Screen Capture API. Your browser will ask permission; choose **This tab**. Chrome/Edge crop precisely using Region Capture; other browsers crop by position and need the preview fully visible. Safari and some mobile browsers don't support it, and the app says so.
- **Full screen** uses the browser Fullscreen API on the individual preview.
- Some sites detect framing in JavaScript or behave differently when embedded; that is up to the site.
- Iframes use a `sandbox` that allows scripts, forms, popups, modals and downloads but not top-level navigation, so a page can't redirect the previewer away.

## Project structure

```
app/
  api/check/route.ts      Header check (X-Frame-Options / CSP frame-ancestors)
  layout.tsx, page.tsx, globals.css
components/
  PreviewApp.tsx          App shell: URL submit flow, dialogs, wiring
  URLToolbar.tsx          Address bar, Preview/refresh, workspace controls
  PreviewWorkspace.tsx    Scrollable workspace, measures space, computes fit scales
  DevicePreview.tsx       One device: frame, iframe, overlays, full screen, screenshot
  DeviceToolbar.tsx       Per-device controls
  DevicePresetSelector.tsx  Accessible preset menu (portal, keyboard navigation)
  CustomViewportDialog.tsx  Accessible modal for custom width × height
  PreviewErrorState.tsx   Explained error states
  IconButton.tsx
hooks/
  useWorkspace.ts         Device/prefs state (reducer) + localStorage
  useEmbedCheck.ts        Calls /api/check once per submit
  usePreviewLoader.ts     Per-iframe loading / error / retry state machine
lib/                      Preview engine and helpers (no React)
  preview-engine.ts       Viewport vs. visual size, fit-scale math
  devices.ts              Presets and device factories
  url.ts                  URL validation / normalization
  frame-policy.ts         Interprets framing headers
  screenshot.ts           Screen-capture based screenshots
  storage.ts              localStorage load/save with validation
  server/network.ts       Private-address detection for the API route
```

## Accessibility

All controls are real buttons with accessible names and visible focus rings. Menus and the dialog support Arrow keys, Home/End, Tab handling and Escape; the dialog traps focus and restores it on close. Loading and error overlays use `role="status"` / `role="alert"`, and animations respect `prefers-reduced-motion`.
