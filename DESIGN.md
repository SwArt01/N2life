# Design System Specification: Kinetic Precision

## 1. Overview & Creative North Star
**Creative North Star: "The High-Performance Void"**

This design system is built on the philosophy of "Kinetic Precision." It rejects the cluttered, rainbow-hued aesthetics of traditional fitness apps in favor of a high-contrast, editorial approach that mirrors the focus of an elite athlete. By utilizing a near-total black-and-white palette, we create a "void" where the only things that matter are the data, the movement, and the call to action.

To break the "template" look, this system utilizes **intentional asymmetry** and **brutalist typography scales**. We do not center-align everything; we use the edges of the screen to create tension. We don't use boxes; we use light and depth. Every element must feel like it was carved out of granite—unyielding, premium, and intensely energetic.

---

## 2. Colors & Tonal Logic
The palette is rooted in absolute contrast. We use `#131313` (Surface) as our canvas to ensure the neon accents and pure white typography "vibrate" with energy.

### The Palette
- **Primary (The Light):** `#FFFFFF` — Reserved for primary headlines and high-intensity information.
- **Surface (The Void):** `#131313` — The foundational dark mode background.
- **Accent (The Spark):** `#CCFF00` (Neon Lime) — Use sparingly. If everything is neon, nothing is important. This is for the finish line, the "Start Workout" button, and the PR notification.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Traditional borders create visual "stutter." Instead, define boundaries through background shifts:
*   Place a `surface_container_low` (#1B1B1B) section against a `surface` (#131313) background.
*   The transition should be felt through tonal depth, not seen as a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Base:** `surface` (#131313)
*   **Floating Cards:** `surface_container` (#1F1F1F)
*   **Interactive Elements:** `surface_container_high` (#2A2A2A)
*   **Overlays:** `surface_container_highest` (#353535)

### The "Glass & Gradient" Rule
To add a "signature" feel, floating navigation bars or stats overlays should use **Glassmorphism**.
*   **Token:** `surface_variant` (#353535) at 60% opacity.
*   **Effect:** `backdrop-blur: 20px`. This prevents the UI from feeling "flat" and allows athletic imagery to bleed through the interface, maintaining a connection to the physical world.

---

## 3. Typography: Editorial Power
We use **Inter** for its mathematical precision. The hierarchy is designed to feel like a high-end sports magazine.

*   **Display-LG (3.5rem):** Used for big numbers (e.g., Rep counts, MPH). Should be tight-kerning and heavy-weight.
*   **Headline-LG (2.0rem):** For page titles. Use asymmetrical placement (e.g., flush left with a wide right margin) to create a sense of forward motion.
*   **Body-LG (1.0rem):** The workhorse. High legibility, generous line-height (1.6) to provide breathing room against the dark background.
*   **Label-SM (0.6875rem):** All-caps with increased letter-spacing (0.05em) for metadata like "KCAL" or "HEART RATE."

---

## 4. Elevation & Depth
In this system, "Up" is "Lighter." We move away from Material Design shadows and toward **Tonal Layering**.

### The Layering Principle
Depth is achieved by "stacking" the surface-container tiers. A workout card (`surface_container_low`) sitting on the main feed (`surface`) creates a soft, natural lift. No shadow is required.

### Ambient Shadows
If a component must float (e.g., a "Pause" button over a video feed), use an **Ambient Shadow**:
*   **Color:** `rgba(0, 0, 0, 0.4)`
*   **Blur:** 40px - 60px (Ultra-diffused)
*   **Spread:** -10px (To keep the core clean)

### The "Ghost Border" Fallback
If contrast is legally required for accessibility, use a **Ghost Border**:
*   **Token:** `outline_variant` (#444933) at **15% opacity**. It should be a whisper of a line, barely perceptible.

---

## 5. Components

### Buttons
*   **Primary:** Background `#CCFF00` (Neon), Text `#283500`. Sharp corners (`rounded-sm`: 0.125rem) to maintain the aggressive athletic aesthetic.
*   **Secondary:** Ghost style. No background, `outline` border at 20% opacity, White text.
*   **Tertiary:** Pure white text, no background, with a `0.7rem` (Spacing 2) underline that only spans the width of the text.

### Cards & Lists
*   **Strict Rule:** No divider lines. Use `1.4rem` (Spacing 4) of vertical whitespace to separate list items. 
*   **Interaction:** On hover/tap, shift the background from `surface_container` to `surface_container_high`.

### Inputs
*   **Style:** Underline-only inputs. No boxes.
*   **Active State:** The underline transforms from `outline_variant` to `primary` (#FFFFFF).
*   **Error State:** Use `error` (#FFB4AB) only for the text and underline, never for a background fill.

### The "Progress Pulse" (Custom Component)
For workout tracking, use a gradient stroke for progress rings transitioning from `primary_fixed_dim` (#ABD600) to `primary` (#FFFFFF). This creates a "glow" effect that signifies high energy.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Oversized Imagery:** Let professional photography do the heavy lifting. Crop images aggressively to show muscle tension or sweat detail.
*   **Embrace Negative Space:** Use the `20` (7rem) spacing token for top-level section margins. Let the design breathe.
*   **Type as Hero:** Let massive display numbers be the focal point of data-heavy screens.

### Don't:
*   **No Rounded Corners:** Avoid `full` or `xl` rounding. This isn't a "friendly" social app; it's a performance tool. Stick to `sm` (0.125rem) or `none`.
*   **No Grey Text on Black:** Avoid using mid-greys for body text; it looks "muddy." Use `on_surface_variant` (#C4C9AC) for secondary text to maintain a slight olive-tinted warmth.
*   **No Centered Layouts:** Avoid centering long lists of text. Keep the eye moving along a strong vertical axis on the left or right.

### Accessibility Note:
While we use high-contrast black and white, ensure all `label-sm` text passes AA contrast ratios by using the `on_surface` (#E2E2E2) token rather than a pure grey. Use the Neon Lime (`#CCFF00`) only for non-text elements or buttons with dark text to ensure readability.