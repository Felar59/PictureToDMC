const u={clothColor:[.93,.9,.83],weaveDepth:.35,weaveContrast:.5,holeSize:.16,holeDepth:.38,clothFuzz:.25,coverage:.54,legWidth:.21,roundness:.7,crossOffset:.04,jitterPos:.035,jitterAngle:.07,jitterLen:.08,topLegMix:.5,plyFreq:7,plyDepth:.2,fibreNoise:.12,lightAngle:2.3,lightHeight:.55,diffuse:.9,ambient:.55,specular:.4,shininess:18,sheen:.45,shadowStrength:.45,shadowSpread:.1,valueJitter:.07,hueJitter:.015,saturation:1,gamma:1},L=[{title:"Toile",items:[{key:"weaveDepth",label:"Relief du tissage",min:0,max:1,step:.01},{key:"weaveContrast",label:"Contraste du tissage",min:0,max:1,step:.01},{key:"holeSize",label:"Taille des trous",min:0,max:.4,step:.005},{key:"holeDepth",label:"Profondeur des trous",min:0,max:1,step:.01},{key:"clothFuzz",label:"Grain du coton",min:0,max:1,step:.01}]},{title:"Point",items:[{key:"coverage",label:"Longueur des brins",min:.2,max:.75,step:.005},{key:"legWidth",label:"Épaisseur du fil",min:.04,max:.35,step:.005},{key:"roundness",label:"Rondeur",min:.1,max:1.5,step:.01},{key:"crossOffset",label:"Décalage du croisement",min:0,max:.2,step:.005},{key:"topLegMix",label:"Brin du dessus",min:0,max:1,step:.01}]},{title:"Irrégularité",items:[{key:"jitterPos",label:"Position",min:0,max:.2,step:.002},{key:"jitterAngle",label:"Angle",min:0,max:.4,step:.005},{key:"jitterLen",label:"Longueur",min:0,max:.4,step:.005}]},{title:"Torsion du fil",items:[{key:"plyFreq",label:"Fréquence",min:0,max:30,step:.5},{key:"plyDepth",label:"Profondeur",min:0,max:1,step:.01},{key:"fibreNoise",label:"Fibres",min:0,max:1,step:.01}]},{title:"Lumière",items:[{key:"lightAngle",label:"Direction",min:0,max:6.2832,step:.02},{key:"lightHeight",label:"Hauteur",min:.05,max:1,step:.01},{key:"diffuse",label:"Diffus",min:0,max:2,step:.01},{key:"ambient",label:"Ambiant",min:0,max:1.2,step:.01},{key:"specular",label:"Reflet",min:0,max:2,step:.01},{key:"shininess",label:"Netteté du reflet",min:2,max:64,step:.5},{key:"sheen",label:"Brillance le long du brin",min:0,max:1,step:.01}]},{title:"Ombre portée",items:[{key:"shadowStrength",label:"Force",min:0,max:1,step:.01},{key:"shadowSpread",label:"Étalement",min:.01,max:.3,step:.005}]},{title:"Couleur",items:[{key:"valueJitter",label:"Variation de ton",min:0,max:.3,step:.005},{key:"hueJitter",label:"Variation de teinte",min:0,max:.1,step:.002},{key:"saturation",label:"Saturation",min:0,max:2,step:.01},{key:"gamma",label:"Gamma",min:.5,max:1.8,step:.01}]}],p="ptd.stitch-params";function G(){try{const t=window.localStorage.getItem(p);if(!t)return u;const e=JSON.parse(t);return{...u,...e}}catch{return u}}function F(t){try{window.localStorage.setItem(p,JSON.stringify(t))}catch{}}function z(){try{window.localStorage.removeItem(p)}catch{}}const P=`#version 300 es
void main() {
  // One oversized triangle covers the viewport, so there is no buffer to bind.
  vec2 xy = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
  gl_Position = vec4(xy, 0.0, 1.0);
}`,k=`#version 300 es
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
}`;function x(t,e,a){const r=t.createShader(e);if(!r)throw new Error("could not create shader");if(t.shaderSource(r,a),t.compileShader(r),!t.getShaderParameter(r,t.COMPILE_STATUS)){const h=t.getShaderInfoLog(r);throw t.deleteShader(r),new Error(`shader failed to compile: ${h}`)}return r}function H(t){const e=t.getContext("webgl2",{antialias:!1,premultipliedAlpha:!1});if(!e)throw new Error("WebGL2 unavailable");const a=e.createProgram();if(!a)throw new Error("could not create program");const r=x(e,e.VERTEX_SHADER,P),h=x(e,e.FRAGMENT_SHADER,k);if(e.attachShader(a,r),e.attachShader(a,h),e.linkProgram(a),!e.getProgramParameter(a,e.LINK_STATUS))throw new Error(`program failed to link: ${e.getProgramInfoLog(a)}`);e.deleteShader(r),e.deleteShader(h);const f=e.createTexture();e.bindTexture(e.TEXTURE_2D,f),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const l=o=>e.getUniformLocation(a,o),s={pattern:l("uPattern"),grid:l("uGrid"),resolution:l("uResolution"),cellPx:l("uCellPx"),origin:l("uOrigin"),clothColor:l("uClothColor"),groundAlpha:l("uGroundAlpha")},b=Object.keys(u).filter(o=>o!=="clothColor"),w=new Map(b.map(o=>[o,l(`u${o[0].toUpperCase()}${o.slice(1)}`)]));let m=null;return{render(o,g,y,S=!1,c){const v=Math.min(window.devicePixelRatio||1,2),i=Math.max(1,Math.round(c?c.width:t.clientWidth*v)),n=Math.max(1,Math.round(c?c.height:t.clientHeight*v));(t.width!==i||t.height!==n)&&(t.width=i,t.height=n),e.viewport(0,0,i,n),e.useProgram(a),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,f),o!==m&&(e.texImage2D(e.TEXTURE_2D,0,e.RGBA,o.width,o.height,0,e.RGBA,e.UNSIGNED_BYTE,o.data),m=o),e.uniform1i(s.pattern,0);const T=Math.min(i/o.width,n/o.height),d=Math.max(2,T*y);e.uniform2f(s.grid,o.width,o.height),e.uniform2f(s.resolution,i,n),e.uniform1f(s.cellPx,d),e.uniform2f(s.origin,(i-o.width*d)/2,(n-o.height*d)/2),e.uniform3fv(s.clothColor,g.clothColor),e.uniform1f(s.groundAlpha,S?0:1);for(const[E,C]of w)e.uniform1f(C,g[E]);e.drawArrays(e.TRIANGLES,0,3)},dispose(){e.deleteTexture(f),e.deleteProgram(a)}}}const A="/assets/cushion-Shy2RVgn.avif",D="/assets/hoop-DQZk-h_G.avif",R="/assets/shirt-DS87ZXGA.avif",_="/assets/tote-CYxjghuc.avif",I=1,U=[{key:"hoop",src:D,spot:{x:.5,y:.5,w:.46}},{key:"tote",src:_,spot:{x:.5,y:.52,w:.34}},{key:"shirt",src:R,spot:{x:.5,y:.44,w:.2}},{key:"cushion",src:A,spot:{x:.5,y:.5,w:.36}}];export{I as C,u as D,U as P,L as a,z as b,H as c,G as l,F as s};
