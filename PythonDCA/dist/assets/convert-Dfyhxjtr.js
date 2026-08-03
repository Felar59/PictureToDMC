import{r as ln,j as o,c as P,u as G,a as h,R as cn,b as ce,d as N,B as w,D as dn,e as un,P as hn,p as mn,A as fn,S as gn,f as xn,g as pn,h as bn,C as Dn,i as U}from"./index-BGWGA5nt.js";ln();function te({hex:e,width:n=28,height:r=38,radius:a=8,className:t}){return o.jsx("div",{className:P("bobbin-sm shrink-0",t),style:{width:n,height:r,borderRadius:a,background:e},"aria-hidden":"true"})}function ge({open:e,onClose:n,title:r,children:a,className:t}){const{t:l}=G();return h.useEffect(()=>{if(!e)return;const s=u=>{u.key==="Escape"&&n()};document.addEventListener("keydown",s);const i=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{document.removeEventListener("keydown",s),document.body.style.overflow=i}},[e,n]),e?o.jsx("div",{className:"fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm flex items-center justify-center p-4",onClick:n,children:o.jsxs("div",{role:"dialog","aria-modal":"true","aria-label":r,onClick:s=>s.stopPropagation(),className:P("bg-blanc rounded-[24px] shadow-screen w-full max-w-xl max-h-[90vh] overflow-y-auto scroll-linen animate-stitch-in",t),children:[o.jsxs("div",{className:"flex items-center justify-between gap-4 p-6 border-b-2 border-dashed border-edge-2 sticky top-0 bg-blanc rounded-t-[24px]",children:[o.jsx("h2",{className:"text-xl m-0",children:r}),o.jsx("button",{type:"button",onClick:n,"aria-label":l.converter.detail.close,className:"size-9 shrink-0 rounded-full bg-linen text-cocoa flex items-center justify-center cursor-pointer transition-colors hover:bg-coral hover:text-blanc",children:"✕"})]}),o.jsx("div",{className:"p-6",children:a})]})}):null}function W(e,n,{checkForDefaultPrevented:r=!0}={}){return function(t){if(e?.(t),r===!1||!t.defaultPrevented)return n?.(t)}}function xe(e,n=[]){let r=[];function a(l,s){const i=h.createContext(s),u=r.length;r=[...r,s];const g=c=>{const{scope:x,children:D,...b}=c,d=x?.[e]?.[u]||i,m=h.useMemo(()=>b,Object.values(b));return o.jsx(d.Provider,{value:m,children:D})};g.displayName=l+"Provider";function f(c,x){const D=x?.[e]?.[u]||i,b=h.useContext(D);if(b)return b;if(s!==void 0)return s;throw new Error(`\`${c}\` must be used within \`${l}\``)}return[g,f]}const t=()=>{const l=r.map(s=>h.createContext(s));return function(i){const u=i?.[e]||l;return h.useMemo(()=>({[`__scope${e}`]:{...i,[e]:u}}),[i,u])}};return t.scopeName=e,[a,Cn(t,...n)]}function Cn(...e){const n=e[0];if(e.length===1)return n;const r=()=>{const a=e.map(t=>({useScope:t(),scopeName:t.scopeName}));return function(l){const s=a.reduce((i,{useScope:u,scopeName:g})=>{const c=u(l)[`__scope${g}`];return{...i,...c}},{});return h.useMemo(()=>({[`__scope${n.scopeName}`]:s}),[s])}};return r.scopeName=n.scopeName,r}var je=globalThis?.document?h.useLayoutEffect:()=>{},Bn=cn[" useInsertionEffect ".trim().toString()]||je;function Me({prop:e,defaultProp:n,onChange:r=()=>{},caller:a}){const[t,l,s]=yn({defaultProp:n,onChange:r}),i=e!==void 0,u=i?e:t;{const f=h.useRef(e!==void 0);h.useEffect(()=>{const c=f.current;c!==i&&console.warn(`${a} is changing from ${c?"controlled":"uncontrolled"} to ${i?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),f.current=i},[i,a])}const g=h.useCallback(f=>{if(i){const c=vn(f)?f(e):f;c!==e&&s.current?.(c)}else l(f)},[i,e,l,s]);return[u,g]}function yn({defaultProp:e,onChange:n}){const[r,a]=h.useState(e),t=h.useRef(r),l=h.useRef(n);return Bn(()=>{l.current=n},[n]),h.useEffect(()=>{t.current!==r&&(l.current?.(r),t.current=r)},[r,t]),[r,a,l]}function vn(e){return typeof e=="function"}function Le(e){const n=h.useRef({value:e,previous:e});return h.useMemo(()=>(n.current.value!==e&&(n.current.previous=n.current.value,n.current.value=e),n.current.previous),[e])}function Ne(e){const[n,r]=h.useState(void 0);return je(()=>{if(e){r({width:e.offsetWidth,height:e.offsetHeight});const a=new ResizeObserver(t=>{if(!Array.isArray(t)||!t.length)return;const l=t[0];let s,i;if("borderBoxSize"in l){const u=l.borderBoxSize,g=Array.isArray(u)?u[0]:u;s=g.inlineSize,i=g.blockSize}else s=e.offsetWidth,i=e.offsetHeight;r({width:s,height:i})});return a.observe(e,{box:"border-box"}),()=>a.unobserve(e)}else r(void 0)},[e]),n}var wn=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],q=wn.reduce((e,n)=>{const r=ce(`Primitive.${n}`),a=h.forwardRef((t,l)=>{const{asChild:s,...i}=t,u=s?r:n;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),o.jsx(u,{...i,ref:l})});return a.displayName=`Primitive.${n}`,{...e,[n]:a}},{}),oe="Switch",[En,Yt]=xe(oe),[kn,Sn]=En(oe),Pe=h.forwardRef((e,n)=>{const{__scopeSwitch:r,name:a,checked:t,defaultChecked:l,required:s,disabled:i,value:u="on",onCheckedChange:g,form:f,...c}=e,[x,D]=h.useState(null),b=N(n,y=>D(y)),d=h.useRef(!1),m=x?f||!!x.closest("form"):!0,[p,B]=Me({prop:t,defaultProp:l??!1,onChange:g,caller:oe});return o.jsxs(kn,{scope:r,checked:p,disabled:i,children:[o.jsx(q.button,{type:"button",role:"switch","aria-checked":p,"aria-required":s,"data-state":Te(p),"data-disabled":i?"":void 0,disabled:i,value:u,...c,ref:b,onClick:W(e.onClick,y=>{B(C=>!C),m&&(d.current=y.isPropagationStopped(),d.current||y.stopPropagation())})}),m&&o.jsx(Ve,{control:x,bubbles:!d.current,name:a,value:u,checked:p,required:s,disabled:i,form:f,style:{transform:"translateX(-100%)"}})]})});Pe.displayName=oe;var Ge="SwitchThumb",Re=h.forwardRef((e,n)=>{const{__scopeSwitch:r,...a}=e,t=Sn(Ge,r);return o.jsx(q.span,{"data-state":Te(t.checked),"data-disabled":t.disabled?"":void 0,...a,ref:n})});Re.displayName=Ge;var An="SwitchBubbleInput",Ve=h.forwardRef(({__scopeSwitch:e,control:n,checked:r,bubbles:a=!0,...t},l)=>{const s=h.useRef(null),i=N(s,l),u=Le(r),g=Ne(n);return h.useEffect(()=>{const f=s.current;if(!f)return;const c=window.HTMLInputElement.prototype,D=Object.getOwnPropertyDescriptor(c,"checked").set;if(u!==r&&D){const b=new Event("click",{bubbles:a});D.call(f,r),f.dispatchEvent(b)}},[u,r,a]),o.jsx("input",{type:"checkbox","aria-hidden":!0,defaultChecked:r,...t,tabIndex:-1,ref:i,style:{...t.style,...g,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})});Ve.displayName=An;function Te(e){return e?"checked":"unchecked"}var Fn=Pe,jn=Re;function pe({className:e,...n}){return o.jsx(Fn,{className:P("peer inline-flex h-[30px] w-[52px] shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors","data-[state=checked]:bg-nile data-[state=unchecked]:bg-edge-5","disabled:cursor-not-allowed disabled:opacity-50",e),...n,children:o.jsx(jn,{className:"pointer-events-none block size-6 rounded-full bg-blanc shadow-[0_1px_4px_rgba(0,0,0,.2)] transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0"})})}const Mn=`Ecru|Ecru/off-white|FFF7E7
Blanc|White|FCFCFF
White|White|FCFCFF
B5200|Snow White|FFFFFF
1|White Tin|EFEEF0
2|Tin|C5C4C9
3|Tin - Medium|B0B0B5
4|Tin - Dark|9C9B9D
5|Driftwood - Light|E3CCBE
6|Driftwood - Medium Light|DCC6B8
7|Driftwood|CCB8AA
8|Driftwood - Dark|9D7D71
9|Cocoa - Very Dark|552014
10|Tender Green - Very Light|EDFED9
11|Tender Green - Light|E2EDB5
12|Tender Green|CDD99A
13|Nile Green - Medium Light|BFF6E0
14|Apple Green - Pale|D0FBB2
15|Apple Green|D1EDA4
16|Chartreuse - Light|A4D67C
17|Yellow Plum - Light|E5E272
18|Yellow Plum|D9D56D
19|Autumn Gold - Medium Light|F7C95F
20|Shrimp|F7AF93
21|Alizarian - Light|D79982
22|Alizarian|BC604E
23|Apple Blossom|EDE2ED
24|White Lavender|E0D7EE
25|Lavender - Ultra Light|DAD2E9
26|Lavender - Pale|CFC8DE
27|White Violet|E9ECFC
28|Eggplant - Medium Light|7D4E92
29|Eggplant|674076
30|Blueberry - Medium Light|6D54D3
31|Blueberry|5834A3
32|Blueberry - Dark|4D2E8A
33|Fuchsia|D9539F
34|Fuchsia - Dark|AE4280
35|Fuchsia - Very Dark|732B55
150|Red - Bright|CF0053
151|Pink|FFCBD7
152|Tawny - Dark|E1A1A1
153|Lilac|EAC5EB
154|Red - Very Dark|4B233A
155|Forget-me-not Blue|9774B6
156|Blue - Medium|8577B4
157|Blue - Light|B5B8EA
158|Blue - Dark|393068
159|Petrol Blue - Light|BCB5DE
160|Petrol Blue - Medium|8178A9
161|Petrol Blue - Dark|60568B
162|Baby Blue - Light|CAE7F0
163|Green|557A60
164|Green - Light|BAE4B6
165|Green - Bright|E1F477
166|Lime Green|ADC238
167|Khaki Brown|855D31
168|Silver Gray|B1AEB7
169|Pewter Gray|827D7D
208|Lavender - Very Dark|9442A7
209|Lavender - Dark|BA72C6
210|Lavender - Medium|D49FE1
211|Lavender - Light|E5BDED
221|Shell Pink - Very Dark|792631
223|Shell Pink - Light|BB6864
224|Shell Pink - Very Light|E2A598
225|Shell Pink - Ultra Very Light|F8D9CD
300|Mahogany - Very Dark|6C3116
301|Mahogany - Medium|AA5237
304|Red - Medium|A10C39
307|Lemon|FDE949
309|Rose - Dark|BA2044
310|Black|000000
311|Blue - Medium|002A64
312|Baby Blue - Very Dark|1F3279
315|Antique Mauve - Medium Dark|7D4246
316|Antique Mauve - Medium|BC757F
317|Pewter Gray|6D6469
318|Steel Gray - Light|999B9D
319|Pistachio Green - Very Dark|3A553B
320|Pistachio Green - Medium|608C59
321|Red|BD1136
322|Baby Blue|3A609D
326|Rose - Very Dark|AC1C37
327|Violet|5E0F77
333|Blue Violet - Very Dark|6E2E9B
334|Baby Blue - Medium|6085B8
335|Rose|D63D57
336|Blue|0C275E
340|Blue Violet - Medium|996DC3
341|Blue Violet - Light|A39AD7
347|Salmon - Very Dark|AB1B33
349|Coral - Dark|C62C38
350|Coral - Medium|DE3F40
351|Coral|ED625B
352|Coral - Light|F78372
353|Peach|FDB4A1
355|Terra Cotta - Dark|97382B
356|Terra Cotta - Medium|BE5C4B
367|Pistachio Green - Dark|446B45
368|Pistachio Green - Light|7FC66D
369|Pistachio Green - Very Light|CDEFA6
370|Mustard - Medium|917245
371|Mustard|9F8352
372|Mustard - Light|AD9564
400|Mahogany - Dark|813718
402|Mahogany - Very Light|EF9E74
407|Desert Sand - Dark|B77159
413|Pewter Gray - Dark|4A4749
414|Steel Gray - Dark|766E72
415|Pearl Gray|B8B9BD
420|Hazelnut Brown - Dark|855A30
422|Hazelnut Brown - Light|C99A67
433|Brown - Medium|73421E
434|Brown - Light|8F5332
435|Brown - Very Light|A96538
436|Tan|C78559
437|Tan - Light|DAA26F
444|Lemon - Dark|F5BC13
445|Lemon - Light|FCF999
451|Shell Gray - Dark|887773
452|Shell Gray - Medium|AD9994
453|Shell Gray - Light|CCB8AA
469|Avocado Green|5B6533
470|Avocado Green - Light|72813E
471|Avocado Green - Very Light|9EB357
472|Avocado Green - Ultra Light|D1DE75
498|Red - Dark|970B2C
500|Blue Green - Very Dark|1D362A
501|Blue Green - Dark|2F5446
502|Blue Green|57826E
503|Blue Green - Medium|89B89F
505|Grass Green - Dark|338362
517|Wedgewood - Dark|216285
518|Wedgewood - Light|50819C
519|Sky Blue|94B7CB
520|Fern Green - Dark|384526
522|Fern Green|808B6E
523|Fern Green - Light|959F7A
524|Fern Green - Very Light|AEA78E
535|Ash Gray - Very Light|4B4B49
543|Beige Brown - Ultra Very Light|EAD0B5
550|Violet - Very Dark|580E5C
552|Violet - Medium|902F99
553|Violet|A449AC
554|Violet - Light|DC9CDE
561|Jade - Very Dark|285E48
562|Jade - Medium|3B8C5A
563|Jade - Light|6ED39A
564|Jade - Very Light|95E4AF
580|Moss Green - Dark|355F0B
581|Moss Green|838A29
597|Turquoise|52ADAB
598|Turquoise - Light|97D8D3
600|Cranberry - Very Dark|BF1C48
601|Cranberry - Dark|C62A53
602|Cranberry - Medium|D63F68
603|Cranberry - Light Medium|FB4B7C
604|Cranberry - Light|F793B2
605|Cranberry - Very Light|FBACC4
606|Orange-red - Bright|F70F00
608|Orange - Bright|FD480C
610|Drab Brown - Dark|6B5039
611|Drab Brown|7C5F46
612|Drab Brown - Light|A6885E
613|Drab Brown - Very Light|B99F72
632|Desert Sand - Ultra Very Dark|7F4232
640|Beige Gray - Very Dark|817868
642|Beige Gray - Dark|958D79
644|Beige Gray - Medium|C4BEA6
645|Beaver Gray - Very Dark|5D5D54
646|Beaver Gray - Dark|6B6860
647|Beaver Gray - Medium|908E85
648|Beaver Gray - Light|A7A69F
666|Red - Bright|CE1B33
676|Old Gold - Light|ECBF7D
677|Old Gold - Very Light|F2DC9F
680|Old Gold - Dark|B07B46
699|Green|075B26
700|Green - Bright|076C34
701|Green - Light|217C36
702|Kelly Green|379130
703|Chartreuse|63B330
704|Chartreuse - Bright|88C53A
712|Cream|F6EFDA
718|Plum|CB2089
720|Orange Spice - Dark|C83A24
721|Orange Spice - Medium|F46440
722|Orange Spice - Light|F98756
724|Winnie The Pooh Gold|F9D039
725|Topaz|F9C15B
726|Topaz - Light|FDDB63
727|Topaz - Very Light|FDE98B
728|Golden Yellow|F2AE3F
729|Old Gold - Medium|CE9657
730|Olive Green - Very Dark|63520B
732|Olive Green|725C0C
733|Olive Green - Medium|A78A44
734|Olive Green - Light|BB9C54
738|Tan - Very Light|E2B783
739|Tan - Ultra Very Light|F2DEB9
740|Tangerine|FD6F1A
741|Tangerine - Medium|FC8B10
742|Tangerine - Light|FDAE3C
743|Yellow - Medium|FDD769
744|Yellow - Pale|FEE88D
745|Yellow - Light Pale|FEEBA5
746|Off White|FAF2D5
747|Sky Blue - Very Light|CEE9EA
754|Peach - Light|F7C9B0
758|Terra Cotta - Very Light|E99F83
760|Salmon|EC8880
761|Salmon - Light|F8B4AD
762|Pearl Gray - Very Light|D1D0D2
772|Yellow Green - Very Light|D7EFA7
775|Baby Blue - Very Light|D4E3EF
777|Red - Deep|9B0042
778|Antique Mauve - Very Light|DCA6A4
779|Brown|53332D
780|Topaz - Ultra Very Dark|945026
782|Topaz - Dark|B26923
783|Topaz - Medium|D0883D
791|Cornflower Blue - Very Dark|2D2068
792|Cornflower Blue - Dark|454B8B
793|Cornflower Blue - Medium|7C82B5
794|Cornflower Blue - Light|A0B2D7
796|Royal Blue - Dark|272276
797|Royal Blue|2B3288
798|Delft Blue - Dark|4E5CA7
799|Delft Blue - Medium|6B7FC0
800|Delft Blue - Pale|B5C7E9
801|Coffee Brown - Dark|60391D
803|Blue - Deep|202754
807|Peacock Blue|558B9E
809|Delft Blue|919FD5
813|Blue - Light|7FA0C6
814|Garnet - Dark|711033
815|Garnet - Medium|800B34
816|Garnet|921238
817|Coral Red - Very Dark|BB1630
818|Baby Pink|FEDEDD
819|Baby Pink - Light|FCEBDE
820|Royal Blue - Very Dark|151264
822|Beige Gray - Light|E8DFC7
823|Blue - Dark|000B44
824|Blue - Very Dark|284779
825|Blue - Dark|34588F
826|Blue - Medium|5075A7
827|Blue - Very Light|A4C1DE
828|Blue - Ultra Very Light|C3D7E6
829|Golden Olive - Very Dark|64480C
830|Golden Olive - Dark|6E501D
831|Golden Olive - Medium|7C5F20
832|Golden Olive|9C7230
833|Golden Olive - Light|B99956
834|Golden Olive - Very Light|D2B468
838|Beige Brown - Very Dark|4A3021
839|Beige Brown - Dark|5A3C2D
840|Beige Brown - Medium|7A5939
841|Beige Brown - Light|A37D64
842|Beige Brown - Very Light|CBB094
844|Beaver Gray - Ultra Dark|494842
869|Hazelnut Brown - Very Dark|784C28
890|Pistachio Green - Ultra Dark|324233
891|Carnation - Dark|EE3246
892|Carnation - Medium|F44753
893|Carnation - Light|F66879
894|Carnation - Very Light|FD95A3
895|Hunter Green - Very Dark|344B2E
898|Coffee Brown - Very Dark|532F1B
899|Rose - Medium|EA6B78
900|Burnt Orange - Dark|C63117
902|Garnet - Very Dark|651329
904|Parrot Green - Very Dark|386324
905|Parrot Green - Dark|467924
906|Parrot Green - Medium|6C9E29
907|Parrot Green - Light|9DC72D
909|Emerald Green - Very Dark|106B43
910|Emerald Green - Dark|10814E
911|Emerald Green - Medium|109256
912|Emerald Green - Light|36B26B
913|Nile Green - Medium|55CA7D
915|Plum - Dark|95085A
917|Plum - Medium|AC1071
918|Red Copper - Dark|883630
919|Red Copper|9B371B
920|Copper - Medium|AB4836
921|Copper|C0573D
922|Copper - Light|DD6E4C
924|Gray Green - Very Dark|384A4A
926|Gray Green - Medium|617674
927|Gray Green - Light|9FA8A5
928|Gray Green - Very Light|C0C6C0
930|Antique Blue - Dark|495C6B
931|Antique Blue - Medium|667684
932|Antique Blue - Light|93A0AF
934|Avocado Green - BLACK|323324
935|Avocado Green - Dark|383A2A
936|Avocado Green - Very Dark|3F4227
937|Avocado Green - Medium|434F2C
938|Coffee Brown - Ultra Dark|45271A
939|Blue - Very Dark|09092F
943|Aquamarine - Medium|009A77
945|Tawny|F6C19A
946|Burnt Orange - Medium|ED4115
947|Burnt Orange|FC4F16
948|Peach - Very Light|FDE6D3
950|Desert Sand - Light|E5AC8D
951|Tawny - Light|FADDB6
954|Nile Green|6FDA8A
955|Nile Green - Light|A8EBAD
956|Geranium|F7566D
957|Geranium - Pale|FD99AF
958|Seagreen - Dark|0DB294
959|Seagreen - Medium|72D0B7
961|Dusty Rose - Dark|DE586C
962|Dusty Rose - Medium|EB7183
963|Dusty Rose - Ultra Very Light|FDCCD1
964|Seagreen - Light|A5E4D4
966|Baby Green - Medium|94D28A
967|Peach - Light|FFC2AC
970|Pumpkin - Light|FB6721
972|Canary - Deep|FB9F11
973|Canary - Bright|FCCD2D
974|Winnie The Pooh Gold 2|F9C739
975|Golden Brown - Dark|813C11
976|Golden Brown - Medium|CF7532
977|Golden Brown - Light|EC8F43
986|Forest Green - Very Dark|2E5230
987|Forest Green - Dark|436838
988|Forest Green - Medium|66924A
989|Forest Green|71A74E
991|Aquamarine - Dark|135F55
992|Aquamarine - Light|42B59E
993|Aquamarine - Very Light|62D8B6
995|Electric Blue - Dark|0061B0
996|Electric Blue - Medium|49A8EB
3011|Khaki Green - Dark|655935
3012|Khaki Green - Medium|8B7B4E
3013|Khaki Green - Light|AFA97B
3021|Brown Gray - Very Dark|50403B
3022|Brown Gray - Medium|848274
3023|Brown Gray - Light|A29B86
3024|Brown Gray - Very Light|BEB8AC
3031|Mocha Brown - Very Dark|423014
3032|Mocha Brown - Medium|9D8868
3033|Mocha Brown - Very Light|DBC7AD
3041|Antique Violet - Medium|866A76
3042|Antique Violet - Light|AF98A0
3045|Yellow Beige - Dark|AF8152
3046|Yellow Beige - Medium|CEB074
3047|Yellow Beige - Light|EAD8AB
3051|Green Gray - Dark|4C4C1E
3052|Green Gray - Medium|787E5C
3053|Green Gray|999D75
3064|Desert Sand|BA7056
3072|Beaver Gray - Very Light|D2D2CA
3078|Golden Yellow - Very Light|FCF6B6
3325|Baby Blue - Light|ADCDE7
3326|Rose - Light|F9979C
3328|Salmon - Dark|BE444A
3340|Apricot - Medium|FD6B4F
3341|Apricot|FD8E78
3345|Hunter Green - Dark|40552E
3346|Hunter Green|56743B
3347|Yellow Green - Medium|6D9646
3348|Yellow Green - Light|BEDF74
3350|Dusty Rose - Ultra Dark|AA3949
3354|Dusty Rose - Light|EFA5AC
3362|Pine Green - Dark|49523C
3363|Pine Green - Medium|617451
3364|Pine Green|8E9B6D
3371|Black Brown|36220E
3607|Plum - Light|D94C9D
3608|Plum - Very Light|EC81BE
3609|Plum - Ultra Light|F6B0DF
3685|Mauve - Very Dark|79263B
3687|Mauve|B5455D
3688|Mauve - Medium|DC7C86
3689|Mauve - Light|F8BBC8
3705|Melon - Dark|F2494F
3706|Melon - Medium|FD6E70
3708|Melon - Light|FDA0AE
3712|Salmon - Medium|D95D5D
3713|Salmon - Very Light|FDD5D0
3716|Dusty Rose - Very Light|FCAFB9
3721|Shell Pink - Dark|933B3D
3722|Shell Pink - Medium|A04B4C
3726|Antique Mauve - Dark|95565C
3727|Antique Mauve - Light|DA9EA6
3731|Dusty Rose - Very Dark|C34C5C
3733|Dusty Rose|EA7E86
3740|Antique Violet - Dark|71535D
3743|Antique Violet - Very Light|CFC2C9
3746|Blue Violet - Dark|844AB5
3747|Blue Violet - Very Light|D0C5EC
3750|Antique Blue - Very Dark|1D4552
3752|Antique Blue - Very Light|BAC9CC
3753|Antique Blue - Ultra Very Light|D9E6EC
3755|Baby Blue|81A5D8
3756|Baby Blue - Light|E9F4FA
3760|Wedgewood - Medium|467293
3761|Sky Blue - Light|B1D0DF
3765|Peacock Blue - Very Dark|175E78
3766|Peacock Blue - Light|4B8AA1
3768|Gray Green - Dark|4C605F
3770|Tawny - Very Light|FEF1D8
3771|Peach - Dark|E8AC9B
3772|Desert Sand - Very Dark|995744
3774|Desert Sand - Very Light|F3CFB4
3776|Mahogany - Light|C96444
3777|Terra Cotta - Very Dark|922F25
3778|Terra Cotta - Light|D2705C
3779|Terra Cotta - Ultra Very Light|F2AB95
3781|Mocha Brown - Dark|593F2B
3782|Mocha Brown - Light|B69D80
3787|Brown Gray - Dark|62524C
3790|Beige Gray - Ultra Dark|6D5A4B
3799|Pewter Gray - Very Dark|39393D
3801|Melon - Very Dark|E4353D
3802|Antique Mauve - Very Dark|672A33
3803|Mauve - Dark|872A43
3804|Cyclamen Pink - Dark|CE2B63
3805|Cyclamen Pink|DF3C73
3806|Cyclamen Pink - Light|F15A91
3807|Cornflower Blue|4B599E
3808|Turquoise - Ultra Very Dark|03535C
3809|Turquoise - Very Dark|136A75
3810|Turquoise - Dark|2D8D98
3811|Turquoise - Very Light|A8E2E5
3812|Seagreen - Very Dark|07A184
3813|Blue Green - Light|86C3AB
3814|Aquamarine|0B8673
3815|Celadon Green - Dark|437259
3816|Celadon Green|60937A
3817|Celadon Green - Light|81C6A4
3818|Emerald Green - Ultra Very Dark|005D2E
3819|Moss Green - Light|CCC959
3820|Straw - Dark|DBA53E
3821|Straw|EBBB52
3822|Straw - Light|F7D169
3823|Yellow - Ultra Pale|FEF5CD
3824|Apricot - Light|FCAE99
3825|Pumpkin - Pale|FEA370
3826|Golden Brown|B16633
3827|Golden Brown - Pale|EAA664
3828|Hazelnut Brown|AA7C43
3829|Old Gold - Very Dark|A7671D
3830|Terra Cotta|A94138
3831|Raspberry - Dark|C12B52
3832|Raspberry - Medium|E36370
3833|Raspberry - Light|EA8B96
3834|Grape - Dark|6A2258
3835|Grape - Medium|924D78
3836|Grape - Light|C597B9
3837|Lavender - Ultra Dark|8A2A8F
3838|Lavender Blue - Dark|606BAD
3839|Lavender Blue - Medium|7A7EC5
3840|Lavender Blue - Light|B2BDEA
3841|Baby Blue - Pale|D9EAF2
3842|Wedgewood - Dark|06506A
3843|Electric Blue|28A3DE
3844|Bright Turquoise - Dark|1F7FA0
3845|Bright Turquoise - Medium|2BADD1
3846|Bright Turquoise - Light|5ECCEC
3847|Teal Green - Dark|186358
3848|Teal Green - Medium|207E72
3849|Teal Green - Light|35B193
3850|Bright Green - Dark|208B46
3851|Bright Green - Light|61BB84
3852|Straw - Very Dark|E3A730
3853|Autumn Gold - Dark|EF8125
3854|Autumn Gold - Medium|FBAC56
3855|Autumn Gold - Light|FDDFA0
3856|Mahogany - Ultra Very Light|FDBE8E
3857|Rosewood - Dark|6A2F26
3858|Rosewood - Medium|803A32
3859|Rosewood - Light|BA7A6C
3860|Cocoa|896362
3861|Cocoa - Light|AC8583
3862|Mocha Beige - Dark|6E492A
3863|Mocha Beige - Medium|94725D
3864|Mocha Beige - Light|C9AA92
3865|Winter White|FFFDF9
3866|Mocha Brown - Ultra Very Light|F0E6D7
E155|Metallic - Amethyst|9774B6
E168|Metallic - Silver|B1AEB7
E211|Metallic - Lilac|E5BDED
E301|Metallic - Copper|AA5237
E310|Metallic - Ebony|000000
E316|Metallic - Pink Amethyst|BC757F
E317|Metallic - Titanium|6D6469
E321|Metallic - Red Ruby|BD1136
E334|Metallic - Blue Topaz|6085B8
E415|Metallic - Pewter|B8B9BD
E436|Metallic - Golden Oak|C78559
E677|Metallic - White Gold|F2DC9F
E699|Metallic - Green Emerald|075B26
E703|Metallic - Light Green Emerald|63B330
E718|Metallic - Pink Garnet|CB2089
E746|Metallic - Cream|FAF2D5
E747|Metallic - Baby Blue|CEE9EA
E815|Metallic - Dark Red Ruby|800B34
E818|Metallic - Soft Pink|FEDEDD
E825|Metallic - Blue Sapphire|34588F
E898|Metallic - Dark Oak|532F1B
E966|Metallic - Lime|94D28A
E967|Metallic - Soft Peach|FFC2AC
E3685|Metallic - Rosewood|79263B
E3747|Metallic - Sky Blue|B9CDE5
E3821|Metallic - Light Gold|EABD00
E3837|Metallic - Purple Ruby|7030A0
E3843|Metallic - Light Blue Sapphire|00B0F0
E3849|Metallic - Aquamarine Blue|00FF99
E3852|Metallic - Dark Gold|CCA500
E980|Neon - Neon Yellow|F0FF00
E990|Neon - Neon Green|06EC21
5282|Metallic Pearl - Gold|F2AE3F
5283|Metallic Pearl - Silver|C5C4C9
CEcru|Étoile - Ecru/off-white|FFF7E7
C310|Étoile - Black|000000
C318|Étoile - Steel Gray - Light|999B9D
C321|Étoile - Red|BD1136
C415|Étoile - Pearl Grey|B8B9BD
C433|Étoile - Brown - Medium|73421E
C436|Étoile - Tan|C78559
C444|Étoile - Lemon - Dark|F5BC13
C471|Étoile - Avocado Green - Very Light|9EB357
C519|Étoile - Sky Blue|94B7CB
C550|Étoile - Violet - Very Dark|580E5C
C554|Étoile - Violet - Light|DC9CDE
C600|Étoile - Cranberry - Very Dark|BF1C48
C603|Étoile - Cranberry|E4446E
C666|Étoile - Red - Bright|CE1B33
C699|Étoile - Green|075B26
C725|Étoile - Topaz|F9C15B
C738|Étoile - Tan - Very Light|E2B783
C740|Étoile - Tangerine|FD6F1A
C798|Étoile - Delft Blue - Dark|4E5CA7
C814|Étoile - Garnet - Dark|711033
C816|Étoile - Garnet|921238
C820|Étoile - Royal Blue - Very Dark|151264
C823|Étoile - Blue - Dark|000B44
C840|Étoile - Beige Brown - Medium|7A5939
C890|Étoile - Pistachio Green - Ultra Dark|324233
C900|Étoile - Burnt Orange - Dark|C63117
C907|Étoile - Parrot Green - Light|9DC72D
C915|Étoile - Plum - Dark|95085A
C938|Étoile - Coffee Brown - Ultra Dark|45271A
C972|Étoile - Canary - Deep|FB9F11
C995|Étoile - Electric Blue - Dark|0061B0
C3371|Étoile - Black Brown|36220E
C3799|Étoile - Pewter Gray - Very Dark|39393D
S5200|Satin - Snow White|FFFFFF
S211|Satin - Lavender|E5BDED
S307|Satin - Lemon|FDE949
S310|Satin - Black|000000
S321|Satin - Red|BD1136
S326|Satin - Rose|AC1C37
S351|Satin - Coral|ED625B
S352|Satin - Coral Light|F78372
S367|Satin - Pistachio Green|446B45
S415|Satin - Pearl Grey|B8B9BD
S471|Satin - Avocado Green Very Light|9EB357
S472|Satin - Avocado Green Ultra Light|D1DE75
S504|Satin - Blue Green|ACDAC1
S550|Satin - Violet Dark|580E5C
S552|Satin - Violet Medium|902F99
S601|Satin - Cranberry Dark|C62A53
S602|Satin - Cranberry|D63F68
S606|Satin - Orange Red|F70F00
S700|Satin - Green|076C34
S741|Satin - Tangerine|FC8B10
S798|Satin - Delft Blue Dark|4E5CA7
S799|Satin - Delft Blue|6B7FC0
S800|Satin - Delft Blue Pale|B5C7E9
S818|Satin - Baby Pink|FEDEDD
S820|Satin - Royal Blue Very Dark|151264
S841|Satin - Beige Brown|A37D64
S898|Satin - Coffee Brown|532F1B
S899|Satin - Rose|EA6B78
S931|Satin - Antique Blue|667684
S943|Satin - Aquamarine|009A77
S959|Satin - Seagreen|72D0B7
S976|Satin - Golden Brown|CF7532
S991|Satin - Aquamarine Dark|135F55
S995|Satin - Electric Blue|0061B0
S3685|Satin - Mauve|79263B
S3820|Satin - Straw|DBA53E`,ee=new Float64Array(256);for(let e=0;e<256;e++){const n=e/255;ee[e]=n<=.04045?n/12.92:((n+.055)/1.055)**2.4}const Ln=.95047,Nn=1.08883,Pn=.008856,Gn=7.787;function ie(e){return e>Pn?Math.cbrt(e):Gn*e+16/116}function Ie(e,n,r){const a=ee[e<0?0:e>255?255:e|0],t=ee[n<0?0:n>255?255:n|0],l=ee[r<0?0:r>255?255:r|0],s=ie((a*.4124+t*.3576+l*.1805)/Ln),i=ie(a*.2126+t*.7152+l*.0722),u=ie((a*.0193+t*.1192+l*.9505)/Nn);return[116*i-16,500*(s-i),200*(i-u)]}function de(e,n){const r=e[0]-n[0],a=e[1]-n[1],t=e[2]-n[2];return r*r+a*a+t*t}function Rn(e){const n=parseInt(e.replace("#",""),16);return[n>>16&255,n>>8&255,n&255]}const be=Mn.split(`
`).map(e=>{const[n,r,a]=e.split("|"),t=Rn(a);return{num:n,name:r,hex:`#${a}`,rgb:t,lab:Ie(t[0],t[1],t[2])}}),Vn=new Map(be.map(e=>[e.num.toLowerCase(),e]));function ae(e){return Vn.get(e.trim().toLowerCase())}function Tn(e,n=be){const r=e.length;if(r===0)return[];const a=n.length,t=r*a,l=new Float64Array(t);for(let f=0;f<r;f++){const c=e[f];for(let x=0;x<a;x++)l[f*a+x]=de(c,n[x].lab)}const s=new Int32Array(t);for(let f=0;f<t;f++)s[f]=f;s.sort((f,c)=>l[f]-l[c]);const i=new Array(r),u=new Uint8Array(a);let g=0;for(let f=0;f<t&&g<r;f++){const c=s[f],x=c/a|0,D=c-x*a;i[x]||u[D]||(i[x]=n[D],u[D]=1,g++)}for(let f=0;f<r;f++)if(!i[f]){let c=0,x=1/0;for(let D=0;D<n.length;D++){const b=de(e[f],n[D].lab);b<x&&(x=b,c=D)}i[f]=n[c]}return i}function In(e,n,r=[]){const a=new Set([...r].map(t=>t.toLowerCase()));return be.filter(t=>!a.has(t.num.toLowerCase())).map(t=>({t,d:de(e,t.lab)})).sort((t,l)=>t.d-l.d).slice(0,n).map(t=>t.t)}function On(e){return e.split(",").map(n=>n.trim()).filter(Boolean)}function _n({open:e,onClose:n,enabled:r,onEnabledChange:a,threads:t,onThreadsChange:l}){const{t:s}=G(),[i,u]=h.useState(null),[g,f]=h.useState(""),[c,x]=h.useState(null),D=()=>{const b=On(g);if(b.length===0)return;if(i==="remove"){l(t.filter(B=>!b.includes(B.num))),f(""),u(null);return}x(null);const d=[...t];let m=0,p=0;for(const B of b){const y=ae(B);y?d.some(C=>C.num===y.num)?p++:d.push(y):m++}l(d),f(""),m>0?x(s.converter.custom.notFound):p>0?x(s.converter.custom.already):u(null)};return o.jsx(ge,{open:e,onClose:n,title:s.converter.custom.title,children:o.jsxs("div",{className:"flex flex-col gap-5",children:[o.jsxs("label",{className:"flex items-center justify-between gap-4 bg-linen rounded-[16px] p-4 cursor-pointer",children:[o.jsxs("span",{children:[o.jsx("span",{className:"block text-base font-bold text-bark",children:s.converter.custom.toggle}),o.jsx("span",{className:"block text-sm text-stone",children:r?s.converter.custom.toggleOn:s.converter.custom.toggleOff})]}),o.jsx(pe,{checked:r,onCheckedChange:a})]}),o.jsxs("div",{children:[o.jsx("div",{className:"text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2",children:s.converter.custom.listLabel}),o.jsx("div",{className:"bg-linen border-[1.5px] border-edge-3 rounded-[16px] p-3 min-h-[120px] max-h-[220px] overflow-y-auto scroll-linen",children:t.length===0?o.jsx("span",{className:"text-sm text-stone",children:s.converter.custom.emptyList}):o.jsx("ul",{className:"flex flex-wrap gap-2 list-none p-0 m-0",children:t.map(b=>o.jsxs("li",{className:"flex items-center gap-2 rounded-[12px] bg-blanc border-[1.5px] border-edge-3 pl-2 pr-3 py-1.5",children:[o.jsx(te,{hex:b.hex,width:16,height:22,radius:5}),o.jsx("span",{className:"text-sm font-mono font-bold",children:b.num})]},b.num))})})]}),i&&o.jsxs("div",{className:"border-t-2 border-dashed border-edge-2 pt-5",children:[o.jsx("label",{htmlFor:"custom-codes",className:"block text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2",children:s.converter.custom.inputLabel}),o.jsxs("div",{className:"flex gap-3 flex-wrap",children:[o.jsx("input",{id:"custom-codes",type:"text",value:g,onChange:b=>f(b.target.value),onKeyDown:b=>b.key==="Enter"&&D(),placeholder:s.converter.custom.placeholder,className:`flex-1 min-w-[160px] text-base bg-linen border-[1.5px] rounded-[14px] px-4 py-3 outline-none transition-colors focus:bg-blanc ${i==="add"?"border-edge-3 focus:border-coral":"border-coral-edge focus:border-coral-deep"}`}),o.jsx(w,{size:"sm",onClick:D,children:s.converter.custom.validate}),o.jsx(w,{variant:"secondary",size:"sm",onClick:()=>{u(null),f(""),x(null)},children:s.converter.custom.cancel})]})]}),c&&o.jsx("p",{className:"bg-coral-wash border-[1.5px] border-coral-edge text-coral-deeper rounded-[14px] px-4 py-3 text-sm m-0",children:c}),o.jsxs("div",{className:"flex gap-2 flex-wrap pt-1",children:[o.jsx(w,{variant:"secondary",size:"sm",className:"flex-1 min-w-[110px]",onClick:()=>{u("add"),x(null)},children:s.converter.custom.add}),o.jsx(w,{variant:"secondary",size:"sm",className:"flex-1 min-w-[110px]",disabled:t.length===0,onClick:()=>{u("remove"),x(null)},children:s.converter.custom.remove}),o.jsx(w,{variant:"secondary",size:"sm",className:"flex-1 min-w-[110px]",disabled:t.length===0,onClick:()=>{l([]),x(null)},children:s.converter.custom.reset})]})]})})}function ye({className:e,...n}){return o.jsx("div",{className:P("bg-blanc rounded-[18px] shadow-soft p-5",e),...n})}function Oe({className:e,...n}){return o.jsx("div",{className:P("font-display font-medium text-[17px] text-ink",e),...n})}function ve({className:e,...n}){return o.jsx("span",{className:P("text-[12.5px] font-extrabold tracking-[.05em] uppercase text-cocoa",e),...n})}function we({className:e,...n}){return o.jsx("span",{className:P("font-mono text-[13.5px] font-bold bg-linen rounded-[7px] px-2.5 py-0.5 text-ink",e),...n})}function zn(e,n){const r=document.createElement("canvas");r.width=e,r.height=n;const a=r.getContext("2d");if(!a)throw new Error("canvas 2d context unavailable");return a.imageSmoothingEnabled=!1,[r,a]}function _e(e){const n=new ImageData(e.width,e.height),r=n.data,a=new Uint8Array(e.threads.length),t=new Uint8Array(e.threads.length),l=new Uint8Array(e.threads.length);e.threads.forEach((s,i)=>{a[i]=s.rgb[0],t[i]=s.rgb[1],l[i]=s.rgb[2]});for(let s=0;s<e.cells.length;s++){const i=e.cells[s];i<0||(r[s*4]=a[i],r[s*4+1]=t[i],r[s*4+2]=l[i],r[s*4+3]=255)}return n}function Un(e,n){const r=new ImageData(e.width,e.height),a=r.data;for(let t=0;t<e.cells.length;t++)e.cells[t]===n&&(a[t*4]=255,a[t*4+1]=255,a[t*4+2]=255,a[t*4+3]=255);return r}function Wn(e,n={}){const r=n.cellSize??14,a=n.grid??!0,t=n.legend??!0,l=n.heavyEvery??10,s=n.background??"#EBE2D7",i=e.width*r,u=e.height*r,g=Math.round(r*1.5),f=Math.max(1,Math.min(4,Math.floor(i/190))),c=Math.max(26,Math.round(r*1.6)),x=t?Math.ceil(e.threads.length/f):0,D=t?x*c+g*2:0,[b,d]=zn(i+g*2,u+g*2+D);d.fillStyle=s,d.fillRect(0,0,b.width,b.height);for(let m=0;m<e.height;m++)for(let p=0;p<e.width;p++){const B=e.cells[m*e.width+p];B<0||(d.fillStyle=e.threads[B].hex,d.fillRect(g+p*r,g+m*r,r,r))}if(a){d.lineWidth=1,d.strokeStyle="rgba(30,25,20,.35)",d.beginPath();for(let m=0;m<=e.width;m++){const p=g+m*r+.5;d.moveTo(p,g),d.lineTo(p,g+u)}for(let m=0;m<=e.height;m++){const p=g+m*r+.5;d.moveTo(g,p),d.lineTo(g+i,p)}d.stroke(),d.lineWidth=2,d.strokeStyle="rgba(20,16,12,.85)",d.beginPath();for(let m=0;m<=e.width;m+=l){const p=g+m*r;d.moveTo(p,g),d.lineTo(p,g+u)}for(let m=0;m<=e.height;m+=l){const p=g+m*r;d.moveTo(g,p),d.lineTo(g+i,p)}d.stroke()}if(t&&e.threads.length){const m=g*2+u;d.strokeStyle="rgba(20,16,12,.45)",d.lineWidth=2,d.beginPath(),d.moveTo(g,m-g/2),d.lineTo(b.width-g,m-g/2),d.stroke();const p=i/f,B=Math.round(c*.62);d.textBaseline="middle",d.font=`600 ${Math.round(c*.44)}px "Nunito Sans", system-ui, sans-serif`,e.threads.forEach((y,C)=>{const v=C%f,E=Math.floor(C/f),A=g+v*p,T=m+E*c+c/2;d.fillStyle=y.hex,d.fillRect(A,T-B/2,B,B),d.strokeStyle="rgba(20,16,12,.55)",d.lineWidth=1,d.strokeRect(A+.5,T-B/2+.5,B-1,B-1),d.fillStyle="#33261A";const H=`DMC ${y.num}`;d.fillText(H,A+B+8,T),d.fillStyle="rgba(51,38,26,.6)",d.fillText(`${e.counts[C]} pts`,A+B+8+d.measureText(H).width+10,T)})}return b}function qn(e){return new Promise((n,r)=>{e.toBlob(a=>a?n(a):r(new Error("toBlob failed")),"image/png")})}function Ee({label:e,hint:n,checked:r,onChange:a}){return o.jsxs("label",{className:"flex items-center justify-between gap-4 cursor-pointer",children:[o.jsxs("span",{children:[o.jsx("span",{className:"block text-[15px] font-bold text-bark",children:e}),o.jsx("span",{className:"block text-[13px] text-stone",children:n})]}),o.jsx(pe,{checked:r,onCheckedChange:a})]})}function Hn({pattern:e,onError:n}){const{t:r}=G(),[a,t]=h.useState(!0),[l,s]=h.useState(!0),[i,u]=h.useState("#EBE2D7"),[g,f]=h.useState(!1),c=async()=>{f(!0);try{const x=Wn(e,{cellSize:14,grid:a,legend:l,background:i}),D=await qn(x),b=URL.createObjectURL(D),d=document.createElement("a");d.href=b,d.download="BroderieDMC.png",document.body.appendChild(d),d.click(),d.remove(),URL.revokeObjectURL(b)}catch{n("download")}finally{f(!1)}};return o.jsxs("div",{className:"bg-blanc rounded-[18px] shadow-soft p-5 flex flex-col gap-4",children:[o.jsx(Oe,{children:r.converter.download.heading}),o.jsx(Ee,{label:r.converter.download.grid,hint:r.converter.download.gridHint,checked:a,onChange:t}),o.jsx(Ee,{label:r.converter.download.legend,hint:r.converter.download.legendHint,checked:l,onChange:s}),o.jsxs("label",{className:"flex items-center justify-between gap-4",children:[o.jsx("span",{className:"text-[15px] font-bold text-bark",children:r.converter.download.background}),o.jsxs("span",{className:"flex items-center gap-2.5",children:[o.jsx("span",{className:"font-mono text-xs text-stone",children:i.toUpperCase()}),o.jsx("input",{type:"color",value:i,onChange:x=>u(x.target.value),className:"w-12 h-9 rounded-[10px] border-[1.5px] border-edge-3 cursor-pointer bg-transparent p-0"})]})]}),o.jsxs(w,{size:"block",onClick:c,disabled:g,children:[o.jsx(dn,{}),g?r.converter.download.working:r.converter.download.button]}),o.jsx("p",{className:"font-hand text-sm text-sand text-center m-0",children:r.converter.download.note})]})}function Kn(e){const n=new Uint8Array(e.cells.length);for(let t=0;t<e.cells.length;t++)n[t]=e.cells[t]<0?0:e.cells[t]+1;let r="";const a=8192;for(let t=0;t<n.length;t+=a)r+=String.fromCharCode(...n.subarray(t,t+a));return btoa(r)}function $n(e,n=360){const r=_e(e),a=Math.max(1,Math.round(n/e.width)),t=document.createElement("canvas");t.width=e.width*a,t.height=e.height*a;const l=t.getContext("2d");if(!l)throw new Error("canvas 2d context unavailable");const s=document.createElement("canvas");return s.width=r.width,s.height=r.height,s.getContext("2d")?.putImageData(r,0,0),l.imageSmoothingEnabled=!1,l.drawImage(s,0,0,t.width,t.height),t.toDataURL("image/png")}async function Yn(e,n=1400){const r=await createImageBitmap(e),a=Math.min(1,n/Math.max(r.width,r.height)),t=Math.round(r.width*a),l=Math.round(r.height*a),s=document.createElement("canvas");s.width=t,s.height=l;const i=s.getContext("2d");if(!i)throw new Error("canvas 2d context unavailable");return i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high",i.drawImage(r,0,0,r.width,r.height,0,0,t,l),r.close(),s.toDataURL("image/jpeg",.82)}const Xn=["pets","portraits","flowers","landscapes","little","other"];function Jn({pattern:e,open:n,onClose:r,onPublished:a}){const{t}=G(),{user:l,signIn:s}=un(),[i,u]=h.useState(""),[g,f]=h.useState("other"),[c,x]=h.useState(null),[D,b]=h.useState(!1),[d,m]=h.useState(null),p=h.useRef(null),B=async v=>{m(null);try{x(await Yn(v))}catch{m(t.publish.tooBig)}},y=async()=>{if(!l)return s("/convert");b(!0),m(null);try{const{id:v}=await mn({title:i.trim(),category:g,width:e.width,height:e.height,cells:Kn(e),threadCodes:e.threads.map(E=>E.num),thumbnail:$n(e),photo:c??void 0});a(v)}catch(v){m(v instanceof fn&&v.status===413?t.publish.tooBig:t.publish.failed)}finally{b(!1)}},C=i.trim().length>=2&&!D;return o.jsx(ge,{open:n,onClose:r,title:t.publish.title,children:o.jsxs("div",{className:"flex flex-col gap-5",children:[o.jsx("p",{className:"text-[15px] text-clay m-0",children:t.publish.lead}),o.jsxs("div",{children:[o.jsx("label",{htmlFor:"post-title",className:"block text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2",children:t.publish.nameLabel}),o.jsx("input",{id:"post-title",value:i,onChange:v=>u(v.target.value),placeholder:t.publish.namePlaceholder,maxLength:80,className:"w-full text-base bg-linen border-[1.5px] border-edge-3 rounded-[14px] px-4 py-3 outline-none transition-colors focus:border-coral focus:bg-blanc"})]}),o.jsxs("div",{children:[o.jsx("div",{className:"text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2",children:t.publish.categoryLabel}),o.jsx("div",{className:"flex flex-wrap gap-2",children:Xn.map(v=>o.jsx(hn,{selected:g===v,onClick:()=>f(v),children:v==="other"?t.gallery.filters.all:t.gallery.filters[v]},v))})]}),o.jsxs("div",{children:[o.jsx("div",{className:"text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-1",children:t.publish.photoLabel}),o.jsx("p",{className:"text-[13px] text-stone m-0 mb-2",children:t.publish.photoHint}),c?o.jsxs("div",{className:"flex items-center gap-3",children:[o.jsx("img",{src:c,alt:"",className:"w-24 h-24 object-cover rounded-[12px] border-[1.5px] border-edge-3"}),o.jsxs("div",{className:"flex flex-col gap-2",children:[o.jsx(w,{variant:"secondary",size:"sm",onClick:()=>p.current?.click(),children:t.publish.photoChange}),o.jsx(w,{variant:"quiet",size:"sm",onClick:()=>x(null),children:t.publish.photoRemove})]})]}):o.jsx(w,{variant:"secondary",size:"sm",onClick:()=>p.current?.click(),children:t.publish.photoPick}),o.jsx("input",{ref:p,type:"file",accept:"image/*",className:"sr-only",onChange:v=>{const E=v.target.files?.[0];E&&B(E),v.target.value=""}})]}),d&&o.jsx("p",{role:"alert",className:"bg-coral-wash border-[1.5px] border-coral-edge text-coral-deeper rounded-[14px] px-4 py-3 text-sm m-0",children:d}),o.jsxs("div",{className:"flex gap-3 flex-wrap pt-1",children:[o.jsx(w,{className:"flex-1 min-w-[160px]",onClick:()=>void y(),disabled:!C,children:D?t.publish.working:l?t.publish.submit:t.publish.needSignIn}),o.jsx(w,{variant:"secondary",onClick:r,children:t.account.cancel})]})]})})}function ue(e,n){if(!e.type.startsWith("image/"))return;const r=new FileReader;r.onload=a=>{const t=a.target?.result;if(typeof t!="string")return;const l=new Image,s=(i,u)=>n({dataUrl:t,blob:e,name:e.name,width:i,height:u});l.onload=()=>s(l.naturalWidth,l.naturalHeight),l.onerror=()=>s(0,0),l.src=t},r.readAsDataURL(e)}function Qn({onPhoto:e}){const{t:n}=G(),[r,a]=h.useState(!1),t=h.useId(),l=h.useCallback(i=>{i.preventDefault(),i.stopPropagation(),a(!1);const u=i.dataTransfer.files?.[0];u&&ue(u,e)},[e]),s=i=>{i.preventDefault(),i.stopPropagation()};return o.jsxs("div",{className:P("relative aida [--aida-size:14px] [--aida-ink:.07] rounded-[22px] border-[2.5px] border-dashed","flex flex-col items-center gap-3 p-7 text-center transition-colors cursor-pointer",r?"border-coral bg-[#FBF5E9]":"border-coral-dash bg-[#F7F1E5] hover:border-coral"),onDragEnter:i=>{s(i),a(!0)},onDragOver:s,onDragLeave:i=>{s(i),a(!1)},onDrop:l,children:[o.jsx(gn,{size:40}),o.jsx("div",{className:"font-display font-semibold text-[20px] text-ink",children:n.converter.upload.drop}),o.jsxs("div",{className:"text-[15px] text-cocoa",children:[n.converter.upload.browseBefore,o.jsx("label",{htmlFor:t,className:"text-coral-deep font-bold underline decoration-dotted decoration-2 underline-offset-4 cursor-pointer",children:n.converter.upload.browse}),n.converter.upload.browseAfter]}),o.jsx("div",{className:"font-hand text-sm text-sand",children:n.converter.upload.hint}),o.jsx("input",{id:t,type:"file",accept:"image/*",className:"absolute inset-0 size-full opacity-0 cursor-pointer",onChange:i=>{const u=i.target.files?.[0];u&&ue(u,e),i.target.value=""}})]})}function Zn({onPhoto:e,className:n}){const{t:r}=G(),a=h.useRef(null);return o.jsxs(o.Fragment,{children:[o.jsx(w,{variant:"secondary",size:"sm",className:n,onClick:()=>a.current?.click(),children:r.converter.upload.replace}),o.jsx("input",{ref:a,type:"file",accept:"image/*",className:"sr-only",onChange:t=>{const l=t.target.files?.[0];l&&ue(l,e),t.target.value=""}})]})}const le=560,ke=2,et=24;function Se(e){const n=h.useRef(null);return h.useEffect(()=>{const r=n.current;!r||!e||(r.width=e.width,r.height=e.height,r.getContext("2d")?.putImageData(e,0,0))},[e]),n}function nt(e){const n=h.useRef(null),[r,a]=h.useState(le);h.useEffect(()=>{const s=n.current;if(!s)return;const i=()=>a(s.clientWidth||le);i();const u=new ResizeObserver(i);return u.observe(s),()=>u.disconnect()},[]);let t=Math.max(120,Math.min(r-et*2,le)),l=t*e;return e>ke&&(l=t*ke,t=l/e),{hostRef:n,width:Math.round(t),height:Math.round(l)}}function tt({pattern:e,original:n,highlightIndex:r,view:a,onViewChange:t,busy:l,onPhoto:s,aspect:i=1}){const{t:u}=G(),g=e?e.height/e.width:1/(i||1),{hostRef:f,width:c,height:x}=nt(g),D=Se(e?_e(e):null),b=Se(e&&r>=0?Un(e,r):null),d=a==="pattern"&&e,m=a==="original"&&n;return o.jsxs("div",{className:"flex flex-col gap-4 items-center",children:[o.jsx("div",{className:"flex bg-blanc border-[1.5px] border-edge-3 rounded-full p-1",children:["original","pattern"].map(p=>o.jsx("button",{type:"button",onClick:()=>t(p),disabled:p==="original"?!n:!e&&!l,"aria-pressed":a===p,className:P("font-display text-sm px-[18px] py-2 rounded-full cursor-pointer transition-colors disabled:cursor-not-allowed disabled:text-edge-5",a===p?"bg-ink text-blanc":"text-cocoa hover:text-coral-deep"),children:u.converter.canvas[p]},p))}),o.jsx("div",{ref:f,className:"w-full flex justify-center",children:o.jsx("div",{className:"aida [--aida-size:22.5px] [--aida-ink:.09] bg-aida rounded-[20px] p-6 shadow-[inset_0_2px_10px_rgba(83,63,42,.09)] shrink-0",children:d?o.jsxs("div",{className:"relative",style:{width:c,height:x},children:[o.jsx("canvas",{ref:D,"aria-label":u.converter.canvas.pattern,role:"img",style:{imageRendering:"pixelated",width:c,height:x},className:"block rounded-[6px]"}),r>=0&&o.jsx("canvas",{ref:b,"aria-hidden":"true",style:{imageRendering:"pixelated",width:c,height:x},className:"absolute inset-0 rounded-[6px] pointer-events-none mix-blend-lighten animate-mask-glow"})]}):m?o.jsx("img",{src:n,alt:u.converter.canvas.original,style:{width:c,height:x},className:"block rounded-[6px] object-contain"}):l?o.jsx("div",{className:"relative overflow-hidden rounded-[6px] bg-[#F3ECDC]/60",style:{width:c,height:x},role:"status","aria-label":u.converter.canvas.building,children:o.jsx("div",{className:"absolute inset-0 scale-150 bg-gradient-to-r from-transparent via-white/55 to-transparent animate-shine"})}):o.jsxs("div",{className:"flex flex-col items-center justify-center gap-4 text-center",style:{width:c,minHeight:320},children:[o.jsx("div",{className:"opacity-35",children:o.jsx(xn,{pixels:bn,cols:pn,size:14,radius:2})}),o.jsxs("div",{children:[o.jsx("div",{className:"font-display font-medium text-[17px] text-cocoa",children:u.converter.canvas.empty}),o.jsx("div",{className:"font-hand text-sm text-sand mt-1",children:u.converter.canvas.emptyHint})]})]})})}),a==="original"&&o.jsx(Zn,{onPhoto:s}),o.jsx("p",{className:"font-hand text-sm text-sand text-center m-0",children:l?u.converter.canvas.building:u.converter.canvas.note})]})}function rt({thread:e,threads:n,onClose:r,onReplace:a}){const{t}=G(),[l,s]=h.useState([]),[i,u]=h.useState(!1),[g,f]=h.useState(""),[c,x]=h.useState(null);if(h.useEffect(()=>{s([]),u(!1),f(""),x(null)},[e?.num]),!e)return null;const D=()=>{x(null),s(In(e.lab,3,n.map(d=>d.num)))},b=()=>{const d=g.trim();if(!d)return;x(null);const m=ae(d);m?n.some(p=>p.num===m.num)?x(t.converter.custom.already):(s(p=>[...p,m].slice(-3)),f(""),u(!1)):x(t.converter.custom.notFound)};return o.jsx(ge,{open:!0,onClose:r,title:t.converter.detail.title,className:"max-w-2xl",children:o.jsxs("div",{className:"flex flex-col gap-6",children:[o.jsxs("div",{className:"flex items-center gap-4",children:[o.jsx(te,{hex:e.hex,width:54,height:72,radius:12,className:"bobbin"}),o.jsxs("div",{className:"flex-1 min-w-0",children:[o.jsxs("span",{className:"inline-block text-sm font-extrabold bg-linen rounded-full px-3 py-1 mb-2",children:["DMC ",e.num]}),o.jsx("p",{className:"text-[18px] font-medium text-ink m-0",children:e.name}),o.jsx("p",{className:"text-sm text-stone font-mono m-0",children:e.hex})]})]}),l.length>0&&o.jsxs("div",{className:"border-t-2 border-dashed border-edge-2 pt-5",children:[o.jsx("h3",{className:"text-[13px] font-extrabold tracking-[.06em] uppercase text-sand mb-3.5 font-body",children:t.converter.detail.alternatives}),o.jsx("div",{className:"grid sm:grid-cols-3 gap-3",children:l.map(d=>o.jsxs("div",{className:"flex flex-col items-center gap-3 p-4 rounded-[16px] bg-linen border-[1.5px] border-edge-3",children:[o.jsx(te,{hex:d.hex,width:40,height:54,radius:10}),o.jsxs("div",{className:"text-center min-w-0 w-full",children:[o.jsxs("span",{className:"inline-block text-xs font-extrabold bg-blanc border-[1.5px] border-edge-3 rounded-full px-2 py-0.5 mb-1",children:["DMC ",d.num]}),o.jsx("p",{className:"text-sm font-medium truncate m-0",children:d.name}),o.jsx("p",{className:"text-xs text-stone font-mono m-0",children:d.hex})]}),o.jsx(w,{size:"sm",className:"w-full",onClick:()=>a(e,d),children:t.converter.detail.replace})]},d.num))})]}),i&&o.jsxs("div",{className:"border-t-2 border-dashed border-edge-2 pt-5",children:[o.jsx("label",{htmlFor:"thread-code",className:"block text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2",children:t.converter.custom.inputLabel}),o.jsxs("div",{className:"flex gap-3 flex-wrap",children:[o.jsx("input",{id:"thread-code",type:"text",value:g,onChange:d=>f(d.target.value),onKeyDown:d=>d.key==="Enter"&&b(),placeholder:"702",className:"flex-1 min-w-[140px] text-base bg-linen border-[1.5px] border-edge-3 rounded-[14px] px-4 py-3 outline-none transition-colors focus:border-coral focus:bg-blanc"}),o.jsx(w,{size:"sm",onClick:b,children:t.converter.custom.validate}),o.jsx(w,{variant:"secondary",size:"sm",onClick:()=>{u(!1),f("")},children:t.converter.custom.cancel})]})]}),c&&o.jsx("p",{className:"bg-coral-wash border-[1.5px] border-coral-edge text-coral-deeper rounded-[14px] px-4 py-3 text-sm m-0",children:c}),o.jsxs("div",{className:"flex gap-3 flex-wrap",children:[o.jsx(w,{className:"flex-1 min-w-[200px]",onClick:D,children:t.converter.detail.findSimilar}),o.jsx(w,{variant:"secondary",className:"flex-1 min-w-[200px]",onClick:()=>u(!0),children:t.converter.detail.setColor})]}),o.jsx("div",{className:"border-t-2 border-dashed border-edge-2 pt-5",children:o.jsx(w,{asChild:!0,variant:"secondary",size:"block",children:o.jsx("a",{href:`https://www.etsy.com/fr/search?q=DMC+${encodeURIComponent(e.num)}&ref=search_bar`,target:"_blank",rel:"noreferrer noopener",children:t.converter.detail.buy})})})]})})}const ot=7;function at({threads:e,onSelect:n,onHover:r}){const{t:a}=G();return o.jsxs("div",{className:"flex flex-col gap-3",children:[o.jsxs("div",{className:"flex justify-between items-baseline gap-2",children:[o.jsx("span",{className:"font-display font-medium text-[17px]",children:a.converter.threads.heading}),e.length>0&&o.jsx("span",{className:"text-[13px] font-extrabold text-cocoa bg-blanc border-[1.5px] border-edge-3 rounded-full px-3 py-1",children:a.converter.threads.count(e.length)})]}),e.length===0?o.jsx("p",{className:"text-sm text-stone m-0",children:a.converter.threads.empty}):o.jsxs("div",{className:"relative",children:[o.jsx("ul",{className:"flex flex-col gap-2 list-none p-0 m-0 max-h-[min(52vh,560px)] overflow-y-auto scroll-linen pr-1.5",children:e.map(t=>o.jsx("li",{children:o.jsxs("div",{className:"bg-blanc border-[1.5px] border-edge rounded-[14px] px-3 py-2.5 flex items-center gap-3 transition-colors hover:border-taupe",onMouseEnter:()=>r(t.num),onMouseLeave:()=>r(null),children:[o.jsx(te,{hex:t.hex}),o.jsxs("div",{className:"flex-1 min-w-0",children:[o.jsxs("div",{className:"text-[13.5px] font-extrabold",children:["DMC ",t.num]}),o.jsx("div",{className:"text-xs text-stone truncate",children:t.name})]}),o.jsx("button",{type:"button",onClick:()=>n(t),"aria-label":a.converter.threads.swapAria(t.num),className:"size-[30px] shrink-0 rounded-full bg-linen border-[1.5px] border-edge-3 flex items-center justify-center cursor-pointer transition-colors hover:border-coral",children:o.jsx(Dn,{})})]})},t.num))}),e.length>ot&&o.jsx("div",{"aria-hidden":"true",className:"pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-linen to-transparent"})]}),e.length>0&&o.jsx("p",{className:"text-[13px] leading-snug text-stone text-center m-0",children:a.converter.threads.hints})]})}function ze(e,[n,r]){return Math.min(r,Math.max(n,e))}var st=h.createContext(void 0);function it(e){const n=h.useContext(st);return e||n||"ltr"}function lt(e){const n=e+"CollectionProvider",[r,a]=xe(n),[t,l]=r(n,{collectionRef:{current:null},itemMap:new Map}),s=d=>{const{scope:m,children:p}=d,B=U.useRef(null),y=U.useRef(new Map).current;return o.jsx(t,{scope:m,itemMap:y,collectionRef:B,children:p})};s.displayName=n;const i=e+"CollectionSlot",u=ce(i),g=U.forwardRef((d,m)=>{const{scope:p,children:B}=d,y=l(i,p),C=N(m,y.collectionRef);return o.jsx(u,{ref:C,children:B})});g.displayName=i;const f=e+"CollectionItemSlot",c="data-radix-collection-item",x=ce(f),D=U.forwardRef((d,m)=>{const{scope:p,children:B,...y}=d,C=U.useRef(null),v=N(m,C),E=l(f,p);return U.useEffect(()=>(E.itemMap.set(C,{ref:C,...y}),()=>void E.itemMap.delete(C))),o.jsx(x,{[c]:"",ref:v,children:B})});D.displayName=f;function b(d){const m=l(e+"CollectionConsumer",d);return U.useCallback(()=>{const B=m.collectionRef.current;if(!B)return[];const y=Array.from(B.querySelectorAll(`[${c}]`));return Array.from(m.itemMap.values()).sort((E,A)=>y.indexOf(E.ref.current)-y.indexOf(A.ref.current))},[m.collectionRef,m.itemMap])}return[{Provider:s,Slot:g,ItemSlot:D},b,a]}var Ue=["PageUp","PageDown"],We=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],qe={"from-left":["Home","PageDown","ArrowDown","ArrowLeft"],"from-right":["Home","PageDown","ArrowDown","ArrowRight"],"from-bottom":["Home","PageDown","ArrowDown","ArrowLeft"],"from-top":["Home","PageDown","ArrowUp","ArrowLeft"]},$="Slider",[he,ct,dt]=lt($),[He,Xt]=xe($,[dt]),[ut,se]=He($),Ke=h.forwardRef((e,n)=>{const{name:r,min:a=0,max:t=100,step:l=1,orientation:s="horizontal",disabled:i=!1,minStepsBetweenThumbs:u=0,defaultValue:g=[a],value:f,onValueChange:c=()=>{},onValueCommit:x=()=>{},inverted:D=!1,form:b,...d}=e,m=h.useRef(new Set),p=h.useRef(0),y=s==="horizontal"?ht:mt,[C=[],v]=Me({prop:f,defaultProp:g,onChange:S=>{[...m.current][p.current]?.focus(),c(S)}}),E=h.useRef(C);function A(S){const M=bt(C,S);j(S,M)}function T(S){j(S,p.current)}function H(){const S=E.current[p.current];C[p.current]!==S&&x(C)}function j(S,M,{commit:Y}={commit:!1}){const K=yt(l),X=vt(Math.round((S-a)/l)*l+a,K),_=ze(X,[a,t]);v((R=[])=>{const L=xt(R,_,M);if(Bt(L,u*l)){p.current=L.indexOf(_);const Q=String(L)!==String(R);return Q&&Y&&x(L),Q?L:R}else return R})}return o.jsx(ut,{scope:e.__scopeSlider,name:r,disabled:i,min:a,max:t,valueIndexToChangeRef:p,thumbs:m.current,values:C,orientation:s,form:b,children:o.jsx(he.Provider,{scope:e.__scopeSlider,children:o.jsx(he.Slot,{scope:e.__scopeSlider,children:o.jsx(y,{"aria-disabled":i,"data-disabled":i?"":void 0,...d,ref:n,onPointerDown:W(d.onPointerDown,()=>{i||(E.current=C)}),min:a,max:t,inverted:D,onSlideStart:i?void 0:A,onSlideMove:i?void 0:T,onSlideEnd:i?void 0:H,onHomeKeyDown:()=>!i&&j(a,0,{commit:!0}),onEndKeyDown:()=>!i&&j(t,C.length-1,{commit:!0}),onStepKeyDown:({event:S,direction:M})=>{if(!i){const X=Ue.includes(S.key)||S.shiftKey&&We.includes(S.key)?10:1,_=p.current,R=C[_],L=l*X*M;j(R+L,_,{commit:!0})}}})})})})});Ke.displayName=$;var[$e,Ye]=He($,{startEdge:"left",endEdge:"right",size:"width",direction:1}),ht=h.forwardRef((e,n)=>{const{min:r,max:a,dir:t,inverted:l,onSlideStart:s,onSlideMove:i,onSlideEnd:u,onStepKeyDown:g,...f}=e,[c,x]=h.useState(null),D=N(n,y=>x(y)),b=h.useRef(void 0),d=it(t),m=d==="ltr",p=m&&!l||!m&&l;function B(y){const C=b.current||c.getBoundingClientRect(),v=[0,C.width],A=De(v,p?[r,a]:[a,r]);return b.current=C,A(y-C.left)}return o.jsx($e,{scope:e.__scopeSlider,startEdge:p?"left":"right",endEdge:p?"right":"left",direction:p?1:-1,size:"width",children:o.jsx(Xe,{dir:d,"data-orientation":"horizontal",...f,ref:D,style:{...f.style,"--radix-slider-thumb-transform":"translateX(-50%)"},onSlideStart:y=>{const C=B(y.clientX);s?.(C)},onSlideMove:y=>{const C=B(y.clientX);i?.(C)},onSlideEnd:()=>{b.current=void 0,u?.()},onStepKeyDown:y=>{const v=qe[p?"from-left":"from-right"].includes(y.key);g?.({event:y,direction:v?-1:1})}})})}),mt=h.forwardRef((e,n)=>{const{min:r,max:a,inverted:t,onSlideStart:l,onSlideMove:s,onSlideEnd:i,onStepKeyDown:u,...g}=e,f=h.useRef(null),c=N(n,f),x=h.useRef(void 0),D=!t;function b(d){const m=x.current||f.current.getBoundingClientRect(),p=[0,m.height],y=De(p,D?[a,r]:[r,a]);return x.current=m,y(d-m.top)}return o.jsx($e,{scope:e.__scopeSlider,startEdge:D?"bottom":"top",endEdge:D?"top":"bottom",size:"height",direction:D?1:-1,children:o.jsx(Xe,{"data-orientation":"vertical",...g,ref:c,style:{...g.style,"--radix-slider-thumb-transform":"translateY(50%)"},onSlideStart:d=>{const m=b(d.clientY);l?.(m)},onSlideMove:d=>{const m=b(d.clientY);s?.(m)},onSlideEnd:()=>{x.current=void 0,i?.()},onStepKeyDown:d=>{const p=qe[D?"from-bottom":"from-top"].includes(d.key);u?.({event:d,direction:p?-1:1})}})})}),Xe=h.forwardRef((e,n)=>{const{__scopeSlider:r,onSlideStart:a,onSlideMove:t,onSlideEnd:l,onHomeKeyDown:s,onEndKeyDown:i,onStepKeyDown:u,...g}=e,f=se($,r);return o.jsx(q.span,{...g,ref:n,onKeyDown:W(e.onKeyDown,c=>{c.key==="Home"?(s(c),c.preventDefault()):c.key==="End"?(i(c),c.preventDefault()):Ue.concat(We).includes(c.key)&&(u(c),c.preventDefault())}),onPointerDown:W(e.onPointerDown,c=>{const x=c.target;x.setPointerCapture(c.pointerId),c.preventDefault(),f.thumbs.has(x)?x.focus():a(c)}),onPointerMove:W(e.onPointerMove,c=>{c.target.hasPointerCapture(c.pointerId)&&t(c)}),onPointerUp:W(e.onPointerUp,c=>{const x=c.target;x.hasPointerCapture(c.pointerId)&&(x.releasePointerCapture(c.pointerId),l(c))})})}),Je="SliderTrack",Qe=h.forwardRef((e,n)=>{const{__scopeSlider:r,...a}=e,t=se(Je,r);return o.jsx(q.span,{"data-disabled":t.disabled?"":void 0,"data-orientation":t.orientation,...a,ref:n})});Qe.displayName=Je;var me="SliderRange",Ze=h.forwardRef((e,n)=>{const{__scopeSlider:r,...a}=e,t=se(me,r),l=Ye(me,r),s=h.useRef(null),i=N(n,s),u=t.values.length,g=t.values.map(x=>tn(x,t.min,t.max)),f=u>1?Math.min(...g):0,c=100-Math.max(...g);return o.jsx(q.span,{"data-orientation":t.orientation,"data-disabled":t.disabled?"":void 0,...a,ref:i,style:{...e.style,[l.startEdge]:f+"%",[l.endEdge]:c+"%"}})});Ze.displayName=me;var fe="SliderThumb",en=h.forwardRef((e,n)=>{const r=ct(e.__scopeSlider),[a,t]=h.useState(null),l=N(n,i=>t(i)),s=h.useMemo(()=>a?r().findIndex(i=>i.ref.current===a):-1,[r,a]);return o.jsx(ft,{...e,ref:l,index:s})}),ft=h.forwardRef((e,n)=>{const{__scopeSlider:r,index:a,name:t,...l}=e,s=se(fe,r),i=Ye(fe,r),[u,g]=h.useState(null),f=N(n,B=>g(B)),c=u?s.form||!!u.closest("form"):!0,x=Ne(u),D=s.values[a],b=D===void 0?0:tn(D,s.min,s.max),d=pt(a,s.values.length),m=x?.[i.size],p=m?Dt(m,b,i.direction):0;return h.useEffect(()=>{if(u)return s.thumbs.add(u),()=>{s.thumbs.delete(u)}},[u,s.thumbs]),o.jsxs("span",{style:{transform:"var(--radix-slider-thumb-transform)",position:"absolute",[i.startEdge]:`calc(${b}% + ${p}px)`},children:[o.jsx(he.ItemSlot,{scope:e.__scopeSlider,children:o.jsx(q.span,{role:"slider","aria-label":e["aria-label"]||d,"aria-valuemin":s.min,"aria-valuenow":D,"aria-valuemax":s.max,"aria-orientation":s.orientation,"data-orientation":s.orientation,"data-disabled":s.disabled?"":void 0,tabIndex:s.disabled?void 0:0,...l,ref:f,style:D===void 0?{display:"none"}:e.style,onFocus:W(e.onFocus,()=>{s.valueIndexToChangeRef.current=a})})}),c&&o.jsx(nn,{name:t??(s.name?s.name+(s.values.length>1?"[]":""):void 0),form:s.form,value:D},a)]})});en.displayName=fe;var gt="RadioBubbleInput",nn=h.forwardRef(({__scopeSlider:e,value:n,...r},a)=>{const t=h.useRef(null),l=N(t,a),s=Le(n);return h.useEffect(()=>{const i=t.current;if(!i)return;const u=window.HTMLInputElement.prototype,f=Object.getOwnPropertyDescriptor(u,"value").set;if(s!==n&&f){const c=new Event("input",{bubbles:!0});f.call(i,n),i.dispatchEvent(c)}},[s,n]),o.jsx(q.input,{style:{display:"none"},...r,ref:l,defaultValue:n})});nn.displayName=gt;function xt(e=[],n,r){const a=[...e];return a[r]=n,a.sort((t,l)=>t-l)}function tn(e,n,r){const l=100/(r-n)*(e-n);return ze(l,[0,100])}function pt(e,n){return n>2?`Value ${e+1} of ${n}`:n===2?["Minimum","Maximum"][e]:void 0}function bt(e,n){if(e.length===1)return 0;const r=e.map(t=>Math.abs(t-n)),a=Math.min(...r);return r.indexOf(a)}function Dt(e,n,r){const a=e/2,l=De([0,50],[0,a]);return(a-l(n)*r)*r}function Ct(e){return e.slice(0,-1).map((n,r)=>e[r+1]-n)}function Bt(e,n){if(n>0){const r=Ct(e);return Math.min(...r)>=n}return!0}function De(e,n){return r=>{if(e[0]===e[1]||n[0]===n[1])return n[0];const a=(n[1]-n[0])/(e[1]-e[0]);return n[0]+a*(r-e[0])}}function yt(e){return(String(e).split(".")[1]||"").length}function vt(e,n){const r=Math.pow(10,n);return Math.round(e*r)/r}var wt=Ke,Et=Qe,kt=Ze,St=en;function Ae({className:e,...n}){return o.jsxs(wt,{className:P("relative flex w-full touch-none select-none items-center h-[26px] cursor-pointer data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",e),...n,children:[o.jsx(Et,{className:"relative h-2 w-full grow overflow-hidden rounded-full bg-aida",children:o.jsx(kt,{className:"absolute h-full bg-coral"})}),o.jsx(St,{className:"block size-[26px] rounded-full border-[3px] border-coral bg-blanc shadow-[0_2px_8px_rgba(83,63,42,.18)] transition-transform hover:scale-105 focus-visible:scale-105 cursor-grab active:cursor-grabbing"})]})}function At(e){let n=e>>>0;return()=>{n=n+1831565813>>>0;let r=n;return r=Math.imul(r^r>>>15,r|1),r^=r+Math.imul(r^r>>>7,r|61),((r^r>>>14)>>>0)/4294967296}}const Ft=60,jt=42;function Mt(e,n){const r=e.length/3;if(r===0||n<=0)return{centroids:new Float64Array(0),labels:new Int32Array(0)};const a=Lt(e,r);n=Math.min(n,a);const t=At(jt),l=Nt(e,r,n,t),s=new Int32Array(r),i=new Float64Array(n*3),u=new Int32Array(n);for(let g=0;g<Ft;g++){let f=!1;for(let c=0;c<r;c++){const x=e[c*3],D=e[c*3+1],b=e[c*3+2];let d=0,m=1/0;for(let p=0;p<n;p++){const B=x-l[p*3],y=D-l[p*3+1],C=b-l[p*3+2],v=B*B+y*y+C*C;v<m&&(m=v,d=p)}s[c]!==d&&(s[c]=d,f=!0)}i.fill(0),u.fill(0);for(let c=0;c<r;c++){const x=s[c];i[x*3]+=e[c*3],i[x*3+1]+=e[c*3+1],i[x*3+2]+=e[c*3+2],u[x]++}for(let c=0;c<n;c++)u[c]!==0&&(l[c*3]=i[c*3]/u[c],l[c*3+1]=i[c*3+1]/u[c],l[c*3+2]=i[c*3+2]/u[c]);if(!f)break}return{centroids:l,labels:s}}function Lt(e,n){const r=new Set;for(let a=0;a<n;a++)if(r.add(`${e[a*3]|0},${e[a*3+1]|0},${e[a*3+2]|0}`),r.size>64)return r.size;return r.size}function Nt(e,n,r,a){const t=new Float64Array(r*3),l=Math.floor(a()*n);t[0]=e[l*3],t[1]=e[l*3+1],t[2]=e[l*3+2];const s=new Float64Array(n).fill(1/0);for(let i=1;i<r;i++){let u=0;for(let c=0;c<n;c++){const x=e[c*3]-t[(i-1)*3],D=e[c*3+1]-t[(i-1)*3+1],b=e[c*3+2]-t[(i-1)*3+2],d=x*x+D*D+b*b;d<s[c]&&(s[c]=d),u+=s[c]}let g=a()*u,f=n-1;for(let c=0;c<n;c++)if(g-=s[c],g<=0){f=c;break}t[i*3]=e[f*3],t[i*3+1]=e[f*3+1],t[i*3+2]=e[f*3+2]}return t}const Pt=150;async function Fe(e,n){const{width:r,height:a,data:t}=await Gt(e,n.stitchWidth),l=r*a,s=new Int16Array(l).fill(-1),i=new Int32Array(l);let u=0;for(let m=0;m<l;m++)t[m*4+3]>=Pt&&(i[u++]=m);if(u===0)return{width:r,height:a,cells:s,threads:[],counts:[]};const g=new Float64Array(u*3);for(let m=0;m<u;m++){const p=i[m]*4,B=Ie(t[p],t[p+1],t[p+2]);g[m*3]=B[0],g[m*3+1]=B[1],g[m*3+2]=B[2]}const{centroids:f,labels:c}=Mt(g,n.colorCount),x=f.length/3,D=Array.from({length:x},(m,p)=>[f[p*3],f[p*3+1],f[p*3+2]]),b=Tn(D,n.palette),d=new Array(x).fill(0);for(let m=0;m<u;m++)s[i[m]]=c[m],d[c[m]]++;return Vt({width:r,height:a,cells:s,threads:b,counts:d})}async function Gt(e,n){const r=await createImageBitmap(e),a=Math.max(1,Math.round(n)),t=Math.max(1,Math.round(a*r.height/r.width)),s=new OffscreenCanvas(a,t).getContext("2d",{willReadFrequently:!0});if(!s)throw r.close(),new Error("canvas 2d context unavailable");return s.imageSmoothingEnabled=!0,s.imageSmoothingQuality="high",s.drawImage(r,0,0,r.width,r.height,0,0,a,t),r.close(),{width:a,height:t,data:s.getImageData(0,0,a,t).data}}function Rt(e){return{width:e.width,height:e.height,cells:e.cells,threads:e.threadNums.map(n=>ae(n)).filter(n=>!!n),counts:e.counts}}function Vt(e){const n=e.threads.map((t,l)=>({i:l,key:Tt(t.rgb)})).sort((t,l)=>t.key[0]-l.key[0]||t.key[1]-l.key[1]||t.key[2]-l.key[2]).map(t=>t.i),r=new Int16Array(e.threads.length);n.forEach((t,l)=>{r[t]=l});const a=new Int16Array(e.cells.length);for(let t=0;t<e.cells.length;t++)a[t]=e.cells[t]<0?-1:r[e.cells[t]];return{...e,cells:a,threads:n.map(t=>e.threads[t]),counts:n.map(t=>e.counts[t])}}function Tt(e){const[n,r,a]=e.map(u=>u/255),t=Math.max(n,r,a),l=Math.min(n,r,a),s=t-l;let i=0;return s!==0&&(t===n?i=(r-a)/s%6:t===r?i=(a-n)/s+2:i=(n-r)/s+4,i/=6,i<0&&(i+=1)),[i,t===0?0:s/t,t]}let O=null,ne=!1,It=1;const J=new Map;function Ot(){if(ne)return null;if(O)return O;try{return O=new Worker(new URL("/assets/convert.worker-PwnMntfh.js",import.meta.url),{type:"module"}),O.onmessage=e=>{J.get(e.data.id)?.(e.data),J.delete(e.data.id)},O.onerror=()=>{ne=!0;for(const[e,n]of J)n({id:e,ok:!1,error:"worker failed"});J.clear(),O?.terminate(),O=null},O}catch{return ne=!0,null}}async function _t(e,n){const r=Ot();if(!r){if(typeof OffscreenCanvas>"u")throw new Error("this browser cannot render patterns (no OffscreenCanvas)");return Fe(e,n)}const a=It++,t={id:a,photo:e,stitchWidth:n.stitchWidth,colorCount:n.colorCount,paletteNums:n.palette?.map(s=>s.num)},l=await new Promise(s=>{J.set(a,s),r.postMessage(t)});if(!l.ok){if(ne&&typeof OffscreenCanvas<"u")return Fe(e,n);throw new Error(l.error)}return Rt(l.pattern)}const zt="picture-to-dmc",Ut=1,re="session",Ce="current";function Wt(){return new Promise((e,n)=>{const r=indexedDB.open(zt,Ut);r.onupgradeneeded=()=>{const a=r.result;a.objectStoreNames.contains(re)||a.createObjectStore(re)},r.onsuccess=()=>e(r.result),r.onerror=()=>n(r.error)})}async function Be(e,n){try{const r=await Wt();return await new Promise((a,t)=>{const l=r.transaction(re,e),s=n(l.objectStore(re));s.onsuccess=()=>a(s.result),s.onerror=()=>t(s.error),l.oncomplete=()=>r.close()})}catch{return null}}function qt(e){return Be("readwrite",n=>n.put({...e,savedAt:Date.now()},Ce))}function Ht(){return Be("readonly",e=>e.get(Ce))}function Kt(){return Be("readwrite",e=>e.delete(Ce))}function Jt(){const{t:e}=G(),[n,r]=h.useState(null),[a,t]=h.useState(50),[l,s]=h.useState(8),[i,u]=h.useState(!0),[g,f]=h.useState(!1),[c,x]=h.useState([]),[D,b]=h.useState(!1),[d,m]=h.useState(null),[p,B]=h.useState(!1),[y,C]=h.useState(null),[v,E]=h.useState("pattern"),[A,T]=h.useState(null),[H,j]=h.useState(null),[S,M]=h.useState(!1),[Y,K]=h.useState(!1),[X,_]=h.useState(!1),R=h.useCallback(k=>{r(k),E("original")},[]),L=h.useMemo(()=>n&&n.width>0?Math.round(a*n.height/n.width):null,[n,a]);h.useEffect(()=>{let k=!1;return Ht().then(async F=>{if(k||!F)return M(!0);try{const V=URL.createObjectURL(F.photo),I=new Image;if(await new Promise(z=>{I.onload=()=>z(),I.onerror=()=>z(),I.src=V}),k)return;r({dataUrl:V,blob:F.photo,width:I.naturalWidth,height:I.naturalHeight}),t(F.stitchWidth),s(F.colorCount),u(F.outline),f(F.useCustomPalette),x(F.customThreadNums.map(ae).filter(z=>!!z)),E("original")}finally{k||M(!0)}}),()=>{k=!0}},[]);const Q=h.useCallback(async()=>{if(!n)return C("noImage");if(g&&c.length<l)return C("notEnoughCustom");B(!0),C(null),m(null),E("pattern");try{const k=await _t(n.blob,{stitchWidth:a,colorCount:l,palette:g?c:void 0});m(k),qt({photo:n.blob,photoName:n.name??"photo",stitchWidth:a,colorCount:l,outline:i,useCustomPalette:g,customThreadNums:c.map(F=>F.num),substitutions:{}})}catch(k){console.error(k),C("generic")}finally{B(!1)}},[n,g,c,l,a,i]),rn=h.useCallback((k,F)=>{m(V=>{if(!V)return V;const I=V.threads.findIndex(sn=>sn.num===k.num);if(I<0)return V;const z=[...V.threads];return z[I]=F,{...V,threads:z}}),j(F)},[]),on=()=>{r(null),m(null),C(null),j(null),Kt()},an=h.useMemo(()=>d&&A?d.threads.findIndex(k=>k.num===A):-1,[d,A]),Z=h.useRef(null);return h.useEffect(()=>{Z.current&&Z.current!==n?.dataUrl&&URL.revokeObjectURL(Z.current),Z.current=n?.dataUrl?.startsWith("blob:")?n.dataUrl:null},[n]),o.jsxs("div",{className:"mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 py-10",children:[o.jsxs("div",{className:"flex items-end justify-between gap-4 flex-wrap mb-7",children:[o.jsxs("div",{children:[o.jsx("h1",{className:"text-[30px] sm:text-[34px] m-0",children:e.converter.title}),o.jsx("p",{className:"text-[15.5px] text-clay m-0 mt-1",children:e.converter.lead})]}),(n||d)&&o.jsx(w,{variant:"quiet",onClick:on,children:e.converter.startOver})]}),y&&o.jsxs("div",{role:"alert",className:"mb-6 flex items-start gap-4 bg-coral-wash border-2 border-dashed border-coral-edge rounded-[16px] px-5 py-4",children:[o.jsx("p",{className:"flex-1 text-[15px] text-coral-deeper m-0",children:e.converter.errors[y]}),o.jsx("button",{type:"button",onClick:()=>C(null),className:"text-coral-deep text-sm font-bold cursor-pointer hover:text-coral-deeper shrink-0",children:e.converter.errors.dismiss})]}),o.jsxs("div",{className:"grid gap-7 lg:grid-cols-[296px_1fr] xl:grid-cols-[296px_1fr_312px]",children:[o.jsxs("div",{className:"flex flex-col gap-4",children:[o.jsxs(ye,{children:[o.jsx(Oe,{className:"mb-4",children:e.converter.settings.heading}),o.jsxs("div",{className:"flex justify-between items-baseline mb-2",children:[o.jsx(ve,{children:e.converter.size.stitchesWide}),o.jsx(we,{children:a})]}),o.jsx(Ae,{value:[a],onValueChange:([k])=>t(k),min:20,max:200,step:2,"aria-label":e.converter.size.stitchesWide}),o.jsxs("div",{className:"flex justify-between text-xs text-sand mt-1.5 mb-5",children:[o.jsx("span",{children:"20"}),o.jsx("span",{children:"200"})]}),o.jsxs("div",{className:"flex justify-between items-baseline mb-2",children:[o.jsx(ve,{children:e.converter.colors.threadColors}),o.jsx(we,{children:l})]}),o.jsx(Ae,{value:[l],onValueChange:([k])=>s(k),min:2,max:20,step:1,"aria-label":e.converter.colors.threadColors}),o.jsxs("div",{className:"flex justify-between text-xs text-sand mt-1.5 mb-4",children:[o.jsx("span",{children:"2"}),o.jsx("span",{children:"20"})]}),o.jsxs("label",{className:"flex items-center justify-between gap-3 cursor-pointer pt-4 border-t-2 border-dashed border-edge",children:[o.jsxs("span",{children:[o.jsx("span",{className:"block text-sm font-bold text-bark",children:e.converter.colors.outline}),o.jsx("span",{className:"block text-[13px] text-stone",children:i?e.converter.colors.outlineOn:e.converter.colors.outlineOff})]}),o.jsx(pe,{checked:i,onCheckedChange:u})]}),o.jsx("p",{className:"bg-linen rounded-[12px] px-3.5 py-2.5 text-[13.5px] text-clay m-0 mt-4",children:L?e.converter.size.note(a,L):e.converter.size.unknown})]}),o.jsxs(ye,{className:"flex flex-col gap-3",children:[o.jsxs("div",{children:[o.jsx("span",{className:"block font-display font-medium text-[15px] text-ink",children:e.converter.custom.heading}),o.jsx("span",{className:"block text-[13px] text-stone leading-snug",children:g?e.converter.custom.toggleOn:e.converter.custom.toggleOff})]}),o.jsxs(w,{variant:"secondary",size:"sm",className:"w-full",onClick:()=>b(!0),children:[e.converter.custom.open,c.length>0&&` (${c.length})`]})]}),o.jsx(w,{size:"block",onClick:Q,disabled:p||!n,children:p?e.converter.canvas.building:d?e.converter.recreate:e.converter.create})]}),o.jsxs("div",{className:"flex flex-col gap-6 lg:border-x-2 lg:border-dashed lg:border-edge-2 lg:px-7",children:[n?o.jsx(tt,{pattern:d,original:n.dataUrl,highlightIndex:an,view:v,onViewChange:E,busy:p,onPhoto:R,aspect:n.width>0?n.width/n.height:1}):o.jsxs("div",{className:"flex flex-col gap-4",children:[o.jsx(Qn,{onPhoto:R}),o.jsx("p",{className:"font-hand text-sm text-sand text-center m-0",children:S?e.converter.canvas.note:e.converter.canvas.building})]}),d&&d.threads.length>0&&o.jsxs(o.Fragment,{children:[o.jsx(Hn,{pattern:d,onError:k=>C(k)}),X?o.jsx("p",{className:"font-hand text-[15px] text-nile-deep text-center m-0",children:e.publish.done}):o.jsx(w,{variant:"secondary",size:"block",onClick:()=>K(!0),children:e.publish.open})]})]}),o.jsx("div",{className:"lg:col-span-2 xl:col-span-1",children:o.jsx(at,{threads:d?.threads??[],onSelect:j,onHover:T})})]}),o.jsx(_n,{open:D,onClose:()=>b(!1),enabled:g,onEnabledChange:f,threads:c,onThreadsChange:x}),d&&o.jsx(Jn,{pattern:d,open:Y,onClose:()=>K(!1),onPublished:()=>{K(!1),_(!0)}}),o.jsx(rt,{thread:H,threads:d?.threads??[],onClose:()=>j(null),onReplace:rn})]})}export{Jt as default};
