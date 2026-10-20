import curriculum from "../data/lessons.json";
import { S, save } from "../state";
import { ui } from "../ui";
import { esc } from "../lib/util";
import { I } from "../lib/icons";
import { render } from "../app";

export interface TeachingStep { title:string; body:string[]; example?:string; trap?:string; check?:{question:string;options:string[];answer:number;explanation:string}; }
export interface Lesson { id:string; title:string; lectureRefs:string[]; sourceUrls:string[]; steps:TeachingStep[]; }
export interface TeachingWeek { week:number; title:string; summary:string; sourceUrls:string[]; lessons:Lesson[]; }
export const weeks = curriculum as TeachingWeek[];
const progress = () => S.study || (S.study = {});
export const weekTeaching = (w:number) => weeks.find(v=>v.week===w);
export function pgLessons() {
 const w = weekTeaching(ui.studyWeek);
 if (!w || !S.set.beta) return '<h1 class="pg">Study lessons</h1><p class="sub">No lessons published for this week yet.</p><button class="btn" data-go="learn">Back to weeks</button>';
 return `<button class="pill" data-go="learn">‹ All weeks</button><h1 class="pg teaching-title">Week ${w.week}: ${esc(w.title)}</h1><p class="beta-note">Beta preview · Five lectures, with explanations and checkpoints. Your quiz scores stay separate.</p><p class="sub">${esc(w.summary)}</p><div class="lesson-list">${w.lessons.map((l,i)=>{const p=progress()[l.id];return `<button class="tile" data-lesson="${esc(l.id)}"><span class="n">Lesson ${i+1} · ${l.steps.length} steps${p?.done?' · Complete':''}</span><b>${esc(l.title)}</b><span class="tile-desc">${esc(l.lectureRefs.join(' · '))}</span><span class="lesson-action">${p?.done?'Revisit':p?.step?'Continue':'Start lesson'} →</span></button>`}).join('')}</div><div class="lesson-practice"><h2 class="ti">Put it into practice</h2><p>Teaching progress and quiz scores are kept separately.</p><button class="btn" data-start="week:${w.week}:learn">Practice Week ${w.week}</button><button class="btn white g" data-start="week:${w.week}:quiz">Take the quiz</button></div>`;
}
export function openLesson(id:string) {
 if(!S.set.beta)return;
 const lesson=weeks.flatMap(w=>w.lessons).find(l=>l.id===id);if(!lesson)return;
 const old=progress()[id];ui.teach={lesson,step:old?.done?0:Math.max(0,Math.min(lesson.steps.length-1,old?.step||0)),picked:null,checked:false,complete:false};renderTeaching();
}
export function closeTeaching() { ui.teach=null;ui.page='lessons';render(); }
export function teachingBack() { const t=ui.teach;if(!t)return;if(t.complete)t.complete=false;else if(t.step>0)t.step--;else return closeTeaching();t.picked=null;t.checked=false;renderTeaching(); }
export function teachingNext() {
 const t=ui.teach;if(!t||t.complete)return;const s=t.lesson.steps[t.step];if(s.check&&!t.checked)return;
 if(t.step===t.lesson.steps.length-1){progress()[t.lesson.id]={step:t.step,done:true};t.complete=true;}else{t.step++;progress()[t.lesson.id]={step:t.step,done:!!progress()[t.lesson.id]?.done};}
 save();t.picked=null;t.checked=false;renderTeaching();
}
export function teachingPick(index:number) {const t=ui.teach;if(!t||t.checked)return;const c=t.lesson.steps[t.step]?.check;if(!c||!Number.isInteger(index)||index<0||index>=c.options.length)return;const scroll=ui.el.querySelector(".teaching-body")?.scrollTop||0;t.picked=index;renderTeaching();ui.el.querySelector(".teaching-body").scrollTop=scroll;}
export function teachingCheck() {const t=ui.teach;if(!t||t.picked==null||t.checked)return;const scroll=ui.el.querySelector(".teaching-body")?.scrollTop||0;t.checked=true;renderTeaching();ui.el.querySelector(".teaching-body").scrollTop=scroll;}
export function renderTeaching() {
 const t=ui.teach;if(!t)return;const l=t.lesson as Lesson,s=l.steps[t.step],c=s.check;
 const sources=l.sourceUrls.filter(u=>/^https:\/\//.test(u));
 ui.el.innerHTML=`<div class="ex teaching"><div class="ex-top"><button class="x" data-teachclose="1" aria-label="Close lesson">${I.x}</button><div class="bar" role="progressbar" aria-label="Lesson progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round((t.step+(t.complete?1:0))/l.steps.length*100)}"><i style="width:${(t.step+(t.complete?1:0))/l.steps.length*100}%"></i></div><span class="teaching-count">${t.complete?'Done':`${t.step+1}/${l.steps.length}`}</span></div><main class="teaching-body" tabindex="-1"><article class="teaching-content"><span class="tag">${esc(l.title)}</span>${t.complete?`<h1 class="head">Lesson complete</h1><p>You worked through ${l.steps.length} steps. Try explaining the main ideas in your own words, then test them in practice.</p><button class="btn" data-teachclose="1">Back to lessons</button>`:`<h1 class="head">${esc(s.title)}</h1>${s.body.map(p=>`<p>${esc(p)}</p>`).join('')}${s.example?`<section class="teaching-note"><h2>Make it concrete</h2><p>${esc(s.example)}</p></section>`:''}${s.trap?`<section class="teaching-note trap"><h2>Watch the distinction</h2><p>${esc(s.trap)}</p></section>`:''}${c?`<section class="teaching-check"><h2>Check your understanding</h2><p>${esc(c.question)}</p><div class="teaching-options">${c.options.map((o,i)=>`<button class="opt ${t.picked===i?'sel':''} ${t.checked&&i===c.answer?'ok':''} ${t.checked&&t.picked===i&&i!==c.answer?'no':''}" data-teachpick="${i}" aria-pressed="${t.picked===i}" ${t.checked?'disabled':''}><span class="k">${String.fromCharCode(65+i)}</span><span class="t">${esc(o)}</span></button>`).join('')}</div>${t.checked?`<div class="teaching-feedback" role="status"><strong>${t.picked===c.answer?'That is right.':'Compare your reasoning.'}</strong><p>${esc(c.explanation)}</p></div>`:''}</section>`:''}`}<details class="teaching-sources"><summary>Lesson sources</summary><p>${esc(l.lectureRefs.join(' · '))}</p>${sources.map((u,i)=>`<a href="${esc(u)}" target="_blank" rel="noopener">Source ${i+1} ↗</a>`).join('')}</details></article></main><div class="teaching-scroll" hidden>Scroll for more ↓</div>${t.complete?'':`<footer class="ex-foot"><div class="in"><button class="btn skip" data-teachback="1">Back</button>${c&&!t.checked?`<button class="btn" data-teachcheck="1" ${t.picked==null?'disabled':''}>Check</button>`:`<button class="btn" data-teachnext="1">${t.step===l.steps.length-1?'Finish':'Continue'}</button>`}</div></footer>`}</div>`;
 const body=ui.el.querySelector(".teaching-body") as HTMLElement;
 const hint=ui.el.querySelector(".teaching-scroll") as HTMLElement;
 const updateHint=()=>{hint.hidden=body.scrollTop+body.clientHeight>=body.scrollHeight-8;};
 requestAnimationFrame(updateHint);body.addEventListener("scroll",updateHint,{passive:true});

}
