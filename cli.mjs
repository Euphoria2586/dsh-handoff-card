#!/usr/bin/env node
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {extname} from 'node:path';
import {parseCard,handoffMarkdown,handoffSVG} from './src/engine.mjs';
const NAME="DSH Handoff Card";
function serve(port) {
  const routes=new Map([['/','web/index.html'],['/index.html','web/index.html'],['/app.mjs','web/app.mjs'],['/style.css','web/style.css'],['/src/engine.mjs','src/engine.mjs']]);
  const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
  const allowedHosts=new Set(['127.0.0.1:'+port,'localhost:'+port]);
  const server=createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Content-Security-Policy',"default-src 'self'; connect-src 'none'; img-src 'self' blob: data:; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
    if(!allowedHosts.has(req.headers.host)){res.writeHead(403);res.end('Loopback host required.');return;}
    if(req.headers.origin&&!['http://127.0.0.1:'+port,'http://localhost:'+port].includes(req.headers.origin)){res.writeHead(403);res.end('Origin not allowed.');return;}
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
    const path=req.url.split('?')[0];const file=routes.get(path);
    if(!file){res.writeHead(404);res.end('Not found');return;}
    try{const data=await readFile(new URL(file,import.meta.url));res.writeHead(200,{'Content-Type':mime[extname(file)]});res.end(req.method==='HEAD'?undefined:data);}
    catch{res.writeHead(500);res.end('Could not read application asset.');}
  });
  server.on('error',e=>{process.stderr.write('Server error: '+e.code+'\n');process.exitCode=1;});
  server.requestTimeout=5000;server.headersTimeout=5000;
  server.listen(port,'127.0.0.1',()=>process.stdout.write(NAME+' → http://127.0.0.1:'+port+'\n'));
}
async function readBounded(path) {if((await stat(path)).size>1024*1024)throw new Error('File exceeds 1 MiB.');return readFile(path,'utf8');}


async function main(){
 const [cmd,...args]=process.argv.slice(2);
 if(!cmd||['help','-h','--help'].includes(cmd)){console.log(NAME+'\n\nnode cli.mjs serve [--port 4188]\nnode cli.mjs inspect input.json [--format json|md|svg]\nnode setup.mjs --write ./cordis.yml\n\nWeb demo is offline and simulated, not connected to a DSH session.');return;}
 if(cmd==='serve'){if(args.length&&!(args.length===2&&args[0]==='--port'))throw new Error('Use serve [--port NUMBER].');const port=args.length?Number(args[1]):4188;if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Port must be 1024–65535.');serve(port);return;}
 if(cmd!=='inspect'||![1,3].includes(args.length)||args.length===3&&args[1]!=='--format')throw new Error('Use --help for supported commands.');
 const format=args[2]??'json';if(!['json','md','svg'].includes(format))throw new Error('Format must be json, md or svg.');
 const r=parseCard(await readBounded(args[0]));console.log(format==='md'?handoffMarkdown(r):format==='svg'?handoffSVG(r):JSON.stringify(r,null,2));
}
main().catch(e=>{console.error(NAME+': '+e.message);process.exitCode=1;});
