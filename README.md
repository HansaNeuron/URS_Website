# Ultimate Recycling Solutions: redesigned website

A static site with 13 pages: the 12 existing pages plus a new **Ferrous metals** page at `/services/ferrous`. It's plain HTML, CSS and JS with no build step or framework needed to host it.

## Deploying
- Upload everything in this folder to the web root.
- Each page is `folder/index.html`, so the URLs stay the same as now (`/about`, `/services/non-ferrous` and so on). Most hosts serve `/about` from `about/index.html` automatically. On nginx, use `try_files $uri $uri/ =404;`.
- **Logo:** the new globe logo is included at `/assets/images/urs-logo-v4.png`. A 512px version for search results, a browser tab icon and a phone home-screen icon are in the same folder. The old `logo-urs-emblem.png` is no longer used.
- Pick **one** domain version (`www.ultimate-rs.com`) and 301-redirect `ultimate-rs.com` to it. All canonical tags use `www`.
- Submit `sitemap.xml` in Google Search Console.

## Before going live
1. **Fill in every yellow "To add" / "Confirm" marker.** Search the HTML for `class="ph` to find them all. They cover licence and registration numbers, company and VAT numbers, address, hours, pricing basis, payment terms, testimonials, case studies, stats and photos. Remove each `<span class="ph">` wrapper once its text is real.
2. **Replace the photo placeholders** (`<div class="photo">`) with real photos of your bins, vehicles, yard and team.
3. **Connect the quote form.** In `assets/site.js`, set `FORM_ENDPOINT` to the URL that processes the form, for example the current site's contact handler. Until then the form only shows a "not connected" message. The form sends `name, company, email, phone, postcode, material, volume, frequency, message, consent`, plus a hidden spam-trap field called `website`, which should be rejected if it's filled in. The old site used a CAPTCHA. Keep server-side spam protection in place.
4. **Google Analytics:** set `GA_ID` in `assets/site.js`. GA only loads after a visitor clicks *Accept analytics*.
5. **Privacy page:** have it checked against how you actually handle data.
6. **Email address:** consider switching `fedge@` to `info@` or `sales@`. Change `EMAIL` in `build.py` and rebuild, or find and replace it in the HTML.
7. **Social sharing image:** links shared on LinkedIn, WhatsApp and similar now show the hero photo.
8. **Map:** the contact page links to Google Maps for Sunderland Road, Sandy. To embed a live map on the real site, swap the map card for a Google Maps embed.

## Icons and artwork
- Icons are from Phosphor Icons (duotone style, MIT licence). They're inlined into each page, so there are no extra files to host.
- The metal "studio shot" artwork is SVG drawn by `build.py`. It's a stand-in until real photos exist. Each photo slot is marked "Replace with your photo". Swap these for real photos as soon as you have them, since genuine photos of your bins, vehicles and team build the most trust.
- To rebuild, install the icons first: `npm install @phosphor-icons/core@2`. Then set `PHOSPHOR=node_modules/@phosphor-icons/core/assets` and run `python3 build.py`.

## Editing
- The design tokens (colours, fonts) are at the top of `assets/site.css` as CSS variables. The exact brand colours couldn't be read from the live site, so adjust `--steel` and `--copper` to match the logo if needed.
- To change content across all pages, edit the generator script (`build.py`, kept outside this folder) and rerun `python3 build.py`. Small text edits can also be made directly in the HTML.
