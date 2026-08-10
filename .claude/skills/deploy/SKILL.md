---
name: deploy
description: Deploy this protobox project to Vercel production. Creates the project on first run, updates it on subsequent runs. Returns the live URL.
triggers:
  - "deploy"
  - "deploy to vercel"
  - "push to vercel"
  - "ship it"
  - "/deploy"
---

# Deploy Skill

Deploy the current protobox project to Vercel production.

## Step 1 — Verify the Vercel CLI is available

```bash
npx vercel --version
```

If this fails, run `pnpm add -D vercel` then retry.

## Step 2 — Build the project

```bash
pnpm build
```

If the build fails, stop and report the error. Do not deploy a broken build.

## Step 3 — Detect whether the project is already linked

Check for `.vercel/project.json`:

```bash
cat .vercel/project.json 2>/dev/null
```

- **File exists** → project is already linked, proceed to Step 4.
- **File absent** → this is a first-time deploy. `vercel --prod --yes` will create, link, and deploy in one shot.

## Step 4 — Deploy

```bash
npx vercel --prod --yes 2>&1
```

The `--yes` flag accepts all defaults non-interactively. The `--prod` flag deploys to the production URL (not a preview).

Capture the full output.

## Step 5 — Extract and report the URL

Parse the CLI output for the production URL. It appears as a line like:
```
Production: https://protobox.vercel.app [3s]
```

or simply a bare URL on its own line.

Print exactly one line to the user:

```
Deployed: <url>
```

If no URL is found in the output, print the raw CLI output so the user can debug.

## Error handling

| Symptom | Action |
|---|---|
| Build fails | Stop. Report the error. Do not deploy. |
| `vercel` not found | Run `pnpm add -D vercel`, then retry from Step 1. |
| Auth error ("not logged in") | Tell the user to run `! npx vercel login` in the terminal. |
| Deploy fails with non-zero exit | Print the full CLI output verbatim. |
