(() => {
  'use strict';
  const data = window.PORTFOLIO;
  const $ = s => document.querySelector(s);
  const fa = n => Number(n).toLocaleString('fa-IR');
  const node = (tag, cls, text) => { const el=document.createElement(tag); if(cls)el.className=cls; if(text!==undefined)el.textContent=text; return el; };
  const safe = (value, protocols=['http:','https:','file:']) => { try { const u=new URL(value,location.href); return protocols.includes(u.protocol); } catch {return false;} };
  function placeholder(n, error=false){const el=node('div','placeholder');el.append(node('b','',fa(n).padStart(2,'۰')),node('span','',error?'تصویر در دسترس نیست':'نمونه‌کار'),node('small','',error?'بارگذاری تصویر را بررسی کنید':'به‌زودی'));return el;}
  function media(src,n,alt,lazy=true){if(!src||!safe(src))return placeholder(n);const img=node('img');img.alt=alt;img.width=540;img.height=960;img.loading=lazy?'lazy':'eager';img.decoding='async';img.onerror=()=>img.replaceWith(placeholder(n,true));img.src=src;return img;}
  document.querySelectorAll('[data-name]').forEach(el=>el.textContent=data.name);
  document.title=data.name+' | ادمین استوری';
  $('meta[name="description"]').content=data.headline+'؛ نمونه‌کارهای '+data.name;
  $('#headline').textContent=data.headline;$('#bio').textContent=data.bio;
  data.skills.forEach(s=>$('#skills').append(node('li','',s)));
  data.experience.forEach(x=>{const e=node('div','experience-item');e.append(node('strong','',x.title),node('p','',x.detail));$('#experience').append(e);});
  const channels=[['instagram','اینستاگرام',''],['telegram','تلگرام',''],['email','ایمیل','mailto:'],['phone','تماس','tel:']];
  channels.forEach(([key,label,prefix])=>{const v=data.contacts[key];if(!v)return;const href=prefix+v;if(!safe(href,prefix?[prefix]:['https:','http:']))return;const a=node('a');a.href=href;if(!prefix){a.target='_blank';a.rel='noopener noreferrer';}a.append(node('span','',label),node('span','','↗'));$('#contact-links').append(a);});
  if(!$('#contact-links').children.length)$('#contact-links').append(node('p','','اطلاعات تماس پس از تکمیل رزومه درج می‌شود.'));
  const resolve = p => ({...p, images: (window.GALLERY || {})[p.folder] || []});
  const series=data.series.map(resolve);
  const singles=data.singles.map(resolve);
  $('#series-count').textContent=fa(series.length);$('#single-count').textContent=fa(singles.length);
  series.slice(0,3).forEach((p,i)=>{const cover=node('div','hero-cover');cover.append(media(p.images[0],i+1,p.title,false));$('#hero-covers').append(cover);});
  function card(p,i,single){const article=node('article','project');const open=node('button','project-open');open.type='button';open.setAttribute('aria-label','مشاهده '+p.title);const visual=node('div','project-visual');(p.images.length?p.images:Array(single?1:3).fill('')).slice(0,single?1:3).forEach((src,n)=>{const mini=node('div','mini');mini.append(media(src,n+1,p.title+'، اسلاید '+fa(n+1)));visual.append(mini);});const info=node('div','project-info');const label=node('div','project-label');label.append(node('span','',p.category),node('span','',fa(i+1).padStart(2,'۰')));const foot=node('div','project-foot');foot.append(node('span','',!p.images.length?'به‌زودی':single?'نمایش تک‌استوری':'نمایش رشته · '+fa(p.images.length)+' اسلاید'),node('span','circle','↙'));info.append(label,node('h4','',p.title),node('p','',p.description),foot);open.append(visual,info);open.disabled=!p.images.length;open.onclick=()=>show(p);article.append(open);return article;}
  series.forEach((p,i)=>$('#series-grid').append(card(p,i,false)));singles.forEach((p,i)=>$('#single-grid').append(card(p,i,true)));
  const dialog=$('#viewer');let current=null,index=0,previousFocus=null,touchX=null;
  function show(p){previousFocus=document.activeElement;current=p;index=0;$('#viewer-title').textContent=p.title;$('#viewer-description').textContent=p.description;render();dialog.showModal();document.body.style.overflow='hidden';$('.close').focus();}
  function render(){const count=current.images.length;$('#viewer-media').replaceChildren(media(current.images[index],index+1,current.title+'، اسلاید '+fa(index+1),false));$('#counter').textContent=fa(index+1)+' از '+fa(count);$('#previous').disabled=index===0;$('#next').disabled=index===count-1;$('#progress').replaceChildren();$('#thumbnails').replaceChildren();current.images.forEach((src,i)=>{const bar=node('span',i<=index?'seen':'');$('#progress').append(bar);const b=node('button');b.type='button';b.setAttribute('aria-label','اسلاید '+fa(i+1));b.setAttribute('aria-current',String(i===index));if(src&&safe(src)){const img=media(src,i+1,'',true);b.append(img);}else b.textContent=fa(i+1);b.onclick=()=>{index=i;render();$('#thumbnails').children[i].focus();};$('#thumbnails').append(b);});}
  function move(step){if(current&&index+step>=0&&index+step<current.images.length){index+=step;render();}}
  $('#previous').onclick=()=>move(-1);$('#next').onclick=()=>move(1);$('.close').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>{document.body.style.overflow='';previousFocus?.focus();});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(1);}if(e.key==='ArrowRight'){e.preventDefault();move(-1);}});
  $('#viewer-media').addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;},{passive:true});
  $('#viewer-media').addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45)move(dx<0?1:-1);touchX=null;},{passive:true});
})();
