import {validReminder} from '../../../lib/reminders';
import {db} from '../../../lib/db';
import {state,event,programs,savedProgram,nextQuestion,questions,needs,type Session,type SavedPlan} from '../../../lib/service';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store'};
async function session(request:Request){const headerToken=request.headers.get('authorization')?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];const token=(headerToken&&/^[a-f0-9]{64}$/.test(headerToken)?headerToken:null)??request.headers.get('cookie')?.match(/(?:^|;\s*)aidpath=([a-f0-9]{64})(?:;|$)/)?.[1];let s=token?await db().prepare('SELECT * FROM sessions WHERE id=? AND updated_at>?').bind(token,Date.now()-30*86400000).first<Session>():null;let fresh=false;
 if(!s){fresh=true;const id=[...crypto.getRandomValues(new Uint8Array(32))].map(x=>x.toString(16).padStart(2,'0')).join('');const now=Date.now();s={id,revision:0,answers:'{}',plan:'[]',created_at:now,updated_at:now};await db().prepare('INSERT INTO sessions(id,answers,plan,created_at,updated_at) VALUES (?,?,?,?,?)').bind(id,'{}','[]',now,now).run();await event(id,'session_started');}
 return {s,fresh};}
function cookie(s:Session){return `aidpath=${s.id}; Path=/; HttpOnly; Secure; SameSite=None; Partitioned; Max-Age=2592000`;}
async function failure(){const id=crypto.randomUUID();console.error(JSON.stringify({level:'error',code:'aidpath_request_failed',request_id:id}));try{await db().prepare('INSERT INTO failures(id,route,code,created_at) VALUES (?,?,?,?)').bind(id,'aidpath','request_failed',Date.now()).run();}catch{}return Response.json({error:'We could not save or load your information. Please try again.',requestId:id},{status:503,headers});}
export async function GET(request:Request){try{const {s}=await session(request);return Response.json(await state(s),{headers:{...headers,'Set-Cookie':cookie(s),'X-AidPath-Session':s.id}});}catch{return failure();}}
export async function POST(request:Request){
 try{
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Request origin is not allowed.'},{status:403,headers});
 const raw=await request.text();if(raw.length>4096)return Response.json({error:'Request is too large.'},{status:413,headers});
 let body;try{body=JSON.parse(raw);}catch{return Response.json({error:'Invalid request.'},{status:400,headers});}
 if(!body||typeof body!=='object'||Array.isArray(body))return Response.json({error:'Invalid request.'},{status:400,headers});
 const {s,fresh}=await session(request);if(fresh&&body.action!=='select_need'&&body.action!=='event')return Response.json({error:'Your browser session was interrupted. Please reload to reconnect before continuing.'},{status:401,headers});let a=JSON.parse(s.answers);let plan=JSON.parse(s.plan) as SavedPlan[];
 if(body.revision!==undefined&&body.revision!==s.revision&&body.action!=='event')return Response.json({error:'Your session changed in another tab. Review the updated information and try again.',state:await state(s)},{status:409,headers});
 const invalid=()=>Response.json({error:'This action or answer is not valid. Please reload and try again.'},{status:400,headers});
 if(body.action==='select_need'){
 if(!needs.some(n=>n.id===body.need))return invalid();if(a.need&&nextQuestion(a))await event(s.id,'questionnaire_abandoned');a={need:body.need};await event(s.id,'need_selected');
 }else if(body.action==='restart'){
 if(a.need&&nextQuestion(a))await event(s.id,'questionnaire_abandoned');a={};
 }else if(body.action==='answer'){
 const q=nextQuestion(a);if(!q||body.field!==q.field||!q.options.some(o=>o[0]===body.value))return invalid();a[q.field]=body.value;await event(s.id,'question_answered');if(!nextQuestion(a)){const started=await db().prepare("SELECT created_at FROM events WHERE session_id=? AND name='need_selected' ORDER BY created_at DESC LIMIT 1").bind(s.id).first<{created_at:number}>();await event(s.id,'recommendation_shown',null,Date.now()-(started?.created_at??Date.now()));}
 }else if(body.action==='back'){
 const answered=questions(a).filter(q=>a[q.field]!==undefined);if(answered.length)delete a[answered[answered.length-1].field];else a={};
 }else if(body.action==='save'){
 const p=programs.find(p=>p.id===body.program);if(!p)return invalid();if(!plan.some(i=>i.id===p.id))plan.push({id:p.id,version:p.policy_version,checked:[]});await event(s.id,'action_started',p.id);
 }else if(body.action==='check'){
 const saved=plan.find(i=>i.id===body.program);const p=saved?await savedProgram(saved):null;if(!saved||!p||!Number.isInteger(body.step)||body.step<0||body.step>=p.steps.length||typeof body.checked!=='boolean')return invalid();saved.checked=body.checked?[...new Set([...saved.checked,body.step])]:saved.checked.filter(n=>n!==body.step);
 }else if(body.action==='reminder'){
 const saved=plan.find(i=>i.id===body.program);if(!saved)return invalid();if(body.at===null)delete saved.reminder;else{if(!validReminder(body.at))return invalid();saved.reminder={at:body.at};}
 }else if(body.action==='remove'){plan=plan.filter(i=>i.id!==body.program);
 }else if(body.action==='event'){
 if(!['recommendation_clicked','source_opened','questionnaire_abandoned'].includes(body.name))return invalid();if(body.program&&!programs.some(p=>p.id===body.program))return invalid();await event(s.id,body.name,body.program??null);return Response.json({recorded:true},{headers});
 }else if(body.action==='feedback'){
 if(!Number.isInteger(body.confidence)||body.confidence<1||body.confidence>5)return invalid();await event(s.id,'feedback_submitted',null,body.confidence);
 }else if(body.action==='delete'){
 await db().batch([db().prepare('DELETE FROM events WHERE session_id=?').bind(s.id),db().prepare('DELETE FROM sessions WHERE id=?').bind(s.id)]);return Response.json({deleted:true},{headers:{...headers,'Set-Cookie':'aidpath=; Path=/; HttpOnly; Secure; SameSite=None; Partitioned; Max-Age=0'}});
 }else return invalid();
 s.answers=JSON.stringify(a);s.plan=JSON.stringify(plan);s.updated_at=Date.now();const update=await db().prepare('UPDATE sessions SET answers=?,plan=?,updated_at=?,revision=revision+1 WHERE id=? AND revision=?').bind(s.answers,s.plan,s.updated_at,s.id,s.revision).run();const changes=update.meta?.changes??(update as unknown as {changes:number}).changes;if(!changes){const latest=await db().prepare('SELECT * FROM sessions WHERE id=?').bind(s.id).first<Session>();return Response.json({error:'Your session changed. Please review and retry.',state:latest?await state(latest):null},{status:409,headers});}s.revision++;return Response.json(await state(s),{headers:{...headers,'Set-Cookie':cookie(s),'X-AidPath-Session':s.id}});
 }catch{return failure();}
}
