
/* =========================================================
   WILL RUNNER — 8bit (DOM + CSS animations)
========================================================= */
// -----------------------------
// Seletores de elementos
// -----------------------------
const $game = document.getElementById("game");
const $startHint = document.getElementById("startHint");
const $mike = document.getElementById("mikeWrap");
const $score = document.getElementById("score");
const $overlay = document.getElementById("overlay");
const $retry = document.getElementById("retry");
const $bgm = document.getElementById("bgm");

// -----------------------------
// Métricas dinâmicas (para clamp do pulo)
// -----------------------------
let GAME_HEIGHT = 360;   // fallback (mesmo da --game-h)
let PLAYER_HEIGHT = 48;  // #mikeWrap height no CSS
let MAX_Y = GAME_HEIGHT - PLAYER_HEIGHT;

function recalcSceneMetrics() {
  const gameRect = $game?.getBoundingClientRect();
  const mikeRect = $mike?.getBoundingClientRect();
  if (gameRect) GAME_HEIGHT = gameRect.height;
  if (mikeRect) PLAYER_HEIGHT = mikeRect.height;
  MAX_Y = Math.max(0, GAME_HEIGHT - PLAYER_HEIGHT);
}
window.addEventListener("load", recalcSceneMetrics);
window.addEventListener("resize", recalcSceneMetrics);

// -------- CINZAS ANIMADAS NO FUNDO --------
const ashesContainer = document.querySelector(".ashes");
function createAsh() {
  if (!ashesContainer) return; // robustez

  const ash = document.createElement("span");
  const size = Math.random() * 3 + 2; // 2px a 5px
  const left = Math.random() * window.innerWidth;
  const duration = Math.random() * 4 + 4; // entre 4s e 8s
  const delay = Math.random() * 4;

  ash.style.width = size + "px";
  ash.style.height = size + "px";
  ash.style.left = left + "px";
  ash.style.animationDuration = duration + "s";
  ash.style.animationDelay = delay + "s";

  ashesContainer.appendChild(ash);
  setTimeout(() => ash.remove(), (duration + delay) * 1000);
}
// cria partículas continuamente
setInterval(createAsh, 130);

/* ======== Raios vermelhos (a cada ~2s ±300ms) ======== */
const fxLayer = document.querySelector(".fx-layer");

/**
 * Cria um SVG com 1..3 raios estilizados (stroke vermelho com glow)
 * e injeta no .fx-layer com animação breve (remove depois).
 */
function triggerLightning() {
  if (!fxLayer) return;

  // Posição do clarão (x,y) relativa à viewport
  const x = Math.floor(Math.random() * 80) + 10; // 10%..90% largura
  const y = Math.floor(Math.random() * 35) + 5;  // 5%..40% altura

  // Container com blend e animação de flicker
  const wrapper = document.createElement("div");
  wrapper.className = "lightning-flash";

  // Clarão global sutil 
  const glow = document.createElement("div");
  glow.className = "lightning-glow";
  glow.style.setProperty("--x", `${x}%`);
  glow.style.setProperty("--y", `${y}%`);

  // SVG full-screen onde desenhamos as trilhas do raio
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.style.position = "absolute";
  svg.style.inset = "0";

  // Filtro de brilho/halo
  const defs = document.createElementNS(svgNS, "defs");
  const filter = document.createElementNS(svgNS, "filter");
  filter.setAttribute("id", "glow");
  filter.setAttribute("filterUnits", "userSpaceOnUse");
  const gauss1 = document.createElementNS(svgNS, "feGaussianBlur");
  gauss1.setAttribute("stdDeviation", "1.5");
  gauss1.setAttribute("result", "blur1");
  const merge = document.createElementNS(svgNS, "feMerge");
  const m1 = document.createElementNS(svgNS, "feMergeNode");
  m1.setAttribute("in", "blur1");
  const m2 = document.createElementNS(svgNS, "feMergeNode");
  m2.setAttribute("in", "SourceGraphic");
  merge.appendChild(m1);
  merge.appendChild(m2);
  filter.appendChild(gauss1);
  filter.appendChild(merge);
  defs.appendChild(filter);
  svg.appendChild(defs);

  // Função utilitária p/ “raio quebrado”
  const createBolt = (originX, originY) => {
    const segments = Math.floor(Math.random() * 3) + 4; // 4–6
    let xPos = originX;
    let yPos = originY;

    const points = [`${xPos},${yPos}`];
    for (let i = 0; i < segments; i++) {
      // passo Y (pra baixo) e drift X aleatório
      yPos += Math.random() * 18 + 8;               // 8–26
      xPos += (Math.random() - 0.5) * 16;           // -8..+8
      points.push(`${Math.max(0, Math.min(100, xPos))},${Math.min(100, yPos)}`);
    }

    const polyline = document.createElementNS(svgNS, "polyline");
    polyline.setAttribute("points", points.join(" "));
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "rgba(255, 40, 40, 0.95)");
    polyline.setAttribute("stroke-width", (Math.random() * 0.7 + 0.9).toString()); // 0.9–1.6
    polyline.setAttribute("stroke-linecap", "round");
    polyline.setAttribute("stroke-linejoin", "round");
    polyline.setAttribute("filter", "url(#glow)");

    // Núcleo mais claro
    const core = document.createElementNS(svgNS, "polyline");
    core.setAttribute("points", points.join(" "));
    core.setAttribute("fill", "none");
    core.setAttribute("stroke", "rgba(255, 120, 120, 0.9)");
    core.setAttribute("stroke-width", "0.6");
    core.setAttribute("stroke-linecap", "round");
    core.setAttribute("stroke-linejoin", "round");
    core.setAttribute("filter", "url(#glow)");

    // Ramificação 
    if (Math.random() < 0.6) {
      const branch = document.createElementNS(svgNS, "polyline");
      const last = points[points.length - 1].split(",").map(Number);
      const bx = last[0] + (Math.random() < 0.5 ? -8 : 8);
      const by = last[1] + 10 + Math.random() * 8;
      branch.setAttribute("points", `${last[0]},${last[1]} ${bx},${by}`);
      branch.setAttribute("fill", "none");
      branch.setAttribute("stroke", "rgba(255, 50, 50, 0.8)");
      branch.setAttribute("stroke-width", "0.8");
      branch.setAttribute("stroke-linecap", "round");
      branch.setAttribute("filter", "url(#glow)");
      svg.appendChild(branch);
    }

    svg.appendChild(polyline);
    svg.appendChild(core);
  };

  // Quantos raios nessa “batida” (1 a 3)
  const bolts = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < bolts; i++) {
    const ox = x + (Math.random() - 0.5) * 8;  // +/- 4%
    const oy = y + (Math.random() - 0.5) * 6;  // +/- 3%
    createBolt(ox, oy);
  }

  wrapper.appendChild(svg);
  fxLayer.appendChild(wrapper);
  fxLayer.appendChild(glow);

  // Remove após a animação (~0.5s)
  setTimeout(() => {
    wrapper.remove();
    glow.remove();
  }, 650);
}

/**
 * Agenda raios a cada ~2s com leve aleatoriedade
 */
function scheduleLightning() {
  setInterval(() => {
    triggerLightning();
  }, 2000 + Math.floor(Math.random() * 600) - 300); // 2s ±300ms
}
// Inicia o agendamento quando a página carregar
window.addEventListener("load", scheduleLightning);

// -----------------------------
// Configurações/Física
// -----------------------------
const CONFIG = {
  SCORE_PER_SEC: 60,       // pontos por segundo vivo
  SPAWN_MIN_MS: 1800,
  SPAWN_MAX_MS: 2000,
  MONSTER_ANIM_MIN_S: 3.5, // menor = mais rápido
  MONSTER_ANIM_MAX_S: 5.5,
  JUMP_LOCK_MS: 750,       // (não usado se pulo 100% física)
  COLLISION_INSET: 17,     // folga do hitbox
  gravity: 1800,           // força para baixo
  jumpForce: 900,          // força inicial para cima
  jumpHoldTime: 200        // delay no ar (ms)
};

// Emojis de monstros
const MONSTERS = ["💀", "👻", "🕷️", "🧟", "👹"];
const monsterBaseOffset = (emoji) => {
  switch (emoji) {
    case "🕷️": return 0;
    case "🧟": return 0;
    case "💀": return 6;
    case "👹": return 14;
    case "👻": return 26;
    default: return 0;
  }
};

// -----------------------------
// Estado do jogo
// -----------------------------
const STATE = { IDLE: "IDLE", RUNNING: "RUNNING", GAME_OVER: "GAME_OVER" };

const state = {
  phase: STATE.IDLE,
  startedOnce: false,
  score: 0,
  lastTime: 0,
  spawnTimer: 0,
  nextSpawnDelay: 0,
  jumping: false,
  rafId: null,

  // Player com física
  player: {
    y: 0,          // altura vertical (bottom)
    vy: 0,         // velocidade vertical
    onGround: true,
    jumping: false,
    hold: false,   // se está no delay de queda
    holdTimer: 0   // tempo restante do hold (ms)
  }
};

// -----------------------------
// Utilidades
// -----------------------------
const rand = (min, max) => Math.random() * (max - min) + min;
function scheduleNextSpawn() {
  state.nextSpawnDelay = rand(CONFIG.SPAWN_MIN_MS, CONFIG.SPAWN_MAX_MS);
  state.spawnTimer = 0;
}
const getMonsters = () => document.querySelectorAll(".monster");

function isHit(a, b, inset = 0) {
  return !(
    b.left   > a.right  - inset ||
    b.right  < a.left   + inset ||
    b.top    > a.bottom - inset ||
    b.bottom < a.top    + inset
  );
}

// -----------------------------
// Fluxo principal
// -----------------------------
function startGame() {
  if (state.phase === STATE.RUNNING) return;

  if (!state.startedOnce) {
    state.startedOnce = true;
  }

  $startHint.classList.add("hidden");
  $overlay.classList.remove("show");
  clearMonsters();

  state.phase = STATE.RUNNING;
  state.score = 0;
  state.lastTime = performance.now();
  state.spawnTimer = 0;
  state.jumping = false;

  // reset player no chão
  state.player.y = 0;
  state.player.vy = 0;
  state.player.onGround = true;
  state.player.hold = false;
  state.player.holdTimer = 0;

  scheduleNextSpawn();
  updateScoreUI();

  // Música (só após gesto do usuário)
  $bgm.volume = 0.6;
  $bgm.play().catch((err) => {
    console.warn("Autoplay bloqueado. Exibindo controles do áudio.", err);
    $bgm.setAttribute("controls", "true");
    $bgm.style.display = "block";
  });

  $game.focus();
  state.rafId = requestAnimationFrame(gameLoop);
}

function gameOver() {
  if (state.phase !== STATE.RUNNING) return;

  state.phase = STATE.GAME_OVER;
  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }

  $bgm.pause();
  $overlay.classList.add("show");
}

function clearMonsters() {
  getMonsters().forEach((m) => m.remove());
}

function updateScoreUI() {
  $score.textContent = "SCORE: " + Math.floor(state.score);
}

function renderPlayer() {
  $mike.style.bottom = `${state.player.y}px`;
}

// -----------------------------
// Loop do jogo (rAF)
// -----------------------------
function gameLoop(now) {
  if (state.phase !== STATE.RUNNING) return;

  const dt = Math.min(0.032, (now - state.lastTime) / 1000); // ~32ms máx
  state.lastTime = now;

  // Física do pulo
  if (!state.player.onGround) {
    // hold (delay de queda)
    if (state.player.hold) {
      state.player.holdTimer -= dt * 1000; // hold é em ms
      if (state.player.holdTimer <= 0) {
        state.player.hold = false;
      }
    } else {
      // gravidade
      state.player.vy -= CONFIG.gravity * dt;
    }

    // Atualiza posição
    state.player.y += state.player.vy * dt;

    // Clamp no topo (não sair da tela)
    if (state.player.y >= MAX_Y) {
      state.player.y = MAX_Y;
      state.player.vy = 0;
      state.player.hold = false; // encerra hold no topo
    }

    // Piso
    if (state.player.y <= 0) {
      state.player.y = 0;
      state.player.onGround = true;
      state.player.vy = 0;
    }
  }

  // Pontuação por tempo vivo
  state.score += CONFIG.SCORE_PER_SEC * dt;
  updateScoreUI();

  // Spawner (ms)
  state.spawnTimer += dt * 1000;
  if (state.spawnTimer >= state.nextSpawnDelay) {
    spawnMonster();
    scheduleNextSpawn();
  }

  // Colisões
  checkCollisions();

  // Render player
  renderPlayer();

  state.rafId = requestAnimationFrame(gameLoop);
}

// -----------------------------
// Colisões
// -----------------------------
function checkCollisions() {
  const inset = CONFIG.COLLISION_INSET;
  const mikeRect = $mike.getBoundingClientRect();
  getMonsters().forEach((mon) => {
    const r = mon.getBoundingClientRect();
    if (isHit(mikeRect, r, inset)) {
      gameOver();
    }
  });
}

// -----------------------------
// Spawner de monstros
// -----------------------------
function spawnMonster() {
  if (state.phase !== STATE.RUNNING) return;

  const el = document.createElement("div");
  el.className = "monster";

  const pick = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
  el.textContent = pick;

  // “encaixe” no chão por emoji
  el.style.bottom = monsterBaseOffset(pick) + "px";

  // variação de cor
  if (Math.random() < 0.25) el.classList.add("alt");

  // variação de velocidade
  const dur = rand(CONFIG.MONSTER_ANIM_MIN_S, CONFIG.MONSTER_ANIM_MAX_S);
  el.style.animationDuration = `${dur}s`;

  // remove ao sair da tela
  el.addEventListener("animationend", () => el.remove());

  $game.appendChild(el);
}

// -----------------------------
// Pulo
// -----------------------------
function jump() {
  if (!state.player.onGround) return;

  state.player.onGround = false;
  state.player.jumping = true;
  state.player.vy = CONFIG.jumpForce;

  // ativa o delay de queda
  state.player.hold = true;
  state.player.holdTimer = CONFIG.jumpHoldTime;
}

// -----------------------------
// Controles
// -----------------------------
$game.addEventListener(
  "pointerdown",
  () => {
    if (state.phase !== STATE.RUNNING) startGame();
    else jump();
  },
  { passive: true }
);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (state.phase !== STATE.RUNNING) startGame();
    else jump();
  }
});

// Retry
$retry.addEventListener("click", () => {
  clearMonsters();
  state.phase = STATE.IDLE;
  startGame();
});

// Qualidade de vida: foca a área do jogo ao carregar
window.addEventListener("load", () => {
  $game.focus();
});
