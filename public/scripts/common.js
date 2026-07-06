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
      "諏訪・八ヶ岳西麓在住、プログラマー。<br>" +
      "Manabu Igarashi<br>" +
      "Programmer based in Suwa, Japan.<br>" +
      "GitHub<br>" +
      '<a href="//github.com/igramjp" target="_blank" rel="noreferrer noopener">https://github.com/igramjp</a>',
    igram:
      "©︎ " + new Date().getFullYear() + " igram All rights reserved.<br>",
    lab:
      "IGRAM LAB (note)<br>" +
      "音響プログラミングの実験や制作の記録を公開しています。音の現象を探る実験室です。<br>" +
      "Experiments and notes in sound programming. A lab for exploring sonic phenomena.<br>" +
      '<a href="https://note.com/igram" target="_blank" rel="noreferrer noopener">https://note.com/igram</a>',
    supercollider:
      "SuperCollider<br>" +
      "音響合成とアルゴリズミック・コンポジションのための言語・環境。現在の制作の中心で、IGRAM LAB の実験の多くは SuperCollider で書かれています。<br>" +
      "A language and environment for audio synthesis and algorithmic composition — currently my main instrument. Most IGRAM LAB experiments are written in SuperCollider.<br>" +
      '<a href="https://supercollider.github.io/" target="_blank" rel="noreferrer noopener">https://supercollider.github.io/</a>',
    app:
      "oshiki（黄鐘）<br>" +
      "雅楽の十二律(三分損益法・黄鐘 A=430Hz)と純正律・平均律の周波数表を、Web MIDI入力にもリアルタイムで反応する形で表示する実験アプリ。<br>" +
      "oshiki (黄鐘) – Note-to-frequency tables in traditional Japanese and classical tunings (Sanbun-Soneki, just intonation, equal temperament), live via Web MIDI.<br>" +
      '<a href="https://igram.jp/app/oshiki/" target="_blank" rel="noreferrer noopener">https://igram.jp/app/oshiki/</a>',
    bamboo:
      "竹音（ちくおん／bamboo music）<br>" +
      "日本を拠点とするインディペンデントな音楽レーベル兼アート・インプリントです。<br>" +
      "bamboo music is an independent record label and art imprint based in Japan.<br>" +
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
  const cordColor = getComputedStyle(document.body)
    .getPropertyValue("--color-darkgray")
    .trim();

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
      const sag = Math.min(70, Math.hypot(q.x - p.x, q.y - p.y) * 0.25) + 6;
      ctx.moveTo(p.x, p.y);
      ctx.bezierCurveTo(p.x, p.y + sag, q.x, q.y + sag, q.x, q.y);
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

  function showInfo(name) {
    booting = false;
    logEl.innerHTML = INFO[name] || "";
    newsEl.style.display = name === "manabu" ? "" : "none";
  }

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
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      node.grab = { id: e.pointerId, dx: e.pageX - node.tx, dy: e.pageY - node.ty };
      el.classList.add("drag");
      el.style.zIndex = ++zTop;
      showInfo(node.name);
      kick();
    });
    el.addEventListener("pointermove", (e) => {
      if (!node.grab || e.pointerId !== node.grab.id) return;
      node.tx = clamp(e.pageX - node.grab.dx, MARGIN, window.innerWidth - node.w - MARGIN);
      node.ty = clamp(e.pageY - node.grab.dy, MARGIN, window.innerHeight - node.h - MARGIN);
      kick();
    });
    const release = (e) => {
      if (!node.grab || e.pointerId !== node.grab.id) return;
      node.grab = null;
      el.classList.remove("drag");
      kick();
    };
    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
  }

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
