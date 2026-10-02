# Dushyant & Preeti — Wedding Invitation

Static site: no build step. Deploy the folder to Vercel as-is (`vercel` CLI or drag-and-drop / Git import, framework preset "Other").

## Editing
All names, dates, venue, maps link, WhatsApp number, story, events and gallery live in
`weddingConfig` at the top of `js/script.js`.

## Photos & music
Drop files into `assets/` using the names in the config:

- `assets/music.mp3` — background music (the music button stays hidden if the file is missing)
- `assets/images/hero.jpg` — optional; shown through the palace arch on the opening screen
- `assets/images/couple-1..4.jpg`, `haldi.jpg`, `mehendi.jpg`, `sangeet.jpg`, `wedding.jpg`

Any missing image shows an elegant floral placeholder, so the site never looks broken.

For speed, export photos around 1600px on the long side and compress them
(e.g. squoosh.app → WebP, quality ~75). You can use `.webp` files directly; just update the paths in the config.

## Local preview
```
python3 -m http.server 5173
```
then open http://localhost:5173
