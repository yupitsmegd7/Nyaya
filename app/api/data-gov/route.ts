import {env} from 'cloudflare:workers';
export async function GET(){
 const headers={'Cache-Control':'no-store'};
 const resource=env.DATA_GOV_RESOURCE_ID||'';
 if(!env.DATA_GOV_API_KEY||!resource)return Response.json({status:'not-configured',message:'No OGD dataset is connected. The verified NCRB publications remain available.'},{headers});
 if(!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(resource))return Response.json({status:'configuration-error',message:'The configured OGD resource identifier is invalid.'},{status:503,headers});
 const url=new URL('https://api.data.gov.in/resource/'+resource);url.searchParams.set('api-key',env.DATA_GOV_API_KEY);url.searchParams.set('format','json');url.searchParams.set('limit','100');
 try{const res=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(12000)});if(!res.ok)throw new Error();const data=await res.json() as Record<string,unknown>;if(!Array.isArray(data.records))throw new Error();
 return Response.json({status:'source-refreshed',title:typeof data.title==='string'?data.title:'Configured OGD dataset',resource,sourceUrl:'https://www.data.gov.in/apis/'+resource,retrievedAt:new Date().toISOString(),total:data.total??null,records:data.records.slice(0,100),note:'First 100 records from the owner-selected resource. Its fields and reporting dates must be checked before combining it with another series.'},{headers});
 }catch{return Response.json({status:'unavailable',message:'The configured OGD resource could not be fetched. Check its resource ID, API access and key.'},{status:503,headers})}
}
