import json,subprocess
from pathlib import Path
base=json.loads(subprocess.check_output(['git','show','28b023e:src/data/lesson-cards.json']))
now=json.loads(Path('src/data/lesson-cards.json').read_text())
for old,w in zip(base,now):
 assert w['cheatSheet']==old['cheatSheet'],f'Week {w["week"]} cheat sheet changed'
 for before,l in zip(old['lectures'],w['lectures']):
  assert before['id']==l['id'] and before['sourceUrls']==l['sourceUrls']
  covered=[i for c in l['cards'] for i in c['sourceCardIds']]
  assert set(covered)=={c['id'] for c in before['cards']}
  assert len(covered)==len(set(covered))
  facts={f for c in l['cards'] for f in c['factIds']}
  assert facts=={c['factId'] for c in before['cards']}
  for c in l['cards']:
   assert len(c['lines']) in (3,4)
   assert all(len(p)>65 for p in c['lines'])
   assert c['kind']=='topic'
  original={x['id']:x for x in before['cards']}
  for c in l['cards']:
   assert c['topicVisuals'],c['id']
   for v in c['topicVisuals']:
    assert v['sourceCardId'] in c['sourceCardIds'],c['id']
    assert v['visual']==original[v['sourceCardId']]['visual'],c['id']
    assert v['title']==original[v['sourceCardId']]['title'],c['id']
    assert 1<=v['afterParagraph']<=len(c['lines']),c['id']

 print('Week',w['week'],': cheat sheet unchanged; every source card/fact covered once;',sum(len(l['cards']) for l in w['lectures']),'ordered topics')
