import json, subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[2]
base=json.loads(subprocess.check_output(['git','show','28b023e:src/data/lesson-cards.json'],cwd=root))
plans=json.loads((root/'scripts/content/topic-plans.json').read_text())
for w in base:
 for l in w['lectures']:
  if l['id'] not in plans: continue
  old={c['id']:c for c in l['cards']};seen=[];new=[]
  for title,ids,lines in plans[l['id']]:
   assert len(lines)>=3,(l['id'],title)
   cards=[old[i] for i in ids];seen+=ids
   new.append({'id':cards[0]['id'],'kind':'topic','title':title,'lines':lines,'visual':{'type':'none','spec':{}},'factId':cards[0].get('factId'),'factIds':[c.get('factId') for c in cards],'sourceCardIds':ids})
  assert len(seen)==len(set(seen)),l['id']
  assert set(seen)==set(old),(l['id'],set(old)-set(seen))
  l['cards']=new
(root/'src/data/lesson-cards.json').write_text(json.dumps(base,ensure_ascii=False,indent=2)+'\n')
