"""
Design a doll: re-cut the hair layers (Nov 21 2026).

The owner's doll looked cut out badly: the hair left bald notches and hard,
ruler-straight edges round the face (the afro's right temple, the long
curls' forehead, the buzz cut and fade's bare sides), ends chopped flat, and
pale fringes on the outer edge. This fixes each hair layer in place:

  1. Fills the bald gaps in a band just outside the hairline with that
     colour's own hair (mirrored from the other side of the head where it
     has hair there, otherwise painted in from the hair around it), thinning
     out above the ears. Bantu knots and cornrows keep their partings: only
     the hairline itself is filled.
  2. Softens the hard cut where the hair meets the face, smooths a zig-zag
     fringe, and gives a fringe's straight bottom edge ragged tips.
  3. Gives hair that ends on one straight line ragged, soft tips.
  4. Defringes the outer edge: edge pixels take the solid hair's colour, and
     the edge comes in a touch. The beards get this step too.

All of a style's colours share one outline, so the mask is worked out once
(on black) and applied to every colour. The colours themselves are still the
first build's recolours of one picture; new colours should each be their own
picture, not recoloured here.

Run it on the untouched layers (the first build, e.g. from git), never on
its own output:
    git archive <commit> public/exhibitions/black-history/dolls | tar -x -C /tmp/dolls-src
    DOLL_SRC=/tmp/dolls-src/public/exhibitions/black-history/dolls/ python3 -I scripts/doll-recut/write.py
Needs python3 with numpy, pillow and opencv-python-headless. Then refresh
DOLL_BYTES in dollArt.ts (the page-weight test says which sizes changed).
"""
import sys, os, zlib, numpy as np, cv2
from PIL import Image
D=os.environ['DOLL_SRC']  # the untouched layers, so a rerun never re-cuts twice
OUT=os.environ.get('DOLL_OUT','/tmp/doll-recut/')  # only for trying a style on its own: python3 recut.py W:afro
COLOURS=['black','darkbrown','chestnut','auburn','red','blonde','grey']
STYLES={'W':['afro','bantu','bob','braids','bun','curls','locs','pixie','plait','ponytail','puffs','straight','twists','wavy'],
        'M':['afro','bun','buzz','cornrows','curly','fade','locs','straight','twists','wavy']}
H,Wd=1376,768
CX=387
yy,xx=np.mgrid[0:H,0:Wd]
def ellipse(cx,cy,a,b): return ((xx-cx)/a)**2+((yy-cy)/b)**2
# face opening: inside this ellipse is face
FACE={'W':(CX,190,59,76),'M':(CX,190,60,78)}
BAND=34   # how far out from the hairline a gap is filled
def head_alpha(sex):
    b=np.array(Image.open(D+f'body/{sex}-t7.webp'))[...,3]/255
    b[200:]=0  # above the ears' middle only
    return b
def bottom_taper(a, rng):
    """Columns whose hair ends on one straight line get ragged, soft tips."""
    out=a.copy()
    solid=a>0.5
    has=solid.any(0)
    bottom=np.where(has, H-1-np.argmax(solid[::-1],0), -1)
    x=0
    while x<Wd:
        if bottom[x]<300: x+=1; continue
        x2=x
        while x2+1<Wd and bottom[x2+1]>=300 and abs(bottom[x2+1]-bottom[x])<=2: x2+=1
        if x2-x>=18:   # a ruler cut at least 18px wide
            n=x2-x+1
            # ragged tip lengths, smooth along x so strands read as strands
            L=rng.uniform(8,46,n); L=np.convolve(L,np.ones(3)/3,'same')
            for i,cx in enumerate(range(x,x2+1)):
                bt=bottom[cx]; l=int(L[i])
                ys=np.arange(bt-l,bt+3)
                ys=ys[(ys>=0)&(ys<H)]
                f=np.clip((bt+2-ys)/max(l,1),0,1)**1.3
                out[ys,cx]=np.minimum(out[ys,cx],f)
        x=x2+1
    return out
def fringe_tips(a,e,rng):
    out=a.copy()
    for x in range(330,446):
        col=a[90:215,x]>0.5
        if not col.any(): continue
        # the lowest hair pixel over the face in this column
        ys=np.where(col)[0]+90
        bt=ys.max()
        if bt>=200 or (a[bt+1:bt+30,x]>0.3).any() or e[bt,x]>0.85: continue
        l=int(rng.uniform(3,13))
        yr=np.arange(bt-l,bt+2)
        f=np.clip((bt+1-yr)/max(l,1),0,1)
        out[yr,x]=np.minimum(out[yr,x],f)
    k=np.ones(3)/3
    return out
def defringe(rgb,a):
    """Edge pixels take the colour of the solid hair next to them; the edge comes in a touch."""
    solid=(a>0.85).astype(np.float32)
    acc=rgb*solid[...,None]; w=solid.copy()
    for k in (5,9,17,33):
        num=cv2.GaussianBlur(rgb*solid[...,None],(k,k),0); den=cv2.GaussianBlur(solid,(k,k),0)
        fill=(w<1e-3)&(den>1e-3)
        acc[fill]=num[fill]/den[fill][...,None]; w[fill]=1
    edge=(a<=0.85)&(w>0)
    rgb=rgb.copy(); rgb[edge]=acc[edge]
    a=np.clip((a-0.12)/0.88,0,1)
    return rgb,a
def recut(sex,style,report=None):
    rng=np.random.default_rng(zlib.crc32(f"{sex}-{style}".encode()))
    head=head_alpha(sex)
    e=ellipse(*FACE[sex])
    base=np.array(Image.open(D+f'hair/{sex}-hair-{style}-black.webp')).astype(np.float32)/255
    a0=base[...,3]
    # where the head is bald just outside the hairline
    dist=(np.sqrt(e)-1)*FACE[sex][3]   # rough px from the hairline
    zone=(head>0.5)&(e>1)&(dist<BAND)
    if style in ('bantu','cornrows'):   # their partings are part of the style: only the hairline itself
        zone&=dist<14
    gap=zone&(a0<0.6)
    gap=cv2.morphologyEx(gap.astype(np.uint8),cv2.MORPH_OPEN,np.ones((3,3),np.uint8))>0
    gap=cv2.dilate(gap.astype(np.uint8),np.ones((5,5),np.uint8))>0
    gap&=(head>0.3)&(e>0.92)
    mx=np.clip(2*CX-xx,0,Wd-1)
    a=a0.copy()
    mirror_ok=gap&(a0[yy,mx]>0.75)
    newa=a.copy()
    newa[gap]=np.maximum(a[gap],np.clip(head[gap],0,1))
    # soft edge where the fill meets the face
    soft=np.clip((e-0.92)/0.12,0,1)
    side=np.clip((183-yy)/24,0,1)   # the fill thins out above the ears, no square sideburns
    newa[gap]=np.minimum(newa[gap],(soft*side)[gap])
    newa=np.maximum(newa,a0)
    # feather the hard cut along the hairline (only near the face line)
    near=(np.abs(e-1)<0.22)&(head>0.3)
    bl=cv2.GaussianBlur(newa,(0,0),1.2)
    newa[near]=bl[near]
    newa=bottom_taper(newa,rng)
    # hair that hangs over the face (a fringe): smooth its zig-zag cut, then give a straight
    # bottom edge ragged tips
    inface=(e<1.15)&(yy<215)
    sm=cv2.GaussianBlur(newa,(0,0),2.2)
    sm=np.clip((sm-0.5)/0.28+0.5,0,1)
    newa[inface]=np.minimum(newa[inface],np.maximum(sm[inface],0))
    newa=fringe_tips(newa,e,rng)
    results={}
    for c in COLOURS:
        im=np.array(Image.open(D+f'hair/{sex}-hair-{style}-{c}.webp')).astype(np.float32)/255
        rgb=im[...,:3].copy()
        rgb[mirror_ok]=rgb[yy[mirror_ok],mx[mirror_ok]]
        rest=gap&~mirror_ok
        if rest.any():
            u8=(np.clip(rgb,0,1)*255).astype(np.uint8)
            # pixels with no hair colour yet must be filled from hair, not from transparent black
            known=(im[...,3]>0.7)
            m=(rest|(~known&(gap|cv2.dilate(rest.astype(np.uint8),np.ones((15,15),np.uint8))>0))).astype(np.uint8)
            inp=cv2.inpaint(u8,m*255,6,cv2.INPAINT_TELEA).astype(np.float32)/255
            # keep curl texture: add back high-frequency detail borrowed from nearby solid hair
            rgb[rest]=inp[rest]
        rgb,af=defringe(rgb,newa)
        out=np.dstack([rgb,af])
        results[c]=out
    return results,gap
if __name__=='__main__':
    todo=[(s,st) for s in STYLES for st in STYLES[s]] if len(sys.argv)<2 else [tuple(x.split(':')) for x in sys.argv[1:]]
    for sex,style in todo:
        res,gap=recut(sex,style)
        for c,arr in res.items():
            Image.fromarray((np.clip(arr,0,1)*255+0.5).astype(np.uint8)).save(OUT+f'hair/{sex}-hair-{style}-{c}.png')
        print(sex,style,'filled',int(gap.sum()))

def recut_beard(c):
    im=np.array(Image.open(D+f'extra/M-beard-{c}.webp')).astype(np.float32)/255
    rgb,a=defringe(im[...,:3],im[...,3])
    return np.dstack([rgb,a])
