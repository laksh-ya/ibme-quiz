import{lessonArt}from"./lesson-art";
import { esc } from "../lib/util";
export interface LessonVisual {type:string;spec:any;}
const text=(v:any)=>typeof v==='string'?v:String(v??'');
const items=(v:any)=>Array.isArray(v)?v.map(x=>typeof x==='string'?{label:x}:x):[];
export const rich=(v:any)=>esc(text(v)).replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>");
export function lessonVisual(v:LessonVisual):string{
 const s=v?.spec||{};if(!v||v.type==='none')return '';const art=lessonArt(v.type,s);if(art!==null)return art;
 if(v.type==='flow'||v.type==='timeline'){const ns=items(s.nodes||s.steps||s.events);return `<div class="lv-${v.type}" aria-label="${v.type==='flow'?'Concept flow':'Timeline'}">${ns.map((n,i)=>`<div class="lv-stage"><span class="lv-count">${i+1}</span><div><b>${rich(n.label||n.title)}</b>${n.detail?`<p>${rich(n.detail)}</p>`:''}</div></div>${i<ns.length-1?'<div class="lv-arrow" aria-hidden="true">↓</div>':''}`).join('')}</div>`;}
 if(v.type==='table'){const hs=s.headers||s.columns||[];return `<div class="lv-table"><table><thead><tr>${hs.map(h=>`<th>${rich(h)}</th>`).join('')}</tr></thead><tbody>${(s.rows||[]).map(r=>`<tr>${r.map((c,j)=>`<td data-label="${esc(text(hs[j]))}">${rich(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
 if(v.type==='triangle'){const cs=items(s.corners||s.items);return `<div class="lv-triangle"><svg viewBox="0 0 300 130" role="img" aria-label="${rich(s.center||'Three connected demands')}"><path d="M150 12 25 118h250Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><circle cx="150" cy="12" r="9"/><circle cx="25" cy="118" r="9"/><circle cx="275" cy="118" r="9"/></svg><b>${rich(s.center)}</b><div class="lv-grid">${cs.map(c=>`<section><strong>${rich(c.label)}</strong>${c.detail?`<p>${rich(c.detail)}</p>`:''}</section>`).join('')}</div></div>`;}
 if(v.type==='story'){return `<div class="lv-story">${[['Scene',s.scene],['Change',s.change],['Meaning',s.meaning]].filter(x=>x[1]).map(([h,p],i)=>`<section><span class="lv-count">${i+1}</span><div><strong>${h}</strong><p>${rich(p)}</p></div></section>`).join('')}</div>`;}
 const is=items(s.items||s.labels||s.parts);return `<div class="lv-labelled">${s.title?`<h2>${rich(s.title)}</h2>`:''}<div class="lv-grid ${v.type==='grid2x2'?'two':''}">${is.map((n,i)=>`<section><span class="lv-count">${i+1}</span><strong>${rich(n.label||n.title)}</strong>${n.detail?`<p>${rich(n.detail)}</p>`:''}</section>`).join('')}</div></div>`;
}
