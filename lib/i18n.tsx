import {Children,cloneElement,isValidElement,type ReactNode,type ReactElement} from 'react';
import spanish from '../data/es.json';
export type Language='en'|'es';
const phrases=spanish as Record<string,string>;
export function translate(text:string,language:Language):string{
 if(language==='en'||!text.trim())return text;
 const key=text.trim();let translated:string|undefined=phrases[key];
 if(!translated){
 const fixed:Record<string,string>={'Question':'Pregunta','of':'de','or more':'o más','OF':'DE','STEPS COMPLETE':'PASOS COMPLETADOS','Based on your':'Según tus necesidades de','needs. These are possibilities, not approvals.':'Estas son posibilidades, no aprobaciones.','support resources and pathways. Four are part of the same emergency fund.':'recursos y opciones de apoyo. Cuatro pertenecen al mismo fondo de emergencia.','Saved policy':'Versión guardada','· Last source retrieval':'· Última consulta de la fuente','Version':'Versión','Source retrieved:':'Fuente consultada:','Effective date:':'Fecha de vigencia:','Source check:':'Verificación de la fuente:','Policy review:':'Revisión de reglas:','Routing score:':'Puntuación de orientación:','/100, not an eligibility probability.':'/100; no es una probabilidad de elegibilidad.','Category':'Categoría','· evidence':'· coincidencias','· urgency':'· urgencia','· priority':'· prioridad','· preference':'· preferencia','SOURCE_CHECKED':'FUENTE VERIFICADA','REVIEW_REQUIRED':'REVISIÓN NECESARIA','UNAVAILABLE':'NO DISPONIBLE'};
 translated=fixed[key];
 if(!translated&&key.endsWith(' added to your action plan.'))translated=translate(key.replace(' added to your action plan.',''),language)+' se agregó a tu plan de acción.';
 if(!translated&&/^Confidence \d out of 5$/.test(key))translated=key.replace(/Confidence (\d) out of 5/,'Confianza $1 de 5');
 if(!translated&&key.startsWith('Save '))translated='Guardar '+translate(key.slice(5),language);
 if(!translated&&key.startsWith('Remove '))translated='Eliminar '+translate(key.slice(7),language);
 if(!translated&&key.endsWith(' saved'))translated=translate(key.slice(0,-6),language)+' guardado';
 if(!translated){const pair=Object.entries(phrases).find(([en])=>en.toLowerCase()===key);translated=pair?.[1];}
 }
 return translated?text.replace(key,translated):text;
}
// Translate the declarative element tree before React renders it; never mutate the DOM.
// IDs, values, policy rules, event handlers and official program names stay unchanged.
export function translateTree(node:ReactNode,language:Language):ReactNode{
 if(language==='en')return node;
 if(typeof node==='string')return translate(node,language);
 if(Array.isArray(node))return node.map(child=>translateTree(child,language));
 if(!isValidElement(node))return node;
 const element=node as ReactElement<Record<string,unknown>>;if(element.props.translate==='no')return node;const props:Record<string,unknown>={};
 for(const name of ['aria-label','placeholder','title'])if(typeof element.props[name]==='string')props[name]=translate(element.props[name] as string,language);
 if('children' in element.props)props.children=Children.map(element.props.children as ReactNode,child=>translateTree(child,language));
 return cloneElement(element,props);
}

export function message(key:string,language:Language,values:Record<string,string|number>){
 return translate(key,language).replace(/\{(\w+)\}/g,(_,name)=>String(values[name]??''));
}
