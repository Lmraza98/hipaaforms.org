---
description: 
globs: 
alwaysApply: true
---
---
description: "Optimize for performance, using static generation and edge/serverless functions"
---
# Performance and Cost Optimization
- Prefer static generation (SSG or ISR) for pages to minimize server costs and maximize CDN caching. Next.js 15 optimizes App Router static generation for faster builds:contentReference[oaicite:2]{index=2}.
- Share and reuse fetch caches: use Next.js’s automatic cache for `fetch` calls so that the same data request isn’t repeated across pages:contentReference[oaicite:3]{index=3}.
- For dynamic logic (API routes or Server Actions), use `export const runtime = "edge"` so the code runs on Vercel’s Edge Runtime:contentReference[oaicite:4]{index=4}:contentReference[oaicite:5]{index=5}. Edge functions are lighter, have virtually no cold start, and cost less per request:contentReference[oaicite:6]{index=6}.
- Beware Edge limitations: no persistent DB connections and limited Node API support:contentReference[oaicite:7]{index=7}. For heavy computation or database work, consider a Node.js serverless function instead.
- Minimize bundle size: avoid shipping large libraries to the edge. Use `serverExternalPackages` in `next.config.js` to skip bundling bulky modules:contentReference[oaicite:8]{index=8}. Tree-shake dependencies and remove unused code.
