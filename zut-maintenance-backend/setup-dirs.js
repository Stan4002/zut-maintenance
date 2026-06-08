const fs = require('fs');
const path = require('path');

const dirs = ['db', 'routes', 'middleware', 'uploads'];

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

console.log('Folder structure created successfully');
