import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {request,createServer} from 'node:http';
import {fileURLToPath} from 'node:url';
let child,port;
test.before(async()=>{
 const probe=createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));port=probe.address().port;await new Promise(r=>probe.close(r));
 child=spawn(process.execPath,['cli.mjs','serve','--port',String(port)],{cwd:fileURLToPath(new URL('..',import.meta.url)),stdio:['ignore','pipe','pipe']});
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Server startup timeout')),5000);child.stdout.once('data',()=>{clearTimeout(timer);resolve();});child.once('error',e=>{clearTimeout(timer);reject(e);});child.once('exit',()=>{clearTimeout(timer);reject(new Error('Server exited before test'));});});
});
test.after(()=>child?.kill());
function get(path,headers={},method='GET'){return new Promise((resolve,reject)=>{const req=request({hostname:'127.0.0.1',port,path,method,headers},res=>{let data='';res.on('data',c=>data+=c);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,data}));});req.on('error',reject);req.end();});}
test('workbench and module routes resolve with restrictive headers',async()=>{for(const path of ['/','/app.mjs','/style.css','/src/engine.mjs']){const r=await get(path);assert.equal(r.status,200,path);assert.ok(r.data.length>0);assert.match(r.headers['content-security-policy'],/connect-src 'none'/);}});
test('arbitrary paths, config files and traversal are not exposed',async()=>{for(const path of ['/package.json','/examples/config.json','/../package.json','/%2e%2e/package.json','/src/engine.mjs/extra'])assert.equal((await get(path)).status,404,path);});
test('nonloopback Host, cross-origin calls and mutation methods are rejected',async()=>{assert.equal((await get('/',{Host:'attacker.example'})).status,403);assert.equal((await get('/',{Origin:'https://attacker.example'})).status,403);assert.equal((await get('/',{},'POST')).status,405);});
test('HEAD returns no response body',async()=>{const r=await get('/',{},'HEAD');assert.equal(r.status,200);assert.equal(r.data,'');});
