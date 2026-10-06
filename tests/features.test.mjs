import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {validReminder,reminderCalendar} from '../lib/reminders.ts';import {translate} from '../lib/i18n.tsx';import {questions,needs} from '../lib/policy/questions.ts';
test('Spanish covers every questionnaire and source-derived guidance without changing rules',()=>{
 const strings=new Set();for(const need of needs){strings.add(need.title);strings.add(need.description);for(const housing_type of ['rent','unsafe','deposit','search','legal'])for(const food_type of ['groceries','meals','ongoing','award'])for(const q of questions({need:need.id,housing_type,food_type})){strings.add(q.title);strings.add(q.help);for(const [,label] of q.options)if(label!=='No')strings.add(label);}}
 const catalog=JSON.parse(readFileSync(new URL('../data/programs.json',import.meta.url)));for(const p of catalog){for(const s of [p.summary,p.caveat,...p.steps,...p.documents,...p.rules.map(r=>r.label)])strings.add(s);}
 for(const s of strings)assert.notEqual(translate(s,'es'),s,`Missing Spanish: ${s}`);
});
test('reminders validate dates and generate UTC calendar alarms with safe escaped content',()=>{
 const now=Date.parse('2026-10-06T12:00:00.000Z');assert.equal(validReminder('2026-02-31T12:00:00.000Z',now),false);assert.equal(validReminder('2026-10-05T12:00:00.000Z',now),false);assert.equal(validReminder('2026-10-07T19:30:00.000Z',now),true);
 const ics=reminderCalendar({id:'rent',name:'Resource, A; B\nNotes',source_url:'https://example.org'},'2026-10-07T19:30:00.000Z','es',new Date(now));assert.match(ics,/DTSTART:20261007T193000Z/);assert.match(ics,/DTEND:20261007T194500Z/);assert.match(ics,/BEGIN:VALARM\r\nACTION:DISPLAY\r\nTRIGGER:PT0M/);assert.match(ics,/Resource\\, A\\; B\\nNotes/);assert.match(ics,/no una fecha/);for(const line of ics.split('\r\n'))assert.ok(Buffer.byteLength(line)<=75);
});
