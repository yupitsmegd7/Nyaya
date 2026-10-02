import {env} from 'cloudflare:workers';
import {retrieve,generateAnswer} from '@/lib/ask';
const headers={'Cache-Control':'no-store','Content-Type':'application/json'};
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers});
const limits=new Map<string,{count:number;until:number}>();
export async function GET(){return reply({service:'Nyaya situation API',mode:env.OPENAI_API_KEY?'ai':'retrieval',aiConfigured:Boolean(env.OPENAI_API_KEY),privacy:'Situation text is sent to this server. When AI is configured, it is also sent to OpenAI with official-domain web search. Nyaya does not store situation text in a database.'})}
export async function POST(request:Request){
 const origin=request.headers.get('origin');
 if(origin&&origin!==new URL(request.url).origin)return reply({error:'This endpoint accepts same-origin browser requests only.'},403);
 if(!request.headers.get('content-type')?.includes('application/json'))return reply({error:'Send application/json.'},415);
 const now=Date.now();
 for(const [k,v]of limits)if(v.until<now)limits.delete(k);
 const client=request.headers.get('cf-connecting-ip')||'local';const bucket=limits.get(client)||{count:0,until:now+60000};
 if(bucket.count>=6)return Response.json({error:'Please wait a minute before asking again.'},{status:429,headers:{...headers,'Retry-After':'60'}});
 bucket.count++;if(limits.size<10000||limits.has(client))limits.set(client,bucket);else return reply({error:'The service is busy. Please try again shortly.'},503);
 let input:unknown;try{if(Number(request.headers.get('content-length')||0)>12000)return reply({error:'Request is too large.'},413);const body=await request.text();if(body.length>12000)return reply({error:'Request is too large.'},413);input=JSON.parse(body)}catch{return reply({error:'Invalid JSON request.'},400)}
 if(!input||typeof input!=='object')return reply({error:'Provide a situation.'},400);
 const {situation,region='',incidentDate=''}=input as Record<string,unknown>;
 if(typeof situation!=='string'||situation.trim().length<3||situation.length>2000||typeof region!=='string'||region.length>100||typeof incidentDate!=='string'||(incidentDate!==''&&!/^\d{4}-\d{2}-\d{2}$/.test(incidentDate)))return reply({error:'Use a situation of 3–2000 characters, a short location and a valid date.'},400);
 const base=retrieve(situation.trim(),region,incidentDate);
 if(!env.OPENAI_API_KEY)return reply(base);
 try{return reply(await generateAnswer(base,situation.trim(),env.OPENAI_API_KEY,env.OPENAI_MODEL||'gpt-4.1-mini'))}catch{return reply({...base,warning:[base.warning,'AI answers are temporarily unavailable or lacked verifiable official citations. Showing curated source matches instead.'].filter(Boolean).join(' ')})}
}
