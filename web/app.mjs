import {SAMPLE,normalizeCard,parseCard,handoffMarkdown,handoffSVG,createCheckpointHistory,pushCheckpoint,undoCheckpoint,currentCheckpoint} from './src/engine.mjs';
const ZH={
"Leave tomorrow-you a starting point":"让明天的自己，少猜一点。","Change the goal and next step, then save a checkpoint. Download the card before closing this tab.":"写清目标和下一步，点“保存交接卡”更新预览。写乱了可以恢复已保存内容；关页前记得下载。","Write a next step ↓":"写一句下一步 ↓",

'Restore saved notes':'恢复已保存内容','Copy DSH command':'复制 DSH 命令',
'Unsaved edits. The preview below is your last saved card.':'还没保存。下面显示的是上一次保存的交接卡。',
'Saved notes restored. Your checkpoint history is unchanged.':'已恢复保存的内容，检查点历史没有改变。',
'Command copied. Paste it into your DSH chat when ready.':'命令已复制，可以粘贴到 DSH 对话中。',
'Copy is unavailable here. The command is selected; use your system Copy action.':'无法自动复制。已选中命令，请用系统复制操作。',

'DSH HANDOFF CARD':'DSH 交接卡','NATIVE PLUGIN / 0.2.1-RC.2':'原生插件 / 0.2.1-RC.2','FOR YOUR NEXT SELF. OR YOUR NEXT AGENT.':'留给下一位自己，或下一位 AGENT。',
'Leave a good':'留下清楚的','next step.':'下一步。','Turn an explicit checkpoint into a handoff worth keeping.':'写下做到哪了，下次接着做。','Goal. Progress. Blockers. What happens next.':'记下目标、进展、卡点，还有下一步。',
'OFFLINE CARD STUDIO · Synthetic demo notes. Not connected to a running DSH session.':'离线卡片工作台 · 示例内容为合成数据，没有连接正在运行的 DSH。',
'Write the checkpoint':'记录检查点','Demo ↗':'示例 ↗','The goal':'目标','Progress · one item per line':'进展 · 每行一项','Next · one item per line':'下一步 · 每行一项','Blockers · one item per line':'阻塞 · 每行一项','Links · HTTP(S), one per line':'链接 · HTTP(S)，每行一条','Save handoff card':'保存交接卡',
'Import card JSON':'导入卡片 JSON','Paste an exported card':'粘贴已导出的卡片','Load card':'加载卡片','Install the native DSH plugin':'安装 DSH 原生插件',
'The plugin adds':'插件提供','and model tool':'和模型工具','. Checkpoints live in session memory. Export before restart or plugin reload.':'。检查点仅在会话内存中；重启或重载前请导出。',
'Showing the card or using the model tool can leave content in DSH\'s own logs. Avoid secrets. Clear removes plugin memory, not prior host history.':'展示卡片或使用模型工具可能在 DSH 日志中留下内容，请勿包含秘密。清除只删除插件内存，不删除先前宿主历史。',
'CHECKPOINT / 001':'检查点 / 001','PASS IT FORWARD ↗':'把下一步传下去 ↗','THE GOAL':'目标','Explicit notes. Verify claims before resuming.':'明确提供的记录。继续前请核实其中的声明。',
'JSON ↓':'JSON ↓','Markdown ↓':'中文 Markdown ↓','Card SVG ↓':'卡片 SVG ↓','Paste this command into your DSH chat':'将此命令粘贴到你的 DSH 对话',
'The command is prepared locally. It is never sent automatically. Review the notes, especially links, before copying.':'命令仅在本地生成，不会自动发送。复制前请检查内容，尤其是链接。',
'No transcript mining. No invented progress.':'不挖掘对话，不虚构进展。','The card contains only the fields supplied by you or your model.':'卡片仅包含你或模型明确提供的字段。',
'INDEPENDENT COMMUNITY PLUGIN · NOT AFFILIATED WITH DEEPSEEK':'独立社区插件 · 与 DEEPSEEK 无隶属关系','Native extension contract ↗':'原生插件接口约定 ↗',
'Undo checkpoint':'撤销到上一检查点','Clear cards & history':'清除卡片与全部历史','Recent checkpoints':'最近的检查点',
'Keeps up to 5 checkpoints in this tab. Undo discards the latest version and unsaved form edits; no redo. Export before closing.':'本标签页最多保留 5 次检查点。撤销会丢弃最新版本与未保存的表单编辑，不支持重做。关闭前请导出。',
'PROGRESS':'进展','NEXT':'下一步','BLOCKERS':'阻塞','LINKS':'链接','None recorded.':'暂无记录。','No checkpoint yet':'尚无检查点','(current)':'（当前）',
'Handoff prepared locally. Review before sharing or pasting into DSH.':'检查点已保存在本标签页。分享或粘贴到 DSH 前请检查。',
'Synthetic demo notes loaded. No DSH session is connected.':'已加载合成示例内容，没有连接 DSH 会话。','Notes changed. Save handoff card to save and refresh the preview.':'改好了就点“保存交接卡”，右边会同步更新。',
'Previous checkpoint restored; newer unsaved edits were discarded.':'已恢复上一检查点，未保存的编辑已丢弃。','All in-tab checkpoints and input cleared. Previously downloaded files are unchanged.':'本标签页检查点、历史与输入已清空。此前下载的文件不受影响。',
'Invalid card. Previous preview retained; exports and command disabled. ':'卡片无效：保留此前预览，但已禁用导出并清空命令。','Downloaded: ':'已下载：',
'Card JSON must be under 128 KiB.':'卡片 JSON 不能超过 128 KiB。','Invalid card JSON.':'卡片 JSON 格式无效。','Card must be an object.':'卡片必须是对象。',
'Unknown field. Use goal, progress, next, blockers and links only.':'存在未知字段；仅支持 goal、progress、next、blockers、links。',
'Links must be absolute HTTP(S) URLs.':'链接必须是完整的 HTTP(S) URL。','Links must use HTTP(S) without credentials.':'链接必须使用 HTTP(S)，且不能包含用户名或密码。','No earlier checkpoint to restore.':'没有更早的检查点可恢复。'
};

const $=id=>document.getElementById(id);const initialLanguage=new URLSearchParams(location.search).get('lang');let language=initialLanguage==='zh'?'zh':'en';
const t=text=>language==='zh'?(ZH[text]??text):text;
const staticText=[];
const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
for(let n=walker.nextNode();n;n=walker.nextNode()){if(n.parentElement.closest('script,style,textarea,pre,code,select'))continue;const text=n.nodeValue.trim();if(Object.hasOwn(ZH,text))staticText.push({node:n,en:n.nodeValue,key:text});}
function translatePage(){document.documentElement.lang=language==='zh'?'zh-CN':'en';for(const x of staticText)x.node.nodeValue=language==='zh'?x.en.replace(x.key,ZH[x.key]):x.en;}
let notice={text:'',error:false,suffix:''};
function status(text,error=false,suffix=''){notice={text,error,suffix};renderStatus();}
function renderStatus(){$('status').textContent=t(notice.text)+notice.suffix;$('status').className=notice.error?'error':'';}
function node(tag,cls,text){const e=document.createElement(tag);e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function download(text,name,type){const u=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);status('Downloaded: ',false,name);}

const fields=['progress','next','blockers','links'];let history=createCheckpointHistory(),card=null,valid=false,lastError='';
const SAMPLE_ZH={goal:'发布本地缓存检查器',progress:['解析器与核心规则已实现','18 项回归测试通过（演示数据）'],next:['检查手机端布局','准备发布截图'],blockers:['需要一个真实的脱敏样本'],links:SAMPLE.links};
function form(c){$('goal').value=c?.goal??'';for(const k of fields)$(k).value=c?.[k]?.join('\n')??'';}
function errorText(message){if(language!=='zh')return message;if(ZH[message])return ZH[message];const names={goal:'目标',progress:'进展',next:'下一步',blockers:'阻塞',links:'链接'};let m=message.match(/^(\w+) must be nonempty text up to (\d+) characters\.$/);if(m)return (names[m[1]]??m[1])+'必须是非空文本，最多 '+m[2]+' 个字符。';m=message.match(/^(\w+) must be an array of up to 12 strings\.$/);if(m)return (names[m[1]]??m[1])+'必须是最多 12 项的字符串数组。';return message;}
function render(){
 $('restore-saved').disabled=!card||valid;$('copy-command').disabled=!valid;$('preview-state').textContent=card&&!valid?t('Unsaved edits. The preview below is your last saved card.'):'';
 document.querySelectorAll('.exports button').forEach(b=>b.disabled=!valid);$('command').value=valid?'/handoff set '+JSON.stringify(card):'';
 $('preview-goal').textContent=card?.goal??t('No checkpoint yet');$('preview').replaceChildren();
 if(card)for(const k of fields){const sec=node('section','preview-section');sec.append(node('h3','',t(k.toUpperCase())));if(card[k].length){const ul=node('ul','');for(const v of card[k])ul.append(node('li','',v));sec.append(ul);}else sec.append(node('p','',t('None recorded.')));$('preview').append(sec);}
 $('undo').disabled=history.entries.length<2;$('history-count').textContent=language==='zh'?history.entries.length+' / 5 次检查点':history.entries.length+' / 5 checkpoints';$('history-list').replaceChildren();
 for(const e of [...history.entries].reverse())$('history-list').append(node('li','','#'+e.revision+' '+e.card.goal+(e===history.entries.at(-1)?' '+t('(current)'):'')));
}
function commit(c){history=pushCheckpoint(history,c);card=currentCheckpoint(history);valid=true;lastError='';render();}
function failed(e){valid=false;lastError=e.message;render();status('Invalid card. Previous preview retained; exports and command disabled. ',true,errorText(lastError));}
function build(){try{commit(normalizeCard({goal:$('goal').value,...Object.fromEntries(fields.map(k=>[k,$(k).value.split('\n').map(x=>x.trim()).filter(Boolean)]))}));status('Handoff prepared locally. Review before sharing or pasting into DSH.');}catch(e){failed(e);}}
function sample(){const c=language==='zh'?SAMPLE_ZH:SAMPLE;form(c);commit(c);$('json-input').value=JSON.stringify(c,null,2);status('Synthetic demo notes loaded. No DSH session is connected.');}
$('build').addEventListener('click',build);$('sample').addEventListener('click',sample);
$('import-json').addEventListener('click',()=>{try{const c=parseCard($('json-input').value);form(c);commit(c);status('Handoff prepared locally. Review before sharing or pasting into DSH.');}catch(e){failed(e);}});
for(const id of ['goal',...fields])$(id).addEventListener('input',()=>{valid=false;lastError='';render();status('Notes changed. Save handoff card to save and refresh the preview.');});
$('undo').addEventListener('click',()=>{try{history=undoCheckpoint(history);card=currentCheckpoint(history);form(card);valid=true;lastError='';render();status('Previous checkpoint restored; newer unsaved edits were discarded.');}catch(e){status(e.message,true);}});
$('restore-saved').addEventListener('click',()=>{if(!card)return;form(card);valid=true;lastError='';render();status('Saved notes restored. Your checkpoint history is unchanged.');$('goal').focus();});
$('copy-command').addEventListener('click',async()=>{if(!valid)return;const text=$('command').value;try{if(!navigator.clipboard?.writeText)throw Error('Unavailable');await navigator.clipboard.writeText(text);if(valid&&$('command').value===text)status('Command copied. Paste it into your DSH chat when ready.');}catch{if(valid&&$('command').value===text){$('command').focus();$('command').select();status('Copy is unavailable here. The command is selected; use your system Copy action.');}}});
$('clear-history').addEventListener('click',()=>{history=createCheckpointHistory();card=null;valid=false;lastError='';form(null);$('json-input').value='';render();status('All in-tab checkpoints and input cleared. Previously downloaded files are unchanged.');});
$('language').addEventListener('change',()=>{language=$('language').value;translatePage();render();if(notice.error&&lastError)notice.suffix=errorText(lastError);renderStatus();});
$('export-json').addEventListener('click',()=>valid&&download(JSON.stringify(card,null,2),'dsh-handoff.json','application/json'));
$('export-md').addEventListener('click',()=>valid&&download(handoffMarkdown(card,language),'dsh-handoff.md','text/markdown'));
$('export-svg').addEventListener('click',()=>valid&&download(handoffSVG(card,language),'dsh-handoff.svg','image/svg+xml'));
$('language').value=language;translatePage();sample();
