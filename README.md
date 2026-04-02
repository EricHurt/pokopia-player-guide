# Pokopia player guide (starter site)

Small **static website** you can grow together: progression notes, Pokémon, abilities, and habitats. Everything players see starts as **Markdown** under `src/pages/`.

## Big ideas (for a new builder)

1. **Markdown (`.md`)** — Write headings with `##`, lists with `-`, links with `[text](/path)`, and **bold** with double asterisks. No programming required to add a page.
2. **Astro** — Turns those files into fast **HTML** in the `dist/` folder. That HTML is what you put on the internet.
3. **Git + hosting** — You copy the project to **GitHub**, then a host like **Vercel** or **Cloudflare Pages** builds and serves it **free** for personal projects.

---

## What is in this folder?

| Path | Purpose |
|------|---------|
| `src/pages/` | One `.md` file per page. Folder names become URL segments (e.g. `pages/pokemon/overview.md` → `/pokemon/overview`). |
| `src/layouts/BaseLayout.astro` | Shared header, nav, footer, and styles. The “frame” around your Markdown. |
| `src/styles/global.css` | Colors and typography (try changing `--accent`). |
| `public/` | Static files copied as-is (e.g. `favicon.svg`). Put downloadable files or extra images here if you like. |
| `astro.config.mjs` | Site-wide settings. Set `site` to your real URL after deployment (helps SEO). |
| `dist/` | **Generated** when you run `npm run build`. Do not edit by hand. |

---

## Run the site on your computer

### 1. Install Node.js

Install a current **LTS** Node from [nodejs.org](https://nodejs.org/). If `npm run build` warns about the Node version, upgrading Node fixes it.

### 2. Install dependencies

In PowerShell:

```powershell
cd C:\Source\Pokopia
npm install
```

### 3. Start the dev server

```powershell
npm run dev
```

Open the URL Astro prints (usually `http://127.0.0.1:4321`). Edit a file under `src/pages/`, save, and refresh the browser.

### 4. Build the real site (optional check)

```powershell
npm run build
npm run preview
```

`preview` serves the `dist/` folder locally so you can verify the production build.

---

## Put the site online for free (recommended: Vercel)

These steps assume the project is in a **Git** repository on GitHub. You can use Azure DevOps or GitLab with Cloudflare Pages instead—same idea: connect the repo, pick “Astro” or static, deploy.

### A. Create a Git repo and push to GitHub

```powershell
cd C:\Source\Pokopia
git init
git add .
git commit -m "Initial Pokopia player guide"
```

Create an empty repository on GitHub (no README), then:

```powershell
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### B. Deploy on Vercel

1. Sign in at [vercel.com](https://vercel.com/) with your GitHub account.
2. **Add new project** → import the GitHub repo.
3. Framework preset: **Astro** (or leave defaults). Build command: `npm run build`. Output directory: **`dist`**.
4. Deploy. You get a URL like `https://your-project.vercel.app`.

### C. Set your real site URL in Astro

In `astro.config.mjs`, change `site` to that URL (with `https://`). Commit and push; Vercel will rebuild automatically.

---

## Alternatives (also free tiers)

- **[Cloudflare Pages](https://pages.cloudflare.com/)** — Connect the repo, build command `npm run build`, output `dist`.
- **[Netlify](https://www.netlify.com/)** — Same pattern; connect repo, build `npm run build`, publish `dist`.

---

## Adding a new page

1. Create `src/pages/your-topic/my-page.md`.
2. At the top, set the layout and title:

   ```yaml
   ---
   layout: ../../layouts/BaseLayout.astro
   title: My page title
   description: Short summary for search results.
   ---
   ```

   Use `../layouts/...` from a file directly under `pages/`, and `../../layouts/...` from a subfolder one level deep (`progression`, `pokemon`, `habitats`).

3. Write Markdown below the `---`.
4. Add a link in the nav: edit `src/layouts/BaseLayout.astro` and extend the `nav` array if you want a top-level item.

---

## Trademark note

This template talks about a game **for educational / fan-guide purposes only**. Do not claim you are the official game site, and respect the game creator’s terms and intellectual property.
