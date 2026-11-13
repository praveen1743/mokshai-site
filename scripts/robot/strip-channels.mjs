// Keeps only the animation channels each clip was authored with.
// Blender's glTF exporter writes every bone into every NLA-track clip; left in,
// the clips could not be layered (Float would pin the arms Idle moves).
// Usage: node scripts/robot/strip-channels.mjs <in.glb> <channels.json> <out.glb>
import { readFileSync } from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune } from '@gltf-transform/functions';

const [input, channelsFile, output] = process.argv.slice(2);
const authored = JSON.parse(readFileSync(channelsFile, 'utf8'));
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(input);
let kept = 0, removed = 0;
for (const anim of doc.getRoot().listAnimations()) {
  const allow = authored[anim.getName()];
  if (!allow) throw new Error(`No channel list for clip ${anim.getName()}`);
  for (const ch of anim.listChannels()) {
    const bone = ch.getTargetNode()?.getName() ?? '';
    if ((allow[bone] ?? []).includes(ch.getTargetPath())) { kept++; continue; }
    const sampler = ch.getSampler();
    ch.dispose();
    if (sampler && sampler.listParents().every((p) => p === anim)) sampler.dispose();
    removed++;
  }
  console.log(`${anim.getName()}: ${anim.listChannels().length} channels`);
}
await doc.transform(prune());
await io.write(output, doc);
console.log(`kept ${kept}, removed ${removed} channels -> ${output}`);
