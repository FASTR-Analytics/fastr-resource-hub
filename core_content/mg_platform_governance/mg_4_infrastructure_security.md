---
marp: true
theme: fastr
paginate: true
---

## Protection in transit and on the server

- All traffic between users and the platform is **encrypted (HTTPS)**, with certificates renewed automatically
- Passwords, keys, and other secrets **stay on the server** — they are never sent to users' browsers
- Direct server access is limited to **two authorized engineers**, using cryptographic keys, not passwords
- Data analyses run in **isolated, throwaway environments** that are destroyed when they finish

<!--
- TLS termination via nginx with certbot-managed certificates; SSH access is key-based only, for two named users.
- Secrets (database passwords, API keys) are injected at startup and never hardcoded; the system refuses to start if any are missing.
- R analysis modules run in short-lived sandboxed containers during results-package generation; each container sees only the working folder of its own run.
-->
