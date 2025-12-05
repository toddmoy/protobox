# Pages Directory

Page components for React Router v6 routing.

## Adding a New Page

1. Create component in this directory:
```tsx
// src/pages/MyPage.tsx
export function MyPage() {
  return <div>My Page Content</div>
}
```

2. Add route in `src/App.tsx`:
```tsx
import { MyPage } from './pages/MyPage'

<Routes>
  <Route path="/my-page" element={<MyPage />} />
</Routes>
```

## Existing Pages

- **LevaDemo.tsx** - Interactive GUI controls demo
- **PositionTest.tsx** - usePosition hook demo
- **TypewriterDemo.tsx** - useTypewriter hook demo
- **newPage.tsx** - Blank template

## Page Conventions

- Export named component (not default)
- Use PascalCase for component and file names
- Create demo pages for testing custom hooks/components
