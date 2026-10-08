import json, re
import numpy as np
import geopandas as gpd
from PIL import Image, ImageDraw, ImageFilter

S = 'C:/Users/inaci/AppData/Local/Temp/claude/C--Users-inaci-Desktop-Freelancing/af96c284-02e0-481e-a22e-157a3277a86c/scratchpad/'
base = Image.open(S + 'n1_relief.png').convert('RGB')
W, H = base.size
W0, S0, E0, N0 = 33.89, -20.76, 34.19, -20.46

def px(lon, lat):
    return ((lon - W0) / (E0 - W0) * W, (N0 - lat) / (N0 - S0) * H)

road = gpd.read_file('C:/Users/inaci/Desktop/Freelancing/CaseStudy_Demo/N1_Road_Screening/N1_demo_correct.geojson')
html = open('C:/Users/inaci/Desktop/Freelancing/website_hydro/src/pages/estudos/n1-dashboard.html', encoding='utf-8').read()
i = html.index('var crossData = ') + len('var crossData = ')
cd = json.loads(html[i:html.index('\n', i)].rstrip(';'))
pts = [(p['properties']['lon'], p['properties']['lat'], p['properties']['risk_class']) for p in cd['features']]

glow = Image.new('RGBA', base.size, (0, 0, 0, 0))
crisp = Image.new('RGBA', base.size, (0, 0, 0, 0))
gd, cdw = ImageDraw.Draw(glow), ImageDraw.Draw(crisp)
for geom in road.geometry:
    xy = [px(x, y) for x, y in geom.coords]
    gd.line(xy, fill=(217, 118, 74, 255), width=14)
    cdw.line(xy, fill=(255, 190, 150, 255), width=4)
col = {1: (150, 240, 230), 2: (150, 240, 230), 3: (255, 196, 90), 4: (255, 107, 74)}
rad = {1: 4, 2: 5, 3: 7, 4: 11}
for lon, lat, rc in sorted(pts, key=lambda t: t[2]):
    x, y = px(lon, lat)
    r = rad[rc]
    gd.ellipse((x - r * 2.2, y - r * 2.2, x + r * 2.2, y + r * 2.2), fill=col[rc] + (200,))
    cdw.ellipse((x - r, y - r, x + r, y + r), fill=col[rc] + (255,), outline=(255, 255, 255, 255), width=2)
glow = glow.filter(ImageFilter.GaussianBlur(9))
out = Image.alpha_composite(base.convert('RGBA'), glow)
out = Image.alpha_composite(out, crisp).convert('RGB')
out.save(S + 'n1_overlay.png')
out.save(S + 'n1_overlay.jpg', quality=84, optimize=True, progressive=True)
print(len(pts), out.size)
