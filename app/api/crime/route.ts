import snapshot from '@/lib/crime-snapshot.json';
import {CRIME_URL,fetchOfficial,parseCrime} from '@/lib/government-feeds';
let cached:Record<string,unknown>|undefined,expires=0;
export async function GET(){
 if(cached&&Date.now()<expires)return Response.json(cached,{headers:{'Cache-Control':'no-store'}});
 const checkedAt=new Date().toISOString();
 try{const data=parseCrime(await fetchOfficial(CRIME_URL));cached={...data,status:'source-refreshed',retrievedAt:checkedAt,checkedAt,message:'Fetched from the official PIB publication. These remain annual statistics for 2020–2024.'};expires=Date.now()+15*60*1000;return Response.json(cached,{headers:{'Cache-Control':'no-store'}})}
 catch{return Response.json({...snapshot,checkedAt,message:'The official source could not be refreshed. Showing the saved official publication, checked 2 October 2026; not live crime data.'},{headers:{'Cache-Control':'no-store'}})}
}
