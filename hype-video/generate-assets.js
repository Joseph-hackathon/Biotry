const fs = require('fs');
const path = require('path');

const assets = [
    { name: 'TAPESTRY_BASE64', file: 'tapestry.png' },
    { name: 'UMBRA_BASE64', file: 'umbra.png' },
    { name: 'BIOTRY_BASE64', file: 'biotry.png' }
];

let output = '';

assets.forEach(asset => {
    const filePath = path.join(__dirname, 'src', 'assets', asset.file);
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        const base64 = data.toString('base64');
        output += `export const ${asset.name} = 'data:image/png;base64,${base64}';\n`;
    } else {
        output += `export const ${asset.name} = ''; // FILE NOT FOUND: ${filePath}\n`;
    }
});

fs.writeFileSync(path.join(__dirname, 'src', 'logoData.ts'), output);
console.log('Successfully generated src/logoData.ts');
