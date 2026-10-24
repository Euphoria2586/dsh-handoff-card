import {normalizeCard,parseCommand,handoffMarkdown,createCheckpointHistory,pushCheckpoint,currentCheckpoint,undoCheckpoint,historyMarkdown} from './src/engine.mjs';
export const name='dsh-handoff-card';
export const inject=['commands','tools'];
export function apply(ctx){
 const histories=new WeakMap();
 const state=session=>histories.get(session)??createCheckpointHistory();
 const sessionOf=agent=>{const s=agent?.session;if(!s||typeof s!=='object')throw new Error('An active DSH session is required.');return s;};
 ctx.commands.register({definitionId:'dsh-handoff-card:handoff',name:'handoff',description:'Store, inspect or undo explicit session handoff checkpoints.',input:{hint:'set JSON | show | json | history | undo | clear [zh]'},recordInput:false,handler:({agent,rawInput,signal})=>{
  try{if(signal?.aborted)throw new Error('Command cancelled.');const session=sessionOf(agent),cmd=parseCommand(rawInput),zh=cmd.language==='zh';
   if(cmd.action==='set'){histories.set(session,pushCheckpoint(state(session),cmd.card));return {kind:'success',text:'Handoff card saved in this session’s plugin memory (up to 5 checkpoints). Use /handoff show or /handoff json to copy it before restart; /handoff undo restores the previous checkpoint.'};}
   if(cmd.action==='clear'){histories.delete(session);return {kind:'success',text:zh?'当前卡片与全部撤销历史已从插件内存清除。宿主中先前展示的命令/工具历史不会被删除。':'In-memory handoff and all undo history cleared. Previously displayed DSH command/tool history is not deleted.'};}
   if(cmd.action==='history')return {kind:'success',text:historyMarkdown(state(session),cmd.language)};
   if(cmd.action==='undo'){if(state(session).entries.length<2)return {kind:'error',text:zh?'没有更早的检查点可恢复。':'No earlier checkpoint to restore.'};histories.set(session,undoCheckpoint(state(session)));return {kind:'success',text:(zh?'已恢复上一检查点。\n\n':'Previous checkpoint restored.\n\n')+handoffMarkdown(currentCheckpoint(state(session)),cmd.language)};}
   if(cmd.action==='help')return {kind:'success',text:zh?'使用 /handoff set {"goal":"...","progress":[],"next":[],"blockers":[],"links":[]}；show、json、history、undo、clear 可追加 zh。最多保留5次检查点，重启前请导出。':'Use /handoff set {"goal":"...","progress":[],"next":[],"blockers":[],"links":[]}; then show, json, history, undo or clear. Append zh for Chinese. Keep up to 5 checkpoints; export before restart.'};
   const card=currentCheckpoint(state(session));if(!card)return {kind:'success',text:zh?'尚无交接卡。使用 /handoff set {"goal":"你的目标","next":["下一步"]}。':'No handoff yet. Use /handoff set {"goal":"Your goal","next":["Next action"]}.'};
   return {kind:'success',text:cmd.action==='json'?JSON.stringify(card,null,2):handoffMarkdown(card,cmd.language)};
  }catch(e){return {kind:'error',text:e.message};}
 }});
 ctx.tools.register({name:'handoff_update',description:'Replace the current session handoff checkpoint with explicit goal, progress, next steps, blockers and links. Keeps at most 5 checkpoints for human /handoff undo. Do not include secrets. Claims are unverified. Session memory only, not a file write.',parameters:{type:'object',properties:{goal:{type:'string'},progress:{type:'array',items:{type:'string'}},next:{type:'array',items:{type:'string'}},blockers:{type:'array',items:{type:'string'}},links:{type:'array',items:{type:'string'}}},required:['goal'],additionalProperties:false},output:{schema:{type:'string'},render:(_args,value)=>[{type:'text',text:value}]},async execute(args,exec){if(exec.signal?.aborted)throw new Error('Tool call cancelled.');const session=sessionOf(exec.agent),card=normalizeCard(args);histories.set(session,pushCheckpoint(state(session),card));return 'Handoff checkpoint saved in session memory (up to 5 revisions). Use /handoff show or /handoff json to export before restart; /handoff undo restores the previous checkpoint.';}});
}
