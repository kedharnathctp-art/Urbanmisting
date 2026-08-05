import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetDirs = ['./src/app', './src/components'];

targetDirs.forEach(dir => {
  walkDir(dir, (filePath) => {
    if (filePath.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;

      // Replace extremely expensive GPU blur with standard blur
      content = content.replace(/backdrop-blur-xl/g, "backdrop-blur-md");
      // Increase opacity slightly to compensate for reduced blur contrast
      content = content.replace(/bg-background\/10/g, "bg-background/20");

      if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Optimized ${filePath}`);
      }
    }
  });
});
