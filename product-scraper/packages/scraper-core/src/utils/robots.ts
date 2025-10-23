import robotsParser from 'robots-parser';
import axios from 'axios';

const cache = new Map<string,{p:any,t:number}>();
const TTL = 24*60*60*1000;

export async function checkRobotsTxt(url:string): Promise<boolean>{
  const u = new URL(url);
  const robotsUrl = `${u.protocol}//${u.host}/robots.txt`;
  const cached = cache.get(robotsUrl);
  if(cached && Date.now()-cached.t<TTL){
    return cached.p.isAllowed(url,'ProductScraperBot') !== false;
  }
  try{
    const resp = await axios.get(robotsUrl, { timeout: 5000, validateStatus: s => [200,404].includes(s) });
    if(resp.status===404) return true;
    const parser = robotsParser(robotsUrl, resp.data);
    cache.set(robotsUrl,{p:parser,t:Date.now()});
    return parser.isAllowed(url,'ProductScraperBot') !== false;
  }catch{
    return true;
  }
}
