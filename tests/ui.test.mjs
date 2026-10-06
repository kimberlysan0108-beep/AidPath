import test from 'node:test';import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {GET,POST} from '../app/api/aidpath/route.ts';
test('food buttons, Back, and all housing/expense/technology branches complete even with cookies blocked',async()=>{
 const dom=new JSDOM('<div id="root"></div>',{url:'https://aidpath.test/'});
 globalThis.window=dom.window;globalThis.localStorage=dom.window.localStorage;globalThis.document=dom.window.document;Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});globalThis.HTMLElement=dom.window.HTMLElement;globalThis.MutationObserver=dom.window.MutationObserver;globalThis.getComputedStyle=dom.window.getComputedStyle;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const {createRoot}=await import('react-dom/client');const {act,createElement}=await import('react');const {default:AidPath}=await import('../app/page.tsx');
 let cookie='';let dropCookies=false;globalThis.fetch=async(url,options)=>{const request=new Request('https://aidpath.test'+url,{...options,headers:{...Object.fromEntries(new Headers(options?.headers)),origin:'https://aidpath.test',...(dropCookies?{}:{cookie})}});const response=options?.method==='POST'?await POST(request):await GET(request);if(response.headers.has('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];return response;};
 const root=createRoot(document.getElementById('root'));await act(async()=>root.render(createElement(AidPath)));
 const button=(text)=>[...document.querySelectorAll('button')].find(b=>b.textContent.includes(text));
 const click=async(text)=>{const b=button(text);assert.ok(b,`button ${text} exists`);assert.equal(b.disabled,false);await act(async()=>b.click());};
 for(const answer of ['Yes','No','Not sure / prefer not to say']){
 if(!button('Food & groceries')){await click('Find support for another need');}
 await click('Food & groceries');assert.match(document.body.textContent,/Are you currently enrolled/);
 await click(answer);assert.match(document.body.textContent,/When do you need support/);assert.ok(!document.body.textContent.includes('Are you currently enrolled'));
 await click('Back');assert.match(document.body.textContent,/Are you currently enrolled/);await click(answer);
 await click('In the next few weeks');assert.match(document.body.textContent,/What kind of food support/);
 await click('Ongoing food benefits');assert.match(document.body.textContent,/A starting point, chosen for you/);
 }
 // Complete each branch without cookie transport, using the server-issued tab session.
 dropCookies=true;
 const flows=[
 ['Housing & rent',['Yes','In the next few weeks','I’m struggling to pay rent','Yes','Yes','No']],
 ['Housing & rent',['Yes','Today or in the next few days','I have nowhere safe','Yes','Yes']],
 ['Housing & rent',['Yes','In the next few weeks','I need help with a security deposit','Yes','Yes','No']],
 ['Housing & rent',['Not sure / prefer not to say','I’m planning ahead','I’m looking for housing']],
 ['Housing & rent',['No','I’m planning ahead','I have a landlord']],
 ['Unexpected expenses',['Yes','In the next few weeks','Yes','Yes','No']],
 ['Unexpected expenses',['No','In the next few weeks','No','Not sure / prefer not to say','Yes']],
 ['Assistive technology',['Yes','In the next few weeks','Yes','Yes']],
 ['Food & groceries',['Yes','In the next few weeks','Food costs beyond','Yes','Yes','No']],
 ];
 for(const [need,answers] of flows){
 await click('Find support for another need');await click(need);
 for(const answer of answers){await click(answer);assert.equal(document.querySelector('[role="alert"]'),null,`${need}: no session error after ${answer}`);}
 assert.match(document.body.textContent,/A starting point, chosen for you/,`${need} reaches results`);
 }
 await click('Find support for another need');await click('Español');
 assert.equal(document.documentElement.lang,'es');assert.match(document.body.textContent,/¿Con qué necesitas ayuda/);
 await click('Vivienda y renta');await click('Sí');assert.match(document.body.textContent,/¿Cuándo necesitas apoyo/);
 await click('EN');assert.match(document.body.textContent,/When do you need support/);
 await click('Español');await click('En las próximas semanas');await click('Me está costando pagar la renta');await click('Sí');await click('Sí');await click('No');
 assert.match(document.body.textContent,/Un punto de partida para ti/);
 assert.match(document.body.textContent,/Estas opciones se basan en lo que nos contaste sobre vivienda y renta/);
 const saveButton=document.querySelector('button[aria-label^="Guardar "]');assert.ok(saveButton);await act(async()=>saveButton.click());await click('Mi plan de acción');
 assert.match(document.body.textContent,/Recuerda dar el siguiente paso/);assert.ok(document.querySelector('input[type="datetime-local"]'));
 assert.match(document.body.textContent,/No es una fecha límite oficial/);
 const themeButton=label=>document.querySelector(`button[aria-label="${label}"]`);
 await act(async()=>themeButton('Oscuro').click());assert.equal(document.documentElement.classList.contains('dark'),true);assert.equal(localStorage.getItem('aidpath-theme'),'dark');
 await click('EN');assert.equal(document.documentElement.classList.contains('dark'),true);assert.ok(document.querySelector('input[type="datetime-local"]'));
 await act(async()=>themeButton('Light').click());assert.equal(document.documentElement.classList.contains('dark'),false);assert.equal(localStorage.getItem('aidpath-theme'),'light');
 await act(async()=>root.unmount());dom.window.close();
});
