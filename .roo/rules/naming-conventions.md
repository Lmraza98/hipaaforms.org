---
description: 
globs: 
alwaysApply: true
---
---
description: "Consistent naming for components, variables, files"
---
# Naming Conventions
- Use PascalCase for React component and class names, and camelCase for functions, hooks, and variables.
- Name component files to match the component (e.g. `UserForm.tsx` for a `UserForm` component). Prefer one component per file.
- Prefix TypeScript interfaces with `I` and suffix types with `Type` if following convention (e.g. `IUser`, `FormDataType`).
- Use kebab-case for file and folder names in URLs (e.g. `sign-up/page.tsx` for `/sign-up`). 
- Avoid default exports in components. Export named components to improve refactoring and readability.
