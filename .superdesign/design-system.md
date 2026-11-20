# Design System: EduTrack Duolingo-Inspired Theme

Extracted from project `dadaedbf-da94-4619-9ab5-f76c58eed0b5`.

## Visual Tone & Identity
- **Tone**: Playful, friendly, encouraging, gamified, clear, and high-energy.
- **Visual Style**: Duolingo-inspired flat 3D aesthetic with thick borders, bottom-heavy depth bevels, and bold rounded surfaces.

## Typography
- **Primary Font**: `Nunito`, sans-serif (`weights: 400, 600, 700, 800, 900`).
- **Headings**: Extra bold / Black (`font-extrabold` or `font-black`), tracking tight or normal.
- **Labels & Badges**: Uppercase, wide tracking (`uppercase tracking-wider` or `tracking-widest`), font-black or font-extrabold.
- **Body**: Font-bold, size 14px-16px, readable and friendly.

## Color Palette
- **Green (Primary Action / Success)**: `#58CC02` | Depth Border: `#46A302`
- **Blue (AI / Interaction / Accent)**: `#1CB0F6` | Depth Border: `#1483B8`
- **Yellow (Highlights / Rewards / Badges)**: `#FFC800` | Depth Border: `#D9A000`
- **Orange (Streak / Flame / Alert)**: `#FF9600` | Depth Border: `#CC7800`
- **Red (Errors / Critical Deadlines)**: `#FF4B4B` | Depth Border: `#EA2B2B`
- **Neutral Dark (Text Primary)**: `#4B4B4B`
- **Neutral Muted (Text Secondary)**: `#777777`, `#AFAFAF`
- **Border / Divider**: `#E5E5E5`
- **Surface / Background**: `#FFFFFF` (Base), `#F7F7F7` (Subtle off-white)

## Corner Radius & Elevation
- **Cards & Containers**: `rounded-[20px]` or `rounded-2xl`
- **Buttons & Action Targets**: `rounded-xl` or `rounded-2xl`
- **Pills / Status Tags**: `rounded-full`

## Button & Card 3D Styling
- **3D Buttons (`.btn-3d`)**:
  - Border-bottom width: 4px solid (darker shade of background color).
  - Active state: `:active { border-bottom-width: 0px; transform: translateY(4px); }`
- **Cards (`.duo-card`)**:
  - `border: 2px solid #E5E5E5; border-bottom-width: 4px;`
  - Clean white background with soft tactile depth.

## Iconography & Assets
- **Icons**: Lucide icons via `<iconify-icon icon="lucide:<name>">`
- **Visual cues**: Progress rings, streak counters, gamified badges, clean status pills.
