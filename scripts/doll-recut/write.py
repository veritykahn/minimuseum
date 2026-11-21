"""Write the re-cut layers into the site as webp, and remake their picker thumbnails."""
import numpy as np, os
from PIL import Image
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import recut as R
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../../public/exhibitions/black-history/dolls/'); T=D+'thumbs/'  # written to the site; read from R.D (untouched)
def save_webp(arr,path):
    Image.fromarray((np.clip(arr,0,1)*255+0.5).astype(np.uint8),'RGBA').save(path,'WEBP',quality=90,method=6,alpha_quality=100)
sil={}
def silhouette(pose):
    if pose not in sil:
        a=np.array(Image.open(D+f'body/{pose}-t1.webp'))[...,3]
        s=np.zeros(a.shape+(4,),np.uint8); s[...,0]=222; s[...,1]=214; s[...,2]=206; s[...,3]=a
        sil[pose]=Image.fromarray(s,'RGBA')
    return sil[pose]
def bbox(path):
    a=np.array(Image.open(path))[...,3]
    ys,xs=np.where(a>1); return xs.min(),ys.min(),xs.max()-xs.min()+1,ys.max()-ys.min()+1
def thumb(rel,pose,box):
    l,t,w,h=box; side=round(max(w,h)*1.08); cx=l+w/2; cy=t+h/2
    left=round(cx-side/2); top=round(cy-side/2)
    canvas=Image.new('RGBA',(768+2*side,1376+2*side),(0,0,0,0))
    canvas.alpha_composite(silhouette(pose),(side,side))
    canvas.alpha_composite(Image.open(D+rel).convert('RGBA'),(side,side))
    canvas.crop((left+side,top+side,left+2*side,top+2*side)).resize((160,160),Image.LANCZOS).save(T+rel,'WEBP',quality=74,alpha_quality=80,method=6)
if __name__=='__main__':
    for sex,styles in R.STYLES.items():
        for st in styles:
            res,_=R.recut(sex,st)
            for c,arr in res.items(): save_webp(arr,D+f'hair/{sex}-hair-{st}-{c}.webp')
            box=bbox(D+f'hair/{sex}-hair-{st}-black.webp')
            for c in R.COLOURS: thumb(f'hair/{sex}-hair-{st}-{c}.webp',sex,box)
            print(sex,st)
    FACE=(290,120,190,150)
    for c in R.COLOURS:
        save_webp(R.recut_beard(c),D+f'extra/M-beard-{c}.webp'); thumb(f'extra/M-beard-{c}.webp','M',FACE)
    print('beards')
