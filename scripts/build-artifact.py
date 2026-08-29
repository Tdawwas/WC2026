#!/usr/bin/env python3
"""Build the claude.ai Artifact edition of the instructor app from the
offline source in public/instructor/index.html.

The artifact viewer wraps the file in its own <!doctype>/<head>/<body>, so the
page ships as title + styles + markup + scripts only. Two things change:
  * saving also writes a copy into the artifact itself (data/state.json), so
    her classes survive a cleared browser or a different phone;
  * downloads (calendar, CSV, backup) go through the downloads capability,
    because the viewer sandbox blocks a page's own download links.
"""
import io, re, sys, pathlib

SRC = pathlib.Path("public/instructor/index.html")
OUT = pathlib.Path("public/instructor/artifact.html")
src = io.open(SRC, encoding="utf-8").read()

style = re.search(r"<style>.*?</style>", src, re.S).group(0)
markup = re.search(r'<header class="top">.*?<div id="modal"></div>', src, re.S).group(0)
script = re.search(r"<script>\n\"use strict\";.*?</script>", src, re.S).group(0)

# The service worker and web manifest belong to the self-hosted copy only.
script = script.replace(
    '''if("serviceWorker" in navigator && location.protocol!=="file:"){
  window.addEventListener("load", ()=> navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
''', "")

# Settings copy: in the artifact the data lives in the link, not just the phone.
script = script.replace(
    "Everything is stored only on this phone. Save a backup before changing phone or clearing your browser.",
    "Your classes are saved into this link, so they come back whenever you open it — on this phone or another one. "
    "A backup file is an extra copy you can keep.")

fonts = ('<link rel="stylesheet" '
         'href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&display=swap">')

# Archivo carries the data — times, money, stat values, brand — over the UI stack.
type_layer = """<style>
:root{ --display:"Archivo","Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
.brand, .stat .v, .cls-time .t, .cls-pay, .money, .sheet h2, .btn, .seg button{
  font-family:var(--display); font-variant-numeric:tabular-nums; letter-spacing:-.01em;
}
.stat .k, .section-title, .cls-pay .lbl, label.f > span, .list-day{ font-family:var(--display); }
#syncPill{
  display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:700;
  padding:5px 9px; border-radius:999px; border:1px solid var(--line); background:var(--card);
  color:var(--muted); white-space:nowrap;
}
#syncPill b{ width:7px; height:7px; border-radius:99px; background:var(--muted); }
#syncPill.ok b{ background:var(--ok); } #syncPill.ok{ color:var(--ok); }
#syncPill.busy b{ background:var(--accent); animation:pulseDot 1s ease-in-out infinite; }
#syncPill.local b{ background:var(--warn); }
@keyframes pulseDot{ 50%{ opacity:.25 } }
@media (prefers-reduced-motion:reduce){ *{ animation:none !important; transition:none !important } }
</style>"""

cloud = """<script>
/* =========================================================================
   Keeping her data — two places, so nothing is ever lost on close/reopen.

   1. This browser (localStorage): instant, works offline, survives closing
      the app and the phone restarting.
   2. This link itself: a copy of the data is published back into the
      artifact as data/state.json. That is what makes the classes come back
      after a cleared browser, a new browser, or a different phone — whoever
      opens the link gets the latest saved state.

   The page always renders from the local copy first, then adopts the copy in
   the link if that one is newer.
   ========================================================================= */
(function(){
  "use strict";
  const STATE_FILE = "data/state.json";
  const host = (typeof claude !== "undefined" && claude && typeof claude.use === "function") ? claude : null;
  let api = null;             // artifact capability, once it resolves
  let mode = "local";         // local | readonly
  let timer = null, inFlight = false, dirty = false, adopted = false;

  /* What the data looks like ignoring bookkeeping, so a plain re-render
     (which also calls save) never mints a new version for nothing. */
  const sigOf = () => JSON.stringify(state, (k,v)=> (k==="updatedAt"||k==="notified") ? undefined : v);
  let lastSig = sigOf();

  const pill = document.createElement("span");
  pill.id = "syncPill";
  pill.innerHTML = '<b></b><span>Saved on this phone</span>';
  const actions = document.querySelector(".top-actions");
  if(actions) actions.insertBefore(pill, actions.firstChild);

  function setPill(cls, text){
    pill.className = cls;
    pill.lastChild.textContent = text;
  }
  setPill("ok", "Saved on this phone");

  /* --- wrap save() so every change queues a copy into the link --- */
  const localSave = save;
  save = function(){
    const sig = sigOf();
    const changed = sig !== lastSig;
    if(changed){ lastSig = sig; state.updatedAt = Date.now(); }
    localSave();
    if(changed || dirty) queue();
  };

  function queue(){
    if(!api || mode==="readonly") return;
    dirty = true;
    setPill("busy", "Saving…");
    clearTimeout(timer);
    timer = setTimeout(push, 2500);   // batch a burst of edits into one write
  }

  async function push(){
    if(!api || inFlight || !dirty) return;
    inFlight = true; dirty = false;
    try{
      await api.publish({ [STATE_FILE]: JSON.stringify(state) });
      setPill("ok", "Saved to this link");
    }catch(err){
      const code = (err && err.code) || "upstream_error";
      if(code==="conflict"){
        // Another view saved first; this one reloads to it. Nothing to do.
        setPill("busy", "Updating…");
      }else if(code==="not_writer" || code==="not_granted" || code==="not_declared" || code==="capability_disabled"){
        mode = "readonly";
        setPill("local", "Saved on this phone");
      }else if(code==="rate_limited"){
        dirty = true;
        clearTimeout(timer); timer = setTimeout(push, 15000);
        setPill("busy", "Saving…");
      }else{
        dirty = true;
        clearTimeout(timer); timer = setTimeout(push, 8000);
        setPill("local", "Saved on this phone");
      }
    }finally{
      inFlight = false;
      if(dirty) queue();
    }
  }

  /* --- adopt the copy in the link when it is newer than this browser's --- */
  async function adopt(){
    try{
      const res = await fetch(STATE_FILE + "?t=" + Date.now(), {cache:"no-store"});
      if(!res.ok) return;
      const remote = await res.json();
      if(!remote || !Array.isArray(remote.classes)) return;
      const mine = Number(state.updatedAt)||0, theirs = Number(remote.updatedAt)||0;
      const empty = !state.classes.length && !state.studios.length;
      if(theirs > mine || (empty && (remote.classes.length || remote.studios.length))){
        const base = blankState();
        state = Object.assign(base, remote, {settings: Object.assign(base.settings, remote.settings||{})});
        lastSig = sigOf();
        localSave();
        render();
        if(!adopted && (remote.classes.length || remote.studios.length)){
          adopted = true;
          toast("Your classes are back");
        }
      }
    }catch(e){ /* first version has no data file yet — nothing to adopt */ }
  }

  if(!host){ setPill("local", "Saved on this phone"); return; }
  host.use("artifact").then(ns=>{
    if(!ns){ setPill("local", "Saved on this phone"); return; }
    api = ns;
    setPill("ok", "Saved to this link");
    adopt();
    // a change made before the capability arrived still needs writing out
    if(state.classes.length || state.studios.length) queue();
  }).catch(()=> setPill("local", "Saved on this phone"));

  // last chance to flush when she leaves the page
  document.addEventListener("visibilitychange", ()=>{ if(document.hidden && dirty) push(); });

  /* --- downloads: the viewer sandbox blocks a page's own download links --- */
  let saver = null;
  host.use("downloads").then(ns=>{ saver = ns; }).catch(()=>{});
  const localDownload = downloadFile;
  downloadFile = function(name, mime, text){
    if(saver){
      saver.save({filename:name, data:text})
        .catch(err=>{
          const code = (err && err.code) || "";
          if(code!=="declined" && code!=="cancelled") toast("Could not save the file here");
        });
      return;
    }
    localDownload(name, mime, text);
  };
})();
</script>"""

out = "\n".join([
    "<title>Studio Class Tracker</title>",
    fonts,
    style,
    type_layer,
    "",
    markup,
    "",
    script,
    cloud,
    "",
])
io.open(OUT, "w", encoding="utf-8").write(out)
print("wrote", OUT, len(out), "bytes")
