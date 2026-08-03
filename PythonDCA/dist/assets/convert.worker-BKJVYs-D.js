(function(){"use strict";const m=new Float64Array(256);for(let e=0;e<256;e++){const r=e/255;m[e]=r<=.04045?r/12.92:((r+.055)/1.055)**2.4}const S=.95047,V=1.08883,w=.008856,P=7.787;function L(e){return e>w?Math.cbrt(e):P*e+16/116}function G(e,r,n){const a=m[e<0?0:e>255?255:e|0],t=m[r<0?0:r>255?255:r|0],l=m[n<0?0:n>255?255:n|0],u=L((a*.4124+t*.3576+l*.1805)/S),o=L(a*.2126+t*.7152+l*.0722),A=L((a*.0193+t*.1192+l*.9505)/V);return[116*o-16,500*(u-o),200*(o-A)]}function F(e,r){const n=e[0]-r[0],a=e[1]-r[1],t=e[2]-r[2];return n*n+a*a+t*t}function v(e){const r=parseInt(e.replace("#",""),16);return[r>>16&255,r>>8&255,r&255]}function b(e,r){if(r<=0)return;const n=1+r/100*.6;for(let a=0;a<e.length;a+=3)e[a+1]*=n,e[a+2]*=n}const T=64,R=900,p=484,q=.06;function O(e,r,n,a){const t=n*a;if(t===0)return!1;const l=B=>[e[B*3],e[B*3+1],e[B*3+2]],u=[];for(let B=0;B<n;B++)u.push(B,(a-1)*n+B);for(let B=1;B<a-1;B++)u.push(B*n,B*n+n-1);const o=u.filter(B=>r[B]!==0);if(o.length===0)return!1;const A=I(e,o),s=new Int32Array(t),D=new Uint8Array(t);let i=0,C=0;for(const B of o)!D[B]&&F(l(B),A)<=p&&(D[B]=1,s[C++]=B);if(C===0)return!1;const h=[];for(;i<C;){const B=s[i++];h.push(B);const c=l(B),g=B%n,k=(B-g)/n;g>0&&E(B-1,c),g<n-1&&E(B+1,c),k>0&&E(B-n,c),k<a-1&&E(B+n,c)}function E(B,c){if(D[B]||r[B]===0)return;const g=l(B);F(g,c)>T||F(g,A)>R||(D[B]=1,s[C++]=B)}const d=W(r);if(d-h.length<d*q)return!1;for(const B of h)r[B]=0;return U(e,r,n,a,A),!0}function U(e,r,n,a,t){const l=o=>[e[o*3],e[o*3+1],e[o*3+2]],u=[];for(let o=0;o<a;o++)for(let A=0;A<n;A++){const s=o*n+A;if(r[s]===0)continue;let D=!1,i=[0,0,0],C=0;const h=y=>{if(r[y]===0)D=!0;else{const B=l(y);i=[i[0]+B[0],i[1]+B[1],i[2]+B[2]],C++}};if(A>0&&h(s-1),A<n-1&&h(s+1),o>0&&h(s-n),o<a-1&&h(s+n),!D||C===0)continue;const E=[i[0]/C,i[1]/C,i[2]/C],d=l(s);F(d,t)<F(d,E)&&u.push(s)}for(const o of u)r[o]=0}function W(e){let r=0;for(let n=0;n<e.length;n++)e[n]!==0&&r++;return r}function I(e,r){const n=a=>{const t=r.map(u=>e[u*3+a]).sort((u,o)=>u-o),l=t.length>>1;return t.length%2?t[l]:(t[l-1]+t[l])/2};return[n(0),n(1),n(2)]}function z(e,r){const n=new Float64Array(r*3);for(let a=0;a<r;a++){const t=G(e[a*4],e[a*4+1],e[a*4+2]);n[a*3]=t[0],n[a*3+1]=t[1],n[a*3+2]=t[2]}return n}const f=`Ecru|Ecru/off-white|FFF7E7
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
S3820|Satin - Straw|DBA53E`.split(`
`).map(e=>{const[r,n,a]=e.split("|"),t=v(a);return{num:r,name:n,hex:`#${a}`,rgb:t,lab:G(t[0],t[1],t[2])}}),N=new Map(f.map(e=>[e.num.toLowerCase(),e]));function Y(e){return N.get(e.trim().toLowerCase())}function x(e,r=f){const n=e.length;if(n===0)return[];const a=r.length,t=n*a,l=new Float64Array(t);for(let D=0;D<n;D++){const i=e[D];for(let C=0;C<a;C++)l[D*a+C]=F(i,r[C].lab)}const u=new Int32Array(t);for(let D=0;D<t;D++)u[D]=D;u.sort((D,i)=>l[D]-l[i]);const o=new Array(n),A=new Uint8Array(a);let s=0;for(let D=0;D<t&&s<n;D++){const i=u[D],C=i/a|0,h=i-C*a;o[C]||A[h]||(o[C]=r[h],A[h]=1,s++)}for(let D=0;D<n;D++)if(!o[D]){let i=0,C=1/0;for(let h=0;h<r.length;h++){const E=F(e[D],r[h].lab);E<C&&(C=E,i=h)}o[D]=r[i]}return o}function H(e){let r=e>>>0;return()=>{r=r+1831565813>>>0;let n=r;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}const K=60,_=42;function J(e,r){const n=e.length/3;if(n===0||r<=0)return{centroids:new Float64Array(0),labels:new Int32Array(0)};const a=$(e,n);r=Math.min(r,a);const t=H(_),l=X(e,n,r,t),u=new Int32Array(n),o=new Float64Array(r*3),A=new Int32Array(r);for(let s=0;s<K;s++){let D=!1;for(let i=0;i<n;i++){const C=e[i*3],h=e[i*3+1],E=e[i*3+2];let d=0,y=1/0;for(let B=0;B<r;B++){const c=C-l[B*3],g=h-l[B*3+1],k=E-l[B*3+2],M=c*c+g*g+k*k;M<y&&(y=M,d=B)}u[i]!==d&&(u[i]=d,D=!0)}o.fill(0),A.fill(0);for(let i=0;i<n;i++){const C=u[i];o[C*3]+=e[i*3],o[C*3+1]+=e[i*3+1],o[C*3+2]+=e[i*3+2],A[C]++}for(let i=0;i<r;i++)A[i]!==0&&(l[i*3]=o[i*3]/A[i],l[i*3+1]=o[i*3+1]/A[i],l[i*3+2]=o[i*3+2]/A[i]);if(!D)break}return{centroids:l,labels:u}}function $(e,r){const n=new Set;for(let a=0;a<r;a++)if(n.add(`${e[a*3]|0},${e[a*3+1]|0},${e[a*3+2]|0}`),n.size>64)return n.size;return n.size}function X(e,r,n,a){const t=new Float64Array(n*3),l=Math.floor(a()*r);t[0]=e[l*3],t[1]=e[l*3+1],t[2]=e[l*3+2];const u=new Float64Array(r).fill(1/0);for(let o=1;o<n;o++){let A=0;for(let i=0;i<r;i++){const C=e[i*3]-t[(o-1)*3],h=e[i*3+1]-t[(o-1)*3+1],E=e[i*3+2]-t[(o-1)*3+2],d=C*C+h*h+E*E;d<u[i]&&(u[i]=d),A+=u[i]}let s=a()*A,D=r-1;for(let i=0;i<r;i++)if(s-=u[i],s<=0){D=i;break}t[o*3]=e[D*3],t[o*3+1]=e[D*3+1],t[o*3+2]=e[D*3+2]}return t}const Q=150;async function Z(e,r){const{width:n,height:a,data:t}=await j(e,r),l=n*a,u=new Int16Array(l).fill(-1),o=z(t,l),A=new Uint8Array(l);for(let c=0;c<l;c++)A[c]=t[c*4+3]>=Q?255:0;r.removeBackground&&O(o,A,n,a),b(o,r.vividness??0);const s=new Int32Array(l);let D=0;for(let c=0;c<l;c++)A[c]!==0&&(s[D++]=c);if(D===0)return{width:n,height:a,cells:u,threads:[],counts:[],stitched:0};const i=new Float64Array(D*3);for(let c=0;c<D;c++){const g=s[c]*3;i[c*3]=o[g],i[c*3+1]=o[g+1],i[c*3+2]=o[g+2]}const{centroids:C,labels:h}=J(i,r.colorCount),E=C.length/3,d=Array.from({length:E},(c,g)=>[C[g*3],C[g*3+1],C[g*3+2]]),y=x(d,r.palette),B=new Array(E).fill(0);for(let c=0;c<D;c++)u[s[c]]=h[c],B[h[c]]++;return ne({width:n,height:a,cells:u,threads:y,counts:B,stitched:D})}async function j(e,r){const n=await createImageBitmap(e),a=Math.max(1,Math.round(r.stitchWidth)),t=Math.max(1,Math.round(a*n.height/n.width)),u=new OffscreenCanvas(a,t).getContext("2d",{willReadFrequently:!0});if(!u)throw n.close(),new Error("canvas 2d context unavailable");return u.imageSmoothingEnabled=!0,u.imageSmoothingQuality="high",(r.flipH||r.flipV)&&(u.translate(r.flipH?a:0,r.flipV?t:0),u.scale(r.flipH?-1:1,r.flipV?-1:1)),u.drawImage(n,0,0,n.width,n.height,0,0,a,t),n.close(),{width:a,height:t,data:u.getImageData(0,0,a,t).data}}function ee(e){return{width:e.width,height:e.height,cells:e.cells,threadNums:e.threads.map(r=>r.num),counts:e.counts,stitched:e.stitched}}function ne(e){const r=e.threads.map((t,l)=>({i:l,key:re(t.rgb)})).sort((t,l)=>t.key[0]-l.key[0]||t.key[1]-l.key[1]||t.key[2]-l.key[2]).map(t=>t.i),n=new Int16Array(e.threads.length);r.forEach((t,l)=>{n[t]=l});const a=new Int16Array(e.cells.length);for(let t=0;t<e.cells.length;t++)a[t]=e.cells[t]<0?-1:n[e.cells[t]];return{...e,cells:a,threads:r.map(t=>e.threads[t]),counts:r.map(t=>e.counts[t])}}function re(e){const[r,n,a]=e.map(A=>A/255),t=Math.max(r,n,a),l=Math.min(r,n,a),u=t-l;let o=0;return u!==0&&(t===r?o=(n-a)/u%6:t===n?o=(a-r)/u+2:o=(r-n)/u+4,o/=6,o<0&&(o+=1)),[o,t===0?0:u/t,t]}self.onmessage=async e=>{const{id:r,photo:n,stitchWidth:a,colorCount:t,paletteNums:l,vividness:u,removeBackground:o,flipH:A,flipV:s}=e.data;try{const D=l?l.map(Y).filter(h=>!!h):void 0,i=await Z(n,{stitchWidth:a,colorCount:t,palette:D,vividness:u,removeBackground:o,flipH:A,flipV:s}),C=ee(i);self.postMessage({id:r,ok:!0,pattern:C},[C.cells.buffer])}catch(D){self.postMessage({id:r,ok:!1,error:D instanceof Error?D.message:String(D)})}}})();
