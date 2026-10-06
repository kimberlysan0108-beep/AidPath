import type {Answers} from './engine';
export const needs=[{id:'housing',title:'Housing & rent',description:'Rent, deposits, or a safe place to stay',icon:'home'},{id:'food',title:'Food & groceries',description:'Groceries, meals, and ongoing food support',icon:'food'},{id:'financial',title:'Unexpected expenses',description:'Emergency costs and financial guidance',icon:'wallet'},{id:'technology',title:'Assistive technology',description:'Equipment that supports access to learning',icon:'tech'}];
const yesno=[['yes','Yes'],['no','No'],['unknown','Not sure / prefer not to say']];
export type Question={field:string;title:string;help:string;options:string[][]};
export function questions(a:Answers):Question[]{
 const q:Question[]=[{field:'enrolled',title:'Are you currently enrolled at UC Berkeley?',help:'Some resources require current-term enrollment.',options:yesno},{field:'urgency',title:'When do you need support?',help:'This helps order your options. It does not speed up a program’s response.',options:[['now','Today or in the next few days'],['soon','In the next few weeks'],['planning','I’m planning ahead']]}];
 if(a.need==='housing')q.push({field:'housing_type',title:'What housing support would help most?',help:'Choose the closest situation. You do not need to share your address.',options:[['rent','I’m struggling to pay rent'],['unsafe','I have nowhere safe to stay / may lose housing'],['deposit','I need help with a security deposit'],['search','I’m looking for housing'],['legal','I have a landlord or tenant-rights issue']]});
 if(a.need==='food')q.push({field:'food_type',title:'What kind of food support are you looking for?',help:'You can browse all food resources after your plan is ready.',options:[['groceries','Groceries soon'],['meals','Prepared meals'],['ongoing','Ongoing food benefits'],['award','Food costs beyond what the pantry can cover']]});
 if(a.need==='financial'||(a.need==='housing'&&['rent','unsafe','deposit'].includes(String(a.housing_type)))||(a.need==='food'&&a.food_type==='award')){
 q.push({field:'unexpected',title:'Is this an unexpected or emergency situation?',help:'Emergency programs may not cover planned gaps between housing contracts.',options:yesno},{field:'exhausted',title:'Have you exhausted your available financial resources?',help:'This is a published condition for the emergency fund. No balances or bank documents are collected here.',options:yesno});
 if(a.housing_type!=='unsafe')q.push({field:'recent_award',title:'Have you received Basic Needs Emergency Fund support in the past two years?',help:'The published fund rules include a two-year restriction.',options:yesno});
 }
 if(a.need==='technology')q.push({field:'disability',title:'Are you seeking technology for a disability-related access need?',help:'Do not share a diagnosis. You can skip this question.',options:yesno},{field:'fafsa',title:'Have you completed a FAFSA?',help:'This is listed on the DSP technology grant page.',options:yesno});
 return q;
}
export function nextQuestion(a:Answers){return questions(a).find(q=>a[q.field]===undefined)??null;}
