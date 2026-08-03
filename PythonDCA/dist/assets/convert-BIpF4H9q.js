import{r as dn,j as o,c as V,u as P,a as f,R as un,b as me,d as R,B as w,D as hn,e as mn,P as ne,p as fn,A as xn,S as gn,f as pn,g as bn,h as Dn,i as H,C as vn}from"./index-hKRU-5_e.js";dn();function oe({hex:e,width:n=28,height:t=38,radius:a=8,className:r}){return o.jsx("div",{className:V("bobbin-sm shrink-0",r),style:{width:n,height:t,borderRadius:a,background:e},"aria-hidden":"true"})}function be({open:e,onClose:n,title:t,children:a,className:r}){const{t:l}=P();return f.useEffect(()=>{if(!e)return;const s=h=>{h.key==="Escape"&&n()};document.addEventListener("keydown",s);const i=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{document.removeEventListener("keydown",s),document.body.style.overflow=i}},[e,n]),e?o.jsx("div",{className:"fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm flex items-center justify-center p-4",onClick:n,children:o.jsxs("div",{role:"dialog","aria-modal":"true","aria-label":t,onClick:s=>s.stopPropagation(),className:V("bg-blanc rounded-[24px] shadow-screen w-full max-w-xl max-h-[90vh] overflow-y-auto scroll-linen animate-stitch-in",r),children:[o.jsxs("div",{className:"flex items-center justify-between gap-4 p-6 border-b-2 border-dashed border-edge-2 sticky top-0 bg-blanc rounded-t-[24px]",children:[o.jsx("h2",{className:"text-xl m-0",children:t}),o.jsx("button",{type:"button",onClick:n,"aria-label":l.converter.detail.close,className:"size-9 shrink-0 rounded-full bg-linen text-cocoa flex items-center justify-center cursor-pointer transition-colors hover:bg-coral hover:text-blanc",children:"✕"})]}),o.jsx("div",{className:"p-6",children:a})]})}):null}function W(e,n,{checkForDefaultPrevented:t=!0}={}){return function(r){if(e?.(r),t===!1||!r.defaultPrevented)return n?.(r)}}function De(e,n=[]){let t=[];function a(l,s){const i=f.createContext(s),h=t.length;t=[...t,s];const b=d=>{const{scope:x,children:D,...C}=d,p=x?.[e]?.[h]||i,c=f.useMemo(()=>C,Object.values(C));return o.jsx(p.Provider,{value:c,children:D})};b.displayName=l+"Provider";function u(d,x){const D=x?.[e]?.[h]||i,C=f.useContext(D);if(C)return C;if(s!==void 0)return s;throw new Error(`\`${d}\` must be used within \`${l}\``)}return[b,u]}const r=()=>{const l=t.map(s=>f.createContext(s));return function(i){const h=i?.[e]||l;return f.useMemo(()=>({[`__scope${e}`]:{...i,[e]:h}}),[i,h])}};return r.scopeName=e,[a,Cn(r,...n)]}function Cn(...e){const n=e[0];if(e.length===1)return n;const t=()=>{const a=e.map(r=>({useScope:r(),scopeName:r.scopeName}));return function(l){const s=a.reduce((i,{useScope:h,scopeName:b})=>{const d=h(l)[`__scope${b}`];return{...i,...d}},{});return f.useMemo(()=>({[`__scope${n.scopeName}`]:s}),[s])}};return t.scopeName=n.scopeName,t}var Me=globalThis?.document?f.useLayoutEffect:()=>{},Bn=un[" useInsertionEffect ".trim().toString()]||Me;function Le({prop:e,defaultProp:n,onChange:t=()=>{},caller:a}){const[r,l,s]=yn({defaultProp:n,onChange:t}),i=e!==void 0,h=i?e:r;{const u=f.useRef(e!==void 0);f.useEffect(()=>{const d=u.current;d!==i&&console.warn(`${a} is changing from ${d?"controlled":"uncontrolled"} to ${i?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),u.current=i},[i,a])}const b=f.useCallback(u=>{if(i){const d=wn(u)?u(e):u;d!==e&&s.current?.(d)}else l(u)},[i,e,l,s]);return[h,b]}function yn({defaultProp:e,onChange:n}){const[t,a]=f.useState(e),r=f.useRef(t),l=f.useRef(n);return Bn(()=>{l.current=n},[n]),f.useEffect(()=>{r.current!==t&&(l.current?.(t),r.current=t)},[t,r]),[t,a,l]}function wn(e){return typeof e=="function"}function Ne(e){const n=f.useRef({value:e,previous:e});return f.useMemo(()=>(n.current.value!==e&&(n.current.previous=n.current.value,n.current.value=e),n.current.previous),[e])}function Pe(e){const[n,t]=f.useState(void 0);return Me(()=>{if(e){t({width:e.offsetWidth,height:e.offsetHeight});const a=new ResizeObserver(r=>{if(!Array.isArray(r)||!r.length)return;const l=r[0];let s,i;if("borderBoxSize"in l){const h=l.borderBoxSize,b=Array.isArray(h)?h[0]:h;s=b.inlineSize,i=b.blockSize}else s=e.offsetWidth,i=e.offsetHeight;t({width:s,height:i})});return a.observe(e,{box:"border-box"}),()=>a.unobserve(e)}else t(void 0)},[e]),n}var En=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],q=En.reduce((e,n)=>{const t=me(`Primitive.${n}`),a=f.forwardRef((r,l)=>{const{asChild:s,...i}=r,h=s?t:n;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),o.jsx(h,{...i,ref:l})});return a.displayName=`Primitive.${n}`,{...e,[n]:a}},{}),ie="Switch",[kn,er]=De(ie),[Sn,An]=kn(ie),Ge=f.forwardRef((e,n)=>{const{__scopeSwitch:t,name:a,checked:r,defaultChecked:l,required:s,disabled:i,value:h="on",onCheckedChange:b,form:u,...d}=e,[x,D]=f.useState(null),C=R(n,v=>D(v)),p=f.useRef(!1),c=x?u||!!x.closest("form"):!0,[m,g]=Le({prop:r,defaultProp:l??!1,onChange:b,caller:ie});return o.jsxs(Sn,{scope:t,checked:m,disabled:i,children:[o.jsx(q.button,{type:"button",role:"switch","aria-checked":m,"aria-required":s,"data-state":Ie(m),"data-disabled":i?"":void 0,disabled:i,value:h,...d,ref:C,onClick:W(e.onClick,v=>{g(B=>!B),c&&(p.current=v.isPropagationStopped(),p.current||v.stopPropagation())})}),c&&o.jsx(Te,{control:x,bubbles:!p.current,name:a,value:h,checked:m,required:s,disabled:i,form:u,style:{transform:"translateX(-100%)"}})]})});Ge.displayName=ie;var Re="SwitchThumb",Ve=f.forwardRef((e,n)=>{const{__scopeSwitch:t,...a}=e,r=An(Re,t);return o.jsx(q.span,{"data-state":Ie(r.checked),"data-disabled":r.disabled?"":void 0,...a,ref:n})});Ve.displayName=Re;var jn="SwitchBubbleInput",Te=f.forwardRef(({__scopeSwitch:e,control:n,checked:t,bubbles:a=!0,...r},l)=>{const s=f.useRef(null),i=R(s,l),h=Ne(t),b=Pe(n);return f.useEffect(()=>{const u=s.current;if(!u)return;const d=window.HTMLInputElement.prototype,D=Object.getOwnPropertyDescriptor(d,"checked").set;if(h!==t&&D){const C=new Event("click",{bubbles:a});D.call(u,t),u.dispatchEvent(C)}},[h,t,a]),o.jsx("input",{type:"checkbox","aria-hidden":!0,defaultChecked:t,...r,tabIndex:-1,ref:i,style:{...r.style,...b,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})});Te.displayName=jn;function Ie(e){return e?"checked":"unchecked"}var Fn=Ge,Mn=Ve;function ve({className:e,...n}){return o.jsx(Fn,{className:V("peer inline-flex h-[30px] w-[52px] shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors","data-[state=checked]:bg-nile data-[state=unchecked]:bg-edge-5","disabled:cursor-not-allowed disabled:opacity-50",e),...n,children:o.jsx(Mn,{className:"pointer-events-none block size-6 rounded-full bg-blanc shadow-[0_1px_4px_rgba(0,0,0,.2)] transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0"})})}const Ln=`Ecru|Ecru/off-white|FFF7E7
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
S3820|Satin - Straw|DBA53E`,te=new Float64Array(256);for(let e=0;e<256;e++){const n=e/255;te[e]=n<=.04045?n/12.92:((n+.055)/1.055)**2.4}const Nn=.95047,Pn=1.08883,Gn=.008856,Rn=7.787;function de(e){return e>Gn?Math.cbrt(e):Rn*e+16/116}function Oe(e,n,t){const a=te[e<0?0:e>255?255:e|0],r=te[n<0?0:n>255?255:n|0],l=te[t<0?0:t>255?255:t|0],s=de((a*.4124+r*.3576+l*.1805)/Nn),i=de(a*.2126+r*.7152+l*.0722),h=de((a*.0193+r*.1192+l*.9505)/Pn);return[116*i-16,500*(s-i),200*(i-h)]}function ae(e,n){const t=e[0]-n[0],a=e[1]-n[1],r=e[2]-n[2];return t*t+a*a+r*r}function Vn(e){const n=parseInt(e.replace("#",""),16);return[n>>16&255,n>>8&255,n&255]}const Ce=Ln.split(`
`).map(e=>{const[n,t,a]=e.split("|"),r=Vn(a);return{num:n,name:t,hex:`#${a}`,rgb:r,lab:Oe(r[0],r[1],r[2])}}),Tn=new Map(Ce.map(e=>[e.num.toLowerCase(),e]));function le(e){return Tn.get(e.trim().toLowerCase())}function In(e,n=Ce){const t=e.length;if(t===0)return[];const a=n.length,r=t*a,l=new Float64Array(r);for(let u=0;u<t;u++){const d=e[u];for(let x=0;x<a;x++)l[u*a+x]=ae(d,n[x].lab)}const s=new Int32Array(r);for(let u=0;u<r;u++)s[u]=u;s.sort((u,d)=>l[u]-l[d]);const i=new Array(t),h=new Uint8Array(a);let b=0;for(let u=0;u<r&&b<t;u++){const d=s[u],x=d/a|0,D=d-x*a;i[x]||h[D]||(i[x]=n[D],h[D]=1,b++)}for(let u=0;u<t;u++)if(!i[u]){let d=0,x=1/0;for(let D=0;D<n.length;D++){const C=ae(e[u],n[D].lab);C<x&&(x=C,d=D)}i[u]=n[d]}return i}function On(e,n,t=[]){const a=new Set([...t].map(r=>r.toLowerCase()));return Ce.filter(r=>!a.has(r.num.toLowerCase())).map(r=>({t:r,d:ae(e,r.lab)})).sort((r,l)=>r.d-l.d).slice(0,n).map(r=>r.t)}function _n(e){return e.split(",").map(n=>n.trim()).filter(Boolean)}function zn({open:e,onClose:n,enabled:t,onEnabledChange:a,threads:r,onThreadsChange:l}){const{t:s}=P(),[i,h]=f.useState(null),[b,u]=f.useState(""),[d,x]=f.useState(null),D=()=>{const C=_n(b);if(C.length===0)return;if(i==="remove"){l(r.filter(g=>!C.includes(g.num))),u(""),h(null);return}x(null);const p=[...r];let c=0,m=0;for(const g of C){const v=le(g);v?p.some(B=>B.num===v.num)?m++:p.push(v):c++}l(p),u(""),c>0?x(s.converter.custom.notFound):m>0?x(s.converter.custom.already):h(null)};return o.jsx(be,{open:e,onClose:n,title:s.converter.custom.title,children:o.jsxs("div",{className:"flex flex-col gap-5",children:[o.jsxs("label",{className:"flex items-center justify-between gap-4 bg-linen rounded-[16px] p-4 cursor-pointer",children:[o.jsxs("span",{children:[o.jsx("span",{className:"block text-base font-bold text-bark",children:s.converter.custom.toggle}),o.jsx("span",{className:"block text-sm text-stone",children:t?s.converter.custom.toggleOn:s.converter.custom.toggleOff})]}),o.jsx(ve,{checked:t,onCheckedChange:a})]}),o.jsxs("div",{children:[o.jsx("div",{className:"text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2",children:s.converter.custom.listLabel}),o.jsx("div",{className:"bg-linen border-[1.5px] border-edge-3 rounded-[16px] p-3 min-h-[120px] max-h-[220px] overflow-y-auto scroll-linen",children:r.length===0?o.jsx("span",{className:"text-sm text-stone",children:s.converter.custom.emptyList}):o.jsx("ul",{className:"flex flex-wrap gap-2 list-none p-0 m-0",children:r.map(C=>o.jsxs("li",{className:"flex items-center gap-2 rounded-[12px] bg-blanc border-[1.5px] border-edge-3 pl-2 pr-3 py-1.5",children:[o.jsx(oe,{hex:C.hex,width:16,height:22,radius:5}),o.jsx("span",{className:"text-sm font-mono font-bold",children:C.num})]},C.num))})})]}),i&&o.jsxs("div",{className:"border-t-2 border-dashed border-edge-2 pt-5",children:[o.jsx("label",{htmlFor:"custom-codes",className:"block text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2",children:s.converter.custom.inputLabel}),o.jsxs("div",{className:"flex gap-3 flex-wrap",children:[o.jsx("input",{id:"custom-codes",type:"text",value:b,onChange:C=>u(C.target.value),onKeyDown:C=>C.key==="Enter"&&D(),placeholder:s.converter.custom.placeholder,className:`flex-1 min-w-[160px] text-base bg-linen border-[1.5px] rounded-[14px] px-4 py-3 outline-none transition-colors focus:bg-blanc ${i==="add"?"border-edge-3 focus:border-coral":"border-coral-edge focus:border-coral-deep"}`}),o.jsx(w,{size:"sm",onClick:D,children:s.converter.custom.validate}),o.jsx(w,{variant:"secondary",size:"sm",onClick:()=>{h(null),u(""),x(null)},children:s.converter.custom.cancel})]})]}),d&&o.jsx("p",{className:"bg-coral-wash border-[1.5px] border-coral-edge text-coral-deeper rounded-[14px] px-4 py-3 text-sm m-0",children:d}),o.jsxs("div",{className:"flex gap-2 flex-wrap pt-1",children:[o.jsx(w,{variant:"secondary",size:"sm",className:"flex-1 min-w-[110px]",onClick:()=>{h("add"),x(null)},children:s.converter.custom.add}),o.jsx(w,{variant:"secondary",size:"sm",className:"flex-1 min-w-[110px]",disabled:r.length===0,onClick:()=>{h("remove"),x(null)},children:s.converter.custom.remove}),o.jsx(w,{variant:"secondary",size:"sm",className:"flex-1 min-w-[110px]",disabled:r.length===0,onClick:()=>{l([]),x(null)},children:s.converter.custom.reset})]})]})})}function _e({className:e,...n}){return o.jsx("div",{className:V("bg-blanc rounded-[18px] shadow-soft p-5",e),...n})}function ze({className:e,...n}){return o.jsx("div",{className:V("font-display font-medium text-[17px] text-ink",e),...n})}function ee({className:e,...n}){return o.jsx("span",{className:V("text-[12.5px] font-extrabold tracking-[.05em] uppercase text-cocoa",e),...n})}function Ee({className:e,...n}){return o.jsx("span",{className:V("font-mono text-[13.5px] font-bold bg-linen rounded-[7px] px-2.5 py-0.5 text-ink",e),...n})}function Un(e,n){const t=document.createElement("canvas");t.width=e,t.height=n;const a=t.getContext("2d");if(!a)throw new Error("canvas 2d context unavailable");return a.imageSmoothingEnabled=!1,[t,a]}function Ue(e){const n=new ImageData(e.width,e.height),t=n.data,a=new Uint8Array(e.threads.length),r=new Uint8Array(e.threads.length),l=new Uint8Array(e.threads.length);e.threads.forEach((s,i)=>{a[i]=s.rgb[0],r[i]=s.rgb[1],l[i]=s.rgb[2]});for(let s=0;s<e.cells.length;s++){const i=e.cells[s];i<0||(t[s*4]=a[i],t[s*4+1]=r[i],t[s*4+2]=l[i],t[s*4+3]=255)}return n}function Hn(e,n){const t=new ImageData(e.width,e.height),a=t.data;for(let r=0;r<e.cells.length;r++)e.cells[r]===n&&(a[r*4]=255,a[r*4+1]=255,a[r*4+2]=255,a[r*4+3]=255);return t}function Wn(e,n={}){const t=n.cellSize??14,a=n.grid??!0,r=n.legend??!0,l=n.outline??!1,s=n.heavyEvery??10,i=n.background??"#EBE2D7",h=e.width*t,b=e.height*t,u=Math.round(t*1.5),d=Math.max(1,Math.min(4,Math.floor(h/190))),x=Math.max(26,Math.round(t*1.6)),D=r?Math.ceil(e.threads.length/d):0,C=r?D*x+u*2:0,[p,c]=Un(h+u*2,b+u*2+C);c.fillStyle=i,c.fillRect(0,0,p.width,p.height);for(let m=0;m<e.height;m++)for(let g=0;g<e.width;g++){const v=e.cells[m*e.width+g];v<0||(c.fillStyle=e.threads[v].hex,c.fillRect(u+g*t,u+m*t,t,t))}if(l){const m=(g,v)=>g>=0&&v>=0&&g<e.width&&v<e.height&&e.cells[v*e.width+g]>=0;c.strokeStyle="rgba(20,16,12,.9)",c.lineWidth=Math.max(2,Math.round(t/5)),c.beginPath();for(let g=0;g<e.height;g++)for(let v=0;v<e.width;v++){if(!m(v,g))continue;const B=u+v*t,y=u+g*t;m(v,g-1)||(c.moveTo(B,y),c.lineTo(B+t,y)),m(v,g+1)||(c.moveTo(B,y+t),c.lineTo(B+t,y+t)),m(v-1,g)||(c.moveTo(B,y),c.lineTo(B,y+t)),m(v+1,g)||(c.moveTo(B+t,y),c.lineTo(B+t,y+t))}c.stroke()}if(a){c.lineWidth=1,c.strokeStyle="rgba(30,25,20,.35)",c.beginPath();for(let m=0;m<=e.width;m++){const g=u+m*t+.5;c.moveTo(g,u),c.lineTo(g,u+b)}for(let m=0;m<=e.height;m++){const g=u+m*t+.5;c.moveTo(u,g),c.lineTo(u+h,g)}c.stroke(),c.lineWidth=2,c.strokeStyle="rgba(20,16,12,.85)",c.beginPath();for(let m=0;m<=e.width;m+=s){const g=u+m*t;c.moveTo(g,u),c.lineTo(g,u+b)}for(let m=0;m<=e.height;m+=s){const g=u+m*t;c.moveTo(u,g),c.lineTo(u+h,g)}c.stroke()}if(r&&e.threads.length){const m=u*2+b;c.strokeStyle="rgba(20,16,12,.45)",c.lineWidth=2,c.beginPath(),c.moveTo(u,m-u/2),c.lineTo(p.width-u,m-u/2),c.stroke();const g=h/d,v=Math.round(x*.62);c.textBaseline="middle",c.font=`600 ${Math.round(x*.44)}px "Nunito Sans", system-ui, sans-serif`,e.threads.forEach((B,y)=>{const S=y%d,T=Math.floor(y/d),M=u+S*g,_=m+T*x+x/2;c.fillStyle=B.hex,c.fillRect(M,_-v/2,v,v),c.strokeStyle="rgba(20,16,12,.55)",c.lineWidth=1,c.strokeRect(M+.5,_-v/2+.5,v-1,v-1),c.fillStyle="#33261A";const L=`DMC ${B.num}`;c.fillText(L,M+v+8,_),c.fillStyle="rgba(51,38,26,.6)",c.fillText(`${e.counts[y]} pts`,M+v+8+c.measureText(L).width+10,_)})}return p}function qn(e){return new Promise((n,t)=>{e.toBlob(a=>a?n(a):t(new Error("toBlob failed")),"image/png")})}function ue({label:e,hint:n,checked:t,onChange:a}){return o.jsxs("label",{className:"flex items-center justify-between gap-4 cursor-pointer",children:[o.jsxs("span",{children:[o.jsx("span",{className:"block text-[15px] font-bold text-bark",children:e}),o.jsx("span",{className:"block text-[13px] text-stone",children:n})]}),o.jsx(ve,{checked:t,onCheckedChange:a})]})}function Kn({pattern:e,onError:n}){const{t}=P(),[a,r]=f.useState(!0),[l,s]=f.useState(!0),[i,h]=f.useState(!1),[b,u]=f.useState("#EBE2D7"),[d,x]=f.useState(!1),D=async()=>{x(!0);try{const C=Wn(e,{cellSize:14,grid:a,legend:l,outline:i,background:b}),p=await qn(C),c=URL.createObjectURL(p),m=document.createElement("a");m.href=c,m.download="BroderieDMC.png",document.body.appendChild(m),m.click(),m.remove(),URL.revokeObjectURL(c)}catch{n("download")}finally{x(!1)}};return o.jsxs("div",{className:"bg-blanc rounded-[18px] shadow-soft p-5 flex flex-col gap-4",children:[o.jsx(ze,{children:t.converter.download.heading}),o.jsx(ue,{label:t.converter.download.grid,hint:t.converter.download.gridHint,checked:a,onChange:r}),o.jsx(ue,{label:t.converter.download.legend,hint:t.converter.download.legendHint,checked:l,onChange:s}),o.jsx(ue,{label:t.converter.colors.outline,hint:t.converter.colors.outlineHint,checked:i,onChange:h}),o.jsxs("label",{className:"flex items-center justify-between gap-4",children:[o.jsx("span",{className:"text-[15px] font-bold text-bark",children:t.converter.download.background}),o.jsxs("span",{className:"flex items-center gap-2.5",children:[o.jsx("span",{className:"font-mono text-xs text-stone",children:b.toUpperCase()}),o.jsx("input",{type:"color",value:b,onChange:C=>u(C.target.value),className:"w-12 h-9 rounded-[10px] border-[1.5px] border-edge-3 cursor-pointer bg-transparent p-0"})]})]}),o.jsxs(w,{size:"block",onClick:D,disabled:d,children:[o.jsx(hn,{}),d?t.converter.download.working:t.converter.download.button]}),o.jsx("p",{className:"font-hand text-sm text-sand text-center m-0",children:t.converter.download.note})]})}function $n(e){const n=new Uint8Array(e.cells.length);for(let r=0;r<e.cells.length;r++)n[r]=e.cells[r]<0?0:e.cells[r]+1;let t="";const a=8192;for(let r=0;r<n.length;r+=a)t+=String.fromCharCode(...n.subarray(r,r+a));return btoa(t)}function Yn(e,n=360){const t=Ue(e),a=Math.max(1,Math.round(n/e.width)),r=document.createElement("canvas");r.width=e.width*a,r.height=e.height*a;const l=r.getContext("2d");if(!l)throw new Error("canvas 2d context unavailable");const s=document.createElement("canvas");return s.width=t.width,s.height=t.height,s.getContext("2d")?.putImageData(t,0,0),l.imageSmoothingEnabled=!1,l.drawImage(s,0,0,r.width,r.height),r.toDataURL("image/png")}async function Xn(e,n=1400){const t=await createImageBitmap(e),a=Math.min(1,n/Math.max(t.width,t.height)),r=Math.round(t.width*a),l=Math.round(t.height*a),s=document.createElement("canvas");s.width=r,s.height=l;const i=s.getContext("2d");if(!i)throw new Error("canvas 2d context unavailable");return i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high",i.drawImage(t,0,0,t.width,t.height,0,0,r,l),t.close(),s.toDataURL("image/jpeg",.82)}const Jn=["pets","portraits","flowers","landscapes","little","other"];function Qn({pattern:e,open:n,onClose:t,onPublished:a}){const{t:r}=P(),{user:l,signIn:s}=mn(),[i,h]=f.useState(""),[b,u]=f.useState("other"),[d,x]=f.useState(null),[D,C]=f.useState(!1),[p,c]=f.useState(null),m=f.useRef(null),g=async y=>{c(null);try{x(await Xn(y))}catch{c(r.publish.tooBig)}},v=async()=>{if(!l)return s("/convert");C(!0),c(null);try{const{id:y}=await fn({title:i.trim(),category:b,width:e.width,height:e.height,cells:$n(e),threadCodes:e.threads.map(S=>S.num),thumbnail:Yn(e),photo:d??void 0});a(y)}catch(y){c(y instanceof xn&&y.status===413?r.publish.tooBig:r.publish.failed)}finally{C(!1)}},B=i.trim().length>=2&&!D;return o.jsx(be,{open:n,onClose:t,title:r.publish.title,children:o.jsxs("div",{className:"flex flex-col gap-5",children:[o.jsx("p",{className:"text-[15px] text-clay m-0",children:r.publish.lead}),o.jsxs("div",{children:[o.jsx("label",{htmlFor:"post-title",className:"block text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2",children:r.publish.nameLabel}),o.jsx("input",{id:"post-title",value:i,onChange:y=>h(y.target.value),placeholder:r.publish.namePlaceholder,maxLength:80,className:"w-full text-base bg-linen border-[1.5px] border-edge-3 rounded-[14px] px-4 py-3 outline-none transition-colors focus:border-coral focus:bg-blanc"})]}),o.jsxs("div",{children:[o.jsx("div",{className:"text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2",children:r.publish.categoryLabel}),o.jsx("div",{className:"flex flex-wrap gap-2",children:Jn.map(y=>o.jsx(ne,{selected:b===y,onClick:()=>u(y),children:y==="other"?r.gallery.filters.all:r.gallery.filters[y]},y))})]}),o.jsxs("div",{children:[o.jsx("div",{className:"text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-1",children:r.publish.photoLabel}),o.jsx("p",{className:"text-[13px] text-stone m-0 mb-2",children:r.publish.photoHint}),d?o.jsxs("div",{className:"flex items-center gap-3",children:[o.jsx("img",{src:d,alt:"",className:"w-24 h-24 object-cover rounded-[12px] border-[1.5px] border-edge-3"}),o.jsxs("div",{className:"flex flex-col gap-2",children:[o.jsx(w,{variant:"secondary",size:"sm",onClick:()=>m.current?.click(),children:r.publish.photoChange}),o.jsx(w,{variant:"quiet",size:"sm",onClick:()=>x(null),children:r.publish.photoRemove})]})]}):o.jsx(w,{variant:"secondary",size:"sm",onClick:()=>m.current?.click(),children:r.publish.photoPick}),o.jsx("input",{ref:m,type:"file",accept:"image/*",className:"sr-only",onChange:y=>{const S=y.target.files?.[0];S&&g(S),y.target.value=""}})]}),p&&o.jsx("p",{role:"alert",className:"bg-coral-wash border-[1.5px] border-coral-edge text-coral-deeper rounded-[14px] px-4 py-3 text-sm m-0",children:p}),o.jsxs("div",{className:"flex gap-3 flex-wrap pt-1",children:[o.jsx(w,{className:"flex-1 min-w-[160px]",onClick:()=>void v(),disabled:!B,children:D?r.publish.working:l?r.publish.submit:r.publish.needSignIn}),o.jsx(w,{variant:"secondary",onClick:t,children:r.account.cancel})]})]})})}function He(e,n,t){if(!n||!t)return{hasAlpha:!1,opaqueRatio:1};try{const a=Math.max(1,Math.min(64,n)),r=Math.max(1,Math.round(a*t/n)),l=document.createElement("canvas");l.width=a,l.height=r;const s=l.getContext("2d",{willReadFrequently:!0});if(!s)return{hasAlpha:!1,opaqueRatio:1};s.drawImage(e,0,0,a,r);const{data:i}=s.getImageData(0,0,a,r);let h=0;for(let d=3;d<i.length;d+=4)i[d]>=150&&h++;const b=a*r,u=b?h/b:1;return{hasAlpha:u<.999,opaqueRatio:u}}catch{return{hasAlpha:!1,opaqueRatio:1}}}function fe(e,n){if(!e.type.startsWith("image/"))return;const t=new FileReader;t.onload=a=>{const r=a.target?.result;if(typeof r!="string")return;const l=new Image,s=(i,h)=>{const{hasAlpha:b,opaqueRatio:u}=He(l,i,h);n({dataUrl:r,blob:e,name:e.name,width:i,height:h,hasAlpha:b,opaqueRatio:u})};l.onload=()=>s(l.naturalWidth,l.naturalHeight),l.onerror=()=>s(0,0),l.src=r},t.readAsDataURL(e)}function Zn({onPhoto:e}){const{t:n}=P(),[t,a]=f.useState(!1),r=f.useId(),l=f.useCallback(i=>{i.preventDefault(),i.stopPropagation(),a(!1);const h=i.dataTransfer.files?.[0];h&&fe(h,e)},[e]),s=i=>{i.preventDefault(),i.stopPropagation()};return o.jsxs("div",{className:V("relative aida [--aida-size:14px] [--aida-ink:.07] rounded-[22px] border-[2.5px] border-dashed","flex flex-col items-center gap-3 p-7 text-center transition-colors cursor-pointer",t?"border-coral bg-[#FBF5E9]":"border-coral-dash bg-[#F7F1E5] hover:border-coral"),onDragEnter:i=>{s(i),a(!0)},onDragOver:s,onDragLeave:i=>{s(i),a(!1)},onDrop:l,children:[o.jsx(gn,{size:40}),o.jsx("div",{className:"font-display font-semibold text-[20px] text-ink",children:n.converter.upload.drop}),o.jsxs("div",{className:"text-[15px] text-cocoa",children:[n.converter.upload.browseBefore,o.jsx("label",{htmlFor:r,className:"text-coral-deep font-bold underline decoration-dotted decoration-2 underline-offset-4 cursor-pointer",children:n.converter.upload.browse}),n.converter.upload.browseAfter]}),o.jsx("div",{className:"font-hand text-sm text-sand",children:n.converter.upload.hint}),o.jsx("input",{id:r,type:"file",accept:"image/*",className:"absolute inset-0 size-full opacity-0 cursor-pointer",onChange:i=>{const h=i.target.files?.[0];h&&fe(h,e),i.target.value=""}})]})}function et({onPhoto:e,className:n}){const{t}=P(),a=f.useRef(null);return o.jsxs(o.Fragment,{children:[o.jsx(w,{variant:"secondary",size:"sm",className:n,onClick:()=>a.current?.click(),children:t.converter.upload.replace}),o.jsx("input",{ref:a,type:"file",accept:"image/*",className:"sr-only",onChange:r=>{const l=r.target.files?.[0];l&&fe(l,e),r.target.value=""}})]})}const he=560,ke=2,nt=24;function Se(e){const n=f.useRef(null);return f.useEffect(()=>{const t=n.current;!t||!e||(t.width=e.width,t.height=e.height,t.getContext("2d")?.putImageData(e,0,0))},[e]),n}function tt(e){const n=f.useRef(null),[t,a]=f.useState(he);f.useEffect(()=>{const s=n.current;if(!s)return;const i=()=>a(s.clientWidth||he);i();const h=new ResizeObserver(i);return h.observe(s),()=>h.disconnect()},[]);let r=Math.max(120,Math.min(t-nt*2,he)),l=r*e;return e>ke&&(l=r*ke,r=l/e),{hostRef:n,width:Math.round(r),height:Math.round(l)}}function rt({pattern:e,original:n,highlightIndex:t,view:a,onViewChange:r,busy:l,onPhoto:s,aspect:i=1}){const{t:h}=P(),b=e?e.height/e.width:1/(i||1),{hostRef:u,width:d,height:x}=tt(b),D=Se(e?Ue(e):null),C=Se(e&&t>=0?Hn(e,t):null),p=a==="pattern"&&e,c=a==="original"&&n;return o.jsxs("div",{className:"flex flex-col gap-4 items-center",children:[o.jsx("div",{className:"flex bg-blanc border-[1.5px] border-edge-3 rounded-full p-1",children:["original","pattern"].map(m=>o.jsx("button",{type:"button",onClick:()=>r(m),disabled:m==="original"?!n:!e&&!l,"aria-pressed":a===m,className:V("font-display text-sm px-[18px] py-2 rounded-full cursor-pointer transition-colors disabled:cursor-not-allowed disabled:text-edge-5",a===m?"bg-ink text-blanc":"text-cocoa hover:text-coral-deep"),children:h.converter.canvas[m]},m))}),o.jsx("div",{ref:u,className:"w-full flex justify-center",children:o.jsx("div",{className:"aida [--aida-size:22.5px] [--aida-ink:.09] bg-aida rounded-[20px] p-6 shadow-[inset_0_2px_10px_rgba(83,63,42,.09)] shrink-0",children:p?o.jsxs("div",{className:"relative",style:{width:d,height:x},children:[o.jsx("canvas",{ref:D,"aria-label":h.converter.canvas.pattern,role:"img",style:{imageRendering:"pixelated",width:d,height:x},className:"block rounded-[6px]"}),t>=0&&o.jsx("canvas",{ref:C,"aria-hidden":"true",style:{imageRendering:"pixelated",width:d,height:x},className:"absolute inset-0 rounded-[6px] pointer-events-none mix-blend-lighten animate-mask-glow"})]}):c?o.jsx("img",{src:n,alt:h.converter.canvas.original,style:{width:d,height:x},className:"block rounded-[6px] object-contain"}):l?o.jsx("div",{className:"relative overflow-hidden rounded-[6px] bg-[#F3ECDC]/60",style:{width:d,height:x},role:"status","aria-label":h.converter.canvas.building,children:o.jsx("div",{className:"absolute inset-0 scale-150 bg-gradient-to-r from-transparent via-white/55 to-transparent animate-shine"})}):o.jsxs("div",{className:"flex flex-col items-center justify-center gap-4 text-center",style:{width:d,minHeight:320},children:[o.jsx("div",{className:"opacity-35",children:o.jsx(pn,{pixels:Dn,cols:bn,size:14,radius:2})}),o.jsxs("div",{children:[o.jsx("div",{className:"font-display font-medium text-[17px] text-cocoa",children:h.converter.canvas.empty}),o.jsx("div",{className:"font-hand text-sm text-sand mt-1",children:h.converter.canvas.emptyHint})]})]})})}),a==="original"&&o.jsx(et,{onPhoto:s}),o.jsx("p",{className:"font-hand text-sm text-sand text-center m-0",children:l?h.converter.canvas.building:h.converter.canvas.note})]})}function We(e,[n,t]){return Math.min(t,Math.max(n,e))}var ot=f.createContext(void 0);function at(e){const n=f.useContext(ot);return e||n||"ltr"}function st(e){const n=e+"CollectionProvider",[t,a]=De(n),[r,l]=t(n,{collectionRef:{current:null},itemMap:new Map}),s=p=>{const{scope:c,children:m}=p,g=H.useRef(null),v=H.useRef(new Map).current;return o.jsx(r,{scope:c,itemMap:v,collectionRef:g,children:m})};s.displayName=n;const i=e+"CollectionSlot",h=me(i),b=H.forwardRef((p,c)=>{const{scope:m,children:g}=p,v=l(i,m),B=R(c,v.collectionRef);return o.jsx(h,{ref:B,children:g})});b.displayName=i;const u=e+"CollectionItemSlot",d="data-radix-collection-item",x=me(u),D=H.forwardRef((p,c)=>{const{scope:m,children:g,...v}=p,B=H.useRef(null),y=R(c,B),S=l(u,m);return H.useEffect(()=>(S.itemMap.set(B,{ref:B,...v}),()=>void S.itemMap.delete(B))),o.jsx(x,{[d]:"",ref:y,children:g})});D.displayName=u;function C(p){const c=l(e+"CollectionConsumer",p);return H.useCallback(()=>{const g=c.collectionRef.current;if(!g)return[];const v=Array.from(g.querySelectorAll(`[${d}]`));return Array.from(c.itemMap.values()).sort((S,T)=>v.indexOf(S.ref.current)-v.indexOf(T.ref.current))},[c.collectionRef,c.itemMap])}return[{Provider:s,Slot:b,ItemSlot:D},C,a]}var qe=["PageUp","PageDown"],Ke=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],$e={"from-left":["Home","PageDown","ArrowDown","ArrowLeft"],"from-right":["Home","PageDown","ArrowDown","ArrowRight"],"from-bottom":["Home","PageDown","ArrowDown","ArrowLeft"],"from-top":["Home","PageDown","ArrowUp","ArrowLeft"]},$="Slider",[xe,it,lt]=st($),[Ye,nr]=De($,[lt]),[ct,ce]=Ye($),Xe=f.forwardRef((e,n)=>{const{name:t,min:a=0,max:r=100,step:l=1,orientation:s="horizontal",disabled:i=!1,minStepsBetweenThumbs:h=0,defaultValue:b=[a],value:u,onValueChange:d=()=>{},onValueCommit:x=()=>{},inverted:D=!1,form:C,...p}=e,c=f.useRef(new Set),m=f.useRef(0),v=s==="horizontal"?dt:ut,[B=[],y]=Le({prop:u,defaultProp:b,onChange:A=>{[...c.current][m.current]?.focus(),d(A)}}),S=f.useRef(B);function T(A){const N=gt(B,A);L(A,N)}function M(A){L(A,m.current)}function _(){const A=S.current[m.current];B[m.current]!==A&&x(B)}function L(A,N,{commit:Y}={commit:!1}){const J=vt(l),K=Ct(Math.round((A-a)/l)*l+a,J),G=We(K,[a,r]);y((z=[])=>{const I=ft(z,G,N);if(Dt(I,h*l)){m.current=I.indexOf(G);const Q=String(I)!==String(z);return Q&&Y&&x(I),Q?I:z}else return z})}return o.jsx(ct,{scope:e.__scopeSlider,name:t,disabled:i,min:a,max:r,valueIndexToChangeRef:m,thumbs:c.current,values:B,orientation:s,form:C,children:o.jsx(xe.Provider,{scope:e.__scopeSlider,children:o.jsx(xe.Slot,{scope:e.__scopeSlider,children:o.jsx(v,{"aria-disabled":i,"data-disabled":i?"":void 0,...p,ref:n,onPointerDown:W(p.onPointerDown,()=>{i||(S.current=B)}),min:a,max:r,inverted:D,onSlideStart:i?void 0:T,onSlideMove:i?void 0:M,onSlideEnd:i?void 0:_,onHomeKeyDown:()=>!i&&L(a,0,{commit:!0}),onEndKeyDown:()=>!i&&L(r,B.length-1,{commit:!0}),onStepKeyDown:({event:A,direction:N})=>{if(!i){const K=qe.includes(A.key)||A.shiftKey&&Ke.includes(A.key)?10:1,G=m.current,z=B[G],I=l*K*N;L(z+I,G,{commit:!0})}}})})})})});Xe.displayName=$;var[Je,Qe]=Ye($,{startEdge:"left",endEdge:"right",size:"width",direction:1}),dt=f.forwardRef((e,n)=>{const{min:t,max:a,dir:r,inverted:l,onSlideStart:s,onSlideMove:i,onSlideEnd:h,onStepKeyDown:b,...u}=e,[d,x]=f.useState(null),D=R(n,v=>x(v)),C=f.useRef(void 0),p=at(r),c=p==="ltr",m=c&&!l||!c&&l;function g(v){const B=C.current||d.getBoundingClientRect(),y=[0,B.width],T=Be(y,m?[t,a]:[a,t]);return C.current=B,T(v-B.left)}return o.jsx(Je,{scope:e.__scopeSlider,startEdge:m?"left":"right",endEdge:m?"right":"left",direction:m?1:-1,size:"width",children:o.jsx(Ze,{dir:p,"data-orientation":"horizontal",...u,ref:D,style:{...u.style,"--radix-slider-thumb-transform":"translateX(-50%)"},onSlideStart:v=>{const B=g(v.clientX);s?.(B)},onSlideMove:v=>{const B=g(v.clientX);i?.(B)},onSlideEnd:()=>{C.current=void 0,h?.()},onStepKeyDown:v=>{const y=$e[m?"from-left":"from-right"].includes(v.key);b?.({event:v,direction:y?-1:1})}})})}),ut=f.forwardRef((e,n)=>{const{min:t,max:a,inverted:r,onSlideStart:l,onSlideMove:s,onSlideEnd:i,onStepKeyDown:h,...b}=e,u=f.useRef(null),d=R(n,u),x=f.useRef(void 0),D=!r;function C(p){const c=x.current||u.current.getBoundingClientRect(),m=[0,c.height],v=Be(m,D?[a,t]:[t,a]);return x.current=c,v(p-c.top)}return o.jsx(Je,{scope:e.__scopeSlider,startEdge:D?"bottom":"top",endEdge:D?"top":"bottom",size:"height",direction:D?1:-1,children:o.jsx(Ze,{"data-orientation":"vertical",...b,ref:d,style:{...b.style,"--radix-slider-thumb-transform":"translateY(50%)"},onSlideStart:p=>{const c=C(p.clientY);l?.(c)},onSlideMove:p=>{const c=C(p.clientY);s?.(c)},onSlideEnd:()=>{x.current=void 0,i?.()},onStepKeyDown:p=>{const m=$e[D?"from-bottom":"from-top"].includes(p.key);h?.({event:p,direction:m?-1:1})}})})}),Ze=f.forwardRef((e,n)=>{const{__scopeSlider:t,onSlideStart:a,onSlideMove:r,onSlideEnd:l,onHomeKeyDown:s,onEndKeyDown:i,onStepKeyDown:h,...b}=e,u=ce($,t);return o.jsx(q.span,{...b,ref:n,onKeyDown:W(e.onKeyDown,d=>{d.key==="Home"?(s(d),d.preventDefault()):d.key==="End"?(i(d),d.preventDefault()):qe.concat(Ke).includes(d.key)&&(h(d),d.preventDefault())}),onPointerDown:W(e.onPointerDown,d=>{const x=d.target;x.setPointerCapture(d.pointerId),d.preventDefault(),u.thumbs.has(x)?x.focus():a(d)}),onPointerMove:W(e.onPointerMove,d=>{d.target.hasPointerCapture(d.pointerId)&&r(d)}),onPointerUp:W(e.onPointerUp,d=>{const x=d.target;x.hasPointerCapture(d.pointerId)&&(x.releasePointerCapture(d.pointerId),l(d))})})}),en="SliderTrack",nn=f.forwardRef((e,n)=>{const{__scopeSlider:t,...a}=e,r=ce(en,t);return o.jsx(q.span,{"data-disabled":r.disabled?"":void 0,"data-orientation":r.orientation,...a,ref:n})});nn.displayName=en;var ge="SliderRange",tn=f.forwardRef((e,n)=>{const{__scopeSlider:t,...a}=e,r=ce(ge,t),l=Qe(ge,t),s=f.useRef(null),i=R(n,s),h=r.values.length,b=r.values.map(x=>an(x,r.min,r.max)),u=h>1?Math.min(...b):0,d=100-Math.max(...b);return o.jsx(q.span,{"data-orientation":r.orientation,"data-disabled":r.disabled?"":void 0,...a,ref:i,style:{...e.style,[l.startEdge]:u+"%",[l.endEdge]:d+"%"}})});tn.displayName=ge;var pe="SliderThumb",rn=f.forwardRef((e,n)=>{const t=it(e.__scopeSlider),[a,r]=f.useState(null),l=R(n,i=>r(i)),s=f.useMemo(()=>a?t().findIndex(i=>i.ref.current===a):-1,[t,a]);return o.jsx(ht,{...e,ref:l,index:s})}),ht=f.forwardRef((e,n)=>{const{__scopeSlider:t,index:a,name:r,...l}=e,s=ce(pe,t),i=Qe(pe,t),[h,b]=f.useState(null),u=R(n,g=>b(g)),d=h?s.form||!!h.closest("form"):!0,x=Pe(h),D=s.values[a],C=D===void 0?0:an(D,s.min,s.max),p=xt(a,s.values.length),c=x?.[i.size],m=c?pt(c,C,i.direction):0;return f.useEffect(()=>{if(h)return s.thumbs.add(h),()=>{s.thumbs.delete(h)}},[h,s.thumbs]),o.jsxs("span",{style:{transform:"var(--radix-slider-thumb-transform)",position:"absolute",[i.startEdge]:`calc(${C}% + ${m}px)`},children:[o.jsx(xe.ItemSlot,{scope:e.__scopeSlider,children:o.jsx(q.span,{role:"slider","aria-label":e["aria-label"]||p,"aria-valuemin":s.min,"aria-valuenow":D,"aria-valuemax":s.max,"aria-orientation":s.orientation,"data-orientation":s.orientation,"data-disabled":s.disabled?"":void 0,tabIndex:s.disabled?void 0:0,...l,ref:u,style:D===void 0?{display:"none"}:e.style,onFocus:W(e.onFocus,()=>{s.valueIndexToChangeRef.current=a})})}),d&&o.jsx(on,{name:r??(s.name?s.name+(s.values.length>1?"[]":""):void 0),form:s.form,value:D},a)]})});rn.displayName=pe;var mt="RadioBubbleInput",on=f.forwardRef(({__scopeSlider:e,value:n,...t},a)=>{const r=f.useRef(null),l=R(r,a),s=Ne(n);return f.useEffect(()=>{const i=r.current;if(!i)return;const h=window.HTMLInputElement.prototype,u=Object.getOwnPropertyDescriptor(h,"value").set;if(s!==n&&u){const d=new Event("input",{bubbles:!0});u.call(i,n),i.dispatchEvent(d)}},[s,n]),o.jsx(q.input,{style:{display:"none"},...t,ref:l,defaultValue:n})});on.displayName=mt;function ft(e=[],n,t){const a=[...e];return a[t]=n,a.sort((r,l)=>r-l)}function an(e,n,t){const l=100/(t-n)*(e-n);return We(l,[0,100])}function xt(e,n){return n>2?`Value ${e+1} of ${n}`:n===2?["Minimum","Maximum"][e]:void 0}function gt(e,n){if(e.length===1)return 0;const t=e.map(r=>Math.abs(r-n)),a=Math.min(...t);return t.indexOf(a)}function pt(e,n,t){const a=e/2,l=Be([0,50],[0,a]);return(a-l(n)*t)*t}function bt(e){return e.slice(0,-1).map((n,t)=>e[t+1]-n)}function Dt(e,n){if(n>0){const t=bt(e);return Math.min(...t)>=n}return!0}function Be(e,n){return t=>{if(e[0]===e[1]||n[0]===n[1])return n[0];const a=(n[1]-n[0])/(e[1]-e[0]);return n[0]+a*(t-e[0])}}function vt(e){return(String(e).split(".")[1]||"").length}function Ct(e,n){const t=Math.pow(10,n);return Math.round(e*t)/t}var Bt=Xe,yt=nn,wt=tn,Et=rn;function Ae({className:e,...n}){return o.jsxs(Bt,{className:V("relative flex w-full touch-none select-none items-center h-[26px] cursor-pointer data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",e),...n,children:[o.jsx(yt,{className:"relative h-2 w-full grow overflow-hidden rounded-full bg-aida",children:o.jsx(wt,{className:"absolute h-full bg-coral"})}),o.jsx(Et,{className:"block size-[26px] rounded-full border-[3px] border-coral bg-blanc shadow-[0_2px_8px_rgba(83,63,42,.18)] transition-transform hover:scale-105 focus-visible:scale-105 cursor-grab active:cursor-grabbing"})]})}const je=[0,55,100];function kt({settings:e,onChange:n,summary:t}){const{t:a}=P(),r=je.indexOf(e.vividness);return o.jsxs(_e,{children:[o.jsx(ze,{className:"mb-4",children:a.converter.settings.heading}),o.jsxs("div",{className:"flex justify-between items-baseline mb-2",children:[o.jsx(ee,{children:a.converter.size.stitchesWide}),o.jsx(Ee,{children:e.stitchWidth})]}),o.jsx(Ae,{value:[e.stitchWidth],onValueChange:([l])=>n({stitchWidth:l}),min:20,max:200,step:2,"aria-label":a.converter.size.stitchesWide}),o.jsxs("div",{className:"flex justify-between text-xs text-sand mt-1.5 mb-5",children:[o.jsx("span",{children:"20"}),o.jsx("span",{children:"200"})]}),o.jsxs("div",{className:"flex justify-between items-baseline mb-2",children:[o.jsx(ee,{children:a.converter.colors.threadColors}),o.jsx(Ee,{children:e.colorCount})]}),o.jsx(Ae,{value:[e.colorCount],onValueChange:([l])=>n({colorCount:l}),min:2,max:20,step:1,"aria-label":a.converter.colors.threadColors}),o.jsxs("div",{className:"flex justify-between text-xs text-sand mt-1.5 mb-4",children:[o.jsx("span",{children:"2"}),o.jsx("span",{children:"20"})]}),t,o.jsxs("details",{className:"group mt-4 border-t-2 border-dashed border-edge pt-3",children:[o.jsxs("summary",{className:"flex items-center gap-2 cursor-pointer list-none text-[13px] font-extrabold tracking-[.05em] uppercase text-cocoa hover:text-coral-deep",children:[o.jsx("span",{"aria-hidden":"true",className:"text-coral-deep transition-transform group-open:rotate-90",children:"▸"}),a.converter.retouch.heading]}),o.jsxs("div",{className:"pt-4 flex flex-col gap-4",children:[o.jsxs("div",{children:[o.jsx(ee,{className:"block mb-2",children:a.converter.retouch.vividness}),o.jsx("div",{className:"flex gap-1.5",children:a.converter.retouch.vividnessSteps.map((l,s)=>o.jsx(ne,{selected:r===s,onClick:()=>n({vividness:je[s]}),className:"flex-1 px-2 text-[13px]",children:l},l))})]}),o.jsxs("div",{children:[o.jsx(ee,{className:"block mb-2",children:a.converter.retouch.mirror}),o.jsxs("div",{className:"flex gap-1.5",children:[o.jsxs(ne,{selected:e.flipH,onClick:()=>n({flipH:!e.flipH}),className:"flex-1 px-2 text-[13px]",children:[o.jsx("span",{"aria-hidden":"true",className:"mr-1",children:"⇄"}),a.converter.retouch.mirrorH]}),o.jsxs(ne,{selected:e.flipV,onClick:()=>n({flipV:!e.flipV}),className:"flex-1 px-2 text-[13px]",children:[o.jsx("span",{"aria-hidden":"true",className:"mr-1",children:"⇅"}),a.converter.retouch.mirrorV]})]})]}),o.jsxs("label",{className:"flex items-start justify-between gap-3 cursor-pointer",children:[o.jsxs("span",{children:[o.jsx("span",{className:"block text-sm font-bold text-bark",children:a.converter.retouch.removeBg}),o.jsx("span",{className:"block text-[12.5px] text-stone leading-snug",children:a.converter.retouch.removeBgHint})]}),o.jsx(ve,{checked:e.removeBackground,onCheckedChange:l=>n({removeBackground:l})})]})]})]})]})}function St({thread:e,threads:n,onClose:t,onReplace:a}){const{t:r}=P(),[l,s]=f.useState([]),[i,h]=f.useState(!1),[b,u]=f.useState(""),[d,x]=f.useState(null);if(f.useEffect(()=>{s([]),h(!1),u(""),x(null)},[e?.num]),!e)return null;const D=()=>{x(null),s(On(e.lab,3,n.map(p=>p.num)))},C=()=>{const p=b.trim();if(!p)return;x(null);const c=le(p);c?n.some(m=>m.num===c.num)?x(r.converter.custom.already):(s(m=>[...m,c].slice(-3)),u(""),h(!1)):x(r.converter.custom.notFound)};return o.jsx(be,{open:!0,onClose:t,title:r.converter.detail.title,className:"max-w-2xl",children:o.jsxs("div",{className:"flex flex-col gap-6",children:[o.jsxs("div",{className:"flex items-center gap-4",children:[o.jsx(oe,{hex:e.hex,width:54,height:72,radius:12,className:"bobbin"}),o.jsxs("div",{className:"flex-1 min-w-0",children:[o.jsxs("span",{className:"inline-block text-sm font-extrabold bg-linen rounded-full px-3 py-1 mb-2",children:["DMC ",e.num]}),o.jsx("p",{className:"text-[18px] font-medium text-ink m-0",children:e.name}),o.jsx("p",{className:"text-sm text-stone font-mono m-0",children:e.hex})]})]}),l.length>0&&o.jsxs("div",{className:"border-t-2 border-dashed border-edge-2 pt-5",children:[o.jsx("h3",{className:"text-[13px] font-extrabold tracking-[.06em] uppercase text-sand mb-3.5 font-body",children:r.converter.detail.alternatives}),o.jsx("div",{className:"grid sm:grid-cols-3 gap-3",children:l.map(p=>o.jsxs("div",{className:"flex flex-col items-center gap-3 p-4 rounded-[16px] bg-linen border-[1.5px] border-edge-3",children:[o.jsx(oe,{hex:p.hex,width:40,height:54,radius:10}),o.jsxs("div",{className:"text-center min-w-0 w-full",children:[o.jsxs("span",{className:"inline-block text-xs font-extrabold bg-blanc border-[1.5px] border-edge-3 rounded-full px-2 py-0.5 mb-1",children:["DMC ",p.num]}),o.jsx("p",{className:"text-sm font-medium truncate m-0",children:p.name}),o.jsx("p",{className:"text-xs text-stone font-mono m-0",children:p.hex})]}),o.jsx(w,{size:"sm",className:"w-full",onClick:()=>a(e,p),children:r.converter.detail.replace})]},p.num))})]}),i&&o.jsxs("div",{className:"border-t-2 border-dashed border-edge-2 pt-5",children:[o.jsx("label",{htmlFor:"thread-code",className:"block text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2",children:r.converter.custom.inputLabel}),o.jsxs("div",{className:"flex gap-3 flex-wrap",children:[o.jsx("input",{id:"thread-code",type:"text",value:b,onChange:p=>u(p.target.value),onKeyDown:p=>p.key==="Enter"&&C(),placeholder:"702",className:"flex-1 min-w-[140px] text-base bg-linen border-[1.5px] border-edge-3 rounded-[14px] px-4 py-3 outline-none transition-colors focus:border-coral focus:bg-blanc"}),o.jsx(w,{size:"sm",onClick:C,children:r.converter.custom.validate}),o.jsx(w,{variant:"secondary",size:"sm",onClick:()=>{h(!1),u("")},children:r.converter.custom.cancel})]})]}),d&&o.jsx("p",{className:"bg-coral-wash border-[1.5px] border-coral-edge text-coral-deeper rounded-[14px] px-4 py-3 text-sm m-0",children:d}),o.jsxs("div",{className:"flex gap-3 flex-wrap",children:[o.jsx(w,{className:"flex-1 min-w-[200px]",onClick:D,children:r.converter.detail.findSimilar}),o.jsx(w,{variant:"secondary",className:"flex-1 min-w-[200px]",onClick:()=>h(!0),children:r.converter.detail.setColor})]}),o.jsx("div",{className:"border-t-2 border-dashed border-edge-2 pt-5",children:o.jsx(w,{asChild:!0,variant:"secondary",size:"block",children:o.jsx("a",{href:`https://www.etsy.com/fr/search?q=DMC+${encodeURIComponent(e.num)}&ref=search_bar`,target:"_blank",rel:"noreferrer noopener",children:r.converter.detail.buy})})})]})})}const At=7;function jt({threads:e,onSelect:n,onHover:t}){const{t:a}=P();return o.jsxs("div",{className:"flex flex-col gap-3",children:[o.jsxs("div",{className:"flex justify-between items-baseline gap-2",children:[o.jsx("span",{className:"font-display font-medium text-[17px]",children:a.converter.threads.heading}),e.length>0&&o.jsx("span",{className:"text-[13px] font-extrabold text-cocoa bg-blanc border-[1.5px] border-edge-3 rounded-full px-3 py-1",children:a.converter.threads.count(e.length)})]}),e.length===0?o.jsx("p",{className:"text-sm text-stone m-0",children:a.converter.threads.empty}):o.jsxs("div",{className:"relative",children:[o.jsx("ul",{className:"flex flex-col gap-2 list-none p-0 m-0 max-h-[min(52vh,560px)] overflow-y-auto scroll-linen pr-1.5",children:e.map(r=>o.jsx("li",{children:o.jsxs("div",{className:"bg-blanc border-[1.5px] border-edge rounded-[14px] px-3 py-2.5 flex items-center gap-3 transition-colors hover:border-taupe",onMouseEnter:()=>t(r.num),onMouseLeave:()=>t(null),children:[o.jsx(oe,{hex:r.hex}),o.jsxs("div",{className:"flex-1 min-w-0",children:[o.jsxs("div",{className:"text-[13.5px] font-extrabold",children:["DMC ",r.num]}),o.jsx("div",{className:"text-xs text-stone truncate",children:r.name})]}),o.jsx("button",{type:"button",onClick:()=>n(r),"aria-label":a.converter.threads.swapAria(r.num),className:"size-[30px] shrink-0 rounded-full bg-linen border-[1.5px] border-edge-3 flex items-center justify-center cursor-pointer transition-colors hover:border-coral",children:o.jsx(vn,{})})]})},r.num))}),e.length>At&&o.jsx("div",{"aria-hidden":"true",className:"pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-linen to-transparent"})]}),e.length>0&&o.jsx("p",{className:"text-[13px] leading-snug text-stone text-center m-0",children:a.converter.threads.hints})]})}function Ft(e,n){if(n<=0)return;const t=1+n/100*.6;for(let a=0;a<e.length;a+=3)e[a+1]*=t,e[a+2]*=t}function Mt(e,n,t,a){const r=t*a;if(r===0)return;const l=c=>[e[c*3],e[c*3+1],e[c*3+2]],s=[],i=[],h=c=>{n[c]!==0&&(s.push(c),i.push(l(c)))};for(let c=0;c<t;c++)h(c),h((a-1)*t+c);for(let c=1;c<a-1;c++)h(c*t),h(c*t+t-1);if(s.length===0)return;const b=324,u=c=>{for(const m of i)if(ae(c,m)<=b)return!0;return!1},d=new Uint8Array(r),x=new Int32Array(r);let D=0,C=0;for(const c of s)!d[c]&&u(l(c))&&(d[c]=1,x[C++]=c);for(;D<C;){const c=x[D++];n[c]=0;const m=c%t,g=(c-m)/t;m>0&&p(c-1),m<t-1&&p(c+1),g>0&&p(c-t),g<a-1&&p(c+t)}function p(c){d[c]||n[c]===0||u(l(c))&&(d[c]=1,x[C++]=c)}}function Lt(e,n){const t=new Float64Array(n*3);for(let a=0;a<n;a++){const r=Oe(e[a*4],e[a*4+1],e[a*4+2]);t[a*3]=r[0],t[a*3+1]=r[1],t[a*3+2]=r[2]}return t}function Nt(e){let n=e>>>0;return()=>{n=n+1831565813>>>0;let t=n;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}const Pt=60,Gt=42;function Rt(e,n){const t=e.length/3;if(t===0||n<=0)return{centroids:new Float64Array(0),labels:new Int32Array(0)};const a=Vt(e,t);n=Math.min(n,a);const r=Nt(Gt),l=Tt(e,t,n,r),s=new Int32Array(t),i=new Float64Array(n*3),h=new Int32Array(n);for(let b=0;b<Pt;b++){let u=!1;for(let d=0;d<t;d++){const x=e[d*3],D=e[d*3+1],C=e[d*3+2];let p=0,c=1/0;for(let m=0;m<n;m++){const g=x-l[m*3],v=D-l[m*3+1],B=C-l[m*3+2],y=g*g+v*v+B*B;y<c&&(c=y,p=m)}s[d]!==p&&(s[d]=p,u=!0)}i.fill(0),h.fill(0);for(let d=0;d<t;d++){const x=s[d];i[x*3]+=e[d*3],i[x*3+1]+=e[d*3+1],i[x*3+2]+=e[d*3+2],h[x]++}for(let d=0;d<n;d++)h[d]!==0&&(l[d*3]=i[d*3]/h[d],l[d*3+1]=i[d*3+1]/h[d],l[d*3+2]=i[d*3+2]/h[d]);if(!u)break}return{centroids:l,labels:s}}function Vt(e,n){const t=new Set;for(let a=0;a<n;a++)if(t.add(`${e[a*3]|0},${e[a*3+1]|0},${e[a*3+2]|0}`),t.size>64)return t.size;return t.size}function Tt(e,n,t,a){const r=new Float64Array(t*3),l=Math.floor(a()*n);r[0]=e[l*3],r[1]=e[l*3+1],r[2]=e[l*3+2];const s=new Float64Array(n).fill(1/0);for(let i=1;i<t;i++){let h=0;for(let d=0;d<n;d++){const x=e[d*3]-r[(i-1)*3],D=e[d*3+1]-r[(i-1)*3+1],C=e[d*3+2]-r[(i-1)*3+2],p=x*x+D*D+C*C;p<s[d]&&(s[d]=p),h+=s[d]}let b=a()*h,u=n-1;for(let d=0;d<n;d++)if(b-=s[d],b<=0){u=d;break}r[i*3]=e[u*3],r[i*3+1]=e[u*3+1],r[i*3+2]=e[u*3+2]}return r}const It=150;async function Fe(e,n){const{width:t,height:a,data:r}=await Ot(e,n),l=t*a,s=new Int16Array(l).fill(-1),i=Lt(r,l),h=new Uint8Array(l);for(let g=0;g<l;g++)h[g]=r[g*4+3]>=It?255:0;n.removeBackground&&Mt(i,h,t,a),Ft(i,n.vividness??0);const b=new Int32Array(l);let u=0;for(let g=0;g<l;g++)h[g]!==0&&(b[u++]=g);if(u===0)return{width:t,height:a,cells:s,threads:[],counts:[],stitched:0};const d=new Float64Array(u*3);for(let g=0;g<u;g++){const v=b[g]*3;d[g*3]=i[v],d[g*3+1]=i[v+1],d[g*3+2]=i[v+2]}const{centroids:x,labels:D}=Rt(d,n.colorCount),C=x.length/3,p=Array.from({length:C},(g,v)=>[x[v*3],x[v*3+1],x[v*3+2]]),c=In(p,n.palette),m=new Array(C).fill(0);for(let g=0;g<u;g++)s[b[g]]=D[g],m[D[g]]++;return zt({width:t,height:a,cells:s,threads:c,counts:m,stitched:u})}async function Ot(e,n){const t=await createImageBitmap(e),a=Math.max(1,Math.round(n.stitchWidth)),r=Math.max(1,Math.round(a*t.height/t.width)),s=new OffscreenCanvas(a,r).getContext("2d",{willReadFrequently:!0});if(!s)throw t.close(),new Error("canvas 2d context unavailable");return s.imageSmoothingEnabled=!0,s.imageSmoothingQuality="high",(n.flipH||n.flipV)&&(s.translate(n.flipH?a:0,n.flipV?r:0),s.scale(n.flipH?-1:1,n.flipV?-1:1)),s.drawImage(t,0,0,t.width,t.height,0,0,a,r),t.close(),{width:a,height:r,data:s.getImageData(0,0,a,r).data}}function _t(e){return{width:e.width,height:e.height,cells:e.cells,threads:e.threadNums.map(n=>le(n)).filter(n=>!!n),counts:e.counts,stitched:e.stitched}}function zt(e){const n=e.threads.map((r,l)=>({i:l,key:Ut(r.rgb)})).sort((r,l)=>r.key[0]-l.key[0]||r.key[1]-l.key[1]||r.key[2]-l.key[2]).map(r=>r.i),t=new Int16Array(e.threads.length);n.forEach((r,l)=>{t[r]=l});const a=new Int16Array(e.cells.length);for(let r=0;r<e.cells.length;r++)a[r]=e.cells[r]<0?-1:t[e.cells[r]];return{...e,cells:a,threads:n.map(r=>e.threads[r]),counts:n.map(r=>e.counts[r])}}function Ut(e){const[n,t,a]=e.map(h=>h/255),r=Math.max(n,t,a),l=Math.min(n,t,a),s=r-l;let i=0;return s!==0&&(r===n?i=(t-a)/s%6:r===t?i=(a-n)/s+2:i=(n-t)/s+4,i/=6,i<0&&(i+=1)),[i,r===0?0:s/r,r]}let U=null,re=!1,Ht=1;const X=new Map;function Wt(){if(re)return null;if(U)return U;try{return U=new Worker(new URL("/assets/convert.worker-C68MmnBS.js",import.meta.url),{type:"module"}),U.onmessage=e=>{X.get(e.data.id)?.(e.data),X.delete(e.data.id)},U.onerror=()=>{re=!0;for(const[e,n]of X)n({id:e,ok:!1,error:"worker failed"});X.clear(),U?.terminate(),U=null},U}catch{return re=!0,null}}async function qt(e,n){const t=Wt();if(!t){if(typeof OffscreenCanvas>"u")throw new Error("this browser cannot render patterns (no OffscreenCanvas)");return Fe(e,n)}const a=Ht++,r={id:a,photo:e,stitchWidth:n.stitchWidth,colorCount:n.colorCount,vividness:n.vividness,removeBackground:n.removeBackground,flipH:n.flipH,flipV:n.flipV,paletteNums:n.palette?.map(s=>s.num)},l=await new Promise(s=>{X.set(a,s),t.postMessage(r)});if(!l.ok){if(re&&typeof OffscreenCanvas<"u")return Fe(e,n);throw new Error(l.error)}return _t(l.pattern)}const Kt="picture-to-dmc",$t=1,se="session",ye="current";function Yt(){return new Promise((e,n)=>{const t=indexedDB.open(Kt,$t);t.onupgradeneeded=()=>{const a=t.result;a.objectStoreNames.contains(se)||a.createObjectStore(se)},t.onsuccess=()=>e(t.result),t.onerror=()=>n(t.error)})}async function we(e,n){try{const t=await Yt();return await new Promise((a,r)=>{const l=t.transaction(se,e),s=n(l.objectStore(se));s.onsuccess=()=>a(s.result),s.onerror=()=>r(s.error),l.oncomplete=()=>t.close()})}catch{return null}}function Xt(e){return we("readwrite",n=>n.put({...e,savedAt:Date.now()},ye))}function Jt(){return we("readonly",e=>e.get(ye))}function Qt(){return we("readwrite",e=>e.delete(ye))}function tr(){const{t:e}=P(),[n,t]=f.useState(null),[a,r]=f.useState({stitchWidth:50,colorCount:8,vividness:0,flipH:!1,flipV:!1,removeBackground:!1}),l=f.useCallback(E=>r(k=>({...k,...E})),[]),{stitchWidth:s}=a,[i,h]=f.useState(!1),[b,u]=f.useState([]),[d,x]=f.useState(!1),[D,C]=f.useState(null),[p,c]=f.useState(!1),[m,g]=f.useState(null),[v,B]=f.useState("pattern"),[y,S]=f.useState(null),[T,M]=f.useState(null),[_,L]=f.useState(!1),[A,N]=f.useState(!1),[Y,J]=f.useState(!1),K=f.useCallback(E=>{t(E),B("original")},[]),G=f.useMemo(()=>n&&n.width>0?Math.round(s*n.height/n.width):null,[n,s]),z=f.useMemo(()=>{if(!G)return o.jsx("p",{className:"bg-linen rounded-[12px] px-3.5 py-2.5 text-[13.5px] text-clay m-0",children:e.converter.size.unknown});const E=s*G,F=D?.stitched??Math.round(E*(n?.opaqueRatio??1)),j=E-F;return o.jsxs("div",{className:"bg-linen rounded-[12px] px-3.5 py-3",children:[o.jsx("div",{className:"font-mono text-[13px] text-cocoa",children:e.converter.size.grid(s,G)}),o.jsx("div",{className:"font-display font-medium text-[19px] text-ink leading-tight mt-0.5",children:e.converter.size.total(F)}),j>0&&o.jsxs("div",{className:"text-[12.5px] text-stone leading-snug mt-1",children:[e.converter.size.split(F,j),n?.hasAlpha&&o.jsxs(o.Fragment,{children:[" — ",e.converter.size.transparentNote]})]})]})},[e,s,G,D,n]);f.useEffect(()=>{let E=!1;return Jt().then(async k=>{if(E||!k)return L(!0);try{const F=URL.createObjectURL(k.photo),j=new Image;if(await new Promise(O=>{j.onload=()=>O(),j.onerror=()=>O(),j.src=F}),E)return;t({dataUrl:F,blob:k.photo,width:j.naturalWidth,height:j.naturalHeight,...He(j,j.naturalWidth,j.naturalHeight)}),r(O=>({...O,stitchWidth:k.stitchWidth,colorCount:k.colorCount,vividness:k.vividness??0,flipH:k.flipH??!1,flipV:k.flipV??!1,removeBackground:k.removeBackground??!1})),h(k.useCustomPalette),u(k.customThreadNums.map(le).filter(O=>!!O)),B("original")}finally{E||L(!0)}}),()=>{E=!0}},[]);const I=f.useCallback(async()=>{if(!n)return g("noImage");if(i&&b.length<a.colorCount)return g("notEnoughCustom");c(!0),g(null),C(null),B("pattern");try{const E=await qt(n.blob,{...a,palette:i?b:void 0});C(E),Xt({photo:n.blob,photoName:n.name??"photo",...a,useCustomPalette:i,customThreadNums:b.map(k=>k.num),substitutions:{}})}catch(E){console.error(E),g("generic")}finally{c(!1)}},[n,i,b,a]),Q=f.useCallback((E,k)=>{C(F=>{if(!F)return F;const j=F.threads.findIndex(cn=>cn.num===E.num);if(j<0)return F;const O=[...F.threads];return O[j]=k,{...F,threads:O}}),M(k)},[]),sn=()=>{t(null),C(null),g(null),M(null),Qt()},ln=f.useMemo(()=>D&&y?D.threads.findIndex(E=>E.num===y):-1,[D,y]),Z=f.useRef(null);return f.useEffect(()=>{Z.current&&Z.current!==n?.dataUrl&&URL.revokeObjectURL(Z.current),Z.current=n?.dataUrl?.startsWith("blob:")?n.dataUrl:null},[n]),o.jsxs("div",{className:"mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 py-10",children:[o.jsxs("div",{className:"flex items-end justify-between gap-4 flex-wrap mb-7",children:[o.jsxs("div",{children:[o.jsx("h1",{className:"text-[30px] sm:text-[34px] m-0",children:e.converter.title}),o.jsx("p",{className:"text-[15.5px] text-clay m-0 mt-1",children:e.converter.lead})]}),(n||D)&&o.jsx(w,{variant:"quiet",onClick:sn,children:e.converter.startOver})]}),m&&o.jsxs("div",{role:"alert",className:"mb-6 flex items-start gap-4 bg-coral-wash border-2 border-dashed border-coral-edge rounded-[16px] px-5 py-4",children:[o.jsx("p",{className:"flex-1 text-[15px] text-coral-deeper m-0",children:e.converter.errors[m]}),o.jsx("button",{type:"button",onClick:()=>g(null),className:"text-coral-deep text-sm font-bold cursor-pointer hover:text-coral-deeper shrink-0",children:e.converter.errors.dismiss})]}),o.jsxs("div",{className:"grid gap-7 lg:grid-cols-[296px_1fr] xl:grid-cols-[296px_1fr_312px]",children:[o.jsxs("div",{className:"flex flex-col gap-4",children:[o.jsx(kt,{settings:a,onChange:l,summary:z}),o.jsxs(_e,{className:"flex flex-col gap-3",children:[o.jsxs("div",{children:[o.jsx("span",{className:"block font-display font-medium text-[15px] text-ink",children:e.converter.custom.heading}),o.jsx("span",{className:"block text-[13px] text-stone leading-snug",children:i?e.converter.custom.toggleOn:e.converter.custom.toggleOff})]}),o.jsxs(w,{variant:"secondary",size:"sm",className:"w-full",onClick:()=>x(!0),children:[e.converter.custom.open,b.length>0&&` (${b.length})`]})]}),o.jsx(w,{size:"block",onClick:I,disabled:p||!n,children:p?e.converter.canvas.building:D?e.converter.recreate:e.converter.create})]}),o.jsxs("div",{className:"flex flex-col gap-6 lg:border-x-2 lg:border-dashed lg:border-edge-2 lg:px-7",children:[n?o.jsx(rt,{pattern:D,original:n.dataUrl,highlightIndex:ln,view:v,onViewChange:B,busy:p,onPhoto:K,aspect:n.width>0?n.width/n.height:1}):o.jsxs("div",{className:"flex flex-col gap-4",children:[o.jsx(Zn,{onPhoto:K}),o.jsx("p",{className:"font-hand text-sm text-sand text-center m-0",children:_?e.converter.canvas.note:e.converter.canvas.building})]}),D&&D.threads.length>0&&o.jsxs(o.Fragment,{children:[o.jsx(Kn,{pattern:D,onError:E=>g(E)}),Y?o.jsx("p",{className:"font-hand text-[15px] text-nile-deep text-center m-0",children:e.publish.done}):o.jsx(w,{variant:"secondary",size:"block",onClick:()=>N(!0),children:e.publish.open})]})]}),o.jsx("div",{className:"lg:col-span-2 xl:col-span-1",children:o.jsx(jt,{threads:D?.threads??[],onSelect:M,onHover:S})})]}),o.jsx(zn,{open:d,onClose:()=>x(!1),enabled:i,onEnabledChange:h,threads:b,onThreadsChange:u}),D&&o.jsx(Qn,{pattern:D,open:A,onClose:()=>N(!1),onPublished:()=>{N(!1),J(!0)}}),o.jsx(St,{thread:T,threads:D?.threads??[],onClose:()=>M(null),onReplace:Q})]})}export{tr as default};
