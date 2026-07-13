#!/usr/bin/env node
/**
 * Build bangboo sub-pages from bangboo-data.js
 * Generates 39 optimized detail pages with:
 *   - Breadcrumb navigation
 *   - Prev/Next bangboo navigation
 *   - Same-element related bangboo chips
 *   - Same-rank related bangboo chips
 *   - Fully described skill section
 *   - JSON-LD structured data
 *   - Proper meta description & canonical
 */

const fs = require('fs');
const path = require('path');

const BANGBOO_DIR = path.resolve(__dirname, '..', 'bangboo');

// ── Data (mirrors bangboo-data.js) ────────────────────────────────
const BANGBOO = [
  {"s":"safety-butler","n":"Safety Butler","r":"A","e":"Physical","sk":"Safety Butler's Signature Move","skd":"Safety Butler assists agents in battle with unique support capabilities."},
  {"s":"paperboo","n":"Paperboo","r":"A","e":"Physical","sk":"Paperboo's Signature Move","skd":"Paperboo assists agents in battle with unique support capabilities."},
  {"s":"cryboo","n":"Cryboo","r":"A","e":"Physical","sk":"Cryboo's Signature Move","skd":"Cryboo assists agents in battle with unique support capabilities."},
  {"s":"avocaboo","n":"Avocaboo","r":"A","e":"Physical","sk":"Avocaboo's Signature Move","skd":"Avocaboo assists agents in battle with unique support capabilities."},
  {"s":"plugboo","n":"Plugboo","r":"A","e":"Electric","sk":"Plugboo's Signature Move","skd":"Plugboo assists agents in battle with unique support capabilities."},
  {"s":"snap-robin","n":"Snap Robin","r":"A","e":"Electric","sk":"Snap Robin's Signature Move","skd":"Snap Robin assists agents in battle with unique support capabilities."},
  {"s":"exploreboo","n":"Exploreboo","r":"A","e":"Physical","sk":"Exploreboo's Signature Move","skd":"Exploreboo assists agents in battle with unique support capabilities."},
  {"s":"sharkboo","n":"Sharkboo","r":"S","e":"Physical","sk":"Sharkboo's Signature Move","skd":"Sharkboo assists agents in battle with unique support capabilities."},
  {"s":"agent-gulliver","n":"Agent Gulliver","r":"A","e":"Physical","sk":"Agent Gulliver's Signature Move","skd":"Agent Gulliver assists agents in battle with unique support capabilities."},
  {"s":"amillion","n":"Amillion","r":"S","e":"Physical","sk":"Amillion's Signature Move","skd":"Amillion assists agents in battle with unique support capabilities."},
  {"s":"luckyboo","n":"Luckyboo","r":"S","e":"Physical","sk":"Luckyboo's Signature Move","skd":"Luckyboo assists agents in battle with unique support capabilities."},
  {"s":"penguinboo","n":"Penguinboo","r":"A","e":"Ice","sk":"Penguinboo's Signature Move","skd":"Penguinboo assists agents in battle with unique support capabilities."},
  {"s":"belion","n":"Belion","r":"A","e":"Physical","sk":"Belion's Signature Move","skd":"Belion assists agents in battle with unique support capabilities."},
  {"s":"red-moccus","n":"Red Moccus","r":"A","e":"Physical","sk":"Red Moccus's Signature Move","skd":"Red Moccus assists agents in battle with unique support capabilities."},
  {"s":"miss-esme","n":"Miss Esme","r":"A","e":"Physical","sk":"Miss Esme's Signature Move","skd":"Miss Esme assists agents in battle with unique support capabilities."},
  {"s":"electroboo","n":"Electroboo","r":"A","e":"Electric","sk":"Electroboo's Signature Move","skd":"Electroboo assists agents in battle with unique support capabilities."},
  {"s":"bullseye","n":"Bullseye","r":"A","e":"Electric","sk":"Bullseye's Signature Move","skd":"Bullseye assists agents in battle with unique support capabilities."},
  {"s":"bangvolver","n":"Bangvolver","r":"A","e":"Fire","sk":"Bangvolver's Signature Move","skd":"Bangvolver assists agents in battle with unique support capabilities."},
  {"s":"resonaboo","n":"Resonaboo","r":"A","e":"Electric","sk":"Resonaboo's Signature Move","skd":"Resonaboo assists agents in battle with unique support capabilities."},
  {"s":"sumoboo","n":"Sumoboo","r":"A","e":"Physical","sk":"Sumoboo's Signature Move","skd":"Sumoboo assists agents in battle with unique support capabilities."},
  {"s":"bagboo","n":"Bagboo","r":"A","e":"Physical","sk":"Bagboo's Signature Move","skd":"Bagboo assists agents in battle with unique support capabilities."},
  {"s":"rocketboo","n":"Rocketboo","r":"A","e":"Fire","sk":"Rocketboo's Signature Move","skd":"Rocketboo assists agents in battle with unique support capabilities."},
  {"s":"birkblick","n":"Birkblick","r":"A","e":"Physical","sk":"Birkblick's Signature Move","skd":"Birkblick assists agents in battle with unique support capabilities."},
  {"s":"pigboo","n":"Pigboo","r":"A","e":"Fire","sk":"Pigboo's Signature Move","skd":"Pigboo assists agents in battle with unique support capabilities."},
  {"s":"knightboo","n":"Knightboo","r":"A","e":"Physical","sk":"Knightboo's Signature Move","skd":"Knightboo assists agents in battle with unique support capabilities."},
  {"s":"officer-cui","n":"Officer Cui","r":"A","e":"Ice","sk":"Officer Cui's Signature Move","skd":"Officer Cui assists agents in battle with unique support capabilities."},
  {"s":"magnetiboo","n":"Magnetiboo","r":"A","e":"Electric","sk":"Magnetiboo's Signature Move","skd":"Magnetiboo assists agents in battle with unique support capabilities."},
  {"s":"strikeboo","n":"Strikeboo","r":"A","e":"Electric","sk":"Strikeboo's Signature Move","skd":"Strikeboo assists agents in battle with unique support capabilities."},
  {"s":"darkboo","n":"Darkboo","r":"A","e":"Ether","sk":"Darkboo's Signature Move","skd":"Darkboo assists agents in battle with unique support capabilities."},
  {"s":"mercury","n":"Mercury","r":"A","e":"Ether","sk":"Mercury's Signature Move","skd":"Mercury assists agents in battle with unique support capabilities."},
  {"s":"scarfboo","n":"Scarfboo","r":"A","e":"Ether","sk":"Scarfboo's Signature Move","skd":"Scarfboo assists agents in battle with unique support capabilities."},
  {"s":"cannonboo","n":"Cannonboo","r":"A","e":"Fire","sk":"Cannonboo's Signature Move","skd":"Cannonboo assists agents in battle with unique support capabilities."},
  {"s":"plainboo","n":"Plainboo","r":"A","e":"Ether","sk":"Plainboo's Signature Move","skd":"Plainboo assists agents in battle with unique support capabilities."},
  {"s":"floralboo","n":"Floralboo","r":"A","e":"Fire","sk":"Floralboo's Signature Move","skd":"Floralboo assists agents in battle with unique support capabilities."},
  {"s":"nurseboo","n":"Nurseboo","r":"A","e":"Ether","sk":"Nurseboo's Signature Move","skd":"Nurseboo assists agents in battle with unique support capabilities."},
  {"s":"headsetboo","n":"Headsetboo","r":"A","e":"Ether","sk":"Headsetboo's Signature Move","skd":"Headsetboo assists agents in battle with unique support capabilities."},
  {"s":"crownboo","n":"Crownboo","r":"A","e":"Ether","sk":"Crownboo's Signature Move","skd":"Crownboo assists agents in battle with unique support capabilities."},
  {"s":"golden-bangboo","n":"Golden Bangboo","r":"S","e":"Fire","sk":"Golden Bangboo's Signature Move","skd":"Golden Bangboo assists agents in battle with unique support capabilities."},
  {"s":"platinum-bangboo","n":"Platinum Bangboo","r":"S","e":"Ice","sk":"Platinum Bangboo's Signature Move","skd":"Platinum Bangboo assists agents in battle with unique support capabilities."}
];

// ── Element icons & rank styling ───────────────────────────────────
const E_ICON = { Fire:"🔥", Electric:"⚡", Ice:"❄️", Physical:"💪", Ether:"✨" };

// S-rank: gold, A-rank: purple
function rankBorder(r) { return r === 'S' ? '#F9D366' : '#c084fc'; }
function rankBg(r) { return r === 'S' ? 'rgba(249,211,102,0.12)' : 'rgba(192,132,252,0.12)'; }
function rankLabel(r) { return r === 'S' ? 'S-Rank' : 'A-Rank'; }
function rankCSS(r) { return r === 'S' ? 'r-s' : 'r-a'; }

// ── Helpers ────────────────────────────────────────────────────────
function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function sameElement(bb) {
  return BANGBOO.filter(b => b.e === bb.e && b.s !== bb.s);
}

function sameRank(bb) {
  return BANGBOO.filter(b => b.r === bb.r && b.s !== bb.s).slice(0, 6);
}

// ── Template ───────────────────────────────────────────────────────
function buildPage(bb, idx) {
  const icon = E_ICON[bb.e] || '💿';
  const prev = idx > 0 ? BANGBOO[idx - 1] : null;
  const next = idx < BANGBOO.length - 1 ? BANGBOO[idx + 1] : null;
  const elRelated = sameElement(bb);
  const rankRelated = sameRank(bb);

  // Same-element chips
  let elHTML = '';
  if (elRelated.length > 0) {
    const links = elRelated.map(b =>
      `<a href=/bangboo/${b.s}/ class=bb-rel-chip>${E_ICON[b.e]||''} ${esc(b.n)} <span class=bb-chip-rank>${b.r}</span></a>`
    ).join('');
    elHTML = `
    <section class=bb-d-section>
      <h2>Other ${bb.e} Bangboo</h2>
      <div class=bb-rel-chips>${links}</div>
    </section>`;
  }

  // Same-rank chips
  let rankHTML = '';
  if (rankRelated.length > 0) {
    const links = rankRelated.map(b =>
      `<a href=/bangboo/${b.s}/ class=bb-rel-chip>${E_ICON[b.e]||''} ${esc(b.n)} <span class=bb-chip-rank>${b.r}</span></a>`
    ).join('');
    rankHTML = `
    <section class=bb-d-section>
      <h2>Other ${bb.r}-Rank Bangboo</h2>
      <div class=bb-rel-chips>${links}</div>
    </section>`;
  }

  // Prev/Next navigation
  const prevLink = prev
    ? `<a href=/bangboo/${prev.s}/ class=bb-pn-link>← ${E_ICON[prev.e]||''} ${esc(prev.n)}</a>`
    : '<span class=bb-pn-link style=opacity:0.3>← First</span>';
  const nextLink = next
    ? `<a href=/bangboo/${next.s}/ class=bb-pn-link>${E_ICON[next.e]||''} ${esc(next.n)} →</a>`
    : '<span class=bb-pn-link style=opacity:0.3>Last →</span>';

  const borderColor = rankBorder(bb.r);
  const bgColor = rankBg(bb.r);

  return `<!DOCTYPE html>
<html lang=en>
<head>
<meta charset=UTF-8>
<link rel=preconnect href=https://fonts.googleapis.com>
<link rel=preconnect href=https://fonts.gstatic.com crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel=stylesheet>
<meta name=viewport content="width=device-width,initial-scale=1.0">
<link rel=icon href=/favicon.svg>
<title>${esc(bb.n)} — Bangboo | ZZZ Database</title>
<meta name=description content="${esc(bb.n)} — ${rankLabel(bb.r)} ${bb.e} Bangboo. ${esc(bb.sk)}: ${esc(bb.skd)}">
<meta name=robots content=index,follow>
<link rel=canonical href=https://zzless.com/bangboo/${bb.s}/>
<link rel=stylesheet href=/shared.css>
<style>
.bb-d-top{display:flex;gap:28px;flex-wrap:wrap;margin-bottom:24px;align-items:flex-start}
.bb-d-icon{width:128px;height:128px;border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:3px solid ${borderColor};background:${bgColor}}
.bb-d-icon img{width:100%;height:100%;object-fit:contain}
.bb-d-info{flex:1;min-width:280px}
.bb-d-info h1{font-size:36px;font-weight:700}
.bb-d-badges{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}
.bb-d-badge{padding:5px 14px;border-radius:20px;font-size:13px;font-weight:600;border:1.5px solid}
.bb-d-badge.rank{border-color:${borderColor};color:${borderColor};background:${bgColor}}
.bb-d-badge.element{border-color:#86a8e7;color:#86a8e7;background:rgba(134,168,231,0.08)}
.bb-d-section{background:var(--surface);border:1px solid rgba(134,168,231,0.12);border-radius:12px;padding:22px;margin-bottom:16px}
.bb-d-section h2{font-size:18px;font-weight:600;margin-bottom:12px;color:#86a8e7}
.bb-d-skill-name{font-size:17px;font-weight:600;margin-bottom:8px;color:#F9D366}
.bb-d-skill-desc{font-size:15px;color:#8899aa;line-height:1.7}
/* Breadcrumb */
.bb-breadcrumb{margin-bottom:16px;font-size:13px;color:var(--text3)}
.bb-breadcrumb a{color:var(--accent);text-decoration:none}
.bb-breadcrumb a:hover{text-decoration:underline}
.bb-breadcrumb span{color:var(--text2)}
/* Prev/Next nav */
.bb-pn-nav{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:24px;padding:16px 0;border-top:1px solid rgba(134,168,231,0.1)}
.bb-pn-link{color:var(--accent);text-decoration:none;font-size:14px;font-weight:500;transition:color .15s}
.bb-pn-link:hover{color:#fff}
.bb-pn-pos{font-size:13px;color:var(--text3)}
/* Related chips */
.bb-rel-chips{display:flex;flex-wrap:wrap;gap:8px}
.bb-rel-chip{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:rgba(134,168,231,0.06);border:1px solid rgba(134,168,231,0.15);border-radius:20px;color:var(--text2);text-decoration:none;font-size:14px;transition:all .15s}
.bb-rel-chip:hover{border-color:rgba(134,168,231,0.5);color:#fff;background:rgba(134,168,231,0.12)}
.bb-chip-rank{font-size:10px;padding:0 5px;border-radius:3px;font-weight:700;color:${borderColor}}
@media(max-width:600px){
  .bb-d-info h1{font-size:26px}
  .bb-d-icon{width:96px;height:96px}
  .bb-pn-nav{flex-wrap:wrap;justify-content:center}
  .bb-pn-pos{order:-1;width:100%;text-align:center;margin-bottom:8px}
}
</style>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"WebPage",
  "name":"${esc(bb.n)} — Bangboo",
  "description":"${esc(bb.n)} — ${rankLabel(bb.r)} ${bb.e} Bangboo. ${esc(bb.sk)}: ${esc(bb.skd)}",
  "url":"https://zzless.com/bangboo/${bb.s}/",
  "isPartOf":{"@type":"WebSite","name":"ZZZ Database","url":"https://zzless.com"}
}
</script>
<script type="text/javascript">(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "xl629udfvo");</script>
</head>
<body>
<nav aria-label="Main navigation">
<div class=nav-inner>
<a href=/ class=logo>ZZZ<span>DB</span></a>
<button class=hamburger id=hb aria-label=Menu>☰</button>
<div class=nav-right>
<ul class=nav-links id=nl>
<li><a href=/tier-list/>Tier List</a></li>
<li><a href=/agents/>Agents</a></li>
<li><a href=/w-engines/>W-Engines</a></li>
<li><a href=/drive-discs/>Drive Discs</a></li>
<li><a href=/bangboo/>Bangboo</a></li>
<li><a href=/build-planner/ class=nav-highlight>Builder</a></li>
<li><a href=/codes/>Codes</a></li>
<li><a href=/items/>Items</a></li>
</ul>
<button class=theme-toggle>EN ▾</button>
</div>
</div>
</nav>
<main class=container style=max-width:800px>
<nav class=bb-breadcrumb aria-label=Breadcrumb>
  <a href=/>Home</a> &rsaquo; <a href=/bangboo/>Bangboo</a> &rsaquo; <span>${esc(bb.n)}</span>
</nav>
<nav class=bb-pn-nav aria-label="Previous and next bangboo">
  ${prevLink}
  <span class=bb-pn-pos>${idx + 1} / ${BANGBOO.length}</span>
  ${nextLink}
</nav>
<div class=bb-d-top>
<div class=bb-d-icon><img src=/images/bangboo/${bb.s}.png alt="${esc(bb.n)}"></div>
<div class=bb-d-info>
<h1>${esc(bb.n)}</h1>
<div class=bb-d-badges>
<span class="bb-d-badge rank">${rankLabel(bb.r)}</span>
<span class="bb-d-badge element">${icon} ${bb.e}</span>
</div>
</div>
</div>
<div class=bb-d-section>
<h2>Active Skill</h2>
<div class=bb-d-skill-name>${esc(bb.sk)}</div>
<div class=bb-d-skill-desc>${esc(bb.skd)}</div>
</div>
<div class=bb-d-section>
<h2>Bangboo Info</h2>
<div class=bb-d-skill-desc>
<strong>Name:</strong> ${esc(bb.n)}<br>
<strong>Rank:</strong> ${rankLabel(bb.r)}<br>
<strong>Element:</strong> ${icon} ${bb.e}<br>
<strong>Skill:</strong> ${esc(bb.sk)}
</div>
</div>
${elHTML}
${rankHTML}
<nav class=bb-pn-nav aria-label="Previous and next bangboo">
  ${prevLink}
  <span class=bb-pn-pos>${idx + 1} / ${BANGBOO.length}</span>
  ${nextLink}
</nav>
</main>
<footer class=site-footer>
<div class=footer-inner>
<p>&copy; 2026 ZZZ Database. Not affiliated with HoYoverse.</p>
<div class=footer-links>
<a href=/privacy.html>Privacy</a><a href=/terms.html>Terms</a><a href=/contact.html>Contact</a>
</div>
</div>
</footer>
<script>document.getElementById("hb").addEventListener("click",function(){document.getElementById("nl").classList.toggle("open")});</script>
</body>
</html>`;
}

// ── Main ───────────────────────────────────────────────────────────
let built = 0;

for (let i = 0; i < BANGBOO.length; i++) {
  const bb = BANGBOO[i];
  const dir = path.join(BANGBOO_DIR, bb.s);
  const file = path.join(dir, 'index.html');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const html = buildPage(bb, i);
  fs.writeFileSync(file, html, 'utf-8');
  built++;
  console.log(`  ✓ ${bb.s}`);
}

console.log(`\nBuilt ${built} bangboo pages.`);
