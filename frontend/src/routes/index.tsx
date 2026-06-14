// Re-export router for backward compat.
// File only exports the router object — App.tsx uses it via RouterProvider.
// Vite Fast Refresh warns on non-component default exports from .tsx files.
// Suppressed: this file intentionally exports a router, not a component.
export { default } from './router';
