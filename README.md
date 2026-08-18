# Switchboard

Kidzink's single entry point for its internal digital tools. Sign in once,
land on a launcher of every app you have access to (Consultant Hub / consultflow,
Project Pulse, creator2, PeopleFlow, etc.), and open whichever one you need —
without a separate login for each.

## Layout

```
client/   The launcher UI (Vite + React + Tailwind CSS v4). Currently
          ships with a static app registry (src/apps.js) and no backend —
          see client/README.md.
server/   Not built yet. Will own the app registry (which apps exist, their
          live URLs/status) and the single-sign-on flow. See server/README.md
          for the intended shape.
```

Each app it links out to (consultflow, creator2, scorecard, ...) stays its
own separately deployed project — Switchboard does not embed their code, it
authenticates the user once and hands them off.
