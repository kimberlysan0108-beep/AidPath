import test from 'node:test';import assert from 'node:assert/strict';
import {predicate,evaluate,rank} from '../lib/policy/engine.ts';
import {nextQuestion} from '../lib/policy/questions.ts';
import rawCatalog from '../data/programs.json' with {type:'json'};
const catalog=rawCatalog.map(p=>({...p,policy_review_status:'APPROVED'}));
const now=new Date('2026-10-02T00:00:00Z');
const r=(operator,value)=>({field:'x',operator,value,required:true,label:'test'});
test('all ten operators and strict boundaries',()=>{for(const [op,value,input,expected] of [['equals','yes','yes','matched'],['not_equals','yes','no','matched'],['in',['a','b'],'b','matched'],['not_in',['a'],'b','matched'],['less_than',5,5,'failed'],['greater_than',5,6,'matched'],['exists',true,null,'failed'],['before','2026-01-01','2025-12-31','matched'],['after','2026-01-01','2026-01-01','failed'],['older_than_days',1,'2026-10-01T00:00:00Z','failed']])assert.equal(predicate(r(op,value),input,now),expected);});
test('missing and malformed values stay unknown',()=>{assert.equal(predicate(r('equals','yes'),undefined),'unknown');assert.equal(predicate(r('less_than',3),'2'),'unknown');assert.equal(predicate(r('before','bad'),'2025-01-01'),'unknown');assert.equal(predicate(r('in','bad'),'a'),'unknown');});
test('failed required rule blocks ranking',()=>{const a={need:'financial',enrolled:'no',exhausted:'yes',recent_award:'no',unexpected:'yes'};assert.equal(rank(catalog,a,now).length,0);assert.equal(evaluate(catalog.find(p=>p.id==='emergency-fund'),a,now).status,'not_matched');});
test('unknown conditions remain explained',()=>{const result=evaluate(catalog.find(p=>p.id==='emergency-fund'),{enrolled:'yes'},now);assert.equal(result.status,'needs_information');assert.ok(result.unknown.length);});
test('missing provenance, changed, inaccessible and stale sources suppressed',()=>{for(const override of [{policy_version:''},{source_url:''},{source_hash:''},{review_status:'REVIEW_REQUIRED'},{review_status:'UNAVAILABLE'},{retrieved_at:'2020-01-01'}])assert.equal(rank([{...catalog[0],...override}],{need:'food',enrolled:'yes'},now).length,0);});
test('food preference affects ordering',()=>{assert.equal(rank(catalog,{need:'food',enrolled:'yes',food_type:'ongoing',urgency:'planning'},now)[0].id,'calfresh');});
test('food flow never asks housing urgency or housing subtype',()=>{assert.equal(nextQuestion({need:'food',enrolled:'yes',urgency:'now'}).field,'food_type');assert.equal(nextQuestion({need:'food',enrolled:'yes',urgency:'now',food_type:'groceries'}),null);});
test('every resource has source hash and known immutable version',()=>{assert.equal(catalog.length,15);for(const p of catalog){assert.match(p.source_url,/^https:\/\/[^/]*berkeley\.edu\//);assert.match(p.source_hash,/^[a-f0-9]{64}$/);assert.ok(p.policy_version);}});

test('unreviewed rules never become approved recommendations',()=>{const p={...catalog[0],policy_review_status:'DRAFT'};const a={need:'food',enrolled:'yes'};assert.equal(rank([p],a,now).length,0);assert.equal(rank([p],a,now,{preview:true}).length,1);});
test('unknown review statuses and impossible/future dates fail closed',()=>{const a={need:'food',enrolled:'yes'};assert.equal(rank([{...catalog[0],review_status:'invented'}],a,now).length,0);assert.equal(rank([{...catalog[0],retrieved_at:'2099-01-01'}],a,now).length,0);assert.equal(predicate(r('before','2026-03-10'),'2026-02-31'),'unknown');});
