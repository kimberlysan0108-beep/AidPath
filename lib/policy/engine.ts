export type Operator = 'equals'|'not_equals'|'in'|'not_in'|'less_than'|'greater_than'|'exists'|'before'|'after'|'older_than_days';
export type Answers = Record<string,string|number|boolean|null>;
export type Rule = {field:string;operator:Operator;value?:unknown;required:boolean;label:string;kind?:'routing'|'policy'};
export type Program = {id:string;name:string;category:string[];summary:string;source_url:string;source_hash:string;retrieved_at:string;effective_date:string|null;policy_version:string;review_status:string;policy_review_status?:string;rules:Rule[];steps:string[];documents:string[];caveat:string;priority:number;urgent:boolean};
export type Evidence = {rule:Rule;result:'matched'|'failed'|'unknown'};
const date = (v:unknown) => {
 if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(v))return NaN;
 const day=v.slice(0,10);const parsed=Date.parse(v);const dateOnly=Date.parse(day+'T00:00:00Z');
 return Number.isFinite(parsed)&&Number.isFinite(dateOnly)&&new Date(dateOnly).toISOString().slice(0,10)===day?parsed:NaN;
};
export function predicate(rule:Rule, answer:unknown, now = new Date()): Evidence['result'] {
 if(rule.operator==='exists') return (answer!==undefined && answer!==null && answer!=='unknown') === (rule.value!==false) ? 'matched':'failed';
 if(answer===undefined||answer===null||answer==='unknown')return 'unknown';
 let result:boolean;
 switch(rule.operator){
 case 'equals':result=answer===rule.value;break;
 case 'not_equals':result=answer!==rule.value;break;
 case 'in':case 'not_in':if(!Array.isArray(rule.value))return 'unknown';result=rule.value.includes(answer);if(rule.operator==='not_in')result=!result;break;
 case 'less_than':case 'greater_than':if(typeof answer!=='number'||typeof rule.value!=='number'||!Number.isFinite(answer)||!Number.isFinite(rule.value))return 'unknown';result=rule.operator==='less_than'?answer<rule.value:answer>rule.value;break;
 case 'before':case 'after':if(!Number.isFinite(date(answer))||!Number.isFinite(date(rule.value)))return 'unknown';result=rule.operator==='before'?date(answer)<date(rule.value):date(answer)>date(rule.value);break;
 case 'older_than_days':if(!Number.isFinite(date(answer))||typeof rule.value!=='number'||rule.value<0)return 'unknown';result=now.getTime()-date(answer)>rule.value*86400000;break;
 default:return 'unknown';
 }
 return result?'matched':'failed';
}
export const WEIGHTS={category:30,evidence:25,urgency:15,priority:10,preference:20};
export function evaluate(program:Program, answers:Answers, now=new Date()){
 const evidence=program.rules.map(rule=>({rule,result:predicate(rule,answers[rule.field],now)}));
 const failed=evidence.filter(e=>e.result==='failed'&&e.rule.required);
 const unknown=evidence.filter(e=>e.result==='unknown');
 const status=failed.length?'not_matched':unknown.length?'needs_information':'potential_match';
 return {status,evidence,matched:evidence.filter(e=>e.result==='matched'),failed,unknown};
}
export function rank(programs:Program[],answers:Answers,now=new Date(), options:{preview?:boolean}={}){
 return programs.filter(p=>p.policy_version&&p.source_url&&p.source_hash&&p.review_status==='SOURCE_CHECKED'&&(p.policy_review_status==='APPROVED'||options.preview===true)&&now.getTime()>=Date.parse(p.retrieved_at)&&now.getTime()-Date.parse(p.retrieved_at)<30*86400000&&p.category.includes(String(answers.need))).map(p=>{
 const evaluation=evaluate(p,answers,now);
 const preferred:Record<string,string>={groceries:'pantry',meals:'meals',ongoing:'calfresh',award:'food-award'};
 const components={preference:preferred[String(answers.food_type)]===p.id?WEIGHTS.preference:0,category:WEIGHTS.category,evidence:Math.round(WEIGHTS.evidence*evaluation.matched.length/Math.max(p.rules.length,1)),urgency:p.urgent&&answers.urgency==='now'?WEIGHTS.urgency:0,priority:p.priority*WEIGHTS.priority/10};
 return {...p,...evaluation,components,score:Object.values(components).reduce((a,b)=>a+b,0)};
 }).filter(p=>p.status!=='not_matched').sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}
