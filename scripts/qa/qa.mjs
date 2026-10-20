import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
const server=process.env.QA_LIVE?null:spawn('npm',['run','preview','--','--host','127.0.0.1'],{stdio:'ignore'});
const base=process.env.QA_LIVE||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report=[];
try {
for(const w of [360,390,768,1280]){
 const page=await browser.newPage({viewport:{width:w,height:w===768?1024:780},deviceScaleFactor:3,isMobile:w<641,reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(let n=0;n<20;n++){try{await page.goto(base);break}catch{await new Promise(r=>setTimeout(r,300));}}
 await page.evaluate(()=>localStorage.setItem('ibme_duo_v1',JSON.stringify({set:{name:'Lakshya',theme:'dark',sound:false,haptic:false}})));await page.reload();await page.locator('.nav').first().waitFor();await page.evaluate(()=>document.fonts.ready);
 for(const [key,v] of Object.entries({learn:'learn',practice:'practice',pdfs:'pdfs',profile:'me'})){
  await page.locator(`[data-go="${v}"]`).first().click();await page.waitForTimeout(350);
  await page.screenshot({path:`/downloads/${process.env.QA_LIVE?'live':'local'}-${w}-${key}.png`});
  report.push({w,key,...await page.evaluate(()=>({overflow:[...document.querySelectorAll('.col,.pdfrow,.tile,.sbox,.avs')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>[e.className,e.clientWidth,e.scrollWidth]),bottom:document.querySelector('.side').getBoundingClientRect().top}))});
 }
 // All subpages and content at the bottom, not just the first screenful.
 for(const v of ['review','cards']) {await page.locator('[data-go="practice"]').first().click();await page.waitForTimeout(100);await page.locator(`[data-go="${v}"]`).first().click();await page.waitForTimeout(150);await page.screenshot({path:`/downloads/${process.env.QA_LIVE?'live':'local'}-${w}-${v}.png`});}
 await page.locator('[data-cards="all"]').click();await page.waitForTimeout(250);await page.screenshot({path:`/downloads/${process.env.QA_LIVE?'live':'local'}-${w}-flashcard.png`});
 await page.locator('[data-cx]').click();await page.waitForTimeout(150);
 await page.locator('[data-go="me"]').click();await page.locator('[data-ts="large"]').click();await page.locator('[data-go="pdfs"]').click();await page.waitForTimeout(200);await page.screenshot({path:`/downloads/${process.env.QA_LIVE?'live':'local'}-${w}-pdfs-large.png`});
 if(w===360){await page.locator('[data-go="me"]').click();await page.locator('#main').evaluate(e=>e.scrollTop=e.scrollHeight);await page.screenshot({path:`/downloads/${process.env.QA_LIVE?'live':'local'}-settings-bottom.png`});}
 report.push({w,errors});await page.close();
}
console.log(JSON.stringify(report,null,2));
}finally{await browser.close();server?.kill();}
