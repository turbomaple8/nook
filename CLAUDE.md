# Nook — Co-Living in London

## Project Overview
Nook is a co-living marketing website for furnished shared rooms in London. It's a **static HTML/CSS/JS site** — no frameworks, no build step, no server-side logic.

**Live URL:** https://nook-ten-theta.vercel.app
**Repo:** https://github.com/turbomaple8/nook
**Hosting:** Vercel (auto-deploys from `main` branch via GitHub integration)

## Architecture

### Tech Stack
- **Pure HTML/CSS/JS** — no framework, no bundler, no package.json
- **Fonts:** Nunito (headings) + Quicksand (body) via Google Fonts
- **Forms:** Web3Forms API for contact form submission
- **Deployment:** Vercel static site (output directory: `.`)

### Design System
- **Palette:** Warm earthy tones — cream (`#FFF8F0`), coral (`#E8855B`), sage (`#8BAF7C`), brown (`#6B4226`), amber (`#E9A94A`), lavender (`#C5A3D9`)
- **CSS naming:** BEM convention (e.g., `.nav__link`, `.btn--primary`, `.hero__title`)
- **CSS variables:** Defined in `:root` in `styles.css` — all colors, spacing, radii, and typography use custom properties
- **Animations:** Scroll-triggered fade-ins using IntersectionObserver in `script.js`

## File Structure

```
├── index.html                  # Homepage (hero, how-it-works, neighbourhoods, FAQ, CTA)
├── rooms.html                  # Listings page with filter buttons (area/type)
├── room-*.html                 # 16 individual room detail pages
├── about.html                  # About Nook page
├── contact.html                # Contact form (Web3Forms integration)
├── blog.html                   # Blog listing page
├── blog-*.html                 # 3 SEO blog posts
├── faq.html                    # Standalone FAQ page
├── privacy.html                # Privacy policy
├── terms.html                  # Terms of service
├── styles.css                  # Single stylesheet, all styles
├── script.js                   # Single JS file, all interactivity
├── listings-data.json          # Room data scraped from fllat.com (reference data)
└── .vercel/                    # Vercel project config (gitignored)
```

## Key Patterns

### Room Pages
- Named as `room-{type}-{location}.html` (e.g., `room-deluxe-canary-wharf.html`)
- Room types: Flex Basic, Flex Plus, Flex Premium, Deluxe, Master
- Locations: Canary Wharf, Central London, Islington, Dingley Road, South Quay
- Each has image gallery (thumbnail swap), amenities list, and apply modal

### Room Cards (rooms.html)
- Filterable by `data-area` and `data-type` attributes on `.room-card` elements
- Filter buttons use `.filter-btn[data-filter]` pattern

### Navigation
- Shared nav across all pages (copy-pasted, not templated)
- Hamburger menu for mobile with `.nav__hamburger` / `.nav__mobile-menu`
- Scroll effect: `.nav--scrolled` class added at 40px scroll

### Forms
- Contact form (`#contact-form`) submits to Web3Forms API
- Modal apply forms on room pages use demo submission (no backend)

## External Services
- **Web3Forms:** Contact form backend (API key in contact.html hidden input)
- **Unsplash:** Room/neighbourhood images (hotlinked via `images.unsplash.com`)
- **Google Fonts:** Nunito + Quicksand

## WhatsApp Contact
- Phone: +1 (857) 847-7814
- Email: info@nookrent.com

## Development Notes

### No Build Step
Just edit HTML/CSS/JS files directly. Push to `main` to deploy.

### Adding a New Room
1. Copy an existing `room-*.html` file
2. Update room name, description, images, amenities, price
3. Add a corresponding `.room-card` in `rooms.html` with correct `data-area` and `data-type` attributes

### Adding a Blog Post
1. Copy an existing `blog-*.html` file
2. Update content, meta tags, and title
3. Add a card linking to it in `blog.html`

### Modifying Styles
All styles in `styles.css`. Use existing CSS custom properties from `:root`. Follow BEM naming.

### Common Gotcha
Nav and footer are duplicated in every HTML file. Changes to shared elements must be applied to ALL files.
