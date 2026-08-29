# My Classes — offline instructor tracker

A small, self-contained app for an instructor who teaches at several studios:
track every class, close it when it's done, record what you earned, and get
reminded before the next one.

It lives in `public/instructor/` and is plain HTML + CSS + JavaScript — no
build step, no account, no server. **All data stays on the phone** (browser
`localStorage`); nothing is ever uploaded anywhere.

## Opening it

| How | What to do |
| --- | --- |
| On the deployed site | Go to `/instructor` |
| Locally | `npm run dev`, then open `http://localhost:3000/instructor` |
| Without any server | Open `public/instructor/index.html` directly in a browser |

### Installing it on her phone (recommended)

1. Open `/instructor` in the phone browser.
2. **iPhone (Safari):** Share → *Add to Home Screen*.
   **Android (Chrome):** ⋮ menu → *Install app* / *Add to Home screen*.
3. It now opens full-screen from the home screen like a normal app and works
   in airplane mode — a service worker caches the whole app on first visit.

## What she can do

**Studios** — add each place she teaches at, with its rate (per class or per
hour), colour, address and contact. Every new class picks up that studio's
rate automatically, and a single class can override it.

**Classes** — add, edit, move or delete a class: studio, name, date, start
time, length, pay, notes. "Repeat weekly" creates up to 52 occurrences in one
go; editing or deleting one of those asks whether to apply the change to just
that class or to it and every future one in the series.

**Finishing a class** — tap **✓ Finish**, and the amount is pre-filled from the
rate (with ×0.5 / ×1 / ×1.5 shortcuts for a short or double session). She can
correct the amount and the actual length, note how many students came, and
tick whether she has already been paid. Classes that ended without being
closed are listed at the top of *Today* as "Waiting to be closed".

**Earnings** — week / month / year totals: earned, still expected, unpaid,
average per class and per hour, an optional monthly goal, and a breakdown per
studio. Unpaid classes are listed with a one-tap "mark all as paid", and
everything exports to CSV for a spreadsheet or an accountant.

**Backup** — Settings → save a backup file (JSON) and restore it on another
phone. Worth doing before changing phone or clearing the browser.

## Reminders — how they actually work

There are two layers, because a web page cannot wake a sleeping phone by
itself:

1. **Phone notifications** (Settings → *Turn on phone notifications*): a nudge
   before each class, plus one after a class ends to record the earnings.
   These fire while the app is open or sitting in the background. They are
   free and need no internet — but if the phone kills the app from memory,
   nothing fires.
2. **Phone calendar (the reliable one)**: any class, a whole month, or every
   upcoming class can be exported as a `.ics` calendar file with an alarm
   built in. Open the downloaded file once and the phone's own calendar rings
   the alarm — always, offline, even if the app is closed. This is the option
   to use for classes she must not miss.

For a true push notification that arrives with the app fully closed, a server
and a push subscription would be needed; that is deliberately out of scope
here so the app stays offline and private.

## Sending a message / email / WhatsApp

Any class ( ⋯ More → *Send* ) or an earnings summary ( Earnings → *Send
earnings summary* ) can be sent as text through **WhatsApp, SMS, email**, the
phone's own share sheet, or simply copied. Her own number and email go in
Settings so the shortcuts are pre-addressed. WhatsApp and email need an
internet connection — everything else in the app works offline.

## Files

```
public/instructor/
  index.html             the whole app (UI + logic + styles)
  sw.js                  service worker: offline cache + notification taps
  manifest.webmanifest   makes it installable as a home-screen app
  icon.svg, icon-maskable.svg
```

`next.config.js` rewrites `/instructor` to `/instructor/index.html` and sends
no-cache headers for the app's service worker.
