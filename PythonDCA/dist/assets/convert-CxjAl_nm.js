import{r as Je,j as r,c as G,u as R,a as f,R as Qe,b as oe,d as L,B as E,D as Ze,S as en,P as nn,e as tn,f as rn,C as on,g as U}from"./index-0H5uq2nl.js";Je();function Z({hex:e,width:n=28,height:t=38,radius:a=8,className:o}){return r.jsx("div",{className:G("bobbin-sm shrink-0",o),style:{width:n,height:t,borderRadius:a,background:e},"aria-hidden":"true"})}function ve({open:e,onClose:n,title:t,children:a,className:o}){const{t:l}=R();return f.useEffect(()=>{if(!e)return;const s=u=>{u.key==="Escape"&&n()};document.addEventListener("keydown",s);const i=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{document.removeEventListener("keydown",s),document.body.style.overflow=i}},[e,n]),e?r.jsx("div",{className:"fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm flex items-center justify-center p-4",onClick:n,children:r.jsxs("div",{role:"dialog","aria-modal":"true","aria-label":t,onClick:s=>s.stopPropagation(),className:G("bg-blanc rounded-[24px] shadow-screen w-full max-w-xl max-h-[90vh] overflow-y-auto scroll-linen animate-stitch-in",o),children:[r.jsxs("div",{className:"flex items-center justify-between gap-4 p-6 border-b-2 border-dashed border-edge-2 sticky top-0 bg-blanc rounded-t-[24px]",children:[r.jsx("h2",{className:"text-xl m-0",children:t}),r.jsx("button",{type:"button",onClick:n,"aria-label":l.converter.detail.close,className:"size-9 shrink-0 rounded-full bg-linen text-cocoa flex items-center justify-center cursor-pointer transition-colors hover:bg-coral hover:text-blanc",children:"✕"})]}),r.jsx("div",{className:"p-6",children:a})]})}):null}function W(e,n,{checkForDefaultPrevented:t=!0}={}){return function(o){if(e?.(o),t===!1||!o.defaultPrevented)return n?.(o)}}function de(e,n=[]){let t=[];function a(l,s){const i=f.createContext(s),u=t.length;t=[...t,s];const g=c=>{const{scope:x,children:D,...B}=c,d=x?.[e]?.[u]||i,m=f.useMemo(()=>B,Object.values(B));return r.jsx(d.Provider,{value:m,children:D})};g.displayName=l+"Provider";function h(c,x){const D=x?.[e]?.[u]||i,B=f.useContext(D);if(B)return B;if(s!==void 0)return s;throw new Error(`\`${c}\` must be used within \`${l}\``)}return[g,h]}const o=()=>{const l=t.map(s=>f.createContext(s));return function(i){const u=i?.[e]||l;return f.useMemo(()=>({[`__scope${e}`]:{...i,[e]:u}}),[i,u])}};return o.scopeName=e,[a,an(o,...n)]}function an(...e){const n=e[0];if(e.length===1)return n;const t=()=>{const a=e.map(o=>({useScope:o(),scopeName:o.scopeName}));return function(l){const s=a.reduce((i,{useScope:u,scopeName:g})=>{const c=u(l)[`__scope${g}`];return{...i,...c}},{});return f.useMemo(()=>({[`__scope${n.scopeName}`]:s}),[s])}};return t.scopeName=n.scopeName,t}var we=globalThis?.document?f.useLayoutEffect:()=>{},sn=Qe[" useInsertionEffect ".trim().toString()]||we;function Ee({prop:e,defaultProp:n,onChange:t=()=>{},caller:a}){const[o,l,s]=ln({defaultProp:n,onChange:t}),i=e!==void 0,u=i?e:o;{const h=f.useRef(e!==void 0);f.useEffect(()=>{const c=h.current;c!==i&&console.warn(`${a} is changing from ${c?"controlled":"uncontrolled"} to ${i?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),h.current=i},[i,a])}const g=f.useCallback(h=>{if(i){const c=cn(h)?h(e):h;c!==e&&s.current?.(c)}else l(h)},[i,e,l,s]);return[u,g]}function ln({defaultProp:e,onChange:n}){const[t,a]=f.useState(e),o=f.useRef(t),l=f.useRef(n);return sn(()=>{l.current=n},[n]),f.useEffect(()=>{o.current!==t&&(l.current?.(t),o.current=t)},[t,o]),[t,a,l]}function cn(e){return typeof e=="function"}function ke(e){const n=f.useRef({value:e,previous:e});return f.useMemo(()=>(n.current.value!==e&&(n.current.previous=n.current.value,n.current.value=e),n.current.previous),[e])}function Se(e){const[n,t]=f.useState(void 0);return we(()=>{if(e){t({width:e.offsetWidth,height:e.offsetHeight});const a=new ResizeObserver(o=>{if(!Array.isArray(o)||!o.length)return;const l=o[0];let s,i;if("borderBoxSize"in l){const u=l.borderBoxSize,g=Array.isArray(u)?u[0]:u;s=g.inlineSize,i=g.blockSize}else s=e.offsetWidth,i=e.offsetHeight;t({width:s,height:i})});return a.observe(e,{box:"border-box"}),()=>a.unobserve(e)}else t(void 0)},[e]),n}var dn=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],H=dn.reduce((e,n)=>{const t=oe(`Primitive.${n}`),a=f.forwardRef((o,l)=>{const{asChild:s,...i}=o,u=s?t:n;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),r.jsx(u,{...i,ref:l})});return a.displayName=`Primitive.${n}`,{...e,[n]:a}},{}),ne="Switch",[un,kt]=de(ne),[hn,mn]=un(ne),Ae=f.forwardRef((e,n)=>{const{__scopeSwitch:t,name:a,checked:o,defaultChecked:l,required:s,disabled:i,value:u="on",onCheckedChange:g,form:h,...c}=e,[x,D]=f.useState(null),B=L(n,y=>D(y)),d=f.useRef(!1),m=x?h||!!x.closest("form"):!0,[p,b]=Ee({prop:o,defaultProp:l??!1,onChange:g,caller:ne});return r.jsxs(hn,{scope:t,checked:p,disabled:i,children:[r.jsx(H.button,{type:"button",role:"switch","aria-checked":p,"aria-required":s,"data-state":Le(p),"data-disabled":i?"":void 0,disabled:i,value:u,...c,ref:B,onClick:W(e.onClick,y=>{b(C=>!C),m&&(d.current=y.isPropagationStopped(),d.current||y.stopPropagation())})}),m&&r.jsx(je,{control:x,bubbles:!d.current,name:a,value:u,checked:p,required:s,disabled:i,form:h,style:{transform:"translateX(-100%)"}})]})});Ae.displayName=ne;var Fe="SwitchThumb",Me=f.forwardRef((e,n)=>{const{__scopeSwitch:t,...a}=e,o=mn(Fe,t);return r.jsx(H.span,{"data-state":Le(o.checked),"data-disabled":o.disabled?"":void 0,...a,ref:n})});Me.displayName=Fe;var fn="SwitchBubbleInput",je=f.forwardRef(({__scopeSwitch:e,control:n,checked:t,bubbles:a=!0,...o},l)=>{const s=f.useRef(null),i=L(s,l),u=ke(t),g=Se(n);return f.useEffect(()=>{const h=s.current;if(!h)return;const c=window.HTMLInputElement.prototype,D=Object.getOwnPropertyDescriptor(c,"checked").set;if(u!==t&&D){const B=new Event("click",{bubbles:a});D.call(h,t),h.dispatchEvent(B)}},[u,t,a]),r.jsx("input",{type:"checkbox","aria-hidden":!0,defaultChecked:t,...o,tabIndex:-1,ref:i,style:{...o.style,...g,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})});je.displayName=fn;function Le(e){return e?"checked":"unchecked"}var gn=Ae,xn=Me;function ue({className:e,...n}){return r.jsx(gn,{className:G("peer inline-flex h-[30px] w-[52px] shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors","data-[state=checked]:bg-nile data-[state=unchecked]:bg-edge-5","disabled:cursor-not-allowed disabled:opacity-50",e),...n,children:r.jsx(xn,{className:"pointer-events-none block size-6 rounded-full bg-blanc shadow-[0_1px_4px_rgba(0,0,0,.2)] transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0"})})}const pn=`Ecru|Ecru/off-white|FFF7E7
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
S3820|Satin - Straw|DBA53E`,Q=new Float64Array(256);for(let e=0;e<256;e++){const n=e/255;Q[e]=n<=.04045?n/12.92:((n+.055)/1.055)**2.4}const Dn=.95047,Bn=1.08883,Cn=.008856,bn=7.787;function re(e){return e>Cn?Math.cbrt(e):bn*e+16/116}function Ge(e,n,t){const a=Q[e<0?0:e>255?255:e|0],o=Q[n<0?0:n>255?255:n|0],l=Q[t<0?0:t>255?255:t|0],s=re((a*.4124+o*.3576+l*.1805)/Dn),i=re(a*.2126+o*.7152+l*.0722),u=re((a*.0193+o*.1192+l*.9505)/Bn);return[116*i-16,500*(s-i),200*(i-u)]}function ae(e,n){const t=e[0]-n[0],a=e[1]-n[1],o=e[2]-n[2];return t*t+a*a+o*o}function yn(e){const n=parseInt(e.replace("#",""),16);return[n>>16&255,n>>8&255,n&255]}const he=pn.split(`
`).map(e=>{const[n,t,a]=e.split("|"),o=yn(a);return{num:n,name:t,hex:`#${a}`,rgb:o,lab:Ge(o[0],o[1],o[2])}}),vn=new Map(he.map(e=>[e.num.toLowerCase(),e]));function me(e){return vn.get(e.trim().toLowerCase())}function wn(e,n=he){const t=e.length;if(t===0)return[];const a=n.length,o=t*a,l=new Float64Array(o);for(let h=0;h<t;h++){const c=e[h];for(let x=0;x<a;x++)l[h*a+x]=ae(c,n[x].lab)}const s=new Int32Array(o);for(let h=0;h<o;h++)s[h]=h;s.sort((h,c)=>l[h]-l[c]);const i=new Array(t),u=new Uint8Array(a);let g=0;for(let h=0;h<o&&g<t;h++){const c=s[h],x=c/a|0,D=c-x*a;i[x]||u[D]||(i[x]=n[D],u[D]=1,g++)}for(let h=0;h<t;h++)if(!i[h]){let c=0,x=1/0;for(let D=0;D<n.length;D++){const B=ae(e[h],n[D].lab);B<x&&(x=B,c=D)}i[h]=n[c]}return i}function En(e,n,t=[]){const a=new Set([...t].map(o=>o.toLowerCase()));return he.filter(o=>!a.has(o.num.toLowerCase())).map(o=>({t:o,d:ae(e,o.lab)})).sort((o,l)=>o.d-l.d).slice(0,n).map(o=>o.t)}function kn(e){return e.split(",").map(n=>n.trim()).filter(Boolean)}function Sn({open:e,onClose:n,enabled:t,onEnabledChange:a,threads:o,onThreadsChange:l}){const{t:s}=R(),[i,u]=f.useState(null),[g,h]=f.useState(""),[c,x]=f.useState(null),D=()=>{const B=kn(g);if(B.length===0)return;if(i==="remove"){l(o.filter(b=>!B.includes(b.num))),h(""),u(null);return}x(null);const d=[...o];let m=0,p=0;for(const b of B){const y=me(b);y?d.some(C=>C.num===y.num)?p++:d.push(y):m++}l(d),h(""),m>0?x(s.converter.custom.notFound):p>0?x(s.converter.custom.already):u(null)};return r.jsx(ve,{open:e,onClose:n,title:s.converter.custom.title,children:r.jsxs("div",{className:"flex flex-col gap-5",children:[r.jsxs("label",{className:"flex items-center justify-between gap-4 bg-linen rounded-[16px] p-4 cursor-pointer",children:[r.jsxs("span",{children:[r.jsx("span",{className:"block text-base font-bold text-bark",children:s.converter.custom.toggle}),r.jsx("span",{className:"block text-sm text-stone",children:t?s.converter.custom.toggleOn:s.converter.custom.toggleOff})]}),r.jsx(ue,{checked:t,onCheckedChange:a})]}),r.jsxs("div",{children:[r.jsx("div",{className:"text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2",children:s.converter.custom.listLabel}),r.jsx("div",{className:"bg-linen border-[1.5px] border-edge-3 rounded-[16px] p-3 min-h-[120px] max-h-[220px] overflow-y-auto scroll-linen",children:o.length===0?r.jsx("span",{className:"text-sm text-stone",children:s.converter.custom.emptyList}):r.jsx("ul",{className:"flex flex-wrap gap-2 list-none p-0 m-0",children:o.map(B=>r.jsxs("li",{className:"flex items-center gap-2 rounded-[12px] bg-blanc border-[1.5px] border-edge-3 pl-2 pr-3 py-1.5",children:[r.jsx(Z,{hex:B.hex,width:16,height:22,radius:5}),r.jsx("span",{className:"text-sm font-mono font-bold",children:B.num})]},B.num))})})]}),i&&r.jsxs("div",{className:"border-t-2 border-dashed border-edge-2 pt-5",children:[r.jsx("label",{htmlFor:"custom-codes",className:"block text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2",children:s.converter.custom.inputLabel}),r.jsxs("div",{className:"flex gap-3 flex-wrap",children:[r.jsx("input",{id:"custom-codes",type:"text",value:g,onChange:B=>h(B.target.value),onKeyDown:B=>B.key==="Enter"&&D(),placeholder:s.converter.custom.placeholder,className:`flex-1 min-w-[160px] text-base bg-linen border-[1.5px] rounded-[14px] px-4 py-3 outline-none transition-colors focus:bg-blanc ${i==="add"?"border-edge-3 focus:border-coral":"border-coral-edge focus:border-coral-deep"}`}),r.jsx(E,{size:"sm",onClick:D,children:s.converter.custom.validate}),r.jsx(E,{variant:"secondary",size:"sm",onClick:()=>{u(null),h(""),x(null)},children:s.converter.custom.cancel})]})]}),c&&r.jsx("p",{className:"bg-coral-wash border-[1.5px] border-coral-edge text-coral-deeper rounded-[14px] px-4 py-3 text-sm m-0",children:c}),r.jsxs("div",{className:"flex gap-2 flex-wrap pt-1",children:[r.jsx(E,{variant:"secondary",size:"sm",className:"flex-1 min-w-[110px]",onClick:()=>{u("add"),x(null)},children:s.converter.custom.add}),r.jsx(E,{variant:"secondary",size:"sm",className:"flex-1 min-w-[110px]",disabled:o.length===0,onClick:()=>{u("remove"),x(null)},children:s.converter.custom.remove}),r.jsx(E,{variant:"secondary",size:"sm",className:"flex-1 min-w-[110px]",disabled:o.length===0,onClick:()=>{l([]),x(null)},children:s.converter.custom.reset})]})]})})}function pe({className:e,...n}){return r.jsx("div",{className:G("bg-blanc rounded-[18px] shadow-soft p-5",e),...n})}function Ne({className:e,...n}){return r.jsx("div",{className:G("font-display font-medium text-[17px] text-ink",e),...n})}function De({className:e,...n}){return r.jsx("span",{className:G("text-[12.5px] font-extrabold tracking-[.05em] uppercase text-cocoa",e),...n})}function Be({className:e,...n}){return r.jsx("span",{className:G("font-mono text-[13.5px] font-bold bg-linen rounded-[7px] px-2.5 py-0.5 text-ink",e),...n})}function An(e,n){const t=document.createElement("canvas");t.width=e,t.height=n;const a=t.getContext("2d");if(!a)throw new Error("canvas 2d context unavailable");return a.imageSmoothingEnabled=!1,[t,a]}function Fn(e){const n=new ImageData(e.width,e.height),t=n.data,a=new Uint8Array(e.threads.length),o=new Uint8Array(e.threads.length),l=new Uint8Array(e.threads.length);e.threads.forEach((s,i)=>{a[i]=s.rgb[0],o[i]=s.rgb[1],l[i]=s.rgb[2]});for(let s=0;s<e.cells.length;s++){const i=e.cells[s];i<0||(t[s*4]=a[i],t[s*4+1]=o[i],t[s*4+2]=l[i],t[s*4+3]=255)}return n}function Mn(e,n){const t=new ImageData(e.width,e.height),a=t.data;for(let o=0;o<e.cells.length;o++)e.cells[o]===n&&(a[o*4]=255,a[o*4+1]=255,a[o*4+2]=255,a[o*4+3]=255);return t}function jn(e,n={}){const t=n.cellSize??14,a=n.grid??!0,o=n.legend??!0,l=n.heavyEvery??10,s=n.background??"#EBE2D7",i=e.width*t,u=e.height*t,g=Math.round(t*1.5),h=Math.max(1,Math.min(4,Math.floor(i/190))),c=Math.max(26,Math.round(t*1.6)),x=o?Math.ceil(e.threads.length/h):0,D=o?x*c+g*2:0,[B,d]=An(i+g*2,u+g*2+D);d.fillStyle=s,d.fillRect(0,0,B.width,B.height);for(let m=0;m<e.height;m++)for(let p=0;p<e.width;p++){const b=e.cells[m*e.width+p];b<0||(d.fillStyle=e.threads[b].hex,d.fillRect(g+p*t,g+m*t,t,t))}if(a){d.lineWidth=1,d.strokeStyle="rgba(30,25,20,.35)",d.beginPath();for(let m=0;m<=e.width;m++){const p=g+m*t+.5;d.moveTo(p,g),d.lineTo(p,g+u)}for(let m=0;m<=e.height;m++){const p=g+m*t+.5;d.moveTo(g,p),d.lineTo(g+i,p)}d.stroke(),d.lineWidth=2,d.strokeStyle="rgba(20,16,12,.85)",d.beginPath();for(let m=0;m<=e.width;m+=l){const p=g+m*t;d.moveTo(p,g),d.lineTo(p,g+u)}for(let m=0;m<=e.height;m+=l){const p=g+m*t;d.moveTo(g,p),d.lineTo(g+i,p)}d.stroke()}if(o&&e.threads.length){const m=g*2+u;d.strokeStyle="rgba(20,16,12,.45)",d.lineWidth=2,d.beginPath(),d.moveTo(g,m-g/2),d.lineTo(B.width-g,m-g/2),d.stroke();const p=i/h,b=Math.round(c*.62);d.textBaseline="middle",d.font=`600 ${Math.round(c*.44)}px "Nunito Sans", system-ui, sans-serif`,e.threads.forEach((y,C)=>{const k=C%h,S=Math.floor(C/h),A=g+k*p,V=m+S*c+c/2;d.fillStyle=y.hex,d.fillRect(A,V-b/2,b,b),d.strokeStyle="rgba(20,16,12,.55)",d.lineWidth=1,d.strokeRect(A+.5,V-b/2+.5,b-1,b-1),d.fillStyle="#33261A";const K=`DMC ${y.num}`;d.fillText(K,A+b+8,V),d.fillStyle="rgba(51,38,26,.6)",d.fillText(`${e.counts[C]} pts`,A+b+8+d.measureText(K).width+10,V)})}return B}function Ln(e){return new Promise((n,t)=>{e.toBlob(a=>a?n(a):t(new Error("toBlob failed")),"image/png")})}function Ce({label:e,hint:n,checked:t,onChange:a}){return r.jsxs("label",{className:"flex items-center justify-between gap-4 cursor-pointer",children:[r.jsxs("span",{children:[r.jsx("span",{className:"block text-[15px] font-bold text-bark",children:e}),r.jsx("span",{className:"block text-[13px] text-stone",children:n})]}),r.jsx(ue,{checked:t,onCheckedChange:a})]})}function Gn({pattern:e,onError:n}){const{t}=R(),[a,o]=f.useState(!0),[l,s]=f.useState(!0),[i,u]=f.useState("#EBE2D7"),[g,h]=f.useState(!1),c=async()=>{h(!0);try{const x=jn(e,{cellSize:14,grid:a,legend:l,background:i}),D=await Ln(x),B=URL.createObjectURL(D),d=document.createElement("a");d.href=B,d.download="BroderieDMC.png",document.body.appendChild(d),d.click(),d.remove(),URL.revokeObjectURL(B)}catch{n("download")}finally{h(!1)}};return r.jsxs("div",{className:"bg-blanc rounded-[18px] shadow-soft p-5 flex flex-col gap-4",children:[r.jsx(Ne,{children:t.converter.download.heading}),r.jsx(Ce,{label:t.converter.download.grid,hint:t.converter.download.gridHint,checked:a,onChange:o}),r.jsx(Ce,{label:t.converter.download.legend,hint:t.converter.download.legendHint,checked:l,onChange:s}),r.jsxs("label",{className:"flex items-center justify-between gap-4",children:[r.jsx("span",{className:"text-[15px] font-bold text-bark",children:t.converter.download.background}),r.jsxs("span",{className:"flex items-center gap-2.5",children:[r.jsx("span",{className:"font-mono text-xs text-stone",children:i.toUpperCase()}),r.jsx("input",{type:"color",value:i,onChange:x=>u(x.target.value),className:"w-12 h-9 rounded-[10px] border-[1.5px] border-edge-3 cursor-pointer bg-transparent p-0"})]})]}),r.jsxs(E,{size:"block",onClick:c,disabled:g,children:[r.jsx(Ze,{}),g?t.converter.download.working:t.converter.download.button]}),r.jsx("p",{className:"font-hand text-sm text-sand text-center m-0",children:t.converter.download.note})]})}function se(e,n){if(!e.type.startsWith("image/"))return;const t=new FileReader;t.onload=a=>{const o=a.target?.result;if(typeof o!="string")return;const l=new Image,s=(i,u)=>n({dataUrl:o,blob:e,name:e.name,width:i,height:u});l.onload=()=>s(l.naturalWidth,l.naturalHeight),l.onerror=()=>s(0,0),l.src=o},t.readAsDataURL(e)}function Nn({onPhoto:e}){const{t:n}=R(),[t,a]=f.useState(!1),o=f.useId(),l=f.useCallback(i=>{i.preventDefault(),i.stopPropagation(),a(!1);const u=i.dataTransfer.files?.[0];u&&se(u,e)},[e]),s=i=>{i.preventDefault(),i.stopPropagation()};return r.jsxs("div",{className:G("relative aida [--aida-size:14px] [--aida-ink:.07] rounded-[22px] border-[2.5px] border-dashed","flex flex-col items-center gap-3 p-7 text-center transition-colors cursor-pointer",t?"border-coral bg-[#FBF5E9]":"border-coral-dash bg-[#F7F1E5] hover:border-coral"),onDragEnter:i=>{s(i),a(!0)},onDragOver:s,onDragLeave:i=>{s(i),a(!1)},onDrop:l,children:[r.jsx(en,{size:40}),r.jsx("div",{className:"font-display font-semibold text-[20px] text-ink",children:n.converter.upload.drop}),r.jsxs("div",{className:"text-[15px] text-cocoa",children:[n.converter.upload.browseBefore,r.jsx("label",{htmlFor:o,className:"text-coral-deep font-bold underline decoration-dotted decoration-2 underline-offset-4 cursor-pointer",children:n.converter.upload.browse}),n.converter.upload.browseAfter]}),r.jsx("div",{className:"font-hand text-sm text-sand",children:n.converter.upload.hint}),r.jsx("input",{id:o,type:"file",accept:"image/*",className:"absolute inset-0 size-full opacity-0 cursor-pointer",onChange:i=>{const u=i.target.files?.[0];u&&se(u,e),i.target.value=""}})]})}function Pn({onPhoto:e,className:n}){const{t}=R(),a=f.useRef(null);return r.jsxs(r.Fragment,{children:[r.jsx(E,{variant:"secondary",size:"sm",className:n,onClick:()=>a.current?.click(),children:t.converter.upload.replace}),r.jsx("input",{ref:a,type:"file",accept:"image/*",className:"sr-only",onChange:o=>{const l=o.target.files?.[0];l&&se(l,e),o.target.value=""}})]})}const q=450;function be(e){const n=f.useRef(null);return f.useEffect(()=>{const t=n.current;!t||!e||(t.width=e.width,t.height=e.height,t.getContext("2d")?.putImageData(e,0,0))},[e]),n}function Rn({pattern:e,original:n,highlightIndex:t,view:a,onViewChange:o,busy:l,onPhoto:s,aspect:i=1}){const{t:u}=R(),g=be(e?Fn(e):null),h=be(e&&t>=0?Mn(e,t):null),c=a==="pattern"&&e,x=a==="original"&&n;return r.jsxs("div",{className:"flex flex-col gap-4 items-center",children:[r.jsx("div",{className:"flex bg-blanc border-[1.5px] border-edge-3 rounded-full p-1",children:["original","pattern"].map(D=>r.jsx("button",{type:"button",onClick:()=>o(D),disabled:D==="original"?!n:!e&&!l,"aria-pressed":a===D,className:G("font-display text-sm px-[18px] py-2 rounded-full cursor-pointer transition-colors disabled:cursor-not-allowed disabled:text-edge-5",a===D?"bg-ink text-blanc":"text-cocoa hover:text-coral-deep"),children:u.converter.canvas[D]},D))}),r.jsx("div",{className:"w-full overflow-auto scroll-linen flex justify-center",children:r.jsx("div",{className:"aida [--aida-size:22.5px] [--aida-ink:.09] bg-aida rounded-[20px] p-6 shadow-[inset_0_2px_10px_rgba(83,63,42,.09)] shrink-0",children:c?r.jsxs("div",{className:"relative",style:{width:q},children:[r.jsx("canvas",{ref:g,"aria-label":u.converter.canvas.pattern,role:"img",style:{imageRendering:"pixelated",width:q},className:"block h-auto rounded-[6px]"}),t>=0&&r.jsx("canvas",{ref:h,"aria-hidden":"true",style:{imageRendering:"pixelated",width:q},className:"absolute inset-0 h-auto rounded-[6px] pointer-events-none mix-blend-lighten animate-mask-glow"})]}):x?r.jsx("img",{src:n,alt:u.converter.canvas.original,style:{width:q},className:"block h-auto rounded-[6px]"}):l?r.jsx("div",{className:"relative overflow-hidden rounded-[6px] bg-[#F3ECDC]/60",style:{width:q,height:Math.round(q/(i||1))},role:"status","aria-label":u.converter.canvas.building,children:r.jsx("div",{className:"absolute inset-0 scale-150 bg-gradient-to-r from-transparent via-white/55 to-transparent animate-shine"})}):r.jsxs("div",{className:"flex flex-col items-center justify-center gap-4 text-center",style:{width:q,minHeight:320},children:[r.jsx("div",{className:"opacity-35",children:r.jsx(nn,{pixels:rn,cols:tn,size:14,radius:2})}),r.jsxs("div",{children:[r.jsx("div",{className:"font-display font-medium text-[17px] text-cocoa",children:u.converter.canvas.empty}),r.jsx("div",{className:"font-hand text-sm text-sand mt-1",children:u.converter.canvas.emptyHint})]})]})})}),a==="original"&&r.jsx(Pn,{onPhoto:s}),r.jsx("p",{className:"font-hand text-sm text-sand text-center m-0",children:l?u.converter.canvas.building:u.converter.canvas.note})]})}function Vn({thread:e,threads:n,onClose:t,onReplace:a}){const{t:o}=R(),[l,s]=f.useState([]),[i,u]=f.useState(!1),[g,h]=f.useState(""),[c,x]=f.useState(null);if(f.useEffect(()=>{s([]),u(!1),h(""),x(null)},[e?.num]),!e)return null;const D=()=>{x(null),s(En(e.lab,3,n.map(d=>d.num)))},B=()=>{const d=g.trim();if(!d)return;x(null);const m=me(d);m?n.some(p=>p.num===m.num)?x(o.converter.custom.already):(s(p=>[...p,m].slice(-3)),h(""),u(!1)):x(o.converter.custom.notFound)};return r.jsx(ve,{open:!0,onClose:t,title:o.converter.detail.title,className:"max-w-2xl",children:r.jsxs("div",{className:"flex flex-col gap-6",children:[r.jsxs("div",{className:"flex items-center gap-4",children:[r.jsx(Z,{hex:e.hex,width:54,height:72,radius:12,className:"bobbin"}),r.jsxs("div",{className:"flex-1 min-w-0",children:[r.jsxs("span",{className:"inline-block text-sm font-extrabold bg-linen rounded-full px-3 py-1 mb-2",children:["DMC ",e.num]}),r.jsx("p",{className:"text-[18px] font-medium text-ink m-0",children:e.name}),r.jsx("p",{className:"text-sm text-stone font-mono m-0",children:e.hex})]})]}),l.length>0&&r.jsxs("div",{className:"border-t-2 border-dashed border-edge-2 pt-5",children:[r.jsx("h3",{className:"text-[13px] font-extrabold tracking-[.06em] uppercase text-sand mb-3.5 font-body",children:o.converter.detail.alternatives}),r.jsx("div",{className:"grid sm:grid-cols-3 gap-3",children:l.map(d=>r.jsxs("div",{className:"flex flex-col items-center gap-3 p-4 rounded-[16px] bg-linen border-[1.5px] border-edge-3",children:[r.jsx(Z,{hex:d.hex,width:40,height:54,radius:10}),r.jsxs("div",{className:"text-center min-w-0 w-full",children:[r.jsxs("span",{className:"inline-block text-xs font-extrabold bg-blanc border-[1.5px] border-edge-3 rounded-full px-2 py-0.5 mb-1",children:["DMC ",d.num]}),r.jsx("p",{className:"text-sm font-medium truncate m-0",children:d.name}),r.jsx("p",{className:"text-xs text-stone font-mono m-0",children:d.hex})]}),r.jsx(E,{size:"sm",className:"w-full",onClick:()=>a(e,d),children:o.converter.detail.replace})]},d.num))})]}),i&&r.jsxs("div",{className:"border-t-2 border-dashed border-edge-2 pt-5",children:[r.jsx("label",{htmlFor:"thread-code",className:"block text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2",children:o.converter.custom.inputLabel}),r.jsxs("div",{className:"flex gap-3 flex-wrap",children:[r.jsx("input",{id:"thread-code",type:"text",value:g,onChange:d=>h(d.target.value),onKeyDown:d=>d.key==="Enter"&&B(),placeholder:"702",className:"flex-1 min-w-[140px] text-base bg-linen border-[1.5px] border-edge-3 rounded-[14px] px-4 py-3 outline-none transition-colors focus:border-coral focus:bg-blanc"}),r.jsx(E,{size:"sm",onClick:B,children:o.converter.custom.validate}),r.jsx(E,{variant:"secondary",size:"sm",onClick:()=>{u(!1),h("")},children:o.converter.custom.cancel})]})]}),c&&r.jsx("p",{className:"bg-coral-wash border-[1.5px] border-coral-edge text-coral-deeper rounded-[14px] px-4 py-3 text-sm m-0",children:c}),r.jsxs("div",{className:"flex gap-3 flex-wrap",children:[r.jsx(E,{className:"flex-1 min-w-[200px]",onClick:D,children:o.converter.detail.findSimilar}),r.jsx(E,{variant:"secondary",className:"flex-1 min-w-[200px]",onClick:()=>u(!0),children:o.converter.detail.setColor})]}),r.jsx("div",{className:"border-t-2 border-dashed border-edge-2 pt-5",children:r.jsx(E,{asChild:!0,variant:"secondary",size:"block",children:r.jsx("a",{href:`https://www.etsy.com/fr/search?q=DMC+${encodeURIComponent(e.num)}&ref=search_bar`,target:"_blank",rel:"noreferrer noopener",children:o.converter.detail.buy})})})]})})}const Tn=7;function In({threads:e,onSelect:n,onHover:t}){const{t:a}=R();return r.jsxs("div",{className:"flex flex-col gap-3",children:[r.jsxs("div",{className:"flex justify-between items-baseline gap-2",children:[r.jsx("span",{className:"font-display font-medium text-[17px]",children:a.converter.threads.heading}),e.length>0&&r.jsx("span",{className:"text-[13px] font-extrabold text-cocoa bg-blanc border-[1.5px] border-edge-3 rounded-full px-3 py-1",children:a.converter.threads.count(e.length)})]}),e.length===0?r.jsx("p",{className:"text-sm text-stone m-0",children:a.converter.threads.empty}):r.jsxs("div",{className:"relative",children:[r.jsx("ul",{className:"flex flex-col gap-2 list-none p-0 m-0 max-h-[min(52vh,560px)] overflow-y-auto scroll-linen pr-1.5",children:e.map(o=>r.jsx("li",{children:r.jsxs("div",{className:"bg-blanc border-[1.5px] border-edge rounded-[14px] px-3 py-2.5 flex items-center gap-3 transition-colors hover:border-taupe",onMouseEnter:()=>t(o.num),onMouseLeave:()=>t(null),children:[r.jsx(Z,{hex:o.hex}),r.jsxs("div",{className:"flex-1 min-w-0",children:[r.jsxs("div",{className:"text-[13.5px] font-extrabold",children:["DMC ",o.num]}),r.jsx("div",{className:"text-xs text-stone truncate",children:o.name})]}),r.jsx("button",{type:"button",onClick:()=>n(o),"aria-label":a.converter.threads.swapAria(o.num),className:"size-[30px] shrink-0 rounded-full bg-linen border-[1.5px] border-edge-3 flex items-center justify-center cursor-pointer transition-colors hover:border-coral",children:r.jsx(on,{})})]})},o.num))}),e.length>Tn&&r.jsx("div",{"aria-hidden":"true",className:"pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-linen to-transparent"})]}),e.length>0&&r.jsx("p",{className:"text-[13px] leading-snug text-stone text-center m-0",children:a.converter.threads.hints})]})}function Pe(e,[n,t]){return Math.min(t,Math.max(n,e))}var _n=f.createContext(void 0);function On(e){const n=f.useContext(_n);return e||n||"ltr"}function zn(e){const n=e+"CollectionProvider",[t,a]=de(n),[o,l]=t(n,{collectionRef:{current:null},itemMap:new Map}),s=d=>{const{scope:m,children:p}=d,b=U.useRef(null),y=U.useRef(new Map).current;return r.jsx(o,{scope:m,itemMap:y,collectionRef:b,children:p})};s.displayName=n;const i=e+"CollectionSlot",u=oe(i),g=U.forwardRef((d,m)=>{const{scope:p,children:b}=d,y=l(i,p),C=L(m,y.collectionRef);return r.jsx(u,{ref:C,children:b})});g.displayName=i;const h=e+"CollectionItemSlot",c="data-radix-collection-item",x=oe(h),D=U.forwardRef((d,m)=>{const{scope:p,children:b,...y}=d,C=U.useRef(null),k=L(m,C),S=l(h,p);return U.useEffect(()=>(S.itemMap.set(C,{ref:C,...y}),()=>void S.itemMap.delete(C))),r.jsx(x,{[c]:"",ref:k,children:b})});D.displayName=h;function B(d){const m=l(e+"CollectionConsumer",d);return U.useCallback(()=>{const b=m.collectionRef.current;if(!b)return[];const y=Array.from(b.querySelectorAll(`[${c}]`));return Array.from(m.itemMap.values()).sort((S,A)=>y.indexOf(S.ref.current)-y.indexOf(A.ref.current))},[m.collectionRef,m.itemMap])}return[{Provider:s,Slot:g,ItemSlot:D},B,a]}var Re=["PageUp","PageDown"],Ve=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],Te={"from-left":["Home","PageDown","ArrowDown","ArrowLeft"],"from-right":["Home","PageDown","ArrowDown","ArrowRight"],"from-bottom":["Home","PageDown","ArrowDown","ArrowLeft"],"from-top":["Home","PageDown","ArrowUp","ArrowLeft"]},Y="Slider",[ie,Un,qn]=zn(Y),[Ie,St]=de(Y,[qn]),[Wn,te]=Ie(Y),_e=f.forwardRef((e,n)=>{const{name:t,min:a=0,max:o=100,step:l=1,orientation:s="horizontal",disabled:i=!1,minStepsBetweenThumbs:u=0,defaultValue:g=[a],value:h,onValueChange:c=()=>{},onValueCommit:x=()=>{},inverted:D=!1,form:B,...d}=e,m=f.useRef(new Set),p=f.useRef(0),y=s==="horizontal"?Hn:Kn,[C=[],k]=Ee({prop:h,defaultProp:g,onChange:w=>{[...m.current][p.current]?.focus(),c(w)}}),S=f.useRef(C);function A(w){const j=Qn(C,w);M(w,j)}function V(w){M(w,p.current)}function K(){const w=S.current[p.current];C[p.current]!==w&&x(C)}function M(w,j,{commit:$}={commit:!1}){const X=tt(l),J=rt(Math.round((w-a)/l)*l+a,X),_=Pe(J,[a,o]);k((T=[])=>{const N=Xn(T,_,j);if(nt(N,u*l)){p.current=N.indexOf(_);const O=String(N)!==String(T);return O&&$&&x(N),O?N:T}else return T})}return r.jsx(Wn,{scope:e.__scopeSlider,name:t,disabled:i,min:a,max:o,valueIndexToChangeRef:p,thumbs:m.current,values:C,orientation:s,form:B,children:r.jsx(ie.Provider,{scope:e.__scopeSlider,children:r.jsx(ie.Slot,{scope:e.__scopeSlider,children:r.jsx(y,{"aria-disabled":i,"data-disabled":i?"":void 0,...d,ref:n,onPointerDown:W(d.onPointerDown,()=>{i||(S.current=C)}),min:a,max:o,inverted:D,onSlideStart:i?void 0:A,onSlideMove:i?void 0:V,onSlideEnd:i?void 0:K,onHomeKeyDown:()=>!i&&M(a,0,{commit:!0}),onEndKeyDown:()=>!i&&M(o,C.length-1,{commit:!0}),onStepKeyDown:({event:w,direction:j})=>{if(!i){const J=Re.includes(w.key)||w.shiftKey&&Ve.includes(w.key)?10:1,_=p.current,T=C[_],N=l*J*j;M(T+N,_,{commit:!0})}}})})})})});_e.displayName=Y;var[Oe,ze]=Ie(Y,{startEdge:"left",endEdge:"right",size:"width",direction:1}),Hn=f.forwardRef((e,n)=>{const{min:t,max:a,dir:o,inverted:l,onSlideStart:s,onSlideMove:i,onSlideEnd:u,onStepKeyDown:g,...h}=e,[c,x]=f.useState(null),D=L(n,y=>x(y)),B=f.useRef(void 0),d=On(o),m=d==="ltr",p=m&&!l||!m&&l;function b(y){const C=B.current||c.getBoundingClientRect(),k=[0,C.width],A=fe(k,p?[t,a]:[a,t]);return B.current=C,A(y-C.left)}return r.jsx(Oe,{scope:e.__scopeSlider,startEdge:p?"left":"right",endEdge:p?"right":"left",direction:p?1:-1,size:"width",children:r.jsx(Ue,{dir:d,"data-orientation":"horizontal",...h,ref:D,style:{...h.style,"--radix-slider-thumb-transform":"translateX(-50%)"},onSlideStart:y=>{const C=b(y.clientX);s?.(C)},onSlideMove:y=>{const C=b(y.clientX);i?.(C)},onSlideEnd:()=>{B.current=void 0,u?.()},onStepKeyDown:y=>{const k=Te[p?"from-left":"from-right"].includes(y.key);g?.({event:y,direction:k?-1:1})}})})}),Kn=f.forwardRef((e,n)=>{const{min:t,max:a,inverted:o,onSlideStart:l,onSlideMove:s,onSlideEnd:i,onStepKeyDown:u,...g}=e,h=f.useRef(null),c=L(n,h),x=f.useRef(void 0),D=!o;function B(d){const m=x.current||h.current.getBoundingClientRect(),p=[0,m.height],y=fe(p,D?[a,t]:[t,a]);return x.current=m,y(d-m.top)}return r.jsx(Oe,{scope:e.__scopeSlider,startEdge:D?"bottom":"top",endEdge:D?"top":"bottom",size:"height",direction:D?1:-1,children:r.jsx(Ue,{"data-orientation":"vertical",...g,ref:c,style:{...g.style,"--radix-slider-thumb-transform":"translateY(50%)"},onSlideStart:d=>{const m=B(d.clientY);l?.(m)},onSlideMove:d=>{const m=B(d.clientY);s?.(m)},onSlideEnd:()=>{x.current=void 0,i?.()},onStepKeyDown:d=>{const p=Te[D?"from-bottom":"from-top"].includes(d.key);u?.({event:d,direction:p?-1:1})}})})}),Ue=f.forwardRef((e,n)=>{const{__scopeSlider:t,onSlideStart:a,onSlideMove:o,onSlideEnd:l,onHomeKeyDown:s,onEndKeyDown:i,onStepKeyDown:u,...g}=e,h=te(Y,t);return r.jsx(H.span,{...g,ref:n,onKeyDown:W(e.onKeyDown,c=>{c.key==="Home"?(s(c),c.preventDefault()):c.key==="End"?(i(c),c.preventDefault()):Re.concat(Ve).includes(c.key)&&(u(c),c.preventDefault())}),onPointerDown:W(e.onPointerDown,c=>{const x=c.target;x.setPointerCapture(c.pointerId),c.preventDefault(),h.thumbs.has(x)?x.focus():a(c)}),onPointerMove:W(e.onPointerMove,c=>{c.target.hasPointerCapture(c.pointerId)&&o(c)}),onPointerUp:W(e.onPointerUp,c=>{const x=c.target;x.hasPointerCapture(c.pointerId)&&(x.releasePointerCapture(c.pointerId),l(c))})})}),qe="SliderTrack",We=f.forwardRef((e,n)=>{const{__scopeSlider:t,...a}=e,o=te(qe,t);return r.jsx(H.span,{"data-disabled":o.disabled?"":void 0,"data-orientation":o.orientation,...a,ref:n})});We.displayName=qe;var le="SliderRange",He=f.forwardRef((e,n)=>{const{__scopeSlider:t,...a}=e,o=te(le,t),l=ze(le,t),s=f.useRef(null),i=L(n,s),u=o.values.length,g=o.values.map(x=>Ye(x,o.min,o.max)),h=u>1?Math.min(...g):0,c=100-Math.max(...g);return r.jsx(H.span,{"data-orientation":o.orientation,"data-disabled":o.disabled?"":void 0,...a,ref:i,style:{...e.style,[l.startEdge]:h+"%",[l.endEdge]:c+"%"}})});He.displayName=le;var ce="SliderThumb",Ke=f.forwardRef((e,n)=>{const t=Un(e.__scopeSlider),[a,o]=f.useState(null),l=L(n,i=>o(i)),s=f.useMemo(()=>a?t().findIndex(i=>i.ref.current===a):-1,[t,a]);return r.jsx($n,{...e,ref:l,index:s})}),$n=f.forwardRef((e,n)=>{const{__scopeSlider:t,index:a,name:o,...l}=e,s=te(ce,t),i=ze(ce,t),[u,g]=f.useState(null),h=L(n,b=>g(b)),c=u?s.form||!!u.closest("form"):!0,x=Se(u),D=s.values[a],B=D===void 0?0:Ye(D,s.min,s.max),d=Jn(a,s.values.length),m=x?.[i.size],p=m?Zn(m,B,i.direction):0;return f.useEffect(()=>{if(u)return s.thumbs.add(u),()=>{s.thumbs.delete(u)}},[u,s.thumbs]),r.jsxs("span",{style:{transform:"var(--radix-slider-thumb-transform)",position:"absolute",[i.startEdge]:`calc(${B}% + ${p}px)`},children:[r.jsx(ie.ItemSlot,{scope:e.__scopeSlider,children:r.jsx(H.span,{role:"slider","aria-label":e["aria-label"]||d,"aria-valuemin":s.min,"aria-valuenow":D,"aria-valuemax":s.max,"aria-orientation":s.orientation,"data-orientation":s.orientation,"data-disabled":s.disabled?"":void 0,tabIndex:s.disabled?void 0:0,...l,ref:h,style:D===void 0?{display:"none"}:e.style,onFocus:W(e.onFocus,()=>{s.valueIndexToChangeRef.current=a})})}),c&&r.jsx($e,{name:o??(s.name?s.name+(s.values.length>1?"[]":""):void 0),form:s.form,value:D},a)]})});Ke.displayName=ce;var Yn="RadioBubbleInput",$e=f.forwardRef(({__scopeSlider:e,value:n,...t},a)=>{const o=f.useRef(null),l=L(o,a),s=ke(n);return f.useEffect(()=>{const i=o.current;if(!i)return;const u=window.HTMLInputElement.prototype,h=Object.getOwnPropertyDescriptor(u,"value").set;if(s!==n&&h){const c=new Event("input",{bubbles:!0});h.call(i,n),i.dispatchEvent(c)}},[s,n]),r.jsx(H.input,{style:{display:"none"},...t,ref:l,defaultValue:n})});$e.displayName=Yn;function Xn(e=[],n,t){const a=[...e];return a[t]=n,a.sort((o,l)=>o-l)}function Ye(e,n,t){const l=100/(t-n)*(e-n);return Pe(l,[0,100])}function Jn(e,n){return n>2?`Value ${e+1} of ${n}`:n===2?["Minimum","Maximum"][e]:void 0}function Qn(e,n){if(e.length===1)return 0;const t=e.map(o=>Math.abs(o-n)),a=Math.min(...t);return t.indexOf(a)}function Zn(e,n,t){const a=e/2,l=fe([0,50],[0,a]);return(a-l(n)*t)*t}function et(e){return e.slice(0,-1).map((n,t)=>e[t+1]-n)}function nt(e,n){if(n>0){const t=et(e);return Math.min(...t)>=n}return!0}function fe(e,n){return t=>{if(e[0]===e[1]||n[0]===n[1])return n[0];const a=(n[1]-n[0])/(e[1]-e[0]);return n[0]+a*(t-e[0])}}function tt(e){return(String(e).split(".")[1]||"").length}function rt(e,n){const t=Math.pow(10,n);return Math.round(e*t)/t}var ot=_e,at=We,st=He,it=Ke;function ye({className:e,...n}){return r.jsxs(ot,{className:G("relative flex w-full touch-none select-none items-center h-[26px] cursor-pointer data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",e),...n,children:[r.jsx(at,{className:"relative h-2 w-full grow overflow-hidden rounded-full bg-aida",children:r.jsx(st,{className:"absolute h-full bg-coral"})}),r.jsx(it,{className:"block size-[26px] rounded-full border-[3px] border-coral bg-blanc shadow-[0_2px_8px_rgba(83,63,42,.18)] transition-transform hover:scale-105 focus-visible:scale-105 cursor-grab active:cursor-grabbing"})]})}function lt(e){let n=e>>>0;return()=>{n=n+1831565813>>>0;let t=n;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}const ct=60,dt=42;function ut(e,n){const t=e.length/3;if(t===0||n<=0)return{centroids:new Float64Array(0),labels:new Int32Array(0)};const a=ht(e,t);n=Math.min(n,a);const o=lt(dt),l=mt(e,t,n,o),s=new Int32Array(t),i=new Float64Array(n*3),u=new Int32Array(n);for(let g=0;g<ct;g++){let h=!1;for(let c=0;c<t;c++){const x=e[c*3],D=e[c*3+1],B=e[c*3+2];let d=0,m=1/0;for(let p=0;p<n;p++){const b=x-l[p*3],y=D-l[p*3+1],C=B-l[p*3+2],k=b*b+y*y+C*C;k<m&&(m=k,d=p)}s[c]!==d&&(s[c]=d,h=!0)}i.fill(0),u.fill(0);for(let c=0;c<t;c++){const x=s[c];i[x*3]+=e[c*3],i[x*3+1]+=e[c*3+1],i[x*3+2]+=e[c*3+2],u[x]++}for(let c=0;c<n;c++)u[c]!==0&&(l[c*3]=i[c*3]/u[c],l[c*3+1]=i[c*3+1]/u[c],l[c*3+2]=i[c*3+2]/u[c]);if(!h)break}return{centroids:l,labels:s}}function ht(e,n){const t=new Set;for(let a=0;a<n;a++)if(t.add(`${e[a*3]|0},${e[a*3+1]|0},${e[a*3+2]|0}`),t.size>64)return t.size;return t.size}function mt(e,n,t,a){const o=new Float64Array(t*3),l=Math.floor(a()*n);o[0]=e[l*3],o[1]=e[l*3+1],o[2]=e[l*3+2];const s=new Float64Array(n).fill(1/0);for(let i=1;i<t;i++){let u=0;for(let c=0;c<n;c++){const x=e[c*3]-o[(i-1)*3],D=e[c*3+1]-o[(i-1)*3+1],B=e[c*3+2]-o[(i-1)*3+2],d=x*x+D*D+B*B;d<s[c]&&(s[c]=d),u+=s[c]}let g=a()*u,h=n-1;for(let c=0;c<n;c++)if(g-=s[c],g<=0){h=c;break}o[i*3]=e[h*3],o[i*3+1]=e[h*3+1],o[i*3+2]=e[h*3+2]}return o}const ft=150;async function gt(e,n){const{width:t,height:a,data:o}=await xt(e,n.stitchWidth),l=t*a,s=new Int16Array(l).fill(-1),i=new Int32Array(l);let u=0;for(let m=0;m<l;m++)o[m*4+3]>=ft&&(i[u++]=m);if(u===0)return{width:t,height:a,cells:s,threads:[],counts:[]};const g=new Float64Array(u*3);for(let m=0;m<u;m++){const p=i[m]*4,b=Ge(o[p],o[p+1],o[p+2]);g[m*3]=b[0],g[m*3+1]=b[1],g[m*3+2]=b[2]}const{centroids:h,labels:c}=ut(g,n.colorCount),x=h.length/3,D=Array.from({length:x},(m,p)=>[h[p*3],h[p*3+1],h[p*3+2]]),B=wn(D,n.palette),d=new Array(x).fill(0);for(let m=0;m<u;m++)s[i[m]]=c[m],d[c[m]]++;return pt({width:t,height:a,cells:s,threads:B,counts:d})}async function xt(e,n){const t=await createImageBitmap(e),a=Math.max(1,Math.round(n)),o=Math.max(1,Math.round(a*t.height/t.width)),l=document.createElement("canvas");l.width=a,l.height=o;const s=l.getContext("2d",{willReadFrequently:!0});if(!s)throw t.close(),new Error("canvas 2d context unavailable");return s.imageSmoothingEnabled=!0,s.imageSmoothingQuality="high",s.drawImage(t,0,0,t.width,t.height,0,0,a,o),t.close(),{width:a,height:o,data:s.getImageData(0,0,a,o).data}}function pt(e){const n=e.threads.map((o,l)=>({i:l,key:Dt(o.rgb)})).sort((o,l)=>o.key[0]-l.key[0]||o.key[1]-l.key[1]||o.key[2]-l.key[2]).map(o=>o.i),t=new Int16Array(e.threads.length);n.forEach((o,l)=>{t[o]=l});const a=new Int16Array(e.cells.length);for(let o=0;o<e.cells.length;o++)a[o]=e.cells[o]<0?-1:t[e.cells[o]];return{...e,cells:a,threads:n.map(o=>e.threads[o]),counts:n.map(o=>e.counts[o])}}function Dt(e){const[n,t,a]=e.map(u=>u/255),o=Math.max(n,t,a),l=Math.min(n,t,a),s=o-l;let i=0;return s!==0&&(o===n?i=(t-a)/s%6:o===t?i=(a-n)/s+2:i=(n-t)/s+4,i/=6,i<0&&(i+=1)),[i,o===0?0:s/o,o]}const Bt="picture-to-dmc",Ct=1,ee="session",ge="current";function bt(){return new Promise((e,n)=>{const t=indexedDB.open(Bt,Ct);t.onupgradeneeded=()=>{const a=t.result;a.objectStoreNames.contains(ee)||a.createObjectStore(ee)},t.onsuccess=()=>e(t.result),t.onerror=()=>n(t.error)})}async function xe(e,n){try{const t=await bt();return await new Promise((a,o)=>{const l=t.transaction(ee,e),s=n(l.objectStore(ee));s.onsuccess=()=>a(s.result),s.onerror=()=>o(s.error),l.oncomplete=()=>t.close()})}catch{return null}}function yt(e){return xe("readwrite",n=>n.put({...e,savedAt:Date.now()},ge))}function vt(){return xe("readonly",e=>e.get(ge))}function wt(){return xe("readwrite",e=>e.delete(ge))}function At(){const{t:e}=R(),[n,t]=f.useState(null),[a,o]=f.useState(50),[l,s]=f.useState(8),[i,u]=f.useState(!0),[g,h]=f.useState(!1),[c,x]=f.useState([]),[D,B]=f.useState(!1),[d,m]=f.useState(null),[p,b]=f.useState(!1),[y,C]=f.useState(null),[k,S]=f.useState("pattern"),[A,V]=f.useState(null),[K,M]=f.useState(null),[w,j]=f.useState(!1),$=f.useCallback(v=>{t(v),S("original")},[]),X=f.useMemo(()=>n&&n.width>0?Math.round(a*n.height/n.width):null,[n,a]);f.useEffect(()=>{let v=!1;return vt().then(async F=>{if(v||!F)return j(!0);try{const P=URL.createObjectURL(F.photo),I=new Image;if(await new Promise(z=>{I.onload=()=>z(),I.onerror=()=>z(),I.src=P}),v)return;t({dataUrl:P,blob:F.photo,width:I.naturalWidth,height:I.naturalHeight}),o(F.stitchWidth),s(F.colorCount),u(F.outline),h(F.useCustomPalette),x(F.customThreadNums.map(me).filter(z=>!!z)),S("original")}finally{v||j(!0)}}),()=>{v=!0}},[]);const J=f.useCallback(async()=>{if(!n)return C("noImage");if(g&&c.length<l)return C("notEnoughCustom");b(!0),C(null),m(null),S("pattern");try{const v=await gt(n.blob,{stitchWidth:a,colorCount:l,palette:g?c:void 0});m(v),yt({photo:n.blob,photoName:n.name??"photo",stitchWidth:a,colorCount:l,outline:i,useCustomPalette:g,customThreadNums:c.map(F=>F.num),substitutions:{}})}catch(v){console.error(v),C("generic")}finally{b(!1)}},[n,g,c,l,a,i]),_=f.useCallback((v,F)=>{m(P=>{if(!P)return P;const I=P.threads.findIndex(Xe=>Xe.num===v.num);if(I<0)return P;const z=[...P.threads];return z[I]=F,{...P,threads:z}}),M(F)},[]),T=()=>{t(null),m(null),C(null),M(null),wt()},N=f.useMemo(()=>d&&A?d.threads.findIndex(v=>v.num===A):-1,[d,A]),O=f.useRef(null);return f.useEffect(()=>{O.current&&O.current!==n?.dataUrl&&URL.revokeObjectURL(O.current),O.current=n?.dataUrl?.startsWith("blob:")?n.dataUrl:null},[n]),r.jsxs("div",{className:"mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 py-10",children:[r.jsxs("div",{className:"flex items-end justify-between gap-4 flex-wrap mb-7",children:[r.jsxs("div",{children:[r.jsx("h1",{className:"text-[30px] sm:text-[34px] m-0",children:e.converter.title}),r.jsx("p",{className:"text-[15.5px] text-clay m-0 mt-1",children:e.converter.lead})]}),(n||d)&&r.jsx(E,{variant:"quiet",onClick:T,children:e.converter.startOver})]}),y&&r.jsxs("div",{role:"alert",className:"mb-6 flex items-start gap-4 bg-coral-wash border-2 border-dashed border-coral-edge rounded-[16px] px-5 py-4",children:[r.jsx("p",{className:"flex-1 text-[15px] text-coral-deeper m-0",children:e.converter.errors[y]}),r.jsx("button",{type:"button",onClick:()=>C(null),className:"text-coral-deep text-sm font-bold cursor-pointer hover:text-coral-deeper shrink-0",children:e.converter.errors.dismiss})]}),r.jsxs("div",{className:"grid gap-7 lg:grid-cols-[296px_1fr] xl:grid-cols-[296px_1fr_312px]",children:[r.jsxs("div",{className:"flex flex-col gap-4",children:[r.jsxs(pe,{children:[r.jsx(Ne,{className:"mb-4",children:e.converter.settings.heading}),r.jsxs("div",{className:"flex justify-between items-baseline mb-2",children:[r.jsx(De,{children:e.converter.size.stitchesWide}),r.jsx(Be,{children:a})]}),r.jsx(ye,{value:[a],onValueChange:([v])=>o(v),min:20,max:200,step:2,"aria-label":e.converter.size.stitchesWide}),r.jsxs("div",{className:"flex justify-between text-xs text-sand mt-1.5 mb-5",children:[r.jsx("span",{children:"20"}),r.jsx("span",{children:"200"})]}),r.jsxs("div",{className:"flex justify-between items-baseline mb-2",children:[r.jsx(De,{children:e.converter.colors.threadColors}),r.jsx(Be,{children:l})]}),r.jsx(ye,{value:[l],onValueChange:([v])=>s(v),min:2,max:20,step:1,"aria-label":e.converter.colors.threadColors}),r.jsxs("div",{className:"flex justify-between text-xs text-sand mt-1.5 mb-4",children:[r.jsx("span",{children:"2"}),r.jsx("span",{children:"20"})]}),r.jsxs("label",{className:"flex items-center justify-between gap-3 cursor-pointer pt-4 border-t-2 border-dashed border-edge",children:[r.jsxs("span",{children:[r.jsx("span",{className:"block text-sm font-bold text-bark",children:e.converter.colors.outline}),r.jsx("span",{className:"block text-[13px] text-stone",children:i?e.converter.colors.outlineOn:e.converter.colors.outlineOff})]}),r.jsx(ue,{checked:i,onCheckedChange:u})]}),r.jsx("p",{className:"bg-linen rounded-[12px] px-3.5 py-2.5 text-[13.5px] text-clay m-0 mt-4",children:X?e.converter.size.note(a,X):e.converter.size.unknown})]}),r.jsxs(pe,{className:"flex flex-col gap-3",children:[r.jsxs("div",{children:[r.jsx("span",{className:"block font-display font-medium text-[15px] text-ink",children:e.converter.custom.heading}),r.jsx("span",{className:"block text-[13px] text-stone leading-snug",children:g?e.converter.custom.toggleOn:e.converter.custom.toggleOff})]}),r.jsxs(E,{variant:"secondary",size:"sm",className:"w-full",onClick:()=>B(!0),children:[e.converter.custom.open,c.length>0&&` (${c.length})`]})]}),r.jsx(E,{size:"block",onClick:J,disabled:p||!n,children:p?e.converter.canvas.building:d?e.converter.recreate:e.converter.create})]}),r.jsxs("div",{className:"flex flex-col gap-6 lg:border-x-2 lg:border-dashed lg:border-edge-2 lg:px-7",children:[n?r.jsx(Rn,{pattern:d,original:n.dataUrl,highlightIndex:N,view:k,onViewChange:S,busy:p,onPhoto:$,aspect:n.width>0?n.width/n.height:1}):r.jsxs("div",{className:"flex flex-col gap-4",children:[r.jsx(Nn,{onPhoto:$}),r.jsx("p",{className:"font-hand text-sm text-sand text-center m-0",children:w?e.converter.canvas.note:e.converter.canvas.building})]}),d&&d.threads.length>0&&r.jsx(Gn,{pattern:d,onError:v=>C(v)})]}),r.jsx("div",{className:"lg:col-span-2 xl:col-span-1",children:r.jsx(In,{threads:d?.threads??[],onSelect:M,onHover:V})})]}),r.jsx(Sn,{open:D,onClose:()=>B(!1),enabled:g,onEnabledChange:h,threads:c,onThreadsChange:x}),r.jsx(Vn,{thread:K,threads:d?.threads??[],onClose:()=>M(null),onReplace:_})]})}export{At as default};
