# Vercel deployment

Vercel must build a commit that contains the Next.js project setup in the repository root.

The deployment log should show a commit that includes:

- `package.json` with `next`, `react`, and `react-dom` in `dependencies`.
- `package.json` with a `build` script that runs `next build`.
- `app/layout.tsx` and `app/page.tsx` App Router entry points.
- `vercel.json` with the Next.js framework and build command.

If Vercel still reports `No Next.js version detected`, check the first lines of the Vercel log. The `Commit:` value must match a commit that contains those files. If it still points to an older commit on `main`, merge the pull request or redeploy the branch/commit that contains the Next.js setup.

Also verify the Vercel Project Settings:

1. **Root Directory** is the repository root unless the app is moved into a subdirectory.
2. **Framework Preset** is `Next.js`.
3. **Build Command** is `npm run build` or left for Vercel to infer from the Next.js preset.
4. **Install Command** is `npm install` unless the project intentionally uses another package manager.
