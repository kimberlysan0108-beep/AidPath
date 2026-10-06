import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
const sql=new DatabaseSync(':memory:');
for(const path of readdirSync(new URL('../drizzle/',import.meta.url)).filter(p=>p.endsWith('.sql')).sort())sql.exec(readFileSync(new URL('../drizzle/'+path,import.meta.url),'utf8'));
export const env={DB:{prepare(query){let params=[];return {bind(...args){params=args;return this;},async first(){return sql.prepare(query).get(...params)??null;},async all(){return {results:sql.prepare(query).all(...params)};},async run(){return sql.prepare(query).run(...params);}};},async batch(statements){sql.exec('BEGIN');try{const r=[];for(const s of statements)r.push(await s.run());sql.exec('COMMIT');return r;}catch(e){sql.exec('ROLLBACK');throw e;}}}};
export {sql};
