import { fileURLToPath } from 'url';
import path from 'path';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

__dirname = __dirname.replace('services', 'entry');

export default async function segmentsService(argv) {
  const { segments } = argv;
  let { arquivo } = argv;
  const seg = segments.toUpperCase();

  if (arquivo && !arquivo.toLowerCase().endsWith('.rem')) {
    arquivo += '.rem';
  }

  const file = path.resolve(`${__dirname}/${arquivo || 'cnabExample.rem'}`);

  const messageLog = (segmentoType, cnabFilteredArray) => {
    console.log(`
    * Arquivo CNAB${!arquivo ? ' Padrão' : `: ${arquivo}`} *

    ----- Segmento ${segmentoType} -----
    `);

    for (const lineArr of cnabFilteredArray) {
      console.log(lineArr);
    }

    return `
    ----- FIM -----
    `;
  };

  try {
    console.time('leitura Async');
    const content = await readFile(file, 'utf8');
    const cnabArray = content.split('\n');

    const cnabFilteredArray = [];
    for (const cnabLine of cnabArray) {
      if (cnabLine[13] === seg) cnabFilteredArray.push(cnabLine);
    }

    if (seg === 'P') return console.log(messageLog('P', cnabFilteredArray));
    if (seg === 'Q') return console.log(messageLog('Q', cnabFilteredArray));
    if (seg === 'R') return console.log(messageLog('R', cnabFilteredArray));

    console.log(`Segmento "${segmento}" inválido. Use "p", "q" ou "r".`);
  } catch (error) {
    console.error('Erro ao ler o arquivo:', error.message);
  } finally {
    console.timeEnd('leitura Async');
  }
}
