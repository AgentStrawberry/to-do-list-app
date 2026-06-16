# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Design Rules

The visual style is **warm analog / paper notebook** — deliberately sharp and tactile, not soft or airy.

- **No soft shadows.** Shadows must be hard/offset (e.g. `3px 3px 0 0 var(--shadow)`), never blurred with large spread or high opacity gradients that create a glow or diffuse effect.
- **No rounded corners.** `border-radius: 0` everywhere — already enforced in the reset.
- **No frosted glass, blur, or translucency effects.**
- Contrast between sections must come from background texture, color shifts, or hard lines — not soft inset shadows or glows.
