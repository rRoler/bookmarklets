### [What are bookmarklets?](https://en.wikipedia.org/wiki/Bookmarklet)
***
> # [Download Amazon Covers](javascript:void%20function(){function%20t(t,n){const%20e=t%20instanceof%20Blob,r=e%3FURL.createObjectURL(t):t,o=document.createElement(%22a%22);o.href=r,o.download=n,o.target=%22_blank%22,o.rel=%22noopener%20noreferrer%22,o.dispatchEvent(new%20MouseEvent(%22click%22)),e%26%26URL.revokeObjectURL(r)}var%20n=Uint8Array,e=Uint16Array,r=Uint32Array,o=new%20n([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),i=new%20n([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),a=function(t,n){for(var%20o=new%20e(31),i=0;i%3C31;++i)o[i]=n+=1%3C%3Ct[i-1];var%20a=new%20r(o[30]);for(i=1;i%3C30;++i)for(var%20c=o[i];c%3Co[i+1];++c)a[c]=c-o[i]%3C%3C5|i;return[o,a]},c=a(o,2),l=c[0],s=c[1];l[28]=258,s[258]=28,a(i,0);for(var%20h=new%20e(32768),f=0;f%3C32768;++f){var%20u=(43690%26f)%3E%3E%3E1|(21845%26f)%3C%3C1;u=(61680%26(u=(52428%26u)%3E%3E%3E2|(13107%26u)%3C%3C2))%3E%3E%3E4|(3855%26u)%3C%3C4,h[f]=((65280%26u)%3E%3E%3E8|(255%26u)%3C%3C8)%3E%3E%3E1}var%20d=new%20n(288);for(f=0;f%3C144;++f)d[f]=8;for(f=144;f%3C256;++f)d[f]=9;for(f=256;f%3C280;++f)d[f]=7;for(f=280;f%3C288;++f)d[f]=8;var%20v=new%20n(32);for(f=0;f%3C32;++f)v[f]=5;var%20g=[%22unexpected%20EOF%22,%22invalid%20block%20type%22,%22invalid%20length/literal%22,%22invalid%20distance%22,%22stream%20finished%22,%22no%20stream%20handler%22,,%22no%20callback%22,%22invalid%20UTF-8%20data%22,%22extra%20field%20too%20long%22,%22date%20not%20in%20range%201980-2099%22,%22filename%20too%20long%22,%22stream%20finishing%22,%22invalid%20zip%20data%22],p=function(t,n,e){var%20r=new%20Error(n||g[t]);if(r.code=t,Error.captureStackTrace%26%26Error.captureStackTrace(r,p),!e)throw%20r;return%20r},w=new%20n(0),m=function(){for(var%20t=new%20Int32Array(256),n=0;n%3C256;++n){for(var%20e=n,r=9;--r;)e=(1%26e%26%26-306674912)^e%3E%3E%3E1;t[n]=e}return%20t}(),y=function(t,n,e){for(;e;++n)t[n]=e,e%3E%3E%3E=8},E=%22undefined%22!=typeof%20TextEncoder%26%26new%20TextEncoder,A=%22undefined%22!=typeof%20TextDecoder%26%26new%20TextDecoder;try{A.decode(w,{stream:!0}),1}catch(t){}function%20z(t,o){if(o){for(var%20i=new%20n(t.length),a=0;a%3Ct.length;++a)i[a]=t.charCodeAt(a);return%20i}if(E)return%20E.encode(t);var%20c=t.length,l=new%20n(t.length+(t.length%3E%3E1)),s=0,h=function(t){l[s++]=t};for(a=0;a%3Cc;++a){if(s+5%3El.length){var%20f=new%20n(s+8+(c-a%3C%3C1));f.set(l),l=f}var%20u=t.charCodeAt(a);u%3C128||o%3Fh(u):u%3C2048%3F(h(192|u%3E%3E6),h(128|63%26u)):u%3E55295%26%26u%3C57344%3F(h(240|(u=65536+(1047552%26u)|1023%26t.charCodeAt(++a))%3E%3E18),h(128|u%3E%3E12%2663),h(128|u%3E%3E6%2663),h(128|63%26u)):(h(224|u%3E%3E12),h(128|u%3E%3E6%2663),h(128|63%26u))}return%20function(t,o,i){(null==o||o%3C0)%26%26(o=0),(null==i||i%3Et.length)%26%26(i=t.length);var%20a=new(2==t.BYTES_PER_ELEMENT%3Fe:4==t.BYTES_PER_ELEMENT%3Fr:n)(i-o);return%20a.set(t.subarray(o,i)),a}(l,0,s)}var%20b=function(t){var%20n=0;if(t)for(var%20e%20in%20t){var%20r=t[e].length;r%3E65535%26%26p(9),n+=r+4}return%20n},T=function(t,n,e,r,o,i,a,c){var%20l=r.length,s=e.extra,h=c%26%26c.length,f=b(s);y(t,n,null!=a%3F33639248:67324752),n+=4,null!=a%26%26(t[n++]=20,t[n++]=e.os),t[n]=20,n+=2,t[n++]=e.flag%3C%3C1|(i%3C0%26%268),t[n++]=o%26%268,t[n++]=255%26e.compression,t[n++]=e.compression%3E%3E8;var%20u=new%20Date(null==e.mtime%3FDate.now():e.mtime),d=u.getFullYear()-1980;if((d%3C0||d%3E119)%26%26p(10),y(t,n,d%3C%3C25|u.getMonth()+1%3C%3C21|u.getDate()%3C%3C16|u.getHours()%3C%3C11|u.getMinutes()%3C%3C5|u.getSeconds()%3E%3E%3E1),n+=4,-1!=i%26%26(y(t,n,e.crc),y(t,n+4,i%3C0%3F-i-2:i),y(t,n+8,e.size)),y(t,n+12,l),y(t,n+14,f),n+=16,null!=a%26%26(y(t,n,h),y(t,n+6,e.attrs),y(t,n+10,a),n+=14),t.set(r,n),n+=l,f)for(var%20v%20in%20s){var%20g=s[v],w=g.length;y(t,n,+v),y(t,n+2,w),t.set(g,n+4),n+=4+w}return%20h%26%26(t.set(c,n),n+=h),n},x=function(){function%20t(t){var%20n;this.filename=t,this.c=(n=-1,{p:function(t){for(var%20e=n,r=0;r%3Ct.length;++r)e=m[255%26e^t[r]]^e%3E%3E%3E8;n=e},d:function(){return~n}}),this.size=0,this.compression=0}return%20t.prototype.process=function(t,n){this.ondata(null,t,n)},t.prototype.push=function(t,n){this.ondata||p(5),this.c.p(t),this.size+=t.length,n%26%26(this.crc=this.c.d()),this.process(t,n||!1)},t}(),k=function(){function%20t(t){this.ondata=t,this.u=[],this.d=1}return%20t.prototype.add=function(t){var%20e=this;if(this.ondata||p(5),2%26this.d)this.ondata(p(4+8*(1%26this.d),0,1),null,!1);else{var%20r=z(t.filename),o=r.length,i=t.comment,a=i%26%26z(i),c=o!=t.filename.length||a%26%26i.length!=a.length,l=o+b(t.extra)+30;o%3E65535%26%26this.ondata(p(11,0,1),null,!1);var%20s=new%20n(l);T(s,0,t,r,c,-1);var%20h=[s],f=function(){for(var%20t=0,n=h;t%3Cn.length;t++){var%20r=n[t];e.ondata(null,r,!1)}h=[]},u=this.d;this.d=0;var%20d=this.u.length,v=function(t,n){var%20e={};for(var%20r%20in%20t)e[r]=t[r];for(var%20r%20in%20n)e[r]=n[r];return%20e}(t,{f:r,u:c,o:a,t:function(){t.terminate%26%26t.terminate()},r:function(){if(f(),u){var%20t=e.u[d+1];t%3Ft.r():e.d=1}u=1}}),g=0;t.ondata=function(r,o,i){if(r)e.ondata(r,o,i),e.terminate();else%20if(g+=o.length,h.push(o),i){var%20a=new%20n(16);y(a,0,134695760),y(a,4,t.crc),y(a,8,g),y(a,12,t.size),h.push(a),v.c=g,v.b=l+g+16,v.crc=t.crc,v.size=t.size,u%26%26v.r(),u=1}else%20u%26%26f()},this.u.push(v)}},t.prototype.end=function(){var%20t=this;2%26this.d%3Fthis.ondata(p(4+8*(1%26this.d),0,1),null,!0):(this.d%3Fthis.e():this.u.push({r:function(){1%26t.d%26%26(t.u.splice(-1,1),t.e())},t:function(){}}),this.d=3)},t.prototype.e=function(){for(var%20t=0,e=0,r=0,o=0,i=this.u;o%3Ci.length;o++){r+=46+(v=i[o]).f.length+b(v.extra)+(v.o%3Fv.o.length:0)}for(var%20a,c,l,s,h,f=new%20n(r+22),u=0,d=this.u;u%3Cd.length;u++){var%20v=d[u];T(f,t,v,v.f,v.u,-v.c-2,e,v.o),t+=46+v.f.length+b(v.extra)+(v.o%3Fv.o.length:0),e+=v.b}a=f,c=t,l=this.u.length,s=r,h=e,y(a,c,101010256),y(a,c+8,l),y(a,c+10,l),y(a,c+12,s),y(a,c+16,h),this.ondata(null,f,!0),this.d=2},t.prototype.terminate=function(){for(var%20t=0,n=this.u;t%3Cn.length;t++){n[t].t()}this.d=2},t}();(function(){if(!/www.amazon.*/.test(window.location.hostname))return;const%20n=document.querySelectorAll(%22.itemImageLink%22),e=t=%3Efunction(t,n,e=0){const%20r=t.match(n);if(r%26%26r[e])return%20r[e]}(t,/(%3F:[/dp]|$)([A-Z0-9]{10})/,1),r=t=%3E`https://${window.location.hostname}/images/P/${t}.01.MAIN._SCRM_.jpg`;if(n.length%3E0){const%20o=Array.from(n).map((t=%3Ee(t.href)));return%20n.length%3E4%26%26confirm(%22Since%20you're%20downloading%20more%20than%204%20covers,%20would%20you%20like%20to%20zip%20them%3F%22)%3Ffunction(e){const%20o=[],i=new%20k(((n,e,r)=%3E{n%3Falert(%22Failed%20to%20zip%20covers!%22):o.push(e),r%26%26t(new%20Blob(o,{type:%22application/zip%22}),%22covers.zip%22)}));e.forEach((t=%3E{if(!t)return;c(r(t),t)}));let%20a=0;function%20c(t,e){const%20r=new%20FileReader;r.onload=t=%3E{if(!t.target)return++a;const%20r=new%20Uint8Array(t.target.result),o=new%20x(`${e}.jpg`);i.add(o),o.push(r,!0),++a,a%3E=n.length%26%26i.end()},fetch(t).then((t=%3Et.blob())).then((t=%3E{try{r.readAsArrayBuffer(t)}catch(t){console.error(%22Failed%20to%20zip%20cover!%22,t)}})).catch((t=%3Econsole.error(%22Failed%20to%20fetch%20cover!%22,t)))}}(o):void%20i(o)}const%20o=e(window.location.href);if(!o)return%20alert(%22No%20covers%20found%20on%20this%20page!%22);function%20i(n){n.forEach((n=%3E{n%26%26t(r(n),`${n}.jpg`)}))}i([o])})();}();)<br>
> **For website: [Amazon](https://www.amazon.com)**<br>
> Version: 1<br>
> Description: Download covers from Amazon. Mainly for Amazon Japan but should work on most kindle group or single book pages even on Global.<br>
> [Bookmarklet Code](https://github.com/rRoler/Bookmarklets/blob/main/dist/amazon/download_covers.min.js)<br>
> [Source Code](https://github.com/rRoler/Bookmarklets/blob/main/src/amazon/download_covers.ts)

> # [Download BookWalker Covers](javascript:void%20function(){function%20e(e,t,o=0){const%20n=e.match(t);if(n%26%26n[o])return%20n[o]}(function(){if(!/bookwalker.jp/.test(window.location.hostname))return;let%20t=document.querySelectorAll(%22img.lazy%22);(/de([-0-9a-f]{20,}\/.*)%3F$/.test(window.location.pathname)||document.querySelector(%22%23js-episode-list%22))%26%26(t=document.querySelectorAll('meta[property=%22og:image%22]'));const%20o=Array.from(t).map((t=%3E(t=%3E{const%20o=e(t,/:\/\/[^/]*\/([0-9]+)\/[0-9a-zA-Z_]+(\.[^/.]*)$/,1)||e(t,/:\/\/[^/]*\/(\D+)([0-9]+)(\.[^/.]*)$/,2);if(o)return/:\/\/c.bookwalker.jp\/thumbnailImage_[0-9]+\.[^/.]*$/.test(t)%3FparseInt(o)-1:parseInt(o.split(%22%22).reverse().join(%22%22))-1})(t.getAttribute(%22data-original%22)||t.getAttribute(%22data-srcset%22)||t.src||t.content)));if(t.length%3E4%26%26!confirm(%22You%20are%20about%20to%20download%20more%20than%204%20covers!%22))return;(function(e){e.forEach((e=%3E{e%26%26function(e,t){const%20o=e%20instanceof%20Blob,n=o%3FURL.createObjectURL(e):e,r=document.createElement(%22a%22);r.href=n,r.download=t,r.target=%22_blank%22,r.rel=%22noopener%20noreferrer%22,r.dispatchEvent(new%20MouseEvent(%22click%22)),o%26%26URL.revokeObjectURL(n)}((e=%3E`https://c.bookwalker.jp/coverImage_${e}.jpg`)(e),`${e}.jpg`)}))})(o)})();}();)<br>
> **For website: [BookWalker](https://bookwalker.jp)**<br>
> Version: 1<br>
> Description: Download covers from BookWalker. Downloading is limited because of CORS. It's recommended to use the [BookWalker UserScript](https://github.com/rRoler/UserScripts/blob/master/Public/tampermonkey/bookwalker.js) instead.<br>
> [Bookmarklet Code](https://github.com/rRoler/Bookmarklets/blob/main/dist/bookwalker/download_covers.min.js)<br>
> [Source Code](https://github.com/rRoler/Bookmarklets/blob/main/src/bookwalker/download_covers.ts)

> # [Show MangaDex Cover Data](javascript:void%20function(){function%20t(t,e,r=0){const%20o=t.match(e);if(o%26%26o[r])return%20o[r]}function%20e(t,e=100){const%20r=[...t],o=[];for(;r.length;)o.push(r.splice(0,e));return%20o}(function(){if(!/mangadex\..*/.test(window.location.hostname))return;const%20r=[],o={},s={manga:[],cover:[]};if(document.querySelectorAll(%22img,%20div%22).forEach((e=%3E{const%20s=e.src||e.style.getPropertyValue(%22background-image%22);if(!/\/covers\/+[-0-9a-f]{20,}\/+[-0-9a-f]{20,}[^/]+(%3F:[%3F%23].*)%3F$/.test(s))return;const%20n=t(s,/[-0-9a-f]{20,}/),i=t(s,/([-0-9a-f]{20,}\.[^/.]*)\.[0-9]+\.[^/.%3F%23]*([%3F%23].*)%3F$/,1);n%26%26i%26%26(r.push(e),o[n]||(o[n]=[]),o[n].includes(i)||o[n].push(i))})),Object.keys(o).length%3C=0)return%20alert(%22No%20covers%20found%20on%20this%20page!%22);for(const%20t%20in%20o)o[t].length%3E1%3Fs.cover.push(t):s.manga.push(t);function%20n(t,e,r=0){return%20new%20Promise(((o,s)=%3E{const%20n=%22cover%22===e,i=t.map((t=%3En%3F`manga[]=${t}`:`ids[]=${t}`)).join(%22%26%22);let%20a=`https://api.mangadex.org/${e}%3F${i}%26includes[]=cover_art%26limit=100%26contentRating[]=safe%26contentRating[]=suggestive%26contentRating[]=erotica%26contentRating[]=pornographic%26offset=${r}`;if(n%26%26(a=`https://api.mangadex.org/${e}%3Forder[volume]=asc%26${i}%26limit=100%26offset=${r}`),r%3E1e3)return%20s(new%20Error(`Offset%20is%20bigger%20than%201000:\n%20${a}`));fetch(a).then((t=%3E{o(t.json())})).catch(s)}))}(function(){const%20t=[];return%20new%20Promise(((r,o)=%3E{(async%20function(){for(const%20r%20in%20s){const%20o=%22cover%22===r,i=e(s[r]);for(const%20e%20in%20i){const%20s=i[e],a=await%20n(s,r);if(o){t.push(...a.data);for(let%20e=a.limit;e%3Ca.total;e+=a.limit){const%20o=await%20n(s,r,e);t.push(...o.data)}}else%20a.data.forEach((e=%3E{const%20r=e.relationships.find((t=%3E%22cover_art%22===t.type));r%26%26(r.relationships=[{type:e.type,id:e.id}],t.push(r))}))}}return%20t})().then(r).catch(o)}))})().then((t=%3E{r.forEach((e=%3E{const%20r=e.src||e.style.getPropertyValue(%22background-image%22);t.forEach((t=%3E{const%20o=t.relationships.find((t=%3E%22manga%22===t.type));if(o%26%26new%20RegExp(`${o.id}/${t.attributes.fileName}`).test(r)){const%20r=new%20Image;r.src=`https://mangadex.org/covers/${o.id}/${t.attributes.fileName}`,r.onload=()=%3E{const%20o=document.createElement(%22span%22),s=document.createElement(%22span%22);if(t.attributes.description){o.setAttribute(%22title%22,t.attributes.description),o.style.setProperty(%22position%22,%22absolute%22);const%20e=document.createElementNS(%22http://www.w3.org/2000/svg%22,%22svg%22);e.setAttribute(%22fill%22,%22none%22),e.setAttribute(%22viewBox%22,%220%200%2024%2024%22),e.setAttribute(%22stroke-width%22,%221.5%22),e.setAttribute(%22stroke%22,%22currentColor%22),e.style.setProperty(%22width%22,%221.5rem%22),e.style.setProperty(%22height%22,%221.5rem%22);const%20r=document.createElementNS(%22http://www.w3.org/2000/svg%22,%22path%22);r.setAttribute(%22stroke-linecap%22,%22round%22),r.setAttribute(%22stroke-linejoin%22,%22round%22),r.setAttribute(%22d%22,%22M11.25%2011.25l.041-.02a.75.75%200%20011.063.852l-.708%202.836a.75.75%200%20001.063.853l.041-.021M21%2012a9%209%200%2011-18%200%209%209%200%200118%200zm-9-3.75h.008v.008H12V8.25z%22),e.appendChild(r),e.addEventListener(%22click%22,(t=%3E{t.stopPropagation(),t.preventDefault(),s.style.setProperty(%22display%22,%22flex%22)})),o.appendChild(e);const%20n=document.createElement(%22span%22);n.innerText=t.attributes.description,n.style.setProperty(%22max-height%22,%22100%25%22),n.style.setProperty(%22margin%22,%221rem%22),n.style.setProperty(%22text-align%22,%22center%22),s.style.setProperty(%22position%22,%22absolute%22),s.style.setProperty(%22width%22,%22100%25%22),s.style.setProperty(%22height%22,%22100%25%22),s.style.setProperty(%22overflow-y%22,%22auto%22),s.style.setProperty(%22display%22,%22none%22),s.style.setProperty(%22align-items%22,%22center%22),s.style.setProperty(%22justify-content%22,%22center%22),s.style.setProperty(%22background-color%22,%22var(--md-accent)%22),s.addEventListener(%22click%22,(t=%3E{t.stopPropagation(),t.preventDefault(),s.style.setProperty(%22display%22,%22none%22)})),s.appendChild(n)}const%20n=document.createElement(%22span%22),i=`${r.width}x${r.height}`;if(n.innerText=i,n.setAttribute(%22title%22,i),n.style.setProperty(%22position%22,%22absolute%22),n.style.setProperty(%22top%22,%220%22),e%20instanceof%20HTMLImageElement){if(n.style.setProperty(%22padding%22,%220.5rem%200.5rem%201rem%22),n.style.setProperty(%22color%22,%22%23fff%22),n.style.setProperty(%22left%22,%220%22),n.style.setProperty(%22width%22,%22100%25%22),n.style.setProperty(%22background%22,%22linear-gradient(0deg,transparent,rgba(0,0,0,0.8))%22),!e.parentElement)return;return%20e.parentElement.appendChild(n),void(t.attributes.description%26%26(o.style.setProperty(%22top%22,%220%22),o.style.setProperty(%22right%22,%220%22),o.style.setProperty(%22padding%22,%220.5rem%200.5rem%201rem%22),o.style.setProperty(%22color%22,%22%23fff%22),e.parentElement.append(o,s)))}n.style.setProperty(%22padding%22,%220%200.4rem%200.1rem%22),n.style.setProperty(%22background-color%22,%22var(--md-accent)%22),n.style.setProperty(%22border-bottom-left-radius%22,%224px%22),n.style.setProperty(%22border-bottom-right-radius%22,%224px%22),e.appendChild(n),t.attributes.description%26%26(o.style.setProperty(%22bottom%22,%220%22),o.style.setProperty(%22left%22,%220%22),o.style.setProperty(%22padding%22,%220.1rem%22),o.style.setProperty(%22background-color%22,%22var(--md-accent)%22),o.style.setProperty(%22border-top-right-radius%22,%224px%22),e.append(o,s))}}}))}))})).catch((t=%3E{console.error(t),alert(%22Failed%20to%20fetch%20cover%20data!%22)}))})();}();)<br>
> **For website: [MangaDex](https://mangadex.org)**<br>
> Version: 1.4<br>
> Description: Display cover sizes and descriptions on MangaDex. If the cover description exists, an icon will be shown that can be clicked or hovered to display the description.<br>
> [Bookmarklet Code](https://github.com/rRoler/Bookmarklets/blob/main/dist/mangadex/show_cover_data.min.js)<br>
> [Source Code](https://github.com/rRoler/Bookmarklets/blob/main/src/mangadex/show_cover_data.ts)

> # [Delete MangaDex Covers by Language](javascript:void%20function(){(function(){if(!/mangadex\..*/.test(window.location.hostname))return;const%20e=prompt(%22Language%20name:%22,%22Japanese%22);if(!e)return;const%20n=[];document.querySelectorAll(%22div.page-sizer%22).forEach((t=%3E{const%20o=t.parentElement;if(!o)return;const%20l=o.querySelector(%22.close%22),r=o.querySelector(%22.placeholder-text.with-label%22);l%26%26r%26%26e.toLowerCase().replaceAll(%22%20%22,%22%22).includes(r.innerText.toLowerCase().replaceAll(%22%20%22,%22%22))%26%26(l.dispatchEvent(new%20MouseEvent(%22click%22)),n.push(t))})),n.length%3E0%3Fconsole.log(%22Deleted%20covers:%22,n):alert(%22No%20covers%20in%20given%20language%20found!%22)})();}();)<br>
> **For website: [MangaDex](https://mangadex.org)**<br>
> Version: 1.1<br>
> Description: Requires the title edit and cover delete permissions. Removes all covers in a given language from the title edit page.<br>
> [Bookmarklet Code](https://github.com/rRoler/Bookmarklets/blob/main/dist/mangadex/del_covers_by_lang.min.js)<br>
> [Source Code](https://github.com/rRoler/Bookmarklets/blob/main/src/mangadex/del_covers_by_lang.ts)

***