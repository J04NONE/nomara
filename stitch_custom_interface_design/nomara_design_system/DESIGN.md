---
name: Nomara Design System
colors:
  surface: '#111318'
  surface-dim: '#111318'
  surface-bright: '#37393e'
  surface-container-lowest: '#0c0e12'
  surface-container-low: '#1a1c20'
  surface-container: '#1e2024'
  surface-container-high: '#282a2e'
  surface-container-highest: '#333539'
  on-surface: '#e2e2e8'
  on-surface-variant: '#c0c7d4'
  inverse-surface: '#e2e2e8'
  inverse-on-surface: '#2f3035'
  outline: '#8a919d'
  outline-variant: '#404752'
  surface-tint: '#a2c9ff'
  primary: '#a2c9ff'
  on-primary: '#00315c'
  primary-container: '#4da2ff'
  on-primary-container: '#003765'
  inverse-primary: '#0060aa'
  secondary: '#b1c7f2'
  on-secondary: '#193053'
  secondary-container: '#31476b'
  on-secondary-container: '#a0b6e0'
  tertiary: '#00daf3'
  on-tertiary: '#00363d'
  tertiary-container: '#00afc3'
  on-tertiary-container: '#003c44'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d3e4ff'
  primary-fixed-dim: '#a2c9ff'
  on-primary-fixed: '#001c38'
  on-primary-fixed-variant: '#004881'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#b1c7f2'
  on-secondary-fixed: '#001b3d'
  on-secondary-fixed-variant: '#31476b'
  tertiary-fixed: '#9cf0ff'
  tertiary-fixed-dim: '#00daf3'
  on-tertiary-fixed: '#001f24'
  on-tertiary-fixed-variant: '#004f58'
  background: '#111318'
  on-background: '#e2e2e8'
  surface-variant: '#333539'
  status-critical: '#FF4D4D'
  status-warning: '#FFB800'
  status-success: '#00F08F'
  surface-card: '#12161F'
  border-muted: '#232833'
  text-dimmed: '#8E97A4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  headline-md-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style

This design system is engineered for **Nomara**, a high-precision payroll compliance engine. The brand personality is technical, authoritative, and immutable. It prioritizes the "Design Based on Regulation" philosophy, where visual clarity and auditability are paramount.

The aesthetic follows a **Corporate Technical** style—a fusion of sophisticated minimalism with developer-tool utility. It utilizes a deep-space dark mode to reduce eye strain for operators managing dense data shifts, accented by vibrant electric blues to signal modern infrastructure and legal certainty. The mood is focused and "surgical," emphasizing the system's role as a reliable compliance assistant.

## Colors

The palette is optimized for high-contrast data visualization within a dark environment.

- **Primary & Secondary:** The electric blue (#4DA2FF) is used for primary actions and active states. The deep navy (#001B3D) acts as a structural layer for secondary containers.
- **Surface Strategy:** Backgrounds utilize a near-black (#0A0C10), while interactive cards and data sections use slightly elevated grey-blues to create depth without relying on shadows.
- **Status Semantic:** Compliance alerts use a high-saturation red for legal inconsistencies and a bright amber for warnings. Success states (approved payroll) use a vibrant mint green.
- **Read-Only States:** Fields designated as immutable or restricted use a muted status-gray to clearly distinguish them from editable data inputs.

## Typography

Typography prioritizes legibility in data-dense environments. 

- **Primary Sans:** Inter is used for all UI text and body copy to provide a modern, neutral foundation.
- **Technical Mono:** JetBrains Mono is utilized for labels, IDs (UUIDs), currency values, and the "Shift Segmentation" engine output. This reinforces the technical nature of the payroll compliance logs.
- **Case Usage:** Table headers and priority tags should use `label-caps` for clear structural division.
- **Scale:** The system uses a tight scale to maximize the information density required for 100+ employee rosters.

## Layout & Spacing

This design system uses a **Fixed Grid** approach for dashboards to ensure data columns remain aligned across regulatory reports, switching to a **Fluid Grid** for internal form structures.

- **Grid:** A 12-column grid system with 16px gutters. In data tables, margins are tight (8px) to allow for maximum horizontal real estate.
- **Compliance Spacing:** Text inputs for justifications require a specific visual width to accommodate the 30-character minimum requirement.
- **Breakpoints:**
    - **Desktop (1280px+):** Full 12-column layout.
    - **Tablet (768px - 1279px):** Content reflows to 6 columns; sidebars collapse to icons.
    - **Mobile (<768px):** Single column; horizontal scrolling enabled specifically for data tables to maintain cell integrity.

## Elevation & Depth

To maintain a technical, "flat" aesthetic, this design system avoids traditional drop shadows in favor of **Tonal Layering** and **Low-Contrast Outlines**.

- **Surface Tiers:** Background is the darkest layer. Cards and containers use `surface-card`. Active or hovered elements use a subtle stroke of `border-muted`.
- **Glassmorphism:** Used sparingly for global navigation bars and modal backdrops (12px blur, 40% opacity) to provide a sense of hierarchy without breaking the structured grid.
- **Surgical Dividers:** Sections are separated by 1px solid borders in `border-muted` rather than spacing, mimicking a blueprint or technical schematic.

## Shapes

The shape language is "Soft" yet disciplined. While the interface is technical, subtle rounding prevents the UI from feeling aggressive.

- **Elements:** Buttons and input fields use a 4px (0.25rem) radius.
- **Containers:** Cards and large data segments use a 8px (0.5rem) radius.
- **Status Pills:** Status badges (e.g., `ACTIVO`, `BORRADOR`) use a fully rounded/pill shape to distinguish them from interactive buttons.

## Components

### Buttons & Controls
- **Primary:** Solid `primary_color_hex` with white or near-black text. No gradients.
- **Secondary:** Outlined with `primary_color_hex` and a subtle 10% alpha fill on hover.
- **Inputs:** Dark backgrounds with `border-muted`. On focus, the border transitions to the primary blue with a 2px outer glow.

### Data Tables
- **Rows:** Zebra-striping is avoided; instead, use 1px horizontal dividers.
- **Cells:** Currency and IDs must use the `data-mono` font for vertical alignment.
- **Header:** Sticky headers with a `surface-card` background and `label-caps` text.

### Specialized: Shift Segmentation Engine
- **The "Malla" (Grid):** A visual timeline representing 24-hour periods. 
- **Segmentation Cut:** A vertical "surgical" line (1px dashed `status-warning`) at 00:00:00 UTC-5 to indicate the logical split of a shift.
- **Interactive Blocks:** Draggable blocks representing hours worked, color-coded by surcharge type (e.g., Night Surcharge in `tertiary_color_hex`).

### Status & Badges
- **Draft/Approved:** Standardized badges using `named_colors`. Approved states should include a small "Locked" icon to signify immutability.
- **Legal Alert:** A high-visibility banner component that appears at the top of the viewport when `status-critical` inconsistencies are detected.