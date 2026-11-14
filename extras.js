/* =====================================================================
   EXTRAS — som, confete, pétalas, corações de pelúcia, toque na garra,
   carta digitada, convite final e progresso salvo.
   Carregado DEPOIS do script.js (usa as variáveis dele).
   ===================================================================== */
(() => {
  "use strict";

  /* ---------- CONFIGURE AQUI O CONVITE FINAL (opcional) ----------
     quando:   ex. "sábado, 20h"
     onde:     ex. "Restaurante X"
     whatsapp: número com DDI+DDD, só dígitos, ex. "5547999999999"
               (se ficar vazio, o botão do WhatsApp não aparece)          */
  const CONVITE = {
    quando: "",
    onde: "",
    whatsapp: "",
    mensagem: "Aceito o convite, minha princesa! 💗"
  };

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const esc = str => String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const vibrate = pattern => { try { navigator.vibrate?.(pattern); } catch (_) {} };

  const store = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch (_) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} },
    del(key) { try { localStorage.removeItem(key); } catch (_) {} }
  };
  const PROGRESS_KEY = "mc_progress_v1";
  if (/[?&]reset\b/.test(location.search)) {
    store.del(PROGRESS_KEY);
    history.replaceState(null, "", location.pathname);
  }

  /* =====================================================================
     SOM — tudo sintetizado pelo navegador (WebAudio), sem arquivos.
     ===================================================================== */
  const Fx = (() => {
    let ctx = null, master, sfxBus, musicBus, noiseBuf;
    let started = false, timer = null, nextT = 0, chordI = 0;
    let muted = store.get("mc_muted", false);
    let toggleBtn = null;
    const hz = n => 440 * Math.pow(2, (n - 69) / 12);
    // Lá menor – Fá – Dó – Sol: clima suave e romântico
    const chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];

    function ensure() {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        ctx = new AC();
        master = ctx.createGain(); master.gain.value = muted ? 0 : 1; master.connect(ctx.destination);
        sfxBus = ctx.createGain(); sfxBus.gain.value = .9; sfxBus.connect(master);
        musicBus = ctx.createGain(); musicBus.gain.value = .5; musicBus.connect(master);
        const delay = ctx.createDelay(1); delay.delayTime.value = .42;
        const feedback = ctx.createGain(); feedback.gain.value = .38;
        const wet = ctx.createGain(); wet.gain.value = .35;
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2400;
        musicBus.connect(delay); delay.connect(lp); lp.connect(feedback); feedback.connect(delay); lp.connect(wet); wet.connect(master);
        noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        const data = noiseBuf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === "suspended") ctx.resume();
      return true;
    }

    function tone({ f, f2, t, d, type = "sine", v = .12, a = .008, dest }) {
      const t0 = t ?? ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f, t0);
      if (f2) osc.frequency.exponentialRampToValueAtTime(f2, t0 + d);
      g.gain.setValueAtTime(.0001, t0);
      g.gain.linearRampToValueAtTime(v, t0 + a);
      g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
      osc.connect(g); g.connect(dest || sfxBus);
      osc.start(t0); osc.stop(t0 + d + .05);
    }

    function noise({ f, f2, t, d, v = .1, a = .01, q = 1, ftype = "bandpass" }) {
      const t0 = t ?? ctx.currentTime;
      const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
      const filter = ctx.createBiquadFilter(); filter.type = ftype; filter.Q.value = q;
      filter.frequency.setValueAtTime(f, t0);
      if (f2) filter.frequency.exponentialRampToValueAtTime(f2, t0 + d);
      const g = ctx.createGain();
      g.gain.setValueAtTime(.0001, t0);
      g.gain.linearRampToValueAtTime(v, t0 + a);
      g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
      src.connect(filter); filter.connect(g); g.connect(sfxBus);
      src.start(t0); src.stop(t0 + d + .05);
    }

    function bell(freq, t, vol = .09, dur = .9) {
      tone({ f: freq, t, d: dur, type: "sine", v: vol, a: .005 });
      tone({ f: freq * 2.01, t, d: dur * .6, type: "sine", v: vol * .35, a: .005 });
      tone({ f: freq * 3.02, t, d: dur * .35, type: "sine", v: vol * .15, a: .005 });
    }

    function motor(t, d, f1, f2) {
      const osc = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
      osc.type = "sawtooth"; lp.type = "lowpass"; lp.frequency.value = 520;
      osc.frequency.setValueAtTime(f1, t); osc.frequency.linearRampToValueAtTime(f2, t + d);
      g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.045, t + .06);
      g.gain.setValueAtTime(.045, t + d - .08); g.gain.linearRampToValueAtTime(.0001, t + d);
      osc.connect(lp); lp.connect(g); g.connect(sfxBus);
      osc.start(t); osc.stop(t + d + .05);
    }

    function scheduleChord(t) {
      const chord = chords[chordI % chords.length];
      chord.forEach(n => tone({ f: hz(n), t, d: 3.9, type: "triangle", v: .035, a: 1, dest: musicBus }));
      tone({ f: hz(chord[0] - 12), t, d: 3.3, type: "sine", v: .07, a: .05, dest: musicBus });
      const notes = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[0] + 24];
      const patterns = [[0, 1, 2, 3, 2, 1, 2, 1], [0, 2, 1, 3, 1, 2, 3, 2]];
      const pattern = patterns[chordI % 2];
      pattern.forEach((idx, i) => tone({ f: hz(notes[idx]), t: t + i * .4, d: 1.2, type: "triangle", v: .045, a: .01, dest: musicBus }));
      chordI++;
    }

    function start() {
      if (!ensure()) return;
      if (started) return;
      started = true;
      nextT = ctx.currentTime + .2;
      timer = setInterval(() => {
        if (!ctx || ctx.state !== "running") return;
        while (nextT < ctx.currentTime + 1.2) { scheduleChord(nextT); nextT += 3.2; }
      }, 400);
    }

    function setMuted(value) {
      muted = value;
      store.set("mc_muted", muted);
      if (ctx) master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, .05);
      renderToggle();
    }

    function renderToggle() {
      if (!toggleBtn) return;
      toggleBtn.textContent = muted ? "🔇" : "🔊";
      toggleBtn.setAttribute("aria-label", muted ? "Ligar o som" : "Desligar o som");
      toggleBtn.title = muted ? "Ligar o som" : "Desligar o som";
    }

    function mountToggle() {
      toggleBtn = document.createElement("button");
      toggleBtn.id = "sound-toggle"; toggleBtn.type = "button";
      toggleBtn.addEventListener("click", () => {
        start();
        setMuted(!muted);
      });
      document.body.appendChild(toggleBtn);
      renderToggle();
    }

    const play = fn => (...args) => { if (muted || !ensure()) return; fn(...args); };
    const api = {
      start, setMuted, mountToggle,
      click: play(() => tone({ f: 880, f2: 640, d: .07, v: .045 })),
      tick: play(() => noise({ f: rand(2200, 3200), d: .028, v: .03, q: 2 })),
      good: play(() => { const t = ctx.currentTime; [660, 880, 1175].forEach((f, i) => tone({ f, t: t + i * .07, d: .25, type: "triangle", v: .08 })); }),
      bad: play(() => { const t = ctx.currentTime; tone({ f: 300, f2: 190, t, d: .3, type: "triangle", v: .08 }); }),
      pageTurn: play(() => { const t = ctx.currentTime; noise({ f: 1800, f2: 500, t, d: .38, v: .11, a: .05, q: .7 }); noise({ f: 5200, t: t + .05, d: .2, v: .03, q: .5 }); }),
      drop: play(() => { const t = ctx.currentTime; motor(t, .72, 130, 230); motor(t + .98, .68, 230, 130); }),
      catch: play(() => { const t = ctx.currentTime; bell(1046, t, .1, .6); bell(1568, t + .08, .06, .5); }),
      miss: play(() => { const t = ctx.currentTime; tone({ f: 330, f2: 230, t, d: .3, type: "triangle", v: .08 }); tone({ f: 220, f2: 160, t: t + .2, d: .4, type: "triangle", v: .08 }); }),
      prize: play(() => { const t = ctx.currentTime; [523, 659, 784, 1046, 1319].forEach((f, i) => bell(f, t + i * .09, .08, 1)); noise({ f: 7000, t, d: .5, v: .02, q: .5 }); }),
      fanfare: play(() => {
        const t = ctx.currentTime;
        [523, 659, 784].forEach(f => tone({ f, t, d: 1.6, type: "triangle", v: .07, a: .03 }));
        [784, 1046, 1319, 1568].forEach((f, i) => bell(f, t + .25 + i * .12, .08, 1.2));
        for (let i = 0; i < 8; i++) bell(rand(1500, 2800), t + .6 + rand(0, .9), .035, .5);
      }),
      chest: play(() => {
        const t = ctx.currentTime;
        tone({ f: 90, f2: 40, t, d: .6, v: .25 });
        noise({ f: 300, f2: 760, t, d: .7, v: .08, q: 3 });
        [523, 784, 1046, 1568].forEach((f, i) => bell(f, t + .4 + i * .1, .08, 1.2));
      }),
      seal: play(() => {
        const t = ctx.currentTime;
        noise({ f: 3000, f2: 800, t, d: .15, v: .2 });
        tone({ f: 500, f2: 250, t, d: .12, v: .1 });
        bell(880, t + .15, .08, .9);
      }),
      sparkle: play(() => { const t = ctx.currentTime; for (let i = 0; i < 5; i++) bell(rand(1400, 2600), t + i * .07, .04, .5); }),
      get muted() { return muted; }
    };
    return api;
  })();
  window.Fx = Fx;
  Fx.mountToggle();

  // O navegador só libera áudio após um toque; a música começa no primeiro.
  ["pointerdown", "keydown"].forEach(type => addEventListener(type, () => Fx.start(), { once: true, capture: true }));
  document.addEventListener("click", event => {
    const button = event.target.closest?.("button");
    if (button && button.id !== "sound-toggle") Fx.click();
  }, true);
  document.addEventListener("visibilitychange", () => { /* a música pausa sozinha quando a aba fica em segundo plano */ });

  /* =====================================================================
     CONFETE
     ===================================================================== */
  const Confetti = (() => {
    let cv = null, c = null, parts = [], raf = 0;
    const COLORS = ["#ff7fa8", "#ffd36e", "#c9a7ff", "#ffffff", "#ff5c93", "#9fd7ff"];

    function resize() {
      if (!cv) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function ensure() {
      if (cv) return;
      cv = document.createElement("canvas");
      cv.id = "confetti-canvas"; cv.setAttribute("aria-hidden", "true");
      document.body.appendChild(cv);
      c = cv.getContext("2d");
      resize();
      addEventListener("resize", resize);
    }
    function burst(x, y, n = 80, { power = 9, up = false, down = false } = {}) {
      if (reduceMotion) return;
      ensure();
      for (let i = 0; i < n; i++) {
        let angle = rand(0, Math.PI * 2);
        if (up) angle = -Math.PI / 2 + rand(-.9, .9);
        if (down) angle = Math.PI / 2 + rand(-.6, .6);
        const speed = rand(down ? 1.5 : 3, power);
        parts.push({
          x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - (up ? 4 : 0),
          rot: rand(0, 6.28), vr: rand(-.3, .3), w: rand(6, 11), h: rand(4, 8),
          color: pick(COLORS), heart: Math.random() < .35, life: rand(90, 170), age: 0
        });
      }
      if (parts.length > 520) parts.splice(0, parts.length - 520);
      if (!raf) raf = requestAnimationFrame(loop);
    }
    function rain(ms = 2000) {
      if (reduceMotion) return;
      const end = performance.now() + ms;
      const id = setInterval(() => {
        if (performance.now() > end) { clearInterval(id); return; }
        burst(rand(0, innerWidth), -12, 7, { down: true, power: 4 });
      }, 110);
    }
    function loop() {
      c.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter(p => p.age < p.life && p.y < innerHeight + 30);
      for (const p of parts) {
        p.age++; p.vy += .2; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        c.save();
        c.globalAlpha = Math.min(1, (p.life - p.age) / 30);
        c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = p.color;
        if (p.heart) { c.font = `${p.w * 1.8}px serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("♥", 0, 0); }
        else c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        c.restore();
      }
      if (parts.length) raf = requestAnimationFrame(loop);
      else { raf = 0; c.clearRect(0, 0, innerWidth, innerHeight); }
    }
    return { burst, rain };
  })();

  /* =====================================================================
     PÉTALAS — caem na tela do baú e da carta
     ===================================================================== */
  const Petals = (() => {
    let layer = null, timer = null, mode = "off";
    const COLORS = ["#c9a7ff", "#b08cf0", "#e3d4ff", "#f7b8d4", "#ffd0e3"];
    function ensure() {
      if (layer) return;
      layer = document.createElement("div");
      layer.className = "petal-layer"; layer.setAttribute("aria-hidden", "true");
      document.body.appendChild(layer);
    }
    function spawn() {
      if (!layer || layer.childElementCount > 42) return;
      const petal = document.createElement("span");
      petal.className = "petal";
      const size = rand(12, 24);
      petal.style.cssText = `left:${rand(-5, 100)}%;width:${size}px;height:${size * .72}px;` +
        `background:radial-gradient(ellipse at 30% 30%,#fff9,${pick(COLORS)} 65%);` +
        `--dx:${rand(-140, 140)}px;--dur:${rand(9, 16)}s;--spin:${rand(260, 720)}deg;`;
      petal.addEventListener("animationend", () => petal.remove(), { once: true });
      layer.appendChild(petal);
    }
    function set(next) {
      if (next === mode) return;
      mode = next;
      clearInterval(timer); timer = null;
      if (mode === "off" || reduceMotion) return;
      ensure();
      for (let i = 0; i < 14; i++) setTimeout(spawn, i * 140);
      timer = setInterval(spawn, 520);
    }
    return { set };
  })();

  /* =====================================================================
     CORAÇÕES DE PELÚCIA (SVG) + coração levado pelo anzol
     ===================================================================== */
  const defs = document.createElement("div");
  defs.className = "svg-defs"; defs.setAttribute("aria-hidden", "true");
  defs.innerHTML = `<svg width="0" height="0" style="position:absolute"><defs>
    <linearGradient id="plushPink" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#ffb3cf"/><stop offset=".55" stop-color="#ff7fa8"/><stop offset="1" stop-color="#f0507f"/></linearGradient>
    <radialGradient id="plushShine" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs></svg>`;
  document.body.appendChild(defs);

  const HEART_PATH = "M32 57C9 41 2 28 2 18C2 9 9 3 17 3C24 3 29 7 32 13C35 7 40 3 47 3C55 3 62 9 62 18C62 28 55 41 32 57Z";
  const plushSVG = `<svg class="plush-svg" viewBox="0 0 64 60" aria-hidden="true">
    <path d="${HEART_PATH}" fill="url(#plushPink)" stroke="#d93d72" stroke-width="2" stroke-linejoin="round"/>
    <path d="M32 51C13 38 7 27 7 19C7 12 12 8 17 8C23 8 27 11 32 19" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.4" stroke-dasharray="3 3" stroke-linecap="round"/>
    <ellipse cx="19" cy="15" rx="7" ry="4.5" fill="url(#plushShine)" transform="rotate(-30 19 15)"/>
    <ellipse cx="24" cy="27" rx="2" ry="2.6" fill="#5a2640"/><ellipse cx="40" cy="27" rx="2" ry="2.6" fill="#5a2640"/>
    <circle cx="18" cy="33" r="3.2" fill="#ff4f86" opacity=".45"/><circle cx="46" cy="33" r="3.2" fill="#ff4f86" opacity=".45"/>
    <path d="M28 33q4 4 8 0" fill="none" stroke="#5a2640" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`;
  document.querySelectorAll(".heart-prize").forEach((el, i) => {
    el.innerHTML = `<span class="plush-heart" style="--sway-delay:${(i * -.45).toFixed(2)}s">${plushSVG}</span>`;
  });
  const carriedSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 60"><defs><linearGradient id="g" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#ffb3cf"/><stop offset=".55" stop-color="#ff7fa8"/><stop offset="1" stop-color="#f0507f"/></linearGradient></defs><path d="${HEART_PATH}" fill="url(#g)" stroke="#d93d72" stroke-width="2" stroke-linejoin="round"/><ellipse cx="19" cy="15" rx="7" ry="4.5" fill="#fff" opacity=".6" transform="rotate(-30 19 15)"/><ellipse cx="24" cy="27" rx="2" ry="2.6" fill="#5a2640"/><ellipse cx="40" cy="27" rx="2" ry="2.6" fill="#5a2640"/><path d="M28 33q4 4 8 0" fill="none" stroke="#5a2640" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  document.documentElement.style.setProperty("--carried-heart", `url("data:image/svg+xml,${encodeURIComponent(carriedSVG)}")`);

  /* =====================================================================
     MÁQUINA: toque/arraste, sons, confete e mensagens ao errar
     ===================================================================== */
  const MISS = [
    "Quase! O anzol só pegou ar desta vez. Tenta mais para o lado! 💛",
    "Ops… esse coração escapou rindo de você! 😆",
    "Ficou pertinho! Mexe só um tiquinho e tenta de novo. ✨",
    "O anzol voltou sem nada, mas com muito charme. 😌",
    "Hmm, o coração desviou! Ajusta a mira, cavaleiro. 🎯",
    "Foi por pouco! Os corações estão se escondendo de você. 🙈"
  ];
  let missMsg = MISS[0];
  let lastClawClass = "";
  new MutationObserver(() => {
    const now = claw.className;
    const dropped = now.includes("dropping") && !lastClawClass.includes("dropping");
    const carried = now.includes("carrying") && !lastClawClass.includes("carrying");
    lastClawClass = now;
    if (dropped) {
      Fx.drop();
      missMsg = pick(MISS);
      setTimeout(() => { if (!claw.classList.contains("carrying")) Fx.miss(); }, 950);
    }
    if (carried) {
      Fx.catch();
      vibrate([30, 40, 60]);
      const r = claw.getBoundingClientRect();
      Confetti.burst(r.left + r.width / 2, r.bottom - 24, 36, { power: 7 });
    }
  }).observe(claw, { attributes: true, attributeFilter: ["class"] });

  new MutationObserver(() => {
    if (/voltou vazio|Nenhum coração foi fisgado/.test(machineHint.textContent)) machineHint.textContent = missMsg;
  }).observe(machineHint, { childList: true, characterData: true, subtree: true });

  // Arrastar a garra com o dedo/mouse (além dos botões ◀ ▶).
  const machineWindow = $(".machine-window");
  let dragging = false;
  function dragTo(clientX) {
    if (grabInProgress || machineScreen.hidden) return;
    const rect = machineWindow.getBoundingClientRect();
    clawPosition = Math.max(7, Math.min(93, ((clientX - rect.left) / rect.width) * 100));
    updateClaw();
  }
  machineWindow.addEventListener("pointerdown", e => { dragging = true; dragTo(e.clientX); });
  machineWindow.addEventListener("pointermove", e => { if (dragging) dragTo(e.clientX); });
  ["pointerup", "pointercancel", "pointerleave"].forEach(t => machineWindow.addEventListener(t, () => { dragging = false; }));

  // Popup de prêmio: jingle, confete e vibração.
  new MutationObserver(() => {
    if (!prizePop.hidden) {
      Fx.prize();
      vibrate([60, 40, 100]);
      Confetti.burst(innerWidth / 2, innerHeight / 2, 110, { power: 11 });
    }
  }).observe(prizePop, { attributes: true, attributeFilter: ["hidden"] });

  new MutationObserver(() => {
    if (!giftRecapOverlay.hidden) { Fx.fanfare(); Confetti.rain(2600); }
  }).observe(giftRecapOverlay, { attributes: true, attributeFilter: ["hidden"] });

  /* =====================================================================
     BAÚ E ENVELOPE: sons e confete
     ===================================================================== */
  new MutationObserver(() => {
    if (treasureScreen.classList.contains("chest-transition")) Fx.chest();
    if (treasureScreen.classList.contains("chest-revealed")) {
      Confetti.burst(innerWidth / 2, innerHeight * .45, 120, { power: 12 });
      Fx.sparkle();
    }
  }).observe(treasureScreen, { attributes: true, attributeFilter: ["class"] });

  new MutationObserver(() => {
    if (openEnvelopeButton.classList.contains("envelope-opening")) { Fx.seal(); vibrate(40); }
  }).observe(openEnvelopeButton, { attributes: true, attributeFilter: ["class"] });

  /* =====================================================================
     CARTA: fundo anime, texto digitado e convite final
     ===================================================================== */
    const letterBody = $("#love-letter-text");
  const letterEnding = $(".letter-ending");
  let invite = null, typingStarted = false;

  function buildInvite() {
    const detail = [CONVITE.quando, CONVITE.onde].filter(Boolean).join(" · ");
    const box = document.createElement("div");
    box.className = "invite-box"; box.hidden = true;
    box.innerHTML = `
      <img class="invite-chibi" src="assets/anime/medalha-2.jpg" alt="" draggable="false">
      ${detail ? `<p class="invite-detail">${esc(detail)}</p>` : ""}
      <div class="invite-actions">
        <button type="button" class="invite-yes">Aceito, minha princesa 💗</button>
        <button type="button" class="invite-maybe">Deixa eu pensar…</button>
      </div>
      <p class="invite-reply" hidden></p>`;
    letterEnding.after(box);

    const yes = $(".invite-yes", box), maybe = $(".invite-maybe", box), reply = $(".invite-reply", box);

    // "Deixa eu pensar…" some da tela assim que é clicado.
    maybe.addEventListener("click", () => {
      maybe.classList.add("vanish");
      maybe.disabled = true;
      setTimeout(() => maybe.remove(), 400);
    });
    yes.addEventListener("click", () => {
      if (yes.dataset.done) return;
      yes.dataset.done = "1";
      $(".invite-actions", box).hidden = true;
      reply.hidden = false;
      reply.innerHTML = `Então está combinado! ${detail ? `Te espero: <strong>${esc(detail)}</strong>. ` : ""}Eu te amo, meu príncipe ❤️`;
      if (CONVITE.whatsapp) {
        const link = document.createElement("a");
        link.className = "invite-wa"; link.target = "_blank"; link.rel = "noopener";
        link.href = `https://wa.me/${CONVITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(CONVITE.mensagem)}`;
        link.textContent = "Avisar no WhatsApp 💬";
        reply.after(link);
      }
      Fx.fanfare();
      vibrate([80, 50, 80, 50, 160]);
      Confetti.burst(innerWidth / 2, innerHeight * .6, 160, { power: 13 });
      Confetti.rain(2500);
    });
    return box;
  }

  function startTyping() {
    const full = letterBody.textContent;
    invite = buildInvite();
    if (reduceMotion) { invite.hidden = false; return; }

    letterBody.textContent = "";
    const node = document.createTextNode("");
    letterBody.appendChild(node);
    letterBody.setAttribute("contenteditable", "false");
    letterBody.classList.add("typing");
    letterEnding.classList.add("fade-hidden");

    let i = 0, skip = false, timer = null;
    const skipNow = () => { skip = true; };
    royalLetter.addEventListener("click", skipNow, { once: true });

    const finish = () => {
      clearTimeout(timer);
      node.nodeValue = full;
      letterBody.classList.remove("typing");
      letterBody.setAttribute("contenteditable", "true");
      letterEnding.classList.remove("fade-hidden");
      invite.hidden = false;
      invite.classList.add("invite-arrive");
      Fx.sparkle();
      royalLetter.scrollTo({ top: royalLetter.scrollHeight, behavior: "smooth" });
    };

    const step = () => {
      if (skip || i >= full.length) { finish(); return; }
      const ch = full[i++];
      node.nodeValue = full.slice(0, i);
      if (i % 2 === 0 && /\S/.test(ch)) Fx.tick();
      royalLetter.scrollTop = royalLetter.scrollHeight;
      let delay = 34;
      if (",;".includes(ch)) delay += 160;
      if (".!?…".includes(ch)) delay += 320;
      if (ch === "\n") delay += 220;
      timer = setTimeout(step, delay);
    };
    timer = setTimeout(step, 700);
  }

  new MutationObserver(() => {
    if (!royalLetter.hidden && !typingStarted) { typingStarted = true; startTyping(); }
  }).observe(royalLetter, { attributes: true, attributeFilter: ["hidden"] });

  /* =====================================================================
     PROGRESSO SALVO + pétalas por tela
     ===================================================================== */
  const screens = [[quizScreen, "quiz"], [machineScreen, "machine"], [treasureScreen, "treasure"], [letterScreen, "letter"]];
  let restoring = false;
  const heartEls = [...document.querySelectorAll(".heart-prize")];

  function currentStage() {
    const found = screens.find(([el]) => !el.hidden);
    return found ? found[1] : null;
  }
  function saveProgress() {
    if (restoring) return;
    const stage = currentStage();
    if (!stage) return;
    const hearts = heartEls.map((el, i) => (el.classList.contains("collected") ? i : -1)).filter(i => i >= 0);
    store.set(PROGRESS_KEY, { stage, hearts, ts: Date.now() });
  }
  function onStageChange() {
    const stage = currentStage();
    Petals.set(stage === "treasure" || stage === "letter" ? "rich" : "off");
    saveProgress();
  }
  screens.forEach(([el]) => new MutationObserver(onStageChange).observe(el, { attributes: true, attributeFilter: ["hidden"] }));
  new MutationObserver(saveProgress).observe(collectionCount, { childList: true, characterData: true, subtree: true });

  function showResumeToast() {
    const toast = document.createElement("div");
    toast.className = "resume-toast";
    toast.innerHTML = `<span>Continuando de onde você parou 💗</span><button type="button">Recomeçar</button>`;
    $("button", toast).addEventListener("click", () => { store.del(PROGRESS_KEY); location.reload(); });
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("hide"), 6500);
    setTimeout(() => toast.remove(), 7300);
  }

  (function restore() {
    const saved = store.get(PROGRESS_KEY, null);
    if (!saved || !saved.stage) return;
    restoring = true;
    introStarted = true;
    heartIntro.hidden = true;
    entryScreen.hidden = true;
    if (cornerNote) cornerNote.hidden = true;

    (saved.hearts || []).forEach((heartIndex, k) => {
      heartEls[heartIndex]?.classList.add("collected");
      collectedPrizes.add(k);
    });
    renderCollection();

    if (saved.stage === "quiz") {
      quizScreen.hidden = false;
      bookCover.classList.add("cover-arrive");
    } else if (saved.stage === "machine") {
      machineScreen.hidden = false;
      updateClaw();
      if (collectedPrizes.size === prizeDetails.length) setTimeout(startGiftRecap, 700);
    } else if (saved.stage === "treasure") {
      treasureScreen.hidden = false;
      treasureScreen.classList.add("treasure-arrive");
    } else if (saved.stage === "letter") {
      letterScreen.hidden = false;
      envelopeScene.classList.add("envelope-arrive");
    }
    restoring = false;
    onStageChange();
    showResumeToast();
  })();
})();
