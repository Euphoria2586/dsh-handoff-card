import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeCard,parseCard,parseCommand} from '../src/engine.mjs';

test('a full checkpoint with quoted text survives JSON and DSH command roundtrips',()=>{
  const items=Array.from({length:12},()=> '"'.repeat(500));
  const card=normalizeCard({goal:'Keep the supplied notes',progress:items,next:items,blockers:items});
  const text=JSON.stringify(card,null,2);
  assert.deepEqual(parseCard(text),card);
  assert.deepEqual(parseCommand('set '+text).card,card);
});

test('UTF-8 size checks reject oversize without reflecting content',()=>{
  assert.throws(()=>parseCard('中'.repeat(44000)),/128 KiB/);
  assert.throws(()=>parseCard('{private-note}'),e=>e.message==='Invalid card JSON.');
});
