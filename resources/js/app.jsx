import { createInertiaApp } from '@inertiajs/inertia-react';
import { createRoot } from 'react-dom/client';

// Ini otomatis import semua file JSX di dalam Pages (termasuk subfolder)
const pages = import.meta.glob('./Pages/**/*.jsx');

createInertiaApp({
  resolve: name => {
    const page = pages[`./Pages/${name}.jsx`];
    if (!page) throw new Error(`Page not found: ${name}`);
    return page();
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
