# Gym floor background — generation prompt (v6)

Replaces `gym-floor.jpg`. v5 nailed the timber floor, the glass balustrades and
the walk-in shop. This pass fixes the Lab, adds a rooflight, and — importantly —
**stops asking the generator to draw the logo**.

**What changed from v5:**

- **All Longuard branding is now generated BLANK and composited afterwards.**
  Image generators approximate lettering; every previous version put a
  near-miss wordmark and an invented star on the mat. The mat, the ring apron
  and a new hanging sign now come back plain, and the real `whte-txt.svg` gets
  perspective-mapped onto them in post. Exact mark, every time.
- **The Lab is an open room** with a sliding glass panel pushed open, and every
  bit of workshop content moved *inside* it. In v5 the bench, swatches and lamp
  were out on the walkway while the room behind sat empty.
- **A rooflight over the ring** — a glazed cut in the roof plane dropping a soft
  pool of moonlight on the canvas.
- **A blank hanging sign** suspended from the front edge of the mezzanine.

---

## Hard constraints — the layout depends on these

- **16:9, 2560×1440.**
- **Empty. No people, no figures, no silhouettes, no mannequins.** The five
  characters are separate transparent PNGs composited on top.
- **No strong directional light and no long cast shadows.** The characters are
  composited with no shadows of their own; a low sun would make them read as
  stickers. Ambient, soft, sun already below the horizon.
- **Safe zones.** The image fills the browser window and crops to fit:

  | | Cropped worst case | Keep critical content within |
  |---|---|---|
  | Vertical | 13% off top and bottom (21:9 ultrawide) | **y 13% – 87%** |
  | Horizontal | 10.6% off each side (narrow desktop) | **x 12% – 88%** |

  The mezzanine deck, its openings, and every spot a character stands must sit
  inside those bounds. Only roof structure above, only empty floor below.

- **Expand depth, not width.** Anything added at the far left or right is the
  first thing cropped. Put expendable things at the edges — spiral stair,
  greenery, storage — and keep rooms and guides in the middle.

---

## The prompt

> A wide 16:9 interior illustration of a **two-storey open-air Muay Thai
> training camp perched on a clifftop above the sea at blue hour**, drawn in a
> clean cel-shaded anime style — crisp confident linework, flat-to-soft cel
> shading, restrained palette, the look of a high-end animated film background.
> Hand-drawn feel; not 3D, not photographic, not a technical or architectural
> sketch.
>
> **Architecture: tropical modernist, not industrial.** A thin floating roof
> plane with recessed downlights — **no exposed roof trusses, no heavy beams**.
> **Very few columns — only two or three slender posts in the whole frame.**
> **No large horizontal beams anywhere**: the mezzanine reads as a **floating
> slab with a thin shadow-gap edge**, not a deck sitting on visible structure.
> Where walls are needed, **vertical timber slat screens**. Designed and
> expensive — Aman resort or Bali villa, not a converted warehouse.
>
> **Floor: wide-plank warm timber** — teak or dark oak boards running toward the
> view. **Not stone, not marble, not polished terrazzo.** A large **plain,
> completely unmarked training mat inset into the timber** as an island in the
> centre — **no logo, no text, no graphics, no markings of any kind on it.** A
> small patch of **dark rubber gym flooring** under the weight rack against the
> wall.
>
> **Railings and balustrades: frameless glass with a slim bronze cap rail.**
> No steel posts, no scaffolding-style rails, nothing that reads as galvanised
> or rust-prone. Any exposed metal is **bronze or dark powder-coated
> marine-grade aluminium** — appropriate to a building this close to salt water.
>
> **Setting: the building sits right at the cliff edge.** Almost no lawn — the
> floor runs out to a frameless glass edge and the ground drops away immediately
> to the sea far below. The cliff line runs away along the right, with the faint
> lights of a distant town low on the horizon — small and atmospheric, never a
> bright skyline.
>
> **Light: just after sunset.** The sun is already below the horizon, so the
> light is soft and ambient with **no long cast shadows anywhere**. Deep blue
> sky grading to warm amber at the waterline, a thin crescent moon, calm sea.
> Warm interior downlights glowing against the cool blue air.
>
> **GROUND FLOOR**, left to right:
> - **Near-left foreground: a premium lounge.** A **low-profile designer sofa in
>   dark leather or deep bouclé** — sculptural, not a bulky sectional — a solid
>   stone coffee table, a textured rug, one or two floor cushions. On the timber
>   slat wall behind it, a **display of championship belts, trophies and medals**
>   on slim lit shelves. Unoccupied.
> - **Left open edge, running away from camera: a long row of six or seven
>   Muay Thai banana bags** — the long narrow kind, not short boxing heavy bags —
>   hanging in a line that recedes from mid-frame all the way to the far left
>   corner of the building, open to the sea on that side. **Clear open floor in
>   front of the whole row.** The lounge sits nearer the camera, in front of
>   them, so the two do not collide.
> - **Left-mid: a compact pegboard** of gloves, headgear and shin guards — all
>   **small and realistically hand-sized on a generous board with plenty of empty
>   space around each item**. A low rack of kettlebells and a barbell **flat
>   against the wall on the rubber patch**, not out on the floor.
> - **Centre: the floor.** The plain inset mat, and behind it a boxing ring on a
>   low platform with clean canvas and taut ropes. Its **apron skirt is a plain
>   flat single colour — completely blank, no text, no lettering, no graphics.**
>   The sea is framed in the gap beneath the mezzanine behind the ring — this
>   framed view is the focal point and must stay clear.
> - **Directly above the ring, a long rectangular rooflight** cut into the
>   floating roof plane, dropping a **soft, subtle pool of cool moonlight** onto
>   the canvas below. Gentle and ambient — **not a dramatic shaft, no visible
>   light beam, no hard-edged pool.**
> - **A blank hanging sign** suspended on two slim bronze rods from the front
>   edge of the mezzanine deck, centred over the floor — a simple rectangular
>   panel in dark timber or bronze. **The panel is completely blank: no text, no
>   lettering, no logo, no markings.** It exists only as a clean surface.
> - **Right: the shop — a room you can clearly walk into.** A **wide open
>   threshold** with the timber floor **running continuously through the opening
>   into the room beyond**, and **all fixtures set well back from the doorway** —
>   nothing pressed into or blocking the opening. Inside, sparse and boutique:
>   one rail of well-spaced garments and two or three open shelves of folded
>   pieces, deeper into the room. Generous empty floor at the entrance.
> - **The right-hand wall is largely open** to the cliff view. One short solid
>   segment carries a **modest wall-mounted screen showing a fight, mounted high
>   and reading as ambient**. No clothing rail and no bench on that wall.
> - **Far right edge: exactly ONE spiral staircase**, compact, tight against the
>   very edge of the frame. **Only one staircase in the entire image.**
>
> **UPPER MEZZANINE**, its deck roughly 35–40% down from the top of the image,
> edged with **frameless glass and a bronze cap rail**. The ground floor is
> visible beneath it — the two levels read as one open volume. Two lit openings:
> - **Left: a screening alcove** — a large wall-mounted screen, low seating, the
>   only cool-toned light in the building spilling out of it.
> - **Right: a workshop bay — an OPEN room**, its whole front a **sliding glass
>   panel slid fully open** to the walkway. **Every piece of workshop content
>   sits INSIDE the room** — the long bench, the fabric samples, the swatch
>   boards, the task lamp, the stool. **Nothing on the walkway outside it.**
>   Warm light from within. At this end the deck **cantilevers out toward the sea
>   as a small glass-edged balcony**, seen in profile, without blocking the
>   framed ocean view below.
>
> Far outside on the left, beyond the building, a small dim fire pit with two
> low chairs — distant background detail only, never a bright focal point.
>
> Empty building, no people, no figures, no silhouettes, no mannequins. Wide
> establishing shot, eye-level camera at ground-floor head height, one-point
> perspective with the vanishing point near centre. Muted warm neutrals — teak,
> bone, warm grey, bronze — against cool blue evening shadow. Understated,
> expensive, calm. Generous empty floor in the foreground.

**Negative prompt:** people, person, figures, silhouettes, mannequins, crowd,
text, lettering, written words, painted logos, branded graphics,
watermark, photorealistic, 3D render, CGI, harsh HDR,
long cast shadows, harsh directional sunlight, golden hour sun flare,
cluttered, messy, stockroom, market stalls, shopfronts in a row, strip mall,
grungy, dingy basement gym, industrial warehouse, exposed roof trusses, heavy
concrete walls, blueprint, architectural line drawing, sepia, monochrome,
fisheye, dutch angle, oversized props, two staircases, duplicate staircase,
forest of columns, many vertical posts, large lawn, wide grass field, bright
city skyline, rowing machine, clothing rail on the side wall, marble floor,
stone floor, polished terrazzo, tiled floor, fully matted floor, heavy
horizontal beams, exposed transfer beam, steel post-and-rail railing,
scaffolding, galvanised metal, rusted metal, blocked doorway, shelving in the
doorway, logo on the mat, text on the mat, writing on the ring,
lettering on the sign, contents spilling onto the walkway, bright light shaft,
visible light beam.

---

## Where the five guides will stand

Three on the ground, two upstairs.

| Guide | Section | Level | Spot |
|---|---|---|---|
| Slasher | Training | ground | left-mid, at the heavy bags |
| Cornerwoman | Cornerwoman / FAQ | ground | centre, on the mat |
| Joker | Gym Store | ground | right, in the shop doorway |
| Stoic | Film Room | **upper** | mezzanine, at the screening alcove |
| Sleeper | The Lab | **upper** | mezzanine, at the workshop bay |

The **lounge is deliberately unoccupied** — it's the natural home for a sixth
section later (community, events, the quest board).

Leave all five spots uncluttered; a figure will cover them, and busy detail
behind a character reads as mud. Mezzanine characters render smaller, which is
correct and handled by the positioning system.

**Sleeper is being redrawn** standing/leaning rather than reclining, so he
works at a mezzanine railing.

---

## On the time of day

Blue hour is a technical choice as much as an aesthetic one. The five
characters are transparent PNGs with no shadows of their own. Any strongly
directional light — golden hour especially — demands a long cast shadow from
each figure, and without one they read as stickers pasted on a photo. With the
sun below the horizon there are no cast shadows to match, so the composite
holds up.

It also suits the UI, which is bone text on near-black and assumes a dark
backdrop. A bright daylight scene would need heavier scrims to keep text
legible.

To try something else, swap the **Light** paragraph — but keep "sun below the
horizon, no long cast shadows" in whatever replaces it.

---

## After it lands

Drop in as `assets/home/gym-floor.jpg` — no code change. Then re-measure all
five positions, because every zone moves:

```
https://full-website-jet.vercel.app/?tune
```

Drag each figure onto its mark and paste the printed block into `GUIDES` at the
top of `site.js`.

**Mobile is out of scope for this image.** Phones get the guide-card list today,
and the plan is a per-guide cropped view with a selector rail — neither needs
the wide art to compress vertically, so compose purely for desktop.
