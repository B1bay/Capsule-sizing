# Capsule Sizing & Packaging Reference Hub

A professional, responsive web reference application built from `Capsule sizing.xlsx` for looking up capsule sizes, unit quantities, target weights, and bag/packaging specifications across **Capsuline**, **Capsule Depot**, and **Pet Caps**.

## Key Features

1. **Company Selection Hub**: Choose between **Capsuline**, **Capsule Depot**, and **Pet Caps** on entry, or switch between them at any time.
2. **3 Distinct Professional Visual Styles** (Live Switcher in the Header — zero neon colors, zero emojis):
   - **01 · Swiss Clinical**: High-contrast technical grid with crisp architectural borders and monospace readouts.
   - **02 · Executive Slate**: Dark industrial slate workspace with warm bronze highlights for low-glare environments.
   - **03 · Warm Apothecary**: Editorial parchment palette with serif headers and deep botanical tones.
3. **Whole Size List + Side-Arrow Dropdowns**:
   - View a clean list of all capsule sizes (`0`, `00`, `00E`, `000`, `1`, `2`, `3`, `4`, `5`).
   - Click the **side arrow** on any size row to open a dropdown drawer showing all quantities, target weights, and bag/packaging without leaving the list.
4. **Dedicated Size View & Isolated Single-Quantity View**:
   - Click a size row to view the full scrollable schedule of quantities for that dedicated size.
   - Click any specific quantity to **isolate it** so it is the only specification displayed on screen.
5. **Smart Search with `S` and `Q` Shorthand**:
   - Type a size (e.g., `00`) or use the shorthand `S (any size)` and `Q (any quantity)` (such as `S 00`, `S 0 Q 5000`, or `Q 10000`) to filter the list and inspect weights and bags immediately.

## Updating Sizing Data

All capsule data is stored in [`data.js`](./data.js). You can add or update sizes, quantities, weights, or bag specifications for **Capsuline**, **Capsule Depot**, or **Pet Caps** directly in `CAPSULE_DATA`.
