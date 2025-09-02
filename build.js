// Combines all the js scripts into a single js file for easier loading
// Run with node.js

let fs = require('node:fs');

(async function() {
    const srcDir = './src/js';
    const outFile = './src/main.js';

    let files = await fs.promises.readdir(srcDir);
    let jsFiles = []
    jsFiles.push('gameobject.js')
    for (let f of files) {
        if (f.endsWith('.js') && f !== 'qk.js' && f !== 'gameobject.js') {
            jsFiles.push(f)
        }
    }
    if (files.includes('qk.js')) jsFiles.push('qk.js');

    let combined = '';
    for (let file of jsFiles) {
        let content = await fs.promises.readFile(`${srcDir}/${file}`);
        combined += `\n\n\n//----- File: ${srcDir}/${file} ----- \n\n${content}`;
    }
    await fs.promises.writeFile(outFile, combined, 'utf8');
    console.log(`Combined JS written to ${outFile}`);
})();