#!/usr/bin/env node
import {fileURLToPath} from 'node:url';
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const pluginPath=fileURLToPath(new URL('./plugin.mjs',import.meta.url)).replaceAll('\\','/');
const patch='- insert:\n    - id: dsh-handoff-card\n      name: '+JSON.stringify(pluginPath)+'\n';
const args=process.argv.slice(2);
try{
 if(!args.length||args[0]==='--stdout')process.stdout.write(patch);
 else if(args.length===2&&args[0]==='--write'){const path=resolve(args[1]);await writeFile(path,patch,{flag:'wx'});console.log('Created '+path+'\nRun: npx @deepseek-ai/dsh@0.2.1-rc.2 web --patch "'+path+'" --no-open');}
 else if(['--help','-h'].includes(args[0]))console.log('node setup.mjs [--stdout | --write PATH]\nPrint or create a Cordis patch for this plugin. Existing files are never overwritten.');
 else throw new Error('Use --help for supported options.');
}catch(e){console.error('Setup: '+e.message);process.exitCode=1;}
