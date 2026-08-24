# Project media

## Folders

| Path | Who manages it |
|------|----------------|
| `<project>/originals/` | **Chris only** — agents never read or write here |
| `public/projects/<slug>/` | Site-served PNGs — agents may rename/add when asked (no pixel edits) |

## Multi-size delivery (no source edits)

Files in `public/` stay full resolution on disk. **`next/image`** serves optimized WebP/AVIF derivatives per surface via `src/lib/project-media-sizes.ts`:

| Surface | Typical request width |
|---------|----------------------|
| Project card | ~400px |
| Gallery carousel | ~760px |
| Lightbox | ~88vw (up to source width) |

Cached by Next.js in `.next/cache` — originals on disk are never modified.

## Toucan website gallery (5 slides)

1. `1-homepage-hero.png`
2. `2-onboarding-language.png`
3. `3-onboarding-tutorial.png` (3456×1924 master)
4. `4-extension-permission.png` (3456×1926 master)
5. `5-account-settings.png` (3456×1924 master)

Wire paths in `src/lib/projects.ts`.
