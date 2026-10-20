import { S, save, streak } from "../state";
export function startActiveTime(root:HTMLElement){
 let last=performance.now(),pending=0,lastSave=0,held=false,stopped=false;
 const requestLock=()=>{if(stopped||document.hidden||held)return;if(navigator.locks)navigator.locks.request('ibme-active-time',{ifAvailable:true},async l=>{if(!l)return;held=true;while(!stopped&&!document.hidden)await new Promise(r=>setTimeout(r,1000));held=false;});else held=document.hasFocus();};
 const draw=()=>root.querySelectorAll('[data-streak]').forEach(e=>e.textContent=streak());
 const flush=()=>{if(pending>0){let remote=0;try{const n=Number(JSON.parse(localStorage.getItem('ibme_duo_v1')||'{}').activeSeconds);if(Number.isFinite(n)&&n>0)remote=n;}catch{}S.activeSeconds=Math.max(Number(S.activeSeconds)||0,remote)+pending;pending=0;save();}draw();};
 const tick=()=>{const now=performance.now(),delta=(now-last)/1000;last=now;requestLock();if(!document.hidden&&held&&delta>0&&delta<5)pending+=delta;if(now-lastSave>=10000){flush();lastSave=now;}};
 requestLock();const timer=setInterval(tick,1000);const visibility=()=>{flush();last=performance.now();if(!document.hidden)requestLock();};document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',flush);
 return()=>{stopped=true;clearInterval(timer);flush();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',flush);};
}
