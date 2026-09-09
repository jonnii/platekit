import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const run=promisify(execFile);
await Promise.all(process.argv.slice(2).map(async state=>{
 const old=JSON.parse(await readFile(`/tmp/plate-70/baseline/${state.toLowerCase()}-plate-report.json`,'utf8'));
 const out=`/tmp/plate-70/after/${state}`; await mkdir(out,{recursive:true});
 try {await run(process.execPath,['run','scripts/compare-plate.tsx',`--state=${state}`,`--reference=${old.settings.referencePath}`,`--output-dir=${out}`],{maxBuffer:2e6});}
 catch(e){console.log(state,String(e));return;}
 const candidate=`${out}/${state.toLowerCase()}-plate-report.json`;
 const r=JSON.parse(await readFile(candidate,'utf8'));
 console.log(state,old.metrics.agreement.pixelAgreement.toFixed(2),'->',r.metrics.agreement.pixelAgreement.toFixed(2),'shape',r.metrics.agreement.shapeAgreement?.toFixed(1));
 try {const x=await run(process.execPath,['run','scripts/check-plate-regression.ts',`--baseline=/tmp/plate-70/baseline/${state.toLowerCase()}-plate-report.json`,`--candidate=${candidate}`],{maxBuffer:2e6}); await writeFile(`${out}/gates.txt`,x.stdout);console.log(state,'gates passed');}
 catch(e){const x=e as {stdout:string};await writeFile(`${out}/gates.txt`,x.stdout);console.log(state,x.stdout.split('\n').filter(l=>l.startsWith('  - ')).join('\n'));}
}));
