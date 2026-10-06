import test from 'node:test';import assert from 'node:assert/strict';
import {GET,POST} from '../app/api/aidpath/route.ts';
import {sql} from './runtime.mjs';
const origin='https://aidpath.test';
test('API → database → questionnaire → ranking → saved plan → deletion',async()=>{
 const initial=await GET(new Request(origin+'/api/aidpath'));assert.equal(initial.status,200);const cookie=initial.headers.get('set-cookie').split(';')[0];const post=async(body,customOrigin=origin)=>POST(new Request(origin+'/api/aidpath',{method:'POST',headers:{cookie,origin:customOrigin,'Content-Type':'application/json'},body:JSON.stringify(body)}));
 assert.equal((await post({action:'select_need',need:'housing'},'https://evil.test')).status,403);
 assert.equal((await post({action:'select_need',need:'invalid'})).status,400);
 await post({action:'select_need',need:'food'});
 assert.equal((await post({action:'answer',field:'housing_type',value:'rent'})).status,400);
 for(const [field,value] of [['enrolled','yes'],['urgency','soon'],['food_type','ongoing']])assert.equal((await post({action:'answer',field,value})).status,200);
 let data=await (await GET(new Request(origin+'/api/aidpath',{headers:{cookie}}))).json();assert.equal(data.previewRecommendations[0].id,'calfresh');
 await post({action:'save',program:'calfresh'});await post({action:'check',program:'calfresh',step:0,checked:true});data=await (await GET(new Request(origin+'/api/aidpath',{headers:{cookie}}))).json();assert.deepEqual(data.plan[0].checked,[0]);assert.equal(data.plan[0].program.id,'calfresh');assert.equal(data.recommendations.length,0);
 const at=new Date(Date.now()+86400000).toISOString();
 assert.equal((await post({action:'reminder',program:'calfresh',at:'2026-02-31T10:00:00.000Z'})).status,400);
 assert.equal((await post({action:'reminder',program:'calfresh',at})).status,200);
 data=await (await GET(new Request(origin+'/api/aidpath',{headers:{cookie}}))).json();assert.equal(data.plan[0].reminder.at,at);
 assert.equal((await post({action:'reminder',program:'pantry',at})).status,400);
 await post({action:'reminder',program:'calfresh',at:null});
 data=await (await GET(new Request(origin+'/api/aidpath',{headers:{cookie}}))).json();assert.equal(data.plan[0].reminder,undefined);
 const rev=data.revision;await post({action:'restart',revision:rev});const conflict=await post({action:'save',program:'pantry',revision:rev});assert.equal(conflict.status,409);const resumed=await (await GET(new Request(origin+'/api/aidpath',{headers:{cookie}}))).json();assert.deepEqual(resumed.answers,{});assert.equal(resumed.plan.length,1);
 const other=await (await GET(new Request(origin+'/api/aidpath'))).json();assert.equal(other.plan.length,0);
 await post({action:'feedback',confidence:4});assert.ok(sql.prepare("SELECT count(*) n FROM events WHERE name='feedback_submitted'").get().n);
 assert.equal((await post(null)).status,400);await post({action:'delete'});assert.equal(sql.prepare('SELECT count(*) n FROM sessions WHERE id=?').get(cookie.split('=')[1]).n,0);assert.equal(sql.prepare('SELECT count(*) n FROM events WHERE session_id=?').get(cookie.split('=')[1]).n,0);
});

test('lost sessions never return an empty success or replacement questionnaire',async()=>{
 const r=await POST(new Request(origin+'/api/aidpath',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify({action:'answer',field:'enrolled',value:'yes',revision:1})}));
 assert.equal(r.status,401);const body=await r.json();assert.equal(body.state,undefined);assert.match(body.error,/session was interrupted/);
 const initial=await GET(new Request(origin+'/api/aidpath'));assert.match(initial.headers.get('set-cookie'),/SameSite=None; Partitioned/);assert.match(initial.headers.get('X-AidPath-Session'),/^[a-f0-9]{64}$/);
});
