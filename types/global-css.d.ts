// Allow importing CSS files as side-effect modules in TypeScript
declare module '*.css' {
  const css: { [className: string]: string };
  export default css;
}

declare module '*.scss' {
  const scss: { [className: string]: string };
  export default scss;
}

// Note: Next.js already provides declarations for '*.module.*' files (see
// `node_modules/next/types/global.d.ts`). We only declare general CSS/SCSS
// imports here to support side-effect imports like `import './globals.css'`.
// For side-effect only imports like `import './globals.css'`
// Note: no need to declare './*.css' separately — the '*.css' declaration covers relative imports like './globals.css'

// Keep this as an ambient declaration file (no top-level exports) so these module
// declarations are available globally to the TypeScript compiler.
