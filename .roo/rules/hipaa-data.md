---
description: 
globs: 
alwaysApply: true
---
---
description: "HIPAA data security and privacy practices"
---
# HIPAA Data Handling
- Encrypt all sensitive data in transit (HTTPS/TLS) and at rest (e.g. database or storage encryption):contentReference[oaicite:18]{index=18}.
- Do not log or expose any PHI in plaintext. Ensure any logs redact or omit personal health information.
- Restrict access: only authenticated users can access their own data:contentReference[oaicite:19]{index=19}. Administrator accounts should only manage non-PHI settings.
- Follow “minimum necessary” principle: only collect/store the data required. Permanently delete user data when it’s no longer needed:contentReference[oaicite:20]{index=20}.
- Use secure environment variables for keys and secrets. Regularly rotate credentials and use Vercel’s secret management.
