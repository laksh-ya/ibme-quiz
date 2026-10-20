import{esc}from'../lib/util';
const paths:Record<string,string>={
 bulb:'<path d="M20 9a12 12 0 1 0-13 20c3 2 3 5 3 7h12c0-2 0-5 3-7A12 12 0 0 0 20 9Z"/><path d="M11 41h10M13 46h6"/>',
 gear:'<path d="m19 4 2 6 6 2 6-3 5 5-3 6 2 6 6 2v8l-6 2-2 6-8 1-2-6-6-2-6 3-5-5 3-6-2-6-6-2v-8l6-2 2-6Z"/><circle cx="24" cy="24" r="7"/>',
 chart:'<path d="M7 6v35h35M14 32l9-13 8 5L42 8M33 8h9v9"/>',
 globe:'<circle cx="24" cy="24" r="19"/><ellipse cx="24" cy="24" rx="8" ry="19"/><path d="M6 19h36M6 29h36"/>',
 clock:'<circle cx="24" cy="24" r="19"/><path d="M24 12v13l9 5"/>',
 people:'<circle cx="18" cy="15" r="7"/><path d="M4 40v-5c0-12 28-12 28 0v5M33 9a7 7 0 0 1 0 14M38 28c6 1 6 8 6 12"/>',
 shield:'<path d="M24 4 6 11v14c0 10 18 19 18 19s18-9 18-19V11Z M15 24l6 7 13-15"/>',
 heart:'<path d="M24 42S3 29 3 15C3 3 20 1 24 12 28 1 45 3 45 15c0 14-21 27-21 27Z"/>',
 eye:'<path d="M3 24S12 8 24 8s21 16 21 16-9 16-21 16S3 24 3 24Z"/><circle cx="24" cy="24" r="7"/>',
 spark:'<path d="m24 3 5 15 16 6-16 5-5 16-6-16-15-5 15-6Z"/>',
 coin:'<circle cx="24" cy="24" r="19"/><path d="M30 14H20c-9 0-9 10 0 10h8c9 0 9 10 0 10H17M24 8v32"/>',
 flask:'<path d="M17 4h14M20 4v15L7 39c-2 4 0 5 4 5h26c4 0 6-1 4-5L28 19V4M14 29h20"/>',
 factory:'<path d="M4 42V22l13-8v8l13-8v8h14v20ZM35 22V5h7v17M12 31h4M24 31h4M36 31h3"/>',
 rocket:'<path d="M17 31C10 15 25 3 43 4c1 18-11 33-27 26ZM15 19H7l-4 13 12-1M30 33v8l-13 4 1-13M9 38l-5 6"/><circle cx="31" cy="16" r="4"/>',
 branch:'<path d="M24 43V26M24 26 8 10M24 26 40 10M24 26V5M3 10h10M8 5v10M35 5l10 10M45 5 35 15"/>',
 target:'<circle cx="24" cy="24" r="19"/><circle cx="24" cy="24" r="11"/><circle cx="24" cy="24" r="3"/>',
 lock:'<rect x="9" y="21" width="30" height="23" rx="4"/><path d="M15 21V12a9 9 0 0 1 18 0v9M24 30v6"/>',
 leaf:'<path d="M7 40C-2 8 21 9 42 3c6 24-4 39-25 34M9 39 31 16"/>',
};
export const artIcon=(kind='bulb')=>`<svg viewBox="0 0 48 48" aria-hidden="true" class="art-icon" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">${paths[kind]||paths.bulb}</svg>`;
const palette=['#58cc02','#1cb0f6','#ce82ff','#ff9600'];
const list=(s:any)=>s.items||s.nodes||[];
export function lessonArt(type:string,s:any):string|null{
 const ns=list(s);
 if(type==='plc')return `<div class="art-plc"><svg viewBox="0 0 330 220" role="img" aria-label="Sales rise through introduction and growth, peak at maturity, then decline"><defs><linearGradient id="curve" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#58cc02" stop-opacity=".4"/><stop offset="1" stop-color="#58cc02" stop-opacity="0"/></linearGradient></defs><path d="M20 190C70 190 75 155 110 85S200 15 240 50 280 155 315 175V195H20Z" fill="url(#curve)"/><path d="M20 190C70 190 75 155 110 85S200 15 240 50 280 155 315 175" fill="none" stroke="#58cc02" stroke-width="8" stroke-linecap="round"/><path d="M15 10v190h310" stroke="currentColor" stroke-opacity=".35" fill="none" stroke-width="2"/>${[[45,184],[115,78],[206,32],[290,150]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="10" fill="${palette[i]}" stroke="var(--bg)" stroke-width="4"/>`).join('')}</svg><div class="art-plc-labels">${(s.labels||['Introduction','Growth','Maturity','Decline']).map((l,i)=>`<span style="--tone:${palette[i]}"><b>${i+1}</b>${esc(l)}</span>`).join('')}</div><div class="art-axis"><span>Sales ↑</span><span>Time →</span></div></div>`;
 if(type==='hats')return `<div class="art-hats">${ns.map(n=>{const colors={white:'#f4f4f4',black:'#293540',red:'#ff4b4b',yellow:'#ffc800',green:'#58cc02',blue:'#1cb0f6'};const c=/^#[0-9a-f]{6}$/i.test(n.color||'')?n.color:colors[String(n.color||n.label).toLowerCase()]||'#ce82ff';return `<div style="--tone:${c}"><svg viewBox="0 0 100 75" aria-hidden="true"><path d="M22 57 28 15q22-15 44 0l6 42Z" fill="${c}" stroke="#89919a" stroke-width="1.5"/><path d="M25 43h50l2 10H23Z" fill="#0003"/><ellipse cx="50" cy="58" rx="44" ry="10" fill="${c}" stroke="#89919a" stroke-width="1.5"/></svg><b>${esc(n.label)}</b><span>${esc(n.detail||'')}</span></div>`}).join('')}</div>`;
 if(type==='table'){const rows=s.rows||[];return `<div class="art-pairs">${rows.map((r,i)=>`<div class="art-pair" style="--tone:${palette[i%4]}"><b>${esc(r[0])}</b><span class="art-pair-arrow">→</span><strong>${esc(r[1])}</strong></div>`).join('')}</div>`;}
 if(type==='key')return `<div class="art-key" style="--tone:${s.color||'#58cc02'}"><div class="art-key-orbit">${artIcon(s.icon)}</div><strong>${esc(s.label||'')}</strong><p>${esc(s.detail||'')}</p></div>`;
 if(['tiles','compare','equation','journey','loop'].includes(type))return `<div class="art-${type}">${ns.map((n,i)=>`<div class="art-unit" style="--tone:${palette[i%4]}"><div class="art-emblem">${artIcon(n.icon||['bulb','gear','chart','globe'][i%4])}</div><b>${esc(type==='equation'?String(n.label||'').replace(/^[+=]\s*/, ''):n.label||'')}</b>${n.detail?`<span>${esc(n.detail)}</span>`:''}</div>${['equation','journey','loop'].includes(type)&&i<ns.length-1?`<div class="art-link">${type==='equation'?(String(ns[i+1]?.label||'').startsWith('=')?'=':'+'):'↓'}</div>`:''}`).join('')}${type==='loop'?'<div class="art-repeat">↻ Repeat</div>':''}</div>`;
 return null;
}
