export type Reminder={at:string};
export function validReminder(at:unknown,now=Date.now()):at is string{
 if(typeof at!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(at))return false;
 const date=new Date(at);return Number.isFinite(date.getTime())&&date.toISOString()===at&&date.getTime()>now;
}
const escape=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
function fold(s:string){let line='',bytes=0;const lines=[];for(const c of s){const n=new TextEncoder().encode(c).length;if(bytes+n>73){lines.push(line);line=' ';bytes=1;}line+=c;bytes+=n;}lines.push(line);return lines.join('\r\n');}
const stamp=(s:string)=>s.replace(/[-:]/g,'').replace(/\.\d{3}/,'');
export function reminderCalendar(program:{id:string;name:string;source_url:string},at:string,lang:'en'|'es',now=new Date()){
 if(!Number.isFinite(Date.parse(at)))throw new Error('Invalid reminder date');
 const title=lang==='es'?'AidPath: revisa tu próximo paso':'AidPath: check your next step';
 const description=(lang==='es'?'Recordatorio personal, no una fecha límite oficial. Revisa: ':'Personal reminder, not an official deadline. Review: ')+program.name+'\n'+program.source_url;
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//AidPath//Personal Reminders//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${program.id}-${stamp(at)}@aidpath`,`DTSTAMP:${stamp(now.toISOString())}`,`DTSTART:${stamp(at)}`,`DTEND:${stamp(new Date(Date.parse(at)+15*60000).toISOString())}`,`SUMMARY:${escape(title)}`,`DESCRIPTION:${escape(description)}`,'BEGIN:VALARM','ACTION:DISPLAY','TRIGGER:PT0M',`DESCRIPTION:${escape(title)}`,'END:VALARM','END:VEVENT','END:VCALENDAR'].map(fold).join('\r\n')+'\r\n';
}
