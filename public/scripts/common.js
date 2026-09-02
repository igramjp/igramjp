/* igram.jp — a patch that rewires itself on every load */

(() => {
  "use strict";

  const PORT_X = 6; // cord anchor: center of the inlet/outlet tab
  const MARGIN = 8; // keep boxes off the viewport edge
  const EASE = 0.35; // how fast a box catches up with the pointer (0..1)

  /* patch graph — add a node in index.html, wire it here */
  const EDGES = [
    ["manabu", "igram"],
    ["manabu", "app"],
    ["manabu", "bamboo"],
    ["manabu", "contact"],
    ["igram", "lab"],
    ["lab", "supercollider"],
  ];

  const INFO = {
    manabu:
      "五十嵐学<br>" +
      "標高940m・八ヶ岳西麓在住、プログラマー。SuperColliderと、雅楽に合わせる電子音。<br>" +
      "Manabu Igarashi<br>" +
      "Programmer based at 940m on the western slopes of Yatsugatake, Japan. SuperCollider, and electronics tuned to gagaku.<br>" +
      "GitHub<br>" +
      '<a href="//github.com/igramjp" target="_blank" rel="noreferrer noopener">https://github.com/igramjp</a><br>' +
      "X<br>" +
      '<a href="https://x.com/igramjp" target="_blank" rel="noreferrer noopener">https://x.com/igramjp</a>',
    igram:
      "©︎ " + new Date().getFullYear() + " igram All rights reserved.<br>",
    lab:
      "IGRAM LAB (note)<br>" +
      "音響プログラミングは、技術として始まり、やがて音楽となる。実験や制作の記録を note で公開しています。<br>" +
      "Sound programming begins as technique and, in time, becomes music. Experiments and process notes, published on note.<br>" +
      '<a href="https://note.com/igram" target="_blank" rel="noreferrer noopener">https://note.com/igram</a>',
    supercollider:
      "SuperCollider<br>" +
      "音響合成とアルゴリズミック・コンポジションのための言語・環境。現在の制作の中心で、IGRAM LAB の実験の多くは SuperCollider で書かれています。<br>" +
      "Sound experiments with SuperCollider — a language and environment for audio synthesis and algorithmic composition, and my main instrument. Most IGRAM LAB experiments are written in it.<br>" +
      '<a href="https://supercollider.github.io/" target="_blank" rel="noreferrer noopener">https://supercollider.github.io/</a>',
    app:
      "oshiki (黄鐘)<br>" +
      "雅楽の十二律(三分損益法・黄鐘 A=430Hz)と純正律・平均律の周波数表を、Web MIDI入力にもリアルタイムで反応する形で表示する実験アプリ。<br>" +
      "oshiki (黄鐘) - Note-to-frequency tables in traditional Japanese and classical tunings (Sanbun-Soneki, just intonation, equal temperament), live via Web MIDI.<br>" +
      '<a href="https://igram.jp/app/oshiki/" target="_blank" rel="noreferrer noopener">https://igram.jp/app/oshiki/</a>',
    bamboo:
      "竹音 (ちくおん/bamboo music)<br>" +
      "長野県富士見町を拠点とするインディペンデントな出版レーベル。音楽と写真を軸に、音源作品、写真集、アートプリント、関連グッズの企画・制作・販売を行っています。<br>" +
      "bamboo music is an independent publishing label based in Fujimi, Nagano, Japan, working across music and photography — recordings, photo books, art prints, and related goods.<br>" +
      '<a href="https://bamboomusic.asia/" target="_blank" rel="noreferrer noopener">https://bamboomusic.asia/</a>',
    contact:
      "CONTACT (Google Forms)<br>" +
      "ご質問やご相談などありましたら、こちらのフォームよりお気軽にお問い合わせください。<br>" +
      "If you have any questions or inquiries, please feel free to contact me using the form below.<br>" +
      '<a href="https://forms.gle/vw2H7nSVmZHRV9369" target="_blank" rel="noreferrer noopener">https://forms.gle/vw2H7nSVmZHRV9369</a>',
  };

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const logEl = document.getElementById("log");
  const newsEl = document.getElementById("news");
  const readCordColor = () =>
    getComputedStyle(document.body).getPropertyValue("--color-darkgray").trim();
  let cordColor = readCordColor();

  const nodes = new Map();
  let zTop = 1;
  let raf = 0;
  let booting = true;

  const clamp = (v, min, max) => Math.max(min, Math.min(v, Math.max(min, max)));

  function place(node) {
    node.el.style.transform = `translate3d(${node.x}px, ${node.y}px, 0)`;
  }

  /* cords plug into the tab: top of a main box, bottom of an args box */
  function port(node) {
    return {
      x: node.x + PORT_X,
      y: node.type === "main" ? node.y : node.y + node.h,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.strokeStyle = cordColor;
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (const [from, to] of EDGES) {
      const a = nodes.get(from);
      const b = nodes.get(to);
      if (!a || !b) continue;
      const p = port(a);
      const q = port(b);
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
    }
    ctx.stroke();
  }

  function frame() {
    raf = 0;
    let moving = false;
    for (const node of nodes.values()) {
      const dx = node.tx - node.x;
      const dy = node.ty - node.y;
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        node.x += dx * EASE;
        node.y += dy * EASE;
        moving = true;
      } else {
        node.x = node.tx;
        node.y = node.ty;
      }
      place(node);
    }
    draw();
    if (moving) raf = requestAnimationFrame(frame);
  }

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  /* spread the random layout: keep boxes off each other and off the text areas */
  function relax() {
    const GAP = 24;
    const list = [...nodes.values()];
    /* dx/dy: which way to escape — away from the corner the zone is anchored to */
    const zones = [
      { x: 0, y: 0, w: 390, h: 240, dx: 1, dy: 1 }, // #log
      { x: 0, y: window.innerHeight - 44, w: 240, h: 44, dx: 1, dy: -1 }, // #status
    ];
    if (window.innerWidth >= 720 && window.innerHeight >= 600) {
      zones.push({
        x: window.innerWidth - 320,
        y: window.innerHeight - 220,
        w: 320,
        h: 220,
        dx: -1,
        dy: -1,
      }); // #news
    }
    for (let round = 0; round < 120; round++) {
      let moved = false;
      for (const node of list) {
        for (const z of zones) {
          const ox = Math.min(node.tx + node.w, z.x + z.w) - Math.max(node.tx, z.x) + GAP;
          const oy = Math.min(node.ty + node.h, z.y + z.h) - Math.max(node.ty, z.y) + GAP;
          if (ox <= 0 || oy <= 0) continue;
          if (ox < oy) node.tx += z.dx * ox;
          else node.ty += z.dy * oy;
          moved = true;
        }
      }
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i];
          const b = list[j];
          const ox = Math.min(a.tx + a.w, b.tx + b.w) - Math.max(a.tx, b.tx) + GAP;
          const oy = Math.min(a.ty + a.h, b.ty + b.h) - Math.max(a.ty, b.ty) + GAP;
          if (ox <= 0 || oy <= 0) continue;
          if (ox < oy) {
            const push = ((a.tx + a.w / 2 < b.tx + b.w / 2 ? -1 : 1) * ox) / 2;
            a.tx += push;
            b.tx -= push;
          } else {
            const push = ((a.ty + a.h / 2 < b.ty + b.h / 2 ? -1 : 1) * oy) / 2;
            a.ty += push;
            b.ty -= push;
          }
          moved = true;
        }
      }
      for (const node of list) {
        node.tx = clamp(node.tx, MARGIN, window.innerWidth - node.w - MARGIN);
        node.ty = clamp(node.ty, MARGIN, window.innerHeight - node.h - MARGIN);
      }
      if (!moved) break;
    }
    for (const node of list) {
      node.x = node.tx;
      node.y = node.ty;
      place(node);
    }
  }

  function showInfo(name) {
    booting = false;
    logEl.innerHTML = INFO[name] || "";
    newsEl.style.display = name === "manabu" ? "" : "none";
  }

  /* audio: each grab blooms a soft sine that slowly decays and echoes away.
     Pitch is quantized to a ritsu pentatonic rooted in the oshiki gamut
     (Oshiki A = 430 Hz), so overlapping notes always agree; dragging up
     and down plays the degrees the box crosses. */
  const SCALE = [0, 2, 5, 7, 9]; // ritsu: D E G A B
  const OCTAVES = 5;
  const STEPS = SCALE.length * OCTAVES + 1;
  const NOTE_ROOT = (430 * Math.pow(2, -7 / 12)) / 4; // D2, two octaves below Oshiki A
  const NOTE_SECONDS = 6;
  let audio = null;
  let activeNotes = 0;
  let lastNoteAt = 0;
  let pendingNode = null; // note that fell on a suspended context; replay on unlock
  function ensureAudio() {
    if (audio) {
      audio.ctx.resume();
      return audio;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const actx = new AC();
    /* some WebViews (e.g. X's in-app browser) create the context suspended
       even inside a gesture */
    if (actx.state === "suspended") actx.resume();
    /* WebKit may resolve resume() before state flips to "running";
       statechange is the reliable moment to flush the held note */
    actx.onstatechange = () => {
      if (actx.state === "running") showHint(false);
      if (actx.state === "running" && pendingNode) {
        const n = pendingNode;
        pendingNode = null;
        playNote(n);
      }
    };
    const master = actx.createGain();
    master.gain.value = 0.9;
    master.connect(actx.destination);
    const delay = actx.createDelay(2);
    delay.delayTime.value = 0.5;
    const feedback = actx.createGain();
    feedback.gain.value = 0.35;
    const wet = actx.createGain();
    wet.gain.value = 0.3;
    master.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(actx.destination);
    /* the Bloom loop: every note returns ~7 s later, a little
       softer and darker each pass, sinking into the garden */
    const loop = actx.createDelay(12);
    loop.delayTime.value = 6.8;
    const loopTone = actx.createBiquadFilter();
    loopTone.type = "lowpass";
    loopTone.frequency.value = 1800;
    const loopFeedback = actx.createGain();
    loopFeedback.gain.value = 0.6;
    const loopWet = actx.createGain();
    loopWet.gain.value = 0.55;
    master.connect(loop);
    loop.connect(loopTone);
    loopTone.connect(loopFeedback);
    loopFeedback.connect(loop);
    loopTone.connect(loopWet);
    loopWet.connect(actx.destination);
    audio = { ctx: actx, master };
    return audio;
  }
  function degreeAt(node) {
    const py = node.type === "main" ? node.ty : node.ty + node.h;
    const ratio = clamp(1 - py / window.innerHeight, 0, 1);
    return Math.round(ratio * (STEPS - 1));
  }
  function playNote(node) {
    try {
      const a = ensureAudio();
      if (!a || activeNotes >= 16) return;
      if (a.ctx.state !== "running") {
        pendingNode = node;
        return;
      }
      const deg = degreeAt(node);
      const octave = Math.floor(deg / SCALE.length);
      const freq = NOTE_ROOT * Math.pow(2, (octave * 12 + SCALE[deg % SCALE.length]) / 12);
      const amp = 0.05 * Math.pow(0.8, octave); // keep high notes gentle
      const t = a.ctx.currentTime;
      const osc = a.ctx.createOscillator();
      const gain = a.ctx.createGain();
      const pan = a.ctx.createStereoPanner ? a.ctx.createStereoPanner() : null;
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(amp, t + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0005, t + NOTE_SECONDS);
      if (pan) {
        pan.pan.value = clamp(((node.tx + PORT_X) / window.innerWidth) * 2 - 1, -0.8, 0.8);
      }
      osc.connect(gain);
      (pan ? (gain.connect(pan), pan) : gain).connect(a.master);
      activeNotes++;
      osc.onended = () => {
        activeNotes = Math.max(0, activeNotes - 1);
      };
      osc.start(t);
      osc.stop(t + NOTE_SECONDS + 0.1);
    } catch (e) { }
  }

  /* X's WebView only honors a clean click as the unlock gesture, and a
     drag never produces one — so when a grab left audio locked, ask for
     one tap (any tap fires the document click listener below) */
  let hintEl = null;
  function showHint(show) {
    if (show && !hintEl) {
      hintEl = document.createElement("div");
      hintEl.id = "audiohint";
      hintEl.innerHTML =
        's.boot; <span class="comment">// tap to boot audio</span>';
      document.body.appendChild(hintEl);
    }
    if (hintEl) hintEl.style.display = show ? "" : "none";
  }

  /* X's in-app browser can inherit a muted audio session from the app
     (silent switch, or a muted timeline video played first): the context
     may even report "running" while Web Audio stays silent, and resume()
     can't fix it. Playing a real <audio> element inside the gesture flips
     the session to playback and unmutes Web Audio (the unmute.js trick). */
  const SILENT_WAV =
    "data:audio/wav;base64,UklGRkQDAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YSADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";
  let unmuteEl = null;
  function pokeMediaSession() {
    try {
      if (!unmuteEl) {
        unmuteEl = document.createElement("audio");
        unmuteEl.setAttribute("playsinline", "");
        unmuteEl.preload = "auto";
        unmuteEl.src = SILENT_WAV;
      }
      const p = unmuteEl.play();
      if (p && p.catch) p.catch(() => { });
    } catch (e) { }
  }

  /* strict WebViews (e.g. X's in-app browser) only unlock audio inside a
     touchend/click handler — pointer events don't count as a gesture there */
  function unlockAudio() {
    pokeMediaSession();
    const a = ensureAudio();
    if (!a) return;
    /* classic unlock: a silent buffer started synchronously inside the
       gesture nudges WebViews that ignore resume() alone */
    if (a.ctx.state !== "running") {
      try {
        const src = a.ctx.createBufferSource();
        src.buffer = a.ctx.createBuffer(1, 1, 22050);
        src.connect(a.ctx.destination);
        src.start(0);
      } catch (e) { }
    }
    /* resume()'s promise can hang forever when the gesture is rejected,
       so the hint must not wait for it — re-check on a timer instead */
    setTimeout(() => {
      if (a.ctx.state !== "running" && pendingNode) showHint(true);
    }, 350);
    Promise.resolve(a.ctx.resume()).then(() => {
      if (a.ctx.state !== "running") {
        if (pendingNode) showHint(true);
        return;
      }
      showHint(false);
      document.removeEventListener("touchend", unlockAudio);
      document.removeEventListener("click", unlockAudio);
      if (pendingNode) {
        const n = pendingNode;
        pendingNode = null;
        playNote(n);
      }
    });
  }
  document.addEventListener("touchend", unlockAudio);
  document.addEventListener("click", unlockAudio);

  /* nodes */
  for (const el of document.querySelectorAll(".object")) {
    const node = {
      el,
      name: el.dataset.name,
      type: el.classList.contains("main") ? "main" : "args",
      w: el.offsetWidth,
      h: el.offsetHeight,
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      grab: null,
    };
    node.tx = node.x =
      MARGIN + Math.random() * Math.max(1, window.innerWidth - node.w - MARGIN * 2);
    node.ty = node.y =
      MARGIN + Math.random() * Math.max(1, window.innerHeight - node.h - MARGIN * 2);
    place(node);
    nodes.set(node.name, node);

    el.addEventListener("pointerdown", (e) => {
      /* no preventDefault: it would suppress the compatibility click event,
         which strict WebViews (X's in-app browser) need as the unlock
         gesture; scrolling/selection are already blocked in CSS */
      el.setPointerCapture(e.pointerId);
      node.grab = { id: e.pointerId, dx: e.pageX - node.tx, dy: e.pageY - node.ty };
      el.classList.add("drag");
      el.style.zIndex = ++zTop;
      showInfo(node.name);
      node.grab.deg = degreeAt(node);
      playNote(node);
      kick();
    });
    el.addEventListener("pointermove", (e) => {
      if (!node.grab || e.pointerId !== node.grab.id) return;
      node.tx = clamp(e.pageX - node.grab.dx, MARGIN, window.innerWidth - node.w - MARGIN);
      node.ty = clamp(e.pageY - node.grab.dy, MARGIN, window.innerHeight - node.h - MARGIN);
      const deg = degreeAt(node);
      const now = performance.now();
      if (deg !== node.grab.deg && now - lastNoteAt > 80) {
        node.grab.deg = deg;
        lastNoteAt = now;
        playNote(node);
      }
      kick();
    });
    const release = (e) => {
      /* WebKit may only unlock audio on release, not pointerdown;
         once unlocked, replay the note the tap meant to play */
      unlockAudio();
      if (!node.grab || e.pointerId !== node.grab.id) return;
      node.grab = null;
      el.classList.remove("drag");
      kick();
    };
    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
  }
  relax();

  /* follow the OS color scheme */
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      cordColor = readCordColor();
      kick();
    });

  /* crisp cords on any display, and survive window resizes */
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const node of nodes.values()) {
      node.tx = clamp(node.tx, MARGIN, window.innerWidth - node.w - MARGIN);
      node.ty = clamp(node.ty, MARGIN, window.innerHeight - node.h - MARGIN);
    }
    kick();
  }
  window.addEventListener("resize", resize);
  resize();

  /* post window */
  const BOOT_LINES = [
    "compiling class library...",
    "&nbsp;&nbsp;&nbsp;&nbsp;Found 843 primitives.",
    "compile done",
    "*** Welcome to SuperCollider 3.14.1 ***",
    "booting server 'localhost' on address 127.0.0.1:57110",
    "SuperCollider 3 server ready.",
    "s.boot; <span class=\"comment\">// grab an object</span>",
  ];
  (function bootLog(i) {
    if (!booting) return;
    logEl.innerHTML =
      '<div class="post">' +
      BOOT_LINES.slice(0, i).join("<br>") +
      '<span class="caret"></span></div>';
    if (i < BOOT_LINES.length) {
      setTimeout(() => bootLog(i + 1), 140 + Math.random() * 240);
    }
  })(0);

  /* server status: avg CPU, peak CPU, UGens, Synths, Groups, SynthDefs */
  const statusEl = document.getElementById("status");
  const defCount = Object.keys(INFO).length;
  let cpu = 1.2;
  function updateStatus() {
    cpu = Math.min(4.9, Math.max(0.3, cpu + (Math.random() - 0.5) * 0.4));
    const load = cpu + activeNotes * 0.5;
    const peak = load + Math.random() * 1.4;
    statusEl.textContent =
      load.toFixed(1) + "%  " + peak.toFixed(1) + "%  " +
      activeNotes * 3 + "u  " + activeNotes + "s  " +
      "1g  " + defCount + "d";
  }
  updateStatus();
  setInterval(updateStatus, 500);

  /* news */
  fetch("/.netlify/functions/slack-api")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!data.ok || !Array.isArray(data.messages)) return;
      const news = data.messages
        .map((message) => {
          const date = new Date(Math.floor(parseFloat(message.ts) * 1000));
          const formattedDate = date.toISOString().split("T")[0];
          const text = message.text
            .replace(/<([^|>]+)(?:\|[^>]+)?>/g, "$1")
            .replace(
              /\bhttps?:\/\/[^\s]+/gi,
              (url) => `<a href="${url}" target="_blank">${url}</a>`
            );
          return `<tt>${formattedDate}</tt><div>${text}</div>`;
        })
        .join("");
      newsEl.insertAdjacentHTML("beforeend", news);
    })
    .catch((error) => console.error("Slack fetch error:", error.message));
})();
