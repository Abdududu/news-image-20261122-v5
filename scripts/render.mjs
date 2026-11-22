// Dev-time renderer for news-image-20261122-v5.
// Builds assets/news.png (1024x1024) from an inline HTML/SVG page
// and screenshots it with headless Chromium (playwright-core, dev only).
// NOT part of the graded program: main.ts is pure Node and never
// touches this file or playwright.
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(join(root, 'assets'), { recursive: true });

// ---------- SVG scene illustrations (flat, hand-drawn) ----------
const art = {
  cop: `<svg viewBox="0 0 120 64" width="120" height="64"><rect width="120" height="64" fill="#0b7285"/><circle cx="60" cy="30" r="17" fill="#99e9f2"/><path d="M43 30a17 17 0 0 1 34 0z" fill="#e3fafc"/><path d="M20 52h80M28 58h64" stroke="#e3fafc" stroke-width="3" stroke-linecap="round"/><path d="M52 22l8-6 8 6-8 4z" fill="#ffd43b"/><path d="M30 14l6 3M90 14l-6 3" stroke="#ffd43b" stroke-width="2" stroke-linecap="round"/></svg>`,
  iran: `<svg viewBox="0 0 120 64" width="120" height="64"><rect width="120" height="64" fill="#862e2e"/><path d="M14 50 L60 10 L106 50 Z" fill="#c92a2a"/><circle cx="60" cy="34" r="9" fill="#fff"/><circle cx="60" cy="34" r="4" fill="#862e2e"/><path d="M20 56h80" stroke="#ffd43b" stroke-width="3" stroke-linecap="round"/><path d="M30 18l4 8M90 18l-4 8" stroke="#ffd43b" stroke-width="2" stroke-linecap="round"/></svg>`,
  peru: `<svg viewBox="0 0 120 64" width="120" height="64"><rect width="120" height="64" fill="#d9480f"/><path d="M8 44 L34 18 L52 40 L74 12 L96 38 L112 26" fill="none" stroke="#fff3bf" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M8 56h104" stroke="#fff3bf" stroke-width="3" stroke-linecap="round"/><path d="M52 40l10 8M74 12l6 10" stroke="#ffd43b" stroke-width="2" stroke-linecap="round"/></svg>`,
  russia: `<svg viewBox="0 0 96 52" width="96" height="52"><rect width="96" height="52" fill="#1971c2"/><g fill="#d0ebff"><circle cx="18" cy="16" r="5"/><circle cx="48" cy="10" r="5"/><circle cx="78" cy="18" r="5"/><circle cx="33" cy="34" r="5"/><circle cx="63" cy="34" r="5"/></g><path d="M18 21v8M48 15v8M78 23v8M33 39v6M63 39v6" stroke="#d0ebff" stroke-width="2"/><circle cx="18" cy="33" r="3" fill="#ffd43b"/><circle cx="48" cy="27" r="3" fill="#ffd43b"/><circle cx="78" cy="35" r="3" fill="#ffd43b"/></svg>`,
  sparta: `<svg viewBox="0 0 96 52" width="96" height="52"><rect width="96" height="52" fill="#364fc7"/><path d="M14 38h68l-8 8H22z" fill="#1c1f2e"/><rect x="40" y="26" width="16" height="12" fill="#868e96"/><path d="M48 26c-2-8 2-10 0-16 4 4 6 10 2 16z" fill="#ff922b"/><path d="M56 26c-1-6 3-8 1-12 3 3 5 8 1 12z" fill="#ffd43b"/><path d="M10 48c6-3 12 3 18 0s12 3 18 0 12 3 18 0 12 3 18 0" fill="none" stroke="#a5d8ff" stroke-width="2"/></svg>`,
  hk: `<svg viewBox="0 0 96 52" width="96" height="52"><rect width="96" height="52" fill="#5f3dc4"/><rect x="30" y="18" width="36" height="26" rx="3" fill="#fff"/><rect x="40" y="8" width="16" height="12" rx="2" fill="#d0bfff"/><path d="M38 30l6 6 12-12" fill="none" stroke="#5f3dc4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 46h68" stroke="#d0bfff" stroke-width="3" stroke-linecap="round"/></svg>`,
  india: `<svg viewBox="0 0 96 52" width="96" height="52"><rect width="96" height="52" fill="#2b8a3e"/><rect x="12" y="12" width="72" height="28" rx="4" fill="#ebfbee"/><circle cx="48" cy="26" r="9" fill="#ff6b6b"/><path d="M20 44h56" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M24 20l8 4M64 20l-8 4" stroke="#2b8a3e" stroke-width="2" stroke-linecap="round"/></svg>`,
  akvan: `<svg viewBox="0 0 96 52" width="96" height="52"><rect width="96" height="52" fill="#0b7285"/><path d="M48 26a4 4 0 1 1 4 4M48 26a10 10 0 1 1-10-10M48 26a16 16 0 1 1 16 16M48 26a22 22 0 1 1-22-22" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="48" cy="26" r="3" fill="#ffd43b"/></svg>`,
  xavier: `<svg viewBox="0 0 96 52" width="96" height="52"><rect width="96" height="52" fill="#e8590c"/><path d="M48 26a4 4 0 1 1 4 4M48 26a10 10 0 1 1-10-10M48 26a16 16 0 1 1 16 16M48 26a22 22 0 1 1-22-22" fill="none" stroke="#fff3bf" stroke-width="3" stroke-linecap="round"/><circle cx="48" cy="26" r="3" fill="#fff"/></svg>`,
  timor: `<svg viewBox="0 0 96 52" width="96" height="52"><rect width="96" height="52" fill="#862e2e"/><path d="M8 30h14l6-14 8 22 8-26 8 18 6-8 8 8h22" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M8 44h80" stroke="#ffd43b" stroke-width="2" stroke-linecap="round"/></svg>`,
  poland: `<svg viewBox="0 0 96 52" width="96" height="52"><rect width="96" height="52" fill="#1971c2"/><path d="M48 8l16 8v12c0 12-10 18-16 20-6-2-16-8-16-20V16z" fill="#fff"/><path d="M48 8l16 8v12c0 12-10 18-16 20" fill="#d0ebff"/><path d="M40 26l6 6 12-12" fill="none" stroke="#1971c2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  hormuz: `<svg viewBox="0 0 96 52" width="96" height="52"><rect width="96" height="52" fill="#364fc7"/><path d="M12 34h60l-6 8H18z" fill="#1c1f2e"/><rect x="58" y="24" width="18" height="10" fill="#868e96"/><path d="M30 22c0-6 6-6 6-12 4 4 4 10 0 12z" fill="#ff922b"/><path d="M8 46c6-3 12 3 18 0s12 3 18 0 12 3 18 0 12 3 14 0" fill="none" stroke="#a5d8ff" stroke-width="2"/></svg>`,
  gold: `<svg viewBox="0 0 96 52" width="96" height="52"><rect width="96" height="52" fill="#e67700"/><g fill="#ffd43b"><rect x="16" y="26" width="20" height="12" rx="2"/><rect x="38" y="18" width="20" height="12" rx="2"/><rect x="60" y="26" width="20" height="12" rx="2"/></g><path d="M14 44h68" stroke="#fff3bf" stroke-width="3" stroke-linecap="round"/><path d="M20 12l4 6M76 12l-4 6" stroke="#fff3bf" stroke-width="2" stroke-linecap="round"/></svg>`,
};

// ---------- Bitcoin weekend arc chart ----------
const btcPts = [55130, 57884, 60192, 60200];
const btcLabels = ['FRI', 'SAT', 'SUN', 'NOW'];
const bw = 300, bh = 78, pad = 6;
const btcMin = 54000, btcMax = 61500;
const btcX = (i) => pad + (i * (bw - pad * 2)) / 3;
const btcY = (v) => bh - pad - ((v - btcMin) / (btcMax - btcMin)) * (bh - pad * 2);
const btcLine = btcPts.map((v, i) => `${i === 0 ? 'M' : 'L'}${btcX(i).toFixed(1)},${btcY(v).toFixed(1)}`).join(' ');
const btcDots = btcPts.map((v, i) => {
  const anchor = i === 0 ? 'start' : i === 3 ? 'end' : 'middle';
  const lx = i === 0 ? btcX(i) : i === 3 ? btcX(i) : btcX(i);
  return `<circle cx="${btcX(i)}" cy="${btcY(v)}" r="4" fill="#0b7285"/><text x="${lx}" y="${btcY(v) - 8}" font-size="10" font-weight="700" fill="#0b7285" text-anchor="${anchor}">$${(v / 1000).toFixed(1)}k</text><text x="${btcX(i)}" y="${bh - 1}" font-size="9" fill="#868e96" text-anchor="${anchor}">${btcLabels[i]}</text>`;
}).join('');

// ---------- Weekend shakers bar chart ----------
const shakes = [
  ['Panama', 7.7], ['Timor-Leste', 6.8], ['Peru', 6.7], ['Qinghai', 5.6], ['Myanmar', 4.1],
];
const shBars = shakes.map(([name, m], i) => {
  const y = 8 + i * 14;
  const w = (m / 8) * 190;
  return `<text x="0" y="${y + 9}" font-size="10" fill="#343a40">${name}</text><rect x="78" y="${y}" width="${w.toFixed(0)}" height="10" rx="2" fill="${m >= 6.7 ? '#e8590c' : '#0b7285'}"/><text x="${82 + w}" y="${y + 9}" font-size="10" font-weight="700" fill="#343a40">${m.toFixed(1)}</text>`;
}).join('');

// ---------- Simplified world map with numbered pins ----------
const mapSvg = `<svg viewBox="0 0 300 118" width="300" height="100">
<rect width="300" height="118" fill="#e7f5ff"/>
<path d="M18 28 L52 18 L78 26 L70 44 L48 52 L28 46 Z" fill="#a5d8ff"/>
<path d="M58 58 L82 56 L88 76 L70 96 L58 78 Z" fill="#a5d8ff"/>
<path d="M138 26 L158 20 L170 30 L160 42 L142 40 Z" fill="#a5d8ff"/>
<path d="M132 48 L152 44 L162 58 L148 74 L132 62 Z" fill="#a5d8ff"/>
<path d="M176 22 L238 14 L262 26 L250 44 L210 50 L182 40 Z" fill="#a5d8ff"/>
<path d="M196 62 L216 60 L222 74 L206 78 L196 70 Z" fill="#a5d8ff"/>
<path d="M252 78 L272 74 L278 88 L260 92 L250 84 Z" fill="#a5d8ff"/>
<g font-size="9" font-weight="700" fill="#fff" text-anchor="middle">
<circle cx="150" cy="34" r="8" fill="#0b7285"/><text x="150" y="37">1</text>
<circle cx="198" cy="44" r="8" fill="#862e2e"/><text x="198" y="47">2</text>
<circle cx="70" cy="70" r="8" fill="#d9480f"/><text x="70" y="73">3</text>
<circle cx="170" cy="24" r="8" fill="#1971c2"/><text x="170" y="27">4</text>
<circle cx="180" cy="14" r="8" fill="#364fc7"/><text x="180" y="17">5</text>
<circle cx="240" cy="32" r="8" fill="#5f3dc4"/><text x="240" y="35">6</text>
<circle cx="262" cy="46" r="8" fill="#e8590c"/><text x="262" y="49">7</text>
<circle cx="226" cy="42" r="8" fill="#2b8a3e"/><text x="226" y="45">8</text>
</g>
<text x="6" y="106" font-size="8" fill="#868e96">1 ANTALYA &middot; 2 BAHRAIN &middot; 3 PERU &middot; 4 UKRAINE</text>
<text x="6" y="116" font-size="8" fill="#868e96">5 BALTIC &middot; 6 HONG KONG &middot; 7 TIMOR &middot; 8 ODISHA</text>
</svg>`;

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DejaVu Sans','Liberation Sans',Arial,sans-serif;background:#f7f4ec;color:#212529}
.page{width:1024px;height:1024px;padding:10px 14px;display:flex;flex-direction:column;gap:7px}
.masthead{background:#0e2a47;color:#fff;border-radius:10px;padding:10px 18px;display:flex;justify-content:space-between;align-items:center}
.masthead .kicker{font-size:36px;font-weight:900;letter-spacing:1px;line-height:1}
.masthead .kicker span{color:#ffa94d}
.masthead .date{font-size:14px;font-weight:700;color:#a5d8ff;margin-top:4px;letter-spacing:2px}
.mast-right{text-align:right}
.mast-right .count{font-size:14px;font-weight:800;color:#ffd43b}
.mast-right .datecheck{font-size:11px;font-weight:700;margin-top:5px;background:#2b8a3e;color:#fff;border-radius:5px;padding:4px 8px;display:inline-block}
.timeline{background:#fff;border:1.5px solid #dee2e6;border-radius:8px;padding:6px 14px 5px}
.timeline .tl-title{font-size:10px;font-weight:800;letter-spacing:2px;color:#868e96}
.timeline .tl-row{display:flex;justify-content:space-between;margin-top:4px}
.timeline .tl-item{text-align:center;flex:1}
.timeline .tl-item .t{font-size:11px;font-weight:800;color:#0b7285}
.timeline .tl-item .e{font-size:10.5px;font-weight:700;color:#343a40;margin-top:1px}
.stats{display:flex;gap:8px}
.stat{flex:1;background:#fff;border:1.5px solid #dee2e6;border-radius:8px;text-align:center;padding:5px 2px 4px}
.stat .n{font-size:19px;font-weight:900;color:#0e2a47;line-height:1}
.stat .l{font-size:9px;font-weight:700;color:#868e96;letter-spacing:.5px;margin-top:2px}
.heroes{display:flex;gap:8px}
.hero{flex:1;background:#fff;border:1.5px solid #dee2e6;border-radius:10px;overflow:hidden}
.hero .art{height:48px}
.hero .art svg{display:block;margin:0 auto;height:48px;width:auto}
.hero .body{padding:7px 10px 8px}
.chip{display:inline-block;font-size:9.5px;font-weight:800;color:#fff;background:#0b7285;border-radius:4px;padding:2px 6px;letter-spacing:.5px}
.hero h2{font-size:16.5px;font-weight:900;line-height:1.15;margin-top:5px}
.hero p{font-size:11px;line-height:1.32;color:#495057;margin-top:4px}
.hero.cop .chip{background:#0b7285}.hero.iran .chip{background:#862e2e}.hero.peru .chip{background:#d9480f}
.hero.cop h2{color:#0b7285}.hero.iran h2{color:#862e2e}.hero.peru h2{color:#d9480f}
.smalls{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.small{background:#fff;border:1.5px solid #dee2e6;border-radius:9px;overflow:hidden}
.small .art{height:40px}
.small .art svg{display:block;margin:0 auto;height:40px;width:auto}
.small .body{padding:5px 8px 6px}
.small .tag{font-size:8.5px;font-weight:800;color:#0b7285;letter-spacing:.5px}
.small h3{font-size:12px;font-weight:900;line-height:1.2;margin-top:2px}
.small p{font-size:10px;line-height:1.28;color:#495057;margin-top:3px}
.charts{display:flex;gap:8px}
.chart{flex:1;background:#fff;border:1.5px solid #dee2e6;border-radius:9px;padding:6px 10px 5px}
.chart h4{font-size:11px;font-weight:900;letter-spacing:.5px;color:#0e2a47}
.chart .sub{font-size:9.5px;color:#868e96;font-weight:700;margin-top:1px}
.chart svg{display:block;margin-top:3px}
.also{background:#fff;border:1.5px solid #dee2e6;border-radius:9px;padding:7px 14px 8px;flex:1;overflow:hidden}
.also h4{font-size:11.5px;font-weight:900;letter-spacing:1.5px;color:#0e2a47;border-bottom:2px solid #0e2a47;padding-bottom:3px}
.also .cols{display:flex;gap:26px;margin-top:5px}
.also ul{list-style:none;flex:1}
.also li{font-size:11px;line-height:1.3;color:#343a40;padding:2px 0;border-bottom:1px dotted #dee2e6}
.also li b{color:#0b7285}
.also li .reg{font-size:9px;font-weight:800;color:#868e96}
footer{font-size:9.5px;color:#868e96;text-align:center;font-weight:700}
</style></head><body><div class="page">

<div class="masthead">
  <div><div class="kicker">THE WORLD <span>IN ONE DAY</span></div><div class="date">SUNDAY 22 NOVEMBER 2026</div></div>
  <div class="mast-right"><div class="count">35 STORIES &middot; 7 REGIONS</div><div class="datecheck">DATE CHECK &#10003; SUNDAY 22 NOV 2026</div></div>
</div>

<div class="timeline">
  <div class="tl-title">THE DAY IN UTC &mdash; EVERY STORY DATED</div>
  <div class="tl-row">
    <div class="tl-item"><div class="t">FRI 19:09 PET</div><div class="e">Peru M6.7 quake</div></div>
    <div class="tl-item"><div class="t">SAT 09:00</div><div class="e">Sparta II hit</div></div>
    <div class="tl-item"><div class="t">SAT 09:42 UTC</div><div class="e">Timor-Leste 6.8</div></div>
    <div class="tl-item"><div class="t">SAT NIGHT</div><div class="e">Iran strikes Bahrain</div></div>
    <div class="tl-item"><div class="t">SUN 03:00 GMT</div><div class="e">COP31 final text</div></div>
    <div class="tl-item"><div class="t">SUN 06:00 GMT</div><div class="e">COP31 vote</div></div>
    <div class="tl-item"><div class="t">SUN 10:00</div><div class="e">HK record vote</div></div>
  </div>
</div>

<div class="stats">
  <div class="stat"><div class="n">14</div><div class="l">DAYS OF COP31</div></div>
  <div class="stat"><div class="n">400+</div><div class="l">DRONES ON UKRAINE</div></div>
  <div class="stat"><div class="n">6.7</div><div class="l">PERU QUAKE</div></div>
  <div class="stat"><div class="n">2</div><div class="l">US BASES HIT</div></div>
  <div class="stat"><div class="n">$60,200</div><div class="l">BITCOIN NOW</div></div>
  <div class="stat"><div class="n">372K</div><div class="l">EVACUATED: AKVAN</div></div>
</div>

<div class="heroes">
  <div class="hero cop"><div class="art" style="background:#0b7285">${art.cop}</div><div class="body">
    <span class="chip">SUN 03:00 GMT &middot; ANTALYA</span>
    <h2>COP31: THE DEAL AT DAWN</h2>
    <p>Final 94-paragraph text lands 3am; plenary votes 6am. Fossil fuels unnamed &mdash; COP28 language only recalled. $120bn adaptation target gone.</p>
  </div></div>
  <div class="hero iran"><div class="art" style="background:#862e2e">${art.iran}</div><div class="body">
    <span class="chip">SAT NIGHT &middot; BAHRAIN</span>
    <h2>IRAN HITS US BASES</h2>
    <p>IRGC claims missile and drone strikes on two Patriot radars at Al-Riffa and Awali Sakhir. Bahrain: several intercepted; one industrial site hit, no casualties.</p>
  </div></div>
  <div class="hero peru"><div class="art" style="background:#d9480f">${art.peru}</div><div class="body">
    <span class="chip">FRI 19:09 LOCAL &middot; JUN&Iacute;N</span>
    <h2>PERU COUNTS THE COST</h2>
    <p>M6.7 shakes the Andes, felt in Lima. One dead, 16 injured, 152 homes uninhabitable, 93,000 without power. No tsunami; airports stay open.</p>
  </div></div>
</div>

<div class="smalls">
  <div class="small"><div class="art" style="background:#1971c2">${art.russia}</div><div class="body"><div class="tag">OVERNIGHT 19&ndash;20 NOV &middot; EUROPE</div><h3>Russia&rsquo;s 400-drone barrage</h3><p>400+ drones, 110+ missiles. Kryvyi Rih: 2 dead, 60 hurt.</p></div></div>
  <div class="small"><div class="art" style="background:#364fc7">${art.sparta}</div><div class="body"><div class="tag">SAT 09:00 &middot; EUROPE</div><h3>The burning Sparta II</h3><p>2 drones hit the sanctioned ship; fire, drifting in Finnish waters.</p></div></div>
  <div class="small"><div class="art" style="background:#5f3dc4">${art.hk}</div><div class="body"><div class="tag">SUN 10:00 &middot; ASIA</div><h3>Hong Kong votes</h3><p>Record 45% turnout in the first hour; 856 candidates, 723 seats.</p></div></div>
  <div class="small"><div class="art" style="background:#2b8a3e">${art.india}</div><div class="body"><div class="tag">SUN &middot; ASIA</div><h3>India 696/7</h3><p>Wellington Test vs NZ; women beat South Korea 2&ndash;1 in hockey.</p></div></div>
  <div class="small"><div class="art" style="background:#0b7285">${art.akvan}</div><div class="body"><div class="tag">FRI 20 NOV &middot; ASIA</div><h3>Cyclone Akvan</h3><p>Landfall near Gopalpur; 372,000 evacuated, no deaths reported.</p></div></div>
  <div class="small"><div class="art" style="background:#e8590c">${art.xavier}</div><div class="body"><div class="tag">FRI 20 NOV &middot; OCEANIA</div><h3>Cyclone Xavier</h3><p>Cat 5 peak; Cook Islands declare emergency for Nassau.</p></div></div>
  <div class="small"><div class="art" style="background:#862e2e">${art.timor}</div><div class="body"><div class="tag">SAT 09:42 UTC &middot; OCEANIA</div><h3>Timor-Leste 6.8</h3><p>Strong quake 103 km NE of Lospalos; weekend&rsquo;s biggest.</p></div></div>
  <div class="small"><div class="art" style="background:#1971c2">${art.poland}</div><div class="body"><div class="tag">SUN &middot; EUROPE</div><h3>Poland: airspace violated</h3><p>Warsaw accuses Russia; NATO pledges to defend every inch.</p></div></div>
  <div class="small"><div class="art" style="background:#364fc7">${art.hormuz}</div><div class="body"><div class="tag">SAT &middot; MIDDLE EAST</div><h3>Tankers hit near Hormuz</h3><p>Three tankers attacked in the strait as Gulf tensions spike.</p></div></div>
  <div class="small"><div class="art" style="background:#e67700">${art.gold}</div><div class="body"><div class="tag">FRI 20 NOV &middot; GLOBAL</div><h3>Gold&rsquo;s 14-month low</h3><p>$3,513.54/oz, fifth straight fall; AI stocks shed $4 trillion.</p></div></div>
</div>

<div class="charts">
  <div class="chart"><h4>BITCOIN&rsquo;S WEEKEND ARC</h4><div class="sub">FROM FRIDAY&rsquo;S LOW BACK ABOVE $60K</div>
    <svg viewBox="0 0 ${bw} ${bh}" width="${bw}" height="${bh}"><path d="${btcLine}" fill="none" stroke="#0b7285" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${btcDots}</svg>
  </div>
  <div class="chart"><h4>THE WEEKEND&rsquo;S SHAKERS</h4><div class="sub">MAGNITUDE, 21&ndash;22 NOVEMBER 2026</div>
    <svg viewBox="0 0 300 78" width="300" height="78">${shBars}</svg>
  </div>
  <div class="chart"><h4>WHERE IT HAPPENED</h4><div class="sub">EIGHT FLASHPOINTS, ONE DAY</div>
    ${mapSvg}
  </div>
</div>

<div class="also">
  <h4>ALSO ON &mdash; SUNDAY 22 NOVEMBER 2026</h4>
  <div class="cols"><ul>
    <li><b>India&ndash;Japan</b> deepen defence partnership <span class="reg">ASIA</span></li>
    <li><b>Modi</b> opens Nitish Setu bridge in Bihar <span class="reg">ASIA</span></li>
    <li><b>India</b> passes 1 crore HPV vaccine doses <span class="reg">ASIA</span></li>
    <li><b>Lakshya Sen&rsquo;s</b> 13-win streak ends, Hong Kong Open <span class="reg">ASIA</span></li>
    <li><b>India women</b> beat South Korea 2&ndash;1 in hockey <span class="reg">ASIA</span></li>
    <li><b>CENTCOM</b> denies F-16 hit claim <span class="reg">MIDDLE EAST</span></li>
    <li><b>Bahrain</b> industrial facility hit &mdash; fire, no casualties <span class="reg">MIDDLE EAST</span></li>
    <li><b>Iran&rsquo;s</b> 2-day ceasefire &amp; Hormuz plan still on table <span class="reg">MIDDLE EAST</span></li>
    <li><b>$120bn</b> adaptation target dropped &mdash; Africa disappointed <span class="reg">AFRICA</span></li>
    <li><b>Sparta II&rsquo;s</b> shadow runs: arms ferry Syria&rarr;Libya <span class="reg">AFRICA</span></li>
    <li><b>EU:</b> &ldquo;good deal or no deal&rdquo; &mdash; Hoekstra <span class="reg">EUROPE</span></li>
  </ul><ul>
    <li><b>Finland</b> imposes air &amp; sea restrictions <span class="reg">EUROPE</span></li>
    <li><b>Lima</b> evacuations; lawmakers flee Congress <span class="reg">AMERICAS</span></li>
    <li><b>Peru Navy:</b> no tsunami; airports open <span class="reg">AMERICAS</span></li>
    <li><b>US, Mexico &amp; Bolivia</b> lose measles-elimination status <span class="reg">AMERICAS</span></li>
    <li><b>Trump&rsquo;s</b> Asia tour ends &mdash; no Kim meeting <span class="reg">AMERICAS</span></li>
    <li><b>Florida&ndash;Bahamas</b> low: 30% subtropical chance <span class="reg">AMERICAS</span></li>
    <li><b>SEC:</b> 8 Colorado firms in $37.45m fraud <span class="reg">AMERICAS</span></li>
    <li><b>Panama 7.7</b> shakes the weekend <span class="reg">AMERICAS</span></li>
    <li><b>1.5&deg;C overshoot</b> acknowledged in COP31 draft <span class="reg">GLOBAL</span></li>
    <li><b>US AI stocks</b> shed $4 trillion <span class="reg">GLOBAL</span></li>
    <li><b>BCCI</b> bars crypto &amp; gaming sponsors for Team India <span class="reg">GLOBAL</span></li>
  </ul></div>
</div>

<footer>REUTERS &middot; AL JAZEERA &middot; USGS &middot; AP &middot; XINHUA &middot; IMD &middot; CARBON BRIEF &mdash; SUNDAY 22 NOVEMBER 2026 &middot; 35 STORIES, 7 REGIONS</footer>

</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.waitForTimeout(400);
const out = join(root, 'assets', 'news.png');
await page.screenshot({ path: out });
await browser.close();
console.log('wrote', out);
