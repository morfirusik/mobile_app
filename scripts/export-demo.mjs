import { readFile, writeFile } from 'node:fs/promises';
const html = await readFile('dist/index.html', 'utf8');
const jsPath = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/)?.[1];
const cssPath = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/)?.[1];
if (!jsPath || !cssPath) throw new Error('Expected one Vite JavaScript and CSS bundle.');
const js = await readFile(`dist/${jsPath.replace(/^\.\//, '')}`, 'utf8');
const css = await readFile(`dist/${cssPath.replace(/^\.\//, '')}`, 'utf8');
const favicon = await readFile('public/favicon.svg', 'utf8');
const standalone = html
  .replace(
    /<script type="module" crossorigin src="[^"]+"><\/script>/,
    () => `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`,
  )
  .replace(/<link rel="stylesheet" crossorigin href="[^"]+">/, () => `<style>${css}</style>`)
  .replace('./favicon.svg', `data:image/svg+xml;base64,${Buffer.from(favicon).toString('base64')}`);
await writeFile('dist/Shymkent-Run.html', standalone);
console.log('Standalone offline presentation: dist/Shymkent-Run.html');
