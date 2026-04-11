import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './i18n' // Initialize i18n before rendering
import './index.css'
import { LandingPage } from './components/LandingPage.tsx'

// Lazy-load the editor — it's ~600KB gzipped and the landing page
// shouldn't pay for it until the user navigates to /editor.
const App = lazy(() => import('./App.tsx'))

// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // Service Worker registration failed — app still works, just no offline cache
    });
  });
}

/** Minimal loading state while the editor bundle downloads */
function EditorLoader() {
  return (
    <div className="editor-shell flex h-screen w-screen items-center justify-center bg-canvas">
      <p className="text-sm text-text-secondary">Loading editor...</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={
          <Suspense fallback={<EditorLoader />}>
            <App />
          </Suspense>
        } />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
