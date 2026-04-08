/**
 * Onboarding — first-run tooltip tutorial for new users.
 *
 * Shows 5 steps explaining the main UI areas.
 * Only appears once (tracked in localStorage).
 * Can be skipped or dismissed at any step.
 */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'monet-onboarding-done';

const STEPS = [
  { title: 'Welcome to Monet!', text: 'A free, open-source design editor. Let\'s take a quick tour.', position: 'center' as const },
  { title: 'Templates & New Designs', text: 'Click "+ New" to start from a template or blank canvas.', position: 'top-left' as const },
  { title: 'Tools', text: 'Use the left sidebar to add shapes, text, images, and draw freehand.', position: 'left' as const },
  { title: 'Properties', text: 'Select any object to edit its color, font, size, and more in the right panel.', position: 'right' as const },
  { title: 'Export', text: 'When you\'re done, click Export to download as PNG, JPG, SVG, or PDF.', position: 'top' as const },
];

export function Onboarding() {
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    // Delay slightly so the app renders first
    const timer = setTimeout(() => setStep(0), 500);
    return () => clearTimeout(timer);
  }, []);

  if (step < 0 || step >= STEPS.length) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      finish();
    } else {
      setStep(step + 1);
    }
  };

  const finish = () => {
    setStep(-1);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  // Position classes based on which UI area the step highlights
  const positionClass =
    current.position === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' :
    current.position === 'top-left' ? 'top-16 left-40' :
    current.position === 'left' ? 'top-1/3 left-20' :
    current.position === 'right' ? 'top-1/3 right-72' :
    'top-16 left-1/2 -translate-x-1/2';

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={finish} />

      {/* Tooltip */}
      <div className={`absolute ${positionClass} z-[61] w-72 rounded-xl bg-white p-5 shadow-2xl dark:bg-gray-800`}>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Step {step + 1} of {STEPS.length}</span>
          <button type="button" onClick={finish} className="text-[10px] text-gray-400 hover:underline">
            Skip tutorial
          </button>
        </div>
        <h3 className="mb-1 text-sm font-semibold text-gray-800 dark:text-gray-100">{current.title}</h3>
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{current.text}</p>
        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          {isLast ? 'Got it!' : 'Next'}
        </button>
      </div>
    </div>
  );
}

/** Reset onboarding so it shows again */
export function resetOnboarding(): void {
  localStorage.removeItem(STORAGE_KEY);
}
