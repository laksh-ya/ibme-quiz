import json,sys
from PIL import Image,ImageDraw
for w in json.load(open('src/data/lesson-cards.json')):
 if str(w['week']) not in sys.argv[1:]:continue
 files=[f'/downloads/card-{c["id"]}-390-light.png' for l in w['lectures'] for c in l['cards']]+[f'/downloads/cheat-w{w["week"]}-{i}-390-light.png' for i in range(len(w['cheatSheet']))]
 for page in range((len(files)+19)//20):
  out=Image.new('RGB',(1040,1108),'#ddd');d=ImageDraw.Draw(out)
  for j,f in enumerate(files[page*20:page*20+20]):
   im=Image.open(f);im.thumbnail((195,260));x=(j%5)*208;y=(j//5)*277;out.paste(im,(x,y+13));d.text((x,y),f.split('/')[-1],fill='#222')
  out.save(f'/downloads/v4-inspect-w{w["week"]}-{page}.jpg')
