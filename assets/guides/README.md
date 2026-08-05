# Character art

All five guides now have real art:

```
cornerwoman.png    slasher.png    stoic.png
sleeper.png        joker.png
```

`.webp`, `.jpg` and `.jpeg` also work — the page tries each. A wrong name isn't
an error, it just falls back to the black placeholder silhouette.

## These are processed copies

The delivered files arrived as `1.png`–`5.png` (1 = cornerwoman, 2 = slasher,
3 = stoic, 4 = sleeper, 5 = joker) at 1365×2048 with a lot of transparent
padding — Stoic's figure only filled 44% of his frame's width. They were
trimmed to the figure and scaled to 900px tall, which cut the set from 7.5 MB
to 1.9 MB and, more importantly, makes the layout numbers mean what they say:
`h` is the figure's height, not the height of a mostly-empty PNG, and the
clickable box is the figure rather than the padding around it.

**The untouched originals are in `_masters/`**, which is gitignored so it
doesn't bloat the repo. Re-process from there if you need different sizes.

## Replacing one

Export on transparency, **cropped tight to the figure with no empty margin** —
the layout stands each character on the bottom edge of their file, so padding
below the feet makes them hover. Then drop it in under the matching name; no
code change.

Sleeper is the exception to "standing": he's drawn reclining, for the couch.
His bottom edge is his lower body rather than his feet, so his `y` is tuned to
seat him rather than stand him on the floor.

## Positions

`GUIDES` at the top of `site.js` — `x` is the horizontal centre, `y` is where
the figure meets the floor, `h` is the figure's height as a % of the scene.
Re-measure by opening the home page with `?tune`, which drops you straight onto
the gym floor with draggable outlines and a paste-ready readout.
