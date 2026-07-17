#!/usr/bin/env node
/**
 * Build agent sub-pages from agents-data.js
 * Generates 44 optimized detail pages with:
 *   - Breadcrumb + Prev/Next navigation
 *   - Type-specific icon, badges, stat cards
 *   - Agent Overview info grid
 *   - Recommended Drive Discs (auto-matched by element + specialty)
 *   - Recommended W-Engines (auto-matched by specialty)
 *   - Team Building Tips (role-based)
 *   - Same-element / same-specialty / same-faction related agents
 *   - Agent FAQ + Build Planner CTA
 *   - Sticky bottom nav bar + JSON-LD
 */

const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.resolve(__dirname, '..', 'agents');

// ── Agents Data ─────────────────────────────────────────────────────
const AGENTS = [
  {"s":"anby-demara","n":"Anby Demara","r":"A","e":"Electric","sp":"Stun","f":"Cunning Hares","icon":"⚡"},
  {"s":"billy-kid","n":"Billy Kid","r":"A","e":"Physical","sp":"Attack","f":"Cunning Hares","icon":"💪"},
  {"s":"nicole-demara","n":"Nicole Demara","r":"A","e":"Ether","sp":"Support","f":"Cunning Hares","icon":"✨"},
  {"s":"nekomata","n":"Nekomiya Mana","r":"S","e":"Physical","sp":"Attack","f":"Cunning Hares","icon":"💪"},
  {"s":"koleda","n":"Koleda Belobog","r":"S","e":"Fire","sp":"Stun","f":"Belobog Heavy Industries","icon":"🔥"},
  {"s":"ben-bigger","n":"Ben Bigger","r":"A","e":"Fire","sp":"Defense","f":"Belobog Heavy Industries","icon":"🔥"},
  {"s":"anton","n":"Anton Ivanov","r":"A","e":"Electric","sp":"Attack","f":"Belobog Heavy Industries","icon":"⚡"},
  {"s":"grace","n":"Grace Howard","r":"S","e":"Electric","sp":"Anomaly","f":"Belobog Heavy Industries","icon":"⚡"},
  {"s":"rina","n":"Alexandrina Sebastiane","r":"S","e":"Electric","sp":"Support","f":"Victoria Housekeeping","icon":"⚡"},
  {"s":"corin","n":"Corin Wickes","r":"A","e":"Physical","sp":"Attack","f":"Victoria Housekeeping","icon":"💪"},
  {"s":"von-lycaon","n":"Von Lycaon","r":"S","e":"Ice","sp":"Stun","f":"Victoria Housekeeping","icon":"❄️"},
  {"s":"ellen-joe","n":"Ellen Joe","r":"S","e":"Ice","sp":"Attack","f":"Victoria Housekeeping","icon":"❄️"},
  {"s":"zhu-yuan","n":"Zhu Yuan","r":"S","e":"Ether","sp":"Attack","f":"Criminal Investigation","icon":"✨"},
  {"s":"qingyi","n":"Qingyi","r":"S","e":"Electric","sp":"Stun","f":"Criminal Investigation","icon":"⚡"},
  {"s":"jane-doe","n":"Jane Doe","r":"S","e":"Physical","sp":"Anomaly","f":"Criminal Investigation","icon":"💪"},
  {"s":"seth-lowell","n":"Seth Lowell","r":"A","e":"Electric","sp":"Defense","f":"Criminal Investigation","icon":"⚡"},
  {"s":"miyabi","n":"Hoshimi Miyabi","r":"S","e":"Ice","sp":"Anomaly","f":"Section 6","icon":"❄️"},
  {"s":"yanagi","n":"Tsukishiro Yanagi","r":"S","e":"Electric","sp":"Anomaly","f":"Section 6","icon":"⚡"},
  {"s":"harumasa","n":"Asaba Harumasa","r":"S","e":"Electric","sp":"Attack","f":"Section 6","icon":"⚡"},
  {"s":"soukaku","n":"Soukaku","r":"A","e":"Ice","sp":"Support","f":"Section 6","icon":"❄️"},
  {"s":"caesar-king","n":"Caesar King","r":"S","e":"Physical","sp":"Defense","f":"Sons of Calydon","icon":"💪"},
  {"s":"burnice","n":"Burnice White","r":"S","e":"Fire","sp":"Anomaly","f":"Sons of Calydon","icon":"🔥"},
  {"s":"lighter","n":"Lighter","r":"S","e":"Fire","sp":"Stun","f":"Sons of Calydon","icon":"🔥"},
  {"s":"lucy","n":"Luciana de Montefio","r":"A","e":"Fire","sp":"Support","f":"Sons of Calydon","icon":"🔥"},
  {"s":"piper","n":"Piper Wheel","r":"A","e":"Physical","sp":"Anomaly","f":"Sons of Calydon","icon":"💪"},
  {"s":"pulchra","n":"Pulchra Fellini","r":"A","e":"Physical","sp":"Stun","f":"Sons of Calydon","icon":"💪"},
  {"s":"soldier-11","n":"Soldier 11","r":"S","e":"Fire","sp":"Attack","f":"Obol Squad","icon":"🔥"},
  {"s":"trigger","n":"Trigger","r":"S","e":"Electric","sp":"Stun","f":"Obol Squad","icon":"⚡"},
  {"s":"soldier-0-anby","n":"Soldier 0 - Anby","r":"S","e":"Electric","sp":"Attack","f":"Obol Squad","icon":"⚡"},
  {"s":"astra-yao","n":"Astra Yao","r":"S","e":"Ether","sp":"Support","f":"Stars of Lyra","icon":"✨"},
  {"s":"evelyn","n":"Evelyn Chevalier","r":"S","e":"Fire","sp":"Attack","f":"Stars of Lyra","icon":"🔥"},
  {"s":"hugo-vlad","n":"Hugo Vlad","r":"S","e":"Ice","sp":"Attack","f":"Mockingbird","icon":"❄️"},
  {"s":"vivian","n":"Vivian Banshee","r":"S","e":"Ether","sp":"Anomaly","f":"Mockingbird","icon":"✨"},
  {"s":"yixuan","n":"Yixuan","r":"S","e":"Ether","sp":"Rupture","f":"Yunkui Summit","icon":"✨"},
  {"s":"pan-yinhu","n":"Pan Yinhu","r":"A","e":"Physical","sp":"Defense","f":"Yunkui Summit","icon":"💪"},
  {"s":"ju-fufu","n":"Ju Fufu","r":"S","e":"Fire","sp":"Stun","f":"Yunkui Summit","icon":"🔥"},
  {"s":"yuzuha","n":"Ukinami Yuzuha","r":"S","e":"Physical","sp":"Support","f":"Spook Shack","icon":"💪"},
  {"s":"alice","n":"Alice Thymefield","r":"S","e":"Physical","sp":"Anomaly","f":"Spook Shack","icon":"💪"},
  {"s":"nangong-yu","n":"Nangong Yu","r":"S","e":"Ether","sp":"Stun","f":"Angels of Delusion","icon":"✨"},
  {"s":"aria","n":"Aria","r":"S","e":"Ether","sp":"Attack","f":"Angels of Delusion","icon":"✨"},
  {"s":"sunna","n":"Sunna","r":"S","e":"Physical","sp":"Support","f":"Angels of Delusion","icon":"💪"},
  {"s":"ye-shunguang","n":"Ye Shunguang","r":"S","e":"Physical","sp":"Attack","f":"Public Security","icon":"💪"},
  {"s":"cissia","n":"Cissia","r":"S","e":"Electric","sp":"Attack","f":"Obol Squad","icon":"⚡"},
  {"s":"seed","n":"Seed","r":"S","e":"Electric","sp":"Anomaly","f":"Obol Squad","icon":"⚡"}
];

// ── Drive Discs (for cross-referencing) ────────────────────────────
const DISCS = [
  {"s":"astral-voice","n":"Astral Voice","type":"Support","p2":"ATK +10%","p4":"When anyone enters via Quick Assist, all squad members gain 1 stack of Astral (max 3, 15s). Each stack gives +8% DMG (max 24%)."},
  {"s":"branch-blade-song","n":"Branch & Blade Song","type":"Ice","p2":"CRIT DMG +16%","p4":"If Anomaly Mastery ≥115, CRIT DMG +30%. When anyone applies Freeze/Shatter, CRIT Rate +12% for 15s."},
  {"s":"bunny-in-wonderland","n":"Bunny in Wonderland","type":"Defense","p2":"HP +10%","p4":"When equipped by Defense character: EX Special or any Defensive/Evasive Assist grants all squad members DMG +6% (stacks up to 3 times, 25s)."},
  {"s":"chaos-jazz","n":"Chaos Jazz","type":"Anomaly","p2":"Anomaly Proficiency +30","p4":"Fire & Electric DMG +15%. While off-field, EX Special & Assist Attack DMG +20%."},
  {"s":"chaotic-metal","n":"Chaotic Metal","type":"Ether","p2":"Ether DMG +10%","p4":"CRIT DMG +20%. When anyone triggers Corruption, this further increases by 5.5% (stacking up to 6 times) for 8s."},
  {"s":"dawns-bloom","n":"Dawn's Bloom","type":"Attack","p2":"Basic Attack DMG +15%","p4":"Basic Attack DMG +20%. If equipped by an Attack character, using EX Special/Ultimate further increases Basic Attack DMG by 20% for 25s."},
  {"s":"fanged-metal","n":"Fanged Metal","type":"Physical","p2":"Physical DMG +10%","p4":"Whenever a squad member inflicts Assault, the equipper deals 35% increased DMG to the target for 12s."},
  {"s":"freedom-blues","n":"Freedom Blues","type":"Anomaly","p2":"Anomaly Proficiency +30","p4":"EX Special Attack hits reduce target Anomaly Buildup RES to equipper attribute by 20% for 8s."},
  {"s":"hormone-punk","n":"Hormone Punk","type":"Attack","p2":"ATK +10%","p4":"Upon entering combat or switching in, ATK increases by 25% for 10s (once every 20s)."},
  {"s":"inferno-metal","n":"Inferno Metal","type":"Fire","p2":"Fire DMG +10%","p4":"CRIT Rate +28% for 8s upon hitting a Burning enemy."},
  {"s":"king-of-summit","n":"King of the Summit","type":"Stun","p2":"Daze of attacks +6%","p4":"When equipped by Stun character: EX Special/Chain Attack increases all squad members CRIT DMG by 15%. If CRIT Rate ≥50%, +15% CRIT DMG."},
  {"s":"moonlight-lullaby","n":"Moonlight Lullaby","type":"Support","p2":"Energy Regen +20%","p4":"When equipped by Support character: EX Special/Ultimate increases all squad members DMG by 18% for 25s."},
  {"s":"notes-from-chained","n":"Notes from the Chained","type":"Anomaly","p2":"Ice DMG +10%","p4":"Triggering Abloom: Anomaly Proficiency +48 for 30s. Triggering Freeze: Attribute Anomaly DMG & Disorder DMG +16% for 30s."},
  {"s":"phaethons-melody","n":"Phaethon's Melody","type":"Anomaly","p2":"Anomaly Mastery +8%","p4":"When any squad member uses EX Special, equipper Anomaly Proficiency +45 for 8s. If not the equipper, Ether DMG +25%."},
  {"s":"polar-metal","n":"Polar Metal","type":"Ice","p2":"Ice DMG +10%","p4":"Basic & Dash Attack DMG +20%. Increases by an additional 20% for 12s when anyone inflicts Freeze/Shatter."},
  {"s":"proto-punk","n":"Proto Punk","type":"Support","p2":"Shield Effect +15%","p4":"When anyone triggers Defensive Assist or Evasive Assist, all squad members deal 15% increased DMG for 10s."},
  {"s":"puffer-electro","n":"Puffer Electro","type":"Attack","p2":"PEN Ratio +8%","p4":"Ultimate DMG +20%. Launching an Ultimate increases ATK by 15% for 12s."},
  {"s":"shadow-harmony","n":"Shadow Harmony","type":"Attack","p2":"Aftershock & Dash Attack DMG +15%","p4":"Hitting with Aftershock/Dash Attack (matching attribute) grants ATK +4% & CRIT Rate +4%, up to 3 stacks for 15s."},
  {"s":"shining-aria","n":"Shining Aria","type":"Anomaly","p2":"Ether DMG +10%","p4":"Basic Attack hits grant Anomaly Proficiency +36 for 8s. When any enemy is Stunned, DMG +25% for 18s."},
  {"s":"shockstar-disco","n":"Shockstar Disco","type":"Stun","p2":"Impact +6%","p4":"Basic Attacks, Dash Attacks, and Dodge Counters inflict 20% more Daze on the main target."},
  {"s":"soul-rock","n":"Soul Rock","type":"Defense","p2":"DEF +16%","p4":"Upon taking HP damage, the equipper takes 40% less DMG for 2.5s (once every 15s)."},
  {"s":"swing-jazz","n":"Swing Jazz","type":"Support","p2":"Energy Regen +20%","p4":"Chain Attack or Ultimate increases all squad members DMG by 15% for 12s (does not stack)."},
  {"s":"thunder-metal","n":"Thunder Metal","type":"Electric","p2":"Electric DMG +10%","p4":"ATK +28% as long as an enemy is Shocked."},
  {"s":"woodpecker-electro","n":"Woodpecker Electro","type":"Attack","p2":"CRIT Rate +8%","p4":"Landing a crit with Basic Attack, Dodge Counter, or EX Special increases ATK by 9% for 6s (separate timers per skill)."},
  {"s":"yunkui-tales","n":"Yunkui Tales","type":"Support","p2":"HP +10%","p4":"EX Special, Chain Attack, or Ultimate grants CRIT Rate +4% per stack (max 3 stacks, 15s). At 3 stacks, Sheer DMG +10%."}
];

// ── W-Engines (for cross-referencing) ──────────────────────────────
const WENGINES = [
  {"s":"bashful-demon","n":"Bashful Demon","r":"A","t":"Support","a":624,"sub":"ATK","sv":"25%"},
  {"s":"bellicose-blaze","n":"Bellicose Blaze","r":"S","t":"Attack","a":713,"sub":"Energy Regen","sv":"60%"},
  {"s":"big-cylinder","n":"Big Cylinder","r":"A","t":"Defense","a":624,"sub":"DEF","sv":"40%"},
  {"s":"blazing-laurel","n":"Blazing Laurel","r":"S","t":"Stun","a":713,"sub":"Impact","sv":"18%"},
  {"s":"box-cutter","n":"Box Cutter","r":"A","t":"Stun","a":624,"sub":"Impact","sv":"15%"},
  {"s":"bunny-band","n":"Bunny Band","r":"A","t":"Defense","a":594,"sub":"DEF","sv":"40%"},
  {"s":"cannon-rotor","n":"Cannon Rotor","r":"A","t":"Attack","a":594,"sub":"CRIT Rate","sv":"20%"},
  {"s":"cordis-germina","n":"Cordis Germina","r":"S","t":"Attack","a":713,"sub":"CRIT Rate","sv":"24%"},
  {"s":"deep-sea-visitor","n":"Deep Sea Visitor","r":"S","t":"Attack","a":713,"sub":"CRIT Rate","sv":"24%"},
  {"s":"demara-battery-ii","n":"Demara Battery Mark II","r":"A","t":"Stun","a":624,"sub":"Impact","sv":"15%"},
  {"s":"dreamlit-hearth","n":"Dreamlit Hearth","r":"S","t":"Support","a":713,"sub":"HP","sv":"30%"},
  {"s":"drill-rig-red-axis","n":"Drill Rig - Red Axis","r":"A","t":"Attack","a":624,"sub":"Energy Regen","sv":"50%"},
  {"s":"electro-lip-gloss","n":"Electro-Lip Gloss","r":"A","t":"Anomaly","a":594,"sub":"Anomaly Proficiency","sv":"75"},
  {"s":"elegant-vanity","n":"Elegant Vanity","r":"S","t":"Support","a":713,"sub":"ATK","sv":"30%"},
  {"s":"flamemaker-shaker","n":"Flamemaker Shaker","r":"S","t":"Anomaly","a":713,"sub":"ATK","sv":"30%"},
  {"s":"flight-of-fancy","n":"Flight of Fancy","r":"S","t":"Anomaly","a":713,"sub":"Anomaly Proficiency","sv":"90"},
  {"s":"fusion-compiler","n":"Fusion Compiler","r":"S","t":"Anomaly","a":684,"sub":"PEN Ratio","sv":"24%"},
  {"s":"gilded-blossom","n":"Gilded Blossom","r":"A","t":"Attack","a":594,"sub":"ATK","sv":"25%"},
  {"s":"grill-owisp","n":"Grill O'Wisp","r":"A","t":"Rupture","a":624,"sub":"HP","sv":"25%"},
  {"s":"hailstorm-shrine","n":"Hailstorm Shrine","r":"S","t":"Anomaly","a":713,"sub":"CRIT Rate","sv":"24%"},
  {"s":"heartstring-nocturne","n":"Heartstring Nocturne","r":"S","t":"Attack","a":713,"sub":"CRIT Rate","sv":"24%"},
  {"s":"hellfire-gears","n":"Hellfire Gears","r":"S","t":"Stun","a":684,"sub":"Impact","sv":"18%"},
  {"s":"ice-jade-teapot","n":"Ice-Jade Teapot","r":"S","t":"Stun","a":713,"sub":"Impact","sv":"18%"},
  {"s":"krakens-cradle","n":"Kraken's Cradle","r":"S","t":"Rupture","a":713,"sub":"HP","sv":"30%"},
  {"s":"metanukimorphosis","n":"Metanukimorphosis","r":"S","t":"Support","a":713,"sub":"Energy Regen","sv":"60%"},
  {"s":"myriad-eclipse","n":"Myriad Eclipse","r":"S","t":"Attack","a":713,"sub":"CRIT Rate","sv":"24%"},
  {"s":"practiced-perfection","n":"Practiced Perfection","r":"S","t":"Anomaly","a":713,"sub":"ATK","sv":"30%"},
  {"s":"qingming-birdcage","n":"Qingming Birdcage","r":"S","t":"Rupture","a":713,"sub":"HP","sv":"30%"},
  {"s":"rainforest-gourmet","n":"Rainforest Gourmet","r":"A","t":"Anomaly","a":594,"sub":"Anomaly Proficiency","sv":"75"},
  {"s":"riot-suppressor-vi","n":"Riot Suppressor Mark VI","r":"S","t":"Attack","a":713,"sub":"CRIT DMG","sv":"48%"},
  {"s":"roaring-furnace","n":"Roaring Fur-nace","r":"S","t":"Stun","a":713,"sub":"ATK","sv":"30%"},
  {"s":"roaring-ride","n":"Roaring Ride","r":"A","t":"Anomaly","a":624,"sub":"ATK","sv":"25%"},
  {"s":"severed-innocence","n":"Severed Innocence","r":"S","t":"Attack","a":713,"sub":"CRIT DMG","sv":"48%"},
  {"s":"sharpened-stinger","n":"Sharpened Stinger","r":"S","t":"Anomaly","a":713,"sub":"Anomaly Proficiency","sv":"90"},
  {"s":"spectral-gaze","n":"Spectral Gaze","r":"S","t":"Stun","a":713,"sub":"CRIT Rate","sv":"24%"},
  {"s":"starlight-engine","n":"Starlight Engine","r":"A","t":"Attack","a":594,"sub":"ATK","sv":"25%"},
  {"s":"steel-cushion","n":"Steel Cushion","r":"S","t":"Attack","a":684,"sub":"CRIT Rate","sv":"24%"},
  {"s":"the-brimstone","n":"The Brimstone","r":"S","t":"Attack","a":684,"sub":"ATK","sv":"30%"},
  {"s":"the-restrained","n":"The Restrained","r":"S","t":"Stun","a":684,"sub":"Impact","sv":"18%"},
  {"s":"timeweaver","n":"Timeweaver","r":"S","t":"Anomaly","a":713,"sub":"ATK","sv":"30%"},
  {"s":"tusks-of-fury","n":"Tusks of Fury","r":"S","t":"Defense","a":713,"sub":"Impact","sv":"18%"},
  {"s":"weeping-cradle","n":"Weeping Cradle","r":"S","t":"Support","a":684,"sub":"PEN Ratio","sv":"24%"},
  {"s":"weeping-gemini","n":"Weeping Gemini","r":"A","t":"Anomaly","a":594,"sub":"ATK","sv":"25%"},
  {"s":"wrathful-vajra","n":"Wrathful Vajra","r":"S","t":"Rupture","a":713,"sub":"HP","sv":"30%"},
  {"s":"yesterday-calls","n":"Yesterday Calls","r":"S","t":"Stun","a":713,"sub":"CRIT Rate","sv":"24%"},
  {"s":"zanshin-herb-case","n":"Zanshin Herb Case","r":"S","t":"Attack","a":713,"sub":"CRIT DMG","sv":"48%"}
];

// ── Metadata ────────────────────────────────────────────────────────
const E_ICON = { Fire:"🔥", Electric:"⚡", Ice:"❄️", Physical:"💪", Ether:"✨" };
const SP_ICON = { Attack:"⚔️", Stun:"💥", Anomaly:"🌀", Support:"💚", Defense:"🛡️", Rupture:"🔓" };

function rankColor(r) { return r === 'S' ? '#F9D366' : '#c084fc'; }
function rankBg(r) { return r === 'S' ? 'rgba(249,211,102,0.10)' : 'rgba(192,132,252,0.10)'; }
function rankBorder(r) { return r === 'S' ? '#F9D366' : '#c084fc'; }
function rankLabel(r) { return r === 'S' ? 'S-Rank' : 'A-Rank'; }

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ── Recommendation logic ────────────────────────────────────────────

function recDiscs(agent) {
  // Match by element first, then by specialty
  const byElem = DISCS.filter(d => d.type === agent.e);
  const bySpec = DISCS.filter(d => d.type === agent.sp && d.type !== agent.e);
  // Universal Attack discs for DPS roles
  const universal = DISCS.filter(d =>
    (agent.sp === 'Attack' || agent.sp === 'Anomaly') &&
    ['Attack'].includes(d.type) && d.type !== agent.e && d.type !== agent.sp
  );
  return [...byElem, ...bySpec, ...universal].slice(0, 6);
}

function recWEngines(agent) {
  // Match by specialty type
  let specMatch = agent.sp;
  // Map Rupture to available types
  const specMap = { Rupture: 'Rupture' };
  const targetType = specMap[agent.sp] || agent.sp;
  const matched = WENGINES.filter(w => w.t === targetType);
  return matched.slice(0, 5);
}

// ── Obtain text ─────────────────────────────────────────────────────
function obtainText(agent) {
  const freeAgents = {
    'anby-demara': 'Story (starter)',
    'billy-kid': 'Story (starter)',
    'nicole-demara': 'Story (starter)',
  };
  if (freeAgents[agent.s]) {
    return `${esc(agent.n)} is obtained for <strong>free through the main story</strong> as a starter agent. ${agent.r === 'A' ? 'Additional copies can be pulled from the standard (Stable) banner using regular Master Tapes, or from rate-up banners.' : ''}`;
  }
  if (agent.r === 'A') {
    return `${esc(agent.n)} is an <strong>A-Rank</strong> agent available from the <strong>standard (Stable) banner</strong> and all limited banners. Regular gameplay and events will naturally give you copies. A-Rank agents are cheaper to build and faster to max compared to S-Ranks.`;
  }
  // S-Rank
  const standardPool = ['nekomata','soldier-11','koleda','grace','rina','von-lycaon'];
  if (standardPool.includes(agent.s)) {
    return `${esc(agent.n)} is a <strong style="color:#F9D366">Standard S-Rank</strong> agent available in the <strong>Stable (standard) banner</strong> pool. You can also lose the 50/50 on limited banners to get her. After 300 pulls on the standard banner, you can select any standard S-rank agent for free.`;
  }
  return `${esc(agent.n)} is a <strong style="color:#F9D366">Limited S-Rank</strong> agent. She appears exclusively on her featured banner during special event periods and is <strong>not</strong> in the standard (Stable) banner pool. Save your <strong>Encrypted Master Tapes</strong> and <strong>Polychrome</strong> for her next rerun.`;
}

// ── Team tips ───────────────────────────────────────────────────────
function teamTips(agent) {
  const tips = {
    Attack: `<strong>Main DPS / Hyper Carry.</strong> ${esc(agent.n)} wants to stay on-field dealing damage. Pair her with a <strong>Stun</strong> agent to build Daze and create Chain Attack windows, and a <strong>Support</strong> to buff her damage. Typical setup: <strong>DPS + Stun + Support</strong>.`,
    Stun: `<strong>Daze Builder / Enabler.</strong> ${esc(agent.n)} sets up damage windows for your main DPS. Pair her with an <strong>Attack or Anomaly</strong> carry who exploits the Stun window, and a <strong>Support</strong> who buffs both. Typical setup: <strong>DPS + Stun + Support</strong>.`,
    Anomaly: `<strong>Anomaly / Disorder DPS.</strong> ${esc(agent.n)} deals damage through elemental anomaly procs rather than raw ATK. Pair her with a <strong>second Anomaly</strong> agent of a different element for Disorder chains, or a <strong>Support/Defense</strong> buffer. Typical setup: <strong>Anomaly + Anomaly + Support</strong> or <strong>Anomaly + Stun + Support</strong>.`,
    Support: `<strong>Buffer / Enabler.</strong> ${esc(agent.n)} amplifies your team's damage. She fits into almost any comp — pair her with an <strong>Attack or Anomaly</strong> DPS who benefits from her buffs, plus a <strong>Stun</strong> or second Support. Typical setup: <strong>DPS + Stun + Support</strong>.`,
    Defense: `<strong>Tank / Survivability.</strong> ${esc(agent.n)} provides shields and damage reduction. She's ideal for survival-heavy content like high-difficulty Hollow Zero. Pair with a <strong>DPS + Support</strong> or run a double-Defense comp for extra safety.`,
    Rupture: `<strong>Defense Breaker.</strong> ${esc(agent.n)} specializes in disrupting enemy defense mechanics. She excels in specific endgame content. Pair with a <strong>DPS</strong> who capitalizes on the defense break window and a <strong>Support</strong> buffer.`,
  };
  return tips[agent.sp] || tips.Attack;
}

// ── Filter helpers ──────────────────────────────────────────────────
function sameElem(a) { return AGENTS.filter(o => o.e === a.e && o.s !== a.s); }
function sameSpec(a) { return AGENTS.filter(o => o.sp === a.sp && o.s !== a.s); }
function sameFaction(a) { return AGENTS.filter(o => o.f === a.f && o.s !== a.s); }

function chipsHtml(items, iconFn) {
  return items.map(o =>
    `<a href="/agents/${o.s}/" class="ag-chips-chip">${iconFn ? iconFn(o) : (E_ICON[o.e]||'')} ${esc(o.n)} <span class="ag-chip-r ag-chip-${o.r==='S'?'s':'a'}">${o.r}</span></a>`
  ).join('');
}

// ── Template ────────────────────────────────────────────────────────
function buildPage(a, idx) {
  const color = rankColor(a.r);
  const bg = rankBg(a.r);
  const border = rankBorder(a.r);
  const prev = idx > 0 ? AGENTS[idx - 1] : null;
  const next = idx < AGENTS.length - 1 ? AGENTS[idx + 1] : null;
  const eIcon = E_ICON[a.e] || '';
  const spIcon = SP_ICON[a.sp] || '';

  function pnNav(aria) {
    const pl = prev ? `<a href="/agents/${prev.s}/" class="ag-pn-link">← ${E_ICON[prev.e]||''} ${esc(prev.n)}</a>` : '<span class="ag-pn-link" style="opacity:0.3">← First</span>';
    const nl = next ? `<a href="/agents/${next.s}/" class="ag-pn-link">${E_ICON[next.e]||''} ${esc(next.n)} →</a>` : '<span class="ag-pn-link" style="opacity:0.3">Last →</span>';
    return `<nav class="ag-pn" aria-label="${aria}">${pl}<span class="ag-pn-pos">${idx+1} / ${AGENTS.length}</span>${nl}</nav>`;
  }

  // Discs
  const discs = recDiscs(a);
  const discsHTML = discs.length > 0 ? `
<div class="ag-sec">
<h2>💿 Recommended Drive Discs</h2>
<p style="margin-bottom:14px">Based on ${esc(a.n)}'s ${a.e} element and ${a.sp} specialty. Click any disc for full stats.</p>
<div class="ag-chips">${discs.map(d => `<a href="/drive-discs/${d.s}/" class="ag-chips-chip">${E_ICON[d.type]||'💿'} ${esc(d.n)} <span class="ag-chip-r ag-chip-${d.type===a.e?'s':'a'}">${d.type}</span></a>`).join('')}</div>
</div>` : '';

  // W-Engines
  const wengs = recWEngines(a);
  const wengsHTML = wengs.length > 0 ? `
<div class="ag-sec">
<h2>⚙️ Recommended W-Engines</h2>
<p style="margin-bottom:14px">${a.sp} W-Engines that synergize with ${esc(a.n)}'s kit. S-Rank options first, then A-Rank alternatives.</p>
<div class="ag-chips">${wengs.map(w => {
  const chipClass = w.r === 'S' ? 'ag-chip-s' : 'ag-chip-a';
  return `<a href="/w-engines/${w.s}/" class="ag-chips-chip">${w.r==='S'?'⭐':'🔹'} ${esc(w.n)} <span class="ag-chip-r ${chipClass==='ag-chip-s'?'ag-chip-s':'ag-chip-a'}">${w.r}</span></a>`;
}).join('')}</div>
</div>` : '';

  // Agent FAQ
  const faqs = [
    { q: `Is ${esc(a.n)} worth pulling?`, a: a.r === 'S'
      ? `${esc(a.n)} is a strong ${a.e} ${a.sp} agent. If your roster lacks ${a.e} coverage or a ${a.sp} role, ${esc(a.n)} fills that gap well. Check the recommended teams above to see if you have the right teammates.`
      : `${esc(a.n)} is a solid A-Rank ${a.sp}. A-Ranks are easier to max (cheaper materials, more dupe copies), and a maxed A-Rank often outperforms a base S-Rank. Worth building if you need ${a.e} coverage.` },
    { q: `What stats should I prioritize?`, a: a.sp === 'Attack'
      ? `CRIT Rate / CRIT DMG > ATK% > Element DMG%. Slot 4: CRIT Rate or CRIT DMG. Slot 5: ${a.e} DMG%. Slot 6: ATK%.`
      : a.sp === 'Anomaly'
      ? `Anomaly Proficiency > ATK% > Element DMG%. Slot 4: ATK% or CRIT. Slot 5: ${a.e} DMG%. Slot 6: Anomaly Mastery or ATK%. Aim for 300+ Anomaly Proficiency.`
      : a.sp === 'Stun'
      ? `Impact > Energy Regen > ATK%. Slot 4: ATK% or CRIT. Slot 5: ${a.e} DMG% or ATK%. Slot 6: Impact or Energy Regen.`
      : a.sp === 'Support'
      ? `Energy Regen > ATK% or HP%. Slot 4: ATK% or HP%. Slot 5: ATK% or HP%. Slot 6: Energy Regen. Supports scale differently — check specific skill scalings.`
      : a.sp === 'Defense'
      ? `DEF% > HP% > ATK%. Slot 4: DEF% or HP%. Slot 5: DEF% or HP%. Slot 6: DEF%. Defense agents scale primarily with DEF or HP depending on their kit.`
      : `Stats depend on ${esc(a.n)}'s specific skill scalings. Check in-game skill descriptions to see which stat her abilities scale with.` },
    { q: `Best F2P ${a.sp} W-Engine?`, a: (() => {
      const f2p = wengs.filter(w => w.r === 'A').slice(0, 2);
      return f2p.length > 0
        ? `The A-Rank ${f2p.map(w => `<strong>${esc(w.n)}</strong>`).join(' and ')} ${f2p.length > 1 ? 'are' : 'is'} excellent F2P options for ${esc(a.n)}. ${f2p[0].sub} substats provide solid synergy without spending Monochrome.`
        : `Check the Recommended W-Engines section above for A-Rank options that work well with ${esc(a.n)}.`;
    })() },
    { q: `Which Drive Disc set is best?`, a: discs.length > 0
      ? `For ${esc(a.n)}, the <strong>${esc(discs[0].n)}</strong> set (${discs[0].type}) is generally the strongest choice because ${discs[0].type === a.e ? `the ${a.e} DMG bonus directly amplifies her damage` : `the ${discs[0].type} bonuses synergize with her ${a.sp} playstyle`}. Mix with a 2-Piece ${a.sp === 'Attack' ? 'Woodpecker Electro or Astral Voice' : a.sp === 'Anomaly' ? 'Freedom Blues or Chaos Jazz' : a.sp === 'Stun' ? 'Shockstar Disco' : a.sp === 'Support' ? 'Swing Jazz or Astral Voice' : 'appropriate set'} for the 4+2 setup.`
      : `The best Drive Disc set depends on your team composition and playstyle. Browse all <a href="/drive-discs/" style="color:var(--accent)">Drive Discs</a> and use the <a href="/build-planner/" style="color:var(--accent)">Build Planner</a> to test different setups.` },
  ];

  // All agents dropdown
  const allOpts = AGENTS.map((o, i) =>
    `<option value="/agents/${o.s}/" ${i===idx?'selected':''}>${E_ICON[o.e]||''} ${esc(o.n)} (${o.r})</option>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<title>${esc(a.n)} — ${a.e} ${a.sp} | ZZZ Database</title>
<meta name="description" content="${esc(a.n)} — ${rankLabel(a.r)} ${a.e} ${a.sp}, ${a.f}. ${a.hp ? 'Base stats: '+a.hp.toLocaleString()+' HP / '+a.atk.toLocaleString()+' ATK / '+a.def.toLocaleString()+' DEF at Lv.60. ' : ''}Best builds, W-Engines, Drive Discs &amp; team compositions.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://zzless.com/agents/${a.s}/">
<meta property="og:title" content="${esc(a.n)} — ${a.e} ${a.sp} | ZZZ Database">
<meta property="og:description" content="${esc(a.n)} — ${rankLabel(a.r)} ${a.e} ${a.sp}, ${a.f}. Stats, best builds, W-Engines, Drive Discs &amp; team comps.">
<meta property="og:image" content="https://zzless.com/images/agents/${a.s}.png">
<meta property="og:url" content="https://zzless.com/agents/${a.s}/">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(a.n)} — ${a.e} ${a.sp} | ZZZ Database">
<meta name="twitter:description" content="${esc(a.n)} — ${rankLabel(a.r)} ${a.e} ${a.sp}, ${a.f}. Stats, builds, W-Engines, Drive Discs &amp; teams.">
<meta name="twitter:image" content="https://zzless.com/images/agents/${a.s}.png">
<link rel="stylesheet" href="/shared.css">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.7;font-size:16px}
.container{max-width:760px;margin:0 auto;padding:24px 20px 100px}

/* Breadcrumb */
.ag-bc{font-size:13px;color:var(--text3);margin-bottom:20px}
.ag-bc a{color:var(--accent);text-decoration:none}
.ag-bc a:hover{text-decoration:underline}
.ag-bc span{color:var(--text2)}

/* Prev/Next */
.ag-pn{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 0;border-top:1px solid rgba(134,168,231,0.08);border-bottom:1px solid rgba(134,168,231,0.08);margin-bottom:32px}
.ag-pn-link{color:var(--accent);text-decoration:none;font-size:14px;font-weight:500}
.ag-pn-link:hover{color:#fff}
.ag-pn-pos{font-size:12px;color:var(--text3)}

/* Top area */
.ag-top{display:flex;gap:32px;flex-wrap:wrap;align-items:center;margin-bottom:36px}
.ag-icon{width:140px;height:140px;border-radius:16px;overflow:hidden;border:3px solid ${border};background:${bg};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:64px}
.ag-icon img{width:100%;height:100%;object-fit:contain}
.ag-info h1{font-size:38px;font-weight:700;letter-spacing:-0.02em;margin-bottom:6px}
.ag-info .ag-sub{font-size:14px;color:var(--text2);margin-bottom:16px}
.ag-badges{display:flex;gap:10px;flex-wrap:wrap}
.ag-badge{padding:6px 16px;border-radius:20px;font-size:13px;font-weight:600;border:1.5px solid}
.ag-badge.rank{border-color:${color};color:${color};background:${bg}}
.ag-badge.elem{border-color:var(--accent);color:var(--accent);background:rgba(134,168,231,0.08)}
.ag-badge.spec{border-color:var(--gold);color:var(--gold);background:rgba(249,211,102,0.06)}

/* Stats */
.ag-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:24px}
.ag-stat{background:var(--surface);border:1px solid rgba(134,168,231,0.10);border-radius:12px;padding:16px;text-align:center}
.ag-stat .ag-stat-v{font-size:24px;font-weight:700}
.ag-stat .ag-stat-l{font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-top:4px}

/* Sections */
.ag-sec{background:var(--surface);border:1px solid rgba(134,168,231,0.10);border-radius:14px;padding:28px;margin-bottom:20px}
.ag-sec h2{font-size:17px;font-weight:600;margin-bottom:14px;color:var(--accent);display:flex;align-items:center;gap:8px}
.ag-sec p,.ag-sec li{font-size:14px;color:var(--text2);line-height:1.9}

/* Info grid */
.ag-igrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.ag-iitem{background:rgba(134,168,231,0.03);border-radius:10px;padding:16px 18px}
.ag-iitem .ag-ilbl{font-size:11px;color:var(--text3);text-transform:uppercase;margin-bottom:6px;letter-spacing:.03em}
.ag-iitem .ag-ival{font-size:16px;font-weight:600}

/* Chips */
.ag-chips{display:flex;flex-wrap:wrap;gap:10px}
.ag-chips-chip{display:inline-flex;align-items:center;gap:7px;padding:10px 18px;background:rgba(134,168,231,0.05);border:1px solid rgba(134,168,231,0.12);border-radius:22px;color:var(--text2);text-decoration:none;font-size:14px;transition:all .15s}
.ag-chips-chip:hover{border-color:rgba(134,168,231,0.5);color:#fff;background:rgba(134,168,231,0.12)}
.ag-chip-r{font-size:10px;padding:1px 6px;border-radius:3px;font-weight:700}
.ag-chip-s{color:#F9D366}.ag-chip-a{color:#c084fc}

/* Highlight card */
.ag-hl{border-left:3px solid #F9D366;border-radius:0 14px 14px 0}

/* Team comp cards */
.ag-tgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
.ag-tcard{background:rgba(134,168,231,0.04);border-radius:10px;padding:18px}
.ag-tcard .ag-tname{font-size:13px;font-weight:600;color:var(--gold);margin-bottom:10px}
.ag-tcard .ag-tline{font-size:13px;color:var(--text2);line-height:2}

/* FAQ grid */
.ag-fgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.ag-fitem{background:rgba(134,168,231,0.03);border-radius:10px;padding:16px}
.ag-fitem .ag-fq{font-size:13px;font-weight:600;color:var(--text);margin-bottom:6px}
.ag-fitem .ag-fa{font-size:13px;color:var(--text2);line-height:1.7}
.ag-fitem .ag-fa a{color:var(--accent);text-decoration:none}
.ag-fitem .ag-fa a:hover{text-decoration:underline}

/* Button */
.ag-btn{display:inline-block;padding:12px 24px;background:var(--accent);color:#fff!important;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;transition:background .15s}
.ag-btn:hover{background:#9bbaf0}

/* Bottom bar */
.ag-bbar{position:sticky;bottom:0;z-index:50;background:#1e1e26;border-top:1px solid rgba(134,168,231,0.15);padding:12px 20px;display:flex;align-items:center;gap:12px;margin-top:36px;border-radius:14px 14px 0 0}
.ag-bbar a{color:var(--accent);text-decoration:none;font-size:14px;font-weight:500;white-space:nowrap}
.ag-bbar a:hover{color:#fff}
.ag-bbar select{flex:1;padding:10px 14px;border:1px solid rgba(134,168,231,0.25);border-radius:10px;background:var(--surface);color:#fff;font-size:14px;cursor:pointer}

@media(max-width:600px){
  .ag-info h1{font-size:28px}.ag-icon{width:100px;height:100px;font-size:44px}
  .ag-pn{flex-wrap:wrap;justify-content:center}
  .ag-igrid{grid-template-columns:1fr}.ag-fgrid{grid-template-columns:1fr}
  .ag-stats{gap:8px}.ag-stat{padding:12px}.ag-stat .ag-stat-v{font-size:18px}
  .ag-top{gap:20px}
}
</style>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","@id":"https://zzless.com/agents/${a.s}/#webpage","name":"${esc(a.n)} — ${a.e} ${a.sp}","description":"${esc(a.n)} — ${rankLabel(a.r)} ${a.e} ${a.sp}, ${a.f}. Base stats at Lv.60.","url":"https://zzless.com/agents/${a.s}/","isPartOf":{"@type":"WebSite","name":"ZZZ Database","url":"https://zzless.com"}}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://zzless.com/"},{"@type":"ListItem","position":2,"name":"Agents","item":"https://zzless.com/agents/"},{"@type":"ListItem","position":3,"name":"${esc(a.n)}"}]}</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-1ESN49R4Q4"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-1ESN49R4Q4');</script>
<script type="text/javascript">(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "xl629udfvo");</script>
</head>
<body>
<nav aria-label="Main navigation">
<div class="nav-inner">
<a href="/" class="logo">ZZZ<span>DB</span></a>
<button class="hamburger" id="hb" aria-label="Menu">☰</button>
<div class="nav-right">
<ul class="nav-links" id="nl">
<li><a href="/tier-list/">Tier List</a></li>
<li><a href="/best-teams/">Best Teams</a></li>
<li><a href="/agents/">Agents</a></li>
<li><a href="/w-engines/">W-Engines</a></li>
<li><a href="/drive-discs/">Drive Discs</a></li>
<li><a href="/bangboo/">Bangboo</a></li>
<li><a href="/build-planner/" class="nav-highlight">Builder</a></li>
<li><a href="/codes/">Codes</a></li>
<li><a href="/items/">Items</a></li>
</ul>
</div>
</div>
</nav>
<main class="container">
<nav class="ag-bc" aria-label="Breadcrumb">
  <a href="/">Home</a> &ensp;›&ensp; <a href="/agents/">Agents</a> &ensp;›&ensp; <span>${esc(a.n)}</span>
</nav>
${pnNav("Previous and next agent")}
<div class="ag-top">
<div class="ag-icon"><img src="/images/agents/${a.s}.png" alt="${esc(a.n)}" onerror="this.parentElement.textContent='${a.icon}'" style="font-size:64px"></div>
<div class="ag-info">
<h1>${esc(a.n)}</h1>
<p class="ag-sub">${rankLabel(a.r)} · ${eIcon} ${a.e} · ${spIcon} ${a.sp} · ${a.f}</p>
<div class="ag-badges">
<span class="ag-badge rank">${rankLabel(a.r)}</span>
<span class="ag-badge elem">${eIcon} ${a.e}</span>
<span class="ag-badge spec">${spIcon} ${a.sp}</span>
</div>
${a.hp ? `<div class="ag-stats">
<div class="ag-stat"><div class="ag-stat-v" style="color:#22c55e">${a.hp.toLocaleString()}</div><div class="ag-stat-l">HP</div></div>
<div class="ag-stat"><div class="ag-stat-v" style="color:#ef4444">${a.atk.toLocaleString()}</div><div class="ag-stat-l">ATK</div></div>
<div class="ag-stat"><div class="ag-stat-v" style="color:#3b82f6">${a.def.toLocaleString()}</div><div class="ag-stat-l">DEF</div></div>
</div>
<p style="font-size:11px;color:var(--text3);margin-top:8px;text-align:center">Base Stats at Lv.60 — Source: Prydwen</p>` : ''}
</div>
</div>
<div class="ag-sec">
<h2>📋 Agent Overview</h2>
<div class="ag-igrid">
<div class="ag-iitem"><div class="ag-ilbl">Element</div><div class="ag-ival">${eIcon} ${a.e}</div></div>
<div class="ag-iitem"><div class="ag-ilbl">Specialty</div><div class="ag-ival">${spIcon} ${a.sp}</div></div>
<div class="ag-iitem"><div class="ag-ilbl">Faction</div><div class="ag-ival">${a.f}</div></div>
<div class="ag-iitem"><div class="ag-ilbl">Rarity</div><div class="ag-ival" style="color:${color}">${rankLabel(a.r)}</div></div>
${a.hp ? `<div class="ag-iitem"><div class="ag-ilbl">Max HP (Lv.60)</div><div class="ag-ival" style="color:#22c55e">${a.hp.toLocaleString()}</div></div>` : ''}
${a.atk ? `<div class="ag-iitem"><div class="ag-ilbl">Max ATK (Lv.60)</div><div class="ag-ival" style="color:#ef4444">${a.atk.toLocaleString()}</div></div>` : ''}
${a.def ? `<div class="ag-iitem"><div class="ag-ilbl">Max DEF (Lv.60)</div><div class="ag-ival" style="color:#3b82f6">${a.def.toLocaleString()}</div></div>` : ''}
${a.hp ? '<div class="ag-iitem"><div class="ag-ilbl">Data Source</div><div class="ag-ival">Prydwen</div></div>' : ''}
</div>
</div>
<div class="ag-sec ag-hl">
<h2>🎯 How to Obtain</h2>
<p>${obtainText(a)}</p>
</div>
${discsHTML}
${wengsHTML}
<div class="ag-sec">
<h2>👥 Team Building Tips</h2>
<p>${teamTips(a)}</p>
</div>
<div class="ag-sec">
<h2>❓ FAQ — ${esc(a.n)}</h2>
<div class="ag-fgrid">
${faqs.map(f => `<div class="ag-fitem"><div class="ag-fq">${f.q}</div><div class="ag-fa">${f.a}</div></div>`).join('')}
</div>
</div>
${(() => {
  const el = sameElem(a);
  if (!el.length) return '';
  return `<div class="ag-sec"><h2>${eIcon} Other ${a.e} Agents</h2><div class="ag-chips">${chipsHtml(el, o => E_ICON[o.e]||'')}</div></div>`;
})()}
${(() => {
  const sp = sameSpec(a);
  if (!sp.length) return '';
  return `<div class="ag-sec"><h2>${spIcon} Other ${a.sp} Agents</h2><div class="ag-chips">${chipsHtml(sp, o => SP_ICON[o.sp]||'')}</div></div>`;
})()}
${(() => {
  const fa = sameFaction(a);
  if (!fa.length) return '';
  return `<div class="ag-sec"><h2>🏠 Other ${a.f} Members</h2><div class="ag-chips">${chipsHtml(fa)}</div></div>`;
})()}
<div class="ag-sec ag-hl" style="text-align:center">
<h2 style="justify-content:center">🛠️ Ready to Build?</h2>
<p style="margin-bottom:18px">Configure ${esc(a.n)}'s W-Engine, Drive Discs, and team in the interactive build planner.</p>
<a href="/build-planner/editor.html?agent=${a.s}" class="ag-btn">Open Build Planner →</a>
</div>
${pnNav("Previous and next agent (bottom)")}
</main>
<nav class="ag-bbar" aria-label="Agent quick navigation">
<a href="/agents/">← All Agents</a>
<select onchange="if(this.value)location.href=this.value" aria-label="Jump to any agent">
<option value="">Jump to agent...</option>
${allOpts}
</select>
</nav>
<footer class="site-footer">
<div class="footer-inner">
<p>&copy; 2026 ZZZ Database. Not affiliated with HoYoverse.</p>
<div class="footer-links">
<a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/contact.html">Contact</a>
</div>
</div>
</footer>
<script>document.getElementById("hb").addEventListener("click",function(){document.getElementById("nl").classList.toggle("open")});</script>
</body>
</html>`;
}

// ── Main ───────────────────────────────────────────────────────────
let built = 0;
for (let i = 0; i < AGENTS.length; i++) {
  const a = AGENTS[i];
  const dir = path.join(AGENTS_DIR, a.s);
  const file = path.join(dir, 'index.html');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, buildPage(a, i), 'utf-8');
  built++;
  console.log(`  ✓ ${a.s}`);
}
console.log(`\nBuilt ${built} agent pages.`);
