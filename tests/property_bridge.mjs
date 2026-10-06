import {evaluate,rank} from '../lib/policy/engine.ts';import {readFileSync} from 'node:fs';
const inputs=JSON.parse(readFileSync(0,'utf8'));process.stdout.write(JSON.stringify(inputs.map(({program,answers})=>({evaluation:evaluate(program,answers),recommendations:rank([program],answers)}))));
