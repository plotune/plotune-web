const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs'),os=require('node:os'),path=require('node:path');const {execFileSync}=require('node:child_process');
const {validateMedia}=require('./media.cjs');
test('media gate rejects oversized/incorrect duration and a secret visible in encoded frames',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'media-canary-'));const run=args=>execFileSync('ffmpeg',['-v','error','-y',...args],{stdio:'pipe'});
 try {
  const video=path.join(dir,'canary.mp4'),poster=path.join(dir,'canary.webp');
  run(['-f','lavfi','-i','color=c=white:s=1280x720:r=1','-t','1','-c:v','libx264','-pix_fmt','yuv420p',video]);
  run(['-i',video,'-frames:v','1',poster]);assert.throws(()=>validateMedia(dir,'canary'),/duration/);
  run(['-f','lavfi','-i','color=c=white:s=1280x720:r=1','-vf',"drawtext=text='secret=syntheticcanaryvalue':fontsize=42:fontcolor=black:x=80:y=200",'-t','8','-c:v','libx264','-pix_fmt','yuv420p',video]);
  assert.throws(()=>validateMedia(dir,'canary'),/Publication blocked/);
 } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
