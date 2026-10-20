import {chromium} from 'playwright';
import fs from 'node:fs';
const weeks=JSON.parse(fs.readFileSync('src/data/lesson-cards.json'));
const b=await chromium.launch({args:['--no-sandbox']});
const ids=process.env.CARDS.split(',');
for(const theme of (process.env.THEMES||'light,dark').split(',')){
 const p=await b.newPage({viewport:{width:390,height:780}});
 await p.goto(process.env.BASE||'http://127.0.0.1:5173');
 await p.evaluate(theme=>localStorage.setItem('ibme_duo_v1',JSON.stringify({xp:75,set:{name:'lakshya',textSize:'large',theme,sound:false}})),theme);await p.reload();
 for(const id of ids){
  const w=weeks.find(w=>w.lectures.some(l=>l.cards.some(c=>c.id===id)));const l=w.lectures.find(l=>l.cards.some(c=>c.id===id));const i=l.cards.findIndex(c=>c.id===id);
  await p.locator('[data-go="lessons"]').click();await p.locator(`[data-lessonweek="${w.week}"]`).click();await p.locator(`[data-lesson="${l.id}"]`).click();await p.locator('[data-cardindex]').click();await p.locator(`[data-cardjump="${l.id}:${i}"]`).click();
  await p.screenshot({path:`/downloads/inspect-${id}-${theme}.png`});
  await p.locator('[data-teachclose]').click();await p.reload();
 }
 await p.close();
}
await b.close();
