---
description: 
globs: 
alwaysApply: true
---
---
description: "Client‑side animations with Framer Motion"
alwaysApply: true
---

# Animation Guidelines

### When to use Framer Motion
* Page‑enter effects, scroll‑based reveals, micro‑interactions.
* Only inside files marked `'use client'`.

### Implementation rules
1. **Add `'use client'`** at the top of any component that imports `framer-motion`.
2. Export interactive components separately (`MySection.client.tsx`) and import them into the RSC page.
3. Never export `metadata` or Server Actions from a `'use client'` file (handled by `component-boundaries.md`).

### Standard utilities
```tsx
import { motion } from 'framer-motion';

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
