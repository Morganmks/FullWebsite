# Where to put your media

Everything is wired to these exact filenames. Drop a file in and it appears —
no code changes. Anything missing falls back cleanly, so a half-filled folder
never looks broken.

```
assets/
  home/
    gym-floor.jpg       ← the illustrated gym scene behind the home page (16:9)
  guides/
    slasher.png         ← the five figures standing on that scene
    cornerwoman.png
    stoic.png
    sleeper.png
    joker.png
  hero/
    hero-desktop.jpg    ← STILL key art for the Press Start screen (760px+)
    hero-mobile.jpg     ← STILL key art for phones (portrait crop)
    hero.mp4            ← menu video, 760px and up
    hero-mobile.mp4     ← menu video for phones (smaller + shorter)
  audio/
    select.mp3          ← the Press to Start sound
  fighters/
    slasher.jpg         ← portrait art, one per archetype
    stoic.jpg
    joker.jpg
    sleeper.jpg
    slasher.mp4         ← optional looping portrait for the result screen
    stoic.mp4
    joker.mp4
    sleeper.mp4
```

`home/` and `guides/` feed the new gym-floor home page; everything below `hero/`
belongs to the quiz at `/quiz/`. Both are probed the same way — `.png`, `.webp`,
`.jpg` and `.jpeg` are all tried, so the export format doesn't matter.

## The gym floor

`gym-floor.jpg` — **16:9**, ~2560×1440. Until it exists the page draws a dark
gradient in its place and the five figures still sit in their marks, so the
layout can be tested before the art is finished.

- The five zones the characters stand in, left to right: heavy bags (foreground
  left), the ring (back left), the retro TV (centre back), the couch (back
  right), the clothing rack (right).
- **Leave those five spots readable.** No busy detail exactly where a figure
  will stand — the figure covers it and the collision reads as mud.
- Ship it clean and dark-graded. The page adds no grade of its own here.
- JPG at quality ~80, under ~600 KB.

## The five guides

All five now have real art, delivered as `1.png`–`5.png` and installed under
their names: 1 = cornerwoman, 2 = slasher, 3 = stoic, 4 = sleeper, 5 = joker.
They were trimmed to the figure and scaled to 900px tall; the untouched
originals sit in `guides/_masters/`, which is gitignored. See
`guides/README.md` for the why.

Filenames must match these ids exactly: `slasher`, `cornerwoman`, `stoic`,
`sleeper`, `joker`. A wrong name silently leaves the black placeholder up.

- **PNG or WebP on transparency.** No background, no drop shadow baked in.
- Cropped tight, and **the figure must touch the bottom edge of the file** —
  the layout stands each character on that edge, so any empty pixels below the
  feet make them hover above the floor.
- Full body. Roughly 500×900 is plenty; they render between about 12% and 55%
  of the scene height depending on how far into the room they stand.
- Under ~500 KB each; the current five total ~1.9 MB.

Sleeper is drawn reclining rather than standing, for the couch — his bottom
edge is his lower body, and his `y` seats him instead of standing him on the
floor.

### Re-positioning them

Positions live in one block at the top of `site.js` (`GUIDES`) as percentages of
the scene — `x` is the horizontal centre, `y` is where the feet land, and `h` is
the figure's height (width follows the art's own proportions). To re-measure
against the finished art, open the home page with `?tune` on the URL:

```
longuard.shop/?tune
```

That opens straight onto the gym floor, skipping the attract screen. Every
figure gets an outline, you drag them onto their marks (shift-drag or arrow
keys to resize), and the panel in the corner prints the exact numbers to paste
back into `GUIDES`. Tune mode only loads when that query string is present — it
never ships to visitors.

## The home page's three stages

The home page is one screen with three states, held as a class on `<body>`:
`stage-attract` (hero still, "Press to Start"), `stage-menu` (the hero video
with the menu over it), and `stage-gym` (this illustrated floor). The menu
items live in `HOME_MENU` at the top of `site.js`. The attract beat is skipped
for the rest of the session once someone has pressed start, so coming back from
a section lands on the menu rather than replaying the title card.

The hero still and video are the quiz's own files in `hero/` — the two pages
share them, so replacing one replaces both.

## Hero stills

The Press Start screen holds a single frame, the way a console title screen
opens on key art. It drifts slowly (a held-camera Ken Burns move) and picks up a
rain layer, vignette and grain — **all applied in CSS**, so ship the clean
original. Don't pre-darken or pre-texture the file; the page will over-darken it.

- `hero-desktop.jpg` — landscape or square-ish, ~2400px wide. Subject sits right
  of centre; the left half carries the headline.
- `hero-mobile.jpg` — portrait crop, ~1400×2000. Subject high in the frame, since
  the lockup sits across the middle.
- JPG, quality ~80. Keep each under ~600KB.

## Hero video

Plays behind the menu from the moment someone presses start. **Currently shipped:**

| File | Size | Resolution | Length |
|---|---|---|---|
| `hero.mp4` | 13 MB | 1280×720 | 15s |
| `hero-mobile.mp4` | 4.5 MB | 640×360 | 15s |

Both carry their AAC audio track — **this is the only soundtrack**. The speaker
toggle unmutes it. The Press to Start screen is a still, so there is deliberately
no audio there beyond the click; sound begins when the menu video does.

**Keep every file in this repo under 25 MB.** GitHub refuses any file over 100 MB
outright and its web uploader stops at 25 MB, so a single oversized file blocks
the entire push — which is exactly what a 121 MB source did once already. Master
files live outside the project, in `~/Documents/Claude/longuard-video-sources/`.

### Re-encoding from a master

`avconvert` ships with macOS and needs no install. Its presets are fixed-quality
with no bitrate control, so **length is the lever, not compression** — trimming
keeps every frame at full quality, where dropping the bitrate would not.

```
cd ~/Documents/Claude/longuard-video-sources
avconvert -s sm.quiz.hero.mp4 -p Preset1280x720 --duration 15 -o hero.mp4 --replace
avconvert -s sm.quiz.hero.mp4 -p Preset640x480  --duration 15 -o hero-mobile.mp4 --replace
```

Roughly 0.9 MB per second at 720p and 0.3 MB per second at 360p, so a 20-second
desktop cut lands near 18 MB. Other presets, measured on this footage at 15s:
`Preset960x540` 8.8 MB, `PresetAppleM4VWiFi` 1.2 MB but only 480×272.

If you install HandBrake you get real bitrate control and can hold 720p for the
full 29 seconds at around 5 MB — RF 26, web-optimised, audio at 96 kbps.

### Shooting for it

- **Loop-friendly.** The cut from the last frame back to the first is visible;
  start and end on similar framing.
- **No bright action in the lower left** — the headline and menu sit there.
- **Graded dark.** The page adds its own grade, vignette, grain and a left-side
  fade to black on top.

## Fighter portraits

- **3:4 portrait**, roughly 900×1200. JPG unless you need transparency —
  the four shipped files are 1200px JPGs at 190–315 KB each.
- The filename must match the archetype exactly: `slasher`, `stoic`, `joker`,
  `sleeper`. A file named `slash.jpg` silently falls back to a placeholder.
- Framed head-and-shoulders to mid-torso, subject centered.
- **They get obscured before they're earned.** In the roster, locked cards are
  grayscaled, darkened and blurred — you can sense a figure, not read a face — so
  a strong overall shape (hood, stance, shoulders) matters more than fine detail.
- Keep backgrounds dark; the card sits on near-black.

## Optional fighter video

If you have a short loop per archetype, drop `slasher.mp4` etc. alongside the
PNGs and the result screen plays it instead of the still. Same rules as the hero:
3–8s seamless loop, no audio, under 2MB, 3:4 framing. The PNG stays as the poster
frame, so always ship both.
