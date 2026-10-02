import snapshot from './crime-snapshot.json';
export const CRIME_URL=snapshot.sourceUrl;
export const RSS_URL='https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3';
export function clean(s:string){return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&apos;|&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim()}
export function parseCrime(html:string){
 const rows=[...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(r=>[...r[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(c=>clean(c[1])));
 const states:{name:string;values:(number|null)[]}[]=[],heads:{name:string;values:(number|null)[]}[]=[];let mode='';
 for(const row of rows){if(row.length!==7)continue;if(row[1]==='State/UT'){if(states.length)break;if(row.slice(2).join(',')!==snapshot.years.join(','))throw new Error('Reporting years changed');mode='states';continue;}if(row[1]==='Crime Head'){mode='heads';continue;}if(!mode||['TOTAL STATE(S)','TOTAL UT(S)'].includes(row[1]))continue;
 const values=row.slice(2).map(x=>/^\d[\d,]*$/.test(x)?Number(x.replaceAll(',','')):null);if(values.every(v=>v===null))continue;
 (mode==='states'?states:heads).push({name:row[1]==='TOTAL (ALL INDIA)'?'All India':row[1],values});}
 const all=states.find(x=>x.name==='All India');if(states.length!==37||!all||all.values.some(x=>x===null)||heads.length<5)throw new Error('Official source format changed');
 return {...snapshot,states,heads};
}
export function parseUpdates(xml:string){
 if(!/<rss\b/i.test(xml))throw new Error('Invalid official feed');
 return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map(m=>{const tag=(t:string)=>clean(m[1].match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)<\\/${t}>`,'i'))?.[1]??'');return {title:tag('title'),url:tag('link'),publishedAt:tag('pubDate')};}).filter(x=>{try{return x.title&&new URL(x.url).hostname.match(/(^|\.)pib\.gov\.in$/)}catch{return false}}).slice(0,40);
}
export async function fetchOfficial(url:string){const r=await fetch(url,{signal:AbortSignal.timeout(12000),headers:{Accept:'text/html,application/xml,text/xml'},redirect:'follow'});if(!r.ok)throw new Error('Official source unavailable');if(!new URL(r.url).hostname.match(/(^|\.)pib\.gov\.in$/))throw new Error('Unexpected source redirect');const text=await r.text();if(text.length>3000000)throw new Error('Source size limit');return text}
