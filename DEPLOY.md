# Putting the instructor app online

The app in `public/instructor/` is plain static files, so it can go up two
ways. Both give a normal web address she can open on her phone and add to her
home screen — no account, no login.

## Option A — GitHub Pages (free, nothing to sign up for)

The workflow in `.github/workflows/deploy-instructor-app.yml` publishes
`public/instructor/` on every push to `main`. It needs Pages switched on once:

1. Repository → **Settings** → **Pages**.
2. Under *Build and deployment*, set **Source** to **GitHub Actions**.
3. Repository → **Actions** → *Deploy instructor app* → **Run workflow**
   (or just push anything to `main`).

The address is then:

```
https://tdawwas.github.io/WC2026/
```

That URL serves the tracker itself — the World Cup app is not affected and is
not part of this deployment.

## Option B — Vercel (needed anyway if you want the World Cup site live)

Vercel builds the whole Next.js project, so both apps go up together.

1. Sign in at vercel.com with GitHub.
2. **Add New → Project**, pick `Tdawwas/WC2026`, and press **Deploy**.
   Everything is detected automatically; no settings to change.
3. When it finishes:
   - World Cup app → `https://<your-project>.vercel.app/`
   - Class tracker → `https://<your-project>.vercel.app/instructor`

Every later push to `main` redeploys on its own.

## On her phone, once it's live

1. Open the address in the phone browser.
2. **iPhone (Safari):** Share → *Add to Home Screen*.
   **Android (Chrome):** ⋮ → *Install app* / *Add to Home screen*.
3. It opens full-screen from the home screen and keeps working with no
   internet — her classes are stored on the phone itself.

Remind her to use **Settings → Save a backup file** now and then; that file is
the way to move everything to a new phone.

## Keeping the claude.ai edition in step

`public/instructor/artifact.html` is the claude.ai version of the same app,
generated from `index.html`. After changing the app, rebuild it from the repo
root and republish it if you use that link:

```
python3 scripts/build-artifact.py
```

It is skipped by the Pages deployment — on a normal web host `index.html` is
the file that runs.
