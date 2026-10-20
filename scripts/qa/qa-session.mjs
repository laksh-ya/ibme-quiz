import {chromium} from 'playwright';import{spawn}from'node:child_process';import fs from'node:fs';
const server=process.env.QA_LIVE?null:spawn('npm',['run','dev','--','--host','127.0.0.1'],{stdio:'ignore'});const base=process.env.QA_LIVE||'http://127.0.0.1:5173/';
const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:360,height:780},deviceScaleFactor:3,isMobile:true,reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
try{for(let n=0;n<20;n++){try{await p.goto(base);break}catch{await new Promise(r=>setTimeout(r,250));}}
await p.evaluate(()=>localStorage.setItem('ibme_duo_v1',JSON.stringify({set:{name:'Lakshya',theme:'dark',textSize:'large',sound:false,haptic:false}})));await p.reload();await p.locator('.nav').first().waitFor();
await p.locator('[data-go="practice"]').click();await p.locator('[data-hub="quiz"]').click();await p.locator('[data-start="shuffle"]').click();await p.locator('.opts').waitFor();
const qs=JSON.parse(fs.readFileSync('src/data/questions.json'));console.log('questions',qs.length);
let samples=0;const bad=[];
for(let i=0;i<80;i++){
const result=await p.evaluate(()=>{const opts=document.querySelector('.opts'),foot=document.querySelector('.ex-foot'),b=document.querySelector('.bubble');const last=opts.lastElementChild;opts.scrollTop=opts.scrollHeight;return {tag:document.querySelector('.tag')?.textContent,q:b.textContent.length,qscroll:b.scrollHeight>b.clientHeight+2,optionScroll:opts.scrollHeight>opts.clientHeight+2,last:last.getBoundingClientRect().bottom,foot:foot.getBoundingClientRect().top,overflow:[...document.querySelectorAll('.opt,.bubble')].some(e=>e.scrollWidth>e.clientWidth+2)}});
if(result.last>result.foot||result.overflow)bad.push(result);
if((result.q>500&&samples<3)||(i===0)) {await p.screenshot({path:`/downloads/${process.env.QA_LIVE?'live':'local'}-long-${samples++}.png`});console.log(result);}
await p.locator('[data-skip]').click();}
await p.locator('.done').waitFor();await p.screenshot({path:`/downloads/${process.env.QA_LIVE?'live':'local'}-results.png`});console.log(JSON.stringify({bad,errors}));
}finally{await b.close();server?.kill();}
