import {env} from 'cloudflare:workers';
export function db(){if(!env.DB)throw new Error('storage_unavailable');return env.DB;}
