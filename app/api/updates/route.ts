import {RSS_URL,fetchOfficial,parseUpdates} from '@/lib/government-feeds';
let cached:Record<string,unknown>|undefined,expires=0;
export async function GET(){
 if(cached&&Date.now()<expires)return Response.json(cached,{headers:{'Cache-Control':'no-store'}});
 const checkedAt=new Date().toISOString();
 try{const items=parseUpdates(await fetchOfficial(RSS_URL));if(!items.length)throw new Error('Empty feed');cached={status:'source-refreshed',items,checkedAt,source:RSS_URL};expires=Date.now()+15*60*1000;return Response.json(cached,{headers:{'Cache-Control':'no-store'}})}
 catch{return Response.json({status:'unavailable',items:[],checkedAt,source:RSS_URL,message:'The official PIB feed is temporarily unavailable. Open PIB to check current releases.'},{headers:{'Cache-Control':'no-store'}})}
}
