# Roadmapper

Roadmapper is a React and TypeScript workspace for planning product priorities on a shared visual roadmap canvas. It supports email and Google sign-in, roadmap item management, team invitations, comments, and progress analytics backed by Supabase.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase
- React Konva

## Requirements

- Node.js 20+
- npm 10+
- A Supabase project with auth enabled

## Environment

Create a local `.env` file with:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

If you want Google sign-in, enable the Google provider in Supabase Auth and add your deployed app origins to the allowed redirect URLs.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

The compiled app is emitted to `dist/` and can be served by any static hosting provider.

## Testing

```bash
npm test
npm run lint
```

## Deployment Notes

- Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the deployment environment.
- Apply the SQL files in `supabase/migrations` to provision the project database.
- Social preview metadata uses the local `public/social-card.svg` asset.
