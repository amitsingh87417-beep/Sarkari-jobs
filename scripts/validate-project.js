const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const errors = [];
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]); }
for (const file of walk(path.join(root, 'public')).filter(f => f.endsWith('.js')).concat([path.join(root, 'server.js')])) {
  try { execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }); }
  catch (e) { errors.push(`JavaScript syntax error: ${path.relative(root, file)}\n${e.stderr?.toString() || e.message}`); }
}
for (const file of walk(path.join(root, 'data')).filter(f => f.endsWith('.json')).concat([path.join(root, 'public/papers/manifest.json')])) {
  try { JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { errors.push(`Invalid JSON: ${path.relative(root, file)} — ${e.message}`); }
}
const states = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];
const uts = ['Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'];
for (const f of ['public/index.html','public/admin.html','server.js']) { const s=fs.readFileSync(path.join(root,f),'utf8'); for(const n of [...states,...uts]) if(!s.includes(n)) errors.push(`${f} missing region: ${n}`); }
const jobsRaw=JSON.parse(fs.readFileSync(path.join(root,'data/jobs.json'),'utf8'));
const jobs=Array.isArray(jobsRaw)?jobsRaw:jobsRaw.jobs;
const questions=JSON.parse(fs.readFileSync(path.join(root,'data/practice-question-bank.json'),'utf8'));
if (!Array.isArray(jobs) || !jobs.length) errors.push('Job data is empty or invalid.');
if (!Array.isArray(questions) || !questions.length) errors.push('Question bank is empty or invalid.');
for (const [i,q] of questions.entries()) if(!q.question || !Array.isArray(q.options) || q.options.length<2 || !Number.isInteger(q.answer) || q.answer<0 || q.answer>=q.options.length) errors.push(`Invalid question bank entry at index ${i}.`);
for (const f of ['public/job.html','public/job.js','public/language.js','render.yaml','FINAL-DEPLOYMENT-CHECKLIST.md']) if(!fs.existsSync(path.join(root,f))) errors.push(`Required release file missing: ${f}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Validation passed: JavaScript syntax, JSON files, ${states.length} states, ${uts.length} UTs, ${jobs.length} job records, ${questions.length} valid practice questions.`);
console.log('Note: Live server/API checks require npm install and configured Render environment variables.');
