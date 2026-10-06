// Memory-only fallback for embedded browsers that do not retain session cookies.
// This server-issued random bearer token never enters URLs or persistent storage.
let sessionToken:string|null=null;
export async function sessionFetch(input:string,init:RequestInit={}){
 const headers=new Headers(init.headers);
 if(sessionToken)headers.set('Authorization',`Bearer ${sessionToken}`);
 const response=await fetch(input,{...init,headers,credentials:'same-origin'});
 const token=response.headers.get('X-AidPath-Session');
 if(token&&/^[a-f0-9]{64}$/.test(token))sessionToken=token;
 return response;
}
export function clearClientSession(){sessionToken=null;}
