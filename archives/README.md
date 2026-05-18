# Archives

Large site snapshots are stored on dedicated Git branches (not on `main`) to keep your local clone small.

## Curious Cardinals (2026-05-18)

**Branch:** `archive/curious-cardinals-2026-05-18`  
**Size:** ~658 MB · ~3,100 pages (marketing Webflow, HubSpot blog, app mentor profiles)

### Browse or download from GitHub

Open the branch on GitHub and browse files, or clone only that folder:

```bash
git fetch origin archive/curious-cardinals-2026-05-18
git checkout archive/curious-cardinals-2026-05-18 -- archives/curious-cardinals-2026-05-18
```

Serve locally:

```bash
npx --yes serve archives/curious-cardinals-2026-05-18/marketing -p 4321
```

When finished, remove the local copy again:

```bash
rm -rf archives/curious-cardinals-2026-05-18
```

### Re-run the mirror

Scripts live on the archive branch under `archives/curious-cardinals-2026-05-18/scripts/`.
