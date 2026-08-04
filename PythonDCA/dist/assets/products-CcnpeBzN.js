function O(o,e){const a=document.createElement("canvas");a.width=o,a.height=e;const i=a.getContext("2d");if(!i)throw new Error("canvas 2d context unavailable");return i.imageSmoothingEnabled=!1,[a,i]}function B(o){const e=new ImageData(o.width,o.height),a=e.data,i=new Uint8Array(o.threads.length),n=new Uint8Array(o.threads.length),g=new Uint8Array(o.threads.length);o.threads.forEach((h,d)=>{i[d]=h.rgb[0],n[d]=h.rgb[1],g[d]=h.rgb[2]});for(let h=0;h<o.cells.length;h++){const d=o.cells[h];d<0||(a[h*4]=i[d],a[h*4+1]=n[d],a[h*4+2]=g[d],a[h*4+3]=255)}return e}const X=3,J=[228,218,198],q=208,j=[51,38,26],V=235;function ie(o,e){const a=X,{width:i,height:n,cells:g}=o,h=new ImageData(i*a,n*a),d=h.data,k=i*a*4,x=(l,p)=>l>=0&&p>=0&&l<i&&p<n&&g[p*i+l]===e,m=(l,p,f,b)=>{const v=p*k+l*4;d[v]=f[0],d[v+1]=f[1],d[v+2]=f[2],d[v+3]=b};for(let l=0;l<n;l++)for(let p=0;p<i;p++){const f=g[l*i+p];if(f===e)continue;const b=x(p,l-1),v=x(p,l+1),y=x(p-1,l),t=x(p+1,l),u=f>=0;if(!(!u&&!(b||v||y||t)))for(let r=0;r<a;r++)for(let s=0;s<a;s++)b&&r===0||v&&r===a-1||y&&s===0||t&&s===a-1?m(p*a+s,l*a+r,j,V):u&&m(p*a+s,l*a+r,J,q)}return h}const P=16e3;function ne(o,e={}){const a=e.grid??!0,i=e.legend??!0,n=e.outline??!1,g=e.outlineColor??"#141008",h=e.heavyEvery??10,d=e.background??"#EBE2D7",k=u=>{const r=o.width*u,s=o.height*u,c=Math.round(u*1.5),w=Math.max(1,Math.min(3,Math.floor(r/290))),T=Math.max(30,Math.round(u*1.8)),D=i?Math.ceil(o.threads.length/w):0,C=i?D*T+c*2:0;return{cell:u,artW:r,artH:s,margin:c,legendCols:w,legendRowH:T,legendH:C,canvasW:r+c*2,canvasH:s+c*2+C}};let x=k(e.cellSize??14);if(x.canvasW>P||x.canvasH>P){const u=Math.min(P/x.canvasW,P/x.canvasH);x=k(Math.max(1,Math.floor(x.cell*u)))}const{cell:m,artW:l,artH:p,margin:f,legendCols:b,legendRowH:v}=x,[y,t]=O(x.canvasW,x.canvasH);t.fillStyle=d,t.fillRect(0,0,y.width,y.height);for(let u=0;u<o.height;u++)for(let r=0;r<o.width;r++){const s=o.cells[u*o.width+r];s<0||(t.fillStyle=o.threads[s].hex,t.fillRect(f+r*m,f+u*m,m,m))}if(n){const u=(r,s)=>r>=0&&s>=0&&r<o.width&&s<o.height&&o.cells[s*o.width+r]>=0;t.strokeStyle=g,t.lineWidth=Math.max(2,Math.round(m/5)),t.beginPath();for(let r=0;r<o.height;r++)for(let s=0;s<o.width;s++){if(!u(s,r))continue;const c=f+s*m,w=f+r*m;u(s,r-1)||(t.moveTo(c,w),t.lineTo(c+m,w)),u(s,r+1)||(t.moveTo(c,w+m),t.lineTo(c+m,w+m)),u(s-1,r)||(t.moveTo(c,w),t.lineTo(c,w+m)),u(s+1,r)||(t.moveTo(c+m,w),t.lineTo(c+m,w+m))}t.stroke()}if(a){t.lineWidth=1,t.strokeStyle="rgba(30,25,20,.35)",t.beginPath();for(let s=0;s<=o.width;s++){const c=f+s*m+.5;t.moveTo(c,f),t.lineTo(c,f+p)}for(let s=0;s<=o.height;s++){const c=f+s*m+.5;t.moveTo(f,c),t.lineTo(f+l,c)}t.stroke(),t.lineWidth=2,t.strokeStyle="rgba(20,16,12,.85)",t.beginPath();const u=new Set([0,o.width]);for(let s=0;s<=o.width;s+=h)u.add(s);const r=new Set([0,o.height]);for(let s=0;s<=o.height;s+=h)r.add(s);for(const s of u){const c=f+s*m;t.moveTo(c,f),t.lineTo(c,f+p)}for(const s of r){const c=f+s*m;t.moveTo(f,c),t.lineTo(f+l,c)}t.stroke()}if(i&&o.threads.length){const u=f*2+p,r=Math.max(11,Math.round(v*.4)),s=Math.max(10,Math.round(v*.34)),c=Math.round(v*.58),w=Math.round(c*.55),T=l/b,D="#33261A",C="rgba(51,38,26,.55)";t.textBaseline="middle",t.textAlign="left",t.font=`800 ${s}px "Nunito Sans", system-ui, sans-serif`,t.fillStyle=C,t.fillText(e.legendTitle??"DMC",f,u-f*.55),t.strokeStyle="rgba(20,16,12,.3)",t.lineWidth=1.5,t.beginPath(),t.moveTo(f,u-f*.2),t.lineTo(y.width-f,u-f*.2),t.stroke(),t.font=`800 ${r}px "Nunito Sans", system-ui, sans-serif`;let M=0;for(const A of o.threads)M=Math.max(M,t.measureText(A.num).width);const H=e.countSuffix??"pts",U=t.measureText(`0000 ${H}`).width;o.threads.forEach((A,_)=>{const F=_%b,N=Math.floor(_/b),E=f+F*T,S=u+N*v+v/2;N>0&&(t.strokeStyle="rgba(20,16,12,.09)",t.lineWidth=1,t.beginPath(),t.moveTo(E,Math.round(S-v/2)+.5),t.lineTo(E+T-w,Math.round(S-v/2)+.5),t.stroke()),t.fillStyle=A.hex,t.fillRect(E,S-c/2,c,c),t.strokeStyle="rgba(20,16,12,.45)",t.lineWidth=1,t.strokeRect(E+.5,S-c/2+.5,c-1,c-1);const W=E+c+w;t.font=`800 ${r}px "Nunito Sans", system-ui, sans-serif`,t.fillStyle=D,t.fillText(A.num,W,S),t.textAlign="right",t.font=`600 ${r}px "Nunito Sans", system-ui, sans-serif`,t.fillStyle=C,t.fillText(`${o.counts[_]} ${H}`,E+T-w,S),t.textAlign="left";const L=W+M+w,G=E+T-w-U-w-L;G>r*2&&(t.save(),t.beginPath(),t.rect(L,S-v/2,G,v),t.clip(),t.font=`500 ${r}px "Nunito Sans", system-ui, sans-serif`,t.fillStyle=C,t.fillText(A.name,L,S),t.restore())})}return y}function le(o){return new Promise((e,a)=>{o.toBlob(i=>i?e(i):a(new Error("toBlob failed")),"image/png")})}function re(o){const e=new Uint8Array(o.cells.length);for(let n=0;n<o.cells.length;n++)e[n]=o.cells[n]<0?0:o.cells[n]+1;let a="";const i=8192;for(let n=0;n<e.length;n+=i)a+=String.fromCharCode(...e.subarray(n,n+i));return btoa(a)}function ce(o,e){const a=atob(o),i=new Int16Array(a.length);for(let n=0;n<a.length;n++){const g=a.charCodeAt(n);i[n]=g===0||g>e?-1:g-1}return i}function he(o,e=360){const a=B(o),i=Math.max(1,Math.round(e/o.width)),n=document.createElement("canvas");n.width=o.width*i,n.height=o.height*i;const g=n.getContext("2d");if(!g)throw new Error("canvas 2d context unavailable");const h=document.createElement("canvas");return h.width=a.width,h.height=a.height,h.getContext("2d")?.putImageData(a,0,0),g.imageSmoothingEnabled=!1,g.drawImage(h,0,0,n.width,n.height),n.toDataURL("image/png")}async function ue(o,e=1400){const a=await createImageBitmap(o),i=Math.min(1,e/Math.max(a.width,a.height)),n=Math.round(a.width*i),g=Math.round(a.height*i),h=document.createElement("canvas");h.width=n,h.height=g;const d=h.getContext("2d");if(!d)throw new Error("canvas 2d context unavailable");return d.imageSmoothingEnabled=!0,d.imageSmoothingQuality="high",d.drawImage(a,0,0,a.width,a.height,0,0,n,g),a.close(),h.toDataURL("image/jpeg",.82)}const R={clothColor:[.93,.9,.83],weaveDepth:.35,weaveContrast:.5,holeSize:.16,holeDepth:.38,clothFuzz:.18,coverage:.54,legWidth:.21,roundness:.7,crossOffset:.04,jitterPos:.035,jitterAngle:.07,jitterLen:.08,topLegMix:.5,plyFreq:7,plyDepth:.2,fibreNoise:.1,lightAngle:2.3,lightHeight:.55,diffuse:.9,ambient:.55,specular:.3,shininess:18,sheen:.45,shadowStrength:.45,shadowSpread:.1,valueJitter:.045,hueJitter:.008,saturation:1,gamma:1},fe=[{title:"Toile",items:[{key:"weaveDepth",label:"Relief du tissage",min:0,max:1,step:.01},{key:"weaveContrast",label:"Contraste du tissage",min:0,max:1,step:.01},{key:"holeSize",label:"Taille des trous",min:0,max:.4,step:.005},{key:"holeDepth",label:"Profondeur des trous",min:0,max:1,step:.01},{key:"clothFuzz",label:"Grain du coton",min:0,max:1,step:.01}]},{title:"Point",items:[{key:"coverage",label:"Longueur des brins",min:.2,max:.75,step:.005},{key:"legWidth",label:"Épaisseur du fil",min:.04,max:.35,step:.005},{key:"roundness",label:"Rondeur",min:.1,max:1.5,step:.01},{key:"crossOffset",label:"Décalage du croisement",min:0,max:.2,step:.005},{key:"topLegMix",label:"Brin du dessus",min:0,max:1,step:.01}]},{title:"Irrégularité",items:[{key:"jitterPos",label:"Position",min:0,max:.2,step:.002},{key:"jitterAngle",label:"Angle",min:0,max:.4,step:.005},{key:"jitterLen",label:"Longueur",min:0,max:.4,step:.005}]},{title:"Torsion du fil",items:[{key:"plyFreq",label:"Fréquence",min:0,max:30,step:.5},{key:"plyDepth",label:"Profondeur",min:0,max:1,step:.01},{key:"fibreNoise",label:"Fibres",min:0,max:1,step:.01}]},{title:"Lumière",items:[{key:"lightAngle",label:"Direction",min:0,max:6.2832,step:.02},{key:"lightHeight",label:"Hauteur",min:.05,max:1,step:.01},{key:"diffuse",label:"Diffus",min:0,max:2,step:.01},{key:"ambient",label:"Ambiant",min:0,max:1.2,step:.01},{key:"specular",label:"Reflet",min:0,max:2,step:.01},{key:"shininess",label:"Netteté du reflet",min:2,max:64,step:.5},{key:"sheen",label:"Brillance le long du brin",min:0,max:1,step:.01}]},{title:"Ombre portée",items:[{key:"shadowStrength",label:"Force",min:0,max:1,step:.01},{key:"shadowSpread",label:"Étalement",min:.01,max:.3,step:.005}]},{title:"Couleur",items:[{key:"valueJitter",label:"Variation de ton",min:0,max:.3,step:.005},{key:"hueJitter",label:"Variation de teinte",min:0,max:.1,step:.002},{key:"saturation",label:"Saturation",min:0,max:2,step:.01},{key:"gamma",label:"Gamma",min:.5,max:1.8,step:.01}]}],I="ptd.stitch-params";function de(){try{const o=window.localStorage.getItem(I);if(!o)return R;const e=JSON.parse(o);return{...R,...e}}catch{return R}}function me(o){try{window.localStorage.setItem(I,JSON.stringify(o))}catch{}}function ge(){try{window.localStorage.removeItem(I)}catch{}}const $=`#version 300 es
void main() {
  // One oversized triangle covers the viewport, so there is no buffer to bind.
  vec2 xy = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
  gl_Position = vec4(xy, 0.0, 1.0);
}`,K=`#version 300 es
precision highp float;

uniform sampler2D uPattern;
uniform vec2 uGrid;        // stitches across, down
uniform vec2 uResolution;
uniform float uCellPx;     // screen pixels per stitch
uniform vec2 uOrigin;      // top-left of the grid, in pixels

uniform vec3  uClothColor;
uniform float uWeaveDepth, uWeaveContrast, uHoleSize, uHoleDepth, uClothFuzz;
uniform float uCoverage, uLegWidth, uRoundness, uCrossOffset;
uniform float uJitterPos, uJitterAngle, uJitterLen, uTopLegMix;
uniform float uPlyFreq, uPlyDepth, uFibreNoise;
uniform float uLightAngle, uLightHeight, uDiffuse, uAmbient, uSpecular, uShininess, uSheen;
uniform float uShadowStrength, uShadowSpread;
// 1 draws our own cloth, 0 leaves the ground transparent for a photograph.
uniform float uGroundAlpha;
uniform float uValueJitter, uHueJitter, uSaturation, uGamma;

out vec4 fragColor;

/* ---------------------------------------------------------------- hashing */

float hash11(float n) { return fract(sin(n) * 43758.5453123); }

/** Three uncorrelated numbers per cell — jitter must not share a source with
 *  colour, or a stitch that leans left is always also darker. */
vec3 hash33(vec2 c) {
  vec3 p = fract(vec3(c.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash11(dot(i, vec2(1.0, 57.0)));
  float b = hash11(dot(i + vec2(1.0, 0.0), vec2(1.0, 57.0)));
  float c = hash11(dot(i + vec2(0.0, 1.0), vec2(1.0, 57.0)));
  float d = hash11(dot(i + vec2(1.0, 1.0), vec2(1.0, 57.0)));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

/* ------------------------------------------------------------------ colour */

vec3 hueShift(vec3 c, float a) {
  const vec3 k = vec3(0.57735);
  float cs = cos(a), sn = sin(a);
  return c * cs + cross(k, c) * sn + k * dot(k, c) * (1.0 - cs);
}

/* -------------------------------------------------------------------- cloth
   Aida is not a grid of squares with gaps. It is bundles of threads woven in
   blocks, one block per stitch, with a needle hole where four blocks meet — so
   the light part is the block and the dark part is the channel between them,
   with a rounder, darker well at every corner. Getting this the wrong way round
   produces a bar of chocolate. */
void cloth(vec2 p, out vec3 col, out float height) {
  vec2 f = fract(p);
  vec2 g = min(f, 1.0 - f);        // 0 at a cell edge, 0.5 at its centre
  float toChannel = min(g.x, g.y); // nearest groove between blocks
  float toHole = length(g);        // nearest needle hole

  float channelW = uHoleSize * 0.5 + 0.02;
  float channel = 1.0 - smoothstep(0.0, channelW, toChannel);
  float hole = 1.0 - smoothstep(uHoleSize * 0.45, uHoleSize * 1.15, toHole);

  // Two crossing bundles give the block a faint relief of its own.
  float bundle = cos(f.x * 6.2831853) * cos(f.y * 6.2831853);
  float fuzz = (valueNoise(p * 30.0) - 0.5) * uClothFuzz;

  height = uWeaveDepth * (0.5 + bundle * 0.18)
         - (channel * 0.5 + hole) * uWeaveDepth * 1.2;
  float shade = 1.0
    + bundle * uWeaveContrast * 0.10
    - channel * uWeaveContrast * 0.30
    - hole * uHoleDepth
    + fuzz * 0.20;
  col = uClothColor * shade;
}

/* ---------------------------------------------------------- one floss leg */

/** Distance to a segment, and how far along it we are (0..1). */
vec2 segment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a, ap = p - a;
  float t = clamp(dot(ap, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  return vec2(length(ap - ab * t), t);
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec2 p = (frag - uOrigin) / uCellPx;          // position in stitch units

  vec3 base;
  float clothH;
  cloth(p, base, clothH);

  vec3 col = base;
  float bestH = -1.0;          // height of the nearest thread found so far
  vec3 bestCol = vec3(0.0);
  vec2 bestGrad = vec2(0.0);
  vec2 bestDir = vec2(1.0, 0.0);
  float bestCov = 0.0;
  float shadow = 0.0;

  vec2 cell = floor(p);
  float aa = 1.0 / max(uCellPx, 1.0);           // one screen pixel, in cell units

  /* How much fine detail is worth drawing at this size.
     Below roughly six pixels per stitch the ply ripple, the fibres, the specular
     and the per-stitch jitter each land on one or two pixels, which the eye reads
     as dirt rather than as thread. They fade out, leaving a soft solid stitch.
     Note this only rescues the *middle* of the range: below about three pixels a
     stitch cannot be drawn at all, because one screen pixel is then wider than
     the cell and the antialiasing swamps the shape. Callers must supersample and
     downscale rather than ask for that — see use-stitch-painter. */
  float detail = smoothstep(3.5, 10.0, uCellPx);
  float ply = uPlyDepth * detail;
  float fibres = uFibreNoise * detail;
  float spec = uSpecular * detail;
  float wob = detail;
  // A thinner leg reads as a lattice once the cloth between stitches is only a
  // pixel or two wide, so coverage is nudged up as the detail goes down.
  float legW = uLegWidth * mix(1.18, 1.0, detail);
  float tint = mix(0.3, 1.0, detail);
  vec3 lightDir = normalize(vec3(cos(uLightAngle), sin(uLightAngle), uLightHeight));

  for (int oy = -1; oy <= 1; oy++) {
    for (int ox = -1; ox <= 1; ox++) {
      vec2 c = cell + vec2(float(ox), float(oy));
      if (c.x < 0.0 || c.y < 0.0 || c.x >= uGrid.x || c.y >= uGrid.y) continue;

      vec4 thread = texture(uPattern, (c + 0.5) / uGrid);
      if (thread.a < 0.5) continue;

      vec3 h = hash33(c + 7.0);
      vec3 h2 = hash33(c * 1.7 - 3.0);

      // Where this stitch actually sits, and how long its legs came out.
      vec2 centre = c + 0.5 + (h.xy - 0.5) * 2.0 * uJitterPos * wob;
      float len = uCoverage * (1.0 + (h.z - 0.5) * 2.0 * uJitterLen * wob);
      float ang = (h2.x - 0.5) * 2.0 * uJitterAngle * wob;
      float ca = cos(ang), sa = sin(ang);
      mat2 rot = mat2(ca, -sa, sa, ca);

      vec2 q = (p - centre) * rot;
      float off = uCrossOffset * 0.5;

      // The two legs of the X, pulled apart a little so they cross rather than
      // meeting at a single point the way a drawn X does.
      vec2 s1 = segment(q, vec2(-len, -len) + vec2(0.0, off), vec2(len, len) + vec2(0.0, off));
      vec2 s2 = segment(q, vec2(-len, len) - vec2(0.0, off), vec2(len, -len) - vec2(0.0, off));

      float topIsFirst = step(h2.y, uTopLegMix);

      for (int leg = 0; leg < 2; leg++) {
        vec2 s = leg == 0 ? s1 : s2;
        vec2 dir = leg == 0 ? normalize(vec2(1.0, 1.0)) : normalize(vec2(1.0, -1.0));

        // A twisted strand: the ply spirals, so the silhouette breathes along
        // its length instead of being a capsule.
        float twist = sin(s.y * uPlyFreq * 6.2831853 + h2.z * 6.2831853);
        float fibre = (valueNoise(q * 34.0 + c * 11.0) - 0.5) * fibres;
        float w = legW * (1.0 + twist * ply * 0.25 + fibre * 0.3);

        float cov = 1.0 - smoothstep(w - aa, w + aa, s.x);
        if (cov <= 0.001) {
          // Still count the shadow it throws on the cloth just outside itself.
          shadow = max(shadow, (1.0 - smoothstep(w, w + uShadowSpread, s.x)) * 0.6);
          continue;
        }

        // Rounded profile across the strand, flattened by "roundness".
        float across = clamp(s.x / max(w, 1e-4), 0.0, 1.0);
        float prof = pow(max(1.0 - across * across, 0.0), uRoundness * 0.5);
        // Legs on top ride higher, so the crossing reads.
        float lift = (leg == 0 ? topIsFirst : 1.0 - topIsFirst) * 0.35;
        float height = clothH + 0.25 + prof * (0.5 + ply * twist * 0.15) + lift;

        if (height > bestH) {
          bestH = height;
          bestCov = cov;
          // Gradient of the strand's surface, derived rather than differenced:
          // across the strand the profile falls away, along it the ply ripples.
          // "q" is already in the stitch's rotated frame, so "perp" is too.
          vec2 perp = vec2(-dir.y, dir.x);
          float slope = across * prof * 2.4;
          float ripple = cos(s.y * uPlyFreq * 6.2831853 + h2.z * 6.2831853) * ply * 0.6;
          float side = dot(q, perp) >= 0.0 ? 1.0 : -1.0;
          // Back out of the stitch's frame so the light hits it from the screen's
          // direction, not the thread's.
          bestGrad = (perp * slope * side + dir * ripple) * transpose(rot);
          bestDir = dir * transpose(rot);

          vec3 tc = thread.rgb;
          tc = hueShift(tc, (h.x - 0.5) * 2.0 * uHueJitter * tint * 6.2831853);
          tc *= 1.0 + (h.y - 0.5) * 2.0 * uValueJitter * tint;
          float lum = dot(tc, vec3(0.2126, 0.7152, 0.0722));
          bestCol = mix(vec3(lum), tc, uSaturation);
          bestGrad += vec2(fibre) * 0.5;
        }
        shadow = max(shadow, 0.6);
      }
    }
  }

  vec3 lit = vec3(0.0);
  if (bestCov > 0.001) {
    vec3 n = normalize(vec3(-bestGrad, 1.0));
    float lambert = max(dot(n, lightDir), 0.0);
    vec3 view = vec3(0.0, 0.0, 1.0);
    vec3 halfway = normalize(lightDir + view);
    float gloss = pow(max(dot(n, halfway), 0.0), uShininess);

    // Floss is anisotropic: it catches light along the strand, not across it.
    float along = abs(dot(normalize(bestDir), lightDir.xy));
    gloss *= mix(1.0, along, uSheen);

    lit = bestCol * (uAmbient + uDiffuse * lambert) + vec3(gloss) * spec;
  }

  float alpha;
  if (uGroundAlpha > 0.5) {
    // Standing on its own: we draw the cloth as well, darkened where thread
    // meets fabric.
    col *= 1.0 - shadow * uShadowStrength * 0.55;
    col = mix(col, lit, bestCov);
    alpha = 1.0;
  } else {
    // Laid over a photograph: the cloth in the picture is the cloth, so all we
    // contribute is thread and the shadow it casts. Anything else would paint a
    // patch of synthetic fabric onto a real one, which is exactly what the flat
    // renderer already looks like.
    float sh = clamp(shadow * uShadowStrength, 0.0, 1.0);
    alpha = max(bestCov, sh);
    col = mix(vec3(0.0), lit, bestCov / max(alpha, 1e-4));
  }

  col = pow(max(col, 0.0), vec3(1.0 / max(uGamma, 0.05)));
  fragColor = vec4(col, alpha);
}`;function z(o,e,a){const i=o.createShader(e);if(!i)throw new Error("could not create shader");if(o.shaderSource(i,a),o.compileShader(i),!o.getShaderParameter(i,o.COMPILE_STATUS)){const n=o.getShaderInfoLog(i);throw o.deleteShader(i),new Error(`shader failed to compile: ${n}`)}return i}function pe(o){const e=o.getContext("webgl2",{antialias:!1,premultipliedAlpha:!1});if(!e)throw new Error("WebGL2 unavailable");const a=e.createProgram();if(!a)throw new Error("could not create program");const i=z(e,e.VERTEX_SHADER,$),n=z(e,e.FRAGMENT_SHADER,K);if(e.attachShader(a,i),e.attachShader(a,n),e.linkProgram(a),!e.getProgramParameter(a,e.LINK_STATUS))throw new Error(`program failed to link: ${e.getProgramInfoLog(a)}`);e.deleteShader(i),e.deleteShader(n);const g=e.createTexture();e.bindTexture(e.TEXTURE_2D,g),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const h=l=>e.getUniformLocation(a,l),d={pattern:h("uPattern"),grid:h("uGrid"),resolution:h("uResolution"),cellPx:h("uCellPx"),origin:h("uOrigin"),clothColor:h("uClothColor"),groundAlpha:h("uGroundAlpha")},k=Object.keys(R).filter(l=>l!=="clothColor"),x=new Map(k.map(l=>[l,h(`u${l[0].toUpperCase()}${l.slice(1)}`)]));let m=null;return{render(l,p,f,b=!1,v){const y=Math.min(window.devicePixelRatio||1,2),t=Math.max(1,Math.round(v?v.width:o.clientWidth*y)),u=Math.max(1,Math.round(v?v.height:o.clientHeight*y));(o.width!==t||o.height!==u)&&(o.width=t,o.height=u),e.viewport(0,0,t,u),e.useProgram(a),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,g),l!==m&&(e.texImage2D(e.TEXTURE_2D,0,e.RGBA,l.width,l.height,0,e.RGBA,e.UNSIGNED_BYTE,l.data),m=l),e.uniform1i(d.pattern,0);const r=Math.min(t/l.width,u/l.height),s=Math.max(2,r*f);e.uniform2f(d.grid,l.width,l.height),e.uniform2f(d.resolution,t,u),e.uniform1f(d.cellPx,s),e.uniform2f(d.origin,(t-l.width*s)/2,(u-l.height*s)/2),e.uniform3fv(d.clothColor,p.clothColor),e.uniform1f(d.groundAlpha,b?0:1);for(const[c,w]of x)e.uniform1f(w,p[c]);e.drawArrays(e.TRIANGLES,0,3)},dispose(){e.deleteTexture(g),e.deleteProgram(a)}}}const Y="/assets/cushion-mask-BC_L7swf.png",Q="/assets/cushion-Shy2RVgn.avif",Z="/assets/hoop-mask-B60I4cN8.png",ee="/assets/hoop-DQZk-h_G.avif",te="/assets/shirt-mask-DhJb3ehr.png",oe="/assets/shirt-DS87ZXGA.avif",ae="/assets/tote-mask-B8IQIpus.png",se="/assets/tote-CYxjghuc.avif",ve=.94,we=60,xe={min:.28,max:2.6},be=[{key:"hoop",src:ee,mask:Z,aspect:1,spot:{x:.5,y:.5,w:.46}},{key:"tote",src:se,mask:ae,aspect:900/704,spot:{x:.5,y:.54,w:.27,rot:-5}},{key:"shirt",src:oe,mask:te,aspect:900/600,spot:{x:.47,y:.38,w:.135}},{key:"cushion",src:Q,mask:Y,aspect:1,spot:{x:.5,y:.5,w:.36}}];export{R as D,ve as I,be as P,we as R,xe as S,fe as a,ce as b,pe as c,ge as d,ue as e,he as f,re as g,le as h,ie as i,de as l,B as p,ne as r,me as s};
