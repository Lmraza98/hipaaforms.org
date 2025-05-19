---
description: 
globs: 
alwaysApply: true
---
---
description: "Distinguish Server vs Client Components in Next.js 15 App Router"
alwaysApply: true
---

# Component Boundaries – Next .js 15 (App Router)

### 1 . Default to **Server Components**
* Every file under `src/app/**` is a **React Server Component (RSC)** **unless** it starts
  with the `'use client'` directive.
* RSCs may:
  - `export const metadata` (static or dynamic)
  - `export const generateStaticParams`
  - Declare **Server Actions** (`export async function action() {…}`)
  - Run `async` / `await`, call `fetch`, or read from the file system
  - Import server‑only code (e.g. `fs`, database clients)

### 2 . When to mark `'use client'`
Add `'use client'` **only** when the component:
* Uses React hooks (`useState`, `useEffect`, etc.)
* Interacts with the browser (DOM APIs, window, localStorage)
* Relies on client‑side libraries (charts, drag‑and‑drop, Stripe Elements, etc.)

> **If you add `'use client'`, you must NOT export `metadata`, `generateStaticParams`,
> or declare a Server Action in that file.**  
> (Next.js build will fail: “You are attempting to export … from a component marked with 'use client'.”)

### 3 . Split when necessary
If a page needs both interactive UI **and** server‑side metadata or data‑fetching:
1. Keep the **page or layout file** as a Server Component (`export const metadata`, data fetching).
2. Move interactive logic into a **child Client Component** (new file) and import it.

```tsx
// src/app/pricing/page.tsx  ← Server Component
export const metadata = { title: 'Pricing – HIPAAForms' };

import PricingClient from './Pricing.client';  // interactive bits

export default function PricingPage() {
  const plans = await getPlans();      // allowed here
  return <PricingClient plans={plans} />;
}
