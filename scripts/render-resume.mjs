// Saves the printable résumé (/resume) as public/oguz-akkas-resume.pdf, the file
// behind its "Download PDF" button. Run after editing data/profile.ts:
//   npm run resume:pdf
// Builds the site, serves it locally, and prints the page with headless Chrome.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { build, preview } from 'vite';

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUTPUT = 'public/oguz-akkas-resume.pdf';
const PORT = 4183;

process.chdir(new URL('..', import.meta.url).pathname);
await build({ logLevel: 'warn' });
const server = await preview({ logLevel: 'warn', preview: { port: PORT, strictPort: true } });
try {
  // Async, so this process can keep serving the page while Chrome loads it
  await promisify(execFile)(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--virtual-time-budget=5000', // lets the web font load before printing
    `--print-to-pdf=${OUTPUT}`,
    `http://localhost:${PORT}/resume`,
  ], { timeout: 60_000 });
  console.log(OUTPUT);
} finally {
  await server.close();
}
