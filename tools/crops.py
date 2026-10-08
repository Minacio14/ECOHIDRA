from PIL import Image
S = 'C:/Users/inaci/AppData/Local/Temp/claude/C--Users-inaci-Desktop-Freelancing/af96c284-02e0-481e-a22e-157a3277a86c/scratchpad/'
O = 'C:/Users/inaci/Desktop/Freelancing/website_hydro/src/img/'
im = Image.open(S + 'rovubue_full.png').convert('RGB')
W, H = im.size

def crop(name, x, y, w, h, out_w, q=80):
    c = im.crop((x, y, x + w, y + h))
    c = c.resize((out_w, round(out_w * h / w)), Image.LANCZOS)
    c.save(O + name, quality=q, optimize=True, progressive=True)
    print(name, c.size)

crop('terrain-hero.jpg', 0, 1150, 2000, 1125, 1920, 78)
crop('terrain-a.jpg', 0, 250, 2000, 560, 1920, 78)
crop('terrain-b.jpg', 0, 2330, 2000, 560, 1920, 78)
crop('terrain-c.jpg', 0, 1650, 2000, 560, 1920, 78)
crop('terrain-cta.jpg', 0, 2700, 2000, 560, 1920, 76)
crop('terrain-hydro.jpg', 400, 1450, 1200, 900, 1200, 82)
crop('terrain-env.jpg', 450, 2300, 1200, 900, 1200, 82)

n1 = Image.open(S + 'n1_overlay.png').convert('RGB')
n1.save(O + 'n1-relief.jpg', quality=84, optimize=True, progressive=True)
print('n1-relief', n1.size)
