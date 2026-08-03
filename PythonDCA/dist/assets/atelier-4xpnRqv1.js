import{u as M,r as f,f as I,a as F,j as o}from"./index-C1x1AtxP.js";import{b as U,p as O}from"./publish-VWjiTcJi.js";import{P as C}from"./products-DYCCODaL.js";const j={clothColor:[.93,.9,.83],weaveDepth:.35,weaveContrast:.5,holeSize:.16,holeDepth:.38,clothFuzz:.25,coverage:.5,legWidth:.13,roundness:.7,crossOffset:.04,jitterPos:.035,jitterAngle:.07,jitterLen:.08,topLegMix:.5,plyFreq:7,plyDepth:.2,fibreNoise:.12,lightAngle:2.3,lightHeight:.55,diffuse:.9,ambient:.55,specular:.4,shininess:18,sheen:.45,shadowStrength:.45,shadowSpread:.1,valueJitter:.07,hueJitter:.015,saturation:1,gamma:1},$=[{title:"Toile",items:[{key:"weaveDepth",label:"Relief du tissage",min:0,max:1,step:.01},{key:"weaveContrast",label:"Contraste du tissage",min:0,max:1,step:.01},{key:"holeSize",label:"Taille des trous",min:0,max:.4,step:.005},{key:"holeDepth",label:"Profondeur des trous",min:0,max:1,step:.01},{key:"clothFuzz",label:"Grain du coton",min:0,max:1,step:.01}]},{title:"Point",items:[{key:"coverage",label:"Longueur des brins",min:.2,max:.75,step:.005},{key:"legWidth",label:"Épaisseur du fil",min:.04,max:.35,step:.005},{key:"roundness",label:"Rondeur",min:.1,max:1.5,step:.01},{key:"crossOffset",label:"Décalage du croisement",min:0,max:.2,step:.005},{key:"topLegMix",label:"Brin du dessus",min:0,max:1,step:.01}]},{title:"Irrégularité",items:[{key:"jitterPos",label:"Position",min:0,max:.2,step:.002},{key:"jitterAngle",label:"Angle",min:0,max:.4,step:.005},{key:"jitterLen",label:"Longueur",min:0,max:.4,step:.005}]},{title:"Torsion du fil",items:[{key:"plyFreq",label:"Fréquence",min:0,max:30,step:.5},{key:"plyDepth",label:"Profondeur",min:0,max:1,step:.01},{key:"fibreNoise",label:"Fibres",min:0,max:1,step:.01}]},{title:"Lumière",items:[{key:"lightAngle",label:"Direction",min:0,max:6.2832,step:.02},{key:"lightHeight",label:"Hauteur",min:.05,max:1,step:.01},{key:"diffuse",label:"Diffus",min:0,max:2,step:.01},{key:"ambient",label:"Ambiant",min:0,max:1.2,step:.01},{key:"specular",label:"Reflet",min:0,max:2,step:.01},{key:"shininess",label:"Netteté du reflet",min:2,max:64,step:.5},{key:"sheen",label:"Brillance le long du brin",min:0,max:1,step:.01}]},{title:"Ombre portée",items:[{key:"shadowStrength",label:"Force",min:0,max:1,step:.01},{key:"shadowSpread",label:"Étalement",min:.01,max:.3,step:.005}]},{title:"Couleur",items:[{key:"valueJitter",label:"Variation de ton",min:0,max:.3,step:.005},{key:"hueJitter",label:"Variation de teinte",min:0,max:.1,step:.002},{key:"saturation",label:"Saturation",min:0,max:2,step:.01},{key:"gamma",label:"Gamma",min:.5,max:1.8,step:.01}]}],W=`#version 300 es
void main() {
  // One oversized triangle covers the viewport, so there is no buffer to bind.
  vec2 xy = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
  gl_Position = vec4(xy, 0.0, 1.0);
}`,X=`#version 300 es
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
      vec2 centre = c + 0.5 + (h.xy - 0.5) * 2.0 * uJitterPos;
      float len = uCoverage * (1.0 + (h.z - 0.5) * 2.0 * uJitterLen);
      float ang = (h2.x - 0.5) * 2.0 * uJitterAngle;
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
        float ply = sin(s.y * uPlyFreq * 6.2831853 + h2.z * 6.2831853);
        float fibres = (valueNoise(q * 34.0 + c * 11.0) - 0.5) * uFibreNoise;
        float w = uLegWidth * (1.0 + ply * uPlyDepth * 0.25 + fibres * 0.3);

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
        float height = clothH + 0.25 + prof * (0.5 + uPlyDepth * ply * 0.15) + lift;

        if (height > bestH) {
          bestH = height;
          bestCov = cov;
          // Gradient of the strand's surface, derived rather than differenced:
          // across the strand the profile falls away, along it the ply ripples.
          // "q" is already in the stitch's rotated frame, so "perp" is too.
          vec2 perp = vec2(-dir.y, dir.x);
          float slope = across * prof * 2.4;
          float ripple = cos(s.y * uPlyFreq * 6.2831853 + h2.z * 6.2831853) * uPlyDepth * 0.6;
          float side = dot(q, perp) >= 0.0 ? 1.0 : -1.0;
          // Back out of the stitch's frame so the light hits it from the screen's
          // direction, not the thread's.
          bestGrad = (perp * slope * side + dir * ripple) * transpose(rot);
          bestDir = dir * transpose(rot);

          vec3 tc = thread.rgb;
          tc = hueShift(tc, (h.x - 0.5) * 2.0 * uHueJitter * 6.2831853);
          tc *= 1.0 + (h.y - 0.5) * 2.0 * uValueJitter;
          float lum = dot(tc, vec3(0.2126, 0.7152, 0.0722));
          bestCol = mix(vec3(lum), tc, uSaturation);
          bestGrad += vec2(fibres) * 0.5;
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
    float spec = pow(max(dot(n, halfway), 0.0), uShininess);

    // Floss is anisotropic: it catches light along the strand, not across it.
    float along = abs(dot(normalize(bestDir), lightDir.xy));
    spec *= mix(1.0, along, uSheen);

    lit = bestCol * (uAmbient + uDiffuse * lambert) + vec3(spec) * uSpecular;
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
}`;function z(n,e,l){const c=n.createShader(e);if(!c)throw new Error("could not create shader");if(n.shaderSource(c,l),n.compileShader(c),!n.getShaderParameter(c,n.COMPILE_STATUS)){const u=n.getShaderInfoLog(c);throw n.deleteShader(c),new Error(`shader failed to compile: ${u}`)}return c}function q(n){const e=n.getContext("webgl2",{antialias:!1,premultipliedAlpha:!1});if(!e)throw new Error("WebGL2 unavailable");const l=e.createProgram();if(!l)throw new Error("could not create program");const c=z(e,e.VERTEX_SHADER,W),u=z(e,e.FRAGMENT_SHADER,X);if(e.attachShader(l,c),e.attachShader(l,u),e.linkProgram(l),!e.getProgramParameter(l,e.LINK_STATUS))throw new Error(`program failed to link: ${e.getProgramInfoLog(l)}`);e.deleteShader(c),e.deleteShader(u);const p=e.createTexture();e.bindTexture(e.TEXTURE_2D,p),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const i=h=>e.getUniformLocation(l,h),x={pattern:i("uPattern"),grid:i("uGrid"),resolution:i("uResolution"),cellPx:i("uCellPx"),origin:i("uOrigin"),clothColor:i("uClothColor"),groundAlpha:i("uGroundAlpha")},t=Object.keys(j).filter(h=>h!=="clothColor"),s=new Map(t.map(h=>[h,i(`u${h[0].toUpperCase()}${h.slice(1)}`)]));let w=null;return{render(h,E,N,T=!1){const k=Math.min(window.devicePixelRatio||1,2),g=Math.max(1,Math.round(n.clientWidth*k)),m=Math.max(1,Math.round(n.clientHeight*k));(n.width!==g||n.height!==m)&&(n.width=g,n.height=m),e.viewport(0,0,g,m),e.useProgram(l),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,p),h!==w&&(e.texImage2D(e.TEXTURE_2D,0,e.RGBA,h.width,h.height,0,e.RGBA,e.UNSIGNED_BYTE,h.data),w=h),e.uniform1i(x.pattern,0);const y=Math.min(g/h.width,m/h.height),b=Math.max(2,y*N);e.uniform2f(x.grid,h.width,h.height),e.uniform2f(x.resolution,g,m),e.uniform1f(x.cellPx,b),e.uniform2f(x.origin,(g-h.width*b)/2,(m-h.height*b)/2),e.uniform3fv(x.clothColor,E.clothColor),e.uniform1f(x.groundAlpha,T?0:1);for(const[R,P]of s)e.uniform1f(P,E[R]);e.drawArrays(e.TRIANGLES,0,3)},dispose(){e.deleteTexture(p),e.deleteProgram(l)}}}function J(){const e=["347","3712","760","3713","B5200","3363","310"].map(t=>F(t)).filter(t=>!!t),l=28,c=22,u=new Int16Array(l*c).fill(-1),p=(t,s,w)=>{t>=0&&s>=0&&t<l&&s<c&&(u[s*l+t]=w)};for(let t=2;t<9;t++)for(let s=2;s<11;s++)p(s,t,0);for(let t=2;t<9;t++)for(let s=0;s<5;s++)p(13+s,t,s);for(let t=0;t<14;t++)p(2+t*7%24,11+t*5%3,t%2===0?4:6);for(let t=0;t<12;t++)p(3+t,15+t%2,5);for(let t=18;t<21;t++)for(let s=2;s<8;s++)p(s,t,4);for(let t=18;t<21;t++)for(let s=8;s<14;s++)p(s,t,6);const i=new Array(e.length).fill(0);let x=0;for(const t of u)t<0||(i[t]++,x++);return{width:l,height:c,cells:u,threads:e,counts:i,stitched:x}}const B=["toile seule","tambour","tote bag","t-shirt","coussin"];function V(n){const e=parseInt(n.slice(1),16);return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]}function K([n,e,l]){const c=u=>Math.max(0,Math.min(255,Math.round(u*255))).toString(16).padStart(2,"0");return`#${c(n)}${c(e)}${c(l)}`}function ee(){const[n]=M(),e=n.get("piece"),[l,c]=f.useState(j),[u,p]=f.useState(1),[i,x]=f.useState(0),t=i>=0,[s,w]=f.useState(()=>J()),[h,E]=f.useState("échantillon de test"),[N,T]=f.useState(null),[k,g]=f.useState(null);f.useEffect(()=>{if(!e)return;let a=!1;return I(Number(e)).then(r=>{if(a)return;const d=[],H=r.threadCodes.map(v=>{const S=F(v);return S?d.push(S)-1:-1}),A=U(r.cells,r.threadCodes.length),D=new Int16Array(A.length),_=new Array(d.length).fill(0);let L=0;for(let v=0;v<A.length;v++){const S=A[v]<0?-1:H[A[v]];D[v]=S,!(S<0)&&(_[S]++,L++)}w({width:r.width,height:r.height,cells:D,threads:d,counts:_,stitched:L}),E(`${r.title} — ${r.width}×${r.height}`)}).catch(()=>!a&&E("pièce introuvable, échantillon affiché")),()=>{a=!0}},[e]);const m=f.useMemo(()=>O(s),[s]),y=f.useRef(null),b=f.useRef(null);f.useEffect(()=>{const a=y.current;if(!a)return;try{b.current=q(a),T(null)}catch(d){T(d instanceof Error?d.message:"WebGL2 indisponible");return}const r=b.current;return()=>{r?.dispose(),b.current=null}},[t]),f.useEffect(()=>{const a=()=>b.current?.render(m,l,t?1:u,t);a();const r=y.current;if(!r)return;const d=new ResizeObserver(a);return d.observe(r),()=>d.disconnect()},[m,l,u,t]);const R=f.useRef(null);f.useEffect(()=>{const a=R.current;a&&(a.width=m.width,a.height=m.height,a.getContext("2d")?.putImageData(m,0,0))},[m]);const P=(a,r)=>c(d=>({...d,[a]:r})),G=()=>{const a="export const DEFAULT_PARAMS: StitchParams = "+JSON.stringify(l,null,2).replace(/"([^"]+)":/g,"$1:")+`
`;g(a),navigator.clipboard?.writeText(a).catch(()=>{})};return o.jsxs("div",{className:"mx-auto max-w-[1600px] px-4 py-6",children:[o.jsxs("div",{className:"flex items-baseline justify-between gap-4 flex-wrap mb-4",children:[o.jsx("h1",{className:"text-[24px] m-0",children:"Atelier — rendu tissu"}),o.jsx("span",{className:"font-mono text-[12.5px] text-stone",children:h})]}),N&&o.jsx("p",{role:"alert",className:"text-coral-deeper font-mono text-[13px]",children:N}),o.jsxs("div",{className:"grid lg:grid-cols-[1fr_360px] gap-5 items-start",children:[o.jsxs("div",{className:"flex flex-col gap-3 lg:sticky lg:top-4",children:[o.jsx("div",{className:"flex gap-1.5 flex-wrap",children:B.map((a,r)=>{const d=r-1;return o.jsx("button",{type:"button",onClick:()=>{x(d),p(1)},className:`rounded-full font-mono text-[12px] px-3 py-1.5 cursor-pointer transition-colors ${i===d?"bg-ink text-blanc":"bg-blanc text-cocoa hover:bg-linen"}`,children:a},a)})}),i<0?o.jsx("canvas",{ref:y,className:"w-full block rounded-card shadow-card bg-linen",style:{aspectRatio:`${s.width} / ${s.height}`}}):o.jsx("div",{className:"relative overflow-hidden rounded-card shadow-card bg-linen aspect-square",children:o.jsxs("div",{className:"absolute inset-0",style:{transform:`scale(${u})`,transformOrigin:`${C[i].spot.x*100}% ${C[i].spot.y*100}%`},children:[o.jsx("img",{src:C[i].src,alt:"",className:"absolute inset-0 w-full h-full object-cover"}),o.jsx("canvas",{ref:y,style:{position:"absolute",left:`${C[i].spot.x*100}%`,top:`${C[i].spot.y*100}%`,width:`${C[i].spot.w*100}%`,aspectRatio:`${s.width} / ${s.height}`,transform:"translate(-50%, -50%)"},className:"block"})]})}),o.jsxs("div",{className:"flex items-center gap-3",children:[o.jsx("label",{className:"font-mono text-[12px] text-stone shrink-0",children:i<0?"taille du point":"loupe"}),o.jsx("input",{type:"range",min:t?1:.3,max:t?6:4,step:.05,value:u,onChange:a=>p(Number(a.target.value)),className:"flex-1 accent-coral"}),o.jsx("span",{className:"font-mono text-[12px] text-cocoa w-12 text-right",children:u.toFixed(2)})]}),o.jsxs("details",{className:"bg-blanc rounded-card shadow-soft p-3",children:[o.jsx("summary",{className:"cursor-pointer font-mono text-[12.5px] text-cocoa",children:"la même grille, rendu plat"}),o.jsx("canvas",{ref:R,style:{imageRendering:"pixelated",width:"100%"},className:"block h-auto mt-3 rounded-[6px]"})]})]}),o.jsxs("div",{className:"flex flex-col gap-4",children:[o.jsxs("div",{className:"flex gap-2 flex-wrap",children:[o.jsx("button",{type:"button",onClick:G,className:"rounded-full bg-coral text-blanc font-display text-[14px] px-4 py-2 cursor-pointer hover:bg-coral-deep",children:"copier les réglages"}),o.jsx("button",{type:"button",onClick:()=>c(j),className:"rounded-full bg-linen text-cocoa font-display text-[14px] px-4 py-2 cursor-pointer hover:bg-edge-3",children:"remettre à zéro"})]}),o.jsxs("label",{className:"flex items-center justify-between gap-3 bg-blanc rounded-chip px-3 py-2",children:[o.jsx("span",{className:"font-mono text-[12.5px] text-bark",children:"couleur de la toile"}),o.jsx("input",{type:"color",value:K(l.clothColor),onChange:a=>P("clothColor",V(a.target.value)),className:"w-12 h-8 rounded-[8px] border-[1.5px] border-edge-3 cursor-pointer bg-transparent p-0"})]}),$.map(a=>o.jsxs("fieldset",{className:"bg-blanc rounded-card shadow-soft p-3 border-0 m-0",children:[o.jsx("legend",{className:"font-display font-medium text-[14px] text-ink px-1",children:a.title}),o.jsx("div",{className:"flex flex-col gap-1.5 mt-1",children:a.items.map(r=>o.jsxs("label",{className:"grid grid-cols-[1fr_auto] gap-x-2 items-center",children:[o.jsx("span",{className:"font-mono text-[11.5px] text-stone col-span-2",children:r.label}),o.jsx("input",{type:"range",min:r.min,max:r.max,step:r.step,value:l[r.key],onChange:d=>P(r.key,Number(d.target.value)),className:"w-full accent-coral"}),o.jsx("span",{className:"font-mono text-[11.5px] text-cocoa w-12 text-right",children:l[r.key].toFixed(3)})]},r.key))})]},a.title))]})]}),k&&o.jsxs("div",{className:"mt-6",children:[o.jsx("p",{className:"font-mono text-[12.5px] text-stone m-0 mb-2",children:"copié dans le presse-papier — collez-le tel quel"}),o.jsx("textarea",{readOnly:!0,value:k,rows:14,className:"w-full font-mono text-[12px] rounded-field border-[1.5px] border-edge-3 bg-blanc p-3"})]})]})}export{ee as default};
