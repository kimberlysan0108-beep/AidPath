import {env} from 'cloudflare:workers';
import {maintenance} from '../../../lib/maintenance';
export async function POST(request:Request){const secret=(env as unknown as Record<string,string>).MAINTENANCE_TOKEN;if(!secret||request.headers.get('authorization')!==`Bearer ${secret}`)return Response.json({error:'Unauthorized'},{status:401});try{return Response.json({results:await maintenance()});}catch{return Response.json({error:'Maintenance failed'},{status:503});}}
