# Gym floor background — generation prompt

The background this replaces was a sepia architectural line drawing. The five
character avatars are painted, cel-shaded, anime-adjacent illustration with
soft rendering and clean linework — the two don't sit together, so the room
reads as a sketch with painted people pasted onto it. This prompt targets the
avatars' style so they belong in the same picture.

**Constraints that are not stylistic — the layout depends on them:**

- **16:9, 2560×1440.** The page holds that ratio and crops from the sides on
  odd window shapes.
- **Empty room. No people, no figures, no silhouettes anywhere.** The five
  characters are separate transparent PNGs composited on top.
- The five zones, left to right, must stay uncluttered enough that a standing
  figure reads cleanly against them: heavy bags (left), the ring (centre
  back), a screen/TV (centre right), a lounge seat (right of centre), the
  retail wall (far right).

---

## The prompt

> A wide 16:9 interior illustration of a modern open-air Muay Thai gym at
> dusk, drawn in a clean cel-shaded anime style — crisp confident linework,
> flat-to-soft cel shading, restrained palette, the look of a high-end
> animated film background. Hand-drawn feel, not 3D, not photographic, not a
> technical or architectural sketch.
>
> The gym is contemporary and premium but rooted and authentic: an
> open-sided pavilion with a slim exposed steel roof structure, polished
> concrete floor, a clean tatami-grey mat area, and no walls on three sides so
> the tropical dusk reads straight through — palms and dense greenery in soft
> silhouette beyond the columns, warm low sun or early moon on the horizon.
> Warm practical lighting: a run of simple pendant bulbs and a few soft floor
> lamps, warm light against cool blue evening air.
>
> Left third: three or four heavy bags hanging from the ceiling in a clean row,
> with a low, tidy equipment rack beside them — pads and gloves neatly stored,
> not cluttered.
>
> Centre back: a full boxing ring on a raised platform, clean canvas, taut
> ropes, minimal corner posts. It sits far enough back to read as the anchor of
> the room, with clear floor in front of it.
>
> Centre right: a wall-mounted flat screen or a single retro monitor on a low
> console, angled toward a small viewing area.
>
> Right of centre: a low modern lounge — a long bench sofa or daybed with
> cushions, a rug, a floor lamp. Comfortable, sparse, considered.
>
> Far right: a **small** retail nook — **one single wall** of merchandise
> against the right edge only. A slim rail of hanging garments and two or three
> open shelves. It should occupy a narrow strip and NOT be a room, a building,
> or an enclosed storefront structure — the right side of the frame should stay
> open and airy, not boxed in.
>
> Empty room, no people, no figures, no silhouettes, no mannequins. Wide
> establishing shot, eye-level camera, one-point perspective with the vanishing
> point near centre. Muted warm neutrals — sand, bone, warm grey, weathered
> teak — against cool blue evening shadow. Understated, expensive, calm.
> Negative space in the foreground floor.

**Negative prompt:** people, person, figures, silhouettes, mannequins, crowd,
text, logos, watermark, signage, photorealistic, 3D render, CGI, harsh HDR,
cluttered, messy, grungy, dingy basement gym, industrial warehouse, blueprint,
architectural line drawing, sepia, monochrome, fisheye, dutch angle.

---

## Revision notes for the next pass

The generated room is working — this is a punch-list against the version
currently in `gym-floor.jpg`, not a rewrite. Append these to the prompt:

> The gloves, headgear and shin guards on the pegboard wall are **much
> smaller** — realistically scaled hand-sized equipment on a large board, not
> oversized display pieces. They should read as a tidy, sparsely-filled wall
> of gear with plenty of empty pegboard around each item.

Why it matters beyond taste: the characters are scaled to real human height
against the room, so any prop that's drawn oversized makes the people next to
it look wrong. Right now a single glove is close to head-sized, which fights
the figures standing in front of it.

Everything else in the room can stay as generated.

## After it lands

Drop it in as `assets/home/gym-floor.jpg` (`.png`/`.webp` also work) — no code
change. Then re-measure the five positions, because the zones will have moved:

```
longuard.shop/?tune
```

Drag each figure onto its mark, then paste the printed block into `GUIDES` at
the top of `site.js`. The current numbers were tuned to the old background and
are a starting point, not a fit.
