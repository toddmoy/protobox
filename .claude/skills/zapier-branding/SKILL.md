---
name: "zapier-branding"
description: "Applies Zinnia (Zapier's design system) color tokens to shadcn/Tailwind. When Claude needs to brand a prototype with Zapier colors."
license: Proprietary
---

# Zapier Branding Skill

## Description
Overrides shadcn/Tailwind CSS color variables with Zinnia design system tokens. Colors only—does not modify fonts, border-radius, or spacing.

## When to use
- User asks to apply Zapier branding/styling
- User mentions Zinnia design system
- User wants prototype to look like Zapier product
- User asks for Zapier colors

## Instructions

1. Read current `src/index.css`

2. Replace the `:root` color variables with Zinnia light mode values from `colors.css`

3. Replace the `.dark` color variables with Zinnia dark mode values from `colors.css`

4. Preserve non-color variables (e.g., `--radius`)

5. Optionally add Zinnia semantic tokens as additional CSS variables for direct use

## Color Mapping Reference

### Light Mode (`:root`)

| shadcn variable | Zinnia token | Hex | HSL |
|-----------------|--------------|-----|-----|
| `--background` | zds-background-weaker | #fffdf9 | 40 100% 98% |
| `--foreground` | zds-text-default | #413735 | 7 11% 23% |
| `--card` | zds-background-weaker | #fffdf9 | 40 100% 98% |
| `--card-foreground` | zds-text-default | #413735 | 7 11% 23% |
| `--popover` | zds-background-weaker | #fffdf9 | 40 100% 98% |
| `--popover-foreground` | zds-text-default | #413735 | 7 11% 23% |
| `--primary` | zds-ui-primary | #847dfe | 244 99% 74% |
| `--primary-foreground` | zds-text-inverted | #fffdf9 | 40 100% 98% |
| `--secondary` | zds-background-stronger | #f5f3eb | 48 38% 94% |
| `--secondary-foreground` | zds-text-default | #413735 | 7 11% 23% |
| `--muted` | zds-background-strongest | #ece9df | 44 30% 90% |
| `--muted-foreground` | zds-text-weaker | #574e4c | 11 9% 32% |
| `--accent` | zds-ui-brand | #ff4f00 | 19 100% 50% |
| `--accent-foreground` | zds-text-inverted | #fffdf9 | 40 100% 98% |
| `--destructive` | zds-status-error | #f65258 | 358 90% 64% |
| `--destructive-foreground` | zds-text-inverted | #fffdf9 | 40 100% 98% |
| `--border` | zds-stroke-default | #b5b2aa | 44 6% 69% |
| `--input` | zds-stroke-weaker | #d7d3c9 | 39 14% 81% |
| `--ring` | zds-ui-primary | #847dfe | 244 99% 74% |

### Dark Mode (`.dark`)

Dark mode inverts the warm gray scale (warm-10 becomes warm-1, etc.) while keeping brand colors.

Note: Zinnia tokens are primarily designed for light mode. Dark mode values are derived by inverting the gray scale.

### Chart Colors

Map to Zinnia prime colors:
- `--chart-1`: zds-prime-purple (#847dfe)
- `--chart-2`: zds-prime-blue (#3d85fc)
- `--chart-3`: zds-prime-teal (#03bab1)
- `--chart-4`: zds-prime-green (#4ba84f)
- `--chart-5`: zds-prime-orange (#ff4f00)

## CSS Snippet

See `colors.css` in this skill directory for ready-to-paste CSS.

## Verification

After applying:
1. Run `pnpm dev`
2. Visually confirm colors changed (warm off-white background, purple primary)
3. Toggle dark mode and verify it works
4. Check shadcn components (Button, Card, Input) use new colors

## Notes
- Only modifies color variables; does not change typography, spacing, or border-radius
- Preserves existing non-color CSS rules in index.css
- Orange (#ff4f00) is Zapier's signature brand color, mapped to accent
- Purple (#847dfe) is the primary interactive color
