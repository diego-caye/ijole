# ijole

A browser-based image editor. Load a background image, draw over it, drop in other
images and move them around, then save the result in the app or download it.

Everything runs in the browser — there is no backend and nothing is uploaded anywhere.

## What you can do

- **Draw** freehand over the canvas, with an adjustable brush colour and size.
- **Replace the background image** with one of your own.
- **Add movable images** on top, drag them around, and delete the selected one.
- **Save to the app** to keep a drawing in your saved list, or **download** it as a
  file.
- Switch between **English and Spanish**, and between **light and dark** themes.

## Built with

- [Next.js](https://nextjs.org) (pages router) and TypeScript
- [Konva](https://konvajs.org) via `react-konva` for the canvas and its layers
- Tailwind CSS with [shadcn/ui](https://ui.shadcn.com) components on Radix primitives
- `next-intl` for translations, `next-themes` for the theme toggle
- `react-photo-view` for viewing saved images

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

```bash
npm run build   # production build
npm run start   # serve the build
npm run lint    # eslint
```

## Layout

```
src/
  components/
    FrabicCanvas.tsx    the Konva stage: background, drawings and movable images
    Toolbar.tsx         tools, brush colour and size, image actions
    SavedImages.tsx     the gallery of drawings saved in the app
    LanguageSwitcher.tsx, ModeToggle.tsx
    ui/                 shadcn/ui components (button, slider, color-picker, ...)
  messages/             en.json and es.json
  pages/                _app, _document and the editor page
```
