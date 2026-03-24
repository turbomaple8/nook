# Nook — Co-Living in London

## Project Overview
Nook is a co-living marketing website for furnished shared rooms in London. It's a **static HTML/CSS/JS site** — no frameworks, no build step, no server-side logic.

**Live URL:** https://nookrent.com
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
├── sitemap.xml                 # XML sitemap for search engines (all 27 pages)
├── robots.txt                  # Crawl directives + sitemap reference
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

## SEO Infrastructure

### Meta Tags (all 27 pages)
- Canonical URLs pointing to `https://nookrent.com/{page}`
- Open Graph tags: type, site_name, title, description, url, image, locale (en_GB)
- Twitter Card tags: summary_large_image with title, description, image
- Google Fonts preconnect (`fonts.googleapis.com` + `fonts.gstatic.com`)

### Structured Data (JSON-LD with @id graph)
- **Homepage:** Organization + LocalBusiness + FAQPage (6 items)
- **FAQ page:** FAQPage schema (all 12 Q&A pairs)
- **Room pages (16):** Accommodation schema (name, address, price in GBP/WEEK, provider @id link) + BreadcrumbList
- **Blog posts (3):** BlogPosting (with @id, isPartOf, mainEntityOfPage) + BreadcrumbList
- **Rooms listing:** BreadcrumbList
- All schemas use `@id` references to connect entities (e.g., rooms link to `/#organization`)

### Crawl & Indexing
- `sitemap.xml` - lists all 27 pages with priority, lastmod, changefreq
- `robots.txt` - allows all, blocks `.vercel/` and `.git/`, references sitemap

### Performance
- `loading="lazy" decoding="async"` on all non-LCP images
- LCP images (hero, main gallery) are NOT lazy-loaded to preserve paint speed

### Adding a New Room (SEO checklist)
1. Copy an existing `room-*.html` file
2. Update content, images, price, address
3. Update the `<link rel="canonical">` href to the new filename
4. Update all OG and Twitter meta tags (title, description, url, image)
5. Update both JSON-LD blocks (Accommodation data + BreadcrumbList name)
6. Add the page to `sitemap.xml`
7. Add a `.room-card` in `rooms.html` with correct `data-area` and `data-type`

### Adding a New Blog Post (SEO checklist)
1. Copy an existing `blog-*.html` file
2. Update content, meta tags, title, and canonical URL
3. Update all OG and Twitter meta tags
4. Update BlogPosting JSON-LD (@id, headline, description, image, dates)
5. Update BreadcrumbList JSON-LD (last item name)
6. Add the page to `sitemap.xml`
7. Add a card linking to it in `blog.html`

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
