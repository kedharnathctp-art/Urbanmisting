import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const images = [
  "/images/bg/bengaluru_portfolio_leela_1785839941054.jpg",
  "/images/bg/bengaluru_portfolio_villa_1785839955895.jpg",
  "/images/bg/industry_commercial_1785839273851.jpg",
  "/images/bg/industry_residential_1785839293129.jpg",
  "/images/bg/portfolio_brewery_1785839249601.jpg",
  "/images/bg/portfolio_estate_1785839262019.jpg",
  "/images/bg/process_engineering_1785839305145.jpg"
];

let i = 0;

walkDir('./src/app', (filePath) => {
  if (filePath.endsWith('.tsx') && !filePath.includes('layout.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // We will replace `<div className="flex flex-col min-h-screen bg-background">`
    // with `<div className="relative flex flex-col min-h-screen overflow-hidden"><SectionBackground src="..." />`
    
    if (content.includes('bg-background') && !content.includes('SectionBackground')) {
      // Find the first import and inject SectionBackground import
      content = content.replace(/(import .* from ".*";\n)/, '$1import { SectionBackground } from "@/components/layout/section-background";\n');
      
      const img = images[i % images.length];
      i++;
      
      content = content.replace(
        /className="([^"]*?)bg-background([^"]*?)"/g, 
        (match, p1, p2) => {
          return `className="${p1}relative overflow-hidden${p2}"`;
        }
      );
      
      content = content.replace(
        /(<div[^>]*className="[^"]*relative overflow-hidden[^"]*"[^>]*>)/,
        `$1\n      <SectionBackground src="${img}" alt="Cinematic Background" />`
      );
    }
    
    // Replace solid colors with glassmorphism
    content = content.replace(/bg-card/g, "bg-background/10 backdrop-blur-xl");
    content = content.replace(/border-border/g, "border-white/10");
    // Change typography classes to white for contrast on dark backgrounds
    content = content.replace(/text-foreground/g, "text-white");
    content = content.replace(/text-muted-foreground/g, "text-white/80");

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Refactored ${filePath}`);
    }
  }
});
